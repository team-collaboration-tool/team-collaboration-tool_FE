import React, { use } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [user, setUser] = React.useState(null);
  const [password, setPassword] = React.useState(null);
  const [loginCheck, setLoginCheck] = React.useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    await new Promise((r) => setTimeout(r, 1000));

    const response = await fetch(
      "${process.env.REACT_APP_API_URL}/",
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
      tokenStorage.setItem("token", result.token);
      tokenStorage.setItem("user", JSON.stringify(result.user));
      navigate("/dashboard");
    } else {
      setLoginCheck(true);
    }
  };

  return (
    <div className="Login-contatiner">
      <form className="Login-form" onSubmit={handleLogin}>
        <h1>Login</h1>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
        {loginCheck && <p className="error">아이디나 비밀번호가 일치하지 않습니다.</p>}
      </form>
    </div>
  );
};

export default Login;
