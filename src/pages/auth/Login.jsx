import React from "react";
import { useNavigate } from "react-router-dom";
import './Login.css';

import Logo from '../../asset/user_icon/logo.svg';
import LockIcon from '../../asset/user_icon/lock_icon.svg';
import UserIcon from '../../asset/user_icon/user_icon.svg';

const API_URL = import.meta.env.VITE_DEV_PROXY_URL;

const Login = () => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loginCheck, setLoginCheck] = React.useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    await new Promise((r) => setTimeout(r, 1000));

    const response = await fetch(`${API_URL}/api/users/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      }
    );
    const result = await response.json();

    if (response.status === 200) {
      setLoginCheck(false);
      localStorage.setItem("token", result.token);
      localStorage.setItem("user", JSON.stringify(result.user));
      navigate("/dashboard");
    } else {
      setLoginCheck(true);
    }
  };

  const handleSignupClick = () => {
    navigate("/sign/1");
  };

  return (
    <div className="Login-container">
      <form className="Login-form" onSubmit={handleLogin}>
        {/* 로고 영역 */}
        <h1>
          <div className="logo-circle">
            <img src={Logo} alt="협업의민족 로고" />
          </div>
        </h1>

        {/* 이메일 입력 */}
        <div className="input-group">
          <div className="input-wrapper">
            <div className="input-icon">
              <img src={UserIcon} alt="사용자 아이콘" />
            </div>
            <input
              type="email"
              placeholder="이메일"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>

        {/* 비밀번호 입력 */}
        <div className="input-group">
          <div className="input-wrapper">
            <div className="input-icon">
              <img src={LockIcon} alt="잠금 아이콘" />
            </div>
            <input
              type="password"
              placeholder="비밀번호"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </div>

        {/* LOGIN 버튼 */}
        <button type="submit">LOGIN</button>

        {/* 에러 메시지 */}
        {loginCheck && <p className="error">아이디나 비밀번호가 일치하지 않습니다.</p>}

        {/* sign up 구분선 */}
        <div className="divider">
          <span className="divider-text">sign up</span>
        </div>

        {/* 회원가입 버튼 */}
        <button type="button" className="signup-button" onClick={handleSignupClick}>
          회원가입
        </button>

        {/* 하단 안내 텍스트 */}
        <p className="signup-info">협업의민족이 처음이신가요?</p>
      </form>
    </div>
  );
};

export default Login;
