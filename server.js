/**
 * Quiz Trực Tiếp / Live Quiz - Server
 * Node.js + Express + WebSocket
 */
const express = require('express');
const http = require('http');
const path = require('path');
const fs = require('fs');
const os = require('os');
const { WebSocketServer } = require('ws');
const QRCode = require('qrcode');
const ExcelJS = require('exceljs');

const PORT = process.env.PORT || 3000;
const DATA_DIR = path.join(__dirname, 'data');
const QUIZ_FILE = path.join(DATA_DIR, 'quizzes.json');
const RESULT_DIR = path.join(DATA_DIR, 'results');

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
if (!fs.existsSync(RESULT_DIR)) fs.mkdirSync(RESULT_DIR, { recursive: true });

/* ---------------- Lưu trữ bộ đề / Quiz storage ---------------- */
function loadQuizzes() {
  try {
    return JSON.parse(fs.readFileSync(QUIZ_FILE, 'utf8'));
  } catch (e) {
    return [];
  }
}
function saveQuizzes(list) {
  fs.writeFileSync(QUIZ_FILE, JSON.stringify(list, null, 2), 'utf8');
}
function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

/* ---------------- Trạng thái phòng / Rooms ---------------- */
/** rooms: pin -> room */
const rooms = new Map();

function newPin() {
  let pin;
  do {
    pin = String(Math.floor(100000 + Math.random() * 900000));
  } while (rooms.has(pin));
  return pin;
}

function createRoom(quiz) {
  const pin = newPin();
  const room = {
    pin,
    quiz: JSON.parse(JSON.stringify(quiz)),
    hostSockets: new Set(),
    players: new Map(), // playerId -> player
    state: 'lobby', // lobby | question | reveal | ended
    qIndex: -1,
    qStartAt: 0,
    timer: null,
    createdAt: new Date().toISOString(),
  };
  rooms.set(pin, room);
  return room;
}

function publicPlayers(room) {
  return [...room.players.values()].map((p) => ({
    id: p.id,
    name: p.name,
    score: p.score,
    connected: !!(p.ws && p.ws.readyState === 1),
  }));
}

function leaderboard(room) {
  return [...room.players.values()]
    .map((p) => ({
      id: p.id,
      name: p.name,
      score: p.score,
      correct: p.answers.filter((a) => a && a.correct).length,
      totalTime: p.answers.reduce((s, a) => s + (a ? a.ms : 0), 0),
    }))
    .sort((a, b) => b.score - a.score || a.totalTime - b.totalTime)
    .map((p, i) => ({ ...p, rank: i + 1 }));
}

function send(ws, obj) {
  if (ws && ws.readyState === 1) ws.send(JSON.stringify(obj));
}
function broadcast(room, obj, includeHost = true) {
  const s = JSON.stringify(obj);
  for (const p of room.players.values())
    if (p.ws && p.ws.readyState === 1) p.ws.send(s);
  if (includeHost)
    for (const h of room.hostSockets) if (h.readyState === 1) h.send(s);
}
function toHost(room, obj) {
  for (const h of room.hostSockets) send(h, obj);
}

function lobbyState(room) {
  return {
    t: 'lobby',
    pin: room.pin,
    title: room.quiz.title,
    total: room.quiz.questions.length,
    players: publicPlayers(room),
  };
}

/* ---------------- Vòng đời câu hỏi / Question lifecycle ---------------- */
function startQuestion(room, index) {
  if (room.timer) clearTimeout(room.timer);
  if (index >= room.quiz.questions.length) return endGame(room);

  room.qIndex = index;
  room.state = 'question';
  const q = room.quiz.questions[index];
  room.qStartAt = Date.now();

  for (const p of room.players.values()) p.answers[index] = null;

  broadcast(room, {
    t: 'question',
    index,
    total: room.quiz.questions.length,
    text: q.text,
    image: q.image || null,
    options: q.options,
    time: q.time,
    points: q.points,
    serverNow: Date.now(),
    endAt: room.qStartAt + q.time * 1000,
  });

  room.timer = setTimeout(() => revealAnswer(room), q.time * 1000 + 400);
}

