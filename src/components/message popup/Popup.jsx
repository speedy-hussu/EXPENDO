import { IoCheckmarkDoneCircleSharp } from "react-icons/io5";
import "./Popup.css";
function Popup({ message }) {
  return (
    <div className="popup">
      <IoCheckmarkDoneCircleSharp />
      <div className="popup-message">{message} !</div>
    </div>
  );
}

export default Popup;
