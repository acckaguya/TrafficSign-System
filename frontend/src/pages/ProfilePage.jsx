import React, { useState } from 'react';
import { 
  ChevronRight, LogOut, Shield, MapPin, 
  AlertTriangle, User, Phone, Edit3, Save, 
  ChevronLeft, ChevronRight as ChevronRightIcon 
} from 'lucide-react';
import { userService } from '../services/api';

const ITEMS_PER_PAGE = 5; // 每页显示的违规记录数

const ProfilePage = ({ user, onBack, onLogout, onRefreshUser }) => {
  // 状态管理
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: user.name || '',
    phone: user.phone || ''
  });
  
  const [currentPage, setCurrentPage] = useState(1);
  const [isSaving, setIsSaving] = useState(false);

  // 翻页计算逻辑
  const history = user.history || [];
  const totalPages = Math.ceil(history.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  // 切片获取当前页数据
  const currentHistory = history.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // 事件处理
  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // 1. 调用后端接口更新数据库
      await userService.updateUser(user.id, {
        name: editForm.name,
        phone: editForm.phone
      });
      
      // 2. 通知父组件 App.jsx 刷新全局用户状态
      if (onRefreshUser) {
        await onRefreshUser();
      }
      
      setIsEditing(false);
      alert("个人信息更新成功！");
    } catch (err) {
      alert("更新失败: " + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 md:p-8 text-slate-800 dark:text-slate-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* 顶部导航 */}
        <div className="flex justify-between items-center">
           <button onClick={onBack} className="text-slate-500 hover:text-blue-500 flex items-center gap-1 font-bold transition group">
            <ChevronRight className="w-4 h-4 rotate-180 group-hover:-translate-x-1 transition-transform" /> 返回驾驶舱
          </button>
          <button onClick={onLogout} className="text-red-500 hover:bg-red-50 px-3 py-1 rounded-lg flex items-center gap-1 text-sm font-bold transition">
            <LogOut className="w-4 h-4" /> 注销
          </button>
        </div>

        {/* 上半部分：驾驶员信息卡*/}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* 左侧：头像与分数 */}
          <div className="md:col-span-1 bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-xl border border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center text-center relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-blue-600/20 to-transparent"></div>
             
             <div className="relative w-28 h-28 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-5xl font-bold text-white shadow-lg mb-4 ring-4 ring-white dark:ring-slate-800">
                {user.name?.[0]}
             </div>
             
             <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">安全信用分</div>
             <div className={`text-6xl font-black ${
                user.credit_score >= 90 ? 'text-green-500' : 
                user.credit_score >= 60 ? 'text-yellow-500' : 'text-red-500'
              }`}>
                {user.credit_score}
             </div>
             <div className="mt-4 inline-flex items-center gap-1 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-500">
                <Shield className="w-3 h-3"/> 认证驾驶员
             </div>
          </div>

          {/* 右侧：详细信息*/}
          <div className="md:col-span-2 bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-xl border border-slate-200 dark:border-slate-800 relative flex flex-col justify-center">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <User className="text-blue-500"/> 驾驶证信息
              </h2>
              <button 
                onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                disabled={isSaving}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition shadow-lg transform active:scale-95 ${
                  isEditing 
                    ? 'bg-green-500 hover:bg-green-600 text-white' 
                    : 'bg-blue-500 hover:bg-blue-600 text-white'
                }`}
              >
                {isSaving ? '保存中...' : (isEditing ? <><Save className="w-4 h-4"/> 保存</> : <><Edit3 className="w-4 h-4"/> 编辑</>)}
              </button>
            </div>

            <div className="space-y-6">
              {/* ID*/}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                    <label className="text-xs font-bold text-slate-400 uppercase block mb-2">驾驶员 ID</label>
                    <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-xl font-mono text-slate-500 select-all border border-transparent truncate">
                      {user.id}
                    </div>
                 </div>
                 <div>
                    <label className="text-xs font-bold text-slate-400 uppercase block mb-2">注册地区</label>
                    <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-xl flex items-center gap-2 text-slate-600 dark:text-slate-400 border border-transparent">
                      <MapPin className="w-4 h-4"/> 中国 · 北京
                    </div>
                 </div>
              </div>

              {/* Name & Phone*/}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                    <label className="text-xs font-bold text-slate-400 uppercase block mb-2">显示昵称</label>
                    {isEditing ? (
                      <input 
                        type="text" 
                        name="name"
                        value={editForm.name}
                        onChange={handleEditChange}
                        className="w-full bg-white dark:bg-slate-950 border-2 border-blue-500 rounded-xl p-3 focus:outline-none focus:ring-4 focus:ring-blue-500/20 transition text-slate-800 dark:text-white"
                      />
                    ) : (
                      <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-xl font-bold text-slate-700 dark:text-slate-200 border border-transparent">
                        {user.name}
                      </div>
                    )}
                 </div>
                 <div>
                    <label className="text-xs font-bold text-slate-400 uppercase block mb-2">联系电话</label>
                    {isEditing ? (
                      <input 
                        type="text" 
                        name="phone"
                        placeholder="未设置"
                        value={editForm.phone}
                        onChange={handleEditChange}
                        className="w-full bg-white dark:bg-slate-950 border-2 border-blue-500 rounded-xl p-3 focus:outline-none focus:ring-4 focus:ring-blue-500/20 transition text-slate-800 dark:text-white"
                      />
                    ) : (
                      <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-xl font-mono text-slate-600 dark:text-slate-400 flex items-center gap-2 border border-transparent">
                        <Phone className="w-4 h-4"/> {user.phone || '未设置'}
                      </div>
                    )}
                 </div>
              </div>
            </div>
          </div>
        </div>

        {/* 下半部分：违规记录*/}
        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col min-h-[400px]">
          <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <AlertTriangle className="text-orange-500"/> 驾驶档案记录
            </h2>
            <div className="text-xs font-bold bg-slate-200 dark:bg-slate-800 px-2 py-1 rounded text-slate-500">
              共 {history.length} 条记录
            </div>
          </div>
          
          <div className="flex-1 overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 dark:bg-slate-950 text-slate-500 text-xs uppercase font-bold">
                <tr>
                  <th className="p-4 whitespace-nowrap">时间</th>
                  <th className="p-4 whitespace-nowrap">车辆</th>
                  <th className="p-4 whitespace-nowrap">类型</th>
                  <th className="p-4 w-full">详情描述</th>
                  <th className="p-4 text-right whitespace-nowrap">分值变动</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
                {currentHistory.length > 0 ? (
                  currentHistory.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                      <td className="p-4 text-slate-500 font-mono whitespace-nowrap">{item.date}</td>
                      <td className="p-4 font-bold font-mono whitespace-nowrap">{item.plate}</td>
                      <td className={`p-4 font-bold whitespace-nowrap ${item.deduction < 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {item.type}
                      </td>
                      <td className="p-4 text-slate-600 dark:text-slate-400 max-w-xs truncate" title={item.desc}>
                        {item.desc}
                      </td>
                      <td className={`p-4 text-right font-black font-mono ${item.deduction < 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {item.deduction < 0 ? `+${Math.abs(item.deduction)}` : `-${item.deduction}`}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="p-12 text-center text-slate-400">
                      <div className="flex flex-col items-center gap-2 pt-10">
                        <Shield className="w-8 h-8 opacity-20"/>
                        <span>暂无违规记录，保持良好的驾驶习惯！</span>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* 分页控制器 */}
          {history.length > 0 && (
            <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-950 select-none">
               <button 
                 onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                 disabled={currentPage === 1}
                 className="p-2 rounded-lg hover:bg-white dark:hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition"
               >
                 <ChevronLeft className="w-5 h-5"/>
               </button>
               
               <div className="text-sm font-bold text-slate-500 font-mono">
                 PAGE {currentPage} / {totalPages}
               </div>
               
               <button 
                 onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                 disabled={currentPage === totalPages}
                 className="p-2 rounded-lg hover:bg-white dark:hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition"
               >
                 <ChevronRightIcon className="w-5 h-5"/>
               </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;