import React, { useState, useEffect } from "react";
import "./modal.css";

const ConfirmWithInputModal = ({
  isOpen,
  title,
  highlightText,
  description,
  placeholder,
  inputType = "text",
  requiredValue,
  confirmLabel,
  onClose,
  onConfirm,
}) => {
  const [value, setValue] = useState("");

  useEffect(() => {
    if (isOpen) setValue("");
  }, [isOpen]);

  if (!isOpen) return null;

  const isValid = requiredValue
    ? value === requiredValue
    : value.trim().length > 0;

  const handleConfirm = () => {
    if (!isValid) return;
    onConfirm(value);
  };

  return (
    <div className="cmi-backdrop" onClick={onClose}>
      <div
        className="cmi-modal"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 제목 */}
        <div className="cmi-title">
          {highlightText && title ? (
            title.split(highlightText).map((chunk, i, arr) => (
              <React.Fragment key={i}>
                {chunk}
                {i < arr.length - 1 && (
                  <span className="cmi-highlight">{highlightText}</span>
                )}
              </React.Fragment>
            ))
          ) : (
            title
          )}
        </div>

        {/* 설명 */}
        <div className="cmi-desc">
          {Array.isArray(description)
            ? description.map((line, idx) => <p key={idx}>{line}</p>)
            : <p>{description}</p>}
        </div>

        {/* 가운데 입력칸 */}
        <div className="cmi-input-wrap">
          <input
            type={inputType}
            className="cmi-input"
            placeholder={placeholder}
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        </div>

        {/* 구분선 */}
        <div className="cmi-divider" />

        {/* 아래쪽 빨간 버튼 */}
        <button
          className={`cmi-confirm-btn ${isValid ? "" : "disabled"}`}
          onClick={handleConfirm}
        >
          {confirmLabel}
        </button>
      </div>
    </div>
  );
};

export { ConfirmWithInputModal };
