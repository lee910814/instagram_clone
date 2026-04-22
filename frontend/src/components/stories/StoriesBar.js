import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

function StoryCircle({ user, isOwn }) {
  const initial = user?.username?.[0]?.toUpperCase() || '?';
  const imgSrc = user?.profile_image ? `http://127.0.0.1:8000${user.profile_image}` : null;

  return (
    <div className="story-item">
      <div className={`story-ring${isOwn ? ' story-ring-add' : ''}`}>
        {imgSrc
          ? <img src={imgSrc} alt={user.username} className="story-avatar" />
          : <div className="story-avatar story-avatar-placeholder">{initial}</div>
        }
        {isOwn && <div className="story-add-badge">+</div>}
      </div>
      <span className="story-username">{isOwn ? '내 스토리' : user.username}</span>
    </div>
  );
}

export default function StoriesBar({ users = [] }) {
  const { user } = useAuth();

  return (
    <div className="stories-container">
      <div className="stories-scroll">
        <StoryCircle user={user} isOwn />
        {users.map(u => (
          <StoryCircle key={u.id} user={u} />
        ))}
      </div>
    </div>
  );
}
