import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Login from './Login';


function App(){
  const [posts, setPosts] = useState([]);

  // 사진, 설명 데이터 저장
  const [image, setImage] = useState(null);
  const [caption, setCaption] = useState('');

  //로그인 상태 관리
  const [token, setToken] = useState(null);

  useEffect(() => {
    // 로그인 되었을 때만 게시글 가져오기
    if (token){
    // 백엔드에 데이터 요청
    axios.get('http://127.0.0.1:8000/api/posts/')
     .then(response => {
      setPosts(response.data);
      console.log(response.data);
     })
     .catch(error => {
      console.log(error);
     });
    }
  },[token]); // token이 바뀔 때마다 실행

  // 게시글 작성 함수
  const handleSubmit = (e) =>{
    e.preventDefault(); //새로고침 막기

    // formData 만들기
    const formData = new FormData();
    formData.append('image', image); //사진
    formData.append('caption',caption); // 글

    // 백엔드 POST요청
    axios.post('http://127.0.0.1:8000/api/posts/', formData, {
      headers:{
        'Content-Type' : 'multipart/form-data', 
        'Authorization': `Bearer ${token}` // 현업에서는 Bearer + 토큰 사용
      }
    })
    .then(response => {
      console.log(response.data);
      setPosts([response.data, ...posts]);

      //입력창 초기화
      setImage(null);
      setCaption('');
      alert('업로드 되었습니다');
    })
    .catch(error => {
      console.log(error);
      alert('에러 발생하였습니다.');
    });
  };

  // 로그인을 안 했으면 로그인 화면 보여줌
  if (!token){
    return<Login onLogin={(receivedToken) => setToken(receivedToken)} />;
  }

  // 로그인시 메인 화면 보여줌 
  return (
    <div style={{ padding:'20px'}}>
      <h1>instagram-clone</h1>

      {/*업로드 폼 */}
      <div style = {{ border: '2px dashed skyblue', padding: '20px', marginBottom: '20px'}}>
        <h3>새 게시글 만들기</h3>
        <form onSubmit = {handleSubmit}>
          {/* 파일 선택*/}
          <input
          type = "file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}/>
          <br/><br/>

          {/*글 입력 */}
          <textarea
          placeholder="어떤 사진인가요?"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          /><br/><br/>

          <button type="submit">업로드</button>

        </form>
      </div>
      <hr/>
      {/*게시글 목록 보여주기 */}
      {posts.map(post => (
        <div key ={post.id} style ={{ border: '1px solid gray', margin: '10px', padding:'10px'}}>
          {/* 작성자가 없으면 '익명'이라고 표시 */}
          <h3> 작성자 : {post.author ? post.author.username : '익명'}</h3>
          {post.image && <img src ={post.image} alt = "post" width="300"/>} 
          <p>{ post.caption} </p>
          </div>
      ))}
    </div>
  );
}

export default App;