import React from 'react';

const CallRequestsDisplay = ({ incomingCalls, onAcceptCall, onRejectCall, people }) => {
  if (incomingCalls.length === 0) {
    return null; // Don't render if there are no incoming calls
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
      <h3 className="text-2xl font-bold text-gray-800 mb-4">수신 호출</h3>
      <div className="space-y-4">
        {incomingCalls.map((call) => {
          const caller = people.find(p => p.id === call.callerId);
          const callerName = caller ? caller.name : "(알 수 없음)";
          return (
            <div key={call.callId} className="bg-white border border-gray-200 p-4 rounded-xl shadow-md">
              <div className="font-bold text-lg text-pink-500">호출자: {call.callerId} {callerName && `(${callerName})`}</div>
              <p className="text-sm text-gray-600 mt-1 mb-3">이유: {call.reason || '없음'}</p>
              <div className="flex space-x-2">
                <button
                  onClick={() => onAcceptCall(call.callId)}
                  className="bg-pink-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-pink-600 active:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:ring-opacity-75 transition-all duration-300 ease-in-out transform hover:scale-105 text-sm"
                >
                  수락
                </button>
                <button
                  onClick={() => {
                    const reason = prompt("호출을 거절하는 이유를 입력해주세요:");
                    if (reason !== null) { // Check if user didn't cancel the prompt
                      onRejectCall(call.callId, reason);
                    }
                  }}
                  className="bg-transparent text-pink-500 border border-pink-500 font-bold py-2 px-4 rounded-lg hover:bg-pink-100 active:bg-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:ring-opacity-75 transition-all duration-300 ease-in-out transform hover:scale-105 text-sm"
                >
                  거절
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CallRequestsDisplay;