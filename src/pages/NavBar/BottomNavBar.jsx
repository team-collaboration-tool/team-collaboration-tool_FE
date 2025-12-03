// BottomNavBar.jsx
import React, { useState } from "react";
import "./NavBar.css";
import { Link, useLocation, useParams } from "react-router-dom";
import dashboardIcon from "../../asset/Icon/dashboardIcon.svg";
import calendarIcon from "../../asset/Icon/calendarIcon.svg";
import communityIcon from "../../asset/Icon/communityIcon.svg";
import scheduleIcon from "../../asset/Icon/scheduleIcon.svg";
import settingIcon1 from "../../asset/Icon/settingIcon-01.svg";

const projects = [
  { id: 1, name: "소프트웨어공학 팀플", to: "/project/1/dashboard" },
  { id: 2, name: "오픈소스SW설계", to: "/project/2/dashboard" },
  { id: 3, name: "컴퓨터구조 팀플", to: "/project/3/dashboard" },
  { id: 4, name: "운영체제 팀플", to: "/project/4/dashboard" },
];

const PageNavBar = ({ projectName }) => {
  const { projectID } = useParams();
  const location = useLocation();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const isCalendarPage = location.pathname.endsWith("/calendar");
  const isSettingPage = location.pathname === "/setting";
  const isInvalidProject = !projectID || projectID === "undefined";
  const isBasePath = location.pathname === `/project/${projectID}`;

  const pages = [
    {
      id: 1,
      name: "마이페이지",
      src: dashboardIcon,
      to: `/dashboard`,
    },
    {
      id: 2,
      name: "게시판",
      src: communityIcon,
      to: `/project/${projectID}/board`,
    },
    {
      id: 3,
      name: "달력",
      src: calendarIcon,
      to: `/project/${projectID}`,
    },
    {
      id: 4,
      name: "시간조율",
      src: scheduleIcon,
      to: `/project/${projectID}/schedule`,
    },
    {
      id: 5,
      name: "프로젝트 관리",
      src: settingIcon1,
      to: `/project/${projectID}/setting`,
    },
  ];

  const pageMap = pages.map((page) => (
    <div key={page.id} className="Function-item">
      <Link to={page.to} className="FunctionButton">
        <img
          src={page.src}
          alt={`${page.name} icon`}
          className="FunctionIcon"
        />
        <h1 className="FunctionText">{page.name}</h1>
      </Link>
    </div>
  ));

  const toggleModal = () => {
    if (isCalendarPage || isBasePath || isInvalidProject) return;
    setIsModalOpen(!isModalOpen);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  if (isSettingPage) {
    return null;
  }

  return (
    <>
      <div className="NavBar-bottom">
        <div className="bottom">
          <div
            className={`ProjectName ${
              isCalendarPage || isBasePath || isInvalidProject || isSettingPage
                ? "disabled"
                : ""
            }`}
            onClick={toggleModal}
          >
            프로젝트 목록
          </div>
          <div className="button">
            <div className="Pages">{pageMap}</div>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <>
          <div className="modalOverlay" onClick={closeModal}></div>

          <div className="projectModal">
            <div className="ProjectListContainer">
              <h2 className="projectTitle">프로젝트</h2>
              <div className="projectList">
                {projects.map((project) => (
                  <div key={project.id} className="Project-item">
                    <Link
                      to={project.to}
                      className="ProjectButton"
                      onClick={closeModal}
                    >
                      <div className="projectSelect"></div>
                      <div className="ProjectText">{project.name}</div>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
            <div className="modalCloseBtn" onClick={closeModal}>
              프로젝트 목록
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default PageNavBar;
