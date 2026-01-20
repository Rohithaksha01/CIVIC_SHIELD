function adminLogin() {
  const email = document.getElementById("adminEmail").value.trim();
  const password = document.getElementById("adminPassword").value.trim();
  const error = document.getElementById("error");

  error.textContent = "";

  if (!email || !password) {
    error.textContent = "All fields are required";
    return;
  }

  fetch("http://localhost:5000/api/auth/admin-login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ email, password })
  })
  .then(res => res.json())
  .then(data => {
    console.log("Server response:", data);

    // ✅ REDIRECT AFTER SUCCESSFUL ADMIN LOGIN
    if (data.success && data.role === "admin") {
      window.location.href = "dashboard.html";
    } else {
      error.textContent = data.message || "Login failed";
    }
  })
  .catch(() => {
    error.textContent = "Server error. Try again.";
  });
}
