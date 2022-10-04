import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import React, { useMemo, useState } from "react";
import styled from "styled-components";
import db from "./firebaseConfig";

export const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [sendText, setSendText] = useState("");
  const user_id = 4;
  const channelId = "V2SRYEStwf8JNpZRZfEV";
  const getChatData = async () => {
    const q = query(
      collection(db, "messages", channelId, "chat"),
      orderBy("sendAt")
    );

    const unsub = onSnapshot(q, (querySnap) => {
      const msgs = [];
      setMessages([]);
      querySnap.forEach((doc) => {
        msgs.push(doc.data().content);
        setMessages((prev) => [...prev, doc.data()]);
      });
    });
  };

  const sendChat = async () => {
    const newChatRef = doc(collection(db, "messages", channelId, "chat"));
    const channelRef = doc(db, "messages", newChatRef._path["segments"][1]);
    const sendTime = new Date();

    await setDoc(newChatRef, {
      content: sendText,
      from_id: user_id,
      sendAt: sendTime,
      id: newChatRef.id,
    });

    await updateDoc(channelRef, {
      sendAt: sendTime,
    });
  };

  useMemo(() => getChatData(), []);
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
        <input
          type="text"
          placeholder="채팅 입력"
          onChange={(e) => setSendText(e.target.value)}
        />
        <button onClick={sendChat}>전송</button>
      </div>
    </div>
  );
};

const Opponent = styled.span`
  color: red;
`;
