import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { SearchIcon } from '../components/Icons';

function PostThumbnail({ post }) {
  const imageUrl = post.image?.startsWith('http') ? post.image : `http://127.0.0.1:8000${post.image}`;
  return (
    <div className="explore-thumb">
      <img src={imageUrl} alt="" loading="lazy" />
      <div className="explore-thumb-overlay">
        <span>♥ {post.likes_count}</span>
        <span>💬 {post.comments_count}</span>
      </div>
    </div>
  );
}

export default function ExplorePage() {
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [searchMode, setSearchMode] = useState(false);

  useEffect(() => {
    api.get('/posts/')
      .then(r => setPosts(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!query.trim()) {
      setUsers([]);
      setSearchMode(false);
      return;
    }
    setSearchMode(true);
    const timer = setTimeout(() => {
      api.get(`/users/search/?q=${encodeURIComponent(query)}`)
        .then(r => setUsers(r.data))
        .catch(() => setUsers([]));
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div className="explore-page">
      <div className="explore-search-wrap">
        <div className="explore-search-box">
          <SearchIcon />
          <input
            className="explore-search-input"
            type="text"
            placeholder="검색"
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
        </div>
      </div>

      {searchMode ? (
        <div className="search-results">
          {users.length === 0 && <p className="search-empty">검색 결과가 없습니다.</p>}
          {users.map(u => {
            const imgSrc = u.profile_image
              ? (u.profile_image.startsWith('http') ? u.profile_image : `http://127.0.0.1:8000${u.profile_image}`)
              : null;
            return (
              <Link to={`/profile/${u.username}`} key={u.id} className="search-user-item">
                {imgSrc
                  ? <img src={imgSrc} alt="" className="avatar avatar-sm" />
                  : <div className="avatar avatar-sm avatar-placeholder">{u.username[0].toUpperCase()}</div>
                }
                <span className="search-username">{u.username}</span>
              </Link>
            );
          })}
        </div>
      ) : (
        <>
          {loading && <div className="page-loading">불러오는 중...</div>}
          <div className="explore-grid">
            {posts.map(post => (
              <PostThumbnail key={post.id} post={post} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
