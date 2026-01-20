// ===== NETWORK HANDLING =====
const offlineBar = document.getElementById("offlineBar");
const lastSyncKey = "last_sync_time";

function updateOnlineStatus() {
  if (!navigator.onLine) {
    document.body.classList.add("offline");
    offlineBar.style.display = "flex";
  } else {
    document.body.classList.remove("offline");
    offlineBar.style.display = "none";

    // Update last synced time
    localStorage.setItem(lastSyncKey, new Date().toLocaleString());
  }
}

// Retry button
function retryConnection() {
  updateOnlineStatus();
  if (!navigator.onLine) {
    alert("Still offline. Please check your connection.");
  }
}

// Listeners
window.addEventListener("online", updateOnlineStatus);
window.addEventListener("offline", updateOnlineStatus);

// Initial check
updateOnlineStatus();
