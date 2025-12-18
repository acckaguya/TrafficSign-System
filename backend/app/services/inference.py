import base64
import numpy as np
import cv2
from pathlib import Path
import os
import time
import logging
from ultralytics import YOLO

# --- 配置日志 ---
logger = logging.getLogger("inference_service")
logger.setLevel(logging.INFO)

if not logger.handlers:
    handler = logging.StreamHandler()
    formatter = logging.Formatter('%(asctime)s - %(levelname)s - %(message)s')
    handler.setFormatter(formatter)
    logger.addHandler(handler)

class YOLOInference:
    def __init__(self):
        BASE_DIR = Path(__file__).resolve().parent.parent 
        model_path = BASE_DIR / "tsrd_n_best.pt"
        
        logger.info(f"正在初始化模型，路径: {model_path}")
        
        try:
            load_start = time.time()
            # --- 初始化原生 YOLO 模型 ---
            self.model = YOLO(str(model_path))
            
            # self.model.info()
            
            logger.info(f"YOLO11 模型加载成功！耗时: {time.time() - load_start:.2f}s")
        except Exception as e:
            logger.error(f"模型加载失败: {e}")
            self.model = None

    def detect(self, image_b64: str, speed: int):
        if not self.model:
            return None

        try:
            # 1. 解码图片
            if ',' in image_b64:
                image_b64 = image_b64.split(',')[1]
            
            nparr = np.frombuffer(base64.b64decode(image_b64), np.uint8)
            img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
            
            if img is None:
                return None

            h, w = img.shape[:2]
            
            # 2. YOLO推理
            t_infer_start = time.time()
            
            results = self.model.predict(
                source=img,
                imgsz=1280,   # 增大输入分辨率
                conf=0.15,    # 置信度阈值
                iou=0.45,     # NMS IOU 阈值
                verbose=False # 关闭库自带的打印
            )
            
            t_infer_end = time.time()
            infer_cost = t_infer_end - t_infer_start

            detected_obj = None
            
            # 3. 解析结果
            result = results[0]
            boxes = result.boxes

            if len(boxes) > 0:
                # 取置信度最高的一个
                # 找到最大置信度的索引
                max_conf_idx = boxes.conf.argmax().item()
                
                class_id_int = int(boxes.cls[max_conf_idx].item())
                conf = float(boxes.conf[max_conf_idx].item())
                bbox_raw = boxes.xyxy[max_conf_idx].tolist() 
                
                detected_obj = {
                    "class_id": f"class_{class_id_int}", 
                    "conf": round(conf, 2),
                    "bbox": bbox_raw
                }
                
                logger.info(
                    f"[检测成功] 分辨率:{w}x{h} (Infer:1280) | 耗时:{infer_cost*1000:.0f}ms | "
                    f"目标数:{len(boxes)} | 最佳:class_{class_id_int} (Conf:{conf:.2f})"
                )
            else:
                pass
                logger.info(f"[无目标] 耗时:{infer_cost*1000:.0f}ms")

            return detected_obj
            
        except Exception as e:
            logger.error(f"推理异常: {e}")
            import traceback
            logger.error(traceback.format_exc())
            return None