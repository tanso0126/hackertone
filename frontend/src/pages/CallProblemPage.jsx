import { useState } from "react";
import { allStudent, call } from "../api";

export default function CallProblemPage() {
  const [text, setText] = useState("");
  const [candidates, setCandidates] = useState([]);

  const analyzeAndRecommend = async () => {
    const all = await allStudent();
    const recommended = all.filter((p) =>
      p.tag?.some((tag) => text.includes(tag))
    );
    setCandidates(recommended.slice(0, 5));
  };

  const handleCall = async (targetId) => {
    const myId = localStorage.getItem("id");
    const ok = await call([myId, targetId]);
    if (ok) alert("호출 완료");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 md:p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-6 sm:p-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-6 text-center">
          도움이 필요한 상황을 알려주세요!
        </h1>
        <div className="bg-gray-50 p-4 rounded-lg">
          <textarea
            className="w-full h-40 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-400 focus:border-pink-400 transition-all duration-300 ease-in-out text-gray-700 placeholder-gray-400"
            placeholder="예: React state 관리가 너무 어려워요... 도와줄 멘토가 필요해요!"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <button
            className="w-full mt-4 bg-pink-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-pink-600 active:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:ring-opacity-75 transition-all duration-300 ease-in-out transform hover:scale-105"
            onClick={analyzeAndRecommend}
          >
            나에게 딱 맞는 해결사 추천받기!
          </button>
        </div>

        {candidates.length > 0 && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
              ✨ 추천 해결사 목록 ✨
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {candidates.map((p) => (
                <div
                  key={p.id}
                  className="bg-white border border-gray-200 p-6 rounded-xl shadow-md hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 ease-in-out"
                >
                  <div className="font-bold text-lg text-pink-500">
                    {p.name} ({p.id})
                  </div>
                  <p className="text-sm text-gray-600 mt-2 mb-4">
                    {p.description}
                  </p>
                  <button
                    className="w-full bg-indigo-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-indigo-600 active:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-75 transition-all duration-300 ease-in-out"
                    onClick={() => handleCall(p.id)}
                  >
                    도와주세요!
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}