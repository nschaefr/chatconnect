import React, { useContext, useEffect, useState } from "react";
import Avatar from "./avatar";
import { UserContext } from "../utils/user-context";
import logo from "../../assets/icons/logo.svg";

function Chats() {
  const [webSocket, setWebSocket] = useState(null);
  const [onlinePeople, setOnlinePeople] = useState({});
  const [selectedUserId, setSelectedUserId] = useState(null);
  const { username, id } = useContext(UserContext);
  useEffect(() => {
    const webSocket = new WebSocket("ws://localhost:4040");
    setWebSocket(webSocket);
    webSocket.addEventListener("message", handleMessage);
  }, []);

  function showOnlinePeople(peopleArray) {
    const people = {};
    peopleArray.forEach(({ userId, username }) => {
      people[userId] = username;
    });
    setOnlinePeople(people);
  }

  function handleMessage(event) {
    const messageData = JSON.parse(event.data);
    if ("online" in messageData) {
      showOnlinePeople(messageData.online);
    }
  }

  const onlinePeopleWithoutUserHimself = { ...onlinePeople };
  delete onlinePeopleWithoutUserHimself[id];

  return (
    <div className="chats">
      <div className="navbar">
        <div className="user">
          <Avatar username={username} userId="default" />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              marginTop: "10px",
              lineHeight: "5px",
            }}
          >
            <span style={{ fontWeight: "bold" }}>{username}</span>
            <p style={{ fontSize: "11px" }}>logged in</p>
          </div>
          <button className="logout-button">Logout</button>
        </div>
      </div>
      <div className="search">
        <div className="searchInputContainer">
          <input className="searchInput" placeholder="Find contacts..." />
        </div>
      </div>
      {Object.keys(onlinePeopleWithoutUserHimself).map((userId) => (
        <div style={{ display: "flex" }}>
          {selectedUserId === userId && (
            <div
              style={{
                width: "3px",
                backgroundColor: "#FFFFFF",
              }}
            ></div>
          )}
          <div
            style={{
              padding: "10px 20px 10px 20px",
              display: "flex",
              width: "100%",
              alignItems: "center",
              color: "white",
              gap: "10px",
              cursor: "pointer",
              backgroundColor: `${
                userId === selectedUserId ? "#44444F" : "#31313A"
              }`,
            }}
            key={userId}
            onClick={() => setSelectedUserId(userId)}
          >
            <Avatar username={onlinePeople[userId]} userId={userId} />
            <div className="chatInfo">
              <span className="chatInfoSpan">{onlinePeople[userId]}</span>
            </div>
          </div>
        </div>
      ))}
      <div
        style={{
          position: "absolute",
          bottom: "0",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginLeft: "45px",
          fontSize: "25px",
          fontWeight: "1000",
          color: "white",
        }}
      >
        <img src={logo} alt="chat-logo" width="30px" />
        <p style={{ marginLeft: "15px" }}>ChatConnect</p>
      </div>
    </div>
  );
}

export default Chats;
