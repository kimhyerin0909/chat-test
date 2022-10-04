import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import React, { useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import db from "./firebaseConfig";

export const Chat = () => {
  const { ch_id } = useParams();
  const [messages, setMessages] = useState([]);
  const [sendText, setSendText] = useState("");
  const input = useRef(null);
  const user_id = 4;
  const getChatData = async () => {
    const q = query(
      collection(db, "messages", ch_id, "chat"),
      orderBy("sendAt")
    );

    const unsub = onSnapshot(q, (querySnap) => {
      setMessages([]);
      querySnap.forEach((doc) => {
        setMessages((prev) => [...prev, doc.data()]);
      });
    });
  };

  const sendChat = async () => {
    const newChatRef = doc(collection(db, "messages", ch_id, "chat"));
    const channelRef = doc(db, "messages", newChatRef._path["segments"][1]);
    const sendTime = new Date();
    input.current.value = "";

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

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      sendChat();
    }
  };

  useMemo(() => getChatData(), []);
  return (
    <div>
      {messages &&
        messages.map((data) =>
          data.from_id !== user_id ? (
            <div key={data.id}>
              <Opponent>{data.from_id}</Opponent>
              <Opponent>{data.content}</Opponent>
              <Opponent>{data.sendAt.toDate().toString()}</Opponent>
            </div>
          ) : (
            <div key={data.id}>
              <span>{data.from_id}</span>
              <span>{data.content}</span>
              <span>{data.sendAt.toDate().toString()}</span>
            </div>
          )
        )}
      <div>
        <input
          ref={input}
          onKeyPress={handleKeyPress}
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
