import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./ProjectSetting.css";
import { ConfirmWithInputModal } from "../../modal_component/modal.jsx";

// 아이콘 import
import EditIcon from "../../../asset/project_setting_icon/edit.svg";
import CopyIcon from "../../../asset/project_setting_icon/copy.svg";
import DeleteIcon from "../../../asset/project_setting_icon/delete.svg";
import CheckCircleIcon from "../../../asset/project_setting_icon/check-circle.svg";
import PermissionTransferIcon from "../../../asset/project_setting_icon/permission-transfer.svg";

const API_URL = import.meta.env.VITE_DEV_PROXY_URL;

const ProjectSetting = () => {
  const { projectID } = useParams();
  const projectId = projectID;
  const [projectData, setProjectData] = useState(null);
  const [isEditingName, setIsEditingName] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  
  // 모달 상태
  const [deleteProjectModal, setDeleteProjectModal] = useState(false);
  const [leaveProjectModal, setLeaveProjectModal] = useState(false);

  // 프로젝트 데이터 가져오기
  const fetchProjectData = async () => {
    try {
      const response = await fetch(`${API_URL}/api/projects/${projectId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        const mappedData = {
          ...data,
          name: data.projectName,
          members: data.members || [],
        };
        setProjectData(prev => ({
          ...prev,
          ...mappedData,
        }));
        setNewProjectName(mappedData.name || "");
      }
    } catch (error) {
      console.error("프로젝트 정보 로딩 실패:", error);
      console.error("프로젝트 정보 로딩 실패:", error);
    }
  };

  // 참여 요청 목록 가져오기
  const fetchJoinRequests = async () => {
    try {
      const response = await fetch(`${API_URL}/api/projects/${projectId}/join-requests`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setProjectData(prev => ({ ...prev, joinRequests: data }));
      }
    } catch (error) {
      console.error("참여 요청 목록 로딩 실패:", error);
    }
  };

  useEffect(() => {
    if (projectId) {
      fetchProjectData();
      fetchJoinRequests();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  // 프로젝트 이름 수정
  const handleUpdateProjectName = async () => {
    
    if (!newProjectName.trim()) {
      alert("프로젝트명을 입력해주세요.");
      return;
    }
    
    try {
      const response = await fetch(`${API_URL}/api/projects/${projectId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
        body: JSON.stringify({ projectName: newProjectName }),
      });
      if (response.ok) {
        setIsEditingName(false);
        fetchProjectData();
        alert("프로젝트 이름이 수정되었습니다.");
      }
    } catch (error) {
      console.error("프로젝트 이름 수정 실패:", error);
    }
  };

  // 참여 요청 승인
  const handleApproveRequest = async (projectUserPk) => {
    try {
      const response = await fetch(
        `${API_URL}/api/projects/${projectId}/approve/${projectUserPk}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      );
      if (response.ok) {
        alert("참여 요청을 승인했습니다.");
        fetchProjectData();
        fetchJoinRequests();
      }
    } catch (error) {
      console.error("승인 실패:", error);
    }
  };

  // 참여 요청 거절
  const handleRejectRequest = async (projectUserPk) => {
    try {
      const response = await fetch(
        `${API_URL}/api/projects/${projectId}/reject/${projectUserPk}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      );
      if (response.ok) {
        alert("참여 요청을 거절했습니다.");
        fetchJoinRequests();
      }
    } catch (error) {
      console.error("거절 실패:", error);
    }
  };

  // 방장 권한 양도
  const handleTransferOwnership = async (targetUserPk) => {
    try {
      const response = await fetch(
        `${API_URL}/api/projects/${projectId}/transfer/${targetUserPk}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      );
      if (response.ok) {
        alert("방장 권한을 양도했습니다.");
        fetchProjectData();
      }
    } catch (error) {
      console.error("권한 양도 실패:", error);
    }
  };

  // 멤버 내보내기
  const handleKickMember = async (projectUserPk) => {
    try {
      const response = await fetch(
        `${API_URL}/api/projects/${projectId}/expel/${projectUserPk}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      );
      if (response.ok) {
        alert("멤버를 내보냈습니다.");
        fetchProjectData();
      }
    } catch (error) {
      console.error("멤버 내보내기 실패:", error);
    }
  };

  // 프로젝트 나가기
  const handleLeaveProject = async (inputProjectName) => {
    try {
      const response = await fetch(`${API_URL}/api/projects/${projectId}/leave`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
        body: JSON.stringify({projectName: inputProjectName }),
      });
      if (response.ok) {
        alert("프로젝트를 나갔습니다.");
        window.location.href = "/dashboard";
      }
    } catch (error) {
      console.error("프로젝트 나가기 실패:", error);
    }
  };

  // 프로젝트 삭제
  const handleDeleteProject = async (inputProjectName) => {
    const approvedMembers = projectData.members.filter(
      (m) => m.status === "APPROVED" && m.role !== "OWNER"
    );
    
    if (approvedMembers.length > 0) {
      alert("프로젝트에 멤버가 있어 삭제할 수 없습니다.");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/projects/${projectId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
        body: JSON.stringify({ projectName: inputProjectName }),
      });
      if (response.ok) {
        alert("프로젝트가 삭제되었습니다.");
        setDeleteProjectModal(false);
        window.location.href = "/dashboard";
      }
    } catch (error) {
      console.error("프로젝트 삭제 실패:", error);
    }
  };

  // 코드 복사
  const handleCopyCode = () => {
    if (!projectData?.joinCode) {
      alert("초대 코드가 존재하지 않습니다.");
      return;
    }
    
    const textArea = document.createElement("textarea");
    textArea.value = projectData.joinCode;
    textArea.style.position = "fixed";
    textArea.style.left = "-999999px";
    textArea.style.top = "-999999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
      const successful = document.execCommand('copy');
      if (successful) {
        alert("초대 코드가 복사되었습니다.");
      } else {
        alert("복사에 실패했습니다. 수동으로 복사해주세요.");
      }
    } catch (err) {
      console.error("복사 실패:", err);
      alert("복사에 실패했습니다. 수동으로 복사해주세요.");
    } finally {
      document.body.removeChild(textArea);
    }
  };

  if (!projectData) {
    return <div className="ps-loading">프로젝트가 없습니다</div>;
  }

  const isOwner = projectData.myRole === "OWNER";
  const approvedMembers = projectData.members?.filter((m) => m.status === "APPROVED") || [];
  const pendingMembers = projectData.joinRequests || [];

  const renderJoinCodeChip = () => (
    <div className="ps-code-chip">
      <span className="ps-code">{projectData.joinCode || "-"}</span>
      <button
        type="button"
        className="ps-copy-chip-btn"
        onClick={handleCopyCode}
        disabled={!projectData.joinCode}
      >
        <img src={CopyIcon} alt="복사" className="ps-btn-icon" />
      </button>
    </div>
  );

  return (
    <div className="ps-container">
      <div className="ps-content">
        {/* 프로젝트 이름 */}
        <div className="ps-header">
          <div className="ps-header-main">
            {isEditingName ? (
              <div className="ps-name-edit">
                <input
                  type="text"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  className="ps-name-input"
                  maxLength="30"
                />
                {renderJoinCodeChip()}
                <div className="ps-name-edit-actions">
                  <button onClick={handleUpdateProjectName} className="ps-save-btn">
                    저장
                  </button>
                  <button
                    onClick={() => {
                      setIsEditingName(false);
                      setNewProjectName(projectData.name);
                    }}
                    className="ps-cancel-btn"
                  >
                    취소
                  </button>
                </div>
              </div>
            ) : (
              <div className="ps-name-display">
                <h1 className="ps-title">{projectData.name}</h1>
                {renderJoinCodeChip()}
                {isOwner && (
                  <img
                    src={EditIcon}
                    alt="수정"
                    className="ps-edit-icon"
                    onClick={() => setIsEditingName(true)}
                  />
                )}
              </div>
            )}
          </div>

          <div className="ps-header-actions">
            {isOwner ? (
              <>
                <button className="ps-delete-btn" onClick={() => setDeleteProjectModal(true)}>
                  프로젝트 삭제
                </button>
                <p className="ps-action-note">프로젝트 멤버가 없어야 삭제할 수 있어요.</p>
              </>
            ) : (
              <button className="ps-leave-btn" onClick={() => setLeaveProjectModal(true)}>
                프로젝트 나가기
              </button>
            )}
          </div>
        </div>

        {/* 프로젝트 멤버 */}
        <div className="ps-section">
          <h2 className="ps-section-title">프로젝트 멤버</h2>
          <div className="ps-member-list">
            {approvedMembers.map((member) => (
              <div key={member.userPk} className="ps-member-item">
                <div className="ps-member-info">
                  <div className="ps-member-avatar">
                    {(member.name || member.memberName || "?").charAt(0)}
                  </div>
                  <div className="ps-member-details">
                    <span className="ps-member-name">
                      {member.name || member.memberName}
                      {` (${member.email || "email@email.com"})`}
                    </span>
                  </div>
                </div>
                {isOwner && member.role !== "OWNER" && (
                  <div className="ps-member-actions">
                    <img
                      src={PermissionTransferIcon}
                      alt="권한 양도"
                      className="ps-action-icon"
                      onClick={() => handleTransferOwnership(member.projectUserPk)}
                    />
                    <img
                      src={DeleteIcon}
                      alt="내보내기"
                      className="ps-action-icon"
                      onClick={() => handleKickMember(member.projectUserPk)}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 승인 대기 멤버 */}
        {isOwner && pendingMembers.length > 0 && (
          <div className="ps-section">
            <h2 className="ps-section-title">승인 대기 멤버</h2>
            <div className="ps-member-list">
              {pendingMembers.map((member) => (
                <div key={member.projectUserPk} className="ps-member-item">
                  <div className="ps-member-info">
                    <div className="ps-member-avatar">
                      {(member.requesterName || member.name || "?").charAt(0)}
                    </div>
                    <div className="ps-member-details">
                      <span className="ps-member-name">
                        {member.requesterName || member.name}
                        {` (${member.requesterEmail || member.email || "email@email.com"})`}
                      </span>
                    </div>
                  </div>
                  <div className="ps-member-actions">
                    <img
                      src={CheckCircleIcon}
                      alt="승인"
                      className="ps-action-icon ps-approve"
                      onClick={() => handleApproveRequest(member.projectUserPk)}
                    />
                    <img
                      src={DeleteIcon}
                      alt="거절"
                      className="ps-action-icon"
                      onClick={() => handleRejectRequest(member.projectUserPk)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* 프로젝트 나가기 모달 */}
      <ConfirmWithInputModal
        isOpen={leaveProjectModal}
        title="나가시겠습니까?"
        highlightText="나가시겠습니까"
        description={[
          "프로젝트를 나갈 시 사용자와 관련된 기록은 삭제되지 않습니다.",
          "정말로 나가시겠습니까?"
        ]}
        placeholder="프로젝트명을 입력해주세요"
        inputType="text"
        requiredValue={projectData.name}
        confirmLabel="프로젝트 나가기"
        onClose={() => setLeaveProjectModal(false)}
        onConfirm={handleLeaveProject}
      />

      {/* 프로젝트 삭제 모달 */}
      <ConfirmWithInputModal
        isOpen={deleteProjectModal}
        title="정말 프로젝트를 삭제하시겠습니까?"
        highlightText="삭제"
        description={[
          "프로젝트 삭제 시 프로젝트 복구는 어렵습니다.",
          "정말로 삭제하시겠습니까?",
        ]}
        placeholder="프로젝트명을 입력해주세요"
        inputType="text"
        requiredValue={projectData.name}
        confirmLabel="프로젝트 삭제"
        onClose={() => setDeleteProjectModal(false)}
        onConfirm={handleDeleteProject}
      />
    </div>
  );
};

export default ProjectSetting;
