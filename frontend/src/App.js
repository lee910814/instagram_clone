import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App(){
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    // 백엔드에 데이터 요청
    axios.get('http://127.0.0.1:8000/api/posts/')
     .then(response => {
      setPosts(response.data);
      console.log(response.data);
     })
     .catch(error => {
      console.log(error);
     });
  },[]);

  return (
    <div style={{ padding:'20px'}}>
      <h1>instagram-clone</h1>
      <hr/>
      {posts.map(post => (
        <div key ={post.id} style ={{ border: '1px solid gray', margin: '10px', padding:'10px'}}>
          <h3> 작성자 : {post.author.username}</h3>
          {post.image && <img src ={post.image} alt = "post" width="300"/>} 
          <p>{ post.caption} </p>
          </div>
      ))}
    </div>
  );
}

export default App;