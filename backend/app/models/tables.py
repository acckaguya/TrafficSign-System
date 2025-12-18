from sqlalchemy import Column, String, Integer, ForeignKey, DateTime, Float, Text, Boolean
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.core.database import Base
import uuid

def generate_uuid():
    return str(uuid.uuid4())

# 1. 用户表 (User)
class User(Base):
    __tablename__ = "users"
    
    # 基础信息
    user_id = Column(String, primary_key=True, default=generate_uuid)
    name = Column(String, index=True, nullable=False)
    phone = Column(String, unique=True, nullable=True)
    password = Column(String, nullable=False)
    
    # 业务状态
    credit_score = Column(Integer, default=100)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # 关系定义
    vehicles = relationship("Vehicle", back_populates="owner")
    trips = relationship("TripLog", back_populates="driver")

# 2. 车辆表 (Vehicle)
class Vehicle(Base):
    __tablename__ = "vehicles"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.user_id"), nullable=False)
    plate = Column(String, unique=True, index=True, nullable=False) # 车牌号
    
    owner = relationship("User", back_populates="vehicles")

# 3. 交通标识配置表 (TrafficSign)
class TrafficSign(Base):
    __tablename__ = "traffic_signs"
    
    id = Column(Integer, primary_key=True, index=True)
    class_id = Column(String, unique=True, index=True)
    name = Column(String)
    type = Column(String)
    limit_speed = Column(Integer, nullable=True) # 如果是限速标志，存储限速值
    default_deduction = Column(Integer, default=0) # 默认扣分
    advice = Column(String) # 驾驶建议
    
    # 一个标识可以在多个违规事件中出现
    events = relationship("TripEvent", back_populates="sign")

# 4. 行程日志表 (TripLog)
class TripLog(Base):
    __tablename__ = "trip_logs"
    
    id = Column(String, primary_key=True, default=generate_uuid)
    user_id = Column(String, ForeignKey("users.user_id"), index=True)
    plate = Column(String) 
    
    start_time = Column(DateTime(timezone=True), server_default=func.now())
    end_time = Column(DateTime(timezone=True), nullable=True)
    
    # 统计数据
    total_deduction = Column(Integer, default=0) # 本次行程总扣分
    avg_speed = Column(Float, default=0.0) 
    max_speed = Column(Float, default=0.0) 
    
    driver = relationship("User", back_populates="trips")
    events = relationship("TripEvent", back_populates="trip")

# 5. 行程事件/违规详情表 (TripEvent)
class TripEvent(Base):
    __tablename__ = "trip_events"
    
    id = Column(Integer, primary_key=True, index=True)
    trip_id = Column(String, ForeignKey("trip_logs.id")) # 关联到行程
    sign_id = Column(String, ForeignKey("traffic_signs.class_id"), nullable=True) # 关联到具体标识
    
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
    event_type = Column(String) 
    description = Column(String)
    deduction = Column(Integer) # 本次事件实际扣分
    speed_at_event = Column(Integer) # 发生时的瞬时速度
    
    snapshot_url = Column(String, nullable=True) # 违规截图地址 (可选)
    
    trip = relationship("TripLog", back_populates="events")
    sign = relationship("TrafficSign", back_populates="events")