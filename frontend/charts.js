const params = new URLSearchParams(window.location.search);
const type = params.get("type");

const ctx = document.getElementById("detailChart");
const title = document.getElementById("chartTitle");

let config = null;

switch (type) {

  case "welfare":
    title.innerText = "Welfare Distribution (Weekly)";
    config = {
      type: "bar",
      data: {
        labels: ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"],
        datasets: [{
          label: "Welfare Issued",
          data: [5,8,6,10,7,12,9],
          backgroundColor: "#4caf50"
        }]
      }
    };
    break;

  case "votes":
    title.innerText = "Voting Participation";
    config = {
      type: "pie",
      data: {
        labels: ["Voted", "Not Voted"],
        datasets: [{
          data: [65, 35],
          backgroundColor: ["#2196f3","#777"]
        }]
      }
    };
    break;

  case "fraud":
    title.innerText = "Fraud Alerts Breakdown";
    config = {
      type: "doughnut",
      data: {
        labels: ["Duplicate", "Fake Aadhaar", "Abuse"],
        datasets: [{
          data: [5,4,3],
          backgroundColor: ["#f44336","#ff9800","#9c27b0"]
        }]
      }
    };
    break;

  default:
    title.innerText = "Analytics Overview";
}

if (config) {
  new Chart(ctx, config);
}

document.getElementById("year").textContent = new Date().getFullYear();
