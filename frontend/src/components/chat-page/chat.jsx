import React, { useContext, useEffect, useRef, useState } from "react";
import { uniqBy } from "lodash";
import { UserContext } from "../utils/user-context";
import "./styles.css";
import Avatar from "./avatar";
import Contact from "./contact";
import axios from "axios";
import Send from "../../assets/icons/send.svg";
import Attach from "../../assets/icons/attach.svg";
import Logout from "../../assets/icons/logout.svg";
import Logo from "../../assets/icons/logo.svg";
import Menu from "../../assets/icons/menu.svg";
import Close from "../../assets/icons/close.svg";

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
  const [mobile, setMobile] = useState();
  const [toggle, setToggle] = useState(false);

  const handleResize = () => {
    if (window.innerWidth <= 600) {
      setMobile(true);
    } else {
      setMobile(false);
    }
  };

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
    if (newMessage !== "") {
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
  }

  function logout() {
    axios.post("/logout").then(() => {
      setId(null);
      setLoggedInUsername(null);
    });
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
    handleResize();
    window.addEventListener("resize", handleResize);
  });

  useEffect(() => {
    const container = alwaysBottom.current;
    if (container) {
      container.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [messages]);

  useEffect(() => {
    connectToWebSocket();
    if (selectedUserId) {
      axios.get("/messages/" + selectedUserId).then((res) => {
        setMessages(res.data);
      });
      if (!mobile) keyword.current.value = "";
    }
    if (mobile) setToggle(false);
  }, [selectedUserId]);

  return (
    <div className="chatDiv">
      {!mobile && (
        <div className="sidebarDiv">
          <div className="informationDiv">
            <div className="logoDiv">
              <img src={Logo} width={"35px"} />
              <p className="appName">chatconnect</p>
            </div>
            <div className="searchBarDiv">
              <input
                className="searchBar"
                ref={keyword}
                onChange={filterbyKeyword}
                placeholder="Find contacts..."
              />
            </div>
            <div>
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
          </div>
          <div className="bottomDiv">
            <div className="userInformation">
              <Avatar username={username} userId="default" />
              <div className="usernameInformationDiv">
                <div className="usernameInformation">
                  <span className="username">{username}</span>
                </div>
              </div>
            </div>
            <div className="logoutDiv">
              <img onClick={logout} src={Logout} width={"30px"} />
            </div>
          </div>
        </div>
      )}
      {mobile && (
        <div className="mobileDiv">
          {!toggle && (
            <div className="sidebarDiv2">
              <div className="informationDiv">
                <div className="menuDiv">
                  <img
                    className="menuIcon"
                    src={Menu}
                    width={"30px"}
                    onClick={() => {
                      setToggle(true);
                    }}
                  />
                </div>
                <div>
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
                      screen="mobile"
                    />
                  ))}
                </div>
              </div>
              <div className="bottomDiv">
                <div className="logoutDiv">
                  <img onClick={logout} src={Logout} width={"30px"} />
                </div>
              </div>
            </div>
          )}
          {toggle && (
            <div className="sidebarDiv3">
              <div className="informationDiv">
                <div className="logoDiv">
                  <div>
                    <img
                      className="menuIcon"
                      src={Close}
                      width={"30px"}
                      onClick={() => {
                        setToggle(false);
                      }}
                    />
                  </div>
                </div>
                <div className="searchBarDiv">
                  <input
                    className="searchBar"
                    ref={keyword}
                    onChange={filterbyKeyword}
                    placeholder="Find contacts..."
                  />
                </div>
                <div>
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
              </div>
              <div className="bottomDiv">
                <div className="userInformation">
                  <Avatar username={username} userId="default" />
                  <div className="usernameInformationDiv">
                    <div className="usernameInformation">
                      <span className="username">{username}</span>
                    </div>
                  </div>
                </div>
                <div className="logoutDiv">
                  <img onClick={logout} src={Logout} width={"30px"} />
                </div>
              </div>
            </div>
          )}
        </div>
      )}
      <div className="chattingDiv">
        <div className="contentAreaDiv">
          {!selectedUserId && (
            <div className="noSelectedContact">Select a chat on the left.</div>
          )}
          {selectedUserId && (
            <div className="messageAreaDiv">
              <div className="messageArea">
                {extractedMessages.map((message) => (
                  <div className="messageDiv" key={message._id}>
                    <div className="contentDiv">
                      <div className="message" key={message._id}>
                        <Avatar
                          username={`${
                            message.sender !== selectedUserId
                              ? username
                              : onlinePeopleList[selectedUserId]
                          }`}
                          userId={`${
                            message.sender !== selectedUserId
                              ? "chat"
                              : selectedUserId
                          }`}
                        />
                        <div className="messageContentDiv">
                          <div className="messageInformation">
                            <p className="messageSender">
                              {message.sender !== selectedUserId
                                ? "You"
                                : onlinePeopleList[selectedUserId]}
                            </p>
                            <p className="messageSentAt">{message.sentAt}</p>
                          </div>
                          <div className="messageText">{message.text}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                <div className="scrollDiv" ref={alwaysBottom}></div>
              </div>
            </div>
          )}
        </div>
        {selectedUserId && (
          <form className="sendMessageForm" onSubmit={sendMessage}>
            <input
              className="sendMessageInput"
              type="text"
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
            <button className="sendMessageButton" type="submit">
              <img src={Send} width={"25px"} />
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default Chat;
