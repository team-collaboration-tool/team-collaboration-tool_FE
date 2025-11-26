import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import "./Setting.css";
import { ConfirmWithInputModal } from "../modal_component/modal.jsx";

import UserProfile from "../../asset/user_icon/user_icon_black.svg";
import Phone from "../../asset/user_icon/phone_call_icon.svg";
import Mail from "../../asset/user_icon/mail_icon.svg";
import Lock from "../../asset/user_icon/key_icon_black.svg";
import Work from "../../asset/user_icon/work_icon.svg";

const API_URL = import.meta.env.VITE_API_URL;

const Setting = () => {
  const navigate = useNavigate();

  // 전체 프로필 정보
  const [userInfo, setUserInfo] = useState({
    name: "",
    phone: "",
    email: "",
    major: "",
  });

  // 전체 편집 모드
  const [isEditing, setIsEditing] = useState(false);

  // 회원 탈퇴 모달 상태
  const [openWithdrawModal, setOpenWithdrawModal] = useState(false);

  // 비밀번호 폼
  const [passwordForm, setPasswordForm] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  // 사용자 정보 불러오기
  const fetchUserInfo = async () => {
    const response = await fetch(`${API_URL}/api/user/me`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    if (response.ok) {
      const data = await response.json();
      setUserInfo({
        name: data.name,
        phone: data.phone,
        email: data.email,
        major: data.field,
      });
    }
  };

  // 컴포넌트 마운트 시 사용자 정보 불러오기
  React.useEffect(() => {
    fetchUserInfo();
  }, []);

  // 편집 모드 시작
  const handleStartEdit = () => {
    setIsEditing(true);
  };

  // 편집 취소
  const handleCancelEdit = () => {
    setIsEditing(false);
    setPasswordForm({ current: "", new: "", confirm: "" });
    fetchUserInfo(); // 원래 정보로 되돌림
  };

  // 프로필 필드 값 변경
  const handleUserInfoChange = (field, value) => {
    setUserInfo({ ...userInfo, [field]: value });
  };

  // 프로필 전체 정보 저장
  const handleSaveProfile = async () => {
    try {
      // 프로필 정보 업데이트
      const profileResponse = await fetch(`${API_URL}/api/user/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          name: userInfo.name,
          phone: userInfo.phone,
          field: userInfo.major,
        }),
      });

      if (!profileResponse.ok) {
        const errorData = await profileResponse.json();
        alert(errorData.message || "정보 저장에 실패했습니다.");
        return;
      }

      // 비밀번호 3개 필드가 모두 입력된 경우에만 비밀번호 변경 요청
      if (passwordForm.current && passwordForm.new && passwordForm.confirm) {
        if (passwordForm.new !== passwordForm.confirm) {
          alert("새 비밀번호가 일치하지 않습니다.");
          return;
        }

        const passwordResponse = await fetch(`${API_URL}/api/user/update/password`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            currentPassword: passwordForm.current,
            newPassword: passwordForm.new,
          }),
        });

        if (!passwordResponse.ok) {
          const errorData = await passwordResponse.json();
          alert(errorData.message || "비밀번호 변경에 실패했습니다.");
          return;
        }
      } else {
        alert("정보가 저장되었습니다.");
      }

      setIsEditing(false);
      setPasswordForm({ current: "", new: "", confirm: "" });
      fetchUserInfo();
    } catch (error) {
      console.error(error);
      alert("정보 저장 중 오류가 발생했습니다.");
    }
  };

  // 비밀번호 입력값 변경
  const handlePasswordInputChange = (field, value) => {
    setPasswordForm({ ...passwordForm, [field]: value });
  };

  // 회원 탈퇴
  const handleDeleteAccount = () => {
    setOpenWithdrawModal(true);
  };

  // 회원 탈퇴 실행
  const proceedToDeleteAccount = async (password) => {
    try {
      // 비밀번호 확인
      const checkResponse = await fetch(`${API_URL}/api/user/checkpassword`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ password }),
      });

      if (!checkResponse.ok) {
        alert("비밀번호가 일치하지 않습니다.");
        return;
      }

      // 회원 탈퇴 진행
      const deleteResponse = await fetch(`${API_URL}/api/user/delete`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (deleteResponse.ok) {
        alert("회원탈퇴가 완료되었습니다.");
        localStorage.removeItem("token");
        setOpenWithdrawModal(false);
        navigate("/");
      } else {
        alert("회원탈퇴에 실패했습니다.");
      }
    } catch (error) {
      console.error(error);
      alert("회원탈퇴 중 오류가 발생했습니다.");
    }
  };

  const getInitial = () => {
    return userInfo.name.charAt(0);
  };

  return (
    <div className="setting-container">
      <div className="setting-content">
        <div className="profile-box">
          {/* 프로필 */}
          <div className="profile-avatar">{getInitial()}</div>

          <div className="profile-columns">
            <div className="profile-column">
              <div className="profile-field">
                <label>
                  <img src={UserProfile} alt="사용자" className="field-icon" />
                  이름
                </label>
                <input
                  type="text"
                  value={userInfo.name}
                  onChange={(e) =>
                    handleUserInfoChange("name", e.target.value)
                  }
                  disabled={!isEditing}
                />
              </div>

              {/* 이메일 */}
              <div className="profile-field">
                <label>
                  <img src={Mail} alt="이메일" className="field-icon" />
                  이메일
                </label>
                <input
                  type="email"
                  value={userInfo.email}
                  onChange={(e) =>
                    handleUserInfoChange("email", e.target.value)
                  }
                  disabled={!isEditing}
                />
              </div>

              {/* 현재 비밀번호 */}
              <div className="profile-field">
                <label>
                  <img src={Lock} alt="비밀번호" className="field-icon" />
                  현재 비밀번호
                </label>
                {isEditing ? (
                  <input
                    type="password"
                    placeholder="현재 비밀번호를 입력하세요"
                    value={passwordForm.current}
                    onChange={(e) =>
                      handlePasswordInputChange("current", e.target.value)
                    }
                  />
                ) : (
                  <input
                    type="password"
                    value="000000000000"
                    disabled
                    className="password-mask"
                  />
                )}
              </div>

              {/* 새 비밀번호 */}
              {isEditing && (
                <div className="profile-field">
                  <label>
                    <img src={Lock} alt="새 비밀번호" className="field-icon" />
                    새 비밀번호
                  </label>
                  <input
                    type="password"
                    placeholder="새 비밀번호를 입력하세요"
                    value={passwordForm.new}
                    onChange={(e) =>
                      handlePasswordInputChange("new", e.target.value)
                    }
                  />
                </div>
              )}

              {/* 새 비밀번호 확인 */}
              {isEditing && (
                <div className="profile-field">
                  <label>
                    <img src={Lock} alt="비밀번호 확인" className="field-icon" />
                    새 비밀번호 확인
                  </label>
                  <input
                    type="password"
                    placeholder="새 비밀번호를 다시 입력하세요"
                    value={passwordForm.confirm}
                    onChange={(e) =>
                      handlePasswordInputChange("confirm", e.target.value)
                    }
                  />
                </div>
              )}
            </div>
            <div className="profile-column">
              <div className="profile-field">
                <label>
                  <img src={Phone} alt="전화" className="field-icon" />
                  전화번호
                </label>
                <input
                  type="tel"
                  value={userInfo.phone}
                  onChange={(e) =>
                    handleUserInfoChange("phone", e.target.value)
                  }
                  disabled={!isEditing}
                />
              </div>

              <div className="profile-field">
                <label>
                  <img src={Work} alt="직무" className="field-icon" />
                  전공/직무
                </label>
                <select
                  value={userInfo.major}
                  onChange={(e) =>
                    handleUserInfoChange("major", e.target.value)
                  }
                  disabled={!isEditing}
                >
                  <option value="">전공/직무를 선택하세요</option>
                  <option value="컴퓨터공학">컴퓨터공학</option>
                  <option value="소프트웨어 개발/IT엔지니어링">
                    소프트웨어 개발/IT엔지니어링
                  </option>
                  <option value="마케팅/광고">마케팅/광고</option>
                  <option value="기획/운영">기획/운영</option>
                  <option value="기술영업/컨설팅">기술영업/컨설팅</option>
                  <option value="연구/교육">연구/교육</option>
                  <option value="경영/관리">경영/관리</option>
                  <option value="기타">기타</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* 하단 버튼 영역 */}
        <div className="profile-actions">
          {isEditing ? (
            <>
              <button className="btn-cancel" onClick={handleCancelEdit}>
                취소
              </button>
              <button className="btn-confirm" onClick={handleSaveProfile}>
                저장하기
              </button>
            </>
          ) : (
            <>
              <button className="btn-edit" onClick={handleStartEdit}>
                수정하기
              </button>
              <button className="withdrawal-btn" onClick={handleDeleteAccount}>
                회원탈퇴
              </button>
            </>
          )}
        </div>
      </div>

      {/* 회원 탈퇴 모달 */}
      <ConfirmWithInputModal
        isOpen={openWithdrawModal}
        title="정말 회원탈퇴 하시겠습니까?"
        highlightText="회원탈퇴"
        description={[
          "회원탈퇴 시 계정 정보는 복구가 어렵습니다.",
          "확인을 위해 현재 비밀번호를 입력해주세요.",
        ]}
        placeholder="현재 비밀번호를 입력해주세요"
        inputType="password"
        confirmLabel="회원탈퇴"
        onClose={() => setOpenWithdrawModal(false)}
        onConfirm={(password) => proceedToDeleteAccount(password)}
      />
    </div>
  );
};

export default Setting;
