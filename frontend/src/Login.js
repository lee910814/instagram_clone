import React, { useState } from 'react';
import axios from 'axios';

function Login({ onLogin, onSwitchToSignup }){
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        // 백엔드에 로그인 요청 ( ID, 비번 보냄)
        axios.post('http://127.0.0.1:8000/api/auth/login/', {
            username: username,
            password: password
        })
        .then(response => {
            console.log('로그인 성공!', response.data);
            // 로그인시 App.js에게 알림
            onLogin(response.data.access);
            alert('로그인 되었습니다!')

        })
        .catch(error => {
            console.log(error);
            alert('아이디, 비밀번호 확인바랍니다')
        });
    };
    return(
        <div style={{ padding: '20px', border: '2px solid green', maxWidth: '400px', margin: 'auto'}}>
            <h2>로그인</h2>
            <form onSubmit={handleSubmit}>
                <input
                type='text'
                placeholder='아이디를 입력하세요'
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={{ display: ' block', margin: '10px 0', width: '100%'}}/>
                <input
                type='password'
                placeholder='비밀번호를 입력하세요'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ display: 'block', margin: '10px 0', width: '100%'}}/>
                <button type='submit' style={{ width: '100%', padding: '10px'}}>로그인</button>
            </form>
            <p style={{ textAlign: 'center', marginTop: '10px' }}>
                계정이 없으신가요? <br/>
                <button onClick={onSwitchToSignup} style={{ background: 'none', border: 'none', color: 'blue', cursor: 'pointer' }}>
                    회원가입 하러 가기
                </button>
            </p>
        </div>
    );
}

export default Login;