// LeftNavBar.jsx
import React from "react";
import { Link } from "react-router-dom";
import "./NavBar.css";
import { useState, useEffect } from "react";

const LeftNavBar = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch(`/api/projects/me`, {
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
          setError("프로젝트를 불러오는 데 실패했습니다.");
        }

        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  if (loading) {
    return (
      <div>
        {/* 사이드바 */}
        <div className="NavBar-left">
          <div className="ProjectListContainer">
            <h2 className="projectTitle">프로젝트</h2>
            <div className="projectList">로딩 중...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    <div>
      {/* 사이드바 */}
      <div className="NavBar-left">
        <div className="ProjectListContainer">
          <h2 className="projectTitle">프로젝트</h2>
          <div className="projectList">에러 : {error}</div>
        </div>
      </div>
    </div>;
  }

  const projectList = projects.map((project) => (
    <div key={project.projectId} className="Project-item">
      <Link to={`/project/${project.projectPk}`} className="ProjectButton">
        <div className="projectSelect"></div>
        <div className="ProjectText">{project.projectName}</div>
      </Link>
    </div>
  ));

  return (
    <div>
      {/* 사이드바 */}
      <div className="NavBar-left">
        <div className="ProjectListContainer">
          <h2 className="projectTitle">프로젝트</h2>
          <div className="projectList">{projectList}</div>
        </div>
      </div>
    </div>
  );
};

export default LeftNavBar;
