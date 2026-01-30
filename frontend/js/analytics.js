document.addEventListener("DOMContentLoaded", () => {

  const welfareChart = document.getElementById("welfareChart");
  if (!welfareChart) return; // 🔑 prevents running on wrong pages

  const voteChart = document.getElementById("voteChart");
  const votesChart = document.getElementById("votesChart");
  const fraudChart = document.getElementById("fraudChart");

  const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: { color: "#ddd" }
      }
    },
    scales: {
      x: { ticks: { color: "#aaa" } },
      y: { ticks: { color: "#aaa" } }
    }
  };

  new Chart(welfareChart, {
    type: "bar",
    data: {
      labels: ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"],
      datasets: [{
        label: "Welfare Issued",
        data: [5,8,6,10,7,12,9],
        backgroundColor: "#4caf50"
      }]
    },
    options: commonOptions
  });

  new Chart(voteChart, {
    type: "pie",
    data: {
      labels: ["Voted","Not Voted"],
      datasets: [{
        data: [65,35],
        backgroundColor: ["#2196f3","#777"]
      }]
    },
    options: { responsive:true, maintainAspectRatio:false }
  });

  new Chart(votesChart, {
    type: "line",
    data: {
      labels: ["8AM","10AM","12PM","2PM","4PM","6PM"],
      datasets: [{
        label: "Votes",
        data: [10,25,40,60,75,90],
        borderColor: "#ff9800",
        backgroundColor: "rgba(255,152,0,.25)",
        fill: true,
        tension: 0.4
      }]
    },
    options: commonOptions
  });

  new Chart(fraudChart, {
    type: "doughnut",
    data: {
      labels: ["Duplicate","Fake Aadhaar","Abuse"],
      datasets: [{
        data: [5,4,3],
        backgroundColor: ["#f44336","#ff9800","#9c27b0"]
      }]
    },
    options: { responsive:true, maintainAspectRatio:false }
  });

});
