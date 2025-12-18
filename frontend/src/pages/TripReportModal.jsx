import React from 'react'; 
import { Award, AlertTriangle, TrendingUp } from 'lucide-react'; 


const TripReportModal = ({ user, onClose }) => {
  const latestTrip = user.history?.[0]; 
  

  if (!latestTrip) return null;

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white dark:bg-slate-800 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border border-slate-700 text-slate-800 dark:text-white">
        <div className={`p-8 text-center relative overflow-hidden ${
          user.credit_score >= 90 ? 'bg-gradient-to-br from-green-600 to-emerald-800' : 'bg-gradient-to-br from-red-600 to-pink-800'
        }`}>
          <div className="relative z-10">
            <h2 className="text-white/90 text-lg font-medium mb-1">最新安全信用分</h2>
            <div className="text-7xl font-black text-white tracking-tighter">{user.credit_score}</div>
            <div className="mt-4 inline-flex items-center gap-2 bg-white/20 backdrop-blur px-4 py-1.5 rounded-full text-white font-bold border border-white/30">
              <Award className="w-4 h-4" /> {user.credit_score >= 90 ? 'A级优享费率' : '风险费率'}
            </div>
          </div>
        </div>
        <div className="p-6 overflow-y-auto flex-1 bg-slate-50 dark:bg-slate-900">
          <h3 className="font-bold text-sm uppercase opacity-50 mb-3 flex items-center gap-2 text-slate-500">
            <TrendingUp className="w-4 h-4"/> 本次行程违规详情
          </h3>
          <div className="space-y-3 mb-6">
             <div className="flex items-start gap-3 p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
                <div className="bg-red-100 text-red-600 p-2 rounded-lg mt-0.5">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <div className="font-bold text-slate-800 dark:text-slate-200">{latestTrip.type}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{latestTrip.desc}</div>
                  <div className="text-xs text-slate-400 mt-1 font-mono">{latestTrip.date}</div>
                </div>
                <div className="font-mono font-bold text-red-500">-{latestTrip.deduction}</div>
              </div>
          </div>
        </div>
        <div className="p-4 border-t dark:border-slate-700 bg-white dark:bg-slate-800">
          <button onClick={onClose} className="w-full py-3 bg-slate-900 dark:bg-white dark:text-slate-900 text-white font-bold rounded-xl shadow-lg hover:scale-[1.02] transition">确认并归档</button>
        </div>
      </div>
    </div>
  );
};

export default TripReportModal;