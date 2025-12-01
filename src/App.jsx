import React from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";

// pages/auth
import Login from "./pages/auth/Login";
import SignUp from "./pages/auth/Signup";

// pages/dashboard
import Dashboard from "./pages/main/Dashboard";
import Setting from "./pages/main/Setting";

// layout
import Layout from "./Layout";

// pages/projects/project
import Project from "./pages/projects/project/Project";
import ProjectSetting from "./pages/projects/project/ProjectSetting";

// pages/projects/calendar
import Calendar from "./pages/projects/calendar/Calendar";

// pages/projects/board
import Board from "./pages/projects/board/Board";
import BoardDetail from "./pages/projects/board/BoardDetail";
import AddBoard from "./pages/projects/board/AddBoard";

// pages/projects/schedule
import Schedule from "./pages/projects/schedule/Schedule";
import AddSchedule from "./pages/projects/schedule/AddSchedule";
import ScheduleDetail from "./pages/projects/schedule/ScheduleDetail";

// pages/NotFound
import NotFound from "./pages/NotFound";

// css
import "./App.css";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* 인증 관련 라우트 */}
        <Route path="/" element={<Login />} />
        <Route path="/sign/1" element={<SignUp />} />

        {/* 메인 대시보드 */}
        <Route element={<Layout showPageNav={false} />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/setting" element={<Setting />} />
        </Route>

        {/* 프로젝트 라우트 */}
        <Route
          path="/project/:projectID"
          element={<Layout showPageNav={true} />}
        >
          <Route index element={<Calendar />} />
          <Route path="setting" element={<ProjectSetting />} />
          <Route path="calendar" element={<Calendar />} />

          {/* 게시판 라우트 */}
          <Route path="board">
            <Route index element={<Board />} />
            <Route path="create" element={<AddBoard />} />
            <Route path=":PostID" element={<BoardDetail />} />
          </Route>

          {/* 일정 조율 라우트 */}
          <Route path="schedule">
            <Route index element={<Schedule />} />
            <Route path="add" element={<AddSchedule />} />
            <Route path=":scheduleID" element={<ScheduleDetail />} />
          </Route>
        </Route>

        {/* 404 Not Found 라우트 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
