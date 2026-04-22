import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function SignupPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', email: '', password1: '', password2: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password1 !== form.password2) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }
    setLoading(true);
    try {
      await api.post('/auth/registration/', {
        username: form.username,
        email: form.email,
        password1: form.password1,
        password2: form.password2,
      });
      navigate('/login', { state: { registered: true } });
    } catch (err) {
      const data = err.response?.data;
      if (data) {
        const msgs = Object.values(data).flat();
        setError(msgs[0] || '회원가입에 실패했습니다.');
      } else {
        setError('회원가입에 실패했습니다.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">Instagram</div>
        <p className="auth-subtitle">친구들의 사진과 동영상을 보려면 가입하세요.</p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <input
            className="auth-input"
            type="email"
            name="email"
            placeholder="이메일 주소"
            value={form.email}
            onChange={handleChange}
          />
          <input
            className="auth-input"
            type="text"
            name="username"
            placeholder="사용자 이름"
            value={form.username}
            onChange={handleChange}
            required
          />
          <input
            className="auth-input"
            type="password"
            name="password1"
            placeholder="비밀번호"
            value={form.password1}
            onChange={handleChange}
            required
          />
          <input
            className="auth-input"
            type="password"
            name="password2"
            placeholder="비밀번호 확인"
            value={form.password2}
            onChange={handleChange}
            required
          />
          {error && <p className="auth-error">{error}</p>}
          <button
            type="submit"
            className="btn btn-primary btn-full"
            disabled={!form.username || !form.password1 || !form.password2 || loading}
          >
            {loading ? '가입 중...' : '가입하기'}
          </button>
        </form>

        <p className="auth-terms">
          가입하면 Instagram의 이용 약관, 개인정보 처리방침 및 쿠키 정책에 동의하게 됩니다.
        </p>
      </div>

      <div className="auth-card auth-signup-cta">
        <p>계정이 있으신가요? <Link to="/login">로그인</Link></p>
      </div>
    </div>
  );
}