function revealAnswer(room) {
  if (room.state !== 'question') return;
  if (room.timer) clearTimeout(room.timer);
  room.state = 'reveal';

  const idx = room.qIndex;
  const q = room.quiz.questions[idx];
  const counts = [0, 0, 0, 0];
  for (const p of room.players.values()) {
    const a = p.answers[idx];
    if (a && a.choice != null) counts[a.choice]++;
  }

  const lb = leaderboard(room);
  const rankById = new Map(lb.map((r) => [r.id, r]));

  toHost(room, {
    t: 'reveal',
    index: idx,
    correct: q.correct,
    counts,
    leaderboard: lb,
    answeredCount: [...room.players.values()].filter((p) => p.answers[idx]).length,
    playerCount: room.players.size,
    isLast: idx === room.quiz.questions.length - 1,
  });

  for (const p of room.players.values()) {
    const a = p.answers[idx];
    const r = rankById.get(p.id);
    send(p.ws, {
      t: 'reveal',
      index: idx,
      correct: q.correct,
      yourChoice: a ? a.choice : null,
      youCorrect: !!(a && a.correct),
      gained: a ? a.gained : 0,
      score: p.score,
      rank: r ? r.rank : null,
      of: room.players.size,
      leaderboard: lb.slice(0, 5),
      isLast: idx === room.quiz.questions.length - 1,
    });
  }
}

function endGame(room) {
  if (room.timer) clearTimeout(room.timer);
  room.state = 'ended';
  room.endedAt = new Date().toISOString();
  const lb = leaderboard(room);
  broadcast(room, { t: 'final', leaderboard: lb, title: room.quiz.title });
  saveResult(room);
}

function saveResult(room) {
  const payload = {
    pin: room.pin,
    title: room.quiz.title,
    createdAt: room.createdAt,
    endedAt: room.endedAt,
    questions: room.quiz.questions,
    players: [...room.players.values()].map((p) => ({
      id: p.id,
      name: p.name,
      score: p.score,
      joinedAt: p.joinedAt,
      answers: p.answers,
    })),
  };
  try {
    fs.writeFileSync(
      path.join(RESULT_DIR, `${room.pin}-${Date.now()}.json`),
      JSON.stringify(payload, null, 2),
      'utf8'
    );
  } catch (e) {
    console.error('Save result failed', e);
  }
  return payload;
}

