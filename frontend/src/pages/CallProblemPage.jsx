import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { allStudent, call } from "../api";

export default function CallProblemPage() {
  const [text, setText] = useState("");
  const [candidates, setCandidates] = useState([]);
  const navigate = useNavigate();

  const analyzeAndRecommend = async () => {
    const all = await allStudent();
    const recommended = all.filter(p =>
      p.tag?.some(tag => text.includes(tag)) // 간단한 키워드 매칭
    );
    setCandidates(recommended.slice(0, 5));
  };

  const handleCall = async (targetId) => {
    const myId = localStorage.getItem("id");
    const ok = await call([myId, targetId]);
    if (ok) alert("호출 완료");
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">문제 상황 입력</h1>
      <textarea
        className="input h-32"
        placeholder="문제 상황을 입력하세요..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button className="btn mt-2" onClick={analyzeAndRecommend}>추천받기</button>
      <div className="mt-6 space-y-2">
        {candidates.map((p) => (
          <div key={p.id} className="border p-3 rounded">
            <div className="font-bold">{p.name} ({p.id})</div>
            <div className="text-sm text-gray-700">{p.description}</div>
            <button className="btn mt-2" onClick={() => handleCall(p.id)}>이 학생 호출</button>
          </div>
        ))}
      </div>
    </div>
  );
}