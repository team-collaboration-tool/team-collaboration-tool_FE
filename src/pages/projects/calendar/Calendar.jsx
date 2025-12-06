import React, { useCallback, useEffect, useState } from "react";
import "./Calendar.css";
import leftIcon from "../../../asset/Icon/leftChevron.svg";
import rightIcon from "../../../asset/Icon/rightChevron.svg";
import { useLocation, useNavigate, useParams } from "react-router-dom";

const API_URL = import.meta.env.VITE_DEV_PROXY_URL;

const Calendar = () => {
  const navigate = useNavigate();
  const { projectID: currentProjectID } = useParams();
  const location = useLocation();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [maxSchedulesToShow, setMaxSchedulesToShow] = useState(2);

  // 일정 상태 추가
  const [allSchedules, setAllSchedules] = useState([]);
  const [scheduleLoading, setScheduleLoading] = useState(false);
  const [scheduleError, setScheduleError] = useState(null);
  const [myUserInfo, setMyUserInfo] = useState(null);
  const [myUserPk, setMyUserPk] = useState(null);

  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const query = new URLSearchParams(location.search);
  const refreshParam = query.get("refresh");

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDay = new Date(year, month, 1);
  const startDay = new Date(firstDay);
  startDay.setDate(1 - firstDay.getDay());

  const lastDay = new Date(year, month + 1, 0);
  const endDay = new Date(lastDay);
  endDay.setDate(lastDay.getDate() + (6 - lastDay.getDay()));

  const isDashboard = location.pathname === "/dashboard";

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = sessionStorage.getItem("token");
        const response = await fetch(`${API_URL}/api/users/me`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          console.log("사용자 정보:", data);
          setMyUserInfo(data);
        } else {
          console.error("사용자 정보 조회 실패:", response.status);
        }
      } catch (err) {
        console.error("사용자 정보 조회 에러:", err);
      }
    };
    fetchUserInfo();
  }, []);

  useEffect(() => {
    const updateMaxSchedules = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      if (width >= 2560) {
        setMaxSchedulesToShow(5);
      } else if (width >= 1920 && height >= 1080) {
        setMaxSchedulesToShow(4);
      } else if (width >= 1440) {
        setMaxSchedulesToShow(3);
      } else {
        setMaxSchedulesToShow(2);
      }
    };

    updateMaxSchedules();

    let resizeTimer;
    const debouncedUpdate = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(updateMaxSchedules, 150);
    };

    window.addEventListener("resize", debouncedUpdate);
    return () => {
      clearTimeout(resizeTimer);
      window.removeEventListener("resize", debouncedUpdate);
    };
  }, []);

  const groupDatesByWeek = (startDay, endDay) => {
    const weeks = [];
    let currentWeek = [];
    let currentDate = new Date(startDay);

    while (currentDate <= endDay) {
      currentWeek.push(new Date(currentDate));
      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }

    if (currentWeek.length > 0) {
      weeks.push(currentWeek);
    }

    return weeks;
  };

  const weeks = groupDatesByWeek(startDay, endDay);

  const handlePervMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  };

  const handleNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  };

  const handleDateClick = (day) => {
    if (isDashboard) {
      return;
    }

    const year = day.getFullYear();
    const month = String(day.getMonth() + 1).padStart(2, "0");
    const date = String(day.getDate()).padStart(2, "0");
    const dateString = `${year}-${month}-${date}`;
    navigate(
      `/project/${currentProjectID}/calendar?selectedDate=${dateString}`
    );
  };

  const fetchSchedules = useCallback(async () => {
    if (!myUserInfo) {
      return;
    }

    let apiUrl;
    const projectIDToFilter = currentProjectID;

    if (isDashboard) {
      apiUrl = `${API_URL}/api/calendar/me`;
    } else if (currentProjectID) {
      apiUrl = `${API_URL}/api/calendar/projects/${currentProjectID}`;
    } else {
      return;
    }

    setAllSchedules([]);
    setScheduleLoading(true);
    setScheduleError(null);
    try {
      const token = sessionStorage.getItem("token");

      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();

        let finalSchedules = data;

        // 프로젝트 필터링 (대시보드가 아닐 때)
        if (projectIDToFilter && !isDashboard) {
          let numericProjectID = parseInt(projectIDToFilter);
          finalSchedules = data.filter((schedule) => {
            return schedule.projectPk === numericProjectID;
          });
        }

        // myUserPk를 일정 데이터에서 추출 (첫 실행시)
        if (!myUserPk && finalSchedules.length > 0) {
          // 내 email로 participants에서 userPk 찾기
          for (const schedule of finalSchedules) {
            if (Array.isArray(schedule.participants)) {
              const me = schedule.participants.find(
                (p) => p.email === myUserInfo.email
              );
              if (me) {
                setMyUserPk(me.userPk);
                break;
              }
            }
          }
        }

        let schedulesToDisplay = finalSchedules;

        if (isDashboard) {
          schedulesToDisplay = finalSchedules.filter((schedule) => {
            // createUserName으로 확인 (임시)
            const isCreatorByName = schedule.createUserName === myUserInfo.name;

            // myUserPk가 있으면 participants에서 확인
            const isParticipant =
              myUserPk &&
              Array.isArray(schedule.participants) &&
              schedule.participants.some(
                (participant) => Number(participant.userPk) === Number(myUserPk)
              );

            // email로 participants 확인 (보조)
            const isParticipantByEmail =
              Array.isArray(schedule.participants) &&
              schedule.participants.some(
                (participant) => participant.email === myUserInfo.email
              );

            const result =
              isCreatorByName || isParticipant || isParticipantByEmail;

            return result;
          });
        }

        setAllSchedules(schedulesToDisplay);
      }
    } catch (err) {
      setScheduleError(err.message);
      setAllSchedules([]);
    } finally {
      setScheduleLoading(false);
    }
  }, [
    currentProjectID,
    isDashboard,
    refreshParam,
    year,
    month,
    myUserInfo,
    myUserPk,
  ]);

  useEffect(() => {
    fetchSchedules();
  }, [fetchSchedules]);

  useEffect(() => {
    const handleScheduleUpdate = () => {
      fetchSchedules();
    };

    window.addEventListener("scheduleUpdated", handleScheduleUpdate);

    return () => {
      window.removeEventListener("scheduleUpdated", handleScheduleUpdate);
    };
  }, [fetchSchedules]);

  const getDailySchedules = (day) => {
    const dayStart = new Date(day);
    dayStart.setHours(0, 0, 0, 0);

    const dayEnd = new Date(day);
    dayEnd.setHours(23, 59, 59, 999);

    return allSchedules.filter((schedule) => {
      const scheduleStart = new Date(schedule.startTime);
      const scheduleEnd = new Date(schedule.endTime);

      return scheduleStart <= dayEnd && scheduleEnd >= dayStart;
    });
  };

  return (
    <div className={`Calendar-container ${isDashboard ? "dashboard" : ""}`}>
      <div className="Month-container">
        <button className="prevButton" onClick={handlePervMonth}>
          <img src={leftIcon} className="leftIcon" alt="이전 달" />
        </button>
        <div className="Month">
          {year}년 {month + 1}월
        </div>
        <button className="nextButton" onClick={handleNextMonth}>
          <img src={rightIcon} className="rightIcon" alt="다음 달" />
        </button>
      </div>
      <div className="Calendar">
        <div className="calendar-week">
          {["일", "월", "화", "수", "목", "금", "토"].map((day) => (
            <div key={day} className="calendar-weekday">
              {day}
            </div>
          ))}
        </div>
        {scheduleError && (
          <p style={{ color: "red", textAlign: "center" }}>
            일정 로드 중 에러 발생: {scheduleError}
          </p>
        )}
        {scheduleLoading && (
          <p style={{ textAlign: "center", padding: "10px" }}>
            일정 로딩 중...
          </p>
        )}
        {!scheduleLoading &&
          !scheduleError &&
          weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="calendar-day">
              {week.map((day, dayIndex) => {
                const isClickable = !isDashboard && day.getMonth() === month;
                const dailySchedules = getDailySchedules(day);

                const cellClasses = [
                  "calendar-day-cell",
                  day.getMonth() !== month ? "prev-next-month" : "",
                  isClickable ? "clickable-cell" : "",
                ]
                  .filter(Boolean)
                  .join(" ");

                return (
                  <div
                    key={dayIndex}
                    className={cellClasses}
                    onClick={() => handleDateClick(day)}
                  >
                    <div className="calendar-date">{day.getDate()}</div>
                    <div className="schedule-list-in-cell">
                      {dailySchedules
                        .slice(0, maxSchedulesToShow)
                        .map((schedule) => (
                          <div
                            key={schedule.eventPk}
                            className="calendar-schedule-item"
                            style={{
                              backgroundColor: isDashboard
                                ? "#808080"
                                : schedule.color || "#D9D9D9",
                              color: "#ffffff",
                              fontWeight: 550,
                            }}
                            title={
                              isDashboard
                                ? `[${schedule.projectName}] ${schedule.title}`
                                : schedule.title
                            }
                          >
                            {isDashboard
                              ? `[${schedule.projectName}] ${schedule.title}`
                              : schedule.title}
                          </div>
                        ))}
                      {dailySchedules.length > maxSchedulesToShow && (
                        <div className="more-schedules">
                          + {dailySchedules.length - maxSchedulesToShow}개의
                          일정
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
      </div>
    </div>
  );
};

export default Calendar;
