import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { update } from "../api";

export default function ProfilePage() {
  const navigate = useNavigate();
  const id = localStorage.getItem("id");
  const [name, setName] = useState("");
  const [tag, setTag] = useState("");
  const [description, setDescription] = useState("");
  const [cost, setCost] = useState("");

  const save = async () => {
    const tags = tag.split(",").map((t) => t.trim());
    const ok = await update(id, name, tags, description, cost);
    if (ok) alert("저장 완료");
    else alert("저장 실패");
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">내 프로필 설정</h1>
      <input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="이름" />
      <input className="input" value={tag} onChange={(e) => setTag(e.target.value)} placeholder="태그 (쉼표로 구분)" />
      <input className="input" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="한마디" />
      <input className="input" value={cost} onChange={(e) => setCost(e.target.value)} placeholder="비용 (선택)" />
      <button className="btn mt-2" onClick={save}>저장</button>
      <button className="btn mt-2 ml-2 bg-gray-400" onClick={() => navigate("/home")}>뒤로가기</button>
    </div>
  );
}