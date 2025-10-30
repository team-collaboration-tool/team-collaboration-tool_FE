// 시작 == npm run dev
// 종료 == ctrl + C

import "./css/csSogong_Schedule.css";  // css 파일 경로 선언
import React from "react"; 


export default function TimeSchedulerPage() {

  // 기존 js 코드들을 상단에 먼저 배치
  React.useEffect(() => {
    document.title = "시간조율, 게시판";  // 헤더에 쓸 버튼 2개

    const list = [  // 기능별 페이지들
      document.querySelector('.TimeSelect_make'),
      document.querySelector('.TimeSelect'),
      document.querySelector('.GaeSiPan_list'),
      document.querySelector('.GaeSiPan_Write'),
    ].filter(Boolean);
    window.swtich_list = list;
    return () => { try { delete window.swtich_list; } catch (_) { } };
  }, []);

  // 시간조율표 입력값 4가지
  const [whenDateStart, setWhenDateStart] = React.useState("2025-10-01");
  const [howDateLong, setHowDateLong] = React.useState("");
  const [timeStart, setTimeStart] = React.useState("09:00");
  const [timeEnd, setTimeEnd] = React.useState("18:00");
  const [items, setItems] = React.useState([]); // 이거는 위에 4개 데이터를 넣은 배열로 사용


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


  // 버튼: 시간조율표 생성 == 하단 리스트에 TimeSelect_item 1개 생성
  const onMakeClick = React.useCallback(() => {
    if (!howDateLong) {
      alert("며칠치를 생성할지 선택하세요");
      return;
    }

    const when_dateStart = whenDateStart;
    const how_dateLong_int = parseInt(howDateLong || "0", 10);
    const when_timeStart = parseInt((timeStart || "0").split(":")[0], 10);
    const when_timeEnd = parseInt((timeEnd || "0").split(":")[0], 10);

    console.log("when_dateStart:", when_dateStart);
    console.log("how_dateLong_int:", how_dateLong_int);
    console.log("start time:", when_timeStart);
    console.log("end time:", when_timeEnd);
    console.log("minus:", (when_timeEnd - when_timeStart) * 2);

    const now = new Date();
    const nowString = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

    const newItem = {
      id: `${now.getTime()}`,
      createdLabel: `${nowString}에 생성된 시간조율표`,
      dateStart: when_dateStart,
      dateLength: how_dateLong_int,
      timeStartHour: when_timeStart,
      timeEndHour: when_timeEnd,
    };

    setItems((prev) => [newItem, ...prev]);
  }, [whenDateStart, howDateLong, timeStart, timeEnd]);


  // TimeSelect_item 클릭 시, 해당 조율표 화면에 표기
  const onItemClick = React.useCallback((item) => {
    window.swtich_list[0].classList.add("off");
    window.swtich_list[1].classList.add("on");
    if (typeof window.TimeSelect_MoveToGrid === "function") {
      window.TimeSelect_MoveToGrid(
        item.dateStart,
        item.dateLength,
        item.timeStartHour,
        item.timeEndHour
      );
    } else {
      console.log("const onItemClick() 뭔가 잘못됬음 ");
    }
  }, []);



  // ================================
  // 여기부터 드래그표 관련 js들
  React.useEffect(() => {

    // 드래그표 왼쪽 거_(실제 클릭 및 드래그 하는 곳) 생성 func
    function setupGrid_left(dateData, rowCount, columnCount) {
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

      // 폐기: 선택된 시간 표기 (log로 대체한 코드 일단 아래에)
      // function generateSummary() {
      //   const selectedByDay = {};
      //   const summaryParts = [];
      //   cells.forEach((cell, index) => {
      //     if (cell.classList.contains('selected')) {
      //       const dayIndex = index % cols;
      //       const timeIndex = Math.floor(index / cols);
      //       const dayName = days[dayIndex];
      //       if (!selectedByDay[dayName]) selectedByDay[dayName] = [];
      //       selectedByDay[dayName].push(timeIndex);
      //     }
      //   });
      //   days.forEach(day => {
      //     if (!selectedByDay[day]) return;
      //     const timeIndices = selectedByDay[day].sort((a, b) => a - b);
      //     if (timeIndices.length === 0) return;
      //     const dayTimeRanges = [];
      //     let start = timeIndices[0];
      //     let end = timeIndices[0];
      //     for (let i = 1; i < timeIndices.length; i++) {
      //       if (timeIndices[i] === end + 1) end = timeIndices[i];
      //       else {
      //         const startTime = formatTime(start);
      //         const endTime = formatTime(end + 1);
      //         dayTimeRanges.push(`${startTime}~${endTime}`);
      //         start = timeIndices[i];
      //         end = timeIndices[i];
      //       }
      //     }
      //     const startTime = formatTime(start);
      //     const endTime = formatTime(end + 1);
      //     dayTimeRanges.push(`${startTime}~${endTime}`);
      //     summaryParts.push(`${day} ${dayTimeRanges.join(', ')}`);
      //   });
      //   if (summaryBox) summaryBox.textContent = summaryParts.length ? summaryParts.join('') : '선택된 시간이 없습니다.';
      // }

      // 선택된 시간 표기 console.log로
      function generateSummary() {
        const selectedByDay = {};
        const summaryParts = [];

        cells.forEach((cell, index) => {
          if (cell.classList.contains('selected')) {
            const dayIndex = index % cols;
            const timeIndex = Math.floor(index / cols);
            const dayName = days[dayIndex];
            if (!selectedByDay[dayName]) selectedByDay[dayName] = [];
            selectedByDay[dayName].push(timeIndex);
          }
        });

        days.forEach(day => {
          if (!selectedByDay[day]) return;
          const timeIndices = selectedByDay[day].sort((a, b) => a - b);
          if (timeIndices.length === 0) return;

          const dayTimeRanges = [];
          let start = timeIndices[0];
          let end = timeIndices[0];

          for (let i = 1; i < timeIndices.length; i++) {
            if (timeIndices[i] === end + 1) end = timeIndices[i];
            else {
              const startTime = formatTime(start);
              const endTime = formatTime(end + 1);
              dayTimeRanges.push(`${startTime}~${endTime}`);
              start = timeIndices[i];
              end = timeIndices[i];
            }
          }

          const startTime = formatTime(start);
          const endTime = formatTime(end + 1);
          dayTimeRanges.push(`${startTime}~${endTime}`);
          summaryParts.push(`${day} ${dayTimeRanges.join(', ')}`);
        });

        if (summaryParts.length > 0) {
          console.log("선택된 시간 list ================================");
          summaryParts.forEach(line => console.log(" - ", line));
        } else {
          console.log("선택된 시간 없");
        }
      }

      function formatTime(index) {
        const totalMinutes = index * 30 + 9 * 60;
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        return String(hours).padStart(2, '0') + ':' + String(minutes).padStart(2, '0');
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
    function setupGrid_right(dateData, rowCount, columnCount) {
      if (columnCount < 1 || columnCount > 7) {
        console.error("열 개수는 1에서 7 사이여야 합니다.");
        return;
      }
      if (!Number.isInteger(rowCount) || rowCount < 1) {
        console.error("행 개수는 1 이상의 정수여야 합니다.");
        return;
      }
      const container = document.getElementById('GRID_rightShow_GridContainer');
      if (!container) return;
      container.innerHTML = '';
      const cols = columnCount;
      const rows = rowCount;
      const totalCells = cols * rows;
      container.style.display = 'grid';
      const COLUMN_WIDTH_PX = 75;
      container.style.gridTemplateColumns = `repeat(${cols}, ${COLUMN_WIDTH_PX}px)`;
      const ROW_HEIGHT_PX = 30;
      container.style.gridTemplateRows = `repeat(${rows}, ${ROW_HEIGHT_PX}px)`;
      for (let i = 0; i < totalCells; i++) {
        const cell = document.createElement('div');
        cell.classList.add('grid_cell_right');
        const row = Math.floor(i / cols);
        const col = i % cols;
        cell.style.border = 'none';
        cell.style.borderLeft = '1px solid rgb(0, 0, 0)';
        if (col === cols - 1) cell.style.borderRight = '1px solid rgb(0, 0, 0)';
        if (row === 0) cell.style.borderTop = '1px solid rgb(0, 0, 0)';
        else cell.style.borderTop = (row % 2 === 0) ? '1px solid rgb(0, 0, 0)' : '1px dashed rgb(0, 0, 0)';
        container.appendChild(cell);
      }
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
          const even = i % 2 === 0; // 30분 간격에서 정각 라벨만 표시
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
    function TimeSelect_MoveToGrid(when_dateStart, how_dateLong_int, when_timeStart, when_timeEnd) {
      const rows = (when_timeEnd - when_timeStart) * 2;
      const cols = how_dateLong_int;
      setupGrid_left(when_dateStart, rows, cols);
      setupGrid_right(when_dateStart, rows, cols);
      fillLeftTime(rows, when_timeStart);
      fillUpDay(when_dateStart, cols);
    }

    // 전역에 노출시킴 (기존 js랑 호환)
    window.TimeSelect_MoveToGrid = TimeSelect_MoveToGrid;
  }, []);



  // ================================
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
        <h1 id="TimeSelect_make_title"><b>시간조율표 생성</b></h1>

        {/* 1. 시작 날짜 */}
        <div className="TimeSelect_make_item">
          <label htmlFor="TimeSelect_howdate" className="TimeSelect_make_label">시작 날짜 입력: </label>
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
          <label htmlFor="list_howdate" className="TimeSelect_make_label">생성 개수 선택: </label>
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
          <label htmlFor="TimeSelect_timestart" className="TimeSelect_make_label">시작 시간대: </label>
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
          <label htmlFor="TimeSelect_timeend" className="TimeSelect_make_label">종료 시간대: </label>
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

        {/* 5. 생성 버튼 */}
        <div className="TimeSelect_make_buttoncontainer">
          <button id="TimeSelect_make_button" type="button" onClick={onMakeClick}>시간조율표 생성</button>
        </div>

        {/* 6. 시간표 리스트 */}
        <div className="TimeSelect_made_list">
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

      {/* 1번: 시간조율 기능 */}
      <div className="TimeSelect">
        <h1 id="TimeSelect_title"><b>시간조율표</b></h1>
        <button
          id="exit_TimeSelect"
          type="button"
          onClick={() => {
            window.swtich_list[0].classList.remove('off');
            window.swtich_list[1].classList.remove('on');
          }}
        >
          <p>생성창으로 돌아가기</p>
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
    </div>
  );
}
