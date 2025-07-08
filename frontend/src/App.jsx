import { useEffect, useState, useRef, useCallback } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { io } from "socket.io-client";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import HomePage from "./pages/HomePage";
import ProfilePage from "./pages/ProfilePage";
import CallProblemPage from "./pages/CallProblemPage";
import "./styles.css";

const SOCKET_URL = "https://localhost:3001";

function App() {
  const [incomingCalls, setIncomingCalls] = useState([]);
  const [id, setId] = useState(null); // State for user ID
  const socketRef = useRef(null); // Ref for socket instance

  useEffect(() => {
    const storedId = localStorage.getItem("id");
    if (storedId) {
      setId(storedId);
    } else {
      // If no ID, maybe redirect to login or handle appropriately
      // For now, just return if no ID
      return;
    }

    // Initialize socket only once when id is available
    if (storedId && !socketRef.current) { // Use storedId here for initial connection
      socketRef.current = io(SOCKET_URL);

      socketRef.current.on("connect", () => {
        console.log("소켓 연결됨:", socketRef.current.id);
        socketRef.current.emit("register-user-socket", storedId); // Use storedId for registration
      });

      socketRef.current.on("new-call", ({ callId, callerId, reason }) => {
        setIncomingCalls((prevCalls) => [
          ...prevCalls,
          { callId, callerId, reason },
        ]);
      });

      socketRef.current.on("call-accepted", ({ callId, acceptedBy }) => {
        setIncomingCalls((prevCalls) =>
          prevCalls.filter((call) => call.callId !== callId)
        );
        alert(`${acceptedBy}님이 수락했습니다.`); // Show acceptance alert
      });

      socketRef.current.on("call-closed", ({ callId, message }) => {
        setIncomingCalls((prevCalls) =>
          prevCalls.filter((call) => call.callId !== callId)
        );
        // No alert for call-closed unless it's a rejection message
      });

      // New event for call rejection notification from backend
      socketRef.current.on("call-rejected-notification", ({ callId, rejectedBy, reason }) => {
        setIncomingCalls((prevCalls) =>
          prevCalls.filter((call) => call.callId !== callId)
        );
        alert(`${rejectedBy}님이 호출을 거절했습니다. 사유: ${reason || '없음'}`);
      });

      // Cleanup function for socket disconnection
      return () => {
        if (socketRef.current) {
          socketRef.current.disconnect();
          socketRef.current = null; // Clear the ref
        }
      };
    }
  }, [id]); // Depend on 'id' state variable to re-run effect when id changes

  // Memoize handleAcceptCall and handleRejectCall
  const handleAcceptCall = useCallback((callId) => {
    if (socketRef.current && id) { // Ensure socket and id are available
      socketRef.current.emit("call-response", { callId, userId: id });
      setIncomingCalls((prevCalls) =>
        prevCalls.filter((call) => call.callId !== callId)
      );
    }
  }, [id]); // Depend on 'id'

  const handleRejectCall = useCallback((callId, reason) => { // Add reason parameter
    if (socketRef.current && id) { // Ensure socket and id are available
      socketRef.current.emit("call-rejected", { callId, userId: id, reason }); // Emit new event
      setIncomingCalls((prevCalls) =>
        prevCalls.filter((call) => call.callId !== callId)
      );
      alert(`호출을 거절했습니다. 사유: ${reason || '없음'}`); // Show local rejection alert
    }
  }, [id]); // Depend on 'id']

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/home"
          element={
            <HomePage
              incomingCalls={incomingCalls}
              onAcceptCall={handleAcceptCall}
              onRejectCall={handleRejectCall}
            />
          }
        />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/call" element={<CallProblemPage />} />
      </Routes>
    </Router>
  );
}

export default App;