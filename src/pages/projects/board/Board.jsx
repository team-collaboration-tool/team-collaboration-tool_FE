// Board.jsx
// 시작 == npm run dev
// 종료 == ctrl + C

import "./css/csSogong_Board.css";
import React from "react";


export default function Board() {

    // 게시판
    // 목록 | 페이지 | 상세 | 작성 | 투표
    React.useEffect(() => {
        // const switch1 = document.getElementById("switch_1");
        // const switch2 = document.getElementById("switch_2");

        // const onSwitch1 = () => {
        //     if (!window.swtich_list) return;
        //     window.swtich_list[0]?.classList.remove("off");
        //     window.swtich_list[1]?.classList.remove("on");
        //     window.swtich_list[2]?.classList.remove("on");
        // };
        // const onSwitch2 = () => {
        //     if (!window.swtich_list) return;
        //     window.swtich_list[0]?.classList.add("off");
        //     window.swtich_list[1]?.classList.remove("on");
        //     window.swtich_list[2]?.classList.add("on");
        // };

        // switch1 && switch1.addEventListener("click", onSwitch1);
        // switch2 && switch2.addEventListener("click", onSwitch2);


        // 글쓰기 버튼 로직
        const writeBtn = document.getElementById("GSP_write");
        const exitWriteBtn = document.getElementById("exit_write");
        const blurList = document.getElementById("GSP_blurScreen");
        const writePanel = document.querySelector(".GaeSiPan_Write");

        const onOpenWrite = () => {
            writePanel?.classList.add("on");
            blurList?.classList.add("on");
        };
        const onCloseWrite = () => {
            writePanel?.classList.remove("on");
            blurList?.classList.remove("on");
        };

        writeBtn && writeBtn.addEventListener("click", onOpenWrite);
        exitWriteBtn && exitWriteBtn.addEventListener("click", onCloseWrite);


        // 게시글 임시 데이터
        const xmlString = `<posts>
      <post><id>1</id><title>1번글 제목</title><content>1번글 내용</content><author>1번 글쓴이</author><timestamp>2025-09-08 11:00:00</timestamp><ishavefile>true</ishavefile><ishavevote>false</ishavevote><isitGongJi>false</isitGongJi></post>
      <post><id>2</id><title>2번글 제목</title><content>2번글 내용</content><author>2번 글쓴이</author><timestamp>2025-09-08 12:30:00</timestamp><ishavefile>false</ishavefile><ishavevote>false</ishavevote><isitGongJi>false</isitGongJi></post>
      <post><id>3</id><title>3번글 제목</title><content>3번글 내용</content><author>3번 글쓴이</author><timestamp>2025-09-08 14:15:00</timestamp><ishavefile>true</ishavefile><ishavevote>false</ishavevote><isitGongJi>false</isitGongJi></post>
      <post><id>4</id><title>4번글 제목</title><content>4번글 내용</content><author>4번 글쓴이</author><timestamp>2025-09-08 15:30:00</timestamp><ishavefile>false</ishavefile><ishavevote>false</ishavevote><isitGongJi>false</isitGongJi></post>
      <post><id>5</id><title>5번글 제목</title><content>5번글 내용</content><author>5번 글쓴이</author><timestamp>2025-09-08 16:45:00</timestamp><ishavefile>true</ishavefile><ishavevote>false</ishavevote><isitGongJi>false</isitGongJi></post>
      <post><id>6</id><title>6번글 제목</title><content>6번글 내용</content><author>6번 글쓴이</author><timestamp>2025-09-08 17:50:00</timestamp><ishavefile>false</ishavefile><ishavevote>false</ishavevote><isitGongJi>false</isitGongJi></post>
      <post><id>7</id><title>7번글 제목</title><content>7번글 내용</content><author>7번 글쓴이</author><timestamp>2025-09-08 19:10:00</timestamp><ishavefile>false</ishavefile><ishavevote>false</ishavevote><isitGongJi>false</isitGongJi></post>
      <post><id>8</id><title>8번글 제목</title><content>8번글 내용</content><author>8번 글쓴이</author><timestamp>2025-09-08 20:25:00</timestamp><ishavefile>true</ishavefile><ishavevote>false</ishavevote><isitGongJi>false</isitGongJi></post>
      <post><id>9</id><title>9번글 제목</title><content>9번글 내용</content><author>9번 글쓴이</author><timestamp>2025-09-08 21:40:00</timestamp><ishavefile>false</ishavefile><ishavevote>false</ishavevote><isitGongJi>false</isitGongJi></post>
      <post><id>10</id><title>10번 공지글 제목</title><content>10번글 내용</content><author>10번 글쓴이</author><timestamp>2025-09-08 23:05:00</timestamp><ishavefile>true</ishavefile><ishavevote>true</ishavevote><isitGongJi>true</isitGongJi></post>
      <post><id>11</id><title>11번글 제목</title><content>11번글 내용</content><author>11번 글쓴이</author><timestamp>2025-09-09 09:10:00</timestamp><ishavefile>true</ishavefile><ishavevote>false</ishavevote><isitGongJi>false</isitGongJi></post>
      <post><id>12</id><title>12번글 제목</title><content>12번글 내용</content><author>12번 글쓴이</author><timestamp>2025-09-09 10:25:00</timestamp><ishavefile>false</ishavefile><ishavevote>true</ishavevote><isitGongJi>false</isitGongJi></post>
      <post><id>13</id><title>13번글 제목</title><content>13번글 내용</content><author>13번 글쓴이</author><timestamp>2025-09-09 11:40:00</timestamp><ishavefile>true</ishavefile><ishavevote>false</ishavevote><isitGongJi>false</isitGongJi></post>
      <post><id>14</id><title>14번글 제목</title><content>14번글 내용</content><author>14번 글쓴이</author><timestamp>2025-09-09 12:55:00</timestamp><ishavefile>false</ishavefile><ishavevote>true</ishavevote><isitGongJi>false</isitGongJi></post>
      <post><id>15</id><title>15번글 제목</title><content>15번글 내용</content><author>15번 글쓴이</author><timestamp>2025-09-09 14:10:00</timestamp><ishavefile>true</ishavefile><ishavevote>false</ishavevote><isitGongJi>false</isitGongJi></post>
      <post><id>16</id><title>16번글 제목</title><content>16번글 내용</content><author>16번 글쓴이</author><timestamp>2025-09-09 15:25:00</timestamp><ishavefile>true</ishavefile><ishavevote>true</ishavevote><isitGongJi>false</isitGongJi></post>
      <post><id>17</id><title>17번글 제목</title><content>17번글 내용</content><author>17번 글쓴이</author><timestamp>2025-09-09 16:40:00</timestamp><ishavefile>false</ishavefile><ishavevote>false</ishavevote><isitGongJi>false</isitGongJi></post>
      <post><id>18</id><title>18번글 제목</title><content>18번글 내용</content><author>18번 글쓴이</author><timestamp>2025-09-09 17:55:00</timestamp><ishavefile>true</ishavefile><ishavevote>false</ishavevote><isitGongJi>false</isitGongJi></post>
      <post><id>19</id><title>19번글 제목</title><content>19번글 내용</content><author>19번 글쓴이</author><timestamp>2025-09-09 19:10:00</timestamp><ishavefile>false</ishavefile><ishavevote>true</ishavevote><isitGongJi>false</isitGongJi></post>
      <post><id>20</id><title>20번 공지글 제목</title><content>20번글 내용</content><author>20번 글쓴이</author><timestamp>2025-09-09 20:25:00</timestamp><ishavefile>true</ishavefile><ishavevote>false</ishavevote><isitGongJi>true</isitGongJi></post>
      <post><id>21</id><title>21번글 제목</title><content>21번글 내용</content><author>21번 글쓴이</author><timestamp>2025-09-09 21:40:00</timestamp><ishavefile>false</ishavefile><ishavevote>true</ishavevote><isitGongJi>false</isitGongJi></post>
      <post><id>22</id><title>22번글 제목</title><content>22번글 내용</content><author>22번 글쓴이</author><timestamp>2025-09-09 22:55:00</timestamp><ishavefile>true</ishavefile><ishavevote>false</ishavevote><isitGongJi>false</isitGongJi></post>
      <post><id>23</id><title>23번글 제목</title><content>23번글 내용</content><author>23번 글쓴이</author><timestamp>2025-09-10 09:15:00</timestamp><ishavefile>true</ishavefile><ishavevote>true</ishavevote><isitGongJi>false</isitGongJi></post>
      <post><id>24</id><title>24번글 제목</title><content>24번글 내용</content><author>24번 글쓴이</author><timestamp>2025-09-10 10:30:00</timestamp><ishavefile>false</ishavefile><ishavevote>false</ishavevote><isitGongJi>false</isitGongJi></post>
      <post><id>25</id><title>25번글 제목</title><content>25번글 내용</content><author>25번 글쓴이</author><timestamp>2025-09-10 11:45:00</timestamp><ishavefile>true</ishavefile><ishavevote>false</ishavevote><isitGongJi>false</isitGongJi></post>
      <post><id>26</id><title>26번글 제목</title><content>26번글 내용</content><author>26번 글쓴이</author><timestamp>2025-09-10 13:00:00</timestamp><ishavefile>false</ishavefile><ishavevote>true</ishavevote><isitGongJi>false</isitGongJi></post>
      <post><id>27</id><title>27번글 제목</title><content>27번글 내용</content><author>27번 글쓴이</author><timestamp>2025-09-10 14:15:00</timestamp><ishavefile>true</ishavefile><ishavevote>false</ishavevote><isitGongJi>false</isitGongJi></post>
      <post><id>28</id><title>28번글 제목</title><content>28번글 내용</content><author>28번 글쓴이</author><timestamp>2025-09-10 15:30:00</timestamp><ishavefile>false</ishavefile><ishavevote>true</ishavevote><isitGongJi>false</isitGongJi></post>
      <post><id>29</id><title>29번글 제목</title><content>29번글 내용</content><author>29번 글쓴이</author><timestamp>2025-09-10 16:45:00</timestamp><ishavefile>true</ishavefile><ishavevote>true</ishavevote><isitGongJi>false</isitGongJi></post>
      <post><id>30</id><title>30번글 제목</title><content>30번글 내용</content><author>30번 글쓴이</author><timestamp>2025-09-10 18:00:00</timestamp><ishavefile>false</ishavefile><ishavevote>false</ishavevote><isitGongJi>false</isitGongJi></post>
      <post><id>31</id><title>31번글 제목</title><content>31번글 내용</content><author>31번 글쓴이</author><timestamp>2025-09-10 19:15:00</timestamp><ishavefile>true</ishavefile><ishavevote>false</ishavevote><isitGongJi>false</isitGongJi></post>
      <post><id>32</id><title>32번글 제목</title><content>32번글 내용</content><author>32번 글쓴이</author><timestamp>2025-09-10 20:30:00</timestamp><ishavefile>false</ishavefile><ishavevote>true</ishavevote><isitGongJi>false</isitGongJi></post>
      <post><id>33</id><title>33번글 제목</title><content>33번글 내용</content><author>33번 글쓴이</author><timestamp>2025-09-10 21:45:00</timestamp><ishavefile>true</ishavefile><ishavevote>false</ishavevote><isitGongJi>false</isitGongJi></post>
      <post><id>34</id><title>34번글 제목</title><content>34번글 내용</content><author>34번 글쓴이</author><timestamp>2025-09-10 23:00:00</timestamp><ishavefile>false</ishavefile><ishavevote>true</ishavevote><isitGongJi>false</isitGongJi></post>
      <post><id>35</id><title>35번글 제목</title><content>35번글 내용</content><author>35번 글쓴이</author><timestamp>2025-09-11 09:00:00</timestamp><ishavefile>true</ishavefile><ishavevote>false</ishavevote><isitGongJi>false</isitGongJi></post>
    </posts>`;

        // 게시판 페이지 글 나열 로직
        const PAGE_SIZE = 10;
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlString, "text/xml");
        const postsArray = Array.from(xmlDoc.getElementsByTagName("post"));

        postsArray.sort((a, b) => {
            const idA = parseInt(a.getElementsByTagName("id")[0].textContent || "0", 10);
            const idB = parseInt(b.getElementsByTagName("id")[0].textContent || "0", 10);
            return idB - idA;
        });

        const notices = [];
        const normals = [];
        postsArray.forEach((p) => {
            const isNotice =
                ((p.getElementsByTagName("isitGongJi")[0]?.textContent || "")
                    .trim()
                    .toLowerCase() === "true");
            if (isNotice) notices.push(p);
            else normals.push(p);
        });

        const listContainer = document.getElementById("list_write");
        const pageContainer = document.getElementById("GSP_page");
        const seeContainer = document.querySelector(".GaeSiPan_See");
        if (!listContainer || !pageContainer || !seeContainer) {
            return () => { };
        }

        const buildPostItem = (post, isNotice) => {
            const id = post.getElementsByTagName("id")[0].textContent || "";
            const title = post.getElementsByTagName("title")[0].textContent || "";
            const author = post.getElementsByTagName("author")[0].textContent || "";
            const timestamp = post.getElementsByTagName("timestamp")[0].textContent || "";

            const hasVote =
                ((post.getElementsByTagName("ishavevote")[0]?.textContent || "")
                    .trim()
                    .toLowerCase() === "true");

            const hasFile =
                ((post.getElementsByTagName("ishavefile")[0]?.textContent || "")
                    .trim()
                    .toLowerCase() === "true");

            const postDiv = document.createElement("div");
            postDiv.className = "post_item";

            const idSpan = document.createElement("span");
            idSpan.className = "post_id";
            idSpan.textContent = id;
            postDiv.appendChild(idSpan);

            const titleSpan = document.createElement("span");
            titleSpan.className = "post_title";
            titleSpan.textContent = title;
            if (isNotice) titleSpan.classList.add("RED_title");
            postDiv.appendChild(titleSpan);

            const authorSpan = document.createElement("span");
            authorSpan.className = "post_author";
            authorSpan.textContent = author;
            postDiv.appendChild(authorSpan);

            const timestampSpan = document.createElement("span");
            timestampSpan.className = "post_timestamp";
            timestampSpan.textContent = (timestamp.split(" ")[0]) || "";
            postDiv.appendChild(timestampSpan);

            const voteSpan = document.createElement("span");
            voteSpan.className = `post_ishaveVote ${hasVote ? "has-vote" : "no-vote"}`;
            voteSpan.textContent = hasVote ? "✅" : "-";
            voteSpan.setAttribute("aria-label", hasVote ? "투표 있음" : "투표 없음");
            postDiv.appendChild(voteSpan);

            const fileSpan = document.createElement("span");
            fileSpan.className = `post_ishavefile ${hasFile ? "has-file" : "no-file"}`;
            fileSpan.textContent = hasFile ? "📎" : "-";
            fileSpan.setAttribute("aria-label", hasFile ? "파일 첨부 있음" : "파일 첨부 없음");
            postDiv.appendChild(fileSpan);

            return postDiv;
        };

        const clearPostItems = () => {
            listContainer.querySelectorAll(".post_item").forEach((el) => el.remove());
        };

        const renderPosts = (page) => {
            clearPostItems();

            const totalPosts = notices.length + normals.length;
            const totalPages = Math.ceil(totalPosts / PAGE_SIZE);
            const page1NormalCount = Math.max(0, PAGE_SIZE - notices.length);

            let items = [];

            if (page === 1) {
                items = [...notices, ...normals.slice(0, page1NormalCount)];
            } else {
                const offsetInNormals = page1NormalCount + (page - 2) * PAGE_SIZE;
                items = normals.slice(offsetInNormals, offsetInNormals + PAGE_SIZE);
            }

            items.forEach((p) => {
                const isNotice =
                    ((p.getElementsByTagName("isitGongJi")[0]?.textContent || "")
                        .trim()
                        .toLowerCase() === "true");
                listContainer.appendChild(buildPostItem(p, isNotice));
            });
        };

        const renderPagination = (currentPage) => {
            const totalPosts = notices.length + normals.length;
            const totalPages = Math.ceil(totalPosts / PAGE_SIZE);
            pageContainer.innerHTML = "";

            const makeBtn = (label, page, disabled = false, isActive = false) => {
                const btn = document.createElement("div");
                btn.className = "GSP_page_mode";
                if (disabled) btn.classList.add("disabled");
                if (isActive) btn.classList.add("active");
                btn.textContent = label;
                btn.dataset.page = String(page);
                pageContainer.appendChild(btn);
            };

            makeBtn("<", Math.max(1, currentPage - 1), currentPage === 1);
            for (let p = 1; p <= totalPages; p++) {
                makeBtn(String(p), String(p), false, p === currentPage);
            }
            makeBtn(">", Math.min(totalPages, currentPage + 1), currentPage === totalPages);
        };

        let currentPage = 1;
        const onPageClick = (e) => {
            const target = e.target.closest(".GSP_page_mode");
            if (!target || target.classList.contains("disabled")) return;
            const toPage = parseInt(target.dataset.page, 10);
            if (!Number.isFinite(toPage) || toPage === currentPage) return;

            currentPage = toPage;
            renderPosts(currentPage);
            renderPagination(currentPage);
        };
        pageContainer.addEventListener("click", onPageClick);

        renderPosts(currentPage);
        renderPagination(currentPage);


        // (임시) 다운로드 박스 개체
        const DOWNLOAD_HTML = `
      <div class="GSPS_download_field">
        <label id="GSPS_download_title">첨부파일 목록</label>
        <div class="GSPS_download_mode">첨부파일 1</div>
        <div class="GSPS_download_mode">첨부파일 2</div>
      </div>
    `;

        // (임시) 투표 박스 개체
        const VOTE_HTML = `
      <div class="VOTE_container">
        <div class="VOTE_Page">
          <h1 id="VOTE_title">이 투표의 이름</h1>
          <h2 id="VOTE_isitMulti">중복 허용</h2>
          <h2 id="VOTE_isitSecret">익명 아님</h2>

          <div class="VOTE_item">
            <input type="checkbox" name="VOTE_item_check" value="1번 선택지">
            <span>1번 선택지</span>
          </div>
          <div class="VOTE_item">
            <input type="checkbox" name="VOTE_item_check" value="2번 선택지">
            <span>2번 선택지</span>
          </div>
          <div class="VOTE_item">
            <input type="checkbox" name="VOTE_item_check" value="3번 선택지">
            <span>3번 선택지</span>
          </div>
          <button class="VOTE_complete_button"><b>투표완료</b></button>
        </div>

        <div class="VOTE_Result">

          <h1 id="VoteResult_title">이 투표의 결과</h1>
          <div class="VoteResult_item">
            <span>1번 선택지</span>
            <div class="VoteResult_item_PeopleNumber">3명</div>
            <div class="VoteResult_item_WhoVoted">
              <div class="VoteResult_item_WhoVoted_person">이름1</div>
              <div class="VoteResult_item_WhoVoted_person">이름2</div>
              <div class="VoteResult_item_WhoVoted_person">이름3</div>
            </div>
            <div class="VoteResult_item_Gage">
              <div class="VoteResult_item_Gage_inner"></div>
            </div>
          </div>
          <div class="VoteResult_item">
            <span>2번 선택지</span>
            <div class="VoteResult_item_PeopleNumber">2명</div>
            <div class="VoteResult_item_WhoVoted">
              <div class="VoteResult_item_WhoVoted_person">이름4</div>
              <div class="VoteResult_item_WhoVoted_person">이름5</div>
            </div>
            <div class="VoteResult_item_Gage"></div>
          </div>
          <div class="VoteResult_item">
            <span>3번 선택지</span>
            <div class="VoteResult_item_PeopleNumber">1명</div>
            <div class="VoteResult_item_WhoVoted">
              <div class="VoteResult_item_WhoVoted_person">이름6</div>
            </div>
            <div class="VoteResult_item_Gage"></div>
          </div>
          <button class="VoteResult_revote_button">재투표하기</button>
        </div>
      </div>
    `;

        const escapeHTML = (s) =>
            String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

        const getPostDataById = (idStr) => {
            const el = postsArray.find(
                (p) => (p.getElementsByTagName("id")[0]?.textContent || "").trim() === idStr
            );
            if (!el) return null;
            const t = (tag) => (el.getElementsByTagName(tag)[0]?.textContent || "").trim();
            return {
                id: t("id"),
                title: t("title"),
                content: t("content"),
                author: t("author"),
                timestamp: t("timestamp"),
                hasFile: t("ishavefile").toLowerCase() === "true",
                hasVote: t("ishavevote").toLowerCase() === "true",
            };
        };

        const renderSee = (post) => {
            if (!post) return;
            const fileHTML = post.hasFile ? DOWNLOAD_HTML : "";
            const voteHTML = post.hasVote ? VOTE_HTML : "";

            seeContainer.innerHTML = `
        <button id="exit_See">X</button>
        <button id="edit_See">수정</button>
        <button id="delete_See">삭제</button>
        <h1 id="GSPS_head">게시글 보기</h1>

        <div class="GSPS_field">
          <div id="GSPS_title">${escapeHTML(post.title)}</div>
        </div>

        ${fileHTML}

        ${voteHTML}

        <div class="GSPS_field">
          <div id="GSPS_content">
            <p>${escapeHTML(post.content)}</p>
          </div>
        </div>
      `;

            const voteContainer = seeContainer.querySelector(".VOTE_container");
            if (voteContainer) {
                voteContainer.style.display = "flex";
                voteContainer.style.flexDirection = "row";
                voteContainer.style.alignItems = "flex-start";
                voteContainer.style.gap = "16px";
            }

            const exitBtn = seeContainer.querySelector("#exit_See");
            exitBtn && exitBtn.addEventListener("click", () => {
                seeContainer.innerHTML = "";
            });

            // (임시) 투표 결과창
            let VoteResult_NumberResult = [3, 2, 1];
            let VoteResult_Option_who = [["이름1", "이름2", "이름3"], ["이름4", "이름5"], ["이름6"]];

            const completeBtn = seeContainer.querySelector(".VOTE_complete_button");
            const resultPanel = seeContainer.querySelector(".VOTE_Result");
            completeBtn &&
                completeBtn.addEventListener("click", () => {
                    const checks = Array.from(
                        seeContainer.querySelectorAll('.VOTE_item input[type="checkbox"]')
                    );
                    checks.forEach((checkbox, index) => {
                        if (checkbox.checked) {
                            if (VoteResult_NumberResult[index] == null) VoteResult_NumberResult[index] = 0;
                            VoteResult_NumberResult[index]++;
                            if (!VoteResult_Option_who[index]) VoteResult_Option_who[index] = [];
                            VoteResult_Option_who[index].push("너");
                        }
                    });
                    console.log("투표 결과 인원수:", VoteResult_NumberResult);
                    console.log("투표 결과 누가:", VoteResult_Option_who);
                    resultPanel && resultPanel.classList.add("on");
                });

            const numBtns = seeContainer.querySelectorAll(".VoteResult_item_PeopleNumber");
            numBtns.forEach((btn, idx) => {
                btn.addEventListener("click", () => {
                    const whoPanels = seeContainer.querySelectorAll(".VoteResult_item_WhoVoted");
                    const target = whoPanels[idx];
                    target && target.classList.toggle("on");
                });
            });

            seeContainer.scrollIntoView({ behavior: "smooth", block: "start" });
        };

        // 게시판 리스트에서 게시글 1개 클릭
        const onListClick = (e) => {
            const item = e.target.closest(".post_item");
            if (!item) return;

            const idEl = item.querySelector(".post_id");
            const clickedId = idEl?.textContent?.trim();
            if (!clickedId) return;

            const post = getPostDataById(clickedId);
            renderSee(post);
        };
        listContainer.addEventListener("click", onListClick);

        // 게시글 작성 완료 버튼 로직
        const onSubmitWrite = () => {
            const titleEl = document.getElementById("title");
            const isNoticeEl = document.getElementById("is-notice");
            const fileEl = document.getElementById("file-upload");
            const contentEl = document.getElementById("content");

            const title = titleEl && titleEl.value;
            const isNotice = isNoticeEl && isNoticeEl.checked;
            const files = (fileEl && fileEl.files) || null;
            const content = contentEl && contentEl.value;

            if (!title || !content) {
                alert("제목과 본문을 모두 입력해주세요.");
                return;
            }

            const fileNames = files ? Array.from(files).map((f) => f.name).join(", ") : "";

            const value_PostMake_title = title;
            const value_PostMake_isNotice = isNotice ? "공지글 O" : "공지글 X";
            const value_PostMake_files = files && files.length > 0 ? fileNames : "없음";
            const value_PostMake_content = content;

            const LOG_PostMake = {
                value_PostMake_title,
                value_PostMake_isNotice,
                value_PostMake_files,
                value_PostMake_content,
            };

            console.log("게시글 생성 로그");
            console.log(LOG_PostMake);

            alert("게시글 생성 완료. console log 확인");
        };
        const submitBtn = document.querySelector(".GSPW_submit_button");
        submitBtn && submitBtn.addEventListener("click", onSubmitWrite);


        // 게시글 작성 중 투표 생성 시
        const openVoteBtn = document.querySelector(".GSPW_vote_button");
        const closeVoteBtn = document.getElementById("exit_VoteMake");
        const writeBlur = document.getElementById("GSPW_blurScreen");
        const voteMakePanel = document.querySelector(".VOTE_Make");

        const onOpenVote = () => {
            writeBlur?.classList.add("on");
            voteMakePanel?.classList.add("on");
        };
        const onCloseVote = () => {
            writeBlur?.classList.remove("on");
            voteMakePanel?.classList.remove("on");
        };
        openVoteBtn && openVoteBtn.addEventListener("click", onOpenVote);
        closeVoteBtn && closeVoteBtn.addEventListener("click", onCloseVote);

        // 게시글 작성 중 투표 생성 시, 투표 선택지 추가
        let CountOption_MakeVote = 2;
        const addOptionBtn = document.getElementById("VoteMake_AddOption");
        const optionContainer = document.getElementById("VoteMake_OptionContainer_all");

        const onAddOption = () => {
            if (CountOption_MakeVote >= 8) {
                alert("선택지는 8개를 넘을 수 없습니다.");
                return;
            }
            CountOption_MakeVote++;

            // 새로운 컨테이너 div 생성
            const OptionWrapper = document.createElement("div");
            OptionWrapper.className = "VoteMake_OptionContainer_one";

            // 선택지 input 생성
            const NewOption = document.createElement("input");
            NewOption.type = "text";
            NewOption.className = "VoteMake_Option";
            NewOption.placeholder = "선택지";
            NewOption.required = true;

            // 삭제 버튼 생성
            const NewDelete = document.createElement("button");
            NewDelete.type = "button";
            NewDelete.id = "VoteMake_DeleteOption";
            NewDelete.textContent = "-";

            // 삭제 이벤트 등록
            NewDelete.addEventListener("click", () => {
                CountOption_MakeVote--;
                OptionWrapper.remove(); // div 통째로 삭제
            });

            // div 내부에 input과 button 추가
            OptionWrapper.appendChild(NewOption);
            OptionWrapper.appendChild(NewDelete);

            // optionContainer에 div 전체 추가
            optionContainer?.appendChild(OptionWrapper);

            console.log(`CountOption_MakeVote++ == ${CountOption_MakeVote}`);
        };
        addOptionBtn && addOptionBtn.addEventListener("click", onAddOption);


        // 투표 생성 버튼 로직
        const makeVoteBtn = document.getElementById("VoteMake_button");
        const onMakeVote = () => {
            const titleEl = document.getElementById("VoteMake_Title");
            const dayEl = document.getElementById("VoteMake_Deadline_Day");
            const timeEl = document.getElementById("VoteMake_Deadline_Time");
            const reqOptions = optionContainer?.querySelectorAll("input[required]") || [];

            let empty = false;
            if (!titleEl?.value?.trim()) empty = true;
            if (!dayEl?.value?.trim()) empty = true;
            if (!timeEl?.value?.trim()) empty = true;
            reqOptions.forEach((i) => {
                if (!i.value.trim()) empty = true;
            });

            if (empty) {
                alert("모든 항목을 입력하세요");
                return;
            }

            const value_VoteMake_Title = titleEl.value;
            const value_VoteMake_Deadline_Day = dayEl.value;
            const value_VoteMake_Deadline_Time = timeEl.value;
            const value_VoteMake_isitMulti = document.getElementById("VoteMake_isitMulti")?.checked || false;
            const value_VoteMake_isitAnonymous = document.getElementById("VoteMake_isitAnonymous")?.checked || false;
            const value_VoteMake_Options = Array.from(
                optionContainer?.querySelectorAll(".VoteMake_Option") || []
            ).map((i) => i.value.trim());

            const LOG_VoteMake = {
                value_VoteMake_Title,
                value_VoteMake_Options,
                value_VoteMake_Deadline_Day,
                value_VoteMake_Deadline_Time,
                value_VoteMake_isitMulti,
                value_VoteMake_isitAnonymous,
            };
            console.log("투표 생성 로그");
            console.log(LOG_VoteMake);
        };
        makeVoteBtn && makeVoteBtn.addEventListener("click", onMakeVote);


        return () => {
            // switch1 && switch1.removeEventListener("click", onSwitch1);
            // switch2 && switch2.removeEventListener("click", onSwitch2);
            writeBtn && writeBtn.removeEventListener("click", onOpenWrite);
            exitWriteBtn && exitWriteBtn.removeEventListener("click", onCloseWrite);
            pageContainer.removeEventListener("click", onPageClick);
            listContainer.removeEventListener("click", onListClick);
            submitBtn && submitBtn.removeEventListener("click", onSubmitWrite);
            openVoteBtn && openVoteBtn.removeEventListener("click", onOpenVote);
            closeVoteBtn && closeVoteBtn.removeEventListener("click", onCloseVote);
            addOptionBtn && addOptionBtn.removeEventListener("click", onAddOption);
            makeVoteBtn && makeVoteBtn.removeEventListener("click", onMakeVote);
        };
    }, []);


    // 여기부터 html 영역
    return (
        <>
            {/* 2번: 게시판 나열 기능 */}
            <div className="GaeSiPan_list">
                <h1 id="GaeSiPan_list_title"><b>게시판</b></h1>
                <button id="GSP_write">게시글 작성</button>
                <div id="list_write">
                    <div className="post_header">
                        <span className="post_id">글번호</span>
                        <span className="post_title">제목</span>
                        <span className="post_author">작성자</span>
                        <span className="post_timestamp">작성일자</span>
                        <span className="post_ishaveVote">투표유무</span>
                        <span className="post_ishavefile">파일첨부</span>
                    </div>

                </div>
                <div id="GSP_page"></div>
                <div id="GSP_blurScreen"></div>
            </div>

            {/* 3번: 게시글 작성 기능 */}
            <div className="GaeSiPan_Write">
                <button id="exit_write"><p>X</p></button>
                <h1 id="GSPW_head">게시글 작성</h1>

                <div className="GSPW_field">
                    <label htmlFor="title" className="form_label">제목</label>
                    <input type="text" id="title" placeholder="제목을 입력하세요" className="form_input" />
                </div>

                <div className="GSPW_field">
                    <div className="checkbox_container">
                        <input type="checkbox" id="is-notice" />
                        <label htmlFor="is-notice" className="checkbox_label">공지사항 유무</label>
                    </div>
                </div>

                <div className="GSPW_field">
                    <label htmlFor="file-upload" className="form_label">첨부파일</label>
                    <input type="file" id="file-upload" multiple className="form_file_input" />
                    <button className="GSPW_vote_button">투표 추가</button>
                </div>

                <div className="GSPW_field">
                    <label htmlFor="content" className="form_label">본문</label>
                    <textarea id="content" rows="10" placeholder="내용을 입력하세요" className="form_textarea"></textarea>
                </div>

                <div className="button_container">
                    <button className="GSPW_submit_button">작성완료</button>
                </div>
                <div id="GSPW_blurScreen"></div>

                {/* 7-1: 투표 생성 */}
                <div className="VOTE_Make">
                    <h2 id="VoTeMake_Top">새 투표 생성</h2>
                    <button id="exit_VoteMake">X</button>

                    <div className="VoteMake_item">
                        <label htmlFor="VoteMake_Title">투표 제목</label>
                        <input type="text" id="VoteMake_Title" placeholder=" 제목 입력" required />
                    </div>

                    <div className="VoteMake_item">
                        <label>선택지들</label>

                        {/* 선택지들 컨테이너 2개임 == 전체용, 개별용*/}
                        <div id="VoteMake_OptionContainer_all">
                            <div class="VoteMake_OptionContainer_one">
                                <input type="text" className="VoteMake_Option" placeholder="선택지" required />
                            </div>
                            <div class="VoteMake_OptionContainer_one">
                                <input type="text" className="VoteMake_Option" placeholder="선택지" required />
                            </div>
                        </div>
                        <button type="button" id="VoteMake_AddOption">선택지 추가</button>
                    </div>

                    <div className="VoteMake_item">
                        <label htmlFor="VoteMake_Deadline">마감 날짜, 시간</label>
                        <input type="date" id="VoteMake_Deadline_Day" required />
                        <input type="time" id="VoteMake_Deadline_Time" required />
                    </div>

                    <div className="VoteMake_item">
                        <div className="VoteMake_CheckboxContainer">
                            <div className="VoteMake_Checkbox_item">
                                <input type="checkbox" id="VoteMake_isitMulti" />
                                <label htmlFor="VoteMake_isitMulti">중복 선택 허용</label>
                            </div>
                            <div className="VoteMake_Checkbox_item">
                                <input type="checkbox" id="VoteMake_isitAnonymous" />
                                <label htmlFor="VoteMake_isitAnonymous">익명 투표</label>
                            </div>
                        </div>
                    </div>

                    <button type="submit" id="VoteMake_button">투표 생성</button>
                </div>
            </div>

            {/* 6번: 게시글 보기 (리액트 js로 채움) */}
            <div className="GaeSiPan_See" />
        </>
    );
}