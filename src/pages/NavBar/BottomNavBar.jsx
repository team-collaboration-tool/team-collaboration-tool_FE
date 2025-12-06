// BottomNavBar.jsx
import React, { useCallback, useEffect, useState } from "react";
import "./NavBar.css";
import { Link, useLocation, useParams } from "react-router-dom";
import dashboardIcon from "../../asset/Icon/dashboardIcon.svg";
import calendarIcon from "../../asset/Icon/calendarIcon.svg";
import communityIcon from "../../asset/Icon/communityIcon.svg";
import scheduleIcon from "../../asset/Icon/scheduleIcon.svg";
import settingIcon1 from "../../asset/Icon/settingIcon-01.svg";

const API_URL = import.meta.env.VITE_DEV_PROXY_URL;

const PageNavBar = ({ leftContentState }) => {
  const { projectID } = useParams();
  const location = useLocation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const isCalendarPage = location.pathname.endsWith("/calendar");
  const isSettingPage = location.pathname.endsWith("/setting");

  const currentProjectIdFromURL = projectID ? parseInt(projectID, 10) : null;

  const isCalendarViewActive =
    leftContentState === "SCHEDULE_LIST" ||
    leftContentState === "SCHEDULE_VIEW";

  const isBaseProjectRoute =
    projectID && location.pathname === `/project/${projectID}`;

  const isProjectListDisabled = isBaseProjectRoute && !isCalendarViewActive;

  const fetchProjects = useCallback(async () => {
    try {
      const token = sessionStorage.getItem("token");

      const response = await fetch(`${API_URL}/api/projects/me`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setProjects(data);
      } else {
        const errorText = await response.text();
        console.error(
          "HTTP Status:",
          response.status,
          "Error Body:",
          errorText
        );
        setError(`프로젝트 로드 실패 (HTTP ${response.status})`);
      }
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);
  if (isSettingPage) {
    return null;
  }

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
      to: `/project/${projectID}/projectsetting`,
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
    if (isProjectListDisabled) {
      return;
    }
    setIsModalOpen(!isModalOpen);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const projectList = projects.map((project) => {
    const isCurrentProject = project.projectPk === currentProjectIdFromURL;

    return (
      <div
        key={project.projectPk}
        className={`Project-item ${isCurrentProject ? "selected" : ""}`}
      >
        <Link
          to={`/project/${project.projectPk}`}
          className={`ProjectButton ${isCurrentProject ? "active" : ""}`}
          onClick={closeModal}
        >
          <div className="projectSelect"></div>
          <div className="ProjectText">{project.projectName}</div>
        </Link>
      </div>
    );
  });

  return (
    <>
      <div className="NavBar-bottom">
        <div className="bottom">
          <div
            className="ProjectName"
            onClick={toggleModal}
            style={{
              cursor: isProjectListDisabled ? "default" : "pointer",
              opacity: isProjectListDisabled ? 0.6 : 1,
            }}
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
                {loading ? (
                  <p className="loadingText">로딩 중...</p>
                ) : error ? (
                  <p className="errorText">에러: {error}</p>
                ) : projects.length > 0 ? (
                  projectList
                ) : (
                  <p className="noProjects">프로젝트가 없습니다.</p>
                )}
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
