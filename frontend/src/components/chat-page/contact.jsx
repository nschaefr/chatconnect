import Avatar from "./avatar";

function Contact({ id, username, onClick, selected, online }) {
  return (
    <div
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
      {selected && (
        <div
          style={{
            position: "absolute",
            left: "0",
            width: "3px",
            height: "55px",
            backgroundColor: "#FFFFFF",
          }}
        ></div>
      )}
      <Avatar username={username} userId={id} />
      <div className="chatInfo">
        <span className="chatInfoSpan">{username}</span>
      </div>
    </div>
  );
}

export default Contact;
