from pydantic import BaseModel
from typing import List, Optional

# --- 基础/车辆相关 ---
class VehicleBase(BaseModel):
    plate: str

class VehicleCreate(VehicleBase):
    user_id: str

# --- 删除车辆的模型 ---
class VehicleDelete(BaseModel):
    user_id: str
    plate: str

# --- 违规/行程相关 ---
class ViolationItem(BaseModel):
    type: str
    desc: str
    deduction: int

class TripSubmit(BaseModel):
    user_id: str
    plate: str
    violations: List[ViolationItem]
    duration: int

# --- 用户/响应相关 ---
class UserResponse(BaseModel):
    id: str
    name: str
    credit_score: int
    vehicles: List[str]
    history: List[dict]
    phone: Optional[str] = None

    class Config:
        from_attributes = True

# --- 认证相关 ---
class UserLogin(BaseModel):
    user_id: str
    password: str

class UserRegister(BaseModel):
    user_id: str
    password: str
    name: str
    
class UserUpdate(BaseModel):
    user_id: str
    name: Optional[str] = None
    phone: Optional[str] = None