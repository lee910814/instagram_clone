import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../api/axios';
import { HeartIcon, CommentIcon, ShareIcon, BookmarkIcon, EllipsisIcon } from '../Icons';

function timeAgo(dateStr) {
  const diff = (Date.now() - new Date(dateStr)) / 1000;
  if (diff < 60) return '방금 전';
  if (diff < 3600) return `${Math.floor(diff / 60)}분 전`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}시간 전`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}일 전`;
  return new Date(dateStr).toLocaleDateString('ko-KR');
}

export default function PostCard({ post, onDelete }) {
  const { user } = useAuth();
  const [liked, setLiked] = useState(post.is_liked);
  const [likesCount, setLikesCount] = useState(post.likes_count);
  const [likeAnim, setLikeAnim] = useState(false);
  const [saved, setSaved] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState(post.comments || []);
  const [showAllComments, setShowAllComments] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const imageUrl = post.image?.startsWith('http') ? post.image : `http://127.0.0.1:8000${post.image}`;
  const authorImg = post.author?.profile_image
    ? (post.author.profile_image.startsWith('http') ? post.author.profile_image : `http://127.0.0.1:8000${post.author.profile_image}`)
    : null;

  const handleLike = async () => {
    const next = !liked;
    setLiked(next);
    setLikesCount(c => next ? c + 1 : c - 1);
    if (next) {
      setLikeAnim(true);
      setTimeout(() => setLikeAnim(false), 600);
    }
    try {
      const res = await api.post(`/posts/${post.id}/like/`);
      setLiked(res.data.is_liked);
      setLikesCount(res.data.likes_count);
    } catch {
      setLiked(!next);
      setLikesCount(c => next ? c - 1 : c + 1);
    }
  };

  const handleDoubleClick = () => {
    if (!liked) handleLike();
    setLikeAnim(true);
    setTimeout(() => setLikeAnim(false), 600);
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    try {
      const res = await api.post(`/posts/${post.id}/comments/`, { content: commentText });
      setComments(prev => [...prev, res.data]);
      setCommentText('');
    } catch {}
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await api.delete(`/posts/comments/${commentId}/`);
      setComments(prev => prev.filter(c => c.id !== commentId));
    } catch {}
  };

  const handleDeletePost = async () => {
    if (!window.confirm('게시물을 삭제하시겠어요?')) return;
    try {
      await api.delete(`/posts/${post.id}/`);
      onDelete && onDelete(post.id);
    } catch {}
  };

  const visibleComments = showAllComments ? comments : comments.slice(-2);

  return (
    <article className="post-card">
      {/* Header */}
      <div className="post-header">
        <Link to={`/profile/${post.author?.username}`} className="post-author-link">
          {authorImg
            ? <img src={authorImg} alt="" className="avatar avatar-sm" />
            : <div className="avatar avatar-sm avatar-placeholder">{post.author?.username?.[0]?.toUpperCase()}</div>
          }
          <div className="post-author-info">
            <span className="post-author-name">{post.author?.username}</span>
            <span className="post-time">{timeAgo(post.created_at)}</span>
          </div>
        </Link>
        <div className="post-menu-wrap">
          <button className="icon-btn" onClick={() => setShowMenu(p => !p)}>
            <EllipsisIcon />
          </button>
          {showMenu && (
            <div className="post-menu">
              {user?.username === post.author?.username && (
                <button className="post-menu-item danger" onClick={handleDeletePost}>삭제</button>
              )}
              <button className="post-menu-item" onClick={() => setShowMenu(false)}>취소</button>
            </div>
          )}
        </div>
      </div>

      {/* Image */}
      <div className="post-image-wrap" onDoubleClick={handleDoubleClick}>
        <img src={imageUrl} alt="post" className="post-image" loading="lazy" />
        {likeAnim && (
          <div className="heart-burst">
            <HeartIcon filled />
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="post-actions">
        <div className="post-actions-left">
          <button className={`icon-btn${liked ? ' liked' : ''}`} onClick={handleLike} aria-label="좋아요">
            <HeartIcon filled={liked} />
          </button>
          <button className="icon-btn" aria-label="댓글">
            <CommentIcon />
          </button>
          <button className="icon-btn" aria-label="공유">
            <ShareIcon />
          </button>
        </div>
        <button className={`icon-btn${saved ? ' saved' : ''}`} onClick={() => setSaved(p => !p)} aria-label="저장">
          <BookmarkIcon filled={saved} />
        </button>
      </div>

      {/* Likes */}
      <div className="post-body">
        {likesCount > 0 && (
          <p className="post-likes">좋아요 <strong>{likesCount.toLocaleString()}개</strong></p>
        )}

        {/* Caption */}
        {post.caption && (
          <p className="post-caption">
            <Link to={`/profile/${post.author?.username}`} className="post-author-name">{post.author?.username}</Link>
            {' '}{post.caption}
          </p>
        )}

        {/* Comments */}
        {comments.length > 2 && !showAllComments && (
          <button className="comment-more-btn" onClick={() => setShowAllComments(true)}>
            댓글 {comments.length}개 모두 보기
          </button>
        )}
        <div className="post-comments">
          {visibleComments.map(c => (
            <div key={c.id} className="comment-item">
              <Link to={`/profile/${c.author?.username}`} className="comment-author">{c.author?.username}</Link>
              <span className="comment-content">{c.content}</span>
              {(user?.username === c.author?.username || user?.username === post.author?.username) && (
                <button className="comment-delete" onClick={() => handleDeleteComment(c.id)}>×</button>
              )}
            </div>
          ))}
        </div>

        {/* Comment Input */}
        <form className="comment-form" onSubmit={handleComment}>
          <input
            type="text"
            className="comment-input"
            placeholder="댓글 달기..."
            value={commentText}
            onChange={e => setCommentText(e.target.value)}
          />
          {commentText.trim() && (
            <button type="submit" className="comment-submit">게시</button>
          )}
        </form>
      </div>
    </article>
  );
}
