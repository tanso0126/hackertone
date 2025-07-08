import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { allStudent, call, getStudentActivity } from "../api";
import { getCurrentPeriodInfo, mapPeriodNameToActivityArrayIndex } from "../utils/timeUtils";

export default function CallProblemPage() {
  const [allPeople, setAllPeople] = useState([]);
  const [filteredPeople, setFilteredPeople] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selected, setSelected] = useState([]);
  const [reason, setReason] = useState("");
  const [studentActivities, setStudentActivities] = useState({});
  const [currentPeriodInfo, setCurrentPeriodInfo] = useState(getCurrentPeriodInfo());
  const navigate = useNavigate();

  useEffect(() => {
    const myId = localStorage.getItem("id");
    allStudent().then((people) => {
      const namedPeople = people.filter(p => p.name);
      const filteredSelf = namedPeople.filter(p => p.id !== myId);
      setAllPeople(filteredSelf);
      setFilteredPeople(filteredSelf);
    });

    const intervalId = setInterval(() => {
      setCurrentPeriodInfo(getCurrentPeriodInfo());
    }, 60 * 1000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    const result = allPeople.filter(
      (p) =>
        p.name.toLowerCase().includes(lowerCaseSearchTerm) ||
        p.id.toLowerCase().includes(lowerCaseSearchTerm) ||
        p.tag?.some((t) => t.toLowerCase().includes(lowerCaseSearchTerm))
    );
    setFilteredPeople(result);
  }, [searchTerm, allPeople]);

  useEffect(() => {
    const fetchAllStudentActivities = async () => {
      const activities = {};
      for (const person of allPeople) {
        const activity = await getStudentActivity(person.id);
        if (activity) {
          activities[person.id] = activity;
        }
      }
      setStudentActivities(activities);
    };

    if (allPeople.length > 0) {
      fetchAllStudentActivities();
    }
  }, [allPeople]);

  const toggleSelection = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  };

  const handleBulkCall = async () => {
    if (selected.length === 0) {
      alert("호출할 학생을 먼저 선택해주세요.");
      return;
    }
    const myId = localStorage.getItem("id");
    if (selected.includes(myId)) {
      alert("자기 자신은 호출할 수 없습니다.");
      return;
    }
    const ok = await call(myId, selected, reason);
    if (ok) {
      alert("선택한 학생들을 호출했습니다.");
      setSelected([]);
      setReason("");
    } else {
      alert("호출에 실패했습니다.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 md:p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-6 sm:p-8">
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => navigate(-1)}
            className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
          >
            &larr; 뒤로가기
          </button>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 text-center">
            호출할 학생 선택
          </h1>
          <div className="w-24"></div>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg mb-8">
          <input
            type="text"
            className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-400 focus:border-pink-400"
            placeholder="이름, 학번 또는 태그로 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
            ✨ 전체 학생 목록 (클릭하여 선택) ✨
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPeople.map((p) => {
              const studentActivity = studentActivities[p.id];
              const activityArrayIndex = mapPeriodNameToActivityArrayIndex(currentPeriodInfo.periodName);
              const currentActivityValue = (studentActivity && activityArrayIndex !== null && studentActivity.length > activityArrayIndex)
                ? studentActivity[activityArrayIndex]
                : null;

              let activityDisplayText = null;
              let activityBgClass = null;

              if (currentActivityValue === '이') {
                activityDisplayText = '이석';
                activityBgClass = 'activity-tag gray-bg';
              } else if (currentActivityValue === '컴') {
                activityDisplayText = '컴이석';
                activityBgClass = 'activity-tag sky-bg';
              } else if (currentActivityValue === '박') {
                activityDisplayText = '외박';
                activityBgClass = 'activity-tag purple-bg';
              } else if (currentActivityValue) {
                activityDisplayText = currentActivityValue;
                activityBgClass = 'activity-tag gray-bg';
              }

              const isKom = currentActivityValue === '컴';
              const isYi = currentActivityValue === '이';

              return (
                <div
                  key={p.id}
                  onClick={() => toggleSelection(p.id)}
                  className={`p-6 rounded-xl shadow-md cursor-pointer transition-all
                    ${selected.includes(p.id)
                      ? "bg-pink-100 border-2 border-pink-500 transform -translate-y-1"
                      : "bg-white border border-gray-200 hover:shadow-xl hover:-translate-y-1"
                    }`}
                >
                  <div className="font-bold text-lg text-pink-500 flex items-center">
                    {p.name} ({p.id})
                    {isKom && (
                      <span className="activity-indicator">
                        <span className="activity-circle blue"></span>
                        <span className="activity-text blue">컴이석</span>
                      </span>
                    )}
                    {isYi && (
                      <span className="activity-indicator">
                        <span className="activity-circle gray"></span>
                        <span className="activity-text gray">이석</span>
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {p.tag?.map(t =>
                      <span key={t} className="bg-pink-100 text-pink-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                        {t}
                      </span>
                    )}
                  </div>
                  {activityDisplayText && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      <span className={activityBgClass}>
                        {activityDisplayText}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <textarea
            className="w-full h-24 p-4 mt-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400"
            placeholder="호출하는 이유를 간단하게 적어주세요. (선택 사항)"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />

          <button
            className="w-full mt-4 bg-indigo-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-indigo-600 disabled:bg-gray-400"
            onClick={handleBulkCall}
            disabled={selected.length === 0}
          >
            {selected.length > 0 ? `${selected.length}명에게 도움 요청하기` : '호출할 학생을 선택하세요'}
          </button>
        </div>
      </div>
    </div>
  );
}