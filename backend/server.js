const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const cors = require('cors');
const fs = require('fs');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // 프론트엔드 origin 허용
    methods: ["GET", "POST", "PUT"]
  }
});

app.use(cors());
app.use(express.json());

const PORT = 3001;

// --- 데이터 저장소 (파일 기반) ---
const USERS_FILE = './users.json';
const PEOPLE_FILE = './people.json';
const CALLS_FILE = './calls.json'; // New file for persistent calls

const loadData = (filePath, defaultData = []) => {
  try {
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(data);
    } else {
      fs.writeFileSync(filePath, JSON.stringify(defaultData, null, 2));
      return defaultData;
    }
  } catch (error) {
    console.error(`Error loading ${filePath}:`, error);
    return defaultData;
  }
};

const saveData = (filePath, data) => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error(`Error saving ${filePath}:`, error);
  }
};

let users = loadData(USERS_FILE);
let people = loadData(PEOPLE_FILE);

let activeCalls = loadData(CALLS_FILE, {}); // Load active calls from file, default to empty object
let connectedUsers = {}; // 메모리에서 관리 (휘발성)

// 회원가입
app.post('/signup', (req, res) => {
  const { id, password } = req.body;
  if (!id || !password) return res.status(400).json({ message: '필수 값 없음' });
  if (users.find(u => u.id === id)) return res.status(409).json({ message: '이미 존재' });
  
  users.push({ id, password });
  people.push({ id, name: '', tag: [], description: '', cost: '' });
  
  saveData(USERS_FILE, users);
  saveData(PEOPLE_FILE, people);
  
  res.status(201).json({ message: '가입됨' });
});

// 로그인
app.post('/login', (req, res) => {
  const { id, password } = req.body;
  const user = users.find(u => u.id === id && u.password === password);
  if (!user) return res.status(401).json({ message: '로그인 실패' });
  res.status(200).json({ message: '로그인 성공', user: { id } });
});

// 프로필 수정
app.put('/people/:id', (req, res) => {
  const { id } = req.params;
  const { name, tag, description, cost } = req.body;
  const personIndex = people.findIndex(p => p.id === id);

  if (personIndex === -1) return res.status(404).json({ message: '없음' });

  const person = people[personIndex];
  if (name) person.name = name;
  if (tag) person.tag = tag;
  if (description) person.description = description;
  if (cost) person.cost = cost;
  
  people[personIndex] = person;
  saveData(PEOPLE_FILE, people);

  res.json({ message: '수정 완료', person });
});

// 학생 목록 조회
app.get('/people', (req, res) => {
  res.json(people);
});

// 특정 학생 정보 조회
app.get('/people/:id', (req, res) => {
  const { id } = req.params;
  const person = people.find(p => p.id === id);
  if (!person) return res.status(404).json({ message: '없음' });
  res.json(person);
});

// 호출 요청
app.post('/call', (req, res) => {
  const { callerId, targetIds, reason } = req.body; // reason 추가
  if (!callerId || !Array.isArray(targetIds)) return res.status(400).json({ message: '입력 오류' });

  const callId = `call_${Date.now()}`;
  activeCalls[callId] = { callerId, targetIds, reason: reason || '', responded: false, acceptedBy: null };
  saveData(CALLS_FILE, activeCalls); // Save calls to file

  targetIds.forEach(tid => {
    const socketId = connectedUsers[tid];
    if (socketId) {
      // reason을 함께 전송
      io.to(socketId).emit('new-call', { callId, callerId, reason: reason || '' });
    }
  });
  res.json({ message: '호출됨', callId });
});

// Socket.IO 연결
io.on('connection', (socket) => {
  console.log('소켓 연결:', socket.id);

  socket.on('register-user-socket', (userId) => {
    connectedUsers[userId] = socket.id;
    console.log(`등록됨: ${userId}`);

    // Send any pending calls to the newly connected user
    Object.values(activeCalls).forEach(call => {
      if (call.targetIds.includes(userId) && !call.responded) {
        io.to(socket.id).emit('new-call', { callId: Object.keys(activeCalls).find(key => activeCalls[key] === call), callerId: call.callerId, reason: call.reason });
      }
    });
  });

  socket.on('call-response', ({ callId, userId }) => {
    const call = activeCalls[callId];
    if (!call || call.responded) {
      socket.emit('call-closed', { message: '이미 끝남' });
      return;
    }
    call.responded = true;
    call.acceptedBy = userId;
    saveData(CALLS_FILE, activeCalls); // Save updated calls to file

    const callerSocket = connectedUsers[call.callerId];
    if (callerSocket) {
      io.to(callerSocket).emit('call-accepted', { callId, acceptedBy: userId });
    }
    call.targetIds.forEach(id => {
      if (id !== userId && connectedUsers[id]) {
        io.to(connectedUsers[id]).emit('call-closed', { message: '다른 사람이 응답함' });
      }
    });
  });

  socket.on('call-rejected', ({ callId, userId, reason }) => {
    const call = activeCalls[callId];
    if (!call) {
      console.log(`Call ${callId} not found for rejection.`);
      return;
    }

    const callerSocket = connectedUsers[call.callerId];
    if (callerSocket) {
      io.to(callerSocket).emit('call-rejected-notification', { callId, rejectedBy: userId, reason: reason || '없음' });
    }

    // Remove the call from activeCalls after rejection
    delete activeCalls[callId];
    saveData(CALLS_FILE, activeCalls);
  });

  socket.on('disconnect', () => {
    for (const id in connectedUsers) {
      if (connectedUsers[id] === socket.id) {
        delete connectedUsers[id];
        break;
      }
    }
  });
});

server.listen(PORT, () => {
  console.log(`✅ 서버 실행됨: http://localhost:${PORT}`);
});