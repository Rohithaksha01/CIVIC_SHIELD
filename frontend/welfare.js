/* ===== THEME INIT ===== */
const toggle = document.getElementById("themeToggle");

if (localStorage.theme === "dark") {
  document.documentElement.classList.add("dark");
}

/* ===== THEME TOGGLE ===== */
toggle.addEventListener("click", () => {
  document.documentElement.classList.toggle("dark");
  localStorage.theme =
    document.documentElement.classList.contains("dark")
      ? "dark"
      : "light";
});

/* ===== WELFARE LOGIC ===== */
async function issueWelfare() {
  const ration = document.getElementById("ration").value.trim();
  const status = document.getElementById("status");

  if (!ration) {
    status.textContent = "Please enter Ration Card number";
    status.style.color = "red";
    return;
  }

  status.textContent = "Verifying ration card...";
  status.style.color = "orange";

  try {
    const res = await fetch("http://localhost:5000/issue-welfare", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ ration })
    });

    const data = await res.json();

    status.textContent = data.message;
    status.style.color = res.ok ? "green" : "red";

  } catch (err) {
    status.textContent = "Server not reachable";
    status.style.color = "red";
  }
}

/* ===== FOOTER YEAR ===== */
document.getElementById("year").textContent = new Date().getFullYear();



addNotification("🎯 Welfare approved successfully");
addNotification("⏳ Verification pending");



if (!navigator.onLine) {
  status.textContent = "Offline. Cannot verify now.";
  status.style.color = "orange";
  addNotification("⚠ Welfare verification pending (offline)");
  return;
}



catch(() => {
  showToast("⚠ Unable to verify. Please retry.", "warning");
  showErrorBanner(
    "⚠ Verification service unavailable.",
    issueWelfare
  );
});
