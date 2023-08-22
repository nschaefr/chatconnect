import React, { useContext, useEffect, useRef, useState } from "react";
import Avatar from "./avatar";
import { UserContext } from "../utils/user-context";
import logo from "../../assets/icons/logo.svg";
import Contact from "./contact";

function Sidebar() {
  const [webSocket, setWebSocket] = useState(null);
  const [onlinePeopleList, setOnlinePeopleList] = useState({});
  const [onlinePeople, setOnlinePeople] = useState({});
  const [selectedUserId, setSelectedUserId] = useState(null);
  const { username, id, setLoggedInUsername, setId } = useContext(UserContext);
  const keyword = useRef(null);

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

    const extractedUserHimself = Object.entries(people)
      .filter(([userId, user]) => {
        return !(user === username);
      })
      .reduce((extracted, [userId, user]) => {
        extracted[userId] = user;
        return extracted;
      }, {});

    setOnlinePeopleList(extractedUserHimself);
    setOnlinePeople(extractedUserHimself);
    console.log(extractedUserHimself);
  }

  function handleMessage(event) {
    const messageData = JSON.parse(event.data);
    if ("online" in messageData) {
      showOnlinePeople(messageData.online);
    } else if ("text" in messageData) {
      if (messageData.sender === selectedUserId) {
        setMessages((prev) => [...prev, { ...messageData }]);
      }
    }
  }

  function filterbyKeyword() {
    const keywordValue = keyword.current.value;

    if (!keywordValue) {
      setOnlinePeopleList(onlinePeople);
      return;
    }

    if (keywordValue) {
      setOnlinePeopleList(() =>
        Object.entries(onlinePeople)
          .filter(([userId, username]) => {
            return (
              userId.includes(keywordValue) || username.includes(keywordValue)
            );
          })
          .reduce((filtered, [userId, username]) => {
            filtered[userId] = username;
            return filtered;
          }, {})
      );
    }
  }

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
          <input
            ref={keyword}
            onChange={filterbyKeyword}
            className="searchInput"
            placeholder="Find contacts..."
          />
        </div>
      </div>
      {Object.keys(onlinePeopleList).map((userId) => (
        <div style={{ display: "flex" }} key={userId}>
          <Contact
            key={userId}
            id={userId}
            online={true}
            username={onlinePeopleList[userId]}
            onClick={() => {
              setSelectedUserId(userId);
            }}
            selected={userId === selectedUserId}
          />
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
        <img src={logo} alt="chat-logo" width="28px" />
        <p style={{ marginLeft: "13px" }}>ChatConnect</p>
      </div>
    </div>
  );
}

export default Sidebar;
