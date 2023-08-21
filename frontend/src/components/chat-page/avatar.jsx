function Avatar({ username, userId }) {
  const colors = [
    "#b9cff0",
    "#a6bcdd",
    "#739bd4",
    "#4277c3",
    "#00214f",
    "#a5def2",
  ];
  const userIdBase10 = parseInt(userId, 32);
  const colorIndex = userIdBase10 % colors.length;
  const randomColor = colors[colorIndex];
  const shortName = username[0].toUpperCase();

  return (
    <div
      style={{
        backgroundColor: `${userId === "default" ? "#708090" : randomColor}`,
        width: `${userId === "default" ? "45px" : "35px"}`,
        height: `${userId === "default" ? "45px" : "35px"}`,
        display: "flex",
        borderRadius: "50%",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          opacity: "75%",
          fontWeight: "bold",
          fontSize: `${userId === "default" ? "22px" : "15px"}`,
        }}
      >
        {shortName}
      </div>
    </div>
  );
}

export default Avatar;
