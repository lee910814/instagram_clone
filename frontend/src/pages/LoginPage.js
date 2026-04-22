import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form.username, form.password);
      navigate('/');
    } catch {
      setError('아이디 또는 비밀번호를 확인해주세요.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">Instagram</div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <input
            className="auth-input"
            type="text"
            name="username"
            placeholder="사용자 이름"
            value={form.username}
            onChange={handleChange}
            autoComplete="username"
            required
          />
          <input
            className="auth-input"
            type="password"
            name="password"
            placeholder="비밀번호"
            value={form.password}
            onChange={handleChange}
            autoComplete="current-password"
            required
          />
          {error && <p className="auth-error">{error}</p>}
          <button
            type="submit"
            className="btn btn-primary btn-full"
            disabled={!form.username || !form.password || loading}
          >
            {loading ? '로그인 중...' : '로그인'}
          </button>
        </form>

        <div className="auth-divider">
          <span>또는</span>
        </div>

        <div className="auth-switch">
          계정이 없으신가요? <Link to="/signup">가입하기</Link>
        </div>
      </div>

      <div className="auth-card auth-signup-cta">
        <p>계정이 없으신가요? <Link to="/signup">가입하기</Link></p>
      </div>
    </div>
  );
}
