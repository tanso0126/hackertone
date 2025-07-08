const week_rest = [[8,30],[9,20,0],[9,40,0],[10,30,0],[10,40],[11,30,0],[11,40],[12,30,0],[13,30],[14,20,0],[14,30],[15,20,0],[15,30],[16,20,0],[16,30],[17,20,0],[17,30],[18,20,0],[19,20],[20,15,0],[20,25],[21,20,0],[21,30],[22,25,0],[22,35],[23,30,0]].map(e => (e[0]*60+e[1])*60);
const week2 = ['일과 시작 전','1교시 수업','청소시간','2교시 수업','2~3 쉬는시간','3교시 수업','3~4 쉬는시간','4교시 수업','점심시간','5교시 수업','5~6 쉬는시간','6교시 수업','6~7 쉬는시간','7교시 수업','7~8 쉬는시간','8교시 자습','8~9 쉬는시간','9교시 자습','저녁시간','야간 1교시 자습','자습 1~2 쉬는시간','야간 2교시 자습','자습 2~3 쉬는시간','야간 3교시 자습','자습 3~4 쉬는시간','야간 4교시 자습'];
const weekend_rest = [[9,10],[10,10,0],[10,20],[11,20,0],[11,30],[12,30,0],[13,30],[14,30,0],[14,40],[15,40,0],[15,50],[16,50,0],[17,40],[19,0],[20,0,0],[20,10],[21,10,0],[21,20],[22,20,0]].map(e => (e[0]*60+e[1])*60);
const weekend2 = ['일과 시작 전','오전 1교시 자습','오전 자습 1~2 쉬는시간','오전 2교시 자습','오전 자습 2~3 쉬는시간','오전 3교시 자습','점심시간','오후 1교시 자습','오후 자습 1~2 쉬는시간','오후 2교시 자습','오후 자습 2~3 쉬는시간','오후 3교시 자습','자유시간','저녁시간','야간 1교시 자습','야간 자습 1~2 쉬는시간','야간 2교시 자습','야간 자습 2~3 쉬는시간','야간 3교시 자습'];

export function getCurrentPeriodInfo() {
  const now = new Date();
  const day = now.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  const currentSeconds = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();

  let periods, restTimes;

  // Check if it's a weekend (Saturday or Sunday)
  if (day === 0 || day === 6) {
    periods = weekend2;
    restTimes = weekend_rest;
  } else {
    periods = week2;
    restTimes = week_rest;
  }

  let currentPeriodIndex = -1;
  for (let i = 0; i < restTimes.length; i++) {
    if (currentSeconds < restTimes[i]) {
      currentPeriodIndex = i;
      break;
    }
  }

  if (currentPeriodIndex === -1) {
    // If current time is after the last defined period
    return { periodName: periods[periods.length - 1], periodIndex: periods.length - 1 };
  }

  return { periodName: periods[currentPeriodIndex], periodIndex: currentPeriodIndex };
}

// Helper to map full period names to shorter activity types if needed for display logic
export function mapPeriodToActivityType(periodName) {
  if (periodName.includes('수업')) return '수';
  if (periodName.includes('자습')) return '자';
  if (periodName.includes('쉬는시간')) return '이'; // 이석
  if (periodName.includes('점심시간')) return '점';
  if (periodName.includes('저녁시간')) return '저';
  if (periodName.includes('자유시간')) return '자유';
  if (periodName.includes('청소시간')) return '청';
  return periodName; // Return as is if no specific mapping
}

export function mapPeriodNameToActivityArrayIndex(periodName) {
  if (periodName.includes('6교시')) return 0;
  if (periodName.includes('7교시')) return 1;
  if (periodName.includes('8교시')) return 2;
  if (periodName.includes('9교시')) return 3;
  if (periodName.includes('야간 1교시')) return 0;
  if (periodName.includes('야간 2교시')) return 1;
  if (periodName.includes('야간 3교시')) return 2;
  if (periodName.includes('야간 4교시')) return 3;
  return null; // Not a period that maps to the 4-element activity array
}