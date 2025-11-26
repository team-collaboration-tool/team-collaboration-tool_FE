import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import "./Signup.css";

import Logo from '../../asset/user_icon/logo.svg';
import completeSignupImg from "../../asset/user_icon/welcome.svg";
import next from "../../asset/user_icon/next_icon.svg";
import caution from "../../asset/user_icon/caution_icon.svg";

const API_URL = import.meta.env.VITE_API_URL;

// 전공/직무
const MAJOR_OPTIONS = [
  { value: "", label: "전공/직무를 선택하세요" },
  { value: "IT", label: "소프트웨어 개발/IT엔지니어링" },
  { value: "marketing", label: "마케팅/광고" },
  { value: "operation", label: "기획/운영" },
  { value: "consulting", label: "기술영업/컨설팅" },
  { value: "research", label: "연구/교육" },
  { value: "management", label: "경영/관리" },
  { value: "other", label: "기타" },
];

const Signup = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [emailCheckStatus, setEmailCheckStatus] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    passwordConfirm: "",
    name: "",
    phonenumber: "",
    major: "",
  });

  // 입력값 변경 핸들러
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (name === 'email') {
      setEmailCheckStatus('');
    }
    
    if (name === 'password' || name === 'passwordConfirm') {
      const newPassword = name === 'password' ? value : formData.password;
      const newPasswordConfirm = name === 'passwordConfirm' ? value : formData.passwordConfirm;
      setPasswordError(newPassword && newPasswordConfirm && newPassword !== newPasswordConfirm);
    }
  };

  // 이메일 중복 확인
  const handleCheckDuplicate = async () => {
    if (!formData.email) {
      alert("이메일을 입력해주세요.");
      return;
    }

    try {
      // 중복 확인 API 호출하기
      const isDuplicate = false;
      
      setEmailCheckStatus(isDuplicate ? 'duplicate' : 'available');
      alert(isDuplicate ? "이미 사용 중인 이메일입니다." : "사용 가능한 이메일입니다.");
    } catch (error) {
      console.error("중복 확인 오류:", error);
      alert("중복 확인 중 오류가 발생했습니다.");
    }
  };

  // 다음 단계로 이동
  const handleNextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleSignup = async () => {
    try {
      const response = await fetch(`${API_URL}/api/users/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          passowrd: formData.password,
          name: formData.name,
          email: formData.email,
          phone: formData.phonenumber,
          field: formData.major,
        }),
      });

      if (response.ok) {
        setCurrentStep(3);
      } else {
        const result = await response.json();
        alert(result.message || "회원가입에 실패했습니다.");
      }
    } catch (error) {
      console.error("회원가입 오류:", error);
      alert("회원가입 중 오류가 발생했습니다.");
    }
  };


  // 로그인 페이지로 이동
  const handleStartLogin = () => {
    navigate('/');
  };

  // 로고 영역 컴포넌트
  const LogoArea = () => (
    <div className="logo-area">
      <h1>
        <div className="logo-circle">
          <img src={Logo} alt="협업의민족 로고" />
        </div>
      </h1>
    </div>
  );

  const renderStep1 = () => {
    const isStep1Complete = 
      formData.email && 
      formData.password && 
      formData.passwordConfirm && 
      !passwordError &&
      emailCheckStatus === 'available';
    
    return (
      <div className="signup-step">
        <LogoArea />
        
        <div className="signup-form">
          <label htmlFor="email">
            <span className="label-text">
              이메일(ID) <span className="highlight">*</span>
            </span>
          </label>
          <div className="input-with-button">
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
            <button 
              type="button" 
              className={`check-duplicate-btn ${emailCheckStatus}`}
              onClick={handleCheckDuplicate}
            >
              중복 확인
            </button>
          </div>
        </div>

        <div className="signup-form">
          <label htmlFor="password">
            <span className="label-text">
              비밀번호 <span className="highlight">*</span>
            </span>
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            className={passwordError ? 'error' : ''}
            required
          />
        </div>

        <div className="signup-form">
          <label htmlFor="passwordConfirm" className="label-with-error">
            <span className="label-text">
              비밀번호 확인 <span className="highlight">*</span>
            </span>
            {passwordError && (
              <div className="error-message">
                <img src={caution} alt="경고" className="caution-icon" />
                비밀번호가 일치하지 않습니다
              </div>
            )}
          </label>
          <input
            type="password"
            id="passwordConfirm"
            name="passwordConfirm"
            value={formData.passwordConfirm}
            onChange={handleInputChange}
            className={passwordError ? 'error' : ''}
            required
          />
        </div>

        <p className="required-text">*은 필수입니다.</p>

        <button 
          type="button" 
          className="next-btn" 
          onClick={handleNextStep}
          disabled={!isStep1Complete}
        >
          다음
          <img src={next} alt="다음 아이콘" className="next-icon" />
        </button>
      </div>
    );
  };

  const renderStep2 = () => {
    const isStep2Complete = 
      formData.name && 
      formData.phonenumber && 
      agreeToTerms;
    
    return (
      <div className="signup-step">
        <LogoArea />

        <div className="signup-form">
          <label htmlFor="name">
            <span className="label-text">
              이름 <span className="highlight">*</span>
            </span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="signup-form">
          <label htmlFor="phonenumber">
            <span className="label-text">
              전화번호 <span className="highlight">*</span>
            </span>
          </label>
          <input
            type="tel"
            maxLength="11"
            id="phonenumber"
            name="phonenumber"
            value={formData.phonenumber}
            onChange={(e) => setFormData({...formData, phonenumber: e.target.value.replace(/[^0-9]/g, '')})}
            required
          />
        </div>

        <div className="signup-form">
          <label htmlFor="major">
            <span className="label-text">전공/직무</span>
          </label>
          <select
            id="major"
            name="major"
            value={formData.major}
            onChange={handleInputChange}
          >
            {MAJOR_OPTIONS.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="terms-checkbox">
          <input
            type="checkbox"
            id="agreeToTerms"
            checked={agreeToTerms}
            onChange={(e) => setAgreeToTerms(e.target.checked)}
          />
          <label htmlFor="agreeToTerms">
            개인정보 수집에 동의하시겠습니까? <span className="highlight">*</span>
          </label>
        </div>
        <button 
          type="button" 
          className="signup-btn" 
          onClick={handleSignup}
          disabled={!isStep2Complete}
        >
          회원가입
        </button>
      </div>
    );
  };

  const renderStep3 = () => (
    <div className="signup-complete-step">
      <h1 className="signup-complete-title">{formData.name}님</h1>
      <img 
        src={completeSignupImg} 
        alt="환영합니다" 
        className="signup-complete-img" 
      />
      <h2 className="signup-complete-subtitle">
        협업의민족에 오신 것을 환영합니다.
      </h2>
      <button className="start-login-btn" onClick={handleStartLogin}>
        로그인 바로 가기
      </button>
    </div>
  );

  return (
    <div className="signup-page">
      {currentStep === 1 && renderStep1()}
      {currentStep === 2 && renderStep2()}
      {currentStep === 3 && renderStep3()}
    </div>
  );
};

export default Signup;
