// TopNavBar.jsx
import React, { useState, useEffect } from "react";
import "./NavBar.css";
import { Link, useNavigate } from "react-router-dom";
import logoutIcon from "../../asset/Icon/logoutIcon.svg";
import settingIcon from "../../asset/Icon/settingIcon.svg";
import logo from "../../asset/HYUPMIN_logo.svg";

const API_URL = import.meta.env.VITE_DEV_PROXY_URL;

const NavBar = () => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const [projectCode, setProjectCode] = useState("");
  const [userName, setUserName] = useState("");
  const [fullName, setFullName] = useState("");

  // 사용자 정보 가져오기
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await fetch(`${API_URL}/api/users/me`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setFullName(data.name || "");
          setUserName(data.name ? data.name.charAt(0) : "");
        }
      } catch (error) {
        console.error("사용자 정보 로딩 실패:", error);
      }
    };

    if (token) {
      fetchUserInfo();
    }
  }, [token]);

  const handleCreateProject = async () => {
    try {
      const response = await fetch(`${API_URL}/api/projects`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          projectName: "새 프로젝트",
        }),
      });

      if (!response.ok) {
        throw new Error("프로젝트 생성 실패");
      }

      const data = await response.json();
      const newProjectId = data.projectPk;

      navigate(`/project/${newProjectId}/setting`);
    } catch (error) {
      console.error("프로젝트 생성 중 오류: ", error);
      alert("프로젝트 생성에 실패했습니다.");
    }
  };

  const handleJoinProject = async () => {
    if (!projectCode.trim()) {
      alert("프로젝트 코드를 입력해주세요.");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/projects/join-request?code=${projectCode}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("프로젝트 참여 실패");
      }

      const data = await response.json();
      const projectId = data.projectId;

      setProjectCode("");
    } catch (error) {
      console.error("프로젝트 참여 중 오류:", error);
      alert("프로젝트 참여에 실패했습니다.");
    }
  };

  const handleSetting = () => {
    navigate("/setting");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <>
      {/* 상단바 */}
      <div className="NavBar-top">
        <div className="TopContainer">
          <div className="logo">
            <Link to="/dashboard">
              <img src={logo} className="logoImg" alt="logo" />
            </Link>
          </div>
          <div className="SearchContainer">
            <input
              type="text"
              className="SearchBar"
              placeholder="참여하고 싶은 프로젝트 코드를 입력해주세요"
              value={projectCode}
              onChange={(e) => setProjectCode(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleJoinProject();
                }
              }}
            />
            <button className="SearchButton" onClick={handleCreateProject}>
              프로젝트 생성
            </button>
          </div>
          <div className="profile" to="/profile">
            <div className="UserName">{userName || "사"}</div>
            <div className="fullname">{fullName || "사용자"}</div>
          </div>
          <div className="Buttons">
            <div className="LogoutButton" onClick={handleLogout}>
              <img src={logoutIcon} className="LogoutIcon" alt="logout" />
            </div>
            <div className="SettingButton" onClick={handleSetting}>
              <img src={settingIcon} className="SettingIcon" alt="setting" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NavBar;
