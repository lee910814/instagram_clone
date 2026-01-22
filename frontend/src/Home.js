import React, { useEffect, useState } from 'react';
import axios from 'axios';

// App.js에서 token을 넘겨받아 사용합니다.
function Home({ token }) {
  const [posts, setPosts] = useState([]);
  const [image, setImage] = useState(null);
  const [caption, setCaption] = useState('');

  // 1. 게시글 불러오기
  useEffect(() => {
    if (token) {
      axios.get('http://127.0.0.1:8000/api/posts/', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      .then(response => {
        setPosts(response.data);
      })
      .catch(error => {
        console.log(error);
      });
    }
  }, [token]);

  // 2. 게시글 작성하기
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('image', image);
    formData.append('caption', caption);

    axios.post('http://127.0.0.1:8000/api/posts/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${token}`
      }
    })
    .then(response => {
      setPosts([response.data, ...posts]);
      setImage(null);
      setCaption('');
      alert('업로드 되었습니다');
    })
    .catch(error => {
      console.log(error);
      alert('에러 발생하였습니다.');
    });
  };

  return (
    <div style={{ padding: '20px' }}>
      {/* 업로드 폼 */}
      <div style={{ border: '2px dashed skyblue', padding: '20px', marginBottom: '20px' }}>
        <h3>새 게시글 만들기</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
          /><br /><br />
          <textarea
            placeholder="어떤 사진인가요?"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            style={{ width: '100%', height: '50px' }}
          /><br /><br />
          <button type="submit">업로드</button>
        </form>
      </div>

      <hr />

      {/* 게시글 목록 */}
      {posts.map(post => (
        <div key={post.id} style={{ border: '1px solid gray', margin: '10px', padding: '10px' }}>
          <h3> 작성자 : {post.author ? post.author.username : '익명'}</h3>
          {post.image && <img src={post.image} alt="post" width="300" />}
          <p>{post.caption}</p>
        </div>
      ))}
    </div>
  );
}

export default Home;