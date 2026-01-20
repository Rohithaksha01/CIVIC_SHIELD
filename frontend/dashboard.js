document.addEventListener("DOMContentLoaded", () => {

  /* SLIDER */
  let i = 0;
  const slides = document.querySelectorAll(".slides");
  const dots = document.querySelectorAll(".dot");

  setInterval(() => {
    slides[i].classList.remove("active");
    dots[i].classList.remove("active");
    i = (i + 1) % slides.length;
    slides[i].classList.add("active");
    dots[i].classList.add("active");
  }, 5000);

  /* ANIMATED COUNTER */
  function animate(el, end) {
    let start = 0;
    const step = Math.max(1, end / 60);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) {
        el.innerText = end;
        clearInterval(timer);
      } else {
        el.innerText = Math.floor(start);
      }
    }, 50);
  }

  function setStats(c,w,v,f){
    animate(citizens,c);
    animate(welfare,w);
    animate(votes,v);
    animate(frauds,f);
  }

  fetch("http://localhost:5000/dashboard-stats")
    .then(r=>r.json())
    .then(d=>setStats(d.citizens,d.welfare,d.votes,d.frauds))
    .catch(()=>setStats(20,14,6,12));

  /* CHARTS */
  Chart.defaults.animation.duration = 1500;

  new Chart(welfareChart,{
    type:"bar",
    data:{labels:["Mon","Tue","Wed","Thu","Fri","Sat","Sun"],
    datasets:[{data:[5,8,6,10,7,12,9],backgroundColor:"#4caf50"}]}
  });

  new Chart(voteChart,{
    type:"pie",
    data:{labels:["Voted","Not Voted"],
    datasets:[{data:[65,35],backgroundColor:["#2196f3","#777"]}]}
  });

  new Chart(votesChart,{
    type:"line",
    data:{labels:["8AM","10AM","12PM","2PM","4PM","6PM"],
    datasets:[{data:[10,25,40,60,75,90],
    borderColor:"#ff9800",
    backgroundColor:"rgba(255,152,0,.3)",
    fill:true}]}
  });

  new Chart(fraudChart,{
    type:"doughnut",
    data:{labels:["Duplicate","Fake Aadhaar","Abuse"],
    datasets:[{data:[5,4,3],
    backgroundColor:["#f44336","#ff9800","#9c27b0"]}]}
  });
});

/* SYSTEM HEALTH */
function updateSystemHealth(){
  serverLoad.innerText = Math.floor(Math.random()*30+50)+"%";
  lastSync.innerText = new Date().toLocaleTimeString();
}
setInterval(updateSystemHealth,7000);
updateSystemHealth();

/* THEME TOGGLE */
const toggle = document.getElementById("themeToggle");

if (localStorage.theme === "dark") {
  document.documentElement.classList.add("dark");
}

toggle.addEventListener("click", () => {
  document.documentElement.classList.toggle("dark");
  localStorage.theme = document.documentElement.classList.contains("dark")
    ? "dark"
    : "light";
});

document.getElementById("year").textContent = new Date().getFullYear();


// ===== FRAUD DETECTION SIMULATION =====
function updateFraudIndicators() {
  const fraudItems = document.querySelectorAll(".fraud");

  fraudItems.forEach(item => {
    const level = Math.floor(Math.random() * 3);

    const dot = item.querySelector(".dot");
    const status = item.querySelector("strong");

    if (level === 0) {
      dot.className = "dot green";
      status.innerText = "Low";
    } else if (level === 1) {
      dot.className = "dot yellow";
      status.innerText = "Medium";
      addAuditLog("FRAUD_WARNING", "Medium risk detected");
    } else {
      dot.className = "dot red";
      status.innerText = "High";
      addAuditLog("FRAUD_ALERT", "High risk detected");
    }
  });
}

// Refresh every 10 seconds
setInterval(updateFraudIndicators, 10000);
updateFraudIndicators();





// ===== GLOBAL SEARCH AUTO-DETECT =====
const searchInput = document.getElementById("globalSearchInput");
const searchType = document.getElementById("searchType");

function detectSearchType(value) {
  value = value.trim();

  if (/^[A-Z]{3}\d{7}$/i.test(value)) {
    return "Voter ID";
  }

  if (/^\d{12}$/.test(value)) {
    return "Citizen ID";
  }

  if (/^[A-Z]{2}\d{6,8}$/i.test(value)) {
    return "Ration Card";
  }

  return "Unknown";
}

