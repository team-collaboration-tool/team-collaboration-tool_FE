import React, { useState } from "react";
import "./Calendar.css";
import leftIcon from "../../../asset/Icon/leftChevron.svg";
import rightIcon from "../../../asset/Icon/rightChevron.svg";
import { useNavigate, useParams } from "react-router-dom";

const Calendar = () => {
  const navigate = useNavigate();
  const { projectID } = useParams();
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDay = new Date(year, month, 1); // 이번 달의 첫째 날
  const startDay = new Date(firstDay); // 달력의 시작 날짜는 이번 달의 첫 날
  startDay.setDate(1 - firstDay.getDay()); // 첫째 날이 속한 주의 일요일로 설정

  const lastDay = new Date(year, month + 1, 0); // 이번 달의 마지막 날
  const endDay = new Date(lastDay);
  endDay.setDate(lastDay.getDate() + (6 - lastDay.getDay())); // 마지막 날이 속한 주의 토요일로 설정

  const groupDatesByWeek = (startDay, endDay) => {
    const weeks = [];
    let currentWeek = [];
    let currentDate = new Date(startDay);

    while (currentDate <= endDay) {
      currentWeek.push(new Date(currentDate));
      if (currentWeek.length === 7 || currentDate.getDay() === 6) {
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
    const dateString = day.toISOString().split("T")[0];
    navigate(`/project/${projectID}/calendar?selectedDate=${dateString}`);
  };

  return (
    <div className="Calendar-container">
      <div className="Month-container">
        <button className="prevButton" onClick={handlePervMonth}>
          <img src={leftIcon} className="leftIcon" />
        </button>
        <div className="Month">
          {year}년 {month + 1}월
        </div>
        <button className="nextButton" onClick={handleNextMonth}>
          <img src={rightIcon} className="rightIcon" />
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
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="calendar-day">
            {week.map((day, dayIndex) => (
              <div
                key={dayIndex}
                className={`calendar-day-cell ${
                  day.getMonth() !== month ? "prev-next-month" : ""
                }`}
                onClick={() => handleDateClick(day)}
              >
                <div className="calendar-date">{day.getDate()}</div>
                <div className="date"></div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Calendar;
