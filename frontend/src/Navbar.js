import React from 'react';
import { Link } from 'react-router-dom';

function Navbar({ isLoggedIn, onLogout }) {
  return (
    <nav style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '10px 20px',
      borderBottom: '1px solid #ddd',
      backgroundColor: '#fff'
    }}>
      {/* 1. 로고 (누르면 홈으로 이동) */}
      <Link to="/" style={{ textDecoration: 'none', color: 'black', fontSize: '24px', fontWeight: 'bold' }}>
        Instagram
      </Link>

      {/* 2. 메뉴들 */}
      <div>
        {isLoggedIn ? (
          // 로그인 했을 때 보이는 메뉴
          <>
            <Link to="/" style={{ marginRight: '15px', textDecoration: 'none', color: 'black' }}>
              🏠 홈
            </Link>
            <Link to="/profile" style={{ marginRight: '15px', textDecoration: 'none', color: 'black' }}>
              👤 마이페이지
            </Link>
            <button 
              onClick={onLogout} 
              style={{ background: 'black', color: 'white', border: 'none', padding: '5px 10px', cursor: 'pointer', borderRadius: '5px' }}
            >
              로그아웃
            </button>
          </>
        ) : (
          // 로그인 안 했을 때 보이는 메뉴
          <Link to="/login" style={{ textDecoration: 'none', color: 'blue' }}>
            로그인
          </Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;