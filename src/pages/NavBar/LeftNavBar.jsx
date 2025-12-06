// LeftNavBar.jsx
import React, { useCallback, useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "./NavBar.css";
import plusIcon from "./../../asset/Icon/plusIcon_white.svg";
import trashIcon from "./../../asset/Icon/trashIcon.svg";
import editIcon from "./../../asset/Icon/editIcon.svg";

const API_URL = import.meta.env.VITE_DEV_PROXY_URL;

const formatUTCDateForInput = (dateObj) => {
  if (!dateObj) return "";
  const year = dateObj.getUTCFullYear();
  const month = String(dateObj.getUTCMonth() + 1).padStart(2, "0");
  const day = String(dateObj.getUTCDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const formatLocalDateForInput = (dateObj) => {
  if (!dateObj) return "";
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, "0");
  const day = String(dateObj.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const COLOR_OPTIONS = [
  { id: 1, color: "#F66366", name: "빨강" },
  { id: 2, color: "#F0E159", name: "노랑" },
  { id: 3, color: "#62E36D", name: "초록" },
  { id: 4, color: "#5CDBEE", name: "파랑" },
  { id: 5, color: "#9B8AE9", name: "보라" },
];

const generateTimeOptions = () => {
  const options = [];
  for (let h = 0; h < 24; h++) {
    for (let m = 0; m < 60; m += 15) {
      const hour = String(h).padStart(2, "0");
      const minute = String(m).padStart(2, "0");
      options.push(`${hour}:${minute}`);
    }
  }
  return options;
};

const TIME_OPTIONS = generateTimeOptions();

// 일정 추가
const AddScheduleForm = ({ date, onCancel, onScheduleAdded, projectId }) => {
  // 폼 입력 상태 관리
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedColor, setSelectedColor] = useState(COLOR_OPTIONS[0].color);
  const [startDate, setStartDate] = useState(formatLocalDateForInput(date));
  const [startTime, setStartTime] = useState("09:00");
  const [endDate, setEndDate] = useState(formatLocalDateForInput(date));
  const [endTime, setEndTime] = useState("18:00");
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [projectMembers, setProjectMembers] = useState([]);
  const [selectedParticipants, setSelectedParticipants] = useState([]);
  const [membersLoading, setMembersLoading] = useState(false);

  useEffect(() => {
    const fetchProjectMembers = async () => {
      if (!projectId) return;

      setMembersLoading(true);
      try {
        const token = sessionStorage.getItem("token");

        const response = await fetch(`${API_URL}/api/projects/${projectId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          const activeMembers = data.members.filter(
            (member) => member.status === "APPROVED"
          );

          setProjectMembers(activeMembers);
        } else {
          console.error("멤버 조회 실패:", response.status);
        }
      } catch (err) {
        console.error("멤버 조회 에러:", err);
      } finally {
        setMembersLoading(false);
      }
    };
    fetchProjectMembers();
  }, [projectId]);

  const handleSave = async () => {
    // 1. 입력값 파싱
    const [startHour, startMinute] = startTime.split(":").map(Number);
    const [endHour, endMinute] = endTime.split(":").map(Number);
    const [startYear, startMonth, startDay] = startDate.split("-").map(Number);
    const [endYear, endMonth, endDay] = endDate.split("-").map(Number);

    // 2. Date.UTC를 사용하여 "보이는 시간 그대로" UTC 타임스탬프 생성 (예: 09:00 입력 -> 09:00 UTC)
    const startDateTimeBase = new Date(
      Date.UTC(startYear, startMonth - 1, startDay, startHour, startMinute)
    );
    const endDateTimeBase = new Date(
      Date.UTC(endYear, endMonth - 1, endDay, endHour, endMinute)
    );

    // 3. 한국 시간 보정 (-9시간)하여 실제 UTC 시간 구하기
    const startDateTimeUTC = new Date(
      startDateTimeBase.getTime() - 9 * 60 * 60 * 1000
    );
    const endDateTimeUTC = new Date(
      endDateTimeBase.getTime() - 9 * 60 * 60 * 1000
    );

    if (startDateTimeUTC >= endDateTimeUTC) {
      alert("종료 시간은 시작 시간보다 늦어야 합니다.");
      return;
    }

    if (!title.trim()) {
      alert("일정 제목을 입력해 주세요.");
      return;
    }

    setLoading(true);
    setSubmitError(null);

    const scheduleData = {
      title: title,
      startTime: startDateTimeUTC.toISOString(),
      endTime: endDateTimeUTC.toISOString(),
      description: description,
      color: selectedColor,
      participantUserPks: selectedParticipants,
    };

    // ... (fetch 요청 부분은 기존과 동일)
    try {
      const token = sessionStorage.getItem("token");

      const response = await fetch(
        `${API_URL}/api/calendar/projects/${projectId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(scheduleData),
        }
      );

      if (response.ok) {
        window.dispatchEvent(new CustomEvent("scheduleUpdated"));
        onScheduleAdded();
        onCancel();
      } else {
        const errorText = await response.text();
        console.error("일정 저장 실패:", response.status, errorText);
        setSubmitError(`일정 저장 실패 (HTTP ${response.status})`);
      }
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleParticipantToggle = (userPk) => {
    setSelectedParticipants((prev) =>
      prev.includes(userPk)
        ? prev.filter((pk) => pk !== userPk)
        : [...prev, userPk]
    );
  };

  return (
    <div className="AddScheduleForm">
      <p className="formDate">일정명 & 태그</p>
      {submitError && <p style={{ color: "red" }}>에러: {submitError}</p>}

      <input
        type="text"
        placeholder="일정 제목"
        className="formInput"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        disabled={loading}
      />
      <div className="colorSelector">
        <div className="colorTagBorder">
          <div className="colorOptions">
            {COLOR_OPTIONS.map((option) => (
              <button
                key={option.id}
                type="button"
                className={`colorOption ${
                  selectedColor === option.color ? "selected" : ""
                }`}
                style={{
                  backgroundColor: option.color,
                  border:
                    selectedColor === option.color
                      ? "3px solid #000"
                      : "2px solid #ddd",
                }}
                onClick={() => setSelectedColor(option.color)}
                disabled={loading}
                aria-label={option.name}
              />
            ))}
          </div>
        </div>
      </div>
      <div className="dateTimeContainer">
        <div className="dateTitle">일자</div>
        <div className="dateInputContainer">
          <div className="dateTimeGroup">
            <div className="dateTimeInputs">
              <input
                type="date"
                className="dateInput"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                disabled={loading}
              />
              <select
                className="timeInput"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                disabled={loading}
              >
                {TIME_OPTIONS.map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="dateTimeGroup">
            <div className="dateTimeInputs">
              <input
                type="date"
                className="dateInput"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                disabled={loading}
              />
              <select
                className="timeInput"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                disabled={loading}
              >
                {TIME_OPTIONS.map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
      <div className="textContainer">
        <div className="dateTitle">내용</div>
        <textarea
          placeholder="상세 내용"
          className="formTextarea"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={loading}
        />
      </div>
      <div className="participantSelector">
        <div className="dateTitle">참가자</div>

        {membersLoading ? (
          // 로딩 중
          <p className="loadingText">멤버 로딩 중...</p>
        ) : projectMembers.length > 0 ? (
          // 멤버 목록 표시
          <div className="participantList">
            {projectMembers.map((member) => (
              <label key={member.userPk} className="participantItem">
                <input
                  type="checkbox"
                  checked={selectedParticipants.includes(member.userPk)}
                  onChange={() => handleParticipantToggle(member.userPk)}
                  disabled={loading}
                />
                <span className="participantName">
                  {member.name}
                  <span className="participantRole">
                    {member.role === "OWNER" ? " (소유자)" : ""}
                  </span>
                </span>
              </label>
            ))}
          </div>
        ) : (
          // 멤버가 없을 때
          <p className="noMembers">프로젝트 멤버가 없습니다.</p>
        )}
      </div>
      <div className="formActions">
        <button onClick={handleSave} className="saveButton" disabled={loading}>
          {loading ? "저장 중..." : "저장"}
        </button>
        <button onClick={onCancel} className="cancelButton" disabled={loading}>
          취소
        </button>
      </div>
    </div>
  );
};

const EditScheduleForm = ({
  schedule,
  onCancel,
  onScheduleUpdated,
  projectId,
}) => {
  const [title, setTitle] = useState(schedule.title || "");
  const [description, setDescription] = useState(schedule.description || "");
  const [selectedColor, setSelectedColor] = useState(
    schedule.color || COLOR_OPTIONS[0].color
  );
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [projectMembers, setProjectMembers] = useState([]);
  const [membersLoading, setMembersLoading] = useState(false);
  const [selectedParticipants, setSelectedParticipants] = useState(
    Array.isArray(schedule.participants)
      ? schedule.participants.map((p) => p.userPk)
      : []
  );

  const getKSTDateTime = (utcDateString) => {
    if (!utcDateString) return { date: "", time: "09:00" };

    // 'Z'가 없으면 붙여서 브라우저가 강제로 UTC로 인식하게 함
    const dateStr = utcDateString.endsWith("Z")
      ? utcDateString
      : utcDateString + "Z";

    const date = new Date(dateStr);

    // UTC 타임스탬프에 9시간(ms)을 더해 KST 기준의 타임스탬프 생성
    const kstDate = new Date(date.getTime() + 9 * 60 * 60 * 1000);

    return {
      // 9시간이 더해진 시점의 UTC 날짜/시간을 가져오면 한국 시간이 됨
      date: formatUTCDateForInput(kstDate),
      time: `${String(kstDate.getUTCHours()).padStart(2, "0")}:${String(
        kstDate.getUTCMinutes()
      ).padStart(2, "0")}`,
    };
  };

  const startKST = getKSTDateTime(schedule.startTime);
  const endKST = getKSTDateTime(schedule.endTime);

  const [startDate, setStartDate] = useState(startKST.date);
  const [startTime, setStartTime] = useState(startKST.time);
  const [endDate, setEndDate] = useState(endKST.date);
  const [endTime, setEndTime] = useState(endKST.time);

  useEffect(() => {
    const fetchProjectMembers = async () => {
      if (!projectId) return;

      setMembersLoading(true);
      try {
        const token = sessionStorage.getItem("token");

        const response = await fetch(`${API_URL}/api/projects/${projectId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          const activeMembers = (data.members || []).filter(
            (member) => member.status === "APPROVED"
          );
          setProjectMembers(activeMembers);
        } else {
          console.error("멤버 조회 실패:", response.status);
        }
      } catch (err) {
        console.error("멤버 조회 에러:", err);
      } finally {
        setMembersLoading(false);
      }
    };
    fetchProjectMembers();
  }, [projectId]);

  const handleParticipantToggle = (userPk) => {
    setSelectedParticipants((prev) =>
      prev.includes(userPk)
        ? prev.filter((pk) => pk !== userPk)
        : [...prev, userPk]
    );
  };

  const handleUpdate = async () => {
    if (!title?.trim() || !projectId || !schedule.eventPk) {
      alert("제목 입력은 필수입니다.");
      return;
    }

    if (!startDate || !endDate) {
      alert("시작 날짜와 종료 날짜는 필수입니다.");
      return;
    }

    const [startHour, startMinute] = startTime.split(":").map(Number);
    const [endHour, endMinute] = endTime.split(":").map(Number);
    const [startYear, startMonth, startDay] = startDate.split("-").map(Number);
    const [endYear, endMonth, endDay] = endDate.split("-").map(Number);

    // [수정 핵심 2] 저장 로직 (KST 입력 -> UTC 서버 전송)
    // 1. 입력받은 시간을 UTC 기준이라고 가정하고 타임스탬프 생성 (예: 17일 02:00 입력 -> 17일 02:00 UTC)
    const startDateTimeBase = new Date(
      Date.UTC(startYear, startMonth - 1, startDay, startHour, startMinute)
    );
    const endDateTimeBase = new Date(
      Date.UTC(endYear, endMonth - 1, endDay, endHour, endMinute)
    );

    // 2. 거기서 9시간을 빼서 실제 UTC 시간으로 보정 (예: 17일 02:00 UTC - 9시간 = 16일 17:00 UTC)
    const startDateTimeUTC = new Date(
      startDateTimeBase.getTime() - 9 * 60 * 60 * 1000
    );
    const endDateTimeUTC = new Date(
      endDateTimeBase.getTime() - 9 * 60 * 60 * 1000
    );

    if (startDateTimeUTC >= endDateTimeUTC) {
      alert("종료 시간은 시작 시간보다 늦어야 합니다.");
      return;
    }

    setLoading(true);
    setSubmitError(null);

    const scheduleData = {
      title: title,
      startTime: startDateTimeUTC.toISOString(),
      endTime: endDateTimeUTC.toISOString(),
      description: description,
      color: selectedColor,
      participantUserPks: selectedParticipants,
    };

    try {
      const token = sessionStorage.getItem("token");

      const response = await fetch(
        `${API_URL}/api/calendar/projects/${projectId}/${schedule.eventPk}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(scheduleData),
        }
      );

      if (response.ok) {
        window.dispatchEvent(new CustomEvent("scheduleUpdated"));
        onScheduleUpdated();
        onCancel();
      } else {
        const errorText = await response.text();
        console.error("일정 수정 실패:", response.status, errorText);
        setSubmitError(`일정 수정 실패 (HTTP ${response.status})`);
      }
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="AddScheduleForm">
      <p className="formDate">일정명 & 태그</p>
      {submitError && <p style={{ color: "red" }}>에러: {submitError}</p>}

      <input
        type="text"
        placeholder="일정 제목"
        className="formInput"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        disabled={loading}
      />
      <div className="colorSelector">
        <div className="colorTagBorder">
          <div className="colorOptions">
            {COLOR_OPTIONS.map((option) => (
              <button
                key={option.id}
                type="button"
                className={`colorOption ${
                  selectedColor === option.color ? "selected" : ""
                }`}
                style={{
                  backgroundColor: option.color,
                  border:
                    selectedColor === option.color
                      ? "3px solid #000"
                      : "2px solid #ddd",
                }}
                onClick={() => setSelectedColor(option.color)}
                disabled={loading}
                aria-label={option.name}
              />
            ))}
          </div>
        </div>
      </div>
      <div className="dateTimeContainer">
        <div className="dateTitle">일자</div>
        <div className="dateInputContainer">
          <div className="dateTimeGroup">
            <div className="dateTimeInputs">
              <input
                type="date"
                className="dateInput"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                disabled={loading}
              />
              <select
                className="timeInput"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                disabled={loading}
              >
                {TIME_OPTIONS.map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="dateTimeGroup">
            <div className="dateTimeInputs">
              <input
                type="date"
                className="dateInput"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                disabled={loading}
              />
              <select
                className="timeInput"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                disabled={loading}
              >
                {TIME_OPTIONS.map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
      <div className="textContainer">
        <div className="dateTitle">내용</div>
        <textarea
          placeholder="상세 내용"
          className="formTextarea"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={loading}
        />
      </div>
      <div className="participantSelector">
        <div className="dateTitle">참가자</div>

        {membersLoading ? (
          <p className="loadingText">멤버 로딩 중...</p>
        ) : projectMembers.length > 0 ? (
          <div className="participantList">
            {projectMembers.map((member) => (
              <label key={member.userPk} className="participantItem">
                <input
                  type="checkbox"
                  checked={selectedParticipants.includes(member.userPk)}
                  onChange={() => handleParticipantToggle(member.userPk)}
                  disabled={loading}
                />
                <span className="participantName">
                  {member.name}
                  <span className="participantRole">
                    {member.role === "OWNER" ? " (소유자)" : ""}
                  </span>
                </span>
              </label>
            ))}
          </div>
        ) : (
          <p className="noMembers">프로젝트 멤버가 없습니다.</p>
        )}
      </div>
      <div className="formActions">
        <button
          onClick={handleUpdate}
          className="saveButton"
          disabled={loading}
        >
          {loading ? "수정 중..." : "수정"}
        </button>
        <button onClick={onCancel} className="cancelButton" disabled={loading}>
          취소
        </button>
      </div>
    </div>
  );
};

const ScheduleDetailView = ({ schedule, onClose, onEdit, onDelete }) => {
  const scheduleStartDate = new Date(schedule.startTime);
  const scheduleEndDate = new Date(schedule.endTime);

  // 같은 날인지 확인
  const isSameDay =
    scheduleStartDate.getUTCFullYear() === scheduleEndDate.getUTCFullYear() &&
    scheduleStartDate.getUTCMonth() === scheduleEndDate.getUTCMonth() &&
    scheduleStartDate.getUTCDate() === scheduleEndDate.getUTCDate();

  // 시작일 포맷팅
  const formattedStartDate = scheduleStartDate.toLocaleDateString("ko-KR", {
    month: "long",
    day: "numeric",
  });

  // 종료일 포맷팅
  const formattedEndDate = scheduleEndDate.toLocaleDateString("ko-KR", {
    month: "long",
    day: "numeric",
  });

  // 조건부 날짜 표시 (같은 날: 단일 날짜, 다른 날: 범위)
  const formattedDate = isSameDay
    ? formattedStartDate
    : `${formattedStartDate} ~ ${formattedEndDate}`;

  const getKSTTime = (utcDate) => {
    const utcHour = utcDate.getUTCHours();
    const utcMinute = utcDate.getUTCMinutes();
    let kstHour = utcHour + 9;

    if (kstHour >= 24) {
      kstHour -= 24;
    }

    const period = kstHour < 12 ? "오전" : "오후";
    const displayHour = kstHour % 12 || 12;

    return `${period} ${displayHour}:${String(utcMinute).padStart(2, "0")}`;
  };

  const formattedTime = `${getKSTTime(scheduleStartDate)} - ${getKSTTime(
    scheduleEndDate
  )}`;

  return (
    <div className="ScheduleDetailView">
      <div className="detailHeader">
        <h3 className="detailTitle">{schedule.title}</h3>
        <button onClick={onClose} className="closeButton">
          ✕
        </button>
      </div>

      <div className="detailContent">
        <div className="detailSection">
          <div className="detailLabel">날짜</div>
          <div className="detailValue">{formattedDate}</div>
        </div>

        <div className="detailSection">
          <div className="detailLabel">시간</div>
          <div className="detailValue">{formattedTime}</div>
        </div>

        {schedule.color && (
          <div className="detailSection">
            <div className="detailLabel">컬러</div>
            <div className="detailValue">
              <div
                className="colorPreview"
                style={{ backgroundColor: schedule.color }}
              ></div>
            </div>
          </div>
        )}

        {schedule.description && (
          <div className="detailSection">
            <div className="detailLabel">상세 내용</div>
            <div className="detailValue detailDescription">
              {schedule.description}
            </div>
          </div>
        )}

        <div className="detailSection">
          <div className="detailLabel">생성자</div>
          <div className="detailValue">{schedule.createUserName}</div>
        </div>

        {schedule.participants && schedule.participants.length > 0 && (
          <div className="detailSection">
            <div className="detailLabel">참가자</div>
            <div className="detailValue">
              <div className="participantsList">
                {schedule.participants.map((participant) => (
                  <div key={participant.userPk} className="participantChip">
                    {participant.name}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="detailActions">
        <button onClick={onEdit} className="editDetailButton">
          수정
        </button>
        <button onClick={onDelete} className="deleteDetailButton">
          삭제
        </button>
      </div>
    </div>
  );
};

const LeftNavBar = ({ isCalendarPage, onContentChange }) => {
  const [projects, setProjects] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scheduleLoading, setScheduleLoading] = useState(false);
  const [error, setError] = useState(null);
  const [scheduleError, setScheduleError] = useState(null);
  const [isAddingSchedule, setIsAddingSchedule] = useState(false);
  const [isEditingSchedule, setIsEditingSchedule] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [isViewingSchedule, setIsViewingSchedule] = useState(false);
  const [scheduleDetailLoading, setScheduleDetailLoading] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [myUserPk, setMyUserPk] = useState(null);
  const [myUserInfo, setMyUserInfo] = useState(null);

  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const selectedDateFromURL = query.get("selectedDate");

  const currentProjectIdFromURL = location.pathname.startsWith("/project/")
    ? parseInt(location.pathname.split("/project/")[1], 10)
    : null;

  const dateToDisplay = selectedDateFromURL
    ? new Date(`${selectedDateFromURL}T00:00:00`)
    : null;
  const formattedDate =
    dateToDisplay && !isNaN(dateToDisplay)
      ? dateToDisplay.toLocaleDateString("ko-KR", {
          month: "long",
          day: "numeric",
        })
      : "날짜를 선택해 주세요.";

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

          // userPk가 있으면 바로 저장
          if (data.userPk) {
            setMyUserPk(data.userPk);
          }

          // email도 저장 (백업용)
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

  const handleViewSchedule = async (schedule) => {
    setScheduleDetailLoading(true);
    setIsViewingSchedule(true);

    try {
      const token = sessionStorage.getItem("token");
      const response = await fetch(
        `${API_URL}/api/calendar/project/${selectedProjectId}/${schedule.eventPk}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setSelectedSchedule(data);
      } else {
        const errorText = await response.text();
        console.error("일정 상세 조회 실패:", response.status, errorText);
        alert(`일정 조회 실패 (HTTP ${response.status})`);
        setIsViewingSchedule(false);
      }
    } catch (err) {
      console.error("일정 상세 조회 에러:", err);
      alert(`일정 조회 에러: ${err.message}`);
      setIsViewingSchedule(false);
    } finally {
      setScheduleDetailLoading(false);
    }
  };

  const handleCloseScheduleDetail = () => {
    setIsViewingSchedule(false);
    setSelectedSchedule(null);
    setIsEditingSchedule(false);
    setEditingSchedule(null);
  };

  useEffect(() => {
    if (isViewingSchedule || isEditingSchedule) {
      setIsViewingSchedule(false);
      setSelectedSchedule(null);
      setIsEditingSchedule(false);
      setEditingSchedule(null);
    }
  }, [selectedDateFromURL]);

  const handleAddScheduleClick = () => {
    if (dateToDisplay && !isNaN(dateToDisplay)) {
      if (selectedProjectId) {
        setIsAddingSchedule(true);
        setIsEditingSchedule(false);
      } else {
        alert("일정을 추가할 프로젝트를 먼저 선택해 주세요.");
      }
    }
  };

  const handleCancelAddSchedule = () => {
    setIsAddingSchedule(false);
    setIsEditingSchedule(false);
    setEditingSchedule(null);
    setIsViewingSchedule(false);
    setSelectedSchedule(null);
  };

  const handleEditSchedule = (schedule) => {
    const isCreator = Number(schedule.createUserId) === Number(myUserPk);

    const isParticipant = schedule.participants?.some(
      (participant) => Number(participant.userPk) === Number(myUserPk)
    );

    if (!isParticipant && !isCreator) {
      alert("수정 권한이 없습니다. (일정 생성자 또는 참가자만 수정 가능)");
      return;
    }

    setEditingSchedule(schedule);
    setIsEditingSchedule(true);
    setIsAddingSchedule(false);
  };

  const handleDeleteSchedule = async (eventPk, schedule) => {
    if (!window.confirm("정말로 이 일정을 삭제하시겠습니까?")) {
      return;
    }
    const isCreator = Number(schedule.createUserId) === Number(myUserPk);

    const isParticipant = schedule.participants?.some(
      (participant) => Number(participant.userPk) === Number(myUserPk)
    );

    if (!isParticipant && !isCreator) {
      alert("삭제 권한이 없습니다. (일정 생성자 또는 참가자만 삭제 가능)");
      return;
    }

    try {
      const token = sessionStorage.getItem("token");

      const response = await fetch(
        `${API_URL}/api/calendar/projects/${selectedProjectId}/${eventPk}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.ok) {
        window.dispatchEvent(new CustomEvent("scheduleUpdated"));
        setRefreshTrigger((prev) => prev + 1);
      } else {
        const errorText = await response.text();
        console.error("일정 삭제 실패:", response.status, errorText);
        alert(`일정 삭제 실패 (HTTP ${response.status})`);
      }
    } catch (err) {
      console.error("일정 삭제 에러:", err);
      alert(`일정 삭제 에러: ${err.message}`);
    }
  };

  const handleProjectSelect = useCallback((projectPk) => {
    setSelectedProjectId(projectPk);
    setIsAddingSchedule(false);
    setIsEditingSchedule(false);
    setEditingSchedule(null);
  }, []);

  useEffect(() => {
    if (isCalendarPage && onContentChange) {
      if (isAddingSchedule || isEditingSchedule || isViewingSchedule) {
        // Schedule Form (추가/편집) 또는 Schedule Detail View (상세 보기)
        onContentChange("SCHEDULE_VIEW");
      } else if (
        dateToDisplay &&
        !isNaN(dateToDisplay.getTime()) &&
        selectedProjectId
      ) {
        // Daily Schedules List (일별 일정 목록)
        onContentChange("SCHEDULE_LIST");
      } else {
        // Project List (프로젝트 목록) 또는 초기 안내
        onContentChange("PROJECT_LIST");
      }
    } else if (!isCalendarPage && onContentChange) {
      // 캘린더 페이지가 아닐 때 (기본 프로젝트 목록 뷰)
      onContentChange("PROJECT_LIST");
    }
  }, [
    isCalendarPage,
    onContentChange,
    isAddingSchedule,
    isEditingSchedule,
    isViewingSchedule,
    dateToDisplay,
    selectedProjectId,
  ]);

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

  useEffect(() => {
    if (projects.length === 0) return;

    if (isCalendarPage && currentProjectIdFromURL) {
      const urlProject = projects.find(
        (p) => p.projectPk === currentProjectIdFromURL
      );
      if (urlProject && selectedProjectId !== currentProjectIdFromURL) {
        setSelectedProjectId(currentProjectIdFromURL);
        return;
      }
    }

    if (selectedProjectId === null) {
      setSelectedProjectId(projects[0].projectPk);
    }
  }, [projects, selectedProjectId, isCalendarPage, currentProjectIdFromURL]);

  const fetchSchedules = useCallback(async () => {
    if (
      !isCalendarPage ||
      !selectedDateFromURL ||
      isNaN(dateToDisplay.getTime()) ||
      isAddingSchedule ||
      isEditingSchedule ||
      !selectedProjectId
    ) {
      setSchedules([]);
      setScheduleError(null);
      return;
    }

    const projectIdToUse = selectedProjectId;

    setScheduleLoading(true);
    setScheduleError(null);
    try {
      const token = sessionStorage.getItem("token");

      const response = await fetch(
        `${API_URL}/api/calendar/projects/${projectIdToUse}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();

        // myUserPk가 없으면 participants에서 찾기
        if (!myUserPk && myUserInfo?.email && data.length > 0) {
          for (const schedule of data) {
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

        // 1단계: 날짜 필터링
        const selectedDate = new Date(selectedDateFromURL);
        selectedDate.setHours(0, 0, 0, 0);
        const dateFilteredSchedules = data.filter((schedule) => {
          const scheduleStart = new Date(schedule.startTime);
          const scheduleEnd = new Date(schedule.endTime);

          scheduleStart.setHours(0, 0, 0, 0);
          scheduleEnd.setHours(0, 0, 0, 0);

          return selectedDate >= scheduleStart && selectedDate <= scheduleEnd;
        });

        // 2단계: 사용자 필터링
        let finalSchedules = dateFilteredSchedules;

        setSchedules(finalSchedules);
      } else {
        const errorText = await response.text();
        console.error(
          "Schedule HTTP Status:",
          response.status,
          "Error Body:",
          errorText
        );
        setScheduleError(`일정 로드 실패 (HTTP ${response.status})`);
        setSchedules([]);
      }
    } catch (err) {
      setScheduleError(err.message);
      setSchedules([]);
    } finally {
      setScheduleLoading(false);
    }
  }, [
    isCalendarPage,
    selectedDateFromURL,
    dateToDisplay,
    isAddingSchedule,
    isEditingSchedule,
    selectedProjectId,
    refreshTrigger,
    myUserPk,
    myUserInfo,
  ]);

  const handleScheduleAdded = useCallback(() => {
    setRefreshTrigger((prev) => prev + 1);
  }, []);

  const handleScheduleUpdated = useCallback(() => {
    setRefreshTrigger((prev) => prev + 1);
  }, []);

  useEffect(() => {
    fetchSchedules();
  }, [
    isCalendarPage,
    selectedDateFromURL,
    isAddingSchedule,
    isEditingSchedule,
    selectedProjectId,
    refreshTrigger,
    myUserPk,
  ]);

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
    return (
      <div>
        {/* 사이드바 */}
        <div className="NavBar-left">
          <div className="ProjectListContainer">
            <h2 className="projectTitle">프로젝트</h2>
            <div className="projectList">에러 : {error}</div>
          </div>
        </div>
      </div>
    );
  }

  const projectList = projects.map((project) => {
    const isCurrentProject = project.projectPk === currentProjectIdFromURL;
    const isSelectedProject = project.projectPk === selectedProjectId;

    return (
      <div
        key={project.projectPk}
        className={`Project-item ${isSelectedProject ? "selected" : ""}`}
      >
        {isCalendarPage ? (
          // 캘린더 페이지: 클릭하면 selectedProjectId 상태 변경
          <button
            onClick={() => handleProjectSelect(project.projectPk)}
            className={`ProjectButton ${isSelectedProject ? "active" : ""}`}
          >
            <div className="projectSelect"></div>
            <div className="ProjectText">{project.projectName}</div>
          </button>
        ) : (
          // 캘린더 페이지가 아닐 때 (프로젝트 페이지)
          <Link
            to={`/project/${project.projectPk}`}
            className={`ProjectButton ${isCurrentProject ? "active" : ""}`}
          >
            <div className="projectSelect"></div>
            <div className="ProjectText">{project.projectName}</div>
          </Link>
        )}
      </div>
    );
  });

  const scheduleList = schedules.map((schedule) => (
    <div
      key={schedule.eventPk}
      className="Schedule-item"
      style={{ borderColor: schedule.color || "#D9D9D9" }}
    >
      <div
        className="colorTag"
        style={{ backgroundColor: schedule.color || "#D9D9D9" }}
      ></div>
      <div
        className="ScheduleText"
        onClick={() => handleViewSchedule(schedule)}
      >
        {schedule.title}
      </div>
      <div className="scheduleButtons">
        <img
          src={editIcon}
          alt="editIcon"
          className="iconButton"
          onClick={(e) => {
            e.stopPropagation();
            handleEditSchedule(schedule);
          }}
          style={{ cursor: "pointer" }}
        />
        <img
          src={trashIcon}
          alt="trashIcon"
          className="iconButton"
          onClick={(e) => {
            e.stopPropagation();
            handleDeleteSchedule(schedule.eventPk, schedule);
          }}
          style={{ cursor: "pointer" }}
        />
      </div>
    </div>
  ));

  return (
    <div>
      <div className="NavBar-left">
        {!isCalendarPage && (
          <div className="ProjectListContainer">
            <h2 className="projectTitle">프로젝트</h2>
            <div className="projectList">{projectList}</div>
          </div>
        )}

        {isCalendarPage && (
          <div className="ProjectListContainer">
            {!isAddingSchedule && (
              <div
                className={`scheduleTitle ${
                  isViewingSchedule || isEditingSchedule
                    ? "clickable-header"
                    : ""
                }`}
                onClick={
                  isViewingSchedule || isEditingSchedule
                    ? handleCloseScheduleDetail
                    : undefined
                }
                style={{
                  cursor:
                    isViewingSchedule || isEditingSchedule
                      ? "pointer"
                      : "default",
                }}
              >
                <div className="selectedDate">
                  {isEditingSchedule ? "일정 편집" : formattedDate}
                </div>
                {dateToDisplay &&
                  !isNaN(dateToDisplay) &&
                  !isEditingSchedule && ( // 편집 중이 아닐 때만 표시
                    <div
                      className="addSchedule"
                      onClick={handleAddScheduleClick}
                    >
                      <img src={plusIcon} alt="plusIcon" />
                      <div>일정 추가</div>
                    </div>
                  )}
              </div>
            )}
            <div className="ScheduleContent">
              {isAddingSchedule ? (
                <AddScheduleForm
                  date={dateToDisplay}
                  onCancel={handleCancelAddSchedule}
                  onScheduleAdded={handleScheduleAdded}
                  projectId={selectedProjectId}
                />
              ) : isEditingSchedule && editingSchedule ? (
                <EditScheduleForm
                  schedule={editingSchedule}
                  onCancel={handleCancelAddSchedule}
                  onScheduleUpdated={handleScheduleUpdated}
                  projectId={selectedProjectId}
                />
              ) : isViewingSchedule ? (
                scheduleDetailLoading ? (
                  <p className="SelectInstruction">일정 로딩 중...</p>
                ) : selectedSchedule ? (
                  <ScheduleDetailView
                    schedule={selectedSchedule}
                    onClose={handleCloseScheduleDetail}
                    onEdit={() => {
                      handleEditSchedule(selectedSchedule);
                      setIsViewingSchedule(false);
                    }}
                    onDelete={() => {
                      handleDeleteSchedule(
                        selectedSchedule.eventPk,
                        selectedSchedule
                      );
                      setIsViewingSchedule(false);
                    }}
                  />
                ) : (
                  <p className="SelectInstruction">
                    일정을 불러올 수 없습니다.
                  </p>
                )
              ) : (
                <>
                  {scheduleLoading ? (
                    <p className="SelectInstruction">일정 로딩 중...</p>
                  ) : scheduleError ? (
                    <p className="SelectInstruction">
                      일정 에러: {scheduleError}
                    </p>
                  ) : dateToDisplay && !isNaN(dateToDisplay) ? (
                    <div className="DailySchedules">
                      {projects.length === 0 ? (
                        <p className="SelectInstruction">
                          프로젝트를 찾을 수 없습니다.
                        </p>
                      ) : !selectedProjectId ? (
                        <p className="SelectInstruction">
                          일정을 보려면 프로젝트를 선택해 주세요.
                        </p>
                      ) : scheduleList.length > 0 ? (
                        scheduleList
                      ) : (
                        <p className="NoSchedule">
                          해당 날짜에 일정이 없습니다.
                        </p>
                      )}
                    </div>
                  ) : (
                    <p className="SelectInstruction">
                      달력에서 날짜를 클릭하여 일정을 확인하세요.
                    </p>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeftNavBar;
