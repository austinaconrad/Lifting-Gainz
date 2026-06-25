// ============================================================
//  IRON SQUAD — Main Application
//  Firebase v10 Modular SDK
// ============================================================

import { initializeApp }           from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword,
         signOut, onAuthStateChanged, updateProfile }
                                   from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc, addDoc, collection,
         query, orderBy, limit, getDocs, updateDoc, onSnapshot,
         serverTimestamp, where, writeBatch }
                                   from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// ── Firebase Config (edit in firebase-config.js OR here) ─
const firebaseConfig = {
  apiKey:            "AIzaSyCjSsPdNvAyyOEe7c5iPOMKbdWIbRqqmWk",
  authDomain:        "lifting-gainz.firebaseapp.com",
  databaseURL:       "https://lifting-gainz-default-rtdb.firebaseio.com",
  projectId:         "lifting-gainz",
  storageBucket:     "lifting-gainz.firebasestorage.app",
  messagingSenderId: "474597587841",
  appId:             "1:474597587841:web:c8b5fa6aaa1be0e1858680",
  measurementId:     "G-B3YK5WLEPH"
};

const app  = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db   = getFirestore(app);

// ── Wait for program.js to load ───────────────────────────
const P = () => window.PROGRAM;

// ── App State ─────────────────────────────────────────────
const STATE = {
  user:          null,
  profile:       null,
  activeView:    "dashboard",
  workoutState:  null,   // active workout session
  bwChart:       null,
  squadChart:    null,
  lbMetric:      "volume",
  lbUnsubscribe: null
};

// ═══════════════════════════════════════════════════════════
// INIT
// ═══════════════════════════════════════════════════════════
document.addEventListener("DOMContentLoaded", () => {
  initAuthUI();
  initNavigation();
  initWorkoutModal();

  // If previously logged in, pre-show the app shell instantly
  // so there's no flash of the login screen on return visits
  const wasLoggedIn = localStorage.getItem("ironsquad_authed") === "1";
  if (wasLoggedIn) {
    document.getElementById("loading-screen").classList.remove("active");
    showApp();
  }

  onAuthStateChanged(auth, async user => {
    document.getElementById("loading-screen").classList.remove("active");
    if (user) {
      STATE.user = user;
      localStorage.setItem("ironsquad_authed", "1");
      await loadProfile();
      showApp();
      renderDashboard();
    } else {
      STATE.user = null;
      STATE.profile = null;
      localStorage.removeItem("ironsquad_authed");
      showAuth();
    }
  });
});

// ═══════════════════════════════════════════════════════════
// AUTH
// ═══════════════════════════════════════════════════════════
function initAuthUI() {
  // Tab switching
  document.querySelectorAll(".auth-tab").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".auth-tab").forEach(b => b.classList.remove("active"));
      document.querySelectorAll(".auth-form").forEach(f => f.classList.remove("active"));
      btn.classList.add("active");
      document.getElementById(btn.dataset.tab === "login" ? "login-form" : "register-form")
        .classList.add("active");
    });
  });

  // Set default start date for register
  const today = new Date().toISOString().split("T")[0];
  document.getElementById("reg-startdate").value = today;

  // Login
  document.getElementById("login-form").addEventListener("submit", async e => {
    e.preventDefault();
    const email    = document.getElementById("login-email").value.trim();
    const password = document.getElementById("login-password").value;
    const errEl    = document.getElementById("login-error");
    errEl.classList.add("hidden");

    const btn = e.target.querySelector("button[type=submit]");
    btn.textContent = "Signing in…";
    btn.disabled = true;

    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch(err) {
      errEl.textContent = friendlyAuthError(err.code);
      errEl.classList.remove("hidden");
      btn.textContent = "Sign In";
      btn.disabled = false;
    }
  });

  // Register
  document.getElementById("register-form").addEventListener("submit", async e => {
    e.preventDefault();
    const name      = document.getElementById("reg-name").value.trim();
    const email     = document.getElementById("reg-email").value.trim();
    const password  = document.getElementById("reg-password").value;
    const weight    = parseFloat(document.getElementById("reg-weight").value);
    const startDate = document.getElementById("reg-startdate").value;
    const errEl     = document.getElementById("reg-error");
    errEl.classList.add("hidden");

    const btn = e.target.querySelector("button[type=submit]");
    btn.textContent = "Creating account…";
    btn.disabled = true;

    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(cred.user, { displayName: name });

      // Create user profile in Firestore
      await setDoc(doc(db, "users", cred.user.uid), {
        displayName: name,
        email,
        programStartDate: startDate,
        joinedAt: serverTimestamp(),
        startingWeight: weight
      });

      // Log first body weight
      const dateKey = startDate.replaceAll("-", "");
      await setDoc(doc(db, "users", cred.user.uid, "bodyweight", dateKey), {
        weight,
        date: startDate,
        timestamp: serverTimestamp()
      });

      // Create leaderboard entry
      await setDoc(doc(db, "leaderboard", cred.user.uid), {
        displayName: name,
        uid: cred.user.uid,
        totalVolume: 0,
        workoutsCompleted: 0,
        streak: 0,
        weeklyVolume: 0,
        startingWeight: weight,
        currentWeight: weight,
        lastWorkout: null,
        updatedAt: serverTimestamp()
      });

    } catch(err) {
      errEl.textContent = friendlyAuthError(err.code);
      errEl.classList.remove("hidden");
      btn.textContent = "Join the Squad";
      btn.disabled = false;
    }
  });

  // Logout
  document.getElementById("btn-logout").addEventListener("click", () => signOut(auth));
}

function friendlyAuthError(code) {
  const map = {
    "auth/user-not-found":    "No account found with that email.",
    "auth/wrong-password":    "Incorrect password.",
    "auth/email-already-in-use": "That email is already registered.",
    "auth/weak-password":     "Password must be at least 6 characters.",
    "auth/invalid-email":     "Please enter a valid email address.",
    "auth/invalid-credential": "Incorrect email or password."
  };
  return map[code] || "Something went wrong. Try again.";
}

// ═══════════════════════════════════════════════════════════
// PROFILE LOADING
// ═══════════════════════════════════════════════════════════
async function loadProfile() {
  const snap = await getDoc(doc(db, "users", STATE.user.uid));
  if (snap.exists()) {
    STATE.profile = snap.data();
  } else {
    // Fallback profile
    STATE.profile = {
      displayName: STATE.user.displayName || "Athlete",
      email: STATE.user.email,
      programStartDate: new Date().toISOString().split("T")[0],
      startingWeight: 0
    };
  }
}

// ═══════════════════════════════════════════════════════════
// NAVIGATION
// ═══════════════════════════════════════════════════════════
function initNavigation() {
  document.querySelectorAll(".nav-btn").forEach(btn => {
    btn.addEventListener("click", () => navigateTo(btn.dataset.view));
  });
  document.getElementById("btn-view-bw-chart")?.addEventListener("click", () => navigateTo("bodyweight"));
}

function navigateTo(viewName) {
  STATE.activeView = viewName;

  document.querySelectorAll(".view").forEach(v => v.classList.remove("active"));
  document.querySelectorAll(".nav-btn").forEach(b => b.classList.remove("active"));

  document.getElementById(`view-${viewName}`)?.classList.add("active");
  document.querySelector(`.nav-btn[data-view="${viewName}"]`)?.classList.add("active");

  // Lazy render views
  if (viewName === "dashboard")   renderDashboard();
  if (viewName === "workout")     renderWorkoutView();
  if (viewName === "bodyweight")  renderBodyweightView();
  if (viewName === "leaderboard") renderLeaderboard();
  if (viewName === "profile")     renderProfile();
}

// ═══════════════════════════════════════════════════════════
// SHOW / HIDE
// ═══════════════════════════════════════════════════════════
function showAuth() {
  document.getElementById("auth-screen").classList.add("active");
  document.getElementById("app").classList.add("hidden");
}

function showApp() {
  document.getElementById("auth-screen").classList.remove("active");
  document.getElementById("app").classList.remove("hidden");
  document.getElementById("app").classList.add("screen");
  document.getElementById("app").style.display = "flex";
}

// ═══════════════════════════════════════════════════════════
// DASHBOARD
// ═══════════════════════════════════════════════════════════
async function renderDashboard() {
  const profile = STATE.profile;
  if (!profile) return;

  const name = profile.displayName?.split(" ")[0] || "Athlete";
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  document.getElementById("greeting-text").textContent = `${greeting}, ${name}`;

  // Week badge
  const todayData = P().getTodaysWorkout(profile.programStartDate);
  const weekNum = todayData?.weekNumber || 1;
  document.getElementById("header-week-badge").textContent = `W${weekNum}`;
  document.getElementById("greeting-sub").textContent =
    `Week ${weekNum} · ${todayData?.phase?.name || "Foundation"} Phase${todayData?.deload ? " · DELOAD WEEK 🔄" : ""}`;

  // Today's workout
  renderTodaysWorkoutCard(todayData);

  // Load stats
  loadDashboardStats();

  // Body weight last entry
  loadLastBodyWeight();

  // Recent workouts
  loadRecentWorkouts();
}

function renderTodaysWorkoutCard(todayData) {
  const badge = document.getElementById("today-type-badge");
  const title = document.getElementById("today-workout-title");
  const sub   = document.getElementById("today-workout-sub");
  const btn   = document.getElementById("btn-start-workout");

  if (!todayData || todayData.schedule.restDay) {
    badge.textContent = "REST";
    title.textContent = "Recovery Day";
    sub.textContent   = "Active recovery — walk 20 min, stretch, hydrate, sleep 8hrs";
    btn.style.display = "none";
    return;
  }

  const phase = todayData.phase;
  badge.textContent = todayData.deload ? "DELOAD" : todayData.schedule.type.toUpperCase();
  title.textContent = todayData.schedule.label;
  sub.textContent   = `${phase.name} Phase · ${phase.repRange} reps · ${phase.sets} sets${todayData.deload ? " · Reduced volume" : ""}`;
  btn.style.display = "block";
  btn.onclick = () => navigateTo("workout");
}

async function loadDashboardStats() {
  try {
    const snap = await getDoc(doc(db, "leaderboard", STATE.user.uid));
    if (snap.exists()) {
      const data = snap.data();
      document.getElementById("stat-workouts").textContent = data.workoutsCompleted || 0;
      document.getElementById("stat-streak").textContent   = data.streak || 0;
      const vol = data.totalVolume || 0;
      document.getElementById("stat-volume").textContent   =
        vol > 999 ? `${(vol/1000).toFixed(1)}k` : vol;
    }
  } catch(e) { console.error(e); }
}

async function loadLastBodyWeight() {
  try {
    const q = query(
      collection(db, "users", STATE.user.uid, "bodyweight"),
      orderBy("date", "desc"),
      limit(1)
    );
    const snap = await getDocs(q);
    if (!snap.empty) {
      const data = snap.docs[0].data();
      document.getElementById("bw-last").textContent =
        `Last logged: ${data.weight} lbs on ${formatDate(data.date)}`;
    }
  } catch(e) { console.error(e); }

  // BW log button
  document.getElementById("btn-log-bw").onclick = async () => {
    const val = parseFloat(document.getElementById("bw-input").value);
    if (isNaN(val) || val < 50) return;
    await logBodyWeight(val);
    document.getElementById("bw-input").value = "";
    document.getElementById("bw-last").textContent = `Just logged: ${val} lbs`;
    loadDashboardStats();
  };
}

async function loadRecentWorkouts() {
  const container = document.getElementById("recent-workouts-list");
  try {
    const q = query(
      collection(db, "users", STATE.user.uid, "workouts"),
      orderBy("date", "desc"),
      limit(5)
    );
    const snap = await getDocs(q);

    if (snap.empty) {
      container.innerHTML = '<p class="text-muted text-center py-16">No workouts yet — start your first session!</p>';
      return;
    }

    container.innerHTML = "";
    snap.docs.forEach(d => {
      const w = d.data();
      container.appendChild(createWorkoutHistoryItem(w));
    });
  } catch(e) {
    container.innerHTML = '<p class="text-muted text-center">Could not load workouts.</p>';
  }
}

function createWorkoutHistoryItem(w) {
  const div = document.createElement("div");
  div.className = "workout-history-item";
  div.innerHTML = `
    <div class="workout-history-left">
      <div class="workout-history-name">${w.label || w.type}</div>
      <div class="workout-history-date">${formatDate(w.date)} · Week ${w.weekNumber || "?"}</div>
    </div>
    <div class="workout-history-right">
      <div class="workout-history-volume">${numberWithCommas(w.totalVolume || 0)} lbs</div>
      <div class="workout-history-sets">${w.totalSets || 0} sets</div>
    </div>
  `;
  return div;
}

// ═══════════════════════════════════════════════════════════
// WORKOUT LOGGER
// ═══════════════════════════════════════════════════════════
async function renderWorkoutView() {
  const container = document.getElementById("workout-logger-content");
  const profile   = STATE.profile;

  const todayData = P().getTodaysWorkout(profile.programStartDate);

  if (!todayData || todayData.schedule.restDay) {
    container.innerHTML = `
      <div class="workout-logger-header">
        <h2>Today is a Rest Day</h2>
        <p class="text-muted">Recovery is where the gains happen. Don't skip it.</p>
      </div>
      <div class="card mt-16">
        <h4 class="card-title">Active Recovery Options</h4>
        <ul class="protocol-list mt-8">
          <li>20–30 minute walk (Zone 2 cardio)</li>
          <li>10 minutes of static stretching</li>
          <li>Foam rolling: quads, IT band, upper back</li>
          <li>Hydrate: bodyweight × 0.6 oz of water minimum</li>
          <li>Sleep 7–9 hours tonight</li>
        </ul>
      </div>
    `;
    return;
  }

  const { schedule, phase, deload, exercises, warmup, cooldown, weekNumber } = todayData;

  // Load previous performance for all exercises
  const prevPerf = await loadPreviousPerformance(exercises.map(e => e.id));

  container.innerHTML = "";

  // Header
  const header = document.createElement("div");
  header.className = "workout-logger-header";
  header.innerHTML = `
    <h2>${schedule.label}</h2>
    <div class="workout-meta">
      <span class="workout-meta-tag">📅 Week ${weekNumber}</span>
      <span class="workout-meta-tag">🎯 ${phase.name} Phase</span>
      <span class="workout-meta-tag">📊 ${phase.repRange} reps</span>
      ${deload ? '<span class="workout-meta-tag">🔄 Deload Week</span>' : ''}
    </div>
  `;
  container.appendChild(header);

  // Deload notice
  if (deload) {
    const notice = document.createElement("div");
    notice.className = "card mb-16";
    notice.style.borderColor = "var(--blue)";
    notice.innerHTML = `
      <h4 class="card-title" style="color:var(--blue)">DELOAD WEEK</h4>
      <p class="text-muted" style="font-size:0.85rem">Cut to 2 sets per exercise. Same weights, stop 2 reps short of failure. You're supercompensating — this is part of the plan.</p>
    `;
    container.appendChild(notice);
  }

  // Warm-up accordion
  container.appendChild(createAccordion("🔥 Warm-Up Protocol", warmup.items));

  // Initialize workout state
  STATE.workoutState = {
    type: schedule.type,
    label: schedule.label,
    weekNumber,
    phase: phase.id,
    deload,
    date: new Date().toISOString().split("T")[0],
    exercises: {},
    startTime: Date.now()
  };

  // Exercise cards
  exercises.forEach((ex, idx) => {
    const phaseId = phase.id;
    const prescription = ex.prescription[phaseId];
    const setsCount = deload ? 2 : parseInt(prescription.split("×")[0]);
    const repRange  = prescription.split("×")[1];

    const card = document.createElement("div");
    card.className = "exercise-card";
    card.id = `ex-card-${ex.id}`;

    const prev = prevPerf[ex.id];
    const prevHint = prev
      ? `Last time: ${prev.weight} lbs × ${prev.reps} reps`
      : "First time — pick a challenging but comfortable weight";

    card.innerHTML = `
      <div class="exercise-card-header">
        <div>
          <div class="exercise-name">${idx + 1}. ${ex.name}</div>
          <div class="exercise-prescription">
            <span>${prescription}</span>
            <span>Rest ${ex.rest[phaseId]}</span>
            <span>${ex.tempo}</span>
          </div>
        </div>
      </div>
      <div class="exercise-tip">💡 ${ex.tip}</div>
      <div class="last-perf-hint">${prevHint}</div>
      <div class="sets-table">
        <div class="sets-header">
          <span>SET</span><span>WEIGHT (lbs)</span><span>REPS</span><span></span>
        </div>
        ${generateSetRows(ex.id, setsCount, prev)}
      </div>
    `;

    // Initialize exercise state
    STATE.workoutState.exercises[ex.id] = {
      name: ex.name,
      sets: Array(setsCount).fill(null).map(() => ({ weight: 0, reps: 0, done: false }))
    };

    container.appendChild(card);

    // Attach set events
    attachSetEvents(card, ex.id, setsCount, prev, prevPerf);
  });

  // Cooldown accordion
  container.appendChild(createAccordion("🧘 Cooldown + Mobility", cooldown.items));

  // Finish button
  const finishBar = document.createElement("div");
  finishBar.className = "finish-workout-bar";
  finishBar.innerHTML = `<button class="finish-workout-btn" id="btn-finish-workout">Finish Workout 🔥</button>`;
  container.appendChild(finishBar);

  document.getElementById("btn-finish-workout").addEventListener("click", finishWorkout);
}

function generateSetRows(exId, count, prev) {
  let html = "";
  for (let i = 1; i <= count; i++) {
    const defaultWeight = prev ? prev.weight : "";
    const defaultReps   = prev ? prev.reps : "";
    html += `
      <div class="set-row" id="set-row-${exId}-${i}">
        <span class="set-num">${i}</span>
        <input type="number" class="set-input set-weight" data-ex="${exId}" data-set="${i}"
               placeholder="0" value="${defaultWeight}" min="0" step="2.5" />
        <input type="number" class="set-input set-reps" data-ex="${exId}" data-set="${i}"
               placeholder="0" value="${defaultReps}" min="0" step="1" />
        <button class="set-check" id="set-check-${exId}-${i}" data-ex="${exId}" data-set="${i}"></button>
      </div>
    `;
  }
  return html;
}

function attachSetEvents(card, exId, setsCount, prev, prevPerf) {
  // Check buttons
  card.querySelectorAll(".set-check").forEach(btn => {
    btn.addEventListener("click", () => {
      const setIdx = parseInt(btn.dataset.set) - 1;
      const row    = document.getElementById(`set-row-${exId}-${btn.dataset.set}`);
      const wInput = row.querySelector(".set-weight");
      const rInput = row.querySelector(".set-reps");

      const weight = parseFloat(wInput.value) || 0;
      const reps   = parseInt(rInput.value)   || 0;

      const isDone = btn.classList.contains("done");

      if (!isDone) {
        btn.classList.add("done");
        row.classList.add("row-done");
        STATE.workoutState.exercises[exId].sets[setIdx] = { weight, reps, done: true };

        // Check for PR
        if (prev && weight > prev.weight) {
          if (!row.querySelector(".pr-badge")) {
            const prBadge = document.createElement("span");
            prBadge.className = "pr-badge";
            prBadge.textContent = "PR!";
            row.style.gridTemplateColumns = "32px 1fr 1fr 40px auto";
            row.appendChild(prBadge);
          }
        }
      } else {
        btn.classList.remove("done");
        row.classList.remove("row-done");
        STATE.workoutState.exercises[exId].sets[setIdx] = { weight, reps, done: false };
      }
    });
  });

  // Auto-save inputs
  card.querySelectorAll(".set-input").forEach(inp => {
    inp.addEventListener("change", () => {
      const setIdx = parseInt(inp.dataset.set) - 1;
      const row    = document.getElementById(`set-row-${exId}-${inp.dataset.set}`);
      const w = parseFloat(row.querySelector(".set-weight").value) || 0;
      const r = parseInt(row.querySelector(".set-reps").value)     || 0;
      if (STATE.workoutState?.exercises[exId]) {
        STATE.workoutState.exercises[exId].sets[setIdx].weight = w;
        STATE.workoutState.exercises[exId].sets[setIdx].reps   = r;
      }
    });
  });
}

async function finishWorkout() {
  if (!STATE.workoutState) return;

  const ws = STATE.workoutState;
  let totalVolume = 0;
  let totalSets   = 0;

  // Calculate volume
  Object.values(ws.exercises).forEach(ex => {
    ex.sets.forEach(s => {
      if (s.weight > 0 && s.reps > 0) {
        totalVolume += s.weight * s.reps;
        totalSets++;
      }
    });
  });

  const workoutDoc = {
    type: ws.type,
    label: ws.label,
    weekNumber: ws.weekNumber,
    phase: ws.phase,
    deload: ws.deload,
    date: ws.date,
    totalVolume,
    totalSets,
    exercises: ws.exercises,
    duration: Math.round((Date.now() - ws.startTime) / 60000),
    timestamp: serverTimestamp()
  };

  try {
    // Save workout
    await addDoc(collection(db, "users", STATE.user.uid, "workouts"), workoutDoc);

    // Update PRs
    await updatePRs(ws.exercises);

    // Update leaderboard
    await updateLeaderboard(totalVolume);

    // Update previous performance cache
    Object.entries(ws.exercises).forEach(([exId, exData]) => {
      const doneSets = exData.sets.filter(s => s.done && s.weight > 0 && s.reps > 0);
      if (doneSets.length > 0) {
        const best = doneSets.reduce((a, b) => (a.weight > b.weight ? a : b));
        localStorage.setItem(`perf_${STATE.user.uid}_${exId}`, JSON.stringify(best));
      }
    });

    // Show modal
    document.getElementById("modal-summary").textContent =
      `${ws.label} · Week ${ws.weekNumber} · ${ws.duration} min`;
    document.getElementById("modal-total-volume").textContent = numberWithCommas(totalVolume);
    document.getElementById("modal-total-sets").textContent   = totalSets;
    document.getElementById("workout-complete-modal").classList.remove("hidden");

    STATE.workoutState = null;

  } catch(e) {
    console.error("Error saving workout:", e);
    alert("Failed to save workout. Check your Firebase connection.");
  }
}

function initWorkoutModal() {
  document.getElementById("btn-close-modal").addEventListener("click", () => {
    document.getElementById("workout-complete-modal").classList.add("hidden");
    navigateTo("dashboard");
  });
}

// ═══════════════════════════════════════════════════════════
// PREVIOUS PERFORMANCE (cached in localStorage + Firestore)
// ═══════════════════════════════════════════════════════════
async function loadPreviousPerformance(exIds) {
  const result = {};
  for (const id of exIds) {
    const cached = localStorage.getItem(`perf_${STATE.user.uid}_${id}`);
    if (cached) {
      result[id] = JSON.parse(cached);
    }
  }

  // Also check Firestore PRs for more accurate data
  try {
    const snap = await getDoc(doc(db, "users", STATE.user.uid, "prs", "data"));
    if (snap.exists()) {
      const prs = snap.data();
      for (const id of exIds) {
        if (prs[id]) result[id] = result[id] || prs[id];
      }
    }
  } catch(e) { /* offline is fine */ }

  return result;
}

async function updatePRs(exercises) {
  const existing = {};
  try {
    const snap = await getDoc(doc(db, "users", STATE.user.uid, "prs", "data"));
    if (snap.exists()) Object.assign(existing, snap.data());
  } catch(e) {}

  const updates = {};
  Object.entries(exercises).forEach(([exId, exData]) => {
    const doneSets = exData.sets.filter(s => s.done && s.weight > 0 && s.reps > 0);
    if (doneSets.length === 0) return;
    const best = doneSets.reduce((a, b) => (a.weight > b.weight ? a : b));
    if (!existing[exId] || best.weight > existing[exId].weight) {
      updates[exId] = { ...best, date: new Date().toISOString().split("T")[0], name: exData.name };
    }
  });

  if (Object.keys(updates).length > 0) {
    await setDoc(doc(db, "users", STATE.user.uid, "prs", "data"),
      { ...existing, ...updates }, { merge: true });
  }
}

// ═══════════════════════════════════════════════════════════
// LEADERBOARD UPDATE
// ═══════════════════════════════════════════════════════════
async function updateLeaderboard(sessionVolume) {
  const lbRef = doc(db, "leaderboard", STATE.user.uid);

  try {
    const snap = await getDoc(lbRef);
    const data = snap.exists() ? snap.data() : {};

    const lastWorkout   = data.lastWorkout ? new Date(data.lastWorkout) : null;
    const today         = new Date();
    today.setHours(0,0,0,0);
    const yesterday     = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    let streak = data.streak || 0;
    if (lastWorkout) {
      lastWorkout.setHours(0,0,0,0);
      if (lastWorkout.getTime() === yesterday.getTime()) {
        streak += 1;
      } else if (lastWorkout.getTime() === today.getTime()) {
        // Already logged today, keep streak
      } else {
        streak = 1;
      }
    } else {
      streak = 1;
    }

    // Get current body weight for tracking
    let currentWeight = data.currentWeight || data.startingWeight || 0;
    try {
      const bwQ = query(
        collection(db, "users", STATE.user.uid, "bodyweight"),
        orderBy("date", "desc"), limit(1)
      );
      const bwSnap = await getDocs(bwQ);
      if (!bwSnap.empty) currentWeight = bwSnap.docs[0].data().weight;
    } catch(e) {}

    await updateDoc(lbRef, {
      displayName:       STATE.profile?.displayName || "Athlete",
      totalVolume:       (data.totalVolume || 0) + sessionVolume,
      weeklyVolume:      (data.weeklyVolume || 0) + sessionVolume,
      workoutsCompleted: (data.workoutsCompleted || 0) + 1,
      streak,
      currentWeight,
      lastWorkout:       new Date().toISOString().split("T")[0],
      updatedAt:         serverTimestamp()
    });
  } catch(e) {
    console.error("Leaderboard update failed:", e);
  }
}

// ═══════════════════════════════════════════════════════════
// BODY WEIGHT VIEW
// ═══════════════════════════════════════════════════════════
async function renderBodyweightView() {
  try {
    const q = query(
      collection(db, "users", STATE.user.uid, "bodyweight"),
      orderBy("date", "asc")
    );
    const snap = await getDocs(q);
    const entries = snap.docs.map(d => d.data());

    if (entries.length === 0) {
      document.getElementById("bw-history-list").innerHTML =
        '<p class="text-muted text-center py-16">Log your body weight on the dashboard.</p>';
      return;
    }

    // Stats
    const first   = entries[0].weight;
    const last    = entries[entries.length - 1].weight;
    const change  = (last - first).toFixed(1);
    const changeClass = parseFloat(change) > 0 ? "bw-change-pos" : "bw-change-neg";

    document.getElementById("bw-start").textContent   = `${first} lbs`;
    document.getElementById("bw-current").textContent = `${last} lbs`;
    document.getElementById("bw-change").textContent  = `${parseFloat(change) > 0 ? "+" : ""}${change} lbs`;
    document.getElementById("bw-change").className    = `stat-value ${changeClass}`;

    // Chart
    const labels = entries.map(e => formatDateShort(e.date));
    const data   = entries.map(e => e.weight);

    if (STATE.bwChart) STATE.bwChart.destroy();
    const ctx = document.getElementById("bw-chart").getContext("2d");
    STATE.bwChart = new Chart(ctx, {
      type: "line",
      data: {
        labels,
        datasets: [{
          label: "Body Weight (lbs)",
          data,
          borderColor: "#c9a84c",
          backgroundColor: "rgba(201,168,76,0.08)",
          borderWidth: 2,
          pointBackgroundColor: "#c9a84c",
          pointRadius: 4,
          tension: 0.3,
          fill: true
        }]
      },
      options: chartOptions("Body Weight (lbs)")
    });

    // History list
    const list = document.getElementById("bw-history-list");
    list.innerHTML = "";
    [...entries].reverse().forEach((e, i) => {
      const prev  = entries[entries.length - 1 - i - 1];
      const delta = prev ? (e.weight - prev.weight).toFixed(1) : null;
      const deltaStr = delta !== null
        ? `<span class="${parseFloat(delta) >= 0 ? 'bw-change-pos' : 'bw-change-neg'}">${parseFloat(delta) >= 0 ? "+" : ""}${delta}</span>`
        : "";

      const row = document.createElement("div");
      row.className = "bw-history-row";
      row.innerHTML = `
        <div>
          <div class="bw-val">${e.weight} lbs</div>
          <div class="bw-date">${formatDate(e.date)}</div>
        </div>
        <div>${deltaStr}</div>
      `;
      list.appendChild(row);
    });

  } catch(e) {
    console.error(e);
  }
}

async function logBodyWeight(weight) {
  const date    = new Date().toISOString().split("T")[0];
  const dateKey = date.replaceAll("-", "");
  await setDoc(doc(db, "users", STATE.user.uid, "bodyweight", dateKey), {
    weight,
    date,
    timestamp: serverTimestamp()
  });

  // Update leaderboard current weight
  await updateDoc(doc(db, "leaderboard", STATE.user.uid), { currentWeight: weight });
}

// ═══════════════════════════════════════════════════════════
// LEADERBOARD VIEW
// ═══════════════════════════════════════════════════════════
async function renderLeaderboard() {
  // Tab switching
  document.querySelectorAll(".lb-tab").forEach(tab => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".lb-tab").forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      STATE.lbMetric = tab.dataset.metric;
      buildLeaderboardList(STATE.lbCache || [], STATE.lbMetric);
    });
  });

  // Live listener
  if (STATE.lbUnsubscribe) STATE.lbUnsubscribe();

  const q = query(collection(db, "leaderboard"), orderBy("totalVolume", "desc"));

  STATE.lbUnsubscribe = onSnapshot(q, snap => {
    const entries = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    STATE.lbCache = entries;
    buildLeaderboardList(entries, STATE.lbMetric);
    buildSquadChart(entries);
  });
}

function buildLeaderboardList(entries, metric) {
  const container = document.getElementById("leaderboard-list");
  container.innerHTML = "";

  if (entries.length === 0) {
    container.innerHTML = '<div class="lb-loading">No squad members yet</div>';
    return;
  }

  // Sort by metric
  const sorted = [...entries].sort((a, b) => {
    if (metric === "volume")   return (b.totalVolume || 0) - (a.totalVolume || 0);
    if (metric === "workouts") return (b.workoutsCompleted || 0) - (a.workoutsCompleted || 0);
    if (metric === "streak")   return (b.streak || 0) - (a.streak || 0);
    if (metric === "bwchange") {
      const changeA = (a.currentWeight || 0) - (a.startingWeight || 0);
      const changeB = (b.currentWeight || 0) - (b.startingWeight || 0);
      return changeA - changeB; // Lower = better for weight loss, higher = better for bulk
    }
    return 0;
  });

  const metricLabels = {
    volume:   { value: e => `${numberWithCommas(e.totalVolume || 0)} lbs`, sub: e => `${e.workoutsCompleted || 0} sessions` },
    workouts: { value: e => `${e.workoutsCompleted || 0}`, sub: e => `sessions` },
    streak:   { value: e => `${e.streak || 0}`, sub: e => `day streak` },
    bwchange: { value: e => {
      const delta = ((e.currentWeight || 0) - (e.startingWeight || 0)).toFixed(1);
      return `${parseFloat(delta) >= 0 ? "+" : ""}${delta} lbs`;
    }, sub: e => `body weight change` }
  };

  const rankEmojis = ["🥇", "🥈", "🥉"];

  sorted.forEach((entry, i) => {
    const row = document.createElement("div");
    row.className = `lb-row rank-${i + 1}`;
    if (entry.uid === STATE.user?.uid || entry.id === STATE.user?.uid) {
      row.classList.add("is-me");
    }

    const initial = (entry.displayName || "?")[0].toUpperCase();
    const ml      = metricLabels[metric];

    row.innerHTML = `
      <div class="lb-rank">${i < 3 ? rankEmojis[i] : `#${i + 1}`}</div>
      <div class="lb-avatar">${initial}</div>
      <div class="lb-info">
        <div class="lb-name">${entry.displayName || "Athlete"}</div>
        <div class="lb-sub">${ml.sub(entry)}</div>
      </div>
      <div class="lb-value">${ml.value(entry)}</div>
    `;
    container.appendChild(row);
  });
}

function buildSquadChart(entries) {
  const top8 = entries
    .sort((a, b) => (b.totalVolume || 0) - (a.totalVolume || 0))
    .slice(0, 8);

  const labels = top8.map(e => e.displayName?.split(" ")[0] || "?");
  const data   = top8.map(e => e.totalVolume || 0);

  if (STATE.squadChart) STATE.squadChart.destroy();

  const ctx = document.getElementById("squad-chart").getContext("2d");
  STATE.squadChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels,
      datasets: [{
        label: "Total Volume (lbs)",
        data,
        backgroundColor: labels.map((_, i) => i === 0 ? "#c9a84c" : "rgba(201,168,76,0.3)"),
        borderColor: "#c9a84c",
        borderWidth: 1,
        borderRadius: 6
      }]
    },
    options: {
      ...chartOptions("Total Volume (lbs)"),
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: ctx => ` ${numberWithCommas(ctx.parsed.y)} lbs`
          }
        }
      }
    }
  });
}

// ═══════════════════════════════════════════════════════════
// PROFILE VIEW
// ═══════════════════════════════════════════════════════════
async function renderProfile() {
  const profile = STATE.profile;
  if (!profile) return;

  const name = profile.displayName || "Athlete";
  document.getElementById("profile-name").textContent  = name;
  document.getElementById("profile-email").textContent = profile.email || STATE.user?.email || "";
  document.getElementById("profile-avatar").textContent = name[0]?.toUpperCase() || "A";

  // Settings
  document.getElementById("settings-name").value      = name;
  document.getElementById("settings-startdate").value = profile.programStartDate || "";

  // Program overview
  const todayData = P().getTodaysWorkout(profile.programStartDate);
  const weekNum   = todayData?.weekNumber || 1;

  const overview = document.getElementById("program-overview");
  overview.innerHTML = P().PHASES.map(ph => {
    const [start, end] = ph.weeks;
    const total = end - start + 1;
    let progress = 0;
    if (weekNum > end)         progress = 100;
    else if (weekNum >= start) progress = ((weekNum - start) / total) * 100;

    return `
      <div class="phase-row">
        <div class="phase-dot ${ph.id}"></div>
        <div class="phase-info">
          <div class="phase-name">${ph.name}</div>
          <div class="phase-weeks">${ph.label} · ${ph.focus}</div>
        </div>
        <div class="phase-bar-wrap">
          <div class="phase-bar ${ph.id}" style="width:${progress}%"></div>
        </div>
      </div>
    `;
  }).join("");

  // PRs
  renderPRs();

  // Save settings
  document.getElementById("btn-save-settings").onclick = async () => {
    const newName  = document.getElementById("settings-name").value.trim();
    const newStart = document.getElementById("settings-startdate").value;

    await updateDoc(doc(db, "users", STATE.user.uid), {
      displayName: newName,
      programStartDate: newStart
    });
    await updateDoc(doc(db, "leaderboard", STATE.user.uid), { displayName: newName });
    await updateProfile(STATE.user, { displayName: newName });

    STATE.profile.displayName      = newName;
    STATE.profile.programStartDate = newStart;

    alert("Settings saved!");
    renderProfile();
    renderDashboard();
  };
}

async function renderPRs() {
  const container = document.getElementById("pr-list");
  try {
    const snap = await getDoc(doc(db, "users", STATE.user.uid, "prs", "data"));
    if (!snap.exists() || Object.keys(snap.data()).length === 0) {
      container.innerHTML = '<p class="text-muted text-center py-16">Log workouts to see your PRs</p>';
      return;
    }

    const prs = snap.data();
    container.innerHTML = "";

    Object.entries(prs)
      .sort((a, b) => (b[1].weight || 0) - (a[1].weight || 0))
      .forEach(([exId, pr]) => {
        const item = document.createElement("div");
        item.className = "pr-item";
        item.innerHTML = `
          <div>
            <div class="pr-name">${pr.name || exId}</div>
            <div class="pr-date">${formatDate(pr.date || "")}</div>
          </div>
          <div class="pr-value">${pr.weight} lbs × ${pr.reps}</div>
        `;
        container.appendChild(item);
      });
  } catch(e) {
    container.innerHTML = '<p class="text-muted text-center">Could not load PRs.</p>';
  }
}

// ═══════════════════════════════════════════════════════════
// UI HELPERS
// ═══════════════════════════════════════════════════════════
function createAccordion(title, items) {
  const wrapper = document.createElement("div");
  wrapper.className = "accordion";
  wrapper.innerHTML = `
    <div class="accordion-header">
      <h4>${title}</h4>
      <span class="accordion-icon">▼</span>
    </div>
    <div class="accordion-body">
      <ul class="protocol-list">
        ${items.map(i => `<li>${i}</li>`).join("")}
      </ul>
    </div>
  `;
  wrapper.querySelector(".accordion-header").addEventListener("click", () => {
    wrapper.classList.toggle("open");
  });
  return wrapper;
}

function chartOptions(label) {
  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#1e1e1e",
        borderColor: "#252525",
        borderWidth: 1,
        titleColor: "#c9a84c",
        bodyColor: "#f0f0f0",
        padding: 10
      }
    },
    scales: {
      x: {
        grid:   { color: "rgba(255,255,255,0.04)" },
        ticks:  { color: "#555", font: { size: 10 } }
      },
      y: {
        grid:   { color: "rgba(255,255,255,0.04)" },
        ticks:  { color: "#555", font: { size: 10 } }
      }
    }
  };
}

// ── Utility Functions ─────────────────────────────────────
function formatDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr + "T12:00:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function formatDateShort(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr + "T12:00:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function numberWithCommas(n) {
  return Math.round(n).toLocaleString();
}
