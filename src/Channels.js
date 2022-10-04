import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import db from "./firebaseConfig";

export const Channels = () => {
  const [channels, setChannels] = useState([]);
  const [ownerCh, setOwnerCh] = useState([]);
  const user_id = 4;

  const getLoanerChannels = async () => {
    const lq = query(
      collection(db, "messages"),
      where("loaner_id", "==", user_id)
    );

    const lunsub = onSnapshot(lq, (querySnap) => {
      setChannels([]);
      querySnap.forEach((doc) => {
        setChannels((prev) => [...prev, doc.data()]);
      });
    });
  };

  const getOwnerChannels = async () => {
    const oq = query(
      collection(db, "messages"),
      where("owner_id", "==", user_id)
    );

    const ounsub = onSnapshot(oq, (querySnap) => {
      setOwnerCh([]);
      querySnap.forEach((doc) => {
        setOwnerCh((prev) => [...prev, doc.data()]);
      });
    });
  };

  useMemo(() => getLoanerChannels(), []);
  useMemo(() => getOwnerChannels(), []);

  return (
    <div>
      <span>자신이 대여자</span>
      {channels &&
        channels.map((data) => (
          <div key={data.id}>
            <Link to={`/chat/${data.id.substr(1)}`}>{data.id}</Link>
          </div>
        ))}
      <span>자신이 공급자</span>
      {ownerCh &&
        ownerCh.map((data) => (
          <div key={data.id}>
            <Link to={`/chat/${data.id.substr(1)}`}>{data.id}</Link>
          </div>
        ))}
    </div>
  );
};