if (searchInput) {
  searchInput.addEventListener("input", () => {
    const type = detectSearchType(searchInput.value);
    searchType.innerText = type;

    // Visual feedback
    if (type === "Unknown") {
      searchType.style.background = "rgba(231,76,60,0.15)";
      searchType.style.color = "#e74c3c";
    } else {
      searchType.style.background = "rgba(255,153,51,0.15)";
      searchType.style.color = "var(--accent)";
    }
  });

  searchInput.addEventListener("keydown", e => {
    if (e.key === "Enter") {
      performGlobalSearch(searchInput.value);
    }
  });
}



function performGlobalSearch(value) {
  const type = detectSearchType(value);
  const role = localStorage.getItem("userRole");

  if (type === "Unknown") {
    alert("Invalid ID format");
    return;
  }

  addAuditLog("GLOBAL_SEARCH", `${type}: ${value}`);

  // Role-based routing
  if (type === "Voter ID" && role === "citizen") {
    window.location.href = "voting.html";
  } 
  else if (type === "Ration Card" && (role === "officer" || role === "admin")) {
    window.location.href = "welfare.html";
  } 
  else {
    alert("Access restricted for this search type");
  }
}


// ===== NOTIFICATIONS ENGINE =====
const NOTIFY_KEY = "civic_notifications";

function getNotifications() {
  return JSON.parse(localStorage.getItem(NOTIFY_KEY)) || [];
}

function saveNotifications(data) {
  localStorage.setItem(NOTIFY_KEY, JSON.stringify(data));
}

function addNotification(message) {
  const list = getNotifications();

  list.unshift({
    message,
    time: new Date().toLocaleTimeString(),
    read: false
  });

  saveNotifications(list);
  renderNotifications();
}

function renderNotifications() {
  const list = getNotifications();
  const panel = document.getElementById("notifyList");
  const count = document.getElementById("notifyCount");

  panel.innerHTML = "";
  let unread = 0;

  list.forEach(n => {
    if (!n.read) unread++;

    const li = document.createElement("li");
    li.className = n.read ? "" : "unread";
    li.innerHTML = `${n.message}<br><small>${n.time}</small>`;
    panel.appendChild(li);
  });

  count.innerText = unread;
  count.style.display = unread ? "inline-block" : "none";
}



const bell = document.getElementById("notifyBell");
const panel = document.getElementById("notifyPanel");

if (bell) {
  bell.addEventListener("click", () => {
    panel.style.display =
      panel.style.display === "flex" ? "none" : "flex";

    // Mark all as read
    const list = getNotifications().map(n => ({ ...n, read: true }));
    saveNotifications(list);
    renderNotifications();
  });
}

renderNotifications();




let lastRetryFn = null;

function showErrorBanner(message, retryFn = null) {
  const banner = document.getElementById("errorBanner");
  banner.style.display = "flex";
  banner.querySelector("span").innerText = message;
  lastRetryFn = retryFn;
}

function hideErrorBanner() {
  const banner = document.getElementById("errorBanner");
  banner.style.display = "none";
}

function retryLastAction() {
  if (lastRetryFn) {
    hideErrorBanner();
    lastRetryFn();
  }
}




// ===== REAL ONLINE CHECK =====
async function isReallyOnline() {
  try {
    const res = await fetch(
      "http://localhost:5000/health",
      { cache: "no-store" }
    );
    return res.ok;
  } catch {
    return false;
  }
}


// ===== DOM ELEMENTS =====
const votesEl = document.getElementById("votes");
const welfareEl = document.getElementById("welfare");
const liveIndicator = document.getElementById("liveIndicator");

// ===== INITIAL VALUES =====
let liveVotes = 1200;
let liveWelfare = 450;

// ===== LIVE INDICATOR =====
async function updateLiveIndicator() {
  const el = document.getElementById("liveIndicator");
  if (!el) return;

  // 1️⃣ Device network check
  if (!navigator.onLine) {
    el.className = "live-indicator offline";
    el.textContent = "● OFFLINE";
    return;
  }

  // 2️⃣ Backend health check
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000);

    const res = await fetch("http://localhost:5000/health", {
      cache: "no-store",
      signal: controller.signal
    });

    clearTimeout(timeout);

    if (res.ok) {
      el.className = "live-indicator live";
      el.textContent = "● LIVE";
    } else {
      throw new Error("Backend down");
    }
  } catch {
    el.className = "live-indicator offline";
    el.textContent = "● OFFLINE";
  }
}

