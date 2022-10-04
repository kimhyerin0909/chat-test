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
  const user_id = 4;

  const getChannels = async () => {
    const lq = query(
      collection(db, "messages"),
      where("loaner_id", "==", user_id)
    );

    const lunsub = onSnapshot(lq, (querySnap) => {
      querySnap.forEach((doc) => {
        setChannels((prev) => [...prev, doc.data()]);
      });
    });
  };

  useMemo(() => getChannels(), []);

  return (
    <div>
      {channels &&
        channels.map((data) => (
          <div key={data.id}>
            <Link to={`/chat/${data.id.substr(1)}`}>{data.id}</Link>
          </div>
        ))}
    </div>
  );
};
