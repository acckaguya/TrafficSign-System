from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models import tables
from app.schemas import schemas
from datetime import datetime

router = APIRouter()

# --- 用户信息获取 ---
@router.get("/user/{user_id}", response_model=schemas.UserResponse)
def read_user(user_id: str, db: Session = Depends(get_db)):
    user = db.query(tables.User).filter(tables.User.user_id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    formatted_history = []
    
    if user.trips:
        sorted_trips = sorted(user.trips, key=lambda t: t.start_time, reverse=True)
        
        for trip in sorted_trips:
            if trip.events:
                for event in trip.events:
                    formatted_history.append({
                        "date": event.timestamp,
                        "type": event.event_type,
                        "desc": event.description,
                        "deduction": event.deduction,
                        "plate": trip.plate
                    })

    return {
        "id": user.user_id,
        "name": user.name,
        "phone": user.phone,
        "credit_score": user.credit_score,
        "vehicles": [v.plate for v in user.vehicles],
        "history": formatted_history
    }


# 更新用户信息接口
@router.post("/user/update", response_model=schemas.UserResponse)
def update_user(req: schemas.UserUpdate, db: Session = Depends(get_db)):
    user = db.query(tables.User).filter(tables.User.user_id == req.user_id).first()
    
    if not user:
        raise HTTPException(status_code=404, detail="用户不存在")
    
    # 更新字段
    if req.name is not None:
        user.name = req.name
    if req.phone is not None:
        user.phone = req.phone
        
    db.commit()
    db.refresh(user)
    
    # 重新构建返回数据
    formatted_history = []
    if user.trips:
        sorted_trips = sorted(user.trips, key=lambda t: t.start_time, reverse=True)
        for trip in sorted_trips:
            if trip.events:
                for event in trip.events:
                    formatted_history.append({
                        "date": event.timestamp,
                        "type": event.event_type,
                        "desc": event.description,
                        "deduction": event.deduction,
                        "plate": trip.plate
                    })

    return {
        "id": user.user_id,
        "name": user.name,
        "phone": user.phone,
        "credit_score": user.credit_score,
        "vehicles": [v.plate for v in user.vehicles],
        "history": formatted_history
    }

# --- 注册接口 ---
@router.post("/auth/register", response_model=schemas.UserResponse)
def register(user_in: schemas.UserRegister, db: Session = Depends(get_db)):
    existing_user = db.query(tables.User).filter(tables.User.user_id == user_in.user_id).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="该用户ID已被注册")
    
    new_user = tables.User(
        user_id=user_in.user_id,
        password=user_in.password, 
        name=user_in.name,
        credit_score=100 # 初始分满分
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    return {
        "id": new_user.user_id,
        "name": new_user.name,
        "credit_score": new_user.credit_score,
        "vehicles": [],
        "history": []
    }

# --- 登录接口 ---
@router.post("/auth/login", response_model=schemas.UserResponse)
def login(user_in: schemas.UserLogin, db: Session = Depends(get_db)):
    user = db.query(tables.User).filter(tables.User.user_id == user_in.user_id).first()
    
    if not user or user.password != user_in.password:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="用户ID或密码错误",
        )
    
    formatted_history = []
    if user.trips:
        sorted_trips = sorted(user.trips, key=lambda t: t.start_time, reverse=True)
        for trip in sorted_trips:
            if trip.events:
                for event in trip.events:
                    formatted_history.append({
                        "date": event.timestamp,
                        "type": event.event_type,
                        "desc": event.description,
                        "deduction": event.deduction,
                        "plate": trip.plate
                    })

    vehicle_plates = [v.plate for v in user.vehicles]
    
    return {
        "id": user.user_id,
        "name": user.name,
        "credit_score": user.credit_score,
        "vehicles": vehicle_plates,
        "history": formatted_history
    }

# --- 行程提交 ---
@router.post("/trip/submit")
def submit_trip(trip: schemas.TripSubmit, db: Session = Depends(get_db)):
    user = db.query(tables.User).filter(tables.User.user_id == trip.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # 1. 计算本次行程的总扣分/加分
    total_deduction = sum(v.deduction for v in trip.violations)
    
    # 2. 计算新分数并应用[0, 100]的限制
    new_score = user.credit_score - total_deduction
    user.credit_score = max(0, min(100, new_score))

    # 3. 创建行程日志
    new_trip = tables.TripLog(
        user_id=user.user_id,
        plate=trip.plate,
        total_deduction=total_deduction,
        start_time=datetime.now(),
        end_time=datetime.now()
    )
    db.add(new_trip)
    db.flush()

    # 4. 创建违规详情
    for v in trip.violations:
        event = tables.TripEvent(
            trip_id=new_trip.id,
            event_type=v.type,
            description=v.desc,
            deduction=v.deduction,
            timestamp=datetime.now()
        )
        db.add(event)
    
    db.commit()
    return {"status": "success", "new_score": user.credit_score}

# --- 添加车辆 ---
@router.post("/vehicle/add")
def add_vehicle(req: schemas.VehicleCreate, db: Session = Depends(get_db)):
    existing_plate = db.query(tables.Vehicle).filter(tables.Vehicle.plate == req.plate).first()
    if existing_plate:
        raise HTTPException(status_code=400, detail="该车牌号已被注册")

    user = db.query(tables.User).filter(tables.User.user_id == req.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="用户不存在")

    new_vehicle = tables.Vehicle(user_id=req.user_id, plate=req.plate)
    db.add(new_vehicle)
    db.commit()
    
    return {"status": "success", "plate": req.plate}

# --- 删除车辆 ---
@router.post("/vehicle/delete")
def delete_vehicle(req: schemas.VehicleDelete, db: Session = Depends(get_db)):
    vehicle = db.query(tables.Vehicle).filter(
        tables.Vehicle.user_id == req.user_id,
        tables.Vehicle.plate == req.plate
    ).first()

    if not vehicle:
        raise HTTPException(status_code=404, detail="未找到该车辆或无权删除")

    db.delete(vehicle)
    db.commit()

    return {"status": "success", "message": f"车牌 {req.plate} 已删除"}


