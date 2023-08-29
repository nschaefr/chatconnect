import Avatar from "./avatar";
import "./styles.css";

function Contact({ id, username, onClick, selected }) {
  return (
    <div
      className="contactDiv"
      key={id}
      onClick={() => onClick(id)}
      style={{
        padding: "10px 20px 10px 20px",
        display: "flex",
        width: "100%",
        alignItems: "center",
        color: "white",
        gap: "10px",
        cursor: "pointer",
        backgroundColor: `${selected ? "#44444F" : "#31313A"}`,
      }}
    >
      {selected && <div className="contactSelector"></div>}
      <Avatar username={username} userId={id} />
      <div className="contactNameDiv">
        <span
          style={{
            fontSize: "15px",
            fontFamily: "SemiBold",
            opacity: `${selected ? "100%" : "50%"}`,
          }}
        >
          {username}
        </span>
      </div>
    </div>
  );
}

export default Contact;
