import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  InstagramIcon, HomeIcon, SearchIcon, ExploreIcon, ReelsIcon,
  MessagesIcon, NotificationIcon, PlusSquareIcon, MoreIcon
} from '../Icons';
import CreatePostModal from '../post/CreatePostModal';

function NavItem({ to, icon, label, onClick }) {
  const content = (
    <>
      <span className="sidebar-icon">{icon}</span>
      <span className="sidebar-label">{label}</span>
    </>
  );

  if (onClick) {
    return (
      <button className="sidebar-item" onClick={onClick}>
        {content}
      </button>
    );
  }
  return (
    <NavLink
      to={to}
      end={to === '/'}
      className={({ isActive }) => `sidebar-item${isActive ? ' active' : ''}`}
    >
      {content}
    </NavLink>
  );
}

export default function Sidebar({ onSearch }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showCreate, setShowCreate] = useState(false);
  const [showMore, setShowMore] = useState(false);

  const handleLogout = async () => {
    setShowMore(false);
    await logout();
    navigate('/login');
  };

  return (
    <>
      <nav className="sidebar">
        {/* Logo — 다른 아이콘과 동일한 정렬, hover 시 텍스트 미표시 */}
        <div className="sidebar-logo">
          <NavLink to="/" className="sidebar-logo-link">
            <span className="sidebar-icon"><InstagramIcon /></span>
            <span className="logo-text">Instagram</span>
          </NavLink>
        </div>

        <div className="sidebar-nav">
          <NavItem to="/" icon={<HomeIcon />} label="홈" />
          <NavItem onClick={onSearch} icon={<SearchIcon />} label="검색" />
          <NavItem to="/explore" icon={<ExploreIcon />} label="탐색" />
          <NavItem to="/reels" icon={<ReelsIcon />} label="릴스" />
          <NavItem to="/messages" icon={<MessagesIcon />} label="메시지" />
          <NavItem to="/notifications" icon={<NotificationIcon />} label="알림" />
          <NavItem onClick={() => setShowCreate(true)} icon={<PlusSquareIcon />} label="만들기" />
          <NavLink
            to={`/profile/${user?.username}`}
            className={({ isActive }) => `sidebar-item${isActive ? ' active' : ''}`}
          >
            <span className="sidebar-icon">
              {user?.profile_image
                ? <img src={user.profile_image.startsWith('http') ? user.profile_image : `http://127.0.0.1:8000${user.profile_image}`} alt="" className="avatar avatar-sm" />
                : <div className="avatar avatar-sm avatar-placeholder">{user?.username?.[0]?.toUpperCase()}</div>
              }
            </span>
            <span className="sidebar-label">프로필</span>
          </NavLink>
        </div>

        <div className="sidebar-bottom">
          <div className="sidebar-more-wrap">
            {showMore && (
              <div className="more-menu">
                <button className="more-menu-item" onClick={handleLogout}>
                  <span>🚪</span> 로그아웃 ({user?.username})
                </button>
              </div>
            )}
            <button className="sidebar-item" onClick={() => setShowMore(p => !p)}>
              <span className="sidebar-icon"><MoreIcon /></span>
              <span className="sidebar-label">더 보기</span>
            </button>
          </div>
        </div>
      </nav>

      {showCreate && <CreatePostModal onClose={() => setShowCreate(false)} />}
    </>
  );
}
