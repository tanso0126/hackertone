import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { allStudent } from "../api";

export default function HomePage() {
  const [people, setPeople] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    allStudent().then(setPeople);
  }, []);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">학생 목록</h1>
        <div className="flex gap-2">
          <button className="btn" onClick={() => navigate("/profile")}>내 프로필</button>
          <button className="btn" onClick={() => navigate("/call")}>문제 발생</button>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4">
        {people.map((p) => (
          <div key={p.id} className="border p-4 rounded shadow-sm">
            <div className="font-bold">{p.name || "(이름 없음)"} ({p.id})</div>
            <div className="text-sm text-gray-700">{p.description}</div>
            <div className="text-xs text-gray-500">{p.tag?.join(", ")}</div>
          </div>
        ))}
      </div>
    </div>
  );
}