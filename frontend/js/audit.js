// ===== AUDIT LOG ENGINE =====
const AUDIT_KEY = "civic_audit_logs";

// Get logs
function getAuditLogs() {
  return JSON.parse(localStorage.getItem(AUDIT_KEY)) || [];
}

// Add log (NON-EDITABLE)
function addAuditLog(action, details = "") {
  const logs = getAuditLogs();

  const logEntry = {
    time: new Date().toISOString(),
    userRole: localStorage.getItem("userRole") || "unknown",
    page: window.location.pathname.split("/").pop(),
    action,
    details
  };

  logs.unshift(logEntry); // newest first
  localStorage.setItem(AUDIT_KEY, JSON.stringify(logs));
}
