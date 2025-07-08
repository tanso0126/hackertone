import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../api";

export default function LoginPage() {
  const [id, setId] = useState("");
  const [pw, setPw] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    const success = await login(id, pw);
    if (success) {
      localStorage.setItem("id", id);
      navigate("/home");
    } else {
      alert("로그인 실패. 학번/비밀번호 확인");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white p-6 rounded shadow">
        <h1 className="text-xl font-bold mb-4">학생 호출 시스템 로그인</h1>
        <input
          type="text"
          placeholder="학번"
          className="input"
          value={id}
          onChange={(e) => setId(e.target.value)}
        />
        <input
          type="password"
          placeholder="비밀번호"
          className="input"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
        />
        <button className="btn" onClick={handleLogin}>
          로그인
        </button>
        <button className="text-blue-500 mt-2" onClick={() => navigate("/register")}>
          회원가입
        </button>
      </div>
    </div>
  );
}