import S6ZChat from "@components/MainPage";
import { Route, Routes, Navigate } from "react-router-dom";

export default function App() {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/chat" replace />} />

            <Route path={"/chat/:chatId?"} element={<S6ZChat />} />
        </Routes>
    );
}
