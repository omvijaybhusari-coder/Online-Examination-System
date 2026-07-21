(function(){
  "use strict";

  const STUDENTS = [
    { username: "demo",  password: "demo123",  name: "Demo Student" },
    { username: "priya", password: "priya123", name: "Priya Sharma" },
    { username: "rahul", password: "rahul123", name: "Rahul Verma" },
    { username: "anita", password: "anita123", name: "Anita Kumar" },
  ];

  const QUESTIONS = [
    { id:1,  q:"Which planet is known as the Red Planet?", options:["Venus","Mars","Jupiter","Saturn"], answer:1 },
    { id:2,  q:"What is the capital of Australia?", options:["Sydney","Melbourne","Canberra","Perth"], answer:2 },
    { id:3,  q:"Who wrote the play \"Romeo and Juliet\"?", options:["Charles Dickens","William Shakespeare","Mark Twain","Leo Tolstoy"], answer:1 },
    { id:4,  q:"What is the chemical symbol for Gold?", options:["Go","Gd","Au","Ag"], answer:2 },
    { id:5,  q:"How many continents are there on Earth?", options:["5","6","7","8"], answer:2 },
    { id:6,  q:"What does CPU stand for?", options:["Central Processing Unit","Computer Personal Unit","Central Process Utility","Core Processing Unit"], answer:0 },
    { id:7,  q:"Which language is primarily used for styling web pages?", options:["HTML","CSS","Python","SQL"], answer:1 },
    { id:8,  q:"What is the binary equivalent of decimal 2?", options:["01","10","11","00"], answer:1 },
    { id:9,  q:"Which data structure uses FIFO (First In First Out) order?", options:["Stack","Queue","Tree","Graph"], answer:1 },
    { id:10, q:"What does HTML stand for?", options:["Hyper Text Markup Language","High Text Markup Language","Hyper Transfer Markup Language","Hyperlink Text Mark Language"], answer:0 },
    { id:11, q:"Who is known as the father of computers?", options:["Alan Turing","Charles Babbage","Bill Gates","Steve Jobs"], answer:1 },
    { id:12, q:"What is the full form of RAM?", options:["Random Access Memory","Read Access Memory","Run Access Memory","Random Available Memory"], answer:0 },
    { id:13, q:"Which of these is NOT a programming language?", options:["Python","Java","HTML","C++"], answer:2 },
    { id:14, q:"What is the largest ocean on Earth?", options:["Atlantic Ocean","Indian Ocean","Arctic Ocean","Pacific Ocean"], answer:3 },
    { id:15, q:"Which gas do plants absorb from the atmosphere for photosynthesis?", options:["Oxygen","Nitrogen","Carbon Dioxide","Hydrogen"], answer:2 },
    { id:16, q:"What is the smallest prime number?", options:["0","1","2","3"], answer:2 },
    { id:17, q:"Which company developed the Windows operating system?", options:["Apple","Microsoft","Google","IBM"], answer:1 },
    { id:18, q:"What is the value of pi (π), rounded to two decimal places?", options:["3.12","3.14","3.16","3.18"], answer:1 },
    { id:19, q:"Which organ in the human body pumps blood?", options:["Lungs","Brain","Heart","Liver"], answer:2 },
    { id:20, q:"What does \"www\" stand for in a website address?", options:["World Wide Web","World Web Wide","Wide World Web","Web World Wide"], answer:0 },
  ];

  const TOTAL_QUESTIONS = QUESTIONS.length;
  const EXAM_DURATION_MS = 20 * 60 * 1000; // 20 minutes
  const RESULTS_KEY = "pariksha_results";
  const ACTIVE_EXAM_KEY = "pariksha_active_exam";


  let currentStudent = null;  
  let answers = {};            
  let marked = {};             
  let currentIndex = 0;
  let endTime = null;         
  let timerInterval = null;


  const screens = {
    login: document.getElementById("loginScreen"),
    instructions: document.getElementById("instructionsScreen"),
    exam: document.getElementById("examScreen"),
    result: document.getElementById("resultScreen"),
  };

  const loginForm = document.getElementById("loginForm");
  const loginError = document.getElementById("loginError");
  const welcomeText = document.getElementById("welcomeText");
  const startExamBtn = document.getElementById("startExamBtn");
  const logoutFromInstr = document.getElementById("logoutFromInstr");

  const studentNameLabel = document.getElementById("studentNameLabel");
  const timerDisplay = document.getElementById("timerDisplay");
  const timerBox = document.getElementById("timerBox");
  const qCount = document.getElementById("qCount");
  const qText = document.getElementById("qText");
  const optionsList = document.getElementById("optionsList");
  const markReviewBtn = document.getElementById("markReviewBtn");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  const clearBtn = document.getElementById("clearBtn");
  const paletteGrid = document.getElementById("paletteGrid");
  const statAttempted = document.getElementById("statAttempted");
  const statMarked = document.getElementById("statMarked");
  const submitBtn = document.getElementById("submitBtn");

  const submitModal = document.getElementById("submitModal");
  const modalAnswered = document.getElementById("modalAnswered");
  const modalUnanswered = document.getElementById("modalUnanswered");
  const modalMarked = document.getElementById("modalMarked");
  const modalCancel = document.getElementById("modalCancel");
  const modalConfirm = document.getElementById("modalConfirm");

  const toast = document.getElementById("toast");
  const toastText = document.getElementById("toastText");


  function showScreen(name){
    Object.values(screens).forEach(s => s.classList.add("hidden"));
    screens[name].classList.remove("hidden");
  }

  function showToast(msg, warn){
    toastText.textContent = msg;
    toast.classList.toggle("warn", !!warn);
    toast.classList.add("show");
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => toast.classList.remove("show"), 2200);
  }

  function formatTime(ms){
    const totalSec = Math.max(0, Math.ceil(ms / 1000));
    const m = Math.floor(totalSec / 60).toString().padStart(2, "0");
    const s = (totalSec % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  }


  function persistExamState(){
    const state = { student: currentStudent, answers, marked, currentIndex, endTime };
    try{ localStorage.setItem(ACTIVE_EXAM_KEY, JSON.stringify(state)); }
    catch(e){ console.warn("Could not save exam state", e); }
  }
  function loadExamState(){
    try{
      const raw = localStorage.getItem(ACTIVE_EXAM_KEY);
      return raw ? JSON.parse(raw) : null;
    }catch(e){ return null; }
  }
  function clearExamState(){
    try{ localStorage.removeItem(ACTIVE_EXAM_KEY); } catch(e){}
  }


  function loadResults(){
    try{
      const raw = localStorage.getItem(RESULTS_KEY);
      return raw ? JSON.parse(raw) : [];
    }catch(e){ return []; }
  }
  function saveResult(result){
    const results = loadResults();
    results.push(result);
    try{ localStorage.setItem(RESULTS_KEY, JSON.stringify(results)); }
    catch(e){ console.warn("Could not save result", e); }
    return results;
  }

  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const username = document.getElementById("username").value.trim().toLowerCase();
    const password = document.getElementById("password").value;
    const match = STUDENTS.find(s => s.username === username && s.password === password);

    if(!match){
      loginError.classList.remove("show");
      void loginError.offsetWidth;
      loginError.classList.add("show");
      return;
    }
    loginError.classList.remove("show");
    currentStudent = { username: match.username, name: match.name };
    welcomeText.textContent = `Welcome, ${match.name}! Neeche diye instructions padh kar exam shuru karein.`;
    showScreen("instructions");
  });

  logoutFromInstr.addEventListener("click", () => {
    currentStudent = null;
    loginForm.reset();
    showScreen("login");
  });

  startExamBtn.addEventListener("click", () => {
    answers = {};
    marked = {};
    currentIndex = 0;
    endTime = Date.now() + EXAM_DURATION_MS;
    persistExamState();
    beginExamUI();
  });

  function beginExamUI(){
    studentNameLabel.textContent = currentStudent.name;
    buildPalette();
    renderQuestion();
    startTimer();
    showScreen("exam");
  }

  function startTimer(){
    clearInterval(timerInterval);
    tick();
    timerInterval = setInterval(tick, 1000);
  }

  function tick(){
    const remaining = endTime - Date.now();
    if(remaining <= 0){
      timerDisplay.textContent = "00:00";
      clearInterval(timerInterval);
      autoSubmit();
      return;
    }
    timerDisplay.textContent = formatTime(remaining);
    timerBox.classList.toggle("warn", remaining <= 2 * 60 * 1000);
  }


  function renderQuestion(){
    const q = QUESTIONS[currentIndex];
    qCount.textContent = `Question ${currentIndex + 1} of ${TOTAL_QUESTIONS}`;
    qText.textContent = q.q;

    optionsList.innerHTML = q.options.map((opt, i) => `
      <button class="option ${answers[currentIndex] === i ? "selected" : ""}" data-opt="${i}">
        <span class="radio"></span>
        <span>${opt}</span>
      </button>
    `).join("");

    markReviewBtn.classList.toggle("active", !!marked[currentIndex]);
    prevBtn.disabled = currentIndex === 0;
    nextBtn.textContent = "";
    nextBtn.innerHTML = currentIndex === TOTAL_QUESTIONS - 1
      ? "Finish"
      : `Next <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>`;

    updatePalette();
    updateSubmitStats();
  }

  optionsList.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-opt]");
    if(!btn) return;
    answers[currentIndex] = Number(btn.dataset.opt);
    persistExamState();
    renderQuestion();
  });

  clearBtn.addEventListener("click", () => {
    delete answers[currentIndex];
    persistExamState();
    renderQuestion();
  });

  markReviewBtn.addEventListener("click", () => {
    marked[currentIndex] = !marked[currentIndex];
    persistExamState();
    renderQuestion();
  });

  prevBtn.addEventListener("click", () => {
    if(currentIndex > 0){ currentIndex--; persistExamState(); renderQuestion(); }
  });

  nextBtn.addEventListener("click", () => {
    if(currentIndex < TOTAL_QUESTIONS - 1){ currentIndex++; persistExamState(); renderQuestion(); }
    else openSubmitModal();
  });

  document.addEventListener("keydown", (e) => {
    if(screens.exam.classList.contains("hidden")) return;
    if(e.key === "ArrowRight") nextBtn.click();
    if(e.key === "ArrowLeft") prevBtn.click();
  });

  function buildPalette(){
    paletteGrid.innerHTML = QUESTIONS.map((_, i) => `<button class="pal-btn" data-goto="${i}">${i + 1}</button>`).join("");
  }

  function questionStatus(i){
    const isAnswered = answers[i] !== undefined;
    const isMarked = !!marked[i];
    if(isAnswered && isMarked) return "answered-marked";
    if(isMarked) return "marked";
    if(isAnswered) return "answered";
    return null; 
  }

  const visited = {};
  function updatePalette(){
    visited[currentIndex] = true;
    Array.from(paletteGrid.children).forEach((btn, i) => {
      btn.classList.remove("st-answered", "st-not-answered", "st-marked", "st-answered-marked", "current");
      const status = questionStatus(i);
      if(status) btn.classList.add(`st-${status}`);
      else if(visited[i]) btn.classList.add("st-not-answered");
      if(i === currentIndex) btn.classList.add("current");
    });
  }

  paletteGrid.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-goto]");
    if(!btn) return;
    currentIndex = Number(btn.dataset.goto);
    persistExamState();
    renderQuestion();
  });

  function updateSubmitStats(){
    const attemptedCount = Object.keys(answers).length;
    const markedCount = Object.keys(marked).filter(k => marked[k]).length;
    statAttempted.textContent = `${attemptedCount} / ${TOTAL_QUESTIONS}`;
    statMarked.textContent = markedCount;
  }


  function openSubmitModal(){
    const attemptedCount = Object.keys(answers).length;
    const markedCount = Object.keys(marked).filter(k => marked[k]).length;
    modalAnswered.textContent = attemptedCount;
    modalUnanswered.textContent = TOTAL_QUESTIONS - attemptedCount;
    modalMarked.textContent = markedCount;
    submitModal.classList.add("show");
  }
  function closeSubmitModal(){ submitModal.classList.remove("show"); }

  submitBtn.addEventListener("click", openSubmitModal);
  modalCancel.addEventListener("click", closeSubmitModal);
  modalConfirm.addEventListener("click", () => { closeSubmitModal(); finishExam(false); });

  function autoSubmit(){
    showToast("Samay khatam! Exam apne aap submit ho raha hai.", true);
    finishExam(true);
  }

  function finishExam(auto){
    clearInterval(timerInterval);

    let correct = 0, wrong = 0, attempted = 0;
    QUESTIONS.forEach((q, i) => {
      if(answers[i] === undefined) return;
      attempted++;
      if(answers[i] === q.answer) correct++;
      else wrong++;
    });
    const unattempted = TOTAL_QUESTIONS - attempted;
    const score = correct;
    const percentage = Math.round((score / TOTAL_QUESTIONS) * 1000) / 10;

    const result = {
      name: currentStudent.name,
      username: currentStudent.username,
      score, total: TOTAL_QUESTIONS,
      correct, wrong, attempted, unattempted,
      percentage,
      date: new Date().toLocaleString("en-IN", { day:"2-digit", month:"short", year:"numeric", hour:"2-digit", minute:"2-digit" }),
    };

    const allResults = saveResult(result);
    clearExamState();
    renderResult(result, allResults, auto);
  }

  function renderResult(result, allResults, auto){
    document.getElementById("resultTitle").textContent = `Well done, ${result.name}!`;
    document.getElementById("resultSub").textContent = auto
      ? "Time khatam hone par exam apne aap submit ho gaya."
      : "Aapne exam successfully submit kar diya.";

    document.getElementById("statTotal").textContent = result.total;
    document.getElementById("statAttemptedR").textContent = result.attempted;
    document.getElementById("statUnattempted").textContent = result.unattempted;
    document.getElementById("statCorrect").textContent = result.correct;
    document.getElementById("statWrong").textContent = result.wrong;
    document.getElementById("statScore").textContent = `${result.score}/${result.total}`;


    const circumference = 452.4;
    const ring = document.getElementById("pctRing");
    const offset = circumference - (result.percentage / 100) * circumference;
    document.getElementById("pctText").textContent = `${result.percentage}%`;
    requestAnimationFrame(() => { ring.style.strokeDashoffset = offset; });

    
    const sorted = allResults.slice().sort((a, b) => b.score - a.score || b.percentage - a.percentage);
    const rank = sorted.findIndex(r => r === result) + 1;
    document.getElementById("rankText").textContent = `Your Rank: #${rank} of ${allResults.length}`;
    document.getElementById("rankSub").textContent = rank === 1
      ? "Top score on this device — great job!"
      : `Based on ${allResults.length} attempt${allResults.length === 1 ? "" : "s"} stored on this device.`;

 
    const top = sorted.slice(0, 8);
    document.getElementById("historyBody").innerHTML = top.map((r, i) => `
      <tr class="${r === result ? "me" : ""}">
        <td class="rank-cell">#${i + 1}</td>
        <td>${r.name}</td>
        <td class="rank-cell">${r.score}/${r.total}</td>
        <td class="rank-cell">${r.percentage}%</td>
        <td>${r.date}</td>
      </tr>
    `).join("");

    showScreen("result");
  }

 
  document.getElementById("reattemptBtn").addEventListener("click", () => {
    answers = {}; marked = {}; currentIndex = 0;
    endTime = Date.now() + EXAM_DURATION_MS;
    persistExamState();
    beginExamUI();
  });

  document.getElementById("logoutBtn").addEventListener("click", () => {
    currentStudent = null;
    loginForm.reset();
    showScreen("login");
  });

  
  (function init(){
    const state = loadExamState();
    if(state && state.endTime > Date.now()){
      currentStudent = state.student;
      answers = state.answers || {};
      marked = state.marked || {};
      currentIndex = state.currentIndex || 0;
      endTime = state.endTime;
      buildPalette();
      studentNameLabel.textContent = currentStudent.name;
      renderQuestion();
      startTimer();
      showScreen("exam");
      showToast("Aapka pichla exam session resume ho gaya hai.");
    } else {
      if(state) clearExamState(); 
      showScreen("login");
    }
  })();

})();
