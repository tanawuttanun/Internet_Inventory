// src/context/AuthContext.tsx
import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<{ name: string; email: string; role: 'admin' | 'user' } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const login = async (email: string, password: string) => {
    // เช็คความยาวรหัสผ่าน
    if (password.length < 6) {
      return { ok: false, message: 'รหัสผ่านต้องมีความยาว 6 ตัวอักษรขึ้นไป' };
    }
    
    // เช็คสิทธิ์ Admin ก่อนเลย
    const isAdmin = email.toLowerCase() === 'admin01';
    
    // ถ้าไม่ใช่ Admin และไม่มีตัว @ ให้ฟ้อง Error
    if (!isAdmin && !email.includes('@')) {
      return { ok: false, message: 'รูปแบบอีเมลไม่ถูกต้อง' };
    }
    
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800)); // จำลองการโหลด
    
    // ล็อกอินสำเร็จ อัปเดตข้อมูลผู้ใช้
    setUser({ 
      name: isAdmin ? 'Admin' : email.split('@')[0], 
      email, 
      role: isAdmin ? 'admin' : 'user' 
    });
    
    setIsLoading(false);
    return { ok: true };
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);