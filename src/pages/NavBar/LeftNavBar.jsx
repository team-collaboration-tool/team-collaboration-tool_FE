// LeftNavBar.jsx
import React from "react";
import { Link } from "react-router-dom";
import "./NavBar.css";

const projects = [
  { id: 1, name: "소프트웨어공학 팀플", to: "/project/1/dashboard" },
  { id: 2, name: "오픈소스SW설계", to: "/project/2/dashboard" },
  { id: 3, name: "컴퓨터구조 팀플", to: "/project/3/dashboard" },
  { id: 4, name: "운영체제 팀플", to: "/project/4/dashboard" },
];

const projectList = projects.map((project) => (
  <div key={project.id} className="Project-item">
    <Link to={project.to} className="ProjectButton">
      <div className="projectSelect"></div>
      <div className="ProjectText">{project.name}</div>
    </Link>
  </div>
));

const LeftNavBar = () => {
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
