/* ================================
   DOM READY
================================ */
document.addEventListener("DOMContentLoaded", () => {

  /* ===== THEME INIT ===== */
  const toggle = document.getElementById("themeToggle");

  if (localStorage.getItem("theme") === "dark") {
    document.documentElement.classList.add("dark");
  }

  /* ===== THEME TOGGLE ===== */
  if (toggle) {
    toggle.addEventListener("click", () => {
      document.documentElement.classList.toggle("dark");

      localStorage.setItem(
        "theme",
        document.documentElement.classList.contains("dark")
          ? "dark"
          : "light"
      );
    });
  }

  /* ===== FOOTER YEAR ===== */
  const yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  /* ===== OFFLINE STATUS HANDLING ===== */
  const status = document.getElementById("status");

  if (status && !navigator.onLine) {
    status.textContent = "Offline. Cannot verify now.";
    status.style.color = "orange";

    if (typeof addNotification === "function") {
      addNotification("⚠ Welfare verification pending (offline)");
    }
  }

  /* ===== SAMPLE NOTIFICATIONS ===== */
  if (typeof addNotification === "function") {
    addNotification("🎯 Welfare approved successfully");
    addNotification("⏳ Verification pending");
  }
});


/* ================================
   WELFARE ISSUE FUNCTION
================================ */
async function issueWelfare() {
  const rationInput = document.getElementById("ration");
  const status = document.getElementById("status");

  if (!rationInput || !status) return;

  const ration = rationInput.value.trim();

  if (!ration) {
    status.textContent = "Please enter Ration Card number";
    status.style.color = "red";
    return;
  }

  if (!navigator.onLine) {
    status.textContent = "Offline. Cannot verify now.";
    status.style.color = "orange";

    if (typeof addNotification === "function") {
      addNotification("⚠ Welfare verification pending (offline)");
    }
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

    status.textContent = data.message || "Verification completed";
    status.style.color = res.ok ? "green" : "red";

    if (res.ok && typeof addNotification === "function") {
      addNotification("✅ Welfare issued successfully");
    }

  } catch (err) {
    status.textContent = "Server not reachable";
    status.style.color = "red";

    if (typeof showToast === "function") {
      showToast("⚠ Unable to verify. Please retry.", "warning");
    }

    if (typeof showErrorBanner === "function") {
      showErrorBanner(
        "⚠ Verification service unavailable.",
        issueWelfare
      );
    }
  }
}
