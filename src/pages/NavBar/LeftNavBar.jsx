// LeftNavBar.jsx
import React, { useCallback, useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "./NavBar.css";
import plusIcon from "./../../asset/Icon/plusIcon_white.svg";
import trashIcon from "./../../asset/Icon/trashIcon.svg";
import editIcon from "./../../asset/Icon/editIcon.svg";

const API_URL = import.meta.env.VITE_DEV_PROXY_URL;

const formatDateForInput = (dateObj) => {
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
  const [startDate, setStartDate] = useState(formatDateForInput(date));
  const [startTime, setStartTime] = useState("09:00");
  const [endDate, setEndDate] = useState(formatDateForInput(date));
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
        const token = localStorage.getItem("token");

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
    const [startHour, startMinute] = startTime.split(":").map(Number);
    const [endHour, endMinute] = endTime.split(":").map(Number);

    const startDateTime = new Date(startDate);
    startDateTime.setUTCHours(startHour - 9, startMinute, 0, 0);

    const endDateTime = new Date(endDate);
    endDateTime.setUTCHours(endHour - 9, endMinute, 0, 0);

    if (startDateTime >= endDateTime) {
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
      startTime: startDateTime.toISOString(),
      endTime: endDateTime.toISOString(),
      description: description,
      color: selectedColor,
      participantUserPks: selectedParticipants,
    };

    try {
      const token = localStorage.getItem("token");

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
        console.log("일정 저장 성공!");
        window.dispatchEvent(new CustomEvent("scheduleUpdated"));
        onScheduleAdded();
        onCancel(); // 폼 닫기
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
      <textarea
        placeholder="상세 내용"
        className="formTextarea"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        disabled={loading}
      />
      <div className="participantSelector">
        <p className="participantLabel">참가자 선택</p>

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

// ✅ 일정 편집 폼 (AddScheduleForm 아래에 추가)
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
    schedule.participants ? schedule.participants.map((p) => p.userPk) : []
  );

  const scheduleStartDate = new Date(schedule.startTime);
  const scheduleEndDate = new Date(schedule.endTime);

  const formattedDate = scheduleStartDate.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const [startDate, setStartDate] = useState(
    formatDateForInput(scheduleStartDate)
  );
  const [startTime, setStartTime] = useState(
    scheduleStartDate.toTimeString().substring(0, 5)
  );
  const [endDate, setEndDate] = useState(formatDateForInput(scheduleEndDate));
  const [endTime, setEndTime] = useState(
    scheduleEndDate.toTimeString().substring(0, 5)
  );

  useEffect(() => {
    const fetchProjectMembers = async () => {
      if (!projectId) return;

      setMembersLoading(true);
      try {
        const token = localStorage.getItem("token");

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

  const handleParticipantToggle = (userPk) => {
    setSelectedParticipants((prev) =>
      prev.includes(userPk)
        ? prev.filter((pk) => pk !== userPk)
        : [...prev, userPk]
    );
  };

  const handleUpdate = async () => {
    if (!title || !projectId || !schedule.eventPk) {
      alert("제목 입력은 필수입니다.");
      return;
    }

    if (!startDate || !endDate) {
      alert("시작 날짜와 종료 날짜는 필수입니다.");
      return;
    }

    const [startHour, startMinute] = startTime.split(":").map(Number);
    const [endHour, endMinute] = endTime.split(":").map(Number);

    const startDateTime = new Date(startDate);
    startDateTime.setUTCHours(startHour - 9, startMinute, 0, 0);

    const endDateTime = new Date(endDate);
    endDateTime.setUTCHours(endHour - 9, endMinute, 0, 0);

    if (startDateTime >= endDateTime) {
      alert("종료 시간은 시작 시간보다 늦어야 합니다.");
      return;
    }

    setLoading(true);
    setSubmitError(null);

    const scheduleData = {
      title: title,
      startTime: startDateTime.toISOString(),
      endTime: endDateTime.toISOString(),
      description: description,
      color: selectedColor,
      participantUserPks: selectedParticipants,
    };

    try {
      const token = localStorage.getItem("token");

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
        console.log("일정 수정 성공!");
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
      <p className="formDate">날짜: {formattedDate}</p>
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
        <p className="colorLabel">컬러 태그</p>
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
      <div className="dateTimeGroup">
        <div className="dateTimeLabel">시작</div>
        <div className="dateTimeInputs">
          <input
            type="date"
            className="formInput dateInput"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            disabled={loading}
          />
          <select
            className="formInput timeInput"
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
        <div className="dateTimeLabel">종료</div>
        <div className="dateTimeInputs">
          <input
            type="date"
            className="formInput dateInput"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            disabled={loading}
          />
          <select
            className="formInput timeInput"
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
      <textarea
        placeholder="상세 내용"
        className="formTextarea"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        disabled={loading}
      />
      <div className="participantSelector">
        <p className="participantLabel">참가자 선택</p>
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

  // ✅ 같은 날인지 확인
  const isSameDay =
    scheduleStartDate.toDateString() === scheduleEndDate.toDateString();

  // ✅ 시작일 포맷팅
  const formattedStartDate = scheduleStartDate.toLocaleDateString("ko-KR", {
    month: "long",
    day: "numeric",
  });

  // ✅ 종료일 포맷팅
  const formattedEndDate = scheduleEndDate.toLocaleDateString("ko-KR", {
    month: "long",
    day: "numeric",
  });

  // ✅ 조건부 날짜 표시 (같은 날: 단일 날짜, 다른 날: 범위)
  const formattedDate = isSameDay
    ? formattedStartDate
    : `${formattedStartDate} ~ ${formattedEndDate}`;

  const formattedTime = `${scheduleStartDate.toLocaleTimeString("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
  })} - ${scheduleEndDate.toLocaleTimeString("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
  })}`;

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

const LeftNavBar = ({ isCalendarPage }) => {
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

  const handleViewSchedule = async (schedule) => {
    setScheduleDetailLoading(true);
    setIsViewingSchedule(true);

    try {
      const token = localStorage.getItem("token");
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
  };

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
  };

  const handleEditSchedule = (schedule) => {
    setEditingSchedule(schedule);
    setIsEditingSchedule(true);
    setIsAddingSchedule(false);
  };

  const handleDeleteSchedule = async (eventPk) => {
    if (!window.confirm("정말로 이 일정을 삭제하시겠습니까?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");

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
        console.log("일정 삭제 성공!");
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

  const fetchProjects = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");

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
      isNaN(dateToDisplay) ||
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
      const token = localStorage.getItem("token");

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
        const selectedDate = new Date(selectedDateFromURL);
        selectedDate.setHours(0, 0, 0, 0);
        const filteredSchedules = data.filter((schedule) => {
          const scheduleStart = new Date(schedule.startTime);
          const scheduleEnd = new Date(schedule.endTime);

          // 시간 부분을 제거하고 날짜만 비교
          scheduleStart.setHours(0, 0, 0, 0);
          scheduleEnd.setHours(0, 0, 0, 0);

          // 선택한 날짜가 일정 기간(시작일 ~ 종료일) 안에 포함되면 표시
          return selectedDate >= scheduleStart && selectedDate <= scheduleEnd;
        });

        setSchedules(filteredSchedules);
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
            handleDeleteSchedule(schedule.eventPk);
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
              <div className="scheduleTitle">
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
                      handleDeleteSchedule(selectedSchedule.eventPk);
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
