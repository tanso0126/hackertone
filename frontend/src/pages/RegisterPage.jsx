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
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white p-6 rounded shadow">
        <h1 className="text-xl font-bold mb-4">회원가입</h1>
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
        <button className="btn" onClick={handleSignup}>
          가입하기
        </button>
      </div>
    </div>
  );
}