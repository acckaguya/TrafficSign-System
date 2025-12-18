import React, { useState } from 'react';
import { ShieldCheck, ArrowRight, User, Lock, KeyRound } from 'lucide-react';
import { userService } from '../services/api';

const LoginPage = ({ onLogin }) => {
  const [isRegistering, setIsRegistering] = useState(false); // 切换登录/注册
  const [formData, setFormData] = useState({ userId: '', password: '', name: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrorMsg(''); // 输入时清除错误
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    try {
      let user;
      if (isRegistering) {
        // 注册逻辑
        if (!formData.name) throw new Error("请输入昵称");
        user = await userService.register(formData.userId, formData.password, formData.name);
        alert("注册成功，请登录！");
        setIsRegistering(false); // 注册成功切回登录
        setIsLoading(false);
        return;
      } else {
        // 登录逻辑
        user = await userService.login(formData.userId, formData.password);
        onLogin(user); // 回调父组件，进入系统
      }
    } catch (err) {
      setErrorMsg(err.message);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl mx-auto flex items-center justify-center mb-4">
            <ShieldCheck className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">
            {isRegistering ? '注册驾驶员账户' : '驾驶舱登录'}
          </h1>
        </div>

        {/* Form */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8 backdrop-blur-xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* User ID Input */}
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase ml-1">用户 ID (唯一标识)</label>
              <div className="relative mt-1">
                <User className="absolute left-4 top-3.5 h-5 w-5 text-slate-500" />
                <input
                  name="userId"
                  type="text"
                  required
                  value={formData.userId}
                  onChange={handleChange}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl py-3 pl-12 text-white focus:border-blue-500 outline-none transition"
                  placeholder="例如: driver_001"
                />
              </div>
            </div>

            {/* Name Input (Register only) */}
            {isRegistering && (
              <div className="animate-in fade-in slide-in-from-top-2">
                <label className="text-xs font-bold text-slate-500 uppercase ml-1">显示昵称</label>
                <div className="relative mt-1">
                  <KeyRound className="absolute left-4 top-3.5 h-5 w-5 text-slate-500" />
                  <input
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl py-3 pl-12 text-white focus:border-blue-500 outline-none"
                    placeholder="例如: 王师傅"
                  />
                </div>
              </div>
            )}

            {/* Password Input */}
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase ml-1">密码</label>
              <div className="relative mt-1">
                <Lock className="absolute left-4 top-3.5 h-5 w-5 text-slate-500" />
                <input
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl py-3 pl-12 text-white focus:border-blue-500 outline-none"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* Error Message */}
            {errorMsg && (
              <div className="text-red-500 text-sm text-center bg-red-500/10 py-2 rounded-lg">
                {errorMsg}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-xl font-bold mt-4 flex items-center justify-center gap-2 transition disabled:opacity-50"
            >
              {isLoading ? '处理中...' : (isRegistering ? '立即注册' : '进入系统')}
              {!isLoading && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>

          {/* Toggle Login/Register */}
          <div className="mt-6 text-center">
            <button 
              onClick={() => setIsRegistering(!isRegistering)}
              className="text-sm text-slate-400 hover:text-white transition"
            >
              {isRegistering ? '已有账号？点此登录' : '没有账号？创建新账户'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;