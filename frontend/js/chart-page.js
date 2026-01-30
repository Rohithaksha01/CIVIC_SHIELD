const ctx = document.getElementById("mainChart");
const title = document.getElementById("chartTitle");

const type = new URLSearchParams(window.location.search).get("type");

if (!ctx || !type) {
  title.innerText = "Invalid Chart";
  throw new Error("Chart type missing");
}

/* COMMON OPTIONS */
const commonOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      labels: {
        color: "#aaa"
      }
    }
  },
  scales: {
    x: {
      ticks: { color: "#888" },
      grid: { display: false }
    },
    y: {
      ticks: { color: "#888" },
      grid: { color: "rgba(255,255,255,0.05)" }
    }
  }
};

let config = {};

/* WELFARE */
if (type === "welfare") {
  title.innerText = "🎯 Welfare Issued Analytics";

  config = {
    type: "bar",
    data: {
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      datasets: [{
        label: "Welfare Issued",
        data: [5, 8, 6, 10, 7, 12, 9],
        backgroundColor: "#4caf50"
      }]
    },
    options: commonOptions
  };
}

/* VOTES */
if (type === "votes") {
  title.innerText = "🗳 Votes Cast Timeline";

  config = {
    type: "line",
    data: {
      labels: ["8AM", "10AM", "12PM", "2PM", "4PM", "6PM"],
      datasets: [{
        label: "Votes",
        data: [10, 25, 40, 60, 75, 90],
        borderColor: "#2196f3",
        backgroundColor: "rgba(33,150,243,.3)",
        fill: true
      }]
    },
    options: commonOptions
  };
}

/* FRAUD */
if (type === "fraud") {
  title.innerText = "⚠ Fraud Detection Alerts";

  config = {
    type: "doughnut",
    data: {
      labels: ["Duplicate", "Fake Aadhaar", "Abuse"],
      datasets: [{
        data: [5, 4, 3],
        backgroundColor: ["#f44336", "#ff9800", "#9c27b0"],
        borderWidth: 2
      }]
    },
    options: {
      ...commonOptions,
      cutout: "50%",
      scales: {}
    }
  };
}

new Chart(ctx, config);
