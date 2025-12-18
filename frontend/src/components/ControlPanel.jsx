import React from 'react';
import { StopCircle, ArrowLeft, ArrowRight, Zap } from 'lucide-react';

const ControlPanel = ({ speed, onSpeedChange, onStopTrip, violationCount, onSteer }) => {
  return (
    <div className="h-48 bg-slate-900 border-t border-slate-800 p-6 flex items-center gap-8 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] z-30 relative">
      {/* 1. 油门控制 */}
      <div className="w-1/4">
        <div className="text-xs text-slate-500 uppercase font-bold mb-2 flex justify-between">
          <span>Throttle Control</span>
          <span className="text-blue-400">{speed} km/h</span>
        </div>
        <input 
          type="range" min="0" max="140" 
          value={speed} 
          onChange={(e) => onSpeedChange(parseInt(e.target.value))}
          className="w-full h-12 bg-slate-800 rounded-xl appearance-none cursor-pointer overflow-hidden outline-none focus:ring-2 focus:ring-blue-500/50"
          style={{
            background: `linear-gradient(to right, #3b82f6 ${speed/1.4}%, #1e293b ${speed/1.4}%)`
          }}
        />
      </div>

      {/* 2. 转向模拟*/}
      <div className="flex-1 flex justify-center items-center gap-6">
        <button 
          onMouseDown={() => onSteer('left')}
          onMouseUp={() => onSteer('straight')}
          className="w-20 h-20 bg-slate-800 hover:bg-slate-700 active:bg-blue-600 rounded-full border-4 border-slate-700 active:border-blue-400 flex items-center justify-center transition-all transform active:scale-95 shadow-lg group"
        >
          <ArrowLeft className="w-8 h-8 text-slate-400 group-active:text-white" />
        </button>
        
        <div className="text-center space-y-1">
          <div className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Steering</div>
          <div className="w-24 h-1 bg-slate-800 rounded-full overflow-hidden">
             <div className="w-full h-full bg-blue-500/20"></div>
          </div>
        </div>

        <button 
          onMouseDown={() => onSteer('right')}
          onMouseUp={() => onSteer('straight')}
          className="w-20 h-20 bg-slate-800 hover:bg-slate-700 active:bg-blue-600 rounded-full border-4 border-slate-700 active:border-blue-400 flex items-center justify-center transition-all transform active:scale-95 shadow-lg group"
        >
          <ArrowRight className="w-8 h-8 text-slate-400 group-active:text-white" />
        </button>
      </div>

      {/* 3. 状态与结束 */}
      <div className="w-1/4 flex gap-4 justify-end">
        <InfoBox label="本次违规" value={violationCount} color="text-red-400" icon={<Zap className="w-3 h-3"/>} />
        
        <button 
          onClick={onStopTrip} 
          className="bg-red-600 hover:bg-red-700 text-white px-6 rounded-xl font-bold flex flex-col items-center justify-center gap-1 shadow-lg transition active:scale-95 min-w-[100px]"
        >
          <StopCircle className="w-6 h-6" />
          <span className="text-xs">结束行程</span>
        </button>
      </div>
    </div>
  );
};

const InfoBox = ({ label, value, color, icon }) => (
  <div className="bg-slate-800 rounded-xl p-3 border border-slate-700 flex flex-col justify-center min-w-[80px]">
    <div className="text-[10px] text-slate-500 uppercase flex items-center gap-1 mb-1">
      {icon} {label}
    </div>
    <div className={`text-2xl font-mono font-bold ${color}`}>{value}</div>
  </div>
);

export default ControlPanel;