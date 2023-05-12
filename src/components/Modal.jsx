import React from "react";

const Modal = ({
  children,
  open = false,
  onClose = () => {},
  center = true,
}) => {
  return (
    <div
      className="Modal"
      onClick={(e) => e.target.className === "Modal" && onClose()}
      style={{ display: open ? (center ? "grid" : "block") : "none" }}
    >
      {open && children}
    </div>
  );
};

export default Modal;
