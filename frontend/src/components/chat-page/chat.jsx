import React, { useContext, useEffect, useRef, useState } from "react";
import Avatar from "./avatar";
import { UserContext } from "../utils/user-context";
import logo from "../../assets/icons/logo.svg";
import Contact from "./contact";
import { uniqBy } from "lodash";
import axios from "axios";
import Image from "../../assets/icons/image.svg";
import Send from "../../assets/icons/send.svg";
import Attach from "../../assets/icons/attach.svg";
import Logout from "../../assets/icons/logout.svg";

function Chat() {
  const [webSocket, setWebSocket] = useState(null);
  const [onlinePeopleList, setOnlinePeopleList] = useState({});
  const [onlinePeople, setOnlinePeople] = useState({});
  const [selectedUserId, setSelectedUserId] = useState(null);
  const { username, id, setLoggedInUsername, setId } = useContext(UserContext);
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const keyword = useRef(null);
  const alwaysBottom = useRef();
  const extractedMessages = uniqBy(messages, "_id");

  useEffect(() => {
    connectToWebSocket();
  }, [selectedUserId]);

  function connectToWebSocket() {
    const webSocket = new WebSocket("ws://localhost:4040");
    setWebSocket(webSocket);
    webSocket.addEventListener("message", handleMessage);
    webSocket.addEventListener("close", () => {
      setTimeout(() => {
        connectToWebSocket();
      }, 1000);
    });
  }

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
      if (messageData.sender === selectedUserId)
        setMessages((prev) => [...prev, { ...messageData }]);
    }
  }

  function sendMessage(event) {
    event.preventDefault();
    const now = new Date();

    const formattedTime = `${("0" + now.getDate()).slice(-2)}.${(
      "0" +
      (now.getMonth() + 1)
    ).slice(-2)}.${now.getFullYear()} ${("0" + now.getHours()).slice(-2)}:${(
      "0" + now.getMinutes()
    ).slice(-2)}`;

    webSocket.send(
      JSON.stringify({
        recipient: selectedUserId,
        text: newMessage,
        sentAt: formattedTime,
      })
    );
    setNewMessage("");
    setMessages((previous) => [
      ...previous,
      {
        text: newMessage,
        sender: id,
        recipient: selectedUserId,
        _id: Date.now(),
        sentAt: formattedTime,
      },
    ]);
  }

  function logout() {
    axios.post("/logout").then(() => {
      setId(null);
      setLoggedInUsername(null);
    });
    console.log("terst");
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

  useEffect(() => {
    const container = alwaysBottom.current;
    if (container) {
      container.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [messages]);

  useEffect(() => {
    if (selectedUserId) {
      axios.get("/messages/" + selectedUserId).then((res) => {
        setMessages(res.data);
      });
    }
  }, [selectedUserId]);

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        width: "100vw",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "30%",
          backgroundColor: "#31313A",
        }}
      >
        <div style={{ flexGrow: "1" }}>
          <div
            style={{
              display: "flex",
              gap: "12px",
              padding: "25px 10px 5px 20px",
            }}
          >
            <Avatar username={username} userId="default" />
            <div style={{ display: "flex" }}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  marginTop: "10px",
                  lineHeight: "5px",
                  color: "white",
                }}
              >
                <span style={{ fontWeight: "bold" }}>{username}</span>
                <p style={{ fontSize: "11px" }}>logged in</p>
              </div>
            </div>
          </div>
          <div>
            <div style={{ padding: "25px 10px 15px 20px" }}>
              <input
                style={{
                  backgroundColor: "white",
                  borderRadius: "2.5px",
                  border: "none",
                  padding: "5px 10px 5px 10px",
                  color: "#31313A",
                  outline: "none",
                  width: "88%",
                }}
                ref={keyword}
                onChange={filterbyKeyword}
                placeholder="Find contacts..."
              />
            </div>
          </div>
          {Object.keys(onlinePeopleList).map((userId) => (
            <Contact
              key={userId}
              id={userId}
              online={true}
              username={onlinePeopleList[userId]}
              onClick={() => {
                setSelectedUserId(userId);
                setNewMessage("");
              }}
              selected={userId === selectedUserId}
            />
          ))}
        </div>
        <div
          style={{
            display: "flex",
            height: "fit-content",
            width: "fit-content",
            marginLeft: "20px",
            marginBottom: "20px",
          }}
        >
          <img
            onClick={logout}
            src={Logout}
            width={"30px"}
            style={{ cursor: "pointer" }}
          />
        </div>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "70%",
          backgroundColor: "#44444F",
        }}
      >
        <div style={{ flexGrow: "1" }}>
          {!selectedUserId && (
            <div
              style={{
                height: "100%",
                display: "flex",
                flexGrow: "1",
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
                position: "relative",
                height: "100%",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  bottom: "0",
                  right: "0",
                  left: "0",
                  top: "0",
                  overflowY: "scroll",
                  paddingTop: "20px",
                }}
              >
                {extractedMessages.map((message) => (
                  <div
                    key={message._id}
                    style={{ padding: "10px 0px 15px 15px" }}
                  >
                    <div
                      style={{
                        width: "100%",
                        alignItems: "center",
                      }}
                    >
                      {message.sender !== selectedUserId && (
                        <div
                          key={message._id}
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
                              marginTop: "-6px",
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                color: "white",
                                lineHeight: "0px",
                              }}
                            >
                              <p
                                style={{ fontSize: "15px", fontWeight: "bold" }}
                              >
                                You
                              </p>
                              <p
                                style={{
                                  fontSize: "10px",
                                  marginLeft: "6px",
                                  marginTop: "12px",
                                  opacity: "50%",
                                }}
                              >
                                {message.sentAt}
                              </p>
                            </div>
                            <div
                              style={{
                                color: "white",
                                fontSize: "13px",
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
                        <div
                          key={message._id}
                          style={{
                            display: "flex",
                            flexDirection: "row",
                          }}
                        >
                          <Avatar
                            username={onlinePeopleList[selectedUserId]}
                            userId={selectedUserId}
                          />
                          <div
                            style={{
                              marginLeft: "12px",
                              width: "calc(100% - 100px)",
                              marginTop: "-6px",
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                color: "white",
                                alignItems: "center",
                                lineHeight: "0px",
                              }}
                            >
                              <p
                                style={{ fontSize: "15px", fontWeight: "bold" }}
                              >
                                {onlinePeopleList[selectedUserId]}
                              </p>
                              <p
                                style={{
                                  fontSize: "10px",
                                  marginLeft: "6px",
                                  marginTop: "12px",
                                  opacity: "50%",
                                }}
                              >
                                {message.sentAt}
                              </p>
                            </div>
                            <div
                              style={{
                                color: "white",
                                fontSize: "13px",
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
                    </div>
                  </div>
                ))}
                <div style={{ height: "12px" }} ref={alwaysBottom}></div>
              </div>
            </div>
          )}
        </div>
        {selectedUserId && (
          <form
            style={{
              display: "flex",
              padding: "0px 10px 10px 10px",
            }}
            onSubmit={sendMessage}
          >
            <input
              style={{
                backgroundColor: "white",
                width: "90%",
                flexGrow: "1",
                padding: "10px",
                border: "none",
                borderRadius: "5px",
                outline: "none",
              }}
              type="text"
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
            <button
              type="submit"
              style={{
                marginLeft: "-4px",
                borderRadius: "0px 5px 5px 0px",
                border: "none",
                backgroundColor: "#708090",
                cursor: "pointer",
              }}
            >
              <img src={Send} width={"25px"} />
            </button>
            <div
              style={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <label
                style={{
                  display: "flex",
                  marginLeft: "18px",
                  marginRight: "10px",
                }}
              >
                <input
                  type="file"
                  style={{ visibility: "hidden", display: "none" }}
                />
                <img
                  style={{ cursor: "pointer" }}
                  src={Attach}
                  width={"28px"}
                />
              </label>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default Chat;
