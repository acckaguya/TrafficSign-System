import React, { useState } from 'react';
import LoginPage from './pages/LoginPage';
import SetupPage from './pages/SetupPage';
import CockpitPage from './pages/CockpitPage';
import ProfilePage from './pages/ProfilePage';
import TripReportModal from './pages/TripReportModal';
import { userService } from './services/api';

const App = () => {
  // 状态初始化：优先从 localStorage 读取用户数据
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('traffic_system_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // 视图初始化
  const [view, setView] = useState(() => {
    return localStorage.getItem('traffic_system_user') ? 'setup' : 'login';
  });

  const [currentPlate, setCurrentPlate] = useState('');

  // 登录逻辑
  const handleLogin = (userData) => {
    console.log("Login Success, User Data:", userData);
    setUser(userData);
    setView('setup');
    localStorage.setItem('traffic_system_user', JSON.stringify(userData));
  };

  // 刷新用户数据
  const refreshUser = async () => {
    if (!user) return;
    try {
      const userData = await userService.getUser(user.id);
      setUser(prev => {
        const newUser = { ...prev, ...userData };
        localStorage.setItem('traffic_system_user', JSON.stringify(newUser));
        return newUser;
      });
    } catch (e) {
      console.warn("Refresh failed", e);
    }
  };

  const handleStartDriving = (plate) => {
    setCurrentPlate(plate);
    setView('driving');
  };

  const handleFinishDriving = async () => {
    await refreshUser();
    setView('report');
  };

  const handleCloseReport = () => {
    setView('profile');
  };

  const handleLogout = () => {
    setUser(null);
    setView('login');
    localStorage.removeItem('traffic_system_user');
  };

  return (
    <>
      {/* 1. 登录页 */}
      {view === 'login' && (
        <LoginPage onLogin={handleLogin} />
      )}

      {/* 2. 驾驶前设置页 (车辆选择) */}
      {view === 'setup' && user && (
        <SetupPage 
          user={user} 
          onStart={handleStartDriving} 
          onRefreshUser={refreshUser}
          // 跳转到个人档案
          onGoToProfile={() => setView('profile')} 
        />
      )}

      {/* 3. 驾驶舱 */}
      {view === 'driving' && user && (
        <CockpitPage 
          user={user} 
          plate={currentPlate} 
          onFinish={handleFinishDriving} 
        />
      )}

      {/* 4. 行程报告 (弹窗 + 档案背景) */}
      {view === 'report' && user && (
        <>
          <ProfilePage 
            user={user} 
            onBack={() => setView('setup')}
            onLogout={handleLogout} 
            onRefreshUser={refreshUser}
          />
          <TripReportModal 
            user={user} 
            onClose={handleCloseReport} 
          />
        </>
      )}

      {/* 5. 个人档案页 */}
      {view === 'profile' && user && (
        <ProfilePage 
          user={user} 
          // 从档案页返回时，回到 Setup 页面
          onBack={() => setView('setup')}
          onLogout={handleLogout} 
          onRefreshUser={refreshUser}
        />
      )}
    </>
  );
};

export default App;