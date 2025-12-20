# 基于YOLO11的智能驾驶舱模拟系统

## 项目简介

本项目是一个集成了 **计算机视觉 (Computer Vision)** 与 **Web 交互** 的综合性驾驶模拟系统。系统通过后端 YOLO11模型实时分析路况视频流，识别交通标识（限速、禁令、指示等），并结合前端模拟的驾驶操作（速度控制、转向控制），实时判定驾驶员行为是否合规。

系统具备完整的用户账户体系、驾驶信用分评估机制（0-100分）、违规记录归档以及实时 HUD (平视显示器) 交互界面。

---

## 核心功能

### 1. 实时感知
* **高精度检测**：基于 `Ultralytics YOLO11` 模型，支持检测 58 种中国标准交通标识。

### 2. 交互式驾驶舱
* **拟真 HUD**：实时显示当前车速、路段限速、识别到的标识图标及 AI 驾驶建议。
* **模拟控制**：
    * **速度滑块**：模拟油门控制 (0-140 km/h)。
    * **方向控制**：模拟左/右转向灯及方向盘操作。
* **视频源支持**：支持上传本地 1080P路况视频进行模拟测试。

### 3. 智能规则引擎
系统内置了交通规则逻辑判定：
* **限速监控**：支持最高限速（超速扣分）与最低限速（龟速行驶扣分）。
* **禁令执行**：禁止左/右转、禁止掉头、禁止超车监测。
* **强制停车**：识别“停车让行”、“禁止驶入”标志，强制要求车速降为 0。


### 4. 用户与数据管理
* **信用分体系**：满分 100 分，违规扣分，无违规行程奖励加分。
* **个人档案**：支持查看历史违规记录（翻页）、车辆管理（新增/删除）、个人信息编辑。
* **数据持久化**：使用PostgreSQL数据库存储用户、车辆、行程日志及违规详情。

---

## 技术栈

| 模块 | 技术选型 | 说明 |
| :--- | :--- | :--- |
| **前端** | React 18 + Vite | 高性能SPA框架 |
| **后端** | Python FastAPI | 高性能异步Web框架 |
| **AI 推理** | Ultralytics YOLO11 | 目标检测模型 |
| **图像处理** | OpenCV + NumPy | 视频流编解码与处理 |
| **通信** | WebSocket | 实时数据传输 |
| **数据库** | PostgreSQL + SQLAlchemy | 关系型数据存储与ORM |

---

## 快速开始

### 环境要求
* Node.js >= 16.0
* Python >= 3.8
* (可选) NVIDIA GPU + CUDA (用于加速推理)

### 1. 后端部署

```bash
# 1. 进入项目根目录
cd backend

# 2. 创建虚拟环境
python -m venv venv
# Windows 激活:
.\venv\Scripts\activate
# Mac/Linux 激活:
source venv/bin/activate

# 3. 安装依赖
pip install -r requirements.txt
# 关键依赖包括: fastapi, uvicorn, ultralytics, opencv-python, sqlalchemy, python-multipart

# 4. 准备模型文件
# 将训练好的权重文件 tsrd_n_best.pt 放入 backend\app

# 5. 配置环境变量
# 创建 .env 文件并写入
# 确保已经创建对应的postgreSQL数据库
DATABASE_URL=postgresql://postgres:password@localhost/databasename

# 6. 启动服务
uvicorn app.main:app --reload
```
### 2. 前端部署
```Bash

# 1. 进入前端目录
cd frontend

# 2. 安装依赖
npm install

# 3. 启动开发服务器
npm run dev
```

### 目结构
```
Project_Root/
├── backend/                  # 后端代码
│   ├── app/
│   │   ├── api/
│   │   │   ├── endpoints.py  # HTTP 路由 (登录/注册/数据查询)
│   │   │   └── websocket.py  # WS 路由 (实时推理)
│   │   ├── core/
│   │   │   └── database.py   # 数据库连接
│   │   ├── models/
│   │   │   └── tables.py     # SQLAlchemy 表定义
│   │   ├── schemas/
│   │   │   └── schemas.py    # Pydantic 数据模型
│   │   ├── services/
│   │   │   └── inference.py  # YOLO 推理逻辑封装
│   │   └── main.py           # FastAPI 入口
│   ├── tsrd_n_best.pt        # YOLO 权重文件
│   └── requirements.txt
│
└── frontend/                 # 前端代码
    ├── src/
    │   ├── components/       # 通用组件
    │   ├── config/           # 配置文件
    │   ├── hooks/            # 自定义Hooks
    │   ├── pages/            # 页面组件
    │   ├── services/         # API请求封装
    │   ├── App.jsx           # 路由与全局状态
    │   └── main.jsx          # 入口文件
    ├── index.html
    └── tailwind.config.js
```
