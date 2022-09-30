import React, { useEffect, useState } from "react";
import db from "./firebaseConfig";
import {
  collection,
  orderBy,
  onSnapshot,
  getDocs,
  query,
  where,
} from "firebase/firestore";

export const Chat = () => {
  const [messages, setMessages] = useState([]);
  const user_id = 4;
  const getMessages = async () => {
    const loanerChat = query(
      collection(db, "messages"),
      where("loaner_id", "==", user_id)
    );
    const ownerChat = query(
      collection(db, "messages"),
      where("owner_id", "==", user_id)
    );
    const loanerSnapshot = await getDocs(loanerChat);
    const ownerSnapshot = await getDocs(ownerChat);
    const list = loanerSnapshot.docs.map((doc) => doc.data());
    list.push(ownerSnapshot.docs.map((doc) => doc.data()));
    console.log(list);
    setMessages(list);
  };
  useEffect(() => {
    setMessages(() => getMessages());
  }, []);
  return <div>Chat</div>;
};
