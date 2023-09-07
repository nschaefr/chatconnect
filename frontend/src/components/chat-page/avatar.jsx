/**
 * A component for the avatar from the User 
 * @component 
 * @param {string} username - Username
 * @param {string} userId - User id
*/

function Avatar({ username, userId }) {
  
  const colors = ["#339E92", "#66B6AD", "#99CFC9", "#008677"];
  /**
   * 
   * @param {string} str - userId to generate hash for color for user 
   * @returns {string} hash - hash to generate user color
   */
  function hashCode(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
    }
    return hash;
  }
  /**
   * 
   * @param {string} hash - hash to generate user color 
   * @returns {array} colors - returns array with colors   
   */
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
        backgroundColor: `${
          userId === "chat" || userId === "default" ? "#73b6A5" : randomColor
        }`,
        width: `${userId === "default" ? "30px" : "35px"}`,
        height: `${userId === "default" ? "30px" : "35px"}`,
        display: "flex",
        borderRadius: "50%",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          opacity: "75%",
          fontFamily: "ExtraBold",
          color: "white",
          fontSize: `${userId === "default" ? "13px" : "15px"}`,
        }}
      >
        {shortName}
      </div>
    </div>
  );
}

export default Avatar;
