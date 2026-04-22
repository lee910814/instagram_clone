import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../contexts/AuthContext';
import PostCard from '../components/post/PostCard';
import StoriesBar from '../components/stories/StoriesBar';

function SuggestedUser({ user, onFollow }) {
  const [following, setFollowing] = useState(user.is_following);

  const handleFollow = async () => {
    const next = !following;
    setFollowing(next);
    try {
      await api.post(`/users/${user.username}/follow/`);
      onFollow && onFollow();
    } catch {
      setFollowing(!next);
    }
  };

  const imgSrc = user.profile_image
    ? (user.profile_image.startsWith('http') ? user.profile_image : `http://127.0.0.1:8000${user.profile_image}`)
    : null;

  return (
    <div className="suggested-user">
      <Link to={`/profile/${user.username}`} className="suggested-user-info">
        {imgSrc
          ? <img src={imgSrc} alt="" className="avatar avatar-sm" />
          : <div className="avatar avatar-sm avatar-placeholder">{user.username[0].toUpperCase()}</div>
        }
        <div>
          <p className="suggested-username">{user.username}</p>
          <p className="suggested-sub">회원님을 위한 추천</p>
        </div>
      </Link>
      <button className="btn-follow-sm" onClick={handleFollow}>
        {following ? '팔로잉' : '팔로우'}
      </button>
    </div>
  );
}

export default function HomePage() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [suggested, setSuggested] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = useCallback(async () => {
    try {
      const res = await api.get('/posts/');
      setPosts(res.data);
    } catch {}
  }, []);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      await Promise.all([
        fetchPosts(),
        api.get('/users/suggested/').then(r => setSuggested(r.data)).catch(() => {}),
      ]);
      setLoading(false);
    };
    fetchAll();
  }, [fetchPosts]);

  const handleDeletePost = (id) => setPosts(prev => prev.filter(p => p.id !== id));

  const userImgSrc = user?.profile_image
    ? (user.profile_image.startsWith('http') ? user.profile_image : `http://127.0.0.1:8000${user.profile_image}`)
    : null;

  return (
    <div className="home-layout">
      {/* Feed */}
      <main className="feed">
        <StoriesBar users={suggested} />

        {loading && (
          <div className="feed-loading">
            {[1, 2, 3].map(i => <div key={i} className="skeleton-card" />)}
          </div>
        )}

        {!loading && posts.length === 0 && (
          <div className="empty-feed">
            <p>아직 게시물이 없습니다.</p>
            <p>팔로우하거나 첫 게시물을 올려보세요!</p>
          </div>
        )}

        {posts.map(post => (
          <PostCard key={post.id} post={post} onDelete={handleDeletePost} />
        ))}
      </main>

      {/* Right Panel */}
      <aside className="home-sidebar">
        {user && (
          <div className="sidebar-user">
            <Link to={`/profile/${user.username}`} className="sidebar-user-info">
              {userImgSrc
                ? <img src={userImgSrc} alt="" className="avatar avatar-md" />
                : <div className="avatar avatar-md avatar-placeholder">{user.username[0].toUpperCase()}</div>
              }
              <div>
                <p className="sidebar-username">{user.username}</p>
                <p className="sidebar-name">{user.email}</p>
              </div>
            </Link>
          </div>
        )}

        {suggested.length > 0 && (
          <div className="suggested-section">
            <div className="suggested-header">
              <span>회원님을 위한 추천</span>
              <Link to="/explore" className="see-all">모두 보기</Link>
            </div>
            {suggested.map(u => (
              <SuggestedUser key={u.id} user={u} onFollow={fetchPosts} />
            ))}
          </div>
        )}

        <p className="footer-links">
          © 2025 Instagram Clone · 개발용 프로젝트
        </p>
      </aside>
    </div>
  );
}
