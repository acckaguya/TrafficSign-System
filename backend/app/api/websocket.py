from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from app.services.inference import YOLOInference
from datetime import datetime
import json

router = APIRouter()
yolo_service = YOLOInference()

@router.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            data = await websocket.receive_json()
            image_data = data.get("image")
            current_speed = data.get("speed", 0)

            if not image_data:
                continue

            # 运行推理
            detected = yolo_service.detect(image_data, current_speed)
            
            # 构建响应
            response = {
                "status": "ok",
                "yolo_result": detected, # 发送 class_id 给前端
                "server_time": str(datetime.now())
            }
            
            await websocket.send_json(response)
            
    except WebSocketDisconnect:
        print("Client disconnected")