const Alert = ({ message, onClose }) => {
  return (
    <div className="alert">
      <div className="alert__message">{message}</div>
      <button className="alert__close__btn" onClick={onClose}>Close</button>
    </div>
  )
}

export default Alert
