function Avatar({ username, userId }) {
  const colors = [
    "#b9cff0",
    "#a6bcdd",
    "#739bd4",
    "#4277c3",
    "#00214f",
    "#a5def2",
  ];

  function hashCode(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
    }
    return hash;
  }

  function getColorByHash(hash) {
    const colorIndex = Math.abs(hash) % colors.length;
    return colors[colorIndex];
  }

  const userHash = hashCode(userId);
  const randomColor = getColorByHash(userHash);
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
          color: "white",
          fontSize: `${userId === "default" ? "22px" : "15px"}`,
        }}
      >
        {shortName}
      </div>
    </div>
  );
}

export default Avatar;
