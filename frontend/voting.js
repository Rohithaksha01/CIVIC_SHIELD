function castVote() {
  const voterId = document.getElementById("voterId").value;
  const candidate = document.getElementById("candidate").value;
  const status = document.getElementById("status");

  addAuditLog("VOTE_ATTEMPT", `VoterID: ${voterId}`);

  fetch("http://localhost:5000/cast-vote", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ voterId, candidate })
  })
  .then(res => res.json())
  .then(data => {
    status.innerText = data.message;
    addAuditLog("VOTE_RESULT", data.message);
  })
  .catch(() => {
    status.innerText = "Server error";
    addAuditLog("VOTE_FAILED", "Server error");
  });
}


addNotification("🗳 Vote successfully cast");
addNotification("⏳ Verification pending");



function castVote() {
  if (!navigator.onLine) {
    addNotification("⚠ Vote failed: You are offline");
    alert("You’re offline. Please try again later.");
    return;
  }

  // normal vote logic continues...
}




fetch("http://localhost:5000/cast-vote", { ... })
  .then(res => {
    if (!res.ok) throw new Error("Server error");
    return res.json();
  })
  .then(data => {
    showToast("🗳 Vote successfully cast", "success");
    hideErrorBanner();
  })
  .catch(() => {
    showToast("⚠ Server unreachable. Try again later.", "error");
    showErrorBanner(
      "⚠ Server unreachable. Try again later.",
      castVote
    );
  });
