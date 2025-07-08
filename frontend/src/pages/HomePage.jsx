import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { allStudent, getStudentActivity } from "../api";
import CallRequestsDisplay from "../components/CallRequestsDisplay";
import { getCurrentPeriodInfo, mapPeriodNameToActivityArrayIndex } from "../utils/timeUtils";

export default function HomePage({ incomingCalls, onAcceptCall, onRejectCall }) {
  const [people, setPeople] = useState([]);
  const [myId, setMyId] = useState(null);
  const [studentActivities, setStudentActivities] = useState({});
  const [currentPeriodInfo, setCurrentPeriodInfo] = useState(getCurrentPeriodInfo());
  const navigate = useNavigate();

  useEffect(() => {
    const storedId = localStorage.getItem("id");
    if (storedId) {
      setMyId(storedId);
    }
    allStudent().then(setPeople);

    const intervalId = setInterval(() => {
      setCurrentPeriodInfo(getCurrentPeriodInfo());
    }, 60 * 1000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const fetchAllStudentActivities = async () => {
      const activities = {};
      for (const person of people) {
        const activity = await getStudentActivity(person.id);
        if (activity) {
          activities[person.id] = activity;
        }
      }
      setStudentActivities(activities);
    };

    if (people.length > 0) {
      fetchAllStudentActivities();
    }
  }, [people]);

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 md:p-8">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-lg p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4 sm:mb-0">
            학생 목록
          </h1>
          <div className="flex items-center gap-4">
            {myId && <span className="text-gray-600 font-semibold">로그인: {myId}</span>}
            <button
              className="bg-pink-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-pink-600 active:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:ring-opacity-75 transition-all duration-300 ease-in-out transform hover:scale-105"
              onClick={() => navigate("/profile")}
            >
              내 프로필
            </button>
            <button
              className="bg-indigo-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-indigo-600 active:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-75 transition-all duration-300 ease-in-out transform hover:scale-105"
              onClick={() => navigate("/call")}
            >
              문제 해결사 호출
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {incomingCalls.length > 0 && (
            <div className="col-span-full">
              <CallRequestsDisplay
                incomingCalls={incomingCalls}
                onAcceptCall={onAcceptCall}
                onRejectCall={onRejectCall}
                people={people}
              />
            </div>
          )}
          {people.map((p) => {
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
              <div key={p.id} className="bg-white border border-gray-200 p-6 rounded-xl shadow-md hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 ease-in-out">
                <div className="font-bold text-lg text-pink-500 flex items-center">
                  {p.name || "(이름 없음)"} ({p.id})
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
                <p className="text-sm text-gray-600 mt-2 mb-4">{p.description}</p>
                <div className="flex flex-wrap gap-2">
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
      </div>
      <div className="fixed bottom-4 right-4 bg-gray-800 text-white p-3 rounded-lg shadow-lg text-sm font-semibold">
        현재 교시: {currentPeriodInfo.periodName}
      </div>
    </div>
  );
}