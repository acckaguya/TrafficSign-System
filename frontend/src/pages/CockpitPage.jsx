import React, { useState, useRef, useEffect, useCallback } from 'react';
import { User, Car } from 'lucide-react';
import VideoTelemetry from '../components/VideoTelemetry';
import HeadUpDisplay from '../components/HeadUpDisplay';
import ControlPanel from '../components/ControlPanel';
import { useTelemetrySocket } from '../hooks/useTelemetrySocket';
import { userService } from '../services/api';
import { getSignConfig } from '../config/trafficSigns';

const CockpitPage = ({ user, plate, onFinish }) => {
  const [videoSrc, setVideoSrc] = useState(null);
  
  // 驾驶状态
  const [speed, setSpeed] = useState(0);
  const [steerDirection, setSteerDirection] = useState('straight');
  
  // 道路限制状态
  const [currentLimit, setCurrentLimit] = useState(0);        
  const [minSpeedLimit, setMinSpeedLimit] = useState(0);      
  const [turnBan, setTurnBan] = useState({ left: false, right: false }); 
  const [stopRequired, setStopRequired] = useState(false);    
  
  // UI与反馈
  const [alerts, setAlerts] = useState([]);
  const [detectedObject, setDetectedObject] = useState(null);
  const [driveAdvice, setDriveAdvice] = useState('');

  // Refs
  const tripViolationsRef = useRef([]); 
  const videoComponentRef = useRef(null);
  const isTransmittingRef = useRef(true); 
  const signCooldownRef = useRef({}); 
  const roadStatusTimerRef = useRef(null); 
  
  // 限制生效时间戳 (1s缓冲)
  const restrictionActiveTimeRef = useRef(0);

  // 当前标志周期内的已处罚记录
  // 用于确保同一个标志生效期间，同一种违规只扣一次分
  const currentSignViolationsRef = useRef(new Set());

  // 1. 状态重置
  const resetRoadStatus = () => {
    setCurrentLimit(0);
    setMinSpeedLimit(0);
    setTurnBan({ left: false, right: false });
    setStopRequired(false);
    
  };

  // 2. 违规判定逻辑
  const handleViolation = (type, desc, deduction) => {
    // 检查该类型违规在当前标志周期内是否已经处罚过
    if (currentSignViolationsRef.current.has(type)) {
        return; // 如果已经处罚过，直接忽略，不再扣分
    }

    const now = Date.now();
    const newViolation = {
      type,
      desc,
      deduction,
      date: new Date().toLocaleTimeString(),
      _ts: now
    };

    // 执行扣分
    tripViolationsRef.current.push(newViolation);
    setAlerts([newViolation]); 

    // 标记该类型违规为“已处罚”
    currentSignViolationsRef.current.add(type);

    // UI提示3秒后消失
    setTimeout(() => {
        setAlerts(prev => prev.filter(a => a !== newViolation));
    }, 3000);
  };

  // 3. 实时监控循环
  useEffect(() => {
    // 1秒缓冲期检查
    // if (Date.now() - restrictionActiveTimeRef.current < 1000) {
    //     return;
    // }

    // 3.1 最高限速检查
    if (currentLimit > 0 && speed > currentLimit) {
      handleViolation("OVERSPEED", `超速! 限速${currentLimit}，当前${speed}`, 6);
    }

    // 3.2 最低限速&禁止停车检查
    if (minSpeedLimit > 0) {
        if (speed === 0) {
            handleViolation("ILLEGAL_PARKING", "违规停车! 该路段禁止停车", 3);
        } else if (speed < minSpeedLimit) {
            handleViolation("LOW_SPEED", `车速过低! 最低限速${minSpeedLimit}`, 3);
        }
    }

    // 3.3 强制停车检查
    if (stopRequired && speed > 0) {
      handleViolation("FAILURE_TO_STOP", "未停车! 前方禁止驶入或需停车让行", 6);
    }

    // 3.4 转向检查
    if (steerDirection === 'left' && turnBan.left) {
      handleViolation("ILLEGAL_TURN", "违规左转/掉头", 3);
    }
    if (steerDirection === 'right' && turnBan.right) {
      handleViolation("ILLEGAL_TURN", "违规右转", 3);
    }
  }, [speed, steerDirection, currentLimit, minSpeedLimit, stopRequired, turnBan]);

  // 4. WebSocket 数据处理
  const handleTelemetryData = useCallback((data) => {
    if (data.yolo_result) {
      const { class_id, conf } = data.yolo_result;
      const signInfo = getSignConfig(class_id);
      
      setDetectedObject({ ...signInfo, conf, raw_class: class_id });
      if (conf > 0.4) setDriveAdvice(signInfo.advice);

      // 冷却检测
      const now = Date.now();
      const lastActiveTime = signCooldownRef.current[class_id] || 0;
      if (now - lastActiveTime < 2000) return;

      // 新标志生效，进入新周期
      
      // 1. 更新冷却时间
      signCooldownRef.current[class_id] = now;
      
      // 2. 更新激活时间戳 (1s缓冲)
      restrictionActiveTimeRef.current = now;

      // 新标志出现清空上一轮的违规处罚记录
      // 如果违规，将重新计算一次扣分
      currentSignViolationsRef.current.clear();

      // 3. 倒计时管理
      if (roadStatusTimerRef.current) {
        clearTimeout(roadStatusTimerRef.current);
      }
      resetRoadStatus(); // 先重置，再应用新规则

      // === 规则解析 ===

      // Type A: 限速系列
      if (signInfo.type === 'limit') {
        setCurrentLimit(signInfo.limit);
      }
      else if (signInfo.label.includes("解除") || ['class_18', 'class_19'].includes(class_id)) {
        setDriveAdvice("限速解除");
      }

      // Type B: 禁令系列
      else if (signInfo.type === 'forbid') {
        let newTurnBan = { left: false, right: false };
        switch (class_id) {
            case 'class_8': case 'class_11': case 'class_15': 
                newTurnBan.left = true; break;
            case 'class_9': case 'class_13': 
                newTurnBan.right = true; break;
            case 'class_12': case 'class_14': 
                newTurnBan.left = true; newTurnBan.right = true; break;
            case 'class_16': case 'class_53': case 'class_55': 
                setStopRequired(true); break;
            case 'class_54': 
                setMinSpeedLimit(5); break; 
            default: break;
        }
        setTurnBan(newTurnBan);
      }

      // Type C: 让行/停车系列
      else if (['stop', 'warn'].includes(signInfo.type)) {
          switch (class_id) {
              case 'class_52': case 'class_57': 
                  setStopRequired(true); break;
              case 'class_56': 
                  setCurrentLimit(20); break;
              default: break;
          }
      }

      // Type D: 指示系列
      else if (signInfo.type === 'guide') {
        let newTurnBan = { left: false, right: false };
        switch (class_id) {
            case 'class_21': newTurnBan.left = true; newTurnBan.right = true; break;
            case 'class_20': newTurnBan.left = true; break;
            case 'class_22': case 'class_25': newTurnBan.right = true; break;
            case 'class_24': case 'class_26': newTurnBan.left = true; break;
            case 'class_28': setMinSpeedLimit(20); break;
            case 'class_30': setStopRequired(true); break;
            default: break;
        }
        setTurnBan(newTurnBan);
      }

      // 5秒无操作自动重置
      roadStatusTimerRef.current = setTimeout(() => {
        resetRoadStatus();
      }, 5000);

    } else {
      setDetectedObject(null);
    }
  }, []);

  const { isConnected, sendTelemetry } = useTelemetrySocket(handleTelemetryData);

  // 5. 视频流循环
  useEffect(() => {
    let animationFrameId;
    isTransmittingRef.current = true;
    const loop = () => {
      if (!isTransmittingRef.current) return;
      if (videoSrc && videoComponentRef.current) {
        const frameData = videoComponentRef.current.captureFrame();
        if (frameData && isTransmittingRef.current) {
          sendTelemetry(frameData, speed);
        }
      }
      if (isTransmittingRef.current) {
        animationFrameId = requestAnimationFrame(loop);
      }
    };
    if (videoSrc) loop();
    return () => cancelAnimationFrame(animationFrameId);
  }, [videoSrc, speed, sendTelemetry]);

  // 6. 结束行程
  const handleStopTrip = async () => {
    isTransmittingRef.current = false;
    if (videoComponentRef.current) videoComponentRef.current.pause();
    if (roadStatusTimerRef.current) clearTimeout(roadStatusTimerRef.current);

    if (tripViolationsRef.current.length === 0) {
        tripViolationsRef.current.push({
            type: "PERFECT_DRIVING",
            desc: "完美驾驶奖励：无违规记录",
            deduction: -10,
            date: new Date().toLocaleTimeString()
        });
    }

    await userService.submitTrip({
      user_id: user.id,
      plate: plate,
      violations: tripViolationsRef.current,
      duration: 0 
    });
    
    onFinish();
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setVideoSrc(URL.createObjectURL(file));
      isTransmittingRef.current = true;
      setTimeout(() => videoComponentRef.current?.play(), 100);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-black overflow-hidden text-white">
      {/* 顶部栏 */}
      <div className="h-14 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between px-6 z-30">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-slate-300">
            <User className="w-4 h-4" />
            <span className="font-bold text-sm">{user.name}</span>
          </div>
          <div className="h-4 w-[1px] bg-slate-700"></div>
          <div className="flex items-center gap-2 text-blue-400">
            <Car className="w-4 h-4" />
            <span className="font-mono font-bold tracking-widest border border-blue-500/30 bg-blue-500/10 px-2 py-0.5 rounded">{plate}</span>
          </div>
        </div>
        
        {/* 状态指示器 */}
        <div className="flex gap-4 text-xs font-mono">
            {stopRequired && <span className="text-red-500 font-bold animate-pulse">⛔ 必须停车</span>}
            {currentLimit > 0 && <span className="text-yellow-400 font-bold">⚠️ 限速 {currentLimit}</span>}
            {minSpeedLimit > 0 && <span className="text-blue-400 font-bold">⬇️ 最低速 {minSpeedLimit}</span>}
            {turnBan.left && <span className="text-orange-500 font-bold">↰ 禁左</span>}
            {turnBan.right && <span className="text-orange-500 font-bold">↱ 禁右</span>}
            <span className="text-slate-500">LIVE</span>
        </div>
      </div>

      {/* 主界面 */}
      <div className="flex-1 relative overflow-hidden">
        <div 
          className="w-full h-full transition-transform duration-500 ease-out"
          style={{
            transform: steerDirection === 'left' ? 'perspective(1000px) rotateY(5deg) translateX(20px)' :
                       steerDirection === 'right' ? 'perspective(1000px) rotateY(-5deg) translateX(-20px)' :
                       'none'
          }}
        >
          <VideoTelemetry ref={videoComponentRef} src={videoSrc} onFileSelect={handleFileSelect} />
        </div>

        <HeadUpDisplay 
          currentLimit={currentLimit} 
          alerts={alerts} 
          speed={speed} 
          isConnected={isConnected}
          detectedObject={detectedObject}
          driveAdvice={driveAdvice}
        />
      </div>

      {/* 控制面板 */}
      <ControlPanel 
        speed={speed} 
        onSpeedChange={setSpeed} 
        onStopTrip={handleStopTrip} 
        violationCount={tripViolationsRef.current.length}
        onSteer={setSteerDirection} 
      />
    </div>
  );
};

export default CockpitPage;