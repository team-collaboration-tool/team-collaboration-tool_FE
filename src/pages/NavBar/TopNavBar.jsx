// TopNavBar.jsx
import React, { useState } from "react";
import "./NavBar.css";
import { Link, useNavigate } from "react-router-dom";
import logoutIcon from "../../asset/Icon/logoutIcon.svg";
import settingIcon from "../../asset/Icon/settingIcon.svg";
import logo from "../../asset/HYUPMIN_logo.svg";

const NavBar = () => {
  const navigate = useNavigate();
  const [projectCode, setProjectCode] = useState("");

  const handleCreateProject = async () => {
    try {
      const response = await fetch("/api/projects", {
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
      const newProjectId = data.projectId;

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
      const response = await fetch(`/api/projects/join-request`, {
        method: "POST",
        headers: {
          "Content-Type": "applicatoin/json",
        },
        body: JSON.stringify({
          projectCode: projectCode,
        }),
      });

      if (!response.ok) {
        throw new Error("프로젝트 참여 실패");
      }

      const data = await response.json();
      const projectId = data.projectId;

      navigate(`/project/${projectId}`);
      setProjectCode("");
    } catch (error) {
      console.error("프로젝트 참여 중 오류:", error);
      alert("프로젝트 참여에 실패했습니다.");
    }
  };

  const handleSetting = () => {
    navigate("/setting");
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
            <div className="UserName">홍</div>
            <div className="fullname">홍길동</div>
          </div>
          <div className="Buttons">
            <div className="LogoutButton">
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