// ===== MOCK WEBSOCKET (REAL-TIME STATS) =====
async function mockWebSocketMessage() {
  // 1️⃣ Device-level network check
  if (!navigator.onLine) return;

  // 2️⃣ Backend health check (prevents cached false positives)
  let res;
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000);

    res = await fetch("http://localhost:5000/health", {
      cache: "no-store",
      signal: controller.signal
    });

    clearTimeout(timeout);
  } catch {
    return; // backend unreachable
  }

  if (!res || !res.ok) return;

  // 3️⃣ Generate realistic incremental updates
  const voteIncrement = Math.floor(Math.random() * 5);      // 0–4
  const welfareIncrement = Math.floor(Math.random() * 3);   // 0–2

  let updated = false;

  // 4️⃣ Update vote count
  if (voteIncrement > 0 && votesEl) {
    liveVotes += voteIncrement;
    votesEl.innerText = liveVotes;
    updated = true;

    addAuditLog(
      "LIVE_VOTE_UPDATE",
      `Votes +${voteIncrement} (Total ${liveVotes})`
    );
  }

  // 5️⃣ Update welfare count
  if (welfareIncrement > 0 && welfareEl) {
    liveWelfare += welfareIncrement;
    welfareEl.innerText = liveWelfare;
    updated = true;

    addAuditLog(
      "LIVE_WELFARE_UPDATE",
      `Welfare +${welfareIncrement} (Total ${liveWelfare})`
    );
  }

  // 6️⃣ Pulse animation ONLY if data changed
  if (updated) {
    votesEl?.parentElement.classList.add("updated");
    welfareEl?.parentElement.classList.add("updated");

    setTimeout(() => {
      votesEl?.parentElement.classList.remove("updated");
      welfareEl?.parentElement.classList.remove("updated");
    }, 500);
  }
}

// ===== START SYSTEMS =====
setInterval(mockWebSocketMessage, 3000);

window.addEventListener("load", updateLiveIndicator);
window.addEventListener("online", updateLiveIndicator);
window.addEventListener("offline", updateLiveIndicator);
window.addEventListener("load", () => {
  setTimeout(updateLiveIndicator, 300);
});


document.addEventListener("visibilitychange", () => {
  if (!document.hidden) updateLiveIndicator();
});

(async () => {
  console.log("LIVE INDICATOR TEST START");

  const el = document.getElementById("liveIndicator");
  console.log("liveIndicator element:", el);

  const online = await isReallyOnline();
  console.log("Health check result:", online);

  if (el && online) {
    el.className = "live-indicator live";
    el.textContent = "● LIVE";
  }
})();



function goToOTP() {
  document.getElementById("stepAadhaar").classList.remove("active");
  document.getElementById("stepOTP").classList.add("active");
}

function goToBiometric() {
  document.getElementById("stepOTP").classList.remove("active");
  document.getElementById("stepBio").classList.add("active");
}

function finishVerification() {
  alert("✅ Verification successful");
}


document.querySelectorAll(".otp-inputs input").forEach((input, i, arr) => {
  input.addEventListener("input", () => {
    if (input.value && arr[i + 1]) arr[i + 1].focus();
  });
});


function sendOTP() {
  const aadhaar = document.getElementById("aadhaarInput").value.trim();
  const maskEl = document.getElementById("aadhaarMasked");

  if (!/^\d{12}$/.test(aadhaar)) {
    alert("Please enter a valid 12-digit Aadhaar number");
    return;
  }

  // Mask Aadhaar
  const masked = "XXXX-XXXX-" + aadhaar.slice(-4);
  maskEl.textContent = masked;
  maskEl.classList.remove("hidden");

  // Simulate OTP sent
  addAuditLog("OTP_SENT", `OTP sent to Aadhaar-linked mobile (${masked})`);

  // Move to OTP step
  document.getElementById("stepAadhaar").classList.remove("active");
  document.getElementById("stepOTP").classList.add("active");
}

function goToBiometric() {
  document.getElementById("stepOTP").classList.remove("active");
  document.getElementById("stepBio").classList.add("active");
}

function finishVerification() {
  alert("✅ Aadhaar verification completed successfully");
  addAuditLog("VERIFICATION_SUCCESS", "Multi-step verification completed");
}

document.querySelectorAll(".otp-inputs input").forEach((input, i, arr) => {
  input.addEventListener("input", () => {
    if (input.value && arr[i + 1]) arr[i + 1].focus();
  });
});
