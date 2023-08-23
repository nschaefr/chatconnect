import React, { useContext, useEffect, useRef, useState } from "react";
import Avatar from "./avatar";
import { UserContext } from "../utils/user-context";
import logo from "../../assets/icons/logo.svg";
import Contact from "./contact";
import Messages from "./messages";
import { uniqBy } from "lodash";
import Image from "../../assets/icons/image.svg";
import Send from "../../assets/icons/send.svg";
import Attach from "../../assets/icons/attach.svg";

function Chat() {
  const [webSocket, setWebSocket] = useState(null);
  const [onlinePeopleList, setOnlinePeopleList] = useState({});
  const [onlinePeople, setOnlinePeople] = useState({});
  const [selectedUserId, setSelectedUserId] = useState(null);
  const { username, id, setLoggedInUsername, setId } = useContext(UserContext);
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const keyword = useRef(null);
  const messageDiv = useRef();

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
  }

  function handleMessage(event) {
    const messageData = JSON.parse(event.data);
    if ("online" in messageData) {
      showOnlinePeople(messageData.online);
    } else if ("text" in messageData) {
      setMessages((prev) => [...prev, { ...messageData }]);
    }
  }

  function sendMessage(event) {
    event.preventDefault();
    webSocket.send(
      JSON.stringify({
        recipient: selectedUserId,
        text: newMessage,
      })
    );
    setNewMessage("");
    setMessages((previous) => [
      ...previous,
      {
        text: newMessage,
        sender: id,
        recipient: selectedUserId,
        id: Date.now(),
      },
    ]);

    messageDiv.current.scrollIntoview({ behavior: "smooth" });
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
            return username.includes(keywordValue);
          })
          .reduce((filtered, [userId, username]) => {
            filtered[userId] = username;
            return filtered;
          }, {})
      );
    }
  }

  const extractedMessages = uniqBy(messages, "id");

  return (
    <div
      style={{
        display: "flex",
        backgroundColor: "#31313A",
        width: "100%",
        overflow: "hidden",
      }}
    >
      <div>
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
          <p style={{ marginLeft: "10px" }}>ChatConnect</p>
        </div>
      </div>
      <div style={{ width: "100%", backgroundColor: "#44444F" }}>
        {!selectedUserId && (
          <div
            style={{
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#FFFFFF",
              opacity: "30%",
            }}
          >
            You haven't selected a chat yet
          </div>
        )}
        {selectedUserId && (
          <div
            style={{
              overflowY: "scroll",
              height: "calc(100% - 60px)",
              paddingTop: "10px",
            }}
          >
            {extractedMessages.map((message) => (
              <div>
                <div
                  style={{
                    width: "100%",
                    alignItems: "center",
                    marginLeft: "15px",
                    marginBottom: "22px",
                    marginTop: "22px",
                  }}
                >
                  {message.sender === id && (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                      }}
                    >
                      <Avatar username={username} userId={"chat"} />
                      <div
                        style={{
                          marginLeft: "12px",
                          width: "calc(100% - 100px)",
                        }}
                      >
                        <div
                          style={{
                            color: "white",
                            fontSize: "15px",
                            fontWeight: "bold",
                          }}
                        >
                          You
                        </div>
                        <div
                          style={{
                            width: "100%",
                            color: "white",
                            fontSize: "13px",
                            marginTop: "5px",
                            display: "flex",
                            flexDirection: "column",
                            wordBreak: "break-word",
                          }}
                        >
                          {message.text}
                        </div>
                      </div>
                    </div>
                  )}
                  {message.sender === selectedUserId && (
                    <div style={{ display: "flex" }}>
                      <Avatar
                        username={onlinePeopleList[selectedUserId]}
                        userId={selectedUserId}
                      />
                      <div
                        style={{
                          marginLeft: "12px",
                          width: "calc(100% - 100px)",
                        }}
                      >
                        <div
                          style={{
                            color: "white",
                            fontSize: "15px",
                            fontWeight: "bold",
                          }}
                        >
                          {onlinePeopleList[selectedUserId]}
                        </div>
                        <div
                          style={{
                            width: "100%",
                            color: "white",
                            fontSize: "13px",
                            marginTop: "5px",
                          }}
                        >
                          {message.text}
                        </div>
                        <div ref={messageDiv}></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
        {selectedUserId && (
          <div style={{ height: "100%" }}>
            <div>
              <div className="messageInputContainer">
                <div
                  style={{
                    display: "flex",
                    width: "100%",
                    flexDirection: "row",
                    alignItems: "center",
                    borderRadius: "25px",
                    padding: "0px 5px 0px 5px",
                    backgroundColor: "#44444F",
                    marginLeft: "5px",
                  }}
                >
                  <input
                    type="text"
                    placeholder="message"
                    className="messageInput"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                  />
                  <div
                    style={{
                      backgroundColor: "#60606e",
                      borderRadius: "50%",
                      display: "flex",
                      height: "30px",
                      width: "35px",
                      alignItems: "center",
                      justifyContent: "center",
                      marginRight: "6px",
                    }}
                    onClick={sendMessage}
                  >
                    <img
                      src={Send}
                      width={"25px"}
                      style={{ marginLeft: "2.5px" }}
                    />
                  </div>
                </div>
                <div className="sendContainer">
                  <img
                    src={Attach}
                    alt=""
                    width={"32px"}
                    style={{ marginLeft: "15px" }}
                  />
                  <input type="file" style={{ display: "none" }} id="file" />
                  <label htmlFor="file">
                    <img
                      src={Image}
                      alt=""
                      width={"22px"}
                      style={{ marginTop: "4px", marginRight: "10px" }}
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Chat;
