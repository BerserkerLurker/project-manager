import _ from "lodash";
import React, { useEffect, useRef, useState } from "react";
import {
  Button,
  ChatList,
  Input,
  MessageList,
} from "react-chat-elements/dist/main";
import { useLocation } from "react-router-dom";
import {
  getConversationByRoomId,
  getRecentConversation,
  getUnreadCount,
  initiate,
  markConversationReadByRoomId,
  postMessage,
} from "../../api/chat";
import useApi from "../../hooks/useApi";
import useAuth from "../../hooks/useAuth";

function Messages() {
  const divRef = useRef(null);

  let location = useLocation();
  const inputReferance = useRef();
  // @ts-ignore
  const { projectsMembersObj, userTeams } = useApi();
  // @ts-ignore
  const { user } = useAuth();

  const [chatUsersList, setchatUsersList] = useState([]);
  const [currentRoom, setCurrentRoom] = useState(undefined);
  const [onlineUsers, setOnlineUser] = useState([]);

  const [msgs, setMsgs] = useState([]);

  useEffect(() => {
    // TODO - handle pagination
    const fetchInfo = async () => {
      let result = [];
      let temp = Object.values(projectsMembersObj);
      temp.forEach((list) => {
        const available = list
          .filter((member) => member.userId !== user.userId)
          .map((member) => ({
            userId: member.userId,
            name: member.name,
            email: member.email,
            avatar: member.avatar,
          }));
        result.push(available);
      });

      let uList = [];
      userTeams
        .map((team) => team.members)
        .map((membersArray) => {
          membersArray.map((member) => {
            if (
              member.status === "accepted" &&
              member.memberId._id !== user.userId
            ) {
              uList.push({
                userId: member.memberId._id,
                name: member.memberId.name,
                email: member.memberId.email,
                avatar: member.memberId.avatar,
              });
            }
          });
        });

      temp = result.flat();
      result = temp
        .concat(uList)
        .filter(
          (value, index, self) =>
            index === self.findIndex((elem) => elem.userId === value.userId)
        );
      // console.log("result", result);
      // setchatUsersList([...result]);
      // console.log(chatUsersList);

      try {
        const recentConvo = await getRecentConversation();
        const unreadresp = await getUnreadCount();
        // console.log(chatUsersList);

        let updatedList = [...result];
        // console.log(recentConvo);
        // console.log(unreadresp);
        recentConvo.forEach((element) => {
          const roomInfo = element.roomInfo
            .flat()
            .filter((elem) => elem._id !== user.userId);
          // console.log(roomInfo);
          roomInfo.forEach((roomee) => {
            const index = updatedList.findIndex(
              (user) => user.userId == roomee._id
            );

            if (index !== -1) {
              const unread = unreadresp.find(
                (elem) => elem.postedByUser._id === roomee._id
              );
              // console.log(roomee.name, unread);
              updatedList[index].lastMsg = element.message;
              updatedList[index].date = element.createdAt;
              updatedList[index].unread = unread?.numberOfUnreadMsgs ?? 0;
            }
          });
        });
        // console.log(updatedList);
        setchatUsersList([...updatedList]);
      } catch (error) {
        throw error;
      }
    };
    fetchInfo();
    // may not need to send chatUsersList
    globalThis.socket.emit(
      "userslist",
      _.map(chatUsersList, (user) => _.pick(user, ["userId", "name"])),
      (payload) => {
        setOnlineUser([...payload]);
      }
    );
  }, [userTeams, msgs, location]);

  useEffect(() => {
    divRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs]);

  // console.log(chatUsersList);

  useEffect(() => {
    const fetchHistory = async (roomId) => {
      try {
        const result = await getConversationByRoomId(roomId);
        const conversation = result.conversation.map((msg) => {
          return {
            position: msg.postedByUserId === user.userId ? "right" : "left",
            type: msg.type,
            title: msg.postedByUser.name,
            text: msg.message,
            date: msg.createdAt,
          };
        });
        setMsgs([...conversation]);
      } catch (error) {}
    };
    if (currentRoom !== undefined) {
      fetchHistory({ roomId: currentRoom.chatRoomId });
    }
  }, [currentRoom]);

  useEffect(() => {
    globalThis.socket.on("joined", (payload) => {
      // console.log(payload.msg);
      setCurrentRoom({ chatRoomId: payload.roomId });
    });

    globalThis.socket.on("users", (payload) => {
      setOnlineUser([...payload]);
    });
  }, [globalThis.socket]);

  useEffect(() => {
    globalThis.socket.on("new-message", (resp) => {
      // console.log(resp.msg.chatRoomId , currentRoom.chatRoomId);
      // console.log("resp", resp);
      if (currentRoom !== undefined) {
        if (resp.msg.chatRoomId === currentRoom.chatRoomId) {
          const postedBy = resp.msg.postedByUser;
          setMsgs([
            ...msgs,
            {
              position: postedBy._id === user.userId ? "right" : "left",
              type: "text",
              title: postedBy.name,
              text: resp.msg.message,
              date: resp.msg.createdAt,
            },
          ]);
          // console.log("in", msgs);
        }
      } else {
        setMsgs([]);
      }
    });
    return () => {
      globalThis.socket.off("new-message");
    };
  }, [currentRoom, globalThis.socket, msgs]);

  const handleClick = async (otherUser) => {
    // console.log(user);
    try {
      const room = await initiate({ userIds: [otherUser.userId], type: "" });
      // console.log(currentRoom, room);
      if (
        currentRoom === undefined ||
        currentRoom.chatRoomId !== room.chatRoomId
      ) {
        setCurrentRoom(room);
        const markRead = await markConversationReadByRoomId({
          roomId: room.chatRoomId,
        });
        // console.log(room.chatRoomId);
        globalThis.socket.emit("subscribe", room.chatRoomId, otherUser.userId);
      }
    } catch (error) {}
  };

  const handleSendMsg = () => {
    if (inputReferance !== undefined) {
      // @ts-ignore
      let msg = inputReferance.current.value;
      if (currentRoom !== undefined) {
        postMessage({ roomId: currentRoom.chatRoomId, msg });
      }
    }
  };
  return userTeams.length === 0 ? (
    <div>loading</div>
  ) : (
    <>
      <div
        className="d-flex row row-cols-1 row-cols-lg-2 overflow-auto"
        style={{ height: "100%", maxHeight: "Calc(100vh - 270px)" }}
      >
        <div className="col">
          <h4>Inbox:</h4>
          {/* {[
              {
                avatar: "https://avatars.githubusercontent.com/u/80540635?v=4",
                alt: "kursat_avatar",
                title: "Kursat",
                subtitle:
                  "Why don't we go to the No Way Home movie this weekend ?",
                date: new Date(),
                unread: 3,
              },
            ]} */}
          <ChatList
            onClick={({ ...props }) => {
              // console.log(props);
              handleClick(props);
            }}
            className="chat-list"
            dataSource={chatUsersList.map((elem) => {
              const isOnline =
                onlineUsers.findIndex((obj) => obj.userId === elem.userId) ===
                -1
                  ? false
                  : true;

              return {
                userId: elem.userId,
                avatar: elem.avatar,
                title: elem.name,
                alt: `${elem.name}_avatar`,
                subtitle: elem.lastMsg,
                date: elem.date || "",
                unread: elem.unread,
                statusColorType: "badge",
                statusColor: isOnline ? "green" : "gray",
              };
            })}
          />
        </div>
        <div className="col mt-auto">
          <div className="d-flex flex-column-reverse bg-secondary">
            <div>
              {currentRoom !== undefined ? (
                <>
                  <span ref={divRef} className="text-white">
                    {currentRoom.chatRoomId}
                  </span>
                  <button
                    className="ms-2"
                    onClick={() => {
                      if (currentRoom !== undefined) {
                        globalThis.socket.emit(
                          "unsubscribe",
                          currentRoom.chatRoomId
                        );
                        globalThis.socket.removeAllListeners(
                          currentRoom.chatRoomId
                        );
                        setCurrentRoom(undefined);
                        setMsgs([]);
                      }
                    }}
                  >
                    Leave room
                  </button>
                </>
              ) : (
                ""
              )}
            </div>
            <MessageList
              messageBoxStyles={{ maxWidth: "70%" }}
              lockable={true}
              toBottomHeight={"100%"}
              dataSource={msgs}
            />
          </div>
        </div>
      </div>
      <div className="row row-cols-lg-2 mt-1">
        {currentRoom !== undefined && (
          <div className="col ms-auto border rounded me-2">
            <Input
              referance={inputReferance}
              className="bg-transparent"
              placeholder="Type here..."
              inputStyle={{
                background: "#fff",
                borderRadius: "5px",
                overflowY: "auto",
              }}
              multiline={true}
              maxHeight={50}
              rightButtons={
                <Button text="Send" onClick={() => handleSendMsg()} />
              }
            />
          </div>
        )}
      </div>
    </>
  );
}

export default Messages;
