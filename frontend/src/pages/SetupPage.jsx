import React, { useState } from 'react';
import { Activity, Plus, Car, ChevronRight, Trash2, Settings } from 'lucide-react';
import { userService } from '../services/api';

const SetupPage = ({ user, onStart, onRefreshUser, onGoToProfile }) => {
  const vehicles = user.vehicles || [];
  
  // 默认选中第一辆车
  const [selectedPlate, setSelectedPlate] = useState(vehicles[0] || '');
  const [newPlate, setNewPlate] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // 处理添加车辆
  const handleAddVehicle = async () => {
    setErrorMsg('');
    if (newPlate.length < 6) {
      setErrorMsg("车牌号格式不正确 (至少6位)");
      return;
    }
    
    try {
      await userService.addVehicle(user.id, newPlate);
      await onRefreshUser(); 
      setNewPlate('');
      setIsAdding(false);
    } catch (err) {
      setErrorMsg(err.message);
    }
  };

  // 处理删除车辆
  const handleDeleteVehicle = async (e, plateToDelete) => {
    e.stopPropagation();
    if (!window.confirm(`确定要删除车辆 ${plateToDelete} 吗？`)) return;

    try {
      await userService.deleteVehicle(user.id, plateToDelete);
      if (selectedPlate === plateToDelete) setSelectedPlate('');
      await onRefreshUser();
    } catch (err) {
      setErrorMsg(err.message);
      alert(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-800 to-slate-950 text-white animate-in fade-in duration-500">
      <div className="w-full max-w-2xl bg-slate-900/80 backdrop-blur-xl border border-slate-700 rounded-3xl overflow-hidden shadow-2xl">
        
        {/* 顶部标题栏 */}
        <div className="p-8 border-b border-slate-700 bg-gradient-to-r from-slate-900 to-slate-800">
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <Activity className="text-blue-500" /> 驾驶舱预检程序
          </h2>
          <p className="text-slate-400 mt-1 text-sm">请确认驾驶员身份及车辆信息</p>
        </div>
        
        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* 左侧：用户信息 */}
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-2xl font-bold shadow-lg shadow-blue-500/30">
                {user.name?.[0]}
              </div>
              <div>
                <div className="text-lg font-bold">{user.name}</div>
                <div className="text-sm text-slate-400 font-mono">ID: {user.id}</div>
                
                {/* 跳转到个人档案按钮 */}
                <button 
                  onClick={onGoToProfile}
                  className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 mt-2 font-bold transition group"
                >
                  <Settings className="w-3 h-3 group-hover:rotate-45 transition-transform" /> 
                  个人档案 & 设置
                </button>
              </div>
            </div>
            
            <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
              <div className="text-xs text-slate-400 uppercase font-bold">当前信用分</div>
              <div className={`text-4xl font-black mt-1 ${
                  user.credit_score >= 90 ? 'text-green-500' : user.credit_score >= 60 ? 'text-yellow-500' : 'text-red-500'
              }`}>
                {user.credit_score}
              </div>
            </div>
          </div>

          {/* 右侧：车辆管理 */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="text-sm font-bold text-slate-300 uppercase">选择车辆</label>
              <button 
                onClick={() => { setIsAdding(!isAdding); setErrorMsg(''); }} 
                className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 font-bold transition"
              >
                <Plus className="w-3 h-3"/> {isAdding ? '取消' : '新增'}
              </button>
            </div>
            
            {/* 新增车辆输入区域 */}
            {isAdding && (
              <div className="space-y-2 mb-2 animate-in slide-in-from-top-2">
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="车牌号 (如: 沪A·88888)" 
                    value={newPlate}
                    onChange={e => setNewPlate(e.target.value)}
                    className="flex-1 bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none text-white placeholder-slate-500"
                  />
                  <button 
                    onClick={handleAddVehicle} 
                    className="bg-blue-600 px-4 rounded-lg text-sm font-bold hover:bg-blue-500 transition shadow-lg shadow-blue-500/20"
                  >
                    OK
                  </button>
                </div>
                {errorMsg && <p className="text-xs text-red-400 pl-1">{errorMsg}</p>}
              </div>
            )}

            {/* 车辆列表 */}
            <div className="space-y-2 max-h-64 overflow-y-auto pr-2 no-scrollbar">
              {vehicles.length > 0 ? (
                vehicles.map(plate => (
                  <div 
                    key={plate}
                    onClick={() => setSelectedPlate(plate)}
                    className={`p-3 rounded-xl border cursor-pointer transition flex items-center justify-between group ${
                      selectedPlate === plate 
                        ? 'bg-blue-600/20 border-blue-500 text-white' 
                        : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-500'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Car className={`w-5 h-5 ${selectedPlate === plate ? 'text-blue-400' : 'text-slate-500'}`} />
                      <span className="font-mono font-bold tracking-wider">{plate}</span>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      {selectedPlate === plate && <div className="w-2 h-2 bg-blue-500 rounded-full shadow-[0_0_10px_#3b82f6]"></div>}
                      
                      <button 
                        onClick={(e) => handleDeleteVehicle(e, plate)}
                        className="p-1.5 rounded-lg hover:bg-red-500/20 hover:text-red-400 text-slate-600 transition opacity-0 group-hover:opacity-100"
                        title="删除此车辆"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-slate-500 text-sm border-2 border-dashed border-slate-800 rounded-xl">
                  暂无车辆，请先添加
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 底部按钮栏 */}
        <div className="p-6 border-t border-slate-700 flex justify-end bg-slate-900/50">
           <button 
             onClick={() => onStart(selectedPlate)}
             disabled={!selectedPlate}
             className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-blue-500/20 transition-all transform hover:scale-105 active:scale-95"
           >
             启动引擎 <ChevronRight className="w-5 h-5" />
           </button>
        </div>
      </div>
    </div>
  );
};

export default SetupPage;