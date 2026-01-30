document.addEventListener("DOMContentLoaded", () => {
  // Select DOM elements
  const citizens = document.getElementById("citizens");
  const welfare = document.getElementById("welfare");
  const votes = document.getElementById("votes");
  const frauds = document.getElementById("frauds");
  
  const welfareChart = document.getElementById("welfareChart");
  const voteChart = document.getElementById("voteChart");
  const votesChart = document.getElementById("votesChart");
  const fraudChart = document.getElementById("fraudChart");

  /* SLIDER */
  let i = 0;
  const slides = document.querySelectorAll(".slides");
  const dots = document.querySelectorAll(".dot");

  if (slides.length > 0) {
    setInterval(() => {
      slides[i].classList.remove("active");
      dots[i].classList.remove("active");
      i = (i + 1) % slides.length;
      slides[i].classList.add("active");
      dots[i].classList.add("active");
    }, 5000);
  }

  /* ANIMATED COUNTER */
  function animate(el, end) {
    if (!el) return;
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

  function setStats(c, w, v, f) {
    animate(citizens, c);
    animate(welfare, w);
    animate(votes, v);
    animate(frauds, f);
  }

  fetch("http://localhost:5000/dashboard-stats")
    .then(r => r.json())
    .then(d => setStats(d.citizens, d.welfare, d.votes, d.frauds))
    .catch(() => setStats(1250, 480, 890, 12)); // Fallback values

  /* CHARTS INITIALIZATION */
  if (welfareChart) {
    new Chart(welfareChart, {
      type: "bar",
      data: {
        labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        datasets: [{ label: 'Welfare', data: [5, 8, 6, 10, 7, 12, 9], backgroundColor: "#4caf50" }]
      }
    });
  }

  if (voteChart) {
    new Chart(voteChart, {
      type: "pie",
      data: {
        labels: ["Voted", "Not Voted"],
        datasets: [{ data: [65, 35], backgroundColor: ["#2196f3", "#777"] }]
      }
    });
  }

  if (votesChart) {
    new Chart(votesChart, {
      type: "line",
      data: {
        labels: ["8AM", "10AM", "12PM", "2PM", "4PM", "6PM"],
        datasets: [{
          label: 'Votes Timeline',
          data: [10, 25, 40, 60, 75, 90],
          borderColor: "#ff9800",
          backgroundColor: "rgba(255,152,0,.3)",
          fill: true
        }]
      }
    });
  }

  if (fraudChart) {
    new Chart(fraudChart, {
      type: "doughnut",
      data: {
        labels: ["Duplicate", "Fake Aadhaar", "Abuse"],
        datasets: [{
          data: [5, 4, 3],
          backgroundColor: ["#f44336", "#ff9800", "#9c27b0"]
        }]
      }
    });
  }
});

/* SYSTEM HEALTH UPDATES */
const serverLoad = document.getElementById("serverLoad");
const lastSync = document.getElementById("lastSync");

function updateSystemHealth() {
  if (serverLoad) serverLoad.innerText = Math.floor(Math.random() * 30 + 50) + "%";
  if (lastSync) lastSync.innerText = new Date().toLocaleTimeString();
}
setInterval(updateSystemHealth, 7000);
updateSystemHealth();

/* THEME TOGGLE */
const toggle = document.getElementById("themeToggle");
if (toggle) {
  toggle.addEventListener("click", () => {
    document.documentElement.classList.toggle("dark");
    localStorage.theme = document.documentElement.classList.contains("dark") ? "dark" : "light";
  });
}

const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* STAT CARD CLICK → OPEN CHART PAGE */
document.querySelectorAll(".stat-card.clickable").forEach(card => {
  card.addEventListener("click", () => {
    const chartType = card.dataset.chart;
    window.location.href = `chart.html?type=${chartType}`;
  });
});
