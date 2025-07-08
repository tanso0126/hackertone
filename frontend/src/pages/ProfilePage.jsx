import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getStudent, update } from "../api";

export default function ProfilePage() {
  const navigate = useNavigate();
  const id = localStorage.getItem("id");
  const [name, setName] = useState("");
  const [tag, setTag] = useState("");
  const [description, setDescription] = useState("");
  const [cost, setCost] = useState("");

  useEffect(() => {
    getStudent(id).then(student => {
      if (student) {
        setName(student.name || "");
        setTag(student.tag?.join(", ") || "");
        setDescription(student.description || "");
        setCost(student.cost || "");
      }
    });
  }, [id]);

  const save = async () => {
    const tags = tag.split(",").map((t) => t.trim());
    const ok = await update(id, name, tags, description, cost);
    if (ok) alert("저장 완료");
    else alert("저장 실패");
  };

  return (
    <div className="min-h-screen bg-pink-50 p-4 sm:p-6 md:p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-6 sm:p-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-pink-500 mb-8 text-center">내 프로필 설정</h1>
        <div className="space-y-6">
          <input 
            className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-400 focus:border-pink-400 transition-all duration-300 ease-in-out"
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            placeholder="이름"
          />
          <input 
            className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-400 focus:border-pink-400 transition-all duration-300 ease-in-out"
            value={tag} 
            onChange={(e) => setTag(e.target.value)} 
            placeholder="태그 (쉼표로 구분해서 입력해주세요!)"
          />
          <textarea 
            className="w-full h-32 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-400 focus:border-pink-400 transition-all duration-300 ease-in-out"
            value={description} 
            onChange={(e) => setDescription(e.target.value)} 
            placeholder="자신을 한마디로 소개해주세요!"
          />
          <input 
            className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-400 focus:border-pink-400 transition-all duration-300 ease-in-out"
            value={cost} 
            onChange={(e) => setCost(e.target.value)} 
            placeholder="도움 비용 (선택 사항이에요!)"
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          <button 
            className="w-full bg-pink-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-pink-600 active:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:ring-opacity-75 transition-all duration-300 ease-in-out transform hover:scale-105"
            onClick={save}
          >
            저장하기
          </button>
          <button 
            className="w-full bg-gray-300 text-gray-800 font-bold py-3 px-6 rounded-lg hover:bg-gray-400 active:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-75 transition-all duration-300 ease-in-out transform hover:scale-105"
            onClick={() => navigate("/home")}
          >
            홈으로 돌아가기
          </button>
        </div>
      </div>
    </div>
  );
}