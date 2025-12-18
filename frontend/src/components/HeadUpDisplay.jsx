import React from 'react';
import { AlertTriangle, Navigation, Eye, ScanLine } from 'lucide-react';

// 绘制拟真的交通标志图标
const TrafficSignIcon = ({ config }) => {
  const { type, icon } = config;

  // 1. 限速标志 (红圈白底黑字)
  if (type === 'limit') {
    return (
      <div className="w-14 h-14 bg-white rounded-full border-[5px] border-red-600 flex items-center justify-center shadow-lg">
        <span className="text-black font-black text-xl leading-none font-mono">{icon}</span>
      </div>
    );
  }

  // 2. 警告标志 (黄底黑边三角形)
  if (type === 'warn') {
    return (
      <div className="relative w-14 h-12 flex items-center justify-center drop-shadow-lg">
        {/* 绘制三角形 */}
        <div className="absolute inset-0 w-0 h-0 border-l-[28px] border-l-transparent border-r-[28px] border-r-transparent border-b-[48px] border-b-[#FFD600]"></div>
         {/* 黑色边框模拟*/}
        <div className="absolute top-4 z-10 text-black font-bold text-lg">{icon}</div>
      </div>
    );
  }

  // 3. 禁止/禁令标志 (白底红圈红斜杠)
  if (type === 'forbid') {
    return (
      <div className="w-14 h-14 bg-white rounded-full border-[5px] border-red-600 flex items-center justify-center shadow-lg relative overflow-hidden">
        <span className="text-black font-bold text-2xl">{icon}</span>
        {/* 斜杠 */}
        <div className="absolute w-[120%] h-[4px] bg-red-600 -rotate-45 transform origin-center"></div>
      </div>
    );
  }

  // 4. 指示标志 (蓝底白图)
  if (type === 'guide') {
    return (
      <div className="w-14 h-14 bg-blue-600 rounded-full border-2 border-white flex items-center justify-center shadow-lg text-white">
        <span className="font-bold text-2xl">{icon}</span>
      </div>
    );
  }

  // 5. 停车/停止 (八角形或红底)
  if (type === 'stop') {
    return (
      <div className="w-14 h-14 bg-red-600 text-white rounded-full flex items-center justify-center border-2 border-white font-bold text-lg shadow-lg">
        {icon}
      </div>
    );
  }

  // 默认
  return (
    <div className="w-12 h-12 bg-slate-700 rounded-lg flex items-center justify-center border-2 border-slate-500 text-white font-bold">
      {icon}
    </div>
  );
};

const HeadUpDisplay = ({ currentLimit, alerts, speed, isConnected, detectedObject, driveAdvice }) => {
  return (
    <div className="absolute inset-0 pointer-events-none p-6 md:p-8 flex flex-col justify-between z-20">
      
      {/* 顶部栏 */}
      <div className="flex justify-between items-start">
        {/* 系统状态 */}
        <div className="bg-black/40 backdrop-blur px-4 py-2 rounded-xl border border-white/10 text-white">
          <div className="text-[10px] uppercase opacity-60 tracking-wider">System Status</div>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
            <span className="font-mono text-sm font-bold">{isConnected ? 'ONLINE' : 'OFFLINE'}</span>
          </div>
        </div>

        {/* 右上角：YOLO 识别结果卡片 */}
        <div className="flex flex-col items-end gap-2 transition-all duration-300">
          {detectedObject ? (
            <div className="bg-slate-900/90 backdrop-blur-md border border-blue-500/30 p-4 rounded-2xl animate-in slide-in-from-right duration-300 shadow-[0_0_30px_rgba(59,130,246,0.2)] max-w-[200px]">
              
              <div className="flex items-center gap-2 text-blue-400 text-[10px] font-bold uppercase mb-3 tracking-widest border-b border-blue-500/20 pb-1">
                <ScanLine className="w-3 h-3 animate-pulse" /> AI Detected
              </div>

              <div className="flex items-center gap-4">
                {/* 动态交通标志图标 */}
                <TrafficSignIcon config={detectedObject} />
                
                <div className="text-right flex-1 min-w-0">
                  <div className="text-white font-bold text-lg leading-tight truncate">{detectedObject.label}</div>
                  <div className="text-slate-400 text-xs font-mono mt-1">
                    Conf: {(detectedObject.conf * 100).toFixed(0)}%
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-black/20 backdrop-blur border border-white/5 px-4 py-2 rounded-xl text-slate-500 text-xs flex items-center gap-2">
              <Eye className="w-3 h-3" /> Scanning Road...
            </div>
          )}
        </div>
      </div>

      {/* 屏幕中央：严重违规警报*/}
      <div className="self-center absolute top-1/3 w-full flex justify-center pointer-events-none">
        {alerts.length > 0 && (
          <div className="bg-red-600/95 text-white px-8 py-6 rounded-3xl shadow-[0_0_50px_rgba(220,38,38,0.6)] border-4 border-red-400 flex items-center gap-6 animate-bounce">
            <div className="bg-white text-red-600 p-3 rounded-full">
               <AlertTriangle className="w-8 h-8" />
            </div>
            <div className="text-left">
              <div className="text-3xl font-black uppercase tracking-wider italic">{alerts[0].type}</div>
              <div className="text-red-100 font-bold text-lg">{alerts[0].desc}</div>
            </div>
          </div>
        )}
      </div>

      {/* 底部栏 */}
      <div className="flex items-end justify-between w-full relative">
        {/* 左下角：速度表 */}
        <div className="relative">
          <div className="text-xs text-slate-300 opacity-80 uppercase font-bold pl-1">Speed (km/h)</div>
          <div className={`text-8xl font-black font-mono tracking-tighter leading-none transition-colors duration-300 ${
            currentLimit > 0 && speed > currentLimit ? 'text-red-500 drop-shadow-[0_0_20px_rgba(239,68,68,0.8)]' : 'text-white'
          }`}>
            {speed}
          </div>
          {/* 显示当前限速辅助标 */}
          {currentLimit > 0 && (
            <div className="absolute -right-12 top-2 bg-white text-black border-4 border-red-600 rounded-full w-10 h-10 flex items-center justify-center font-bold text-sm">
              {currentLimit}
            </div>
          )}
        </div>

        {/* 中下方：驾驶建议 */}
        {driveAdvice && (
          <div className="absolute left-1/2 -translate-x-1/2 bottom-10 w-full max-w-md text-center">
            <div className="inline-flex items-center gap-3 bg-slate-900/80 backdrop-blur-xl border border-blue-500/30 px-6 py-4 rounded-full shadow-2xl animate-in fade-in slide-in-from-bottom-4">
              <div className="bg-blue-600 p-1.5 rounded-full text-white shadow-lg shadow-blue-500/50">
                <Navigation className="w-4 h-4" />
              </div>
              <span className="text-white font-bold text-lg tracking-wide text-shadow-sm">{driveAdvice}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HeadUpDisplay;