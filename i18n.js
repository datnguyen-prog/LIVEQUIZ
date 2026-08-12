/* Song ngữ Việt - Anh / Bilingual VI-EN */
const I18N = {
  vi: {
    appName: 'Quiz Trực Tiếp',
    tabLibrary: 'Thư viện bộ đề', tabEditor: 'Soạn đề', tabLive: 'Tổ chức thi',
    newQuiz: 'Tạo bộ đề mới', quizTitle: 'Tên bộ đề', quizTitleP: 'VD: Kiểm tra kiến thức TV Coocaa Q3',
    defaultTime: 'Thời gian mặc định (giây)', defaultPoints: 'Điểm mặc định mỗi câu',
    speedBonus: 'Cộng điểm theo tốc độ trả lời', speedBonusHint: 'Trả lời càng nhanh điểm càng cao (50%–100% điểm câu)',
    allowLate: 'Cho phép vào trễ khi đã bắt đầu',
    addQuestion: 'Thêm câu hỏi', question: 'Câu hỏi', questionP: 'Nhập nội dung câu hỏi...',
    optionP: 'Đáp án', markCorrect: 'Đáp án đúng', correct: 'ĐÚNG',
    seconds: 'giây', points: 'điểm', del: 'Xoá', dup: 'Nhân bản', up: 'Lên', down: 'Xuống',
    save: 'Lưu bộ đề', saved: 'Đã lưu bộ đề!', host: 'Bắt đầu tổ chức', edit: 'Sửa', copy: 'Sao chép',
    noQuiz: 'Chưa có bộ đề nào. Hãy tạo bộ đề đầu tiên!',
    questions: 'câu hỏi', confirmDel: 'Xoá bộ đề này?',
    scanToJoin: 'Quét mã QR để tham gia', orGo: 'Hoặc truy cập', enterPin: 'và nhập mã PIN',
    players: 'Người tham gia', waiting: 'Đang chờ người tham gia...',
    startGame: 'Bắt đầu', nextQ: 'Câu tiếp theo', showAnswer: 'Chốt đáp án ngay', endGame: 'Kết thúc',
    finalRank: 'Bảng xếp hạng chung cuộc', lbNow: 'Bảng xếp hạng hiện tại',
    exportXlsx: 'Tải file Excel kết quả',
    answered: 'đã trả lời', rank: 'Hạng', name: 'Tên', score: 'Điểm', correctN: 'Số câu đúng',
    of: '/', backLobby: 'Về màn hình chính', newSession: 'Phiên mới',
    joinTitle: 'Tham gia', yourName: 'Tên của bạn', yourNameP: 'Nhập tên hiển thị',
    pinLabel: 'Mã PIN', join: 'Vào phòng', joining: 'Đang vào...',
    waitHost: 'Đã vào phòng! Chờ quản trị bắt đầu...', hi: 'Xin chào',
    picked: 'Đã chọn! Chờ mọi người...', tooLate: 'Hết giờ!',
    youCorrect: 'Chính xác!', youWrong: 'Chưa đúng', noAnswer: 'Bạn chưa trả lời',
    correctIs: 'Đáp án đúng là', gained: 'Điểm nhận được', total: 'Tổng điểm', yourRank: 'Hạng của bạn',
    top5: 'Top 5', finished: 'Đã hoàn thành!', congrats: 'Chúc mừng!',
    reconnect: 'Mất kết nối, đang thử lại...', connected: 'Đã kết nối lại',
    errPin: 'Mã PIN không đúng', qCount: 'Câu', lang: 'EN',
    needQ: 'Cần ít nhất 1 câu hỏi', needCorrect: 'Câu %s chưa chọn đáp án đúng',
    needText: 'Câu %s chưa có nội dung', needOpts: 'Câu %s chưa điền đủ 4 đáp án',
    lanHint: 'Người tham gia phải dùng chung WiFi với máy này',
    pickIp: 'Địa chỉ mạng dùng cho QR',
    manyIp: '⚠ Máy có nhiều kết nối mạng. Nếu quét QR không vào được, chọn địa chỉ khác trong danh sách trên.',
    noLan: '⚠ Không tìm thấy địa chỉ mạng LAN. Máy này có thể chưa nối WiFi/LAN — điện thoại sẽ không vào được.',
    projector: 'Chế độ trình chiếu', importJson: 'Nhập từ file', exportJson: 'Xuất bộ đề',
    bulkAdd: 'Nhập nhanh nhiều câu', bulkHint: 'Mỗi câu 6 dòng: câu hỏi / A / B / C / D / đáp án đúng (A,B,C hoặc D). Cách nhau bằng 1 dòng trống.',
    bulkGo: 'Tạo câu hỏi', kick: 'Mời ra',
  },
  en: {
    appName: 'Live Quiz',
    tabLibrary: 'Quiz Library', tabEditor: 'Editor', tabLive: 'Run Session',
    newQuiz: 'New quiz', quizTitle: 'Quiz title', quizTitleP: 'e.g. Coocaa TV Product Knowledge Q3',
    defaultTime: 'Default time (seconds)', defaultPoints: 'Default points per question',
    speedBonus: 'Speed bonus scoring', speedBonusHint: 'Faster answers earn more (50%–100% of points)',
    allowLate: 'Allow joining after start',
    addQuestion: 'Add question', question: 'Question', questionP: 'Type the question...',
    optionP: 'Answer', markCorrect: 'Correct answer', correct: 'CORRECT',
    seconds: 'sec', points: 'pts', del: 'Delete', dup: 'Duplicate', up: 'Up', down: 'Down',
    save: 'Save quiz', saved: 'Quiz saved!', host: 'Host session', edit: 'Edit', copy: 'Copy',
    noQuiz: 'No quizzes yet. Create your first one!',
    questions: 'questions', confirmDel: 'Delete this quiz?',
    scanToJoin: 'Scan QR to join', orGo: 'Or open', enterPin: 'and enter PIN',
    players: 'Participants', waiting: 'Waiting for participants...',
    startGame: 'Start', nextQ: 'Next question', showAnswer: 'Reveal now', endGame: 'End session',
    finalRank: 'Final leaderboard', lbNow: 'Current leaderboard',
    exportXlsx: 'Download Excel results',
    answered: 'answered', rank: 'Rank', name: 'Name', score: 'Score', correctN: 'Correct',
    of: '/', backLobby: 'Back to home', newSession: 'New session',
    joinTitle: 'Join', yourName: 'Your name', yourNameP: 'Enter display name',
    pinLabel: 'Game PIN', join: 'Join', joining: 'Joining...',
    waitHost: "You're in! Waiting for the host...", hi: 'Hi',
    picked: 'Locked in! Waiting for others...', tooLate: "Time's up!",
    youCorrect: 'Correct!', youWrong: 'Incorrect', noAnswer: 'No answer submitted',
    correctIs: 'Correct answer is', gained: 'Points earned', total: 'Total score', yourRank: 'Your rank',
    top5: 'Top 5', finished: 'Finished!', congrats: 'Congratulations!',
    reconnect: 'Disconnected, retrying...', connected: 'Reconnected',
    errPin: 'Invalid PIN', qCount: 'Q', lang: 'VI',
    needQ: 'Add at least 1 question', needCorrect: 'Question %s has no correct answer selected',
    needText: 'Question %s has no text', needOpts: 'Question %s needs all 4 answers',
    lanHint: 'Participants must be on the same WiFi as this computer',
    pickIp: 'Network address used for the QR',
    manyIp: '⚠ This computer has several network connections. If the QR does not work, pick another address above.',
    noLan: '⚠ No LAN address found. This computer may not be connected to WiFi/LAN — phones will not be able to join.',
    projector: 'Projector mode', importJson: 'Import file', exportJson: 'Export quiz',
    bulkAdd: 'Bulk add questions', bulkHint: '6 lines per question: question / A / B / C / D / correct letter (A,B,C or D). Separate questions with a blank line.',
    bulkGo: 'Create questions', kick: 'Remove',
  },
};
let LANG = localStorage.getItem('lang') || 'vi';
function T(k, ...a) {
  let s = (I18N[LANG] && I18N[LANG][k]) || I18N.vi[k] || k;
  a.forEach((v) => (s = s.replace('%s', v)));
  return s;
}
function toggleLang() {
  LANG = LANG === 'vi' ? 'en' : 'vi';
  localStorage.setItem('lang', LANG);
  applyI18n();
}
function applyI18n() {
  document.querySelectorAll('[data-t]').forEach((el) => (el.textContent = T(el.dataset.t)));
  document.querySelectorAll('[data-tp]').forEach((el) => (el.placeholder = T(el.dataset.tp)));
  if (window.onLangChange) window.onLangChange();
}
function toast(msg, ms = 2200) {
  const d = document.createElement('div');
  d.className = 'toast';
  d.textContent = msg;
  document.body.appendChild(d);
  setTimeout(() => d.remove(), ms);
}
