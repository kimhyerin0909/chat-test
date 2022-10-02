import { collection, onSnapshot } from "firebase/firestore";
import React, { useMemo, useState } from "react";
import styled from "styled-components";
import db from "./firebaseConfig";

export const Chat = () => {
  const [messages, setMessages] = useState([]);
  const user_id = 4;
  const sendChat = async () => {
    const channelId = "V2SRYEStwf8JNpZRZfEV";

    const q = collection(db, "messages", channelId, "chat");

    const unsub = onSnapshot(q, (querySnap) => {
      const msgs = [];
      setMessages([]);
      querySnap.forEach((doc) => {
        msgs.push(doc.data().content);
        setMessages((prev) => [...prev, doc.data()]);
      });
    });
  };

  useMemo(() => sendChat(), []);
  return (
    <div>
      {messages &&
        messages.map((data) =>
          data.from_id !== user_id ? (
            <Opponent key={data.id}>
              <span>{data.from_id}</span>
              <span>{data.content}</span>
            </Opponent>
          ) : (
            <div key={data.id}>
              <span>{data.from_id}</span>
              <span>{data.content}</span>
            </div>
          )
        )}
      <div>
        <input type="text" placeholder="채팅 입력" />
        <button>전송</button>
      </div>
    </div>
  );
};

const Opponent = styled.span`
  color: red;
`;
