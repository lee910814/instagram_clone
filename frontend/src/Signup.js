import React , {useState} from 'react';
import axios from 'axios';

function Signup({ onSwitchToLogin }){
    const [ username, setUsername] = useState('');
    const [ password, setPassword] = useState('');
    const [ passwordCheck, setPasswordCheck] = useState('');

    const handleSubmit = (e) => {
        e.prevenDefault();

        // 비밀번호 확인
        if (password !== passwordCheck) {
            alert('비밀번호가 일치하지 않습니다')
            return;
        }

        // 서버에 회원가입 요청 
        axios.post('http://127.0.0.1:8000/api/auth/registration/',{
            username: username,
            password: password,
            password2: passwordCheck // dj-rest-auth느 password2라는 이름으로 비번 확인
        })
        .then(Response => {
            alert('회원가입 성공')
            onSwitchToLogin();
        })
        .catch(error => {
            console.log(error);
            alert("회원가입 실패")
        });
    };

    return(
        <div style={{ padding: '20px', border: '2px soild orange', maxWidth: '400px', margin: 'auth'}}>
            <h2>회원가입</h2>
            <form onSubmit={handleSubmit}>
                <input
                type='text'
                placeholder='아이디를 입력해주세요'
                value={username}
                onChange={(e)=> setUsername(e.target.value)}
                style={{ display: 'block', margin: '10px 0', width: '100%'}}
                />
                <input
                type='password'
                placeholder='비밀번호를 입력해주세요'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ display: 'block', margin: '10px 0', width: '100%'}}/>
                <input
                type='password'
                placeholder='비밀번호 다시 입력해주세요'
                value={passwordCheck}
                onChange={ (e)=> setPasswordCheck(e.target.value)}
                style={{ display: 'block', margin: '10px 0', width: '100%'}}/>
                <button type='submit' style={{ width:' 100%',padding:'10px'}}>가입하기</button>
            </form>
            <p style={{ textAlign: 'center', marginTop: '10px'}}>
                이미 계정이 있으신가요?<br/>
                <button onClick={onSwitchToLogin} style={{ background:'none',border:'none',color:'blue',cursor: 'pointer'}}>
                    로그인하러 가기
                </button>
            </p>
        </div>
    );
}

export default Signup;