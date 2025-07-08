const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const cors = require('cors');

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

// 데이터 저장소
let users = [];       // { id, password }
let people = [];      // { id, name, tag[], description, cost }
let activeCalls = {}; // callId: { callerId, targetIds, responded, acceptedBy }
let connectedUsers = {}; // id -> socketId

// 회원가입
app.post('/signup', (req, res) => {
  const { id, password } = req.body;
  if (!id || !password) return res.status(400).json({ message: '필수 값 없음' });
  if (users.find(u => u.id === id)) return res.status(409).json({ message: '이미 존재' });
  users.push({ id, password });
  people.push({ id, name: '', tag: [], description: '', cost: '' });
  res.status(201).json({ message: '가입됨' });
});

// 로그인
app.post('/login', (req, res) => {
  const { id, password } = req.body;
  const user = users.find(u => u.id === id && u.password === password);
  if (!user) return res.status(401).json({ message: '로그인 실패' });
  res.status(200).json({ message: '로그인 성공', user: { id } });
});

// 프로필 등록
app.post('/register', (req, res) => {
  const { id, name, tag, description, cost } = req.body;
  const person = people.find(p => p.id === id);
  if (!person) return res.status(404).json({ message: '가입 안됨' });
  if (person.name) return res.status(409).json({ message: '이미 등록됨' });
  Object.assign(person, { name, tag, description, cost });
  res.status(201).json({ message: '등록됨', person });
});

// 프로필 수정
app.put('/people/:id', (req, res) => {
  const { id } = req.params;
  const { name, tag, description, cost } = req.body;
  const person = people.find(p => p.id === id);
  if (!person) return res.status(404).json({ message: '없음' });
  if (name) person.name = name;
  if (tag) person.tag = tag;
  if (description) person.description = description;
  if (cost) person.cost = cost;
  res.json({ message: '수정 완료', person });
});

// 학생 목록 조회
app.get('/people', (req, res) => {
  res.json(people);
});

// 호출 요청
app.post('/call', (req, res) => {
  const { callerId, targetIds } = req.body;
  if (!callerId || !Array.isArray(targetIds)) return res.status(400).json({ message: '입력 오류' });
  const callId = `call_${Date.now()}`;
  activeCalls[callId] = { callerId, targetIds, responded: false, acceptedBy: null };
  targetIds.forEach(tid => {
    const socketId = connectedUsers[tid];
    if (socketId) {
      io.to(socketId).emit('new-call', { callId, callerId });
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
  });

  socket.on('call-response', ({ callId, userId }) => {
    const call = activeCalls[callId];
    if (!call || call.responded) {
      socket.emit('call-closed', { message: '이미 끝남' });
      return;
    }
    call.responded = true;
    call.acceptedBy = userId;
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