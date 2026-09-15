let selectedRole = localStorage.getItem("cn_selected_role") || "";

function getStoredRole() {
  return localStorage.getItem("cn_selected_role") || selectedRole || "";
}

const demo = {
  patient: { id: "9876543210", abha: "12345678901234", password: "patient123", name: "Riya Sharma", blood: "B+" },
  doctor: { id: "doctor@codenova.test", password: "doctor123", name: "Dr. Meera Singh", experience: "12 years", specialization: "General Physician" },
  admin: { id: "admin@codenova.test", password: "admin123", name: "Super Admin" }
};

const state = {
  appointments: JSON.parse(localStorage.getItem("cn_appointments") || "null") || [
    { token: "A-104", patient: "Riya Sharma", reason: "Fever and weakness", status: "pending", wait: 18, blood: "B+", abha: "12345678901234" },
    { token: "A-105", patient: "Amit Verma", reason: "Diabetes follow-up", status: "approved", wait: 24, blood: "O+", abha: "98765432109876" }
  ],
  aiSummaries: JSON.parse(localStorage.getItem("cn_ai_summaries") || "[]")
};

const landingPage = document.getElementById("landingPage");
const rolePage = document.getElementById("rolePage");
const authPage = document.getElementById("authPage");
const patientDashboard = document.getElementById("patientDashboard");
const doctorDashboard = document.getElementById("doctorDashboard");
const adminDashboard = document.getElementById("adminDashboard");

function saveState() {
  localStorage.setItem("cn_appointments", JSON.stringify(state.appointments));
  localStorage.setItem("cn_ai_summaries", JSON.stringify(state.aiSummaries));
}

function hideAllPages() {
  landingPage.classList.remove("active-page");
  landingPage.style.display = "none";
  rolePage.style.display = "none";
  authPage.style.display = "none";
  patientDashboard.style.display = "none";
  doctorDashboard.style.display = "none";
  adminDashboard.style.display = "none";
}

function showLanding() {
  hideAllPages();
  landingPage.style.display = "block";
  window.scrollTo(0, 0);
}

function showRolePage() {
  hideAllPages();
  rolePage.style.display = "block";
  window.scrollTo(0, 0);
}

function openAuth(role) {
  selectedRole = role;
  localStorage.setItem("cn_selected_role", role);
  hideAllPages();
  authPage.style.display = "block";
  updateAuthContent();
  showLogin();
  window.scrollTo(0, 0);
}

function updateAuthContent() {
  const welcome = document.getElementById("authWelcome");
  const description = document.getElementById("authDescription");
  const loginLabel = document.getElementById("loginIdLabel");
  const loginInput = document.getElementById("loginId");
  const signupTab = document.getElementById("signupTab");
  const demoCredentials = document.getElementById("demoCredentials");

  document.getElementById("patientFields").classList.add("hidden");
  document.getElementById("doctorFields").classList.add("hidden");
  document.getElementById("adminFields").classList.add("hidden");

  if (selectedRole === "patient") {
    welcome.textContent = "Welcome Patient";
    description.textContent = "Login with mobile number or ABHA number.";
    loginLabel.textContent = "Mobile Number / ABHA Number";
    loginInput.placeholder = "9876543210 or 12345678901234";
    signupTab.style.display = "block";
    demoCredentials.textContent = "Patient: 9876543210 / patient123";
    document.getElementById("patientFields").classList.remove("hidden");
  }

  if (selectedRole === "doctor") {
    welcome.textContent = "Welcome Doctor";
    description.textContent = "Login with doctor email id and password.";
    loginLabel.textContent = "Doctor Email ID";
    loginInput.placeholder = "doctor@codenova.test";
    signupTab.style.display = "none";
    demoCredentials.textContent = "Doctor: doctor@codenova.test / doctor123";
    document.getElementById("doctorFields").classList.remove("hidden");
  }

  if (selectedRole === "admin") {
    welcome.textContent = "Welcome Super Admin";
    description.textContent = "Manage doctors, patients and real-time analytics.";
    loginLabel.textContent = "Super Admin Email ID";
    loginInput.placeholder = "admin@codenova.test";
    signupTab.style.display = "none";
    demoCredentials.textContent = "Admin: admin@codenova.test / admin123";
    document.getElementById("adminFields").classList.remove("hidden");
  }
}

function showLogin() {
  document.getElementById("loginForm").classList.remove("hidden");
  document.getElementById("signupForm").classList.add("hidden");
  document.getElementById("loginTab").classList.add("active-tab");
  document.getElementById("signupTab").classList.remove("active-tab");
}

function showSignup() {
  if (selectedRole !== "patient") {
    showToast("Doctor registration sirf Super Admin dashboard se hoga");
    return;
  }
  document.getElementById("loginForm").classList.add("hidden");
  document.getElementById("signupForm").classList.remove("hidden");
  document.getElementById("signupTab").classList.add("active-tab");
  document.getElementById("loginTab").classList.remove("active-tab");
}

function signupUser(event) {
  event.preventDefault();
  const name = document.getElementById("signupName").value;
  const mobile = document.getElementById("signupMobile").value;
  const abha = document.getElementById("abhaId").value;
  const blood = document.getElementById("bloodGroup").value;
  const password = document.getElementById("signupPassword").value;

  if (!/^[0-9]{10}$/.test(mobile)) return showToast("Valid 10 digit mobile number enter karo");

  localStorage.setItem("careTrackUser", JSON.stringify({ role: "patient", name, mobile, abha, blood, password }));
  showToast("Patient account created");
  setTimeout(openDashboard, 700);
}

function loginUser(event) {
  event.preventDefault();
  const loginId = document.getElementById("loginId").value.trim();
  const password = document.getElementById("loginPassword").value.trim();

  if (!loginId || !password) return showToast("Please enter all details");
  if (selectedRole === "patient" && !(/^[0-9]{10}$/.test(loginId) || /^[0-9]{14}$/.test(loginId))) return showToast("Mobile ya 14 digit ABHA number enter karo");
  if (selectedRole !== "patient" && !loginId.includes("@")) return showToast("Email id valid nahi hai");

  showToast("Login successful");
  setTimeout(openDashboard, 500);
}

function dashboardShell(role, content) {
  const title = role === "patient" ? "Patient Dashboard" : role === "doctor" ? "Doctor Dashboard" : "Super Admin Dashboard";
  const nav = role === "patient"
    ? ["Dashboard", "Appointments", "Reports", "AI Assistant", "Profile", "Permissions"]
    : role === "doctor"
    ? ["Dashboard", "Requests", "Records", "AI Summaries", "Profile"]
    : ["Dashboard", "Analytics", "Doctor Registration", "FHIR", "Profile"];

  return `
    <aside class="dashboard-sidebar">
      <div class="dash-brand"><div>+</div><span>Code Nova</span></div>
      <nav>${nav.map((n, i) => `<a class="${i === 0 ? "dash-active" : ""}">${n}</a>`).join("")}</nav>
      <button onclick="logout()" class="logout-btn">Logout</button>
    </aside>
    <main class="dashboard-main">
      <header class="dash-header">
        <div><h1>${title}</h1><p>Created by Code Nova</p></div>
        <div class="dash-profile"><div class="profile-circle">${role === "patient" ? "P" : role === "doctor" ? "DR" : "SA"}</div><span>${title}</span></div>
      </header>
      ${content}
    </main>`;
}

function stat(icon, label, value, note = "") {
  return `<div class="dash-card"><span>${icon}</span><p>${label}</p><h2>${value}</h2><small class="blue-text">${note}</small></div>`;
}

function renderPatientDashboard() {
  const stored = JSON.parse(localStorage.getItem("careTrackUser") || "null") || demo.patient;
  const current = state.appointments[0];
  patientDashboard.innerHTML = dashboardShell("patient", `
    <div class="dashboard-cards">
      ${stat("T", "Current Token", current.token, "Estimated wait " + current.wait + " min")}
      ${stat("B", "Blood Group", stored.blood || "B+", "Profile ready")}
      ${stat("A", "ABHA Record", stored.abha || demo.patient.abha, "ABDM integration ready")}
    </div>
    <section class="case-section">
      <div class="case-header"><div><h2 id="patientGreeting">Good Morning, ${stored.name}</h2><p>Book appointment, upload report and talk to AI assistant.</p></div><span class="case-status">Queue Active</span></div>
      <div class="action-grid">
        <button class="small-btn" onclick="bookAppointment()">Generate New Token</button>
        <button class="small-btn" onclick="fakeUpload()">Upload Report</button>
        <button class="small-btn" onclick="startAiTalk()">Start AI Voice Talk</button>
        <button class="small-btn alt" onclick="requestPermissions()">Mic / Camera / Storage</button>
      </div>
    </section>
    <section class="case-section two-col">
      <div>
        <h2>AI Symptom Assistant</h2>
        <p class="muted">Click button and answer: problem kya hai, kab se hai, fever/pain level, medicine history.</p>
        <textarea id="symptomText" placeholder="Example: fever 2 days se hai, weakness hai..." rows="5"></textarea>
        <button class="small-btn" onclick="forwardSummary()">Forward Summary to Doctor</button>
      </div>
      <div>
        <h2>Reports & Past Health Records</h2>
        <div class="record-row">CBC Report - Uploaded</div>
        <div class="record-row">Past Prescription - Available</div>
        <div class="record-row">FHIR Bundle - Ready</div>
      </div>
    </section>
    <section class="case-section">
      <h2>Profile Update</h2>
      <div class="profile-form">
        <input id="profileName" value="${stored.name}" placeholder="Full name" />
        <input id="profileBlood" value="${stored.blood || "B+"}" placeholder="Blood group" />
        <input id="profileAbha" value="${stored.abha || demo.patient.abha}" placeholder="ABHA number" />
        <button class="small-btn" onclick="updatePatientProfile()">Update Profile</button>
      </div>
    </section>`);
}

function renderDoctorDashboard() {
  doctorDashboard.innerHTML = dashboardShell("doctor", `
    <div class="dashboard-cards">
      ${stat("Q", "Patient Requests", state.appointments.filter(a => a.status === "pending").length, "Real requests")}
      ${stat("A", "Approved Today", state.appointments.filter(a => a.status === "approved").length, "Queue active")}
      ${stat("E", "Experience", demo.doctor.experience, demo.doctor.specialization)}
    </div>
    <section class="doctor-table">
      <div class="case-header"><div><h2>Appointment Requests</h2><p>Patient ke generated token yahan show honge.</p></div></div>
      <table><thead><tr><th>Token</th><th>Patient</th><th>Reason</th><th>Wait</th><th>Status</th><th>Action</th></tr></thead>
      <tbody>${state.appointments.map((a, i) => `<tr><td>${a.token}</td><td>${a.patient}</td><td>${a.reason}</td><td>${a.wait} min</td><td><span class="table-status ${a.status === "approved" ? "recovered" : "active"}">${a.status}</span></td><td><button class="small-btn" onclick="approveAppointment(${i})">Approve</button></td></tr>`).join("")}</tbody></table>
    </section>
    <section class="case-section">
      <h2>AI Summaries Forwarded by Patient</h2>
      <div class="list">${state.aiSummaries.length ? state.aiSummaries.map(s => `<div class="record-row"><b>${s.patient}</b><br>${s.summary}</div>`).join("") : "<p class='muted'>Abhi koi AI summary forward nahi hui.</p>"}</div>
    </section>
    <section class="case-section">
      <h2>Doctor Profile Update</h2>
      <div class="profile-form"><input value="${demo.doctor.name}" /><input value="${demo.doctor.specialization}" /><input value="${demo.doctor.experience}" /><button class="small-btn">Update Details</button></div>
    </section>`);
}

function renderAdminDashboard() {
  adminDashboard.innerHTML = dashboardShell("admin", `
    <div class="dashboard-cards">
      ${stat("P", "Total Patients", "1,248", "Real-time analytics")}
      ${stat("D", "Registered Doctors", "86", "Admin controlled")}
      ${stat("W", "Average Waiting", "21 min", "Queue intelligence")}
    </div>
    <div class="admin-info-grid">
      <section class="admin-box"><h2>System Overview</h2><div class="overview-row"><span>Pending Requests</span><strong>${state.appointments.filter(a => a.status === "pending").length}</strong></div><div class="overview-row"><span>AI Summaries</span><strong>${state.aiSummaries.length}</strong></div><div class="overview-row"><span>FHIR Exports</span><strong>19</strong></div></section>
      <section class="admin-box"><h2>Doctor Registration</h2><div class="profile-form"><input placeholder="Doctor full name" /><input placeholder="Doctor email id" /><input placeholder="Experience years" /><input placeholder="Specialization" /><button class="small-btn" onclick="showToast('Doctor account created by Super Admin')">Create Doctor</button></div></section>
    </div>
    <section class="case-section"><h2>FHIR + Supabase Integration</h2><p class="muted">Supabase keys .env me replace karo. FHIR exports schema project ke supabase/schema.sql me hai.</p><pre>{"resourceType":"Bundle","type":"collection","entry":["Patient","Appointment","Observation"]}</pre></section>
    <section class="case-section"><h2>Super Admin Profile Update</h2><div class="profile-form"><input value="${demo.admin.name}" /><input value="${demo.admin.id}" /><button class="small-btn">Update Profile</button></div></section>`);
}

function openDashboard() {
  const role = getStoredRole();
  selectedRole = role;
  if (!["patient", "doctor", "admin"].includes(role)) {
    showToast("Please select a role first");
    showRolePage();
    return;
  }
  hideAllPages();
  if (role === "patient") {
    renderPatientDashboard();
    patientDashboard.style.display = "block";
  }
  if (role === "doctor") {
    renderDoctorDashboard();
    doctorDashboard.style.display = "block";
  }
  if (role === "admin") {
    renderAdminDashboard();
    adminDashboard.style.display = "block";
  }
  window.scrollTo(0, 0);
}

function bookAppointment() {
  const next = 104 + state.appointments.length + 1;
  state.appointments.unshift({ token: "A-" + next, patient: "New Patient", reason: "New consultation request", status: "pending", wait: 12 + state.appointments.length * 5, blood: "B+", abha: "12345678901234" });
  saveState();
  showToast("New token generated and doctor dashboard par request bhej di");
  renderPatientDashboard();
}

function approveAppointment(index) {
  state.appointments[index].status = "approved";
  saveState();
  showToast("Appointment approved");
  renderDoctorDashboard();
}

function forwardSummary() {
  const text = document.getElementById("symptomText").value || "Patient ne fever, weakness aur body pain report kiya. Doctor review required.";
  state.aiSummaries.unshift({ patient: "Riya Sharma", summary: text });
  saveState();
  showToast("AI summary doctor ko forward ho gayi");
}

function startAiTalk() {
  const prompt = "AI Assistant: Aapko kya problem hai? Kab se hai? Fever, pain ya weakness hai?";
  document.getElementById("symptomText").value = prompt;
  if ("speechSynthesis" in window) speechSynthesis.speak(new SpeechSynthesisUtterance(prompt));
  showToast("AI voice question started");
}

function requestPermissions() {
  navigator.mediaDevices?.getUserMedia({ audio: true, video: true }).then(() => showToast("Mic/Camera permission granted")).catch(() => showToast("Permission demo request blocked/denied"));
}

function fakeUpload() {
  showToast("Report upload demo completed");
}

function updatePatientProfile() {
  const user = JSON.parse(localStorage.getItem("careTrackUser") || "{}");
  user.name = document.getElementById("profileName").value;
  user.blood = document.getElementById("profileBlood").value;
  user.abha = document.getElementById("profileAbha").value;
  localStorage.setItem("careTrackUser", JSON.stringify(user));
  showToast("Profile updated");
  renderPatientDashboard();
}

function logout() {
  showToast("Logged out successfully");
  setTimeout(() => {
    selectedRole = "";
    localStorage.removeItem("cn_selected_role");
    showLanding();
  }, 500);
}

function showToast(message) {
  const toast = document.getElementById("toast");
  toast.querySelector("p").textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2500);
}

window.showLanding = showLanding;
window.showRolePage = showRolePage;
window.openAuth = openAuth;
window.showLogin = showLogin;
window.showSignup = showSignup;
window.signupUser = signupUser;
window.loginUser = loginUser;
window.logout = logout;
window.bookAppointment = bookAppointment;
window.approveAppointment = approveAppointment;
window.forwardSummary = forwardSummary;
window.startAiTalk = startAiTalk;
window.requestPermissions = requestPermissions;
window.fakeUpload = fakeUpload;
window.updatePatientProfile = updatePatientProfile;

window.addEventListener("load", showLanding);
