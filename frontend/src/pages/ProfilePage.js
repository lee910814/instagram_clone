import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../contexts/AuthContext';
import { GridIcon } from '../components/Icons';

function PostThumbnail({ post, onClick }) {
  const imageUrl = post.image?.startsWith('http') ? post.image : `http://127.0.0.1:8000${post.image}`;
  return (
    <div className="profile-thumb" onClick={() => onClick(post)}>
      <img src={imageUrl} alt="" loading="lazy" />
      <div className="profile-thumb-overlay">
        <span>♥ {post.likes_count}</span>
        <span>💬 {post.comments_count}</span>
      </div>
    </div>
  );
}

function PostModal({ post, onClose }) {
  const imageUrl = post.image?.startsWith('http') ? post.image : `http://127.0.0.1:8000${post.image}`;
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-box post-detail-modal" onClick={e => e.stopPropagation()}>
        <img src={imageUrl} alt="" className="post-detail-img" />
        <div className="post-detail-info">
          <p className="post-detail-caption">{post.caption}</p>
          <div className="post-detail-stats">
            <span>♥ {post.likes_count}</span>
            <span>💬 {post.comments?.length ?? post.comments_count}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const { username } = useParams();
  const { user: currentUser, updateUser } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [saving, setSaving] = useState(false);

  const isOwn = currentUser?.username === username;

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const [profRes, postsRes] = await Promise.all([
          api.get(`/users/${username}/`),
          api.get(`/posts/user/${username}/`),
        ]);
        setProfile(profRes.data);
        setPosts(postsRes.data);
        setEditForm({ bio: profRes.data.bio || '', website: profRes.data.website || '' });
      } catch {
        navigate('/');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [username, navigate]);

  const handleFollow = async () => {
    try {
      const res = await api.post(`/users/${username}/follow/`);
      setProfile(prev => ({
        ...prev,
        is_following: res.data.is_following,
        followers_count: res.data.followers_count,
      }));
    } catch {}
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const form = new FormData();
      form.append('bio', editForm.bio);
      form.append('website', editForm.website);
      if (profileImageFile) form.append('profile_image', profileImageFile);

      const res = await api.patch(`/users/${username}/`, form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setProfile(prev => ({ ...prev, ...res.data }));
      updateUser(res.data);
      setEditMode(false);
    } catch {}
    setSaving(false);
  };

  if (loading) return <div className="page-loading">불러오는 중...</div>;
  if (!profile) return null;

  const imgSrc = profile.profile_image
    ? (profile.profile_image.startsWith('http') ? profile.profile_image : `http://127.0.0.1:8000${profile.profile_image}`)
    : null;

  return (
    <div className="profile-page">
      {/* Header */}
      <div className="profile-header">
        <div className="profile-avatar-wrap">
          {editMode ? (
            <label className="profile-avatar-edit">
              {imgSrc
                ? <img src={imgSrc} alt="" className="avatar avatar-xl" />
                : <div className="avatar avatar-xl avatar-placeholder">{profile.username[0].toUpperCase()}</div>
              }
              <div className="avatar-edit-overlay">변경</div>
              <input type="file" accept="image/*" style={{ display: 'none' }}
                onChange={e => setProfileImageFile(e.target.files[0])} />
            </label>
          ) : (
            imgSrc
              ? <img src={imgSrc} alt="" className="avatar avatar-xl" />
              : <div className="avatar avatar-xl avatar-placeholder">{profile.username[0].toUpperCase()}</div>
          )}
        </div>

        <div className="profile-info">
          <div className="profile-top-row">
            <h2 className="profile-username">{profile.username}</h2>
            {isOwn ? (
              editMode ? (
                <div className="profile-edit-btns">
                  <button className="btn btn-outline" onClick={() => setEditMode(false)}>취소</button>
                  <button className="btn btn-primary" onClick={handleSaveProfile} disabled={saving}>
                    {saving ? '저장 중...' : '저장'}
                  </button>
                </div>
              ) : (
                <button className="btn btn-outline" onClick={() => setEditMode(true)}>프로필 편집</button>
              )
            ) : (
              <button
                className={`btn ${profile.is_following ? 'btn-outline' : 'btn-primary'}`}
                onClick={handleFollow}
              >
                {profile.is_following ? '팔로잉' : '팔로우'}
              </button>
            )}
          </div>

          <div className="profile-stats">
            <span><strong>{profile.posts_count}</strong> 게시물</span>
            <span><strong>{profile.followers_count}</strong> 팔로워</span>
            <span><strong>{profile.following_count}</strong> 팔로우</span>
          </div>

          {editMode ? (
            <div className="profile-edit-form">
              <textarea
                className="profile-bio-input"
                placeholder="소개"
                value={editForm.bio}
                onChange={e => setEditForm(p => ({ ...p, bio: e.target.value }))}
                maxLength={150}
              />
              <input
                className="profile-web-input"
                type="url"
                placeholder="웹사이트"
                value={editForm.website}
                onChange={e => setEditForm(p => ({ ...p, website: e.target.value }))}
              />
            </div>
          ) : (
            <div className="profile-bio">
              {profile.bio && <p>{profile.bio}</p>}
              {profile.website && <a href={profile.website} target="_blank" rel="noreferrer">{profile.website}</a>}
            </div>
          )}
        </div>
      </div>

      {/* Grid Tab */}
      <div className="profile-tabs">
        <button className="profile-tab active">
          <GridIcon /> 게시물
        </button>
      </div>

      {/* Post Grid */}
      {posts.length === 0 ? (
        <div className="empty-profile">
          <p>아직 게시물이 없습니다.</p>
        </div>
      ) : (
        <div className="profile-grid">
          {posts.map(post => (
            <PostThumbnail key={post.id} post={post} onClick={setSelectedPost} />
          ))}
        </div>
      )}

      {selectedPost && <PostModal post={selectedPost} onClose={() => setSelectedPost(null)} />}
    </div>
  );
}
