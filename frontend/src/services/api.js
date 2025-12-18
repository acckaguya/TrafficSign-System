const API_BASE = 'http://localhost:8000/api';

export const userService = {
  // 登录
  login: async (userId, password) => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId, password })
    });
    
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.detail || '登录失败');
    }
    return await res.json();
  },

  // 注册
  register: async (userId, password, name) => {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId, password, name })
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.detail || '注册失败');
    }
    return await res.json();
  },

  // 获取用户信息 (用于刷新)
  getUser: async (userId) => {
    const res = await fetch(`${API_BASE}/user/${userId}`);
    if (!res.ok) throw new Error('获取用户信息失败');
    return await res.json();
  },
  
  // 添加车辆
  addVehicle: async (userId, plate) => {
    const res = await fetch(`${API_BASE}/vehicle/add`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId, plate })
    });
    
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || "添加失败");
    }
    return await res.json();
  },

  // 删除车辆
  deleteVehicle: async (userId, plate) => {
    const res = await fetch(`${API_BASE}/vehicle/delete`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId, plate })
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || "删除失败");
    }
    return await res.json();
  },

  // 提交行程
  submitTrip: async (tripData) => {
    const res = await fetch(`${API_BASE}/trip/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(tripData)
    });
    if (!res.ok) console.error("提交行程失败");
  },

  // 更新用户信息
  updateUser: async (userId, data) => {
    const res = await fetch(`${API_BASE}/user/update`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId, ...data })
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || "更新失败");
    }
    return await res.json();
  }
};