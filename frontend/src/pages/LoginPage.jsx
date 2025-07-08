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
    <div className="min-h-screen flex items-center justify-center bg-pink-50">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
        <h1 className="text-3xl font-bold mb-6 text-center text-pink-500">학생 호출 시스템</h1>
        <input
          type="text"
          placeholder="학번"
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-400 focus:border-pink-400 transition-all duration-300 ease-in-out"
          value={id}
          onChange={(e) => setId(e.target.value)}
        />
        <input
          type="password"
          placeholder="비밀번호"
          className="w-full p-3 mb-6 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-400 focus:border-pink-400 transition-all duration-300 ease-in-out"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
        />
        <button 
          className="w-full bg-pink-500 text-white font-bold py-3 rounded-lg hover:bg-pink-600 active:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:ring-opacity-75 transition-all duration-300 ease-in-out transform hover:scale-105"
          onClick={handleLogin}
        >
          로그인
        </button>
        <button 
          className="w-full mt-4 text-pink-500 font-semibold py-2 rounded-lg hover:bg-pink-100 active:bg-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:ring-opacity-75 transition-all duration-300 ease-in-out"
          onClick={() => navigate("/register")}
        >
          회원가입
        </button>
      </div>
    </div>
  );
}