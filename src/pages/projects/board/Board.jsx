// Board.jsx
// 시작 == npm run dev
// 종료 == ctrl + C

// 도메인 주소
// http://hyupmin.ap-northeast-2.elasticbeanstalk.com/

import "../schedule/css/csSogong_Board.css";
import React from "react";
import GongJiIcon from "/src/asset/Icon/GongJi.png";
import { useParams } from "react-router-dom";
// import axios from "axios";

// baseURL import
const baseURL =
    import.meta.env.VITE_DEV_PROXY_URL;



export default function Board() {

    // projectPK!!
    const { projectID } = useParams();
    const ProjectPK = projectID;

    // userPK!!
    const [myUserPk, setMyUserPk] = React.useState(null);
    const [myEmail, setMyEmail] = React.useState(null);


    // GET : /api/users/me == 내 이메일 얻기
    const getMyUserInfo = React.useCallback(() => {
        const token = localStorage.getItem("token");

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
        const token = localStorage.getItem("token");
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


    // 이메일로 내 userPK 찾기
    React.useEffect(() => {
        getMyUserInfo();
    }, []);
    React.useEffect(() => {
        if (!ProjectPK || !myEmail) return;
        getMyUserPkFromProject(ProjectPK, myEmail);
    }, [ProjectPK, myEmail, getMyUserPkFromProject]);


    // 게시판
    // 목록 | 페이지 | 상세 | 작성 | 투표
    React.useEffect(() => {
        // test : 투표 데이터
        // test : 투표에 대한 기본 정보
        const test_vote_info = {
            "postId": 1,
            "title": "다중 선택 테스트 투표",
            "endTime": "2025-12-31T23:59:00",
            "allowMultipleChoices": true,
            "isAnonymous": false,
            "optionContents": ["A안", "B안", "C안"]
        };
        // test : 투표 항목별 몇 표
        const test_vote_INTarrray = [3, 1, 2];
        // test : 투표 항목별 누가 투표함?
        const test_vote_WHOvote = [["가영", "나영", "다영"], ["가영"], ["가영", "나영"]];


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

        // ==================================================================================
        // [수정 1] Mock Data 분할 (페이지별로 데이터를 쪼갬)
        // ==================================================================================
        // 1페이지 (35~26번)
        const xmlString_1 = `<posts>
          <post><id>35</id><title>35번글 제목</title><content>35번글 내용</content><author>35번 글쓴이</author><timestamp>2025-09-11 09:00:00</timestamp><ishavefile>true</ishavefile><ishavevote>false</ishavevote><isitGongJi>false</isitGongJi></post>
          <post><id>34</id><title>34번글 제목</title><content>34번글 내용</content><author>34번 글쓴이</author><timestamp>2025-09-10 23:00:00</timestamp><ishavefile>false</ishavefile><ishavevote>true</ishavevote><isitGongJi>false</isitGongJi></post>
          <post><id>33</id><title>33번글 제목</title><content>33번글 내용</content><author>33번 글쓴이</author><timestamp>2025-09-10 21:45:00</timestamp><ishavefile>true</ishavefile><ishavevote>false</ishavevote><isitGongJi>false</isitGongJi></post>
          <post><id>32</id><title>32번글 제목</title><content>32번글 내용</content><author>32번 글쓴이</author><timestamp>2025-09-10 20:30:00</timestamp><ishavefile>false</ishavefile><ishavevote>true</ishavevote><isitGongJi>false</isitGongJi></post>
          <post><id>31</id><title>31번글 제목</title><content>31번글 내용</content><author>31번 글쓴이</author><timestamp>2025-09-10 19:15:00</timestamp><ishavefile>true</ishavefile><ishavevote>false</ishavevote><isitGongJi>false</isitGongJi></post>
          <post><id>30</id><title>30번글 제목</title><content>30번글 내용</content><author>30번 글쓴이</author><timestamp>2025-09-10 18:00:00</timestamp><ishavefile>false</ishavefile><ishavevote>false</ishavevote><isitGongJi>false</isitGongJi></post>
          <post><id>29</id><title>29번글 제목</title><content>29번글 내용</content><author>29번 글쓴이</author><timestamp>2025-09-10 16:45:00</timestamp><ishavefile>true</ishavefile><ishavevote>true</ishavevote><isitGongJi>false</isitGongJi></post>
          <post><id>28</id><title>28번글 제목</title><content>28번글 내용</content><author>28번 글쓴이</author><timestamp>2025-09-10 15:30:00</timestamp><ishavefile>false</ishavefile><ishavevote>true</ishavevote><isitGongJi>false</isitGongJi></post>
          <post><id>27</id><title>27번글 제목</title><content>27번글 내용</content><author>27번 글쓴이</author><timestamp>2025-09-10 14:15:00</timestamp><ishavefile>true</ishavefile><ishavevote>false</ishavevote><isitGongJi>false</isitGongJi></post>
          <post><id>26</id><title>26번글 제목</title><content>26번글 내용</content><author>26번 글쓴이</author><timestamp>2025-09-10 13:00:00</timestamp><ishavefile>false</ishavefile><ishavevote>true</ishavevote><isitGongJi>false</isitGongJi></post>
        </posts>`;

        // 2페이지 (25~16번)
        const xmlString_2 = `<posts>
          <post><id>25</id><title>25번글 제목</title><content>25번글 내용</content><author>25번 글쓴이</author><timestamp>2025-09-10 11:45:00</timestamp><ishavefile>true</ishavefile><ishavevote>false</ishavevote><isitGongJi>false</isitGongJi></post>
          <post><id>24</id><title>24번글 제목</title><content>24번글 내용</content><author>24번 글쓴이</author><timestamp>2025-09-10 10:30:00</timestamp><ishavefile>false</ishavefile><ishavevote>false</ishavevote><isitGongJi>false</isitGongJi></post>
          <post><id>23</id><title>23번글 제목</title><content>23번글 내용</content><author>23번 글쓴이</author><timestamp>2025-09-10 09:15:00</timestamp><ishavefile>true</ishavefile><ishavevote>true</ishavevote><isitGongJi>false</isitGongJi></post>
          <post><id>22</id><title>22번글 제목</title><content>22번글 내용</content><author>22번 글쓴이</author><timestamp>2025-09-09 22:55:00</timestamp><ishavefile>true</ishavefile><ishavevote>false</ishavevote><isitGongJi>false</isitGongJi></post>
          <post><id>21</id><title>21번글 제목</title><content>21번글 내용</content><author>21번 글쓴이</author><timestamp>2025-09-09 21:40:00</timestamp><ishavefile>false</ishavefile><ishavevote>true</ishavevote><isitGongJi>false</isitGongJi></post>
          <post><id>20</id><title>20번 공지글 제목</title><content>20번글 내용</content><author>20번 글쓴이</author><timestamp>2025-09-09 20:25:00</timestamp><ishavefile>true</ishavefile><ishavevote>false</ishavevote><isitGongJi>true</isitGongJi></post>
          <post><id>19</id><title>19번글 제목</title><content>19번글 내용</content><author>19번 글쓴이</author><timestamp>2025-09-09 19:10:00</timestamp><ishavefile>false</ishavefile><ishavevote>true</ishavevote><isitGongJi>false</isitGongJi></post>
          <post><id>18</id><title>18번글 제목</title><content>18번글 내용</content><author>18번 글쓴이</author><timestamp>2025-09-09 17:55:00</timestamp><ishavefile>true</ishavefile><ishavevote>false</ishavevote><isitGongJi>false</isitGongJi></post>
          <post><id>17</id><title>17번글 제목</title><content>17번글 내용</content><author>17번 글쓴이</author><timestamp>2025-09-09 16:40:00</timestamp><ishavefile>false</ishavefile><ishavevote>false</ishavevote><isitGongJi>false</isitGongJi></post>
          <post><id>16</id><title>16번글 제목</title><content>16번글 내용</content><author>16번 글쓴이</author><timestamp>2025-09-09 15:25:00</timestamp><ishavefile>true</ishavefile><ishavevote>true</ishavevote><isitGongJi>false</isitGongJi></post>
        </posts>`;

        // 3페이지 (15~6번)
        const xmlString_3 = `<posts>
          <post><id>15</id><title>15번글 제목</title><content>15번글 내용</content><author>15번 글쓴이</author><timestamp>2025-09-09 14:10:00</timestamp><ishavefile>true</ishavefile><ishavevote>false</ishavevote><isitGongJi>false</isitGongJi></post>
          <post><id>14</id><title>14번글 제목</title><content>14번글 내용</content><author>14번 글쓴이</author><timestamp>2025-09-09 12:55:00</timestamp><ishavefile>false</ishavefile><ishavevote>true</ishavevote><isitGongJi>false</isitGongJi></post>
          <post><id>13</id><title>13번글 제목</title><content>13번글 내용</content><author>13번 글쓴이</author><timestamp>2025-09-09 11:40:00</timestamp><ishavefile>true</ishavefile><ishavevote>false</ishavevote><isitGongJi>false</isitGongJi></post>
          <post><id>12</id><title>12번글 제목</title><content>12번글 내용</content><author>12번 글쓴이</author><timestamp>2025-09-09 10:25:00</timestamp><ishavefile>false</ishavefile><ishavevote>true</ishavevote><isitGongJi>false</isitGongJi></post>
          <post><id>11</id><title>11번글 제목</title><content>11번글 내용</content><author>11번 글쓴이</author><timestamp>2025-09-09 09:10:00</timestamp><ishavefile>true</ishavefile><ishavevote>false</ishavevote><isitGongJi>false</isitGongJi></post>
          <post><id>10</id><title>10번 공지글 제목</title><content>10번글 내용</content><author>10번 글쓴이</author><timestamp>2025-09-08 23:05:00</timestamp><ishavefile>true</ishavefile><ishavevote>true</ishavevote><isitGongJi>true</isitGongJi></post>
          <post><id>9</id><title>9번글 제목</title><content>9번글 내용</content><author>9번 글쓴이</author><timestamp>2025-09-08 21:40:00</timestamp><ishavefile>false</ishavefile><ishavevote>false</ishavevote><isitGongJi>false</isitGongJi></post>
          <post><id>8</id><title>8번글 제목</title><content>8번글 내용</content><author>8번 글쓴이</author><timestamp>2025-09-08 20:25:00</timestamp><ishavefile>true</ishavefile><ishavevote>false</ishavevote><isitGongJi>false</isitGongJi></post>
          <post><id>7</id><title>7번글 제목</title><content>7번글 내용</content><author>7번 글쓴이</author><timestamp>2025-09-08 19:10:00</timestamp><ishavefile>false</ishavefile><ishavevote>false</ishavevote><isitGongJi>false</isitGongJi></post>
          <post><id>6</id><title>6번글 제목</title><content>6번글 내용</content><author>6번 글쓴이</author><timestamp>2025-09-08 17:50:00</timestamp><ishavefile>false</ishavefile><ishavevote>false</ishavevote><isitGongJi>false</isitGongJi></post>
        </posts>`;

        // 4페이지 (5~1번)
        const xmlString_4 = `<posts>
          <post><id>5</id><title>5번글 제목</title><content>5번글 내용</content><author>5번 글쓴이</author><timestamp>2025-09-08 16:45:00</timestamp><ishavefile>true</ishavefile><ishavevote>false</ishavevote><isitGongJi>false</isitGongJi></post>
          <post><id>4</id><title>4번글 제목</title><content>4번글 내용</content><author>4번 글쓴이</author><timestamp>2025-09-08 15:30:00</timestamp><ishavefile>false</ishavefile><ishavevote>false</ishavevote><isitGongJi>false</isitGongJi></post>
          <post><id>3</id><title>3번글 제목</title><content>3번글 내용</content><author>3번 글쓴이</author><timestamp>2025-09-08 14:15:00</timestamp><ishavefile>true</ishavefile><ishavevote>false</ishavevote><isitGongJi>false</isitGongJi></post>
          <post><id>2</id><title>2번글 제목</title><content>2번글 내용</content><author>2번 글쓴이</author><timestamp>2025-09-08 12:30:00</timestamp><ishavefile>false</ishavefile><ishavevote>false</ishavevote><isitGongJi>false</isitGongJi></post>
          <post><id>1</id><title>1번글 제목</title><content>1번글 내용</content><author>1번 글쓴이</author><timestamp>2025-09-08 11:00:00</timestamp><ishavefile>true</ishavefile><ishavevote>false</ishavevote><isitGongJi>false</isitGongJi></post>
        </posts>`;


        // 게시글 수정 == 작성 화면을 변수로 재활용
        let isEditMode = false;
        let editTargetId = null;
        let editOriginalIsNotice = false;
        let tempVoteData = null;    // 투표 데이터, 작성 완료 전
        let editOriginalHasVoting = false;  // 게시글 수정할 때, 그 글이 투표가 있나?


        // 2가지 타입 == 게시글 작성, 수정
        // state: 게시글 새로 작성
        const resetWriteForm = () => {
            const titleEl = document.getElementById("title");
            const contentEl = document.getElementById("content");
            const isNoticeEl = document.getElementById("is-notice");
            const isVoteEl = document.getElementById("is-vote");
            const fileEl = document.getElementById("file-upload");
            const submitBtn = document.querySelector(".GSPW_submit_button");
            const headTitle = document.getElementById("GSPW_head");

            if (titleEl) titleEl.value = "";
            if (contentEl) contentEl.value = "";
            if (isNoticeEl) isNoticeEl.checked = false;
            if (isVoteEl) isVoteEl.checked = false;
            if (fileEl) fileEl.value = ""; // 파일 선택 초기화

            editOriginalHasVoting = false;
            if (writePanel) writePanel.classList.remove("edit-mode");
            const voteBtn = document.querySelector(".GSPW_vote_button");
            if (voteBtn) voteBtn.textContent = "투표 추가";

            if (headTitle) headTitle.textContent = "게시글 작성";
            if (submitBtn) submitBtn.textContent = "작성완료"; // 버튼 텍스트 원상복구

            isEditMode = false;
            editTargetId = null;
            editOriginalIsNotice = false;
            tempVoteData = null;
        };

        // ======================================================================
        // state: 수정
        const fillEditForm = (post) => {
            const titleEl = document.getElementById("title");
            const contentEl = document.getElementById("content");
            const isNoticeEl = document.getElementById("is-notice");
            const isVoteEl = document.getElementById("is-vote");
            const submitBtn = document.querySelector(".GSPW_submit_button");
            const headTitle = document.getElementById("GSPW_head");

            // 기존 데이터 채워넣기
            if (titleEl) titleEl.value = post.title || "";
            if (contentEl) contentEl.value = post.content || "";
            if (isNoticeEl) isNoticeEl.checked = post.isNotice || false;
            if (isVoteEl) isVoteEl.checked = post.hasVote || false;

            editOriginalHasVoting = !!post.hasVote;
            if (writePanel) writePanel.classList.add("edit-mode");


            // 파일(input type=file)은 일단 뒤 로 미 루 기

            if (headTitle) headTitle.textContent = "게시글 수정";
            if (submitBtn) submitBtn.textContent = "수정완료";

            isEditMode = true;
            editTargetId = post.id;
            editOriginalIsNotice = post.isNotice || false; // [추가] 원래 상태 기억
        };


        // 글쓰기 버튼 로직
        const writeBtn = document.getElementById("GSP_write");
        const exitWriteBtn = document.getElementById("exit_write");
        const blurList = document.getElementById("GSP_blurScreen");
        const writePanel = document.querySelector(".GaeSiPan_Write");
        const onOpenWrite = () => {
            resetWriteForm(); // 폼 초기화
            writePanel?.classList.add("on");
            blurList?.classList.add("on");
        };
        const onCloseWrite = () => {
            writePanel?.classList.remove("on");
            blurList?.classList.remove("on");
        };
        writeBtn && writeBtn.addEventListener("click", onOpenWrite);
        exitWriteBtn && exitWriteBtn.addEventListener("click", onCloseWrite);


        const listContainer = document.getElementById("list_write");
        const pageContainer = document.getElementById("GSP_page");
        const seeContainer = document.querySelector(".GaeSiPan_See");
        const noticeCheckbox = document.getElementById("is-notice");
        const over10El = document.querySelector(".GongJi_over10");

        const searchInput = document.getElementById("GSP_search_box");
        const searchButton = document.getElementById("GSP_search_button");
        const searchTypeSelect = document.getElementById("GSP_search_type");

        // 공지 10개 체크 막는 거를 새로 체크하는 것만 막아야지, 이미 체크 되어있는 거 푸는 거까지 막으면 우짜노
        let isNoticeLimitReached = false;
        if (noticeCheckbox) {
            let prevChecked = noticeCheckbox.checked;  // 이전 상태 기억

            noticeCheckbox.addEventListener("change", () => {
                if (isNoticeLimitReached && !prevChecked && noticeCheckbox.checked) {
                    alert("공지글은 최대 10개까지 등록할 수 있습니다.");
                    noticeCheckbox.checked = false;
                }
                prevChecked = noticeCheckbox.checked;
            });
        }

        if (!listContainer || !pageContainer || !seeContainer) {
            return () => { };
        }

        // XML 파서 (Fallback 테스트용)
        const parser = new DOMParser();

        // 게시글 1개 DOM 생성 함수
        const buildPostItem = (post) => {
            const postDiv = document.createElement("div");
            postDiv.className = "post_item";
            // dataset.id는 항상 PK(서버 postPk)를 사용
            postDiv.dataset.id = post.id;

            const idSpan = document.createElement("span");
            idSpan.className = "post_id";
            postDiv.appendChild(idSpan);

            // 화면상 보이는 번호
            const displayNumber = (typeof post.postNumber !== "undefined" && post.postNumber !== null)
                ? post.postNumber
                : post.id;

            // 공지글이면 아이콘 표시, 아니면 번호 표시
            if (post.isNotice) {
                const img = document.createElement("img");
                img.src = GongJiIcon;
                img.alt = "공지";
                img.style.width = "25px";
                img.style.height = "auto";
                idSpan.style.display = "flex";
                idSpan.style.alignItems = "center";
                idSpan.style.justifyContent = "center";
                idSpan.textContent = "";
                idSpan.appendChild(img);
            } else {
                idSpan.textContent = displayNumber;
            }

            const titleSpan = document.createElement("span");
            titleSpan.className = "post_title";
            titleSpan.textContent = post.title;
            if (post.isNotice) titleSpan.classList.add("RED_title");
            postDiv.appendChild(titleSpan);

            const authorSpan = document.createElement("span");
            authorSpan.className = "post_author";
            authorSpan.textContent = post.author;
            postDiv.appendChild(authorSpan);

            const timestampSpan = document.createElement("span");
            timestampSpan.className = "post_timestamp";
            timestampSpan.textContent = (post.timestamp.split("T")[0]) || "";
            postDiv.appendChild(timestampSpan);

            const voteSpan = document.createElement("span");
            voteSpan.className = `post_ishaveVote ${post.hasVote ? "has-vote" : "no-vote"}`;
            voteSpan.textContent = post.hasVote ? "✅" : "-";
            voteSpan.setAttribute("aria-label", post.hasVote ? "투표 있음" : "투표 없음");
            postDiv.appendChild(voteSpan);

            const fileSpan = document.createElement("span");
            fileSpan.className = `post_ishavefile ${post.hasFile ? "has-file" : "no-file"}`;
            fileSpan.textContent = post.hasFile ? "📎" : "-";
            fileSpan.setAttribute("aria-label", post.hasFile ? "파일 첨부 있음" : "파일 첨부 없음");
            postDiv.appendChild(fileSpan);

            return postDiv;
        };

        const clearPostItems = () => {
            listContainer.querySelectorAll(".post_item").forEach((el) => el.remove());
        };

        // 데이터 그리기 함수 (전체 슬라이싱 X -> 받아온거 그대로 출력)
        const renderPosts = (postList) => {
            clearPostItems();
            postList.forEach((post) => {
                listContainer.appendChild(buildPostItem(post));
            });
        };

        // 페이지네이션 그리기 함수 (API에서 준 totalPages 사용)
        const renderPagination = (currentPage, totalPages) => {
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


        // ============================================================
        // GET : /api/posts == 게시글 리스트 요청
        const loadPostList = (page, searchOptions = currentSearch) => {
            // UI의 페이지는 1부터 시작, API는 0부터 시작
            const apiPage = page - 1;
            const token = localStorage.getItem("token");
            const projectPk = ProjectPK;

            // 쿼리 파라미터 구성
            const params = new URLSearchParams();
            params.set("projectPk", projectPk);
            params.set("page", apiPage);
            params.set("size", 10);

            // 검색 옵션이 있으면 keyword + searchType 추가
            if (searchOptions && searchOptions.keyword) {
                params.set("keyword", searchOptions.keyword);
                params.set("searchType", searchOptions.searchType || "TITLE");
            }
            console.log(`GET : /api/posts 요청 (Page: ${page}) / 쿼리 == ${params.toString()}`);

            fetch(`${baseURL}/api/posts?${params.toString()}`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            })
                .then(async (res) => {
                    console.log(`GET : /api/posts 응답 코드 == ${res.status}`);
                    if (res.status === 200) {
                        const data = await res.json();
                        console.log("GET : /api/posts 성공 코드 200 == ", data);

                        const uiPosts = data.content.map(p => ({
                            id: p.postPk,              // 실제 PK (API 호출용)
                            postNumber: p.postNumber,  // 화면상 보이는 번호
                            title: p.title,
                            content: p.content,
                            author: p.authorName,
                            timestamp: p.createdAt,
                            isNotice: p.isNotice,
                            hasVote: p.hasVoting,
                            hasFile: p.hasFile
                        }));

                        // 공지 10개 로직 그대로 유지
                        if (page === 1 && uiPosts.length === 10) {
                            const noticeCount = uiPosts.filter(p => p.isNotice).length;

                            if (noticeCount === 10) {
                                if (over10El) over10El.classList.add("on");
                                isNoticeLimitReached = true;
                            } else {
                                if (over10El) over10El.classList.remove("on");
                                isNoticeLimitReached = false;
                            }
                        } else {
                            if (over10El) over10El.classList.remove("on");
                            isNoticeLimitReached = false;
                        }

                        renderPosts(uiPosts);
                        renderPagination(page, data.totalPages || 1);
                    } else {
                        console.warn(`GET : /api/posts 실패 code:${res.status} -> Mock Data 사용`);
                        useMockData(page);
                    }
                })
                .catch(err => {
                    console.error("예외처리! GET : /api/posts == ", err);
                    useMockData(page);
                });
        };

        // Mock Data 사용 함수 (Fallback)
        const useMockData = (page) => {
            let targetXML = "";
            const MAX_MOCK_PAGES = 4; // Mock 데이터는 4페이지까지만 있음
            const safePage = Math.min(page, MAX_MOCK_PAGES);

            if (safePage === 1) targetXML = xmlString_1;
            else if (safePage === 2) targetXML = xmlString_2;
            else if (safePage === 3) targetXML = xmlString_3;
            else if (safePage === 4) targetXML = xmlString_4;

            if (!targetXML) {
                renderPosts([]); // 데이터 없음
                renderPagination(page, MAX_MOCK_PAGES);
                return;
            }

            const xmlDoc = parser.parseFromString(targetXML, "text/xml");
            const postsArray = Array.from(xmlDoc.getElementsByTagName("post"));

            // XML 데이터를 UI 형식으로 변환
            const uiPosts = postsArray.map(p => {
                const val = (tag) => p.getElementsByTagName(tag)[0]?.textContent || "";
                const idText = val("id");
                return {
                    id: idText,                 // 실제 PK 대용
                    postNumber: idText,         // 화면상 보이는 번호
                    title: val("title"),
                    content: val("content"),
                    author: val("author"),
                    timestamp: val("timestamp").replace(" ", "T"),
                    isNotice: val("isitGongJi").toLowerCase() === "true",
                    hasVote: val("ishavevote").toLowerCase() === "true",
                    hasFile: val("ishavefile").toLowerCase() === "true"
                };
            });

            renderPosts(uiPosts);
            renderPagination(page, MAX_MOCK_PAGES);
        };

        // 검색 버튼 클릭 시
        let currentSearch = { keyword: "", searchType: "" };
        const onSearchClick = () => {
            if (!searchInput) return;

            const keyword = searchInput.value.trim();
            const searchType = searchTypeSelect ? searchTypeSelect.value : "TITLE";
            currentPage = 1;

            // 검색어가 없으면 전체 게시글 목록 요청
            if (!keyword) {
                currentSearch = { keyword: "", searchType: "" };
                loadPostList(1, currentSearch);
                return;
            }
            // 검색 상태 저장
            currentSearch = { keyword, searchType };
            loadPostList(1, currentSearch);
        };
        searchButton && searchButton.addEventListener("click", onSearchClick);


        // 페이지 클릭 이벤트
        let currentPage = 1;
        const onPageClick = (e) => {
            const target = e.target.closest(".GSP_page_mode");
            if (!target || target.classList.contains("disabled")) return;
            const toPage = parseInt(target.dataset.page, 10);

            if (!Number.isFinite(toPage) || toPage === currentPage) return;

            currentPage = toPage;
            loadPostList(currentPage, currentSearch);  // 페이지 리프레쉬
        };
        pageContainer.addEventListener("click", onPageClick);

        // 초기 로딩 (1페이지)
        loadPostList(1, currentSearch);


        // ============================================================
        // (임시) 다운로드 박스 개체
        const DOWNLOAD_HTML = `
      <div class="GSPS_download_field">
        <label id="GSPS_download_title">첨부파일 목록</label>
        <div class="GSPS_download_mode">첨부파일 1</div>
        <div class="GSPS_download_mode">첨부파일 2</div>
      </div>
    `;

        const escapeHTML = (s) =>
            String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));


        // ============================================================
        // 투표 화면 생성
        const buildVoteHTML = (voteData) => {
            if (!voteData) return "";

            const { title, options } = voteData;
            // API 응답에 없는 필드는 false 처리
            const allowMultipleChoices = voteData.allowMultipleChoices || false;
            const isAnonymous = voteData.isAnonymous || false;

            // 선택지 목록 (Voting View)
            const optionsHTML = options.map((opt) => {
                const inputType = allowMultipleChoices ? "checkbox" : "radio";
                return `
                  <div class="VOTE_item">
                    <input type="${inputType}" name="VOTE_item_check" value="${opt.id}">
                    <span>${escapeHTML(opt.content)}</span>
                  </div>
                `;
            }).join("");

            // 투표 결과 화면 (재투표하기 버튼 있는 거)
            const resultsHTML = options.map((opt) => {
                const count = opt.count || 0;
                const whoList = opt.voters || [];   // 반환값에 맞게 이름 수정
                const whoHTML = whoList
                    .map(name => `<div>${escapeHTML(name)}</div>`)
                    .join("");

                return `
                    <div class="VoteResult_item">
                        <span>${escapeHTML(opt.content)}</span>
                        <div class="VoteResult_item_PeopleNumber">${count}명</div>
                        <div class="VoteResult_item_WhoVoted">
                            ${whoHTML}
                        </div>
                    </div>
                `;
            }).join("");

            const multiText = allowMultipleChoices ? "중복 선택 허용" : "단일 선택";
            const anonymousText = isAnonymous ? "익명 투표" : "익명 아님";

            return `
              <div class="VOTE_container" data-vote-id="${voteData.id}">
                <div class="VOTE_Page">
                  <h1 id="VOTE_title">${escapeHTML(title)}</h1>
                  <h2 id="VOTE_isitMulti">${multiText}</h2>
                  <h2 id="VOTE_isitSecret">${anonymousText}</h2>

                  <div class="VOTE_choose_container">
                    ${optionsHTML}
                  </div>
                  <button class="VOTE_complete_button"><b>투표완료</b></button>
                </div>

                <div class="VOTE_Result">
                  <h1 id="VoteResult_title">${escapeHTML(title)} 결과</h1>
                  <div class = "VoteResult_grid">
                    ${resultsHTML}
                    </div>
                  <button class="VoteResult_revote_button">재투표하기</button>
                </div>
              </div>
            `;
        };


        // 게시글 상세보기 GET 실패 시, Mock Data 전체에서 게시글 검색
        const getPostDataById = (idStr) => {
            const fullXml = xmlString_1 + xmlString_2 + xmlString_3 + xmlString_4;
            const fullDoc = parser.parseFromString(`<posts>${fullXml}</posts>`, "text/xml");
            const allPosts = Array.from(fullDoc.getElementsByTagName("post"));

            const el = allPosts.find(
                (p) => (p.getElementsByTagName("id")[0]?.textContent || "").trim() === idStr
            );

            if (!el) {
                alert("해당 게시글을 찾을 수 없습니다. (Mock Data)");
                return null;
            }

            const t = (tag) => (el.getElementsByTagName(tag)[0]?.textContent || "").trim();
            return {
                id: t("id"),
                title: t("title"),
                content: t("content"),
                author: t("author"),
                timestamp: t("timestamp").replace(" ", "T"), // 포맷 통일
                hasFile: t("ishavefile").toLowerCase() === "true",
                hasVote: t("ishavevote").toLowerCase() === "true",
                isNotice: t("isitGongJi").toLowerCase() === "true"
            };
        };


        // seeContainer == div class = .GaeSiPan_See
        const class_GaeSiPan_list = seeContainer.querySelector('.GaeSiPan_list');

        // 날짜 포맷 표기 변경
        const formatDateTime = (ts) => {
            if (!ts) return "";
            try {
                const d = new Date(ts);
                if (isNaN(d.getTime())) return ts;

                const yyyy = d.getFullYear();
                const MM = String(d.getMonth() + 1).padStart(2, "0");
                const dd = String(d.getDate()).padStart(2, "0");
                const hh = String(d.getHours()).padStart(2, "0");
                const mm = String(d.getMinutes()).padStart(2, "0");

                return `${yyyy}.${MM}.${dd} / ${hh}:${mm}`;
            } catch (e) {
                return ts;
            }
        };

        const renderSee = (post) => {
            seeContainer.classList.add("on");
            if (!post) return;
            const fileHTML = post.hasFile ? DOWNLOAD_HTML : "";
            const voteHTML = post.hasVote && post.vote ? buildVoteHTML(post.vote) : "";


            seeContainer.innerHTML = `
        <div class="GSPS_field">
            <button id="exit_See">뒤로가기</button>
            <button id="edit_See">수정</button>
            <button id="delete_See">삭제</button>
        </div>

        <div class="GSPS_title_field">
          <div id="GSPS_title">${escapeHTML(post.title)}</div>
          <div id="GSPS_when">${formatDateTime(post.timestamp)}</div>
        </div>

        <div class="GSPS_field">
          ${voteHTML}
          ${fileHTML}
        </div>

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
                seeContainer.classList.remove("on");
            });


            // =====================================================================
            // 수정완료 버튼 (기존 작성완료 버튼)
            const editBtn = seeContainer.querySelector("#edit_See");
            const deleteBtn = seeContainer.querySelector("#delete_See");

            // isAuthor == 니가 이 글 썻냐? (수정, 삭제 권한)
            if (post.isAuthor === false) {
                if (editBtn) editBtn.classList.add("off");
                if (deleteBtn) deleteBtn.classList.add("off");
            } else {
                if (editBtn) editBtn.classList.remove("off");
                if (deleteBtn) deleteBtn.classList.remove("off");
            }

            editBtn && editBtn.addEventListener("click", () => {
                console.log("게시글 edit 수정");
                fillEditForm(post); // input들 채우기
                writePanel?.classList.add("on");
                blurList?.classList.add("on");
                seeContainer.classList.remove("on");
            });


            // =====================================================================
            // DELETE : /api/posts/{posstId} == 게시글 삭제

            deleteBtn && deleteBtn.addEventListener("click", () => {

                // 삭제요청 2차 확인
                if (!confirm("정말 이 게시글을 삭제하시겠습니까?")) {
                    return;
                }
                const token = localStorage.getItem("token");
                const targetId = post.id;
                fetch(`${baseURL}/api/posts/${targetId}`, {
                    method: "DELETE",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                    },
                })
                    .then(async (res) => {
                        console.log(`DELETE : /api/posts/{posstId} return 코드 == ${res.status}`);

                        if (res.status === 200) {
                            try {
                                const data = await res.json();
                                console.log("DELETE : /api/posts/{posstId} 성공 return 내용 == ", data);
                            } catch (e) {
                                // JSON이 아니라 텍스트나 빈 값일 경우
                                const text = await res.text();
                                console.log("DELETE : /api/posts/{posstId} 성공 return 내용 == ", text);
                            }
                            alert("게시글이 삭제되었습니다.");

                            seeContainer.innerHTML = "";
                            seeContainer.classList.remove("on");

                            // 게시글 리스트 목록 새로고침
                            if (typeof loadPostList === "function") {
                                console.log("게시글 삭제 완, 리스트 리프레쉬 GET");
                                loadPostList(currentPage);
                            }
                        } else {
                            const errorText = await res.text();
                            console.log(`DELETE : /api/posts/{posstId} 실패 == ${res.status} / 내용 == `, errorText);
                            alert("삭제에 실패했습니다.");
                        }
                    })
                    .catch((err) => {
                        console.log("예외처리 발생! DELETE : /api/posts/{posstId} return 내용 ==", err);
                        alert("오류가 발생했습니다.");
                    });
            });


            // =====================================================================
            // 투표 관련 로직들 싹 다
            const VOTE_PAGE_class = seeContainer.querySelector(".VOTE_Page");
            const resultPanel = seeContainer.querySelector(".VOTE_Result");
            const completeBtn = seeContainer.querySelector(".VOTE_complete_button");
            const revoteBtn = seeContainer.querySelector(".VoteResult_revote_button");

            // 투표 후, 게시글 1개 상세조회 리프레쉬
            const refreshPostDetail = () => {
                const token = localStorage.getItem("token");
                fetch(`${baseURL}/api/posts/${post.id}`, {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                })
                    .then(async (res) => {
                        if (res.status === 200) {
                            const data = await res.json();
                            console.log("투표 후 GET : /api/posts/{postId} return 200 == ", data);

                            const mappedPost = {
                                id: data.postPk,
                                title: data.title,
                                content: data.content,
                                author: data.authorName,
                                timestamp: data.createdAt,
                                hasFile: data.hasFile,
                                hasVote: data.hasVoting,
                                vote: data.vote,
                                attachmentIds: data.attachmentIds,
                                isNotice: data.isNotice,
                                isAuthor: data.isAuthor     // 니가 이 글 씀?
                            };

                            renderSee(mappedPost);
                        } else {
                            const errorBody = await res.text();
                            console.log(`투표 후 GET : /api/posts/{postId} 실패 == ${res.status} / Raw Body == `, errorBody);
                        }
                    })
                    .catch((err) => {
                        console.error("투표 후 GET : /api/posts/{postId} 예외처리 == ", err);
                    });
            };

            // 백엔드 응답의 hasVoted 여부로 판단
            const alreadyVoted = !!(post.vote && post.vote.hasVoted);
            let isReVote = alreadyVoted;

            // 상세보기 들어갈 떄, 투표 관련 처리
            if (alreadyVoted) {
                resultPanel && resultPanel.classList.add("on");
                VOTE_PAGE_class && VOTE_PAGE_class.classList.add("off");
            } else {
                resultPanel && resultPanel.classList.remove("on");
                VOTE_PAGE_class && VOTE_PAGE_class.classList.remove("off");
            }

            // 투표 중복, 익명 여부
            const allowMulti = !!(post.vote && post.vote.allowMultipleChoices);
            const isAnonymous = !!(post.vote && post.vote.isAnonymous);


            // POST : /api/votes/options/{optionId}/cast == 투표
            // PUT : /api/votes/options/{optionId}/cast == 재투표
            if (completeBtn) {
                completeBtn.addEventListener("click", () => {
                    const checkedInputs = Array.from(
                        seeContainer.querySelectorAll('input[name="VOTE_item_check"]:checked')
                    );

                    if (checkedInputs.length === 0) {
                        alert("투표 항목을 하나 이상 선택해주세요.");
                        return;
                    }

                    // 단일 or 복수 선택에 따른optionId
                    const selectedOptionIds = checkedInputs.map((input) => input.value);
                    const token = localStorage.getItem("token");

                    // 첫투표 or 재투표냐에 따라, POST or PUT 분리
                    const method = (isReVote ? "PUT" : "POST");
                    console.log(`현재 투표 요청: method == ${method} , isReVote == ${isReVote}`);

                    const castOne = (optionId) => {
                        const requestUrl = `${baseURL}/api/votes/options/${optionId}/cast`;
                        return fetch(requestUrl, {
                            method,
                            headers: {
                                "Authorization": `Bearer ${token}`,
                            },
                        }).then(async (res) => {
                            const resultText = await res.text();
                            console.log(
                                `${method} : /api/votes/options/${optionId}/cast 응답 == ${res.status}`,
                                resultText
                            );
                            if (res.status !== 200 && res.status !== 201) {
                                throw new Error(
                                    `옵션 ${optionId} 투표 실패 (${res.status}): ${resultText}`
                                );
                            }
                        });
                    };

                    // 복수 선택이면 여러 개, 아니면 첫 번째만
                    const targetIds = allowMulti
                        ? selectedOptionIds
                        : [selectedOptionIds[0]];

                    Promise.all(targetIds.map(castOne))
                        .then(() => {
                            alert(isReVote ? "재투표가 완료되었습니다." : "투표가 완료되었습니다.");
                            isReVote = true;
                            // 투표 후 상세 다시 GET
                            refreshPostDetail();
                        })
                        .catch((err) => {
                            console.error("예외처리! PUT : /api/votes/options == ", err);
                            alert(`투표 중 오류가 발생했습니다.\n${err.message}`);
                        });
                });
            }


            // PUT : /api/votes/options == 재투표하기
            if (revoteBtn) {
                revoteBtn.addEventListener("click", () => {
                    // 단순히 화면만 전환, API 호출 X
                    resultPanel && resultPanel.classList.remove("on");
                    VOTE_PAGE_class && VOTE_PAGE_class.classList.remove("off");

                    // 상태는 이미 isReVote = true 상태임
                    console.log("재투표 화면으로 전환, API 호출 X");
                });
            }

            // 누가 투표했는지 보기 (익명 투표가 아닐 때만 활성화)
            if (!isAnonymous) {
                const numBtns = seeContainer.querySelectorAll(".VoteResult_item_PeopleNumber");
                numBtns.forEach((btn) => {
                    btn.addEventListener("click", (e) => {
                        const item = e.target.closest(".VoteResult_item");
                        if (!item) return;
                        const whoPanel = item.querySelector(".VoteResult_item_WhoVoted");
                        if (whoPanel) whoPanel.classList.toggle("on");
                    });
                });
            } else {
                // 익명 투표
                const numBtns = seeContainer.querySelectorAll(".VoteResult_item_PeopleNumber");
                numBtns.forEach((btn) => {
                    btn.style.cursor = "default";   // 커서 비활 처리
                });
            }

            seeContainer.scrollIntoView({ behavior: "smooth", block: "start" });
        };


        // ==============================================================================================
        // 게시판 리스트에서 게시글 1개 클릭
        // GET : /api/posts/{postId} == 게시글 상세 조회, 상세보기
        const onListClick = (e) => {
            const item = e.target.closest(".post_item");
            if (!item) return;

            // const idEl = item.querySelector(".post_id");
            // const clickedId = idEl?.textContent?.trim();
            const clickedId = item.dataset.id;

            if (!clickedId) return;
            const token = localStorage.getItem("token");

            fetch(`${baseURL}/api/posts/${clickedId}`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            })
                .then(async (res) => {
                    if (res.status === 200) {
                        const data = await res.json();
                        console.log("GET : /api/posts/{postId} return 200 == ", data);

                        // 서버 데이터 -> UI 포맷 매핑
                        const mappedPost = {
                            id: data.postPk,
                            title: data.title,
                            content: data.content,
                            author: data.authorName,
                            timestamp: data.createdAt,
                            hasFile: data.hasFile,
                            hasVote: data.hasVoting,
                            vote: data.vote,
                            attachmentIds: data.attachmentIds,
                            isNotice: data.isNotice,
                            isAuthor: data.isAuthor     // 니가 이 글 씀?
                        };

                        renderSee(mappedPost);
                    }
                    else {
                        const errorBody = await res.text();
                        console.log(`GET : /api/posts/{postId} 실패 == ${res.status} / Raw Body == `, errorBody);
                        const localPost = getPostDataById(clickedId);
                        if (localPost) renderSee(localPost);
                    }
                })
                .catch((err) => {
                    // 아예 통신 자체 실패한 경우
                    console.error("GET : /api/posts/{postId} 예외처리: API 요청 실패 == ", err);
                    const localPost = getPostDataById(clickedId);
                    if (localPost) renderSee(localPost);
                });
        };
        listContainer.addEventListener("click", onListClick);



        // ==============================================================================================
        // 게시글 작성완료 버튼 로직
        const onSubmitWrite = () => {
            const titleEl = document.getElementById("title");
            const isNoticeEl = document.getElementById("is-notice");
            const fileEl = document.getElementById("file-upload");
            const contentEl = document.getElementById("content");
            const isVoteEl = document.getElementById("is-vote");

            const title = titleEl && titleEl.value;
            const isNotice = isNoticeEl && isNoticeEl.checked;
            const files = (fileEl && fileEl.files) || null;
            const content = contentEl && contentEl.value;
            const hasVoting = isVoteEl && isVoteEl.checked;

            // 공지 개수 10개 over인 경우,
            if (
                isNoticeLimitReached &&
                isNotice &&
                (
                    !isEditMode ||
                    (isEditMode && !editOriginalIsNotice)
                )
            ) {
                alert("공지글은 최대 10개까지 등록할 수 있습니다.");
                return;
            }

            if (!title || !content) {
                alert("제목과 본문을 모두 입력해주세요.");
                return;
            }

            // 게시글 수정일 땐, 안 뜸
            if (!isEditMode && hasVoting && !tempVoteData) {
                alert("투표 추가를 선택하셨으면 투표 내용을 설정해주세요.");
                return;
            }


            // =====================================================================
            // PUT : /api/posts/{postId} == 게시글 수정
            if (typeof isEditMode !== 'undefined' && isEditMode && editTargetId) {
                const token = localStorage.getItem("token");
                const putPayload = {
                    title: title,
                    content: content,
                    isNotice: isNotice,
                };
                const formData = new FormData();
                formData.append(
                    "post",
                    new Blob([JSON.stringify(putPayload)], { type: "application/json" })
                );

                if (files && files.length > 0) {
                    Array.from(files).forEach((file) => {
                        formData.append("files", file);
                    });
                }

                if (files && files.length > 0) {
                    Array.from(files).forEach((file) => {
                        formData.append("files", file);
                    });
                }
                console.log(`PUT : /api/posts/{postId} FormData == ${formData}`);

                fetch(`${baseURL}/api/posts/${editTargetId}`, {
                    method: "PUT",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                    },
                    body: formData,
                })
                    .then(async (res) => {
                        console.log(`PUT : /api/posts/{postId} return 코드 ==  ${res.status}`);

                        if (res.status === 200) {
                            const data = await res.json();
                            console.log("200 code return 내용 : ", data);

                            // PATCH : /api/posts/{postId}/notice/cancel == 공지사항 해제
                            if (editOriginalIsNotice && !isNotice) {
                                fetch(`${baseURL}/api/posts/${editTargetId}/notice/cancel`, {
                                    method: "PATCH",
                                    headers: { "Authorization": `Bearer ${token}` },
                                })
                                    .then(async (cancelRes) => {
                                        console.log(`PATCH (Cancel) 응답 코드 == ${cancelRes.status}`);
                                        if (cancelRes.status === 200) {
                                            alert("게시글 수정 및 공지사항 해제가 완료되었습니다.");
                                        } else {
                                            alert("게시글은 수정되었는데, 공지사항 해제에 실패");
                                        }
                                        onCloseWrite();
                                        loadPostList(currentPage);
                                    })
                                    .catch(err => {
                                        console.error("예외처리! PATCH Cancel == ", err);
                                        onCloseWrite();
                                        loadPostList(currentPage);
                                    });
                            }

                            // PATCH : /api/posts/{postId}/notice == 공지사항 등록
                            else if (!editOriginalIsNotice && isNotice) {
                                console.log("공지사항 등록 요청 시작");
                                fetch(`${baseURL}/api/posts/${editTargetId}/notice`, {
                                    method: "PATCH",
                                    headers: { "Authorization": `Bearer ${token}` },
                                })
                                    .then(async (noticeRes) => {
                                        console.log(`PATCH (Notice) 응답 코드 == ${noticeRes.status}`);
                                        if (noticeRes.status === 200) {
                                            alert("게시글 수정 및 공지사항 등록이 완료되었습니다.");
                                        } else {
                                            alert("게시글은 수정되었는데, 공지사항 등록에 실패했습니다.");
                                        }
                                        onCloseWrite();
                                        loadPostList(currentPage);
                                    })
                                    .catch(err => {
                                        console.error("예외처리! PATCH Notice == ", err);
                                        onCloseWrite();
                                        loadPostList(currentPage);
                                    });
                            } else {
                                alert("게시글이 수정되었습니다.");
                                onCloseWrite();
                                loadPostList(currentPage);
                            }
                        } else {
                            const errorText = await res.text();
                            console.log(`PUT 실패 == `, errorText);
                            alert(`수정 실패: ${errorText}`);
                        }
                    })
                    .catch((err) => {
                        console.log("예외처리 발생! PUT", err);
                    });
                return;
            }


            // ========================================================================
            // POST : /api/posts == 게시글 작성
            const postPayload = {
                projectPk: ProjectPK,
                title: title,
                content: content,
                isNotice: isNotice,
                hasVoting: !!hasVoting,

                ...(hasVoting && tempVoteData
                    ? {
                        voteTitle: tempVoteData.title,
                        voteOptions: tempVoteData.optionContents,
                        // 필요하면 나중에 사용
                        // voteEndTime: tempVoteData.endTime,
                        allowMultipleChoices: !!tempVoteData.allowMultipleChoices,
                        isAnonymous: !!tempVoteData.isAnonymous,
                    }
                    : {}),
            };
            const formData = new FormData();
            formData.append(
                "post",
                new Blob([JSON.stringify(postPayload)], { type: "application/json" })
            );

            if (files && files.length > 0) {
                Array.from(files).forEach((file) => {
                    formData.append("files", file);
                });
            }
            const token = localStorage.getItem("token");
            console.log("지금 니 JWT 토큰 == ", token);
            console.log("POST : /api/posts 보내는 JSON 내용 == ", postPayload);     // 게시글 내용 console log
            console.log("POST : /api/posts 실제 FormData 내용 ↓↓↓");                // 첨부파일 내용 console log

            for (const [key, value] of formData.entries()) {
                if (value instanceof File) {
                    console.log(` -> ${key} = File(name=${value.name}, size=${value.size} bytes)`);
                } else {
                    console.log(` -> ${key} = ${value}`);
                }
            }


            const createPostUrl = `${baseURL}/api/posts`;
            fetch(createPostUrl, {
                method: "POST",
                headers: { "Authorization": `Bearer ${token}` },
                body: formData,
            })
                .then(async (res) => {
                    console.log(`POST : /api/posts 응답 코드 == ${res.status}`);

                    if ((res.status !== 200) && (res.status != 201)) {
                        const errorText = await res.text();
                        console.error("POST : /api/posts 실패 반환값 == ", errorText);
                        alert(`게시글 생성 실패 (${res.status}):\n${errorText}`);
                        return; // 더 이상 진행하지 않음
                    }

                    // return 200 이면, 계속 진행
                    const data = await res.json();
                    console.log("POST : /api/posts return 201 응답 == ", data);

                    if (data && data.postPk) {
                        const newPostId = data.postPk;

                        // PATCH : /api/posts/{postId}/notice == 공지사항 등록 (필요 시)
                        const afterCreate = () => {
                            alert("게시글 작성이 완료되었습니다.");
                            onCloseWrite();
                            loadPostList(currentPage);
                        };

                        if (isNotice) {
                            fetch(`${baseURL}/api/posts/${newPostId}/notice`, {
                                method: "PATCH",
                                headers: { "Authorization": `Bearer ${token}` },
                            })
                                .then(async (noticeRes) => {
                                    const resultText = await noticeRes.text();
                                    console.log(`PATCH : /api/posts/${newPostId}/notice 응답 == (${noticeRes.status}):`, resultText);

                                    if (noticeRes.status !== 200) {
                                        console.error("공지 설정 실패", noticeRes.status);
                                        alert("게시글은 작성되었지만 공지 설정에 실패했습니다.");
                                    }
                                    afterCreate();
                                })
                                .catch((err) => {
                                    console.error("예외처리! PATCH : /api/posts/{postId}/notice == ", err);
                                    alert("게시글은 작성되었지만 공지 설정 중 오류가 발생했습니다.");
                                    afterCreate();
                                });
                        } else {
                            afterCreate();
                        }

                    } else {
                        console.error("게시글 생성 로직 오류 (postPk 없음):", data);
                        alert("게시글 생성에 실패했습니다.");
                    }
                })
                .catch((err) => {
                    console.error("게시글 작성 중 네트워크/코드 에러:", err);
                });
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


        // ============================================================
        // 투표 생성 버튼 로직 (수정됨: 서버 전송 X --> 변수에 저장 O)
        const makeVoteBtn = document.getElementById("VoteMake_button");
        const onMakeVote = () => {
            const titleEl = document.getElementById("VoteMake_Title");
            const dayEl = document.getElementById("VoteMake_Deadline_Day");
            const timeEl = document.getElementById("VoteMake_Deadline_Time");
            const optionContainer = document.getElementById("VoteMake_OptionContainer_all");
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

            // 날짜 포맷 (필요시 'Z' 제거 등 조정)
            const endTimeISO = `${value_VoteMake_Deadline_Day}T${value_VoteMake_Deadline_Time}:00`;

            // [수정] 투표 데이터 객체 생성 (postId는 null)
            const voteData = {
                postId: null,
                title: value_VoteMake_Title,
                endTime: endTimeISO,
                allowMultipleChoices: value_VoteMake_isitMulti,
                isAnonymous: value_VoteMake_isitAnonymous,
                optionContents: value_VoteMake_Options,
            };

            // [수정] 전역 변수에 저장
            tempVoteData = voteData;
            console.log("투표 데이터 임시 저장 완", tempVoteData);
            alert("투표 내용이 설정되었습니다.\n(게시글 작성 완료 시 함께 생성됩니다)");

            const voteBtn = document.querySelector(".GSPW_vote_button");
            if (voteBtn) {
                voteBtn.textContent = "투표 수정";
            }

            // 모달 닫기
            const writeBlur = document.getElementById("GSPW_blurScreen");
            const voteMakePanel = document.querySelector(".VOTE_Make");
            writeBlur?.classList.remove("on");
            voteMakePanel?.classList.remove("on");

            // "투표 추가" 체크박스 자동 체크
            const isVoteEl = document.getElementById("is-vote");
            if (isVoteEl) isVoteEl.checked = true;
        };
        makeVoteBtn && makeVoteBtn.addEventListener("click", onMakeVote);


        return () => {
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
                <div class="container_GaeSiPanList">
                    <h1 id="GaeSiPan_list_title"><b>게시판</b></h1>
                    <button id="GSP_write">게시글 작성</button>
                </div>
                <div class="container_GaeSiPanList">
                    <div id="list_write">
                        <div className="post_header">
                            <span className="post_id">번호</span>
                            <span className="post_title">제목</span>
                            <span className="post_author">작성자</span>
                            <span className="post_timestamp">작성일자</span>
                            <span className="post_ishaveVote">투표</span>
                            <span className="post_ishavefile">파일</span>
                        </div>
                    </div>
                </div>
                <div class="container_GaeSiPanList">
                    <div id="GSP_page"></div>

                    {/* 검색 = 제목 or 작성자로 검색 */}
                    <div className="GSP_search_container">
                        <select id="GSP_search_type" className="GSP_search_select">
                            <option value="TITLE">제목</option>
                            <option value="AUTHOR">작성자</option>
                        </select>
                        <input
                            id="GSP_search_box"
                            type="text"
                            placeholder="검색어를 입력하세요"
                        />
                        <button id="GSP_search_button" type="button">
                            검색
                        </button>
                    </div>
                </div>

                <div id="GSP_blurScreen"></div>
            </div>

            {/* 3번: 게시글 작성 기능 */}
            <div className="GaeSiPan_Write">
                <button id="exit_write"><p>뒤로가기</p></button>
                <h1 id="GSPW_head">게시글 작성</h1>

                <div className="GSPW_field">
                    <label htmlFor="title" className="form_label">제목</label>
                    <input type="text" id="title" placeholder="제목을 입력하세요" className="form_input" />
                </div>


                <div className="GSPW_field_left">
                    {/* 체크박스 == 공지사항 */}
                    <div className="checkbox_container">
                        <input type="checkbox" id="is-notice" />
                        <label htmlFor="is-notice" className="checkbox_label">공지사항 유무</label>
                    </div>
                    <div className="GongJi_over10">공지글 개수는 최대 10개 입니다.</div>


                    {/* 체크박스 == 투표추가 */}
                    <div className="checkbox_container">
                        <input type="checkbox" id="is-vote" />
                        <label htmlFor="is-vote" className="checkbox_label">투표 추가</label>
                    </div>
                    <button className="GSPW_vote_button">투표 추가</button>

                    {/* 버튼 == 첨부파일 */}
                    <label htmlFor="file-upload" className="form_label">첨부파일</label>
                    <input type="file" id="file-upload" multiple className="form_file_input" />
                </div>


                <div className="GSPW_field_left_2">
                    <label htmlFor="content" className="form_label">본문</label>
                </div>
                <div className="GSPW_field">
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

            {/* 6번: 게시글 보기 (리액트 js로 채움) == onListClick */}
            <div className="GaeSiPan_See" />
        </>
    );
}