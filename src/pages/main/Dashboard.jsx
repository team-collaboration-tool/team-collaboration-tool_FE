import React from "react";
import Calendar from "../projects/calendar/Calendar";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("로그인이 필요합니다. 로그인 후 이용해주세요.");
      navigate("/login");
      return;
    }

    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        console.log("환영합니다!", userData.name || userData.email);
      } catch (error) {
        console.error("사용자 정보 파싱 오류:", error);
        localStorage.clear();
        navigate("/login");
      }
    }
  }, [navigate]);

  return (
    <div className="dashboard-container">
      <Calendar />
    </div>
  );
};

export default Dashboard;
