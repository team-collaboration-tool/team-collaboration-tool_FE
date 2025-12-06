// 시작 == npm run dev
// 종료 == ctrl + C
// 자동정렬 == shift + option + F

// 도메인 주소
// http://hyupmin.ap-northeast-2.elasticbeanstalk.com/

import "./css/csSogong_Schedule.css";  // css 파일 선언
import React from "react";
import { useParams } from "react-router-dom";

// baseURL import
const baseURL =
  import.meta.env.VITE_DEV_PROXY_URL;


export default function TimeSchedulerPage() {
  // 기존 js 코드들
  React.useEffect(() => {

    // swtich_list == 화면 전환 도구
    const list = [
      document.querySelector('.TimeSelect_make'),
      document.querySelector('.TimeSelect'),
      document.querySelector('.GaeSiPan_list'),
      document.querySelector('.GaeSiPan_Write'),
    ].filter(Boolean);
    window.swtich_list = list;
    return () => { try { delete window.swtich_list; } catch (_) { } };
  }, []);

  // 오늘 날짜로 띄우기
  const getTodayString = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0"); // 월은 0부터 시작하므로 +1
    const day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  // 시간조율표 입력값 5가지
  const [whenDateStart, setWhenDateStart] = React.useState(getTodayString());
  const [howDateLong, setHowDateLong] = React.useState("");
  const [timeStart, setTimeStart] = React.useState("09:00");
  const [timeEnd, setTimeEnd] = React.useState("18:00");
  const [whatName, setWhatName] = React.useState("");
  const [items, setItems] = React.useState([]); // 이거는 위에 5개 데이터를 넣은 배열로 사용


  // ========================================================================================
  // 테스트용 : 시간조율표 데이터
  const test_item = [
    {
      id: 1,
      dateStart: "2025-11-18",
      dateLength: 7,
      timeStartHour: 9,
      timeEndHour: 18,
      createdLabel: "조율표 이름 == Test Data",
    },
  ];

  // 테스트용 : 전체 시간표 데이터
  const test_EntireTimeTable_Array = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  ];

  // 테스트용 : 전체 시간표에 속한 인원 수
  const test_EntireTimeTable_HowPeople = 2;

  // 테스트용: 각 시간조율표 id에 대한 전체 시간표 데이터를 매핑
  const mockEntireTimeTables = {
    1: {
      grid: test_EntireTimeTable_Array,
      peopleCount: test_EntireTimeTable_HowPeople,
    },
  };
  // 테스트용 데이터 끝
  // ========================================================================================
  // ========================================================================================

  // projectPK!!
  const { projectID } = useParams();
  const ProjectPK = projectID;

  // userPK!!
  const [myUserPk, setMyUserPk] = React.useState(null);
  const [myEmail, setMyEmail] = React.useState(null);


  // GET : /api/users/me == 내 이메일 얻기
  const getMyUserInfo = React.useCallback(() => {
    const token = sessionStorage.getItem("token");

    fetch(`${baseURL}/api/users/me`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then(async (res) => {
        console.log(`GET : /api/users/me 응답 코드 == ${res.status}`);
        const raw = await res.text();
        console.log("GET : /api/users/me 응답 RAW == ", raw);

        if (res.status === 200) {
          try {
            const data = JSON.parse(raw);
            console.log("GET : /api/users/me JSON == ", data);
            setMyEmail(data.email);
          } catch (err) {
            console.log("JSON 파싱 실패 == ", err);
          }
        } else {
          console.error("요청 실패 == ", raw);
        }
      })
      .catch((err) => {
        console.error("GET : /api/users/me 에러 발생 == ", err);
      });
  }, []);


  // GET : /api/projects/{projectId} == 프로젝트 멤버들 userPK 찾기
  const getMyUserPkFromProject = React.useCallback((projectId, myEmail) => {
    const token = sessionStorage.getItem("token");
    fetch(`${baseURL}/api/projects/${projectId}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then(async (res) => {
        console.log(`GET : /api/projects/${projectId} 응답 코드 == ${res.status}`);
        const raw = await res.text();
        console.log("GET : /api/projects/{projectId} RAW == ", raw);

        if (res.status === 200) {
          const data = JSON.parse(raw);
          console.log("GET : /api/projects/{projectId} JSON == ", data);

          const members = data.members || [];
          const me = members.find(m => m.email === myEmail);

          if (me) {
            console.log("프로젝트 안에서 찾은 나 == ", me);
            setMyUserPk(me.userPk);
            console.log(`프로젝트 PK == ${ProjectPK}`);
            console.log(`user PK == ${me.userPk}`);
          } else {
            console.warn("members 안에서 내 email과 일치하는 항목을 못 찾았음");
          }
        } else {
          console.error("요청 실패 == ", raw);
        }
      })
      .catch((err) => {
        console.error("GET : /api/projects/{projectId} 에러 발생 == ", err);
      });
  }, []);


  // =============================================================================
  // GET : /api/time-poll/list/{projectId} == 시간조율표 목록 조회
  const fetchPollList = React.useCallback(() => {
    const token = sessionStorage.getItem("token");
    const projectId = ProjectPK;

    if (!projectId) return;

    fetch(`${baseURL}/api/time-poll/list/${projectId}`, {
      method: "GET",
      headers: { "Authorization": `Bearer ${token}` },
    })
      .then(async (res) => {
        if (res.status !== 200) {
          setItems(test_item);
          return;
        }

        const rawText = await res.text();
        let data;
        try {
          data = JSON.parse(rawText);
        } catch (e) {
          setItems(test_item);
          return;
        }

        if (!Array.isArray(data)) {
          setItems(test_item);
          return;
        }

        const MS_PER_DAY = 86400000;
        const mapped = data.map((poll) => {
          const dateStart = poll.startDate;
          const dateEnd = poll.endDate;
          let dateLength = 1;

          if (dateStart && dateEnd) {
            const start = new Date(dateStart);
            const end = new Date(dateEnd);
            const diffDays = Math.floor((end - start) / MS_PER_DAY) + 1;
            if (!Number.isNaN(diffDays) && diffDays > 0) {
              dateLength = diffDays;
            }
          }

          // 디폴트 값
          let parsedStartHour = 9;
          let parsedEndHour = 18;

          if (Array.isArray(poll.timeLabels) && poll.timeLabels.length > 0) {
            const firstLabel = poll.timeLabels[0]; // ex: "11:00"
            const startH = parseInt(firstLabel.split(':')[0], 10);

            if (!isNaN(startH)) {
              parsedStartHour = startH;
              parsedEndHour = parsedStartHour + (poll.timeLabels.length / 2);
            }
          }
          else {
            if (poll.startTimeOfDay) {
              if (typeof poll.startTimeOfDay === 'string') {
                parsedStartHour = parseInt(poll.startTimeOfDay.split(':')[0], 10);
              } else if (typeof poll.startTimeOfDay === 'object' && poll.startTimeOfDay.hour !== undefined) {
                parsedStartHour = poll.startTimeOfDay.hour;
              }
            }
            if (poll.endTimeOfDay) {
              if (typeof poll.endTimeOfDay === 'string') {
                parsedEndHour = parseInt(poll.endTimeOfDay.split(':')[0], 10);
              } else if (typeof poll.endTimeOfDay === 'object' && poll.endTimeOfDay.hour !== undefined) {
                parsedEndHour = poll.endTimeOfDay.hour;
              }
            }
          }

          console.log(`[Poll ID: ${poll.pollId}] 시작시간 파싱결과: ${parsedStartHour}시 ~ ${parsedEndHour}시`);

          return {
            id: poll.pollId,
            dateStart,
            dateLength,
            timeStartHour: parsedStartHour,
            timeEndHour: parsedEndHour,
            createdLabel: `${poll.title}`,
          };
        });

        setItems(mapped);
      })
      .catch((err) => {
        console.log("GET 에러:", err);
        setItems(test_item);
      });
  }, [ProjectPK, baseURL]);
  React.useEffect(() => {
    fetchPollList();
  }, [fetchPollList]);


  // =============================================================================


  // 이메일로 내 userPK 찾기
  React.useEffect(() => {
    getMyUserInfo();
  }, []);
  React.useEffect(() => {
    if (!ProjectPK || !myEmail) return;
    getMyUserPkFromProject(ProjectPK, myEmail);
  }, [ProjectPK, myEmail, getMyUserPkFromProject]);


  // // GET : /api/time-poll/list/{projectId} == 시간조율표 목록 조회
  // React.useEffect(() => {
  //   const token = localStorage.getItem("token");
  //   const projectId = ProjectPK;

  //   fetch(`${baseURL}/api/time-poll/list/${projectId}`, {
  //     method: "GET",
  //     headers: {
  //       "Authorization": `Bearer ${token}`,
  //     },
  //   })
  //     .then(async (res) => {
  //       console.log("GET : /api/time-poll/list 응답 코드 == ", res.status);

  //       // return값 console log
  //       const rawText = await res.text();
  //       console.log("GET : /api/time-poll/list RAW BODY == ", rawText);

  //       // return 200이 아니면, test_item 사용
  //       if (res.status !== 200) {
  //         console.log(
  //           "GET : /api/time-poll/list 응답 코드 == ",
  //           res.status,
  //           "-> 테스트 데이터 사용"
  //         );
  //         setItems(test_item);
  //         return;
  //       }

  //       // return 200
  //       let data;
  //       try {
  //         data = JSON.parse(rawText);
  //       } catch (e) {
  //         console.log(
  //           "GET : /api/time-poll/list JSON 파싱 에러:",
  //           e,
  //           "-> 테스트 데이터 사용"
  //         );
  //         setItems(test_item);
  //         return;
  //       }

  //       if (!Array.isArray(data)) {
  //         console.log(
  //           "GET : /api/time-poll/list 응답 형식이 배열이 아님:",
  //           data,
  //           "-> 테스트 데이터 사용"
  //         );
  //         setItems(test_item);
  //         return;
  //       }

  //       // 여기서 응답 --> item 형식으로 변환
  //       const MS_PER_DAY = 86400000;

  //       const mapped = data.map((poll) => {
  //         const dateStart = poll.startDate;
  //         const dateEnd = poll.endDate;

  //         let dateLength = 1;
  //         if (dateStart && dateEnd) {
  //           const start = new Date(dateStart);
  //           const end = new Date(dateEnd);
  //           const diffDays =
  //             Math.floor((end - start) / MS_PER_DAY) + 1;
  //           if (!Number.isNaN(diffDays) && diffDays > 0) {
  //             dateLength = diffDays;
  //           }
  //         }

  //         // TODO: 시작시간, 종료시간대 설정
  //         let parsedStartHour = 9; // 기본값
  //         let parsedEndHour = 18;  // 기본값

  //         // 시작 시간 파싱
  //         if (poll.startTimeOfDay) {
  //           // "HH:MM:SS" 문자열인 경우
  //           if (typeof poll.startTimeOfDay === 'string') {
  //             parsedStartHour = parseInt(poll.startTimeOfDay.split(':')[0], 10);
  //           }
  //           // 혹시 객체 { hour: 9, ... } 로 오는 경우 대비
  //           else if (typeof poll.startTimeOfDay === 'object' && poll.startTimeOfDay.hour !== undefined) {
  //             parsedStartHour = poll.startTimeOfDay.hour;
  //           }
  //           console.log(`parsedStartHour == ${parsedStartHour}`);
  //         }

  //         // 종료 시간 파싱
  //         if (poll.endTimeOfDay) {
  //           if (typeof poll.endTimeOfDay === 'string') {
  //             parsedEndHour = parseInt(poll.endTimeOfDay.split(':')[0], 10);
  //           }
  //           else if (typeof poll.endTimeOfDay === 'object' && poll.endTimeOfDay.hour !== undefined) {
  //             parsedEndHour = poll.endTimeOfDay.hour;
  //           }
  //           console.log(`parsedEndHour == ${parsedEndHour}`);
  //         }

  //         return {
  //           id: poll.pollId,
  //           dateStart,
  //           dateLength,
  //           timeStartHour: parsedStartHour, // 수정된 변수 사용
  //           timeEndHour: parsedEndHour,     // 수정된 변수 사용
  //           createdLabel: `${poll.title}`,
  //         };
  //       });

  //       setItems(mapped);
  //     })
  //     .catch((err) => {
  //       console.log(
  //         "GET : /api/time-poll/list 에러:",
  //         err,
  //         "-> 테스트 데이터 사용"
  //       );
  //       setItems(test_item);
  //     });
  // }, []);


  // 시작, 종료 시간을 00분으로 고정
  const forceMinutes00 = React.useCallback((value) => {
    if (!value) return value;
    const [hh] = String(value).split(":");
    return String(hh).padStart(2, "0") + ":00";
  }, []);

  // 시작 시간대 입력칸
  const onChangeTimeStart = React.useCallback((e) => {
    setTimeStart(forceMinutes00(e.target.value));
  }, [forceMinutes00]);
  const onBlurTimeStart = React.useCallback(() => {
    setTimeStart((v) => forceMinutes00(v));
  }, [forceMinutes00]);

  // 종료 시간대 입력칸
  const onChangeTimeEnd = React.useCallback((e) => {
    setTimeEnd(forceMinutes00(e.target.value));
  }, [forceMinutes00]);
  const onBlurTimeEnd = React.useCallback(() => {
    setTimeEnd((v) => forceMinutes00(v));
  }, [forceMinutes00]);

  // 이름 입력칸
  const onChangeWhatName = React.useCallback((e) => {
    setWhatName(e.target.value);
  }, []);


  // ============================================================
  // 버튼: 시간조율표 생성
  const onMakeClick = React.useCallback(() => {
    if (!howDateLong) {
      alert("며칠치를 생성할지 선택하세요");
      return;
    }

    const when_dateStart = whenDateStart;
    const how_dateLong_int = parseInt(howDateLong || "0", 10);
    const when_timeStart = parseInt((timeStart || "0").split(":")[0], 10);
    const when_timeEnd = parseInt((timeEnd || "0").split(":")[0], 10);
    const what_Name = whatName;

    // 입력값에 대한 자체 console log
    console.log("when_dateStart:", when_dateStart);
    console.log("how_dateLong_int:", how_dateLong_int);
    console.log("start time:", when_timeStart);
    console.log("end time:", when_timeEnd);
    console.log("minus:", (when_timeEnd - when_timeStart) * 2);
    console.log("조율표 이름:", what_Name);

    const now = new Date();
    const TableNameString = what_Name;


    // POST : /api/time-poll == 시간조율표 생성
    const payload = {
      projectId: ProjectPK,
      creatorId: myUserPk,
      title: TableNameString,
      startDate: when_dateStart,
      duration: how_dateLong_int,
      // startTimeOfDay: {
      //   hour: when_timeStart,
      //   minute: 0,
      //   second: 0,
      //   nano: 0
      // },
      // endTimeOfDay: {
      //   hour: when_timeEnd,
      //   minute: 0,
      //   second: 0,
      //   nano: 0
      // }
      startTimeOfDay: `${String(when_timeStart).padStart(2, "0")}:00:00`,   // ex) "09:00:00"
      endTimeOfDay: `${String(when_timeEnd).padStart(2, "0")}:00:00`        // ex) "18:00:00"
    };

    // post 내용 그대로 console log
    console.log("POST : /api/time-poll 보내는 내용 = ", payload);

    // 로그인 토큰
    const token = sessionStorage.getItem("token");

    // baseURL 사용
    fetch(`${baseURL}/api/time-poll`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    })
      .then(async (res) => {
        console.log("POST : /api/time-poll 응답 코드 == ", res.status);

        if (res.status === 200 || res.status === 201) {
          console.log("생성 성공 -> 리스트 갱신");
          fetchPollList();

          setWhatName("");
        } else {
          console.error("생성 실패", res);
        }
      })
      .catch((err) => {
        console.error("POST : /api/time-poll error:", err);
      });

    // new item 생성
    const newItem = {
      id: `${now.getTime()}`,
      // createdLabel: `조율표 이름 == ${TableNameString}`,
      createdLabel: `${TableNameString}`,
      dateStart: when_dateStart,
      dateLength: how_dateLong_int,
      timeStartHour: when_timeStart,
      timeEndHour: when_timeEnd,
    };

    // setItems((prev) => [newItem, ...prev]);
  }, [whenDateStart, howDateLong, timeStart, timeEnd, whatName]);


  // TimeSelect_item 클릭 시, 해당 조율표 화면에 표기
  const onItemClick = React.useCallback((item) => {
    console.log(`[CLICK] ID: ${item.id}, StartHour: ${item.timeStartHour}`);

    window.swtich_list[0].classList.add("off");
    window.swtich_list[1].classList.add("on");

    const mock = mockEntireTimeTables[item.id];
    let grid = mock?.grid;
    let peopleCount = mock?.peopleCount;

    if (!grid || !peopleCount) {
      const rows = (item.timeEndHour - item.timeStartHour) * 2;
      const cols = item.dateLength;

      grid = Array.from({ length: cols }, () =>
        Array.from({ length: rows }, () => 0)
      );
      peopleCount = 1;
    }

    if (typeof window.TimeSelect_MoveToGrid === "function") {
      // timeStartHour(11)가 정확히 전달되는지 확인
      window.TimeSelect_MoveToGrid(
        item.dateStart,
        item.dateLength,
        item.timeStartHour, // 이 값을 setupGrid_left로
        item.timeEndHour,
        grid,
        peopleCount,
        item.id,
        myUserPk
      );
    } else {
      console.log("window.TimeSelect_MoveToGrid 함수가 없습니다.");
    }
  }, [mockEntireTimeTables, myUserPk]); // myUserPk 의존



  // ================================================================
  // 여기부터 드래그표 관련 js들
  // ================================================================
  // 드래그 전체 시간표 로직
  // 매개변수 2개 == 1: 몇일치? || 2: 하루당 타임슬롯_(30분 단위)
  // 행의 개수는 1번 매개변수, 열의 개수는 2번 매개변수
  // 이렇게 2차원 배열 생성 == 해당 배열은 해당 시간조율표에 귀속
  React.useEffect(() => {

    // get 함수 개인,팀 2개 반환으로 인한 변경
    // GRID left_my time
    function applyMyGridToLeftGrid(myGrid, cols, rows) {
      const container = document.getElementById('GRID_leftSelect_GridContainer');
      if (!container || !myGrid) return;

      const cells = container.querySelectorAll('.grid_cell');

      cells.forEach((cell, index) => {
        const row = Math.floor(index / cols); // timeIndex
        const col = index % cols;             // dayIndex
        const val = myGrid[col]?.[row] ?? 0;

        if (val === 1) {
          cell.classList.add('selected');
        } else {
          cell.classList.remove('selected');
        }
      });
    }

    // GIRD right_team time
    function updateRightGrid_FromBackend(teamGrid, cols, rows) {
      const container = document.getElementById('GRID_rightShow_GridContainer');
      if (!container || !teamGrid) return;

      const rightCells = container.querySelectorAll('.grid_cell_right');

      // 최대 인원 수(색 농도 계산용)
      let maxCount = 0;
      for (let c = 0; c < cols; c++) {
        for (let r = 0; r < rows; r++) {
          const cnt = teamGrid[c]?.[r] ?? 0;
          if (cnt > maxCount) maxCount = cnt;
        }
      }
      if (maxCount <= 0) {
        // 전부 0이면 전부 투명 처리
        rightCells.forEach(cell => { cell.style.backgroundColor = 'transparent'; });
        return;
      }

      rightCells.forEach((cell, index) => {
        const row = Math.floor(index / cols); // timeIndex
        const col = index % cols;             // dayIndex
        const count = teamGrid[col]?.[row] ?? 0;
        const opacity = count / maxCount;

        if (opacity > 0) {
          cell.style.backgroundColor = `rgba(51, 161, 224, ${opacity})`;
        } else {
          cell.style.backgroundColor = 'transparent';
        }
      });
    }



    // 드래그표 왼쪽 거_(실제 클릭 및 드래그 하는 곳) 생성 func
    function setupGrid_left(dateData, rowCount, columnCount, test_EntireTimeTable_Array, test_EntireTimeTable_HowPeople, pollId, currentUserId, startHourInt) {
      if (columnCount < 1 || columnCount > 7) {
        console.error("열 개수는 1에서 7 사이여야 합니다.");
        return;
      }
      if (!Number.isInteger(rowCount) || rowCount < 1) {
        console.error("행 개수는 1 이상의 정수여야 합니다.");
        return;
      }
      const container = document.getElementById('GRID_leftSelect_GridContainer');
      // const summaryBox = document.getElementById('box_rightResult');
      if (!container) return;
      container.innerHTML = '';
      const allDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

      const cols = columnCount;
      const rows = rowCount;
      const days = allDays.slice(0, cols);
      const totalCells = cols * rows;
      let isDragging = false;
      let selectionMode = true;

      container.style.display = 'grid';
      const COLUMN_WIDTH_PX = 75;
      container.style.gridTemplateColumns = `repeat(${cols}, ${COLUMN_WIDTH_PX}px)`;
      const ROW_HEIGHT_PX = 30;
      container.style.gridTemplateRows = `repeat(${rows}, ${ROW_HEIGHT_PX}px)`;

      for (let i = 0; i < totalCells; i++) {
        const cell = document.createElement('div');
        cell.classList.add('grid_cell');
        const row = Math.floor(i / cols);
        const col = i % cols;
        cell.style.border = 'none';
        cell.style.borderLeft = '1px solid rgb(0, 0, 0)';
        if (col === cols - 1) cell.style.borderRight = '1px solid rgb(0, 0, 0)';
        if (row === 0) cell.style.borderTop = '1px solid rgb(0, 0, 0)';
        else cell.style.borderTop = (row % 2 === 0) ? '1px solid rgb(0, 0, 0)' : '1px dashed rgb(0, 0, 0)';
        container.appendChild(cell);
      }
      const cells = container.querySelectorAll('.grid_cell');



      // ========================================================================
      // 드래그 하다가 손 떼는 순간 generateSummary() 실행
      function generateSummary() {
        const selectedByDay = {};
        const selectedCells = new Set();

        cells.forEach((cell, index) => {
          if (cell.classList.contains('selected')) {
            const dayIndex = index % cols;
            const timeIndex = Math.floor(index / cols);
            const dayName = days[dayIndex];
            if (!selectedByDay[dayName]) selectedByDay[dayName] = [];
            selectedByDay[dayName].push(timeIndex);
            selectedCells.add(`${dayIndex}-${timeIndex}`);
          }
        });

        const grid2D = Array.from({ length: cols }, () => Array(rows).fill(0));
        cells.forEach((cell, index) => {
          if (cell.classList.contains('selected')) {
            const dayIndex = index % cols;
            const timeIndex = Math.floor(index / cols);
            if (grid2D[dayIndex] && grid2D[dayIndex][timeIndex] !== undefined) {
              grid2D[dayIndex][timeIndex] = 1;
            }
          }
        });

        const convertedAvailableTimes = [];
        const baseDateObj = new Date(dateData);
        const baseStartHour = startHourInt ?? 9;

        for (let dayIdx = 0; dayIdx < cols; dayIdx++) {
          for (let timeIdx = 0; timeIdx < rows; timeIdx++) {

            if (grid2D[dayIdx][timeIdx] === 1) {
              const targetDate = new Date(baseDateObj);
              targetDate.setDate(baseDateObj.getDate() + dayIdx);
              const yyyy = targetDate.getFullYear();
              const mm = String(targetDate.getMonth() + 1).padStart(2, '0');
              const dd = String(targetDate.getDate()).padStart(2, '0');
              const dateStr = `${yyyy}-${mm}-${dd}`;

              // 시간 계산 (30분 단위)
              const totalMinutesStart = (baseStartHour * 60) + (timeIdx * 30);
              const totalMinutesEnd = totalMinutesStart + 30;

              const formatTime = (totalMin) => {
                const h = Math.floor(totalMin / 60);
                const m = totalMin % 60;
                return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:00`;
              };

              const startTimeStr = formatTime(totalMinutesStart);
              const endTimeStr = formatTime(totalMinutesEnd);

              convertedAvailableTimes.push({
                start: `${dateStr}T${startTimeStr}`,
                end: `${dateStr}T${endTimeStr}`
              });
            }
          }
        }


        // POST : /api/time-poll/submit == 드래그표 업데이트
        const hasSelection = convertedAvailableTimes.length > 0;

        if (hasSelection) {
          const currentPollId = pollId;
          const payload = {
            pollId: currentPollId,
            userId: currentUserId,
            availableTimes: convertedAvailableTimes,
          };

          console.log("POST : /api/time-poll/submit 보내는 내용 == ", payload);
          const token = sessionStorage.getItem("token");

          fetch(`${baseURL}/api/time-poll/submit`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
          })
            .then((res) => {
              console.log("POST : /api/time-poll/submit return 코드:", res.status);
              return fetch(`${baseURL}/api/time-poll/${pollId}?userId=${currentUserId}`, {
                method: "GET",
                headers: { "Authorization": `Bearer ${token}` },
              });
            })

            // GET : /api/time-poll/{pollId} == 드래그표 업데이트
            .then(async (res) => {
              console.log(`GET : /api/time-poll/${currentPollId} 응답 코드 == `, res.status);

              if (res.status === 200) {
                const data = await res.json();
                console.log("GET 성공 200, return 값 내용 == ", data);

                // left 업데이트
                if (Array.isArray(data.myGrid)) {
                  applyMyGridToLeftGrid(data.myGrid, cols, rows);
                } else {
                  console.log("myGrid 이상 발생");
                }

                // right 업데이트
                if (Array.isArray(data.teamGrid)) {
                  updateRightGrid_FromBackend(data.teamGrid, cols, rows);
                } else {
                  console.log("teamGrid 이상 발생");
                  updateRightGridBySelection(
                    test_EntireTimeTable_Array,
                    test_EntireTimeTable_HowPeople,
                    cols,
                    rows,
                    selectedCells
                  );
                }
              } else {
                console.log("GET 실패");
                updateRightGridBySelection(
                  test_EntireTimeTable_Array,
                  test_EntireTimeTable_HowPeople,
                  cols,
                  rows,
                  selectedCells
                );
              }
            })
            .catch((err) => {
              console.log("POST/GET 처리 중 에러 == ", err);
              updateRightGridBySelection(test_EntireTimeTable_Array, test_EntireTimeTable_HowPeople, cols, rows, selectedCells);
            });
        }
      }

      cells.forEach(cell => {
        cell.addEventListener('mousedown', (e) => {
          e.preventDefault();
          isDragging = true;
          selectionMode = !cell.classList.contains('selected');
          cell.classList.toggle('selected', selectionMode);
        });
        cell.addEventListener('mouseover', () => {
          if (isDragging) cell.classList.toggle('selected', selectionMode);
        });
      });
      document.addEventListener('mouseup', () => {
        if (isDragging) {
          isDragging = false;
          generateSummary();
        }
      });
      container.addEventListener('mouseleave', () => {
        if (isDragging) {
          isDragging = false;
          generateSummary();
        }
      });
      generateSummary();
    }


    // 드래그표 오른쪽 거_(팀원들 꺼 보는 곳) 생성 func
    function setupGrid_right(dateData, rowCount, columnCount, test_EntireTimeTable_Array, test_EntireTimeTable_HowPeople) {
      if (columnCount < 1 || columnCount > 7) {
        console.error("열 개수 1~7 범위 벗어남");
        return;
      }
      if (!Number.isInteger(rowCount) || rowCount < 1) {
        console.error("행 개수 비정상");
        return;
      }
      const container = document.getElementById('GRID_rightShow_GridContainer');
      if (!container) return;
      container.innerHTML = '';

      const cols = columnCount; // 날짜 개수 (<=7)
      const rows = rowCount;    // 시간 슬롯 개수 (30분 단위)

      const totalCells = cols * rows;
      container.style.display = 'grid';
      const COLUMN_WIDTH_PX = 75;
      container.style.gridTemplateColumns = `repeat(${cols}, ${COLUMN_WIDTH_PX}px)`;
      const ROW_HEIGHT_PX = 30;
      container.style.gridTemplateRows = `repeat(${rows}, ${ROW_HEIGHT_PX}px)`;

      for (let i = 0; i < totalCells; i++) {
        const cell = document.createElement('div');
        cell.classList.add('grid_cell_right');

        const row = Math.floor(i / cols); // timeIndex (0 ~ rows-1)
        const col = i % cols;             // dayIndex  (0 ~ cols-1)

        cell.style.border = 'none';
        cell.style.borderLeft = '1px solid rgb(0, 0, 0)';
        if (col === cols - 1) cell.style.borderRight = '1px solid rgb(0, 0, 0)';
        if (row === 0) cell.style.borderTop = '1px solid rgb(0, 0, 0)';
        else cell.style.borderTop = (row % 2 === 0) ? '1px solid rgb(0, 0, 0)' : '1px dashed rgb(0, 0, 0)';

        // 전체 시간표 == 투명도 로직
        let opacity = 0;
        if (test_EntireTimeTable_Array && test_EntireTimeTable_HowPeople && test_EntireTimeTable_HowPeople > 0) {
          const dayIndex = col;
          const timeIndex = row;
          const count = test_EntireTimeTable_Array[dayIndex]?.[timeIndex] ?? 0;
          opacity = count / test_EntireTimeTable_HowPeople;
        }

        if (opacity > 0) {
          // #33A1E0 == rgb(51, 161, 224)
          cell.style.backgroundColor = `rgba(51, 161, 224, ${opacity})`;
        } else {
          cell.style.backgroundColor = 'transparent';
        }

        container.appendChild(cell);
      }
    }


    // ================================================================================
    // right_GRID를 드래그에 따라 업데이트 하는 함수
    function updateRightGridBySelection(test_EntireTimeTable_Array, test_EntireTimeTable_HowPeople, cols, rows, selectedCells) {
      const container = document.getElementById('GRID_rightShow_GridContainer');
      if (!container || !test_EntireTimeTable_Array || !test_EntireTimeTable_HowPeople) return;
      const rightCells = container.querySelectorAll('.grid_cell_right');

      rightCells.forEach((cell, index) => {
        const row = Math.floor(index / cols);
        const col = index % cols;

        const baseCount = test_EntireTimeTable_Array[col]?.[row] ?? 0;
        const isSelected = selectedCells && selectedCells.has(`${col}-${row}`) ? 1 : 0;

        const count = baseCount + isSelected;
        const opacity = test_EntireTimeTable_HowPeople ? count / test_EntireTimeTable_HowPeople : 0;

        if (opacity > 0) {
          cell.style.backgroundColor = `rgba(51, 161, 224, ${opacity})`;
        } else {
          cell.style.backgroundColor = 'transparent';
        }
      });
    }


    // 드래그 영역 기준, 왼쪽에 시간 text 띄우는 func
    function fillLeftTime(rowCount, startHour) {
      document.getElementById("box_leftTime").height = 30 * rowCount;
      const left = document.getElementById('box_leftTime');
      const right = document.getElementById('box_leftTime_rightShow');
      const paint = (container) => {
        if (!container) return;
        container.innerHTML = '';
        for (let i = 0; i <= rowCount; i++) {
          const even = i % 2 === 0;
          const hour = (startHour + i / 2) % 24;
          const div = document.createElement('div');
          div.className = 'box_leftTime_mode';
          div.textContent = even ? `${String(Math.floor(hour)).padStart(2, '0')}:00` : '';
          container.appendChild(div);
        }
      };
      paint(left);
      paint(right);
    }

    // 드래그 영역 기준, 위쪽에 요일날짜 text 띄우는 func
    function fillUpDay_2(containerId, startDateStr, dayCount) {
      const container = document.getElementById(containerId);
      if (!container) return;
      container.innerHTML = '';

      const [Y, M, D] = startDateStr.split('-').map(Number);
      let cur = new Date(Y, M - 1, D);
      const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

      for (let i = 0; i < dayCount; i++) {
        const cell = document.createElement('div');
        cell.className = 'box_upDay_mode';
        const yyyy = cur.getFullYear();
        const mm = String(cur.getMonth() + 1).padStart(2, '0');
        const dd = String(cur.getDate()).padStart(2, '0');
        const ddd = dayNames[cur.getDay()];
        cell.innerHTML = `${yyyy}.${mm}.${dd}<br>${ddd}`;
        container.appendChild(cell);
        cur.setDate(cur.getDate() + 1);
      }
    }
    function fillUpDay(x, y) {
      fillUpDay_2('box_upDay', x, y);
      fillUpDay_2('box_upDay_rightShow', x, y);
    }

    // 드래그 그리드표 만드는 func
    function TimeSelect_MoveToGrid(
      when_dateStart,
      how_dateLong_int,
      when_timeStart,
      when_timeEnd,
      test_EntireTimeTable_Array,
      test_EntireTimeTable_HowPeople,
      pollId,
      currentUserId
    ) {
      const rows = (when_timeEnd - when_timeStart) * 2;
      const cols = how_dateLong_int;

      // 생성 = left_GRID, right_GRID
      setupGrid_left(when_dateStart, rows, cols, test_EntireTimeTable_Array, test_EntireTimeTable_HowPeople, pollId, currentUserId, when_timeStart);
      setupGrid_right(when_dateStart, rows, cols, test_EntireTimeTable_Array, test_EntireTimeTable_HowPeople);

      // 생성 = 시간 & 요일 표
      fillLeftTime(rows, when_timeStart);
      fillUpDay(when_dateStart, cols);

      // 처음 그릴 때, 미리 그려진 정보 GET
      const token = sessionStorage.getItem("token");
      console.log(`초기 데이터 로딩 시작: /api/time-poll/${pollId}`);

      // GET : /api/time-poll/{pollId} == 초기 시간조율표 로딩
      fetch(`${baseURL}/api/time-poll/${pollId}?userId=${currentUserId}`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
        .then(async (res) => {
          if (res.status === 200) {
            const data = await res.json();
            console.log("초기 데이터 GET 성공:", data);

            if (Array.isArray(data.timeLabels) && data.timeLabels.length > 0) {
              const firstLabel = data.timeLabels[0]; // ex: "11:00"
              const realStartHour = parseInt(firstLabel.split(':')[0], 10);

              console.log(`[보정] 목록에선 ${when_timeStart}시라 했지만, 상세 데이터는 ${realStartHour}시 시작임 -> 그리드 재생성`);

              setupGrid_left(
                when_dateStart,
                rows,
                cols,
                test_EntireTimeTable_Array,
                test_EntireTimeTable_HowPeople,
                pollId,
                currentUserId,
                realStartHour // 수정
              );
              fillLeftTime(rows, realStartHour);
            }

            // GRID_left 업데이트
            if (Array.isArray(data.myGrid)) {
              applyMyGridToLeftGrid(data.myGrid, cols, rows);
            } else {
              console.log("초기 세팅, left 이상 발생");
            }

            // GRID_right 업데이트
            if (Array.isArray(data.teamGrid)) {
              updateRightGrid_FromBackend(data.teamGrid, cols, rows);
            } else {
              console.log("초기 세팅, right 이상 발생");
            }
          } else {
            console.warn("초기 데이터 GET 실패 == ", res.status);
          }
        })
        .catch((err) => {
          console.error("초기 데이터 로딩 중 에러 == ", err);
        });
    }
    window.TimeSelect_MoveToGrid = TimeSelect_MoveToGrid;
  }, []);



  // ================================================================
  // 여기부터 기존 html 코드
  return (
    <div>
      {/* Header */}
      {/* <header>
        <div id="logo_header">
          <img src="/etc/logo.png" width="80" alt="로고" />
        </div>
        <div id="switch_1">
          <p>시간조율</p>
        </div>
        <div id="switch_2">
          <p>게시판</p>
        </div>
      </header> */}


      {/* 0번: 시간조율 표생성 */}
      <div className="TimeSelect_make">

        {/* 가로배치를 위한 컨테이너 */}
        <div className="container_TimeSelect_Garo">

          {/* 왼쪽 == 입력창 */}
          <div className="container_TimeSelect_Sero">
            <h1 id="TimeSelect_make_title"><b>시간조율표 생성</b></h1>


            {/* 1. 시작 날짜 */}
            <div className="TimeSelect_make_item">
              <label htmlFor="TimeSelect_howdate" className="TimeSelect_make_label">시작 날짜 입력</label>
              <input
                type="date"
                id="TimeSelect_howdate"
                value={whenDateStart}
                onChange={(e) => setWhenDateStart(e.target.value)}
                required
              />
            </div>

            {/* 2. 며칠치 생성? */}
            <div className="TimeSelect_make_item">
              <label htmlFor="list_howdate" className="TimeSelect_make_label">생성 개수 선택</label>
              <select
                name="numbers"
                id="list_howdate"
                value={howDateLong}
                onChange={(e) => setHowDateLong(e.target.value)}
                required
              >
                <option value="">--선택하세요--</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
                <option value="7">7</option>
              </select>
            </div>

            {/* 3. 시간대 (시작) */}
            <div className="TimeSelect_make_item">
              <label htmlFor="TimeSelect_timestart" className="TimeSelect_make_label">시작 시간대</label>
              <input
                type="time"
                id="TimeSelect_timestart"
                step="3600"
                value={timeStart}
                min="00:00"
                max="23:00"
                onChange={onChangeTimeStart}
                onBlur={onBlurTimeStart}
                required
              />
            </div>

            {/* 4. 시간대 (종료) */}
            <div className="TimeSelect_make_item">
              <label htmlFor="TimeSelect_timeend" className="TimeSelect_make_label">종료 시간대</label>
              <input
                type="time"
                id="TimeSelect_timeend"
                step="3600"
                value={timeEnd}
                min="01:00"
                max="24:00"
                onChange={onChangeTimeEnd}
                onBlur={onBlurTimeEnd}
                required
              />
            </div>

            {/* 5. 시간조율표 이름 */}
            <div className="TimeSelect_make_item">
              <label htmlFor="TimeSelect_nametable" className="TimeSelect_make_label">조율표 이름</label>
              <input
                type="text"
                id="TimeSelect_nametable"
                value={whatName}
                onChange={onChangeWhatName}
                placeholder="이름 입력"
                required></input>
            </div>

            {/* 6. 생성 버튼 */}
            <div className="TimeSelect_make_buttoncontainer">
              <button id="TimeSelect_make_button" type="button" onClick={onMakeClick}>생성</button>
            </div>
          </div>




          {/* 오른쪽 == 시간조율표 리스트 */}
          <div className="container_TimeSelect_Sero">

            {/* 7. 시간표 리스트 */}
            <div className="TimeSelect_made_list">

              {/* 시간조율표 리스트 렌더링 */}
              {items.map((item) => (
                <div
                  key={item.id}
                  className="TimeSelect_item"
                  data-date-start={item.dateStart}
                  data-date-length={item.dateLength}
                  data-time-start={item.timeStartHour}
                  data-time-end={item.timeEndHour}
                  onClick={() => onItemClick(item)}
                >
                  <span className="TimeSelect_item_title">{item.createdLabel}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>


      {/* 1번: 시간조율 기능 */}
      <div className="TimeSelect">
        {/* <h1 id="TimeSelect_title"><b>시간조율표</b></h1> */}
        <button
          id="exit_TimeSelect"
          type="button"
          onClick={() => {
            window.swtich_list[0].classList.remove('off');
            window.swtich_list[1].classList.remove('on');
          }}
        >
          <p> 뒤로가기</p>
        </button>
        <div id="GRID_leftSelect">
          <label id="GRID_leftSelect_label"><b>개인 시간표</b></label>
          <div id="GRID_leftSelect_GridContainer"></div>
          <div id="box_upDay"></div>
          <div id="box_leftTime"></div>
        </div>
        <div id="GRID_rightShow">
          <label id="GRID_rightShow_label"><b>전체 시간표</b></label>
          <div id="GRID_rightShow_GridContainer"></div>
          <div id="box_upDay_rightShow"></div>
          <div id="box_leftTime_rightShow"></div>
          {/* <div id="Refresh_rightshow">🔄</div> */}
        </div>
        <div id="between_GridLine"></div>

        {/* <div id="box_rightResult"></div> */}
      </div>
    </div >
  );
}