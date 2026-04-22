import React, { useState, useRef, useCallback } from 'react';
import api from '../../api/axios';
import { CloseIcon, ImageIcon } from '../Icons';

export default function CreatePostModal({ onClose, onCreated }) {
  const [step, setStep] = useState('select'); // select | edit | submitting
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [caption, setCaption] = useState('');
  const [error, setError] = useState('');
  const fileRef = useRef();

  const handleFile = (f) => {
    if (!f || !f.type.startsWith('image/')) {
      setError('이미지 파일만 업로드 가능합니다.');
      return;
    }
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setStep('edit');
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    handleFile(e.dataTransfer.files[0]);
  }, []);

  const handleSubmit = async () => {
    if (!file) return;
    setStep('submitting');
    const form = new FormData();
    form.append('image', file);
    form.append('caption', caption);
    try {
      const res = await api.post('/posts/', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      onCreated && onCreated(res.data);
      onClose();
    } catch {
      setError('업로드에 실패했습니다. 다시 시도해주세요.');
      setStep('edit');
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-box create-post-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <span />
          <h3 className="modal-title">새 게시물 만들기</h3>
          <button className="icon-btn" onClick={onClose}><CloseIcon /></button>
        </div>

        {step === 'select' && (
          <div
            className="upload-area"
            onDrop={handleDrop}
            onDragOver={e => e.preventDefault()}
            onClick={() => fileRef.current.click()}
          >
            <ImageIcon />
            <p className="upload-text">사진을 여기에 끌어다 놓으세요</p>
            <button className="btn btn-primary btn-sm">컴퓨터에서 선택</button>
            {error && <p className="error-text">{error}</p>}
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={e => handleFile(e.target.files[0])}
            />
          </div>
        )}

        {(step === 'edit' || step === 'submitting') && (
          <div className="create-post-edit">
            <div className="create-post-preview">
              <img src={preview} alt="preview" className="create-post-img" />
            </div>
            <div className="create-post-form">
              <textarea
                className="caption-input"
                placeholder="문구를 입력하세요..."
                value={caption}
                onChange={e => setCaption(e.target.value)}
                maxLength={2200}
              />
              <span className="caption-count">{caption.length}/2,200</span>
              {error && <p className="error-text">{error}</p>}
              <div className="create-post-actions">
                <button className="btn btn-ghost" onClick={() => { setStep('select'); setFile(null); setPreview(null); }}>
                  뒤로
                </button>
                <button
                  className="btn btn-primary"
                  onClick={handleSubmit}
                  disabled={step === 'submitting'}
                >
                  {step === 'submitting' ? '공유 중...' : '공유하기'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