/* ---------------- HTTP API ---------------- */
const app = express();
app.use(express.json({ limit: '10mb' }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/quizzes', (req, res) => res.json(loadQuizzes()));

app.post('/api/quizzes', (req, res) => {
  const list = loadQuizzes();
  const quiz = req.body;
  if (!quiz.title || !Array.isArray(quiz.questions))
    return res.status(400).json({ error: 'Dữ liệu không hợp lệ' });
  if (quiz.id) {
    const i = list.findIndex((q) => q.id === quiz.id);
    if (i >= 0) list[i] = quiz;
    else list.push(quiz);
  } else {
    quiz.id = uid();
    list.push(quiz);
  }
  quiz.updatedAt = new Date().toISOString();
  saveQuizzes(list);
  res.json(quiz);
});

app.delete('/api/quizzes/:id', (req, res) => {
  saveQuizzes(loadQuizzes().filter((q) => q.id !== req.params.id));
  res.json({ ok: true });
});

app.post('/api/rooms', (req, res) => {
  const { quizId, quiz } = req.body;
  let q = quiz;
  if (quizId) q = loadQuizzes().find((x) => x.id === quizId);
  if (!q || !q.questions || !q.questions.length)
    return res.status(400).json({ error: 'Không tìm thấy bộ đề' });
  const room = createRoom(q);
  res.json({ pin: room.pin, title: room.quiz.title, total: room.quiz.questions.length });
});

app.get('/api/qr', async (req, res) => {
  const text = req.query.text || '';
  try {
    const dataUrl = await QRCode.toDataURL(text, { width: 420, margin: 1 });
    res.json({ dataUrl });
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

app.get('/api/network', (req, res) => {
  const ips = [];
  for (const [name, addrs] of Object.entries(os.networkInterfaces())) {
    for (const a of addrs || []) {
      if (a.family === 'IPv4' && !a.internal) ips.push({ name, address: a.address });
    }
  }
  res.json({ ips, port: PORT });
});

/* Xuất Excel / Export to Excel */
app.get('/api/export/:pin', async (req, res) => {
  const room = rooms.get(req.params.pin);
  if (!room) return res.status(404).send('Không tìm thấy phòng / Room not found');

  const wb = new ExcelJS.Workbook();
  wb.creator = 'Live Quiz';
  const lb = leaderboard(room);
  const qs = room.quiz.questions;

  /* Sheet 1: Bảng xếp hạng */
  const s1 = wb.addWorksheet('Bang xep hang');
  s1.columns = [
    { header: 'Hạng / Rank', key: 'rank', width: 12 },
    { header: 'Tên / Name', key: 'name', width: 28 },
    { header: 'Tổng điểm / Score', key: 'score', width: 18 },
    { header: 'Số câu đúng / Correct', key: 'correct', width: 20 },
    { header: 'Tổng số câu / Total Q', key: 'totalq', width: 18 },
    { header: 'Tỉ lệ đúng / Accuracy', key: 'acc', width: 20 },
    { header: 'Tổng thời gian (giây) / Total time', key: 'time', width: 28 },
  ];
  lb.forEach((p) =>
    s1.addRow({
      rank: p.rank,
      name: p.name,
      score: p.score,
      correct: p.correct,
      totalq: qs.length,
      acc: qs.length ? (p.correct / qs.length) : 0,
      time: Math.round(p.totalTime / 100) / 10,
    })
  );
  s1.getColumn('acc').numFmt = '0%';

  /* Sheet 2: Chi tiết từng câu */
  const s2 = wb.addWorksheet('Chi tiet tra loi');
  const cols = [
    { header: 'Tên / Name', key: 'name', width: 26 },
    { header: 'Tổng điểm / Score', key: 'score', width: 16 },
  ];
  qs.forEach((q, i) => {
    cols.push({ header: `C${i + 1} Đáp án`, key: `q${i}a`, width: 14 });
    cols.push({ header: `C${i + 1} Đ/S`, key: `q${i}r`, width: 10 });
    cols.push({ header: `C${i + 1} Giây`, key: `q${i}t`, width: 10 });
    cols.push({ header: `C${i + 1} Điểm`, key: `q${i}p`, width: 10 });
  });
  s2.columns = cols;
  const letters = ['A', 'B', 'C', 'D'];
  lb.forEach((p) => {
    const player = room.players.get(p.id);
    const row = { name: p.name, score: p.score };
    qs.forEach((q, i) => {
      const a = player.answers[i];
      row[`q${i}a`] = a && a.choice != null ? letters[a.choice] : '—';
      row[`q${i}r`] = a && a.choice != null ? (a.correct ? 'Đúng' : 'Sai') : 'Không trả lời';
      row[`q${i}t`] = a && a.choice != null ? Math.round(a.ms / 100) / 10 : '';
      row[`q${i}p`] = a ? a.gained : 0;
    });
    s2.addRow(row);
  });

  /* Sheet 3: Thống kê câu hỏi */
  const s3 = wb.addWorksheet('Thong ke cau hoi');
  s3.columns = [
    { header: 'Câu / Q#', key: 'n', width: 10 },
    { header: 'Nội dung / Question', key: 'text', width: 60 },
    { header: 'Đáp án đúng / Correct', key: 'c', width: 18 },
    { header: 'Số người đúng / # Correct', key: 'nc', width: 22 },
    { header: 'Số người sai / # Wrong', key: 'nw', width: 22 },
    { header: 'Không trả lời / No answer', key: 'nn', width: 22 },
    { header: 'Tỉ lệ đúng / Accuracy', key: 'acc', width: 20 },
  ];
  qs.forEach((q, i) => {
    let nc = 0, nw = 0, nn = 0;
    for (const p of room.players.values()) {
      const a = p.answers[i];
      if (!a || a.choice == null) nn++;
      else if (a.correct) nc++;
      else nw++;
    }
    const tot = room.players.size || 1;
    s3.addRow({
      n: i + 1,
      text: q.text,
      c: `${letters[q.correct]}. ${q.options[q.correct]}`,
      nc, nw, nn,
      acc: nc / tot,
    });
  });
  s3.getColumn('acc').numFmt = '0%';

  [s1, s2, s3].forEach((s) => {
    s.getRow(1).font = { bold: true };
    s.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFEDE9FE' } };
    s.views = [{ state: 'frozen', ySplit: 1 }];
  });

  // Tên file: bản ASCII cho trình duyệt cũ + bản UTF-8 (RFC 5987)
  const title = room.quiz.title || 'quiz';
  const ascii = title.normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd').replace(/Đ/g, 'D')
    .replace(/[^A-Za-z0-9_-]+/g, '_').replace(/^_+|_+$/g, '').slice(0, 40) || 'quiz';
  const utf8 = encodeURIComponent(`KetQua_${title}_${room.pin}.xlsx`);
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader(
    'Content-Disposition',
    `attachment; filename="KetQua_${ascii}_${room.pin}.xlsx"; filename*=UTF-8''${utf8}`
  );
  await wb.xlsx.write(res);
  res.end();
});

/* ---------------- WebSocket ---------------- */
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

wss.on('connection', (ws) => {
  ws.meta = {};

  ws.on('message', (raw) => {
    let m;
    try { m = JSON.parse(raw); } catch { return; }
    const room = m.pin ? rooms.get(String(m.pin)) : rooms.get(ws.meta.pin);

    switch (m.t) {
      case 'host_join': {
        if (!room) return send(ws, { t: 'error', code: 'no_room', msg: 'Mã PIN không tồn tại' });
        ws.meta = { role: 'host', pin: room.pin };
        room.hostSockets.add(ws);
        send(ws, lobbyState(room));
        break;
      }

      case 'player_join': {
        if (!room) return send(ws, { t: 'error', code: 'no_room', msg: 'Mã PIN không tồn tại / Invalid PIN' });
        if (room.state === 'ended')
          return send(ws, { t: 'error', code: 'ended', msg: 'Phiên đã kết thúc / Session ended' });

        // Kết nối lại / rejoin
        let player = m.playerId ? room.players.get(m.playerId) : null;
        if (!player) {
          const name = String(m.name || '').trim().slice(0, 24);
          if (!name) return send(ws, { t: 'error', code: 'name', msg: 'Vui lòng nhập tên / Enter a name' });
          const taken = [...room.players.values()].some(
            (p) => p.name.toLowerCase() === name.toLowerCase()
          );
          if (taken)
            return send(ws, { t: 'error', code: 'dup', msg: 'Tên đã có người dùng / Name already taken' });
          if (room.state !== 'lobby' && !room.quiz.allowLateJoin)
            return send(ws, { t: 'error', code: 'started', msg: 'Phiên đã bắt đầu / Already started' });
          player = {
            id: uid(),
            name,
            score: 0,
            answers: new Array(room.quiz.questions.length).fill(null),
            joinedAt: new Date().toISOString(),
            ws,
          };
          room.players.set(player.id, player);
        }
        player.ws = ws;
        ws.meta = { role: 'player', pin: room.pin, playerId: player.id };

        send(ws, {
          t: 'joined',
          playerId: player.id,
          name: player.name,
          pin: room.pin,
          title: room.quiz.title,
          score: player.score,
          state: room.state,
        });
        toHost(room, lobbyState(room));

        // Nếu đang giữa câu hỏi thì đẩy câu hiện tại
        if (room.state === 'question') {
          const q = room.quiz.questions[room.qIndex];
          send(ws, {
            t: 'question',
            index: room.qIndex,
            total: room.quiz.questions.length,
            text: q.text,
            image: q.image || null,
            options: q.options,
            time: q.time,
            points: q.points,
            serverNow: Date.now(),
            endAt: room.qStartAt + q.time * 1000,
          });
        } else if (room.state === 'ended') {
          send(ws, { t: 'final', leaderboard: leaderboard(room), title: room.quiz.title });
        }
        break;
      }

      case 'answer': {
        if (!room || room.state !== 'question') return;
        const player = room.players.get(ws.meta.playerId);
        if (!player) return;
        const idx = room.qIndex;
        if (player.answers[idx]) return; // đã trả lời
        const q = room.quiz.questions[idx];
        const ms = Date.now() - room.qStartAt;
        if (ms > q.time * 1000 + 800) return; // quá hạn

        const choice = Number(m.choice);
        if (!(choice >= 0 && choice <= 3)) return;
        const correct = choice === q.correct;
        let gained = 0;
        if (correct) {
          if (room.quiz.speedBonus === false) {
            gained = q.points;
          } else {
            const remain = Math.max(0, q.time * 1000 - ms) / (q.time * 1000);
            gained = Math.round(q.points * (0.5 + 0.5 * remain));
          }
        }
        player.answers[idx] = { choice, correct, ms, gained };
        player.score += gained;

        send(ws, { t: 'answered', choice, index: idx });
        toHost(room, {
          t: 'progress',
          answered: [...room.players.values()].filter((p) => p.answers[idx]).length,
          total: room.players.size,
        });

        // Mọi người đã trả lời -> chốt sớm
        if ([...room.players.values()].every((p) => p.answers[idx])) {
          setTimeout(() => revealAnswer(room), 300);
        }
        break;
      }

      case 'start':
        if (room && ws.meta.role === 'host') startQuestion(room, 0);
        break;

      case 'next':
        if (room && ws.meta.role === 'host') startQuestion(room, room.qIndex + 1);
        break;

      case 'skip': // chốt câu hiện tại sớm
        if (room && ws.meta.role === 'host') revealAnswer(room);
        break;

      case 'end':
        if (room && ws.meta.role === 'host') endGame(room);
        break;

      case 'kick': {
        if (room && ws.meta.role === 'host' && m.playerId) {
          const p = room.players.get(m.playerId);
          if (p) {
            send(p.ws, { t: 'error', code: 'kicked', msg: 'Bạn đã bị mời ra khỏi phòng' });
            if (p.ws) p.ws.close();
            room.players.delete(m.playerId);
            toHost(room, lobbyState(room));
          }
        }
        break;
      }

      case 'ping':
        send(ws, { t: 'pong', serverNow: Date.now() });
        break;
    }
  });

  ws.on('close', () => {
    const room = rooms.get(ws.meta.pin);
    if (!room) return;
    if (ws.meta.role === 'host') room.hostSockets.delete(ws);
    else if (ws.meta.role === 'player') {
      const p = room.players.get(ws.meta.playerId);
      if (p) p.ws = null;
      toHost(room, lobbyState(room));
    }
  });
});

/* Dọn phòng cũ sau 12 giờ */
setInterval(() => {
  const cutoff = Date.now() - 12 * 3600 * 1000;
  for (const [pin, r] of rooms) {
    if (new Date(r.createdAt).getTime() < cutoff) rooms.delete(pin);
  }
}, 3600 * 1000);

server.listen(PORT, '0.0.0.0', () => {
  const ips = [];
  for (const addrs of Object.values(os.networkInterfaces()))
    for (const a of addrs || [])
      if (a.family === 'IPv4' && !a.internal) ips.push(a.address);
  console.log('\n=============================================');
  console.log('  QUIZ TRỰC TIẾP / LIVE QUIZ đã khởi động!');
  console.log('=============================================');
  console.log(`  Máy chủ / Host:   http://localhost:${PORT}/`);
  ips.forEach((ip) => console.log(`  Trong mạng LAN:   http://${ip}:${PORT}/`));
  console.log('=============================================\n');
});
