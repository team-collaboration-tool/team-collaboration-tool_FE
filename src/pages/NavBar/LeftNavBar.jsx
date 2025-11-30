// LeftNavBar.jsx
import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./NavBar.css";
import plusIcon from "./../../asset/Icon/plusIcon_white.svg";
import trashIcon from "./../../asset/Icon/trashIcon.svg";
import editIcon from "./../../asset/Icon/editIcon.svg";

const projects = [
  { id: 1, name: "소프트웨어공학 팀플", to: "/project/1" },
  { id: 2, name: "오픈소스SW설계", to: "/project/2" },
  { id: 3, name: "컴퓨터구조 팀플", to: "/project/3" },
  { id: 4, name: "운영체제 팀플", to: "/project/4" },
];

const schedules = [
  { id: 1, date: "2024-06-10", title: "API 통신 과제 제출" },
  { id: 2, date: "2024-06-10", title: "팀 회의 (오후 3시)" },
  { id: 3, date: "2024-06-12", title: "프로젝트 발표 준비" },
];

const projectList = projects.map((project) => (
  <div key={project.id} className="Project-item">
    <Link to={project.to} className="ProjectButton">
      <div className="projectSelect"></div>
      <div className="ProjectText">{project.name}</div>
    </Link>
  </div>
));

const scheduleList = schedules.map((schedule) => (
  <div key={schedule.id} className="Schedule-item">
    <div className="colorTag"></div>
    <div className="ScheduleText">{schedule.title}</div>
    <div className="scheduleButtons">
      <img src={editIcon} alt="editIcon" className="iconButton" />
      <img src={trashIcon} alt="trashIcon" className="iconButton" />
    </div>
  </div>
));

const LeftNavBar = ({ isCalendarPage }) => {
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const selectedDateFromURL = query.get("selectedDate");

  const dateToDisplay = selectedDateFromURL
    ? new Date(selectedDateFromURL)
    : null;
  const formattedDate =
    dateToDisplay && !isNaN(dateToDisplay)
      ? dateToDisplay.toLocaleDateString("ko-KR", {
          month: "long",
          day: "numeric",
        })
      : "날짜를 선택해 주세요.";

  return (
    <div>
      {/* 사이드바 */}
      <div className="NavBar-left">
        {!isCalendarPage && (
          <div className="ProjectListContainer">
            <h2 className="projectTitle">프로젝트</h2>
            <div className="projectList">{projectList}</div>
          </div>
        )}
        {isCalendarPage && (
          <div className="ProjectListContainer">
            <div className="scheduleTitle">
              <div className="selectedDate">{formattedDate}</div>
              {dateToDisplay && !isNaN(dateToDisplay) && (
                <div className="addSchedule">
                  <img src={plusIcon} alt="plusIcon" />
                  <div>일정 추가</div>
                </div>
              )}
            </div>
            <div className="ScheduleContent">
              {dateToDisplay && !isNaN(dateToDisplay) ? (
                <div className="DailySchedules">
                  {scheduleList.length > 0 ? (
                    scheduleList
                  ) : (
                    <p className="NoSchedule">해당 날짜에 일정이 없습니다.</p>
                  )}
                </div>
              ) : (
                <p className="SelectInstruction">
                  달력에서 날짜를 클릭하여 일정을 확인하세요.
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeftNavBar;
