import Avatar from "./avatar";
import "./styles.css";
/**
 * Component which shows the contact list
 * @component
 * @param {string} id - User id
 * @param {string} username - Username
 * @param {function} onClick - onClick function to set selected user id
 * @param {string} selected - Selected user
 * @param {string} screen - Mobile or browser view
 */
function Contact({ id, username, onClick, selected, screen }) {
  return (
    <div
      data-testid="contact"
      className="contactDiv"
      key={id}
      onClick={() => onClick(id)}
      style={{
        padding: `${screen === "mobile" ? "15px" : "10px 0px 10px 20px"}`,
        display: "flex",
        alignItems: "center",
        color: "white",
        gap: "10px",
        marginLeft: `${screen === "mobile" ? "5px" : "15px"}`,
        marginRight: `${screen === "mobile" ? "5px" : "15px"}`,
        cursor: "pointer",
        borderRadius: "3px",
        backgroundColor: `${selected ? "#3c3c50" : "#28283c"}`,
      }}
    >
      <Avatar username={username} userId={id} />
      {screen !== "mobile" && (
        <div className="contactNameDiv">
          <span
            style={{
              fontSize: "15px",
              fontFamily: "SemiBold",
              opacity: `${selected ? "100%" : "50%"}`,
            }}
          >
            {screen === "mobile" ? "" : username}
          </span>
        </div>
      )}
    </div>
  );
}

export default Contact;
