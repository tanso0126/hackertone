import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signup } from "../api";

export default function RegisterPage() {
  const [id, setId] = useState("");
  const [pw, setPw] = useState("");
  const navigate = useNavigate();

  const handleSignup = async () => {
    const success = await signup(id, pw);
    if (success) {
      alert("회원가입 성공! 로그인 하세요.");
      navigate("/");
    } else {
      alert("회원가입 실패. 이미 존재하는 학번일 수 있습니다.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-pink-50">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
        <h1 className="text-3xl font-bold mb-6 text-center text-pink-500">회원가입</h1>
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
          onClick={handleSignup}
        >
          가입하기
        </button>
        <button 
          className="w-full mt-4 text-pink-500 font-semibold py-2 rounded-lg hover:bg-pink-100 active:bg-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:ring-opacity-75 transition-all duration-300 ease-in-out"
          onClick={() => navigate("/")}
        >
          로그인 화면으로 돌아가기
        </button>
      </div>
    </div>
  );
}