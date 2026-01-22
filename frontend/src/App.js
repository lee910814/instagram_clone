import React, { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Login from './Login';
import Signup from './Signup';
import Home from './Home';   // 방금 만든 Home 컴포넌트
import Navbar from './Navbar'; // 아까 만든 Navbar 컴포넌트

function App() {
  const [token, setToken] = useState(null);
  const navigate = useNavigate(); // 페이지 이동을 도와주는 함수

  // 로그인 성공 시 실행되는 함수
  const handleLogin = (receivedToken) => {
    setToken(receivedToken);
    navigate('/'); // 홈 화면으로 이동!
  };

  // 로그아웃 함수
  const handleLogout = () => {
    setToken(null);
    navigate('/login'); // 로그인 화면으로 이동!
  };

  return (
    <div>
      {/* 1. 네비게이션 바는 항상 위에 떠있음 */}
      <Navbar isLoggedIn={!!token} onLogout={handleLogout} />

      {/* 2. 주소에 따라 내용이 바뀌는 부분 */}
      <Routes>
        {/* 홈 화면: 로그인 안 했으면 로그인 페이지로 튕겨냄 */}
        <Route path="/" element={token ? <Home token={token} /> : <Login onLogin={handleLogin} onSwitchToSignup={() => navigate('/signup')} />} />
        
        {/* 로그인 화면 */}
        <Route path="/login" element={<Login onLogin={handleLogin} onSwitchToSignup={() => navigate('/signup')} />} />
        
        {/* 회원가입 화면 */}
        <Route path="/signup" element={<Signup onSwitchToLogin={() => navigate('/login')} />} />
        
        {/* 마이페이지 (아직 안 만들었으니 임시로 글자만) */}
        <Route path="/profile" element={token ? <h2>👤 마이페이지 준비 중...</h2> : <Login onLogin={handleLogin} />} />
      </Routes>
    </div>
  );
}

export default App;