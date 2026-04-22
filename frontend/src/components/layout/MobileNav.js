import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { HomeIcon, SearchIcon, PlusSquareIcon, ReelsIcon } from '../Icons';
import CreatePostModal from '../post/CreatePostModal';

export default function MobileNav() {
  const { user } = useAuth();
  const [showCreate, setShowCreate] = useState(false);

  return (
    <>
      <nav className="mobile-nav">
        <NavLink to="/" className={({ isActive }) => `mobile-nav-item${isActive ? ' active' : ''}`}>
          <HomeIcon />
        </NavLink>
        <NavLink to="/explore" className={({ isActive }) => `mobile-nav-item${isActive ? ' active' : ''}`}>
          <SearchIcon />
        </NavLink>
        <button className="mobile-nav-item" onClick={() => setShowCreate(true)}>
          <PlusSquareIcon />
        </button>
        <NavLink to="/reels" className={({ isActive }) => `mobile-nav-item${isActive ? ' active' : ''}`}>
          <ReelsIcon />
        </NavLink>
        <NavLink
          to={`/profile/${user?.username}`}
          className={({ isActive }) => `mobile-nav-item${isActive ? ' active' : ''}`}
        >
          {user?.profile_image
            ? <img src={`http://127.0.0.1:8000${user.profile_image}`} alt="" className="avatar avatar-xs" />
            : <div className="avatar avatar-xs avatar-placeholder">{user?.username?.[0]?.toUpperCase()}</div>
          }
        </NavLink>
      </nav>
      {showCreate && <CreatePostModal onClose={() => setShowCreate(false)} />}
    </>
  );
}
