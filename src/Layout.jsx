// Layout.jsx
import React, { use, useState } from "react";
import { Outlet, useLocation, useParams } from "react-router-dom";
import TopNavBar from "./pages/NavBar/TopNavBar";
import LeftNavBar from "./pages/NavBar/LeftNavBar";
import BottomNavBar from "./pages/NavBar/BottomNavBar";
import "./Layout.css";

const Layout = ({ showPageNav }) => {
  const location = useLocation();
  const params = useParams();
  const currentProjectID = params.projectID;

  const [leftContentState, setLeftContentState] = useState("PROJECT_LIST");

  const isCalendarPage = /^\/project\/[^\/]+\/calendar$/.test(
    location.pathname
  );

  const showLeftNavBar = () => {
    const path = location.pathname;

    if (path === "/dashboard") return true;
    if (/^\/project\/[^\/]+$/.test(path)) return true;
    if (/^\/project\/[^\/]+\/calendar$/.test(path)) return true;

    return false;
  };

  const showBottomNavBar = () => {
    const path = location.pathname;

    if (path === "/dashboard") return false;
    if (path === "/setting") return false;
    if (path === "/" || path.startsWith("/sign")) return false;

    return true;
  };

  const shouldShowLeftNavBar = showLeftNavBar();
  const shouldShowBottomNavBar = showBottomNavBar();

  return (
    <div className="Layout">
      <div className="Layout-header">
        <TopNavBar />
      </div>

      {/* 조건에 맞을 때만 사이드바 표시 */}
      {shouldShowLeftNavBar && (
        <LeftNavBar
          isCalendarPage={isCalendarPage}
          currentProjectID={currentProjectID}
          onContentChange={setLeftContentState}
        />
      )}

      <main
        className={`Layout-main ${!shouldShowLeftNavBar ? "full-width" : ""}`}
      >
        <Outlet />
      </main>

      {/* showPageNav가 true일 때 하단 네비바 표시 */}
      {shouldShowBottomNavBar && (
        <div className="Layout-footer">
          <BottomNavBar leftContentState={leftContentState} />
        </div>
      )}
    </div>
  );
};

export default Layout;
