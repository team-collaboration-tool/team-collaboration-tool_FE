import React from "react";
import "./NotFound.css";
import { useNavigate } from "react-router-dom";
import logo from "../asset/NOTFOUND_logo.svg";

const NotFound = () => {
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1);
  };

  const goHome = () => {
    navigate("/");
  };

  return (
    <div className="not-found-container">
      <div className="error-title">404 Not Found</div>
      <div className="title">
        <img src={logo} alt="404 Error Logo" className="Error-logo" />
        <h2>이런! 찾을 수 없는 페이지에요...</h2>
      </div>
      <div className="message">
        <p>요청하신 페이지가 사라졌거나, 잘못된 경로를 이용하셨습니다.</p>
      </div>
      <div className="buttons">
        <div onClick={goBack} className="dashboard-link">
          이전 페이지
        </div>
        <div onClick={goHome} className="dashboard-link">
          홈으로
        </div>
      </div>
    </div>
  );
};

export default NotFound;
