import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import { Channels } from "./Channels";
import { Chat } from "./Chat";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Channels />} />
        <Route path="chat/:ch_id" element={<Chat />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
