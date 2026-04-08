const SESSION_KEY = "gm_dental_current_user";

function getCurrentUser() {
  try {
    return JSON.parse(sessionStorage.getItem(SESSION_KEY)) || null;
  } catch {
    return null;
  }
}

function clearCurrentUser() {
  sessionStorage.removeItem("gm_dental_current_user");
}



const currentDentistUser = getCurrentUser();

if (!currentDentistUser) {
  window.location.replace("../Landing/landing.html");
} else if (currentDentistUser.role !== "dentist") {
  window.location.replace("../Landing/landing.html");
}

// ---------------------------
// CLINIC DB
// ---------------------------
const CLINIC_DB_KEY = "gm_dental_db_v1";

function getClinicDb() {
  try {
    const raw = localStorage.getItem(CLINIC_DB_KEY);
    if (!raw) {
      const initial = {
        appointments: [],
        archivedAppointments: [],
        rescheduleRequests: [],
        notifications: {
          admin: [],
          dentist: [],
          patient: []
        }
      };
      localStorage.setItem(CLINIC_DB_KEY, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(raw);
  } catch {
    return {
      appointments: [],
      archivedAppointments: [],
      rescheduleRequests: [],
      notifications: {
        admin: [],
        dentist: [],
        patient: []
      }
    };
  }
}

function saveClinicDb(db) {
  localStorage.setItem(CLINIC_DB_KEY, JSON.stringify(db));
  localStorage.setItem("gm_dental_sync_stamp", String(Date.now()));
}

// ---------------------------
// STORAGE KEYS
// ---------------------------
const STORAGE_KEYS = {
  appointments: "appointments",
  archive: "archivedAppointments",
  dentistArchive: "archive",
  rescheduleRequests: "rescheduleRequests",
  quickNotes: "dentistQuickNotes",
  dentistProfilePhoto: "dentistProfilePhoto",
  theme: "theme",
  dentistProfile: "dentistProfile"
};

const CLINIC_SYNC_KEYS = {
  patientNotifications: "patientNotifications",
  dentistNotifications: "dentistNotifications",
  clinicSyncStamp: "clinicSyncStamp"
};

// ---------------------------
// DEFAULT DATA
// ---------------------------
const serviceCatalog = [
  {
    name: "Enhanced Infection Control",
    price: 300,
    duration: "15 mins",
    description: "Hospital-grade sterilization and room disinfection.",
    includes: ["Sterilized instruments", "Clinic-wide disinfection", "Protective equipment use"]
  },
  {
    name: "Consultation",
    price: 500,
    duration: "30 mins",
    description: "Comprehensive oral health assessment and treatment planning.",
    includes: ["Dental examination", "Oral health assessment", "Treatment planning"]
  },
  {
    name: "Oral Prophylaxis",
    price: 1000,
    duration: "45 mins",
    description: "Professional teeth cleaning and polishing.",
    includes: ["Teeth cleaning", "Plaque & tartar removal", "Polishing"]
  },
  {
    name: "Restorative Treatment",
    price: 800,
    duration: "45 mins",
    description: "Tooth-colored restorations for damaged teeth.",
    includes: ["Cavity cleaning", "Tooth filling", "Tooth restoration"]
  },
  {
    name: "Tooth Extraction",
    price: 1000,
    duration: "30-45 mins",
    description: "Safe and gentle extraction procedure.",
    includes: ["Local anesthesia", "Tooth removal", "Post-extraction care"]
  },
  {
    name: "Odontectomy",
    price: 10000,
    duration: "1-2 hours",
    description: "Surgical removal of impacted teeth.",
    includes: ["Surgical extraction", "Wisdom tooth removal", "Sutures if needed"]
  },
  {
    name: "Root Canal Treatment",
    price: 6000,
    duration: "1.5 hours",
    description: "Treatment to save infected teeth.",
    includes: ["Infection removal", "Canal cleaning", "Tooth sealing"]
  },
  {
    name: "Complete Denture",
    price: 15000,
    duration: "Multiple Visits",
    description: "Full arch denture fitting.",
    includes: ["Full denture fitting", "Custom molding", "Bite adjustment"]
  },
  {
    name: "Partial Denture (Stayplate)",
    price: 6500,
    duration: "2-3 Visits",
    description: "Removable acrylic partial denture.",
    includes: ["Partial denture creation", "Lightweight material", "Basic fitting"]
  },
  {
    name: "Partial Denture (Casted)",
    price: 12000,
    duration: "3-4 Visits",
    description: "Durable metal-based partial denture.",
    includes: ["Metal framework denture", "Precise fitting", "Durable design"]
  },
  {
    name: "Flexible Denture",
    price: 16000,
    duration: "2-3 Visits",
    description: "Premium flexible removable denture.",
    includes: ["Flexible material denture", "Comfort fit design", "Aesthetic finish"]
  },
  {
    name: "Crowns and Bridges",
    price: 6000,
    duration: "2 Visits",
    description: "Fixed restorative prosthetics.",
    includes: ["Tooth restoration", "Crown or bridge placement", "Bite alignment"]
  },
  {
    name: "Orthodontic Treatment",
    price: 60000,
    duration: "12-24 Months",
    description: "Braces-based alignment correction.",
    includes: ["Braces installation", "Alignment correction", "Monthly adjustments"]
  },
  {
    name: "Retainers",
    price: 6000,
    duration: "1 Week",
    description: "Post-braces alignment support.",
    includes: ["Custom retainer", "Teeth alignment support", "Post-braces maintenance"]
  },
  {
    name: "Mouth Guard",
    price: 6000,
    duration: "1 Week",
    description: "Custom protective oral appliance.",
    includes: ["Custom mouth guard", "Protection for teeth", "Comfort fit"]
  },
  {
    name: "Whitening",
    price: 12000,
    duration: "1 hour",
    description: "Professional bleaching treatment.",
    includes: ["Teeth bleaching", "Stain removal", "Shade enhancement"]
  },
  {
    name: "Periapical X-Ray",
    price: 500,
    duration: "10 mins",
    description: "Focused diagnostic tooth x-ray.",
    includes: ["Tooth imaging", "Root analysis", "Diagnostic results"]
  },
  {
    name: "Panoramic X-Ray",
    price: 1000,
    duration: "15 mins",
    description: "Full mouth panoramic diagnostic image.",
    includes: ["Full mouth scan", "Jaw imaging", "Comprehensive diagnosis"]
  }
];

const defaultReminders = [
  "Review pending approvals before clinic opens.",
  "Check today’s treatment notes after every completed case.",
  "Follow up patients with reschedule requests."
];


// ==============================
// 🔥 GLOBAL REALTIME SYNC ENGINE
// ==============================
const GLOBAL_SYNC_KEY = "gm_dental_global_sync";

function triggerGlobalSync() {
  localStorage.setItem(GLOBAL_SYNC_KEY, Date.now());
}

function listenGlobalSync(callback) {
  window.addEventListener("storage", (e) => {
    if (e.key === GLOBAL_SYNC_KEY) {
      if (typeof callback === "function") callback();
    }
  });
}

function lockPageHistory() {
  history.replaceState({ pageLocked: true }, "", location.href);
  history.pushState({ pageLocked: true }, "", location.href);

  window.addEventListener("popstate", () => {
    history.pushState({ pageLocked: true }, "", location.href);
  });
}
let pendingArchiveId = null;

// ---------------------------
// HELPERS
// ---------------------------
function getData(key, fallback = []) {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback;
  } catch {
    return fallback;
  }
}

function setData(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function touchClinicSync() {
  localStorage.setItem(
    CLINIC_SYNC_KEYS.clinicSyncStamp,
    JSON.stringify({
      updatedAt: new Date().toISOString(),
      stamp: Date.now()
    })
  );
}

function getAppointments() {
  const db = getClinicDb();
  return Array.isArray(db.appointments) ? db.appointments : [];
}

function saveAppointments(list) {
  const db = getClinicDb();
  db.appointments = Array.isArray(list) ? list : [];
  saveClinicDb(db);
}

function getArchive() {
  const a1 = getData(STORAGE_KEYS.archive, []);
  if (Array.isArray(a1) && a1.length) return a1;

  const a2 = getData(STORAGE_KEYS.dentistArchive, []);
  return Array.isArray(a2) ? a2 : [];
}

function saveArchive(list) {
  setData(STORAGE_KEYS.archive, list);
  setData(STORAGE_KEYS.dentistArchive, list);
}

function getRescheduleRequests() {
  const db = getClinicDb();
  const dbList = Array.isArray(db.rescheduleRequests) ? db.rescheduleRequests : [];
  const legacyList = getData(STORAGE_KEYS.rescheduleRequests, []);

  if (dbList.length) return dbList;
  return Array.isArray(legacyList) ? legacyList : [];
}

function saveRescheduleRequests(list) {
  const safeList = Array.isArray(list) ? list : [];

  const db = getClinicDb();
  db.rescheduleRequests = safeList;
  saveClinicDb(db);

  setData(STORAGE_KEYS.rescheduleRequests, safeList);

  triggerGlobalSync?.();
  touchClinicSync();
}

function getPatientNotificationsShared() {
  const list = getData(CLINIC_SYNC_KEYS.patientNotifications, []);
  return Array.isArray(list) ? list : [];
}

function savePatientNotificationsShared(list) {
  setData(CLINIC_SYNC_KEYS.patientNotifications, list);
  touchClinicSync();
}

function getDentistNotificationsShared() {
  const list = getData(CLINIC_SYNC_KEYS.dentistNotifications, []);
  return Array.isArray(list) ? list : [];
}

function saveDentistNotificationsShared(list) {
  setData(CLINIC_SYNC_KEYS.dentistNotifications, list);
  touchClinicSync();
}

function pushPatientNotification(text) {
  const list = getPatientNotificationsShared();
  list.unshift({
    id: String(Date.now()) + "-p",
    text,
    createdAt: new Date().toISOString(),
    read: false
  });
  savePatientNotificationsShared(list);
}

function pushDentistNotification(text) {
  const list = getDentistNotificationsShared();
  list.unshift({
    id: String(Date.now()) + "-d",
    text,
    createdAt: new Date().toISOString(),
    read: false
  });
  saveDentistNotificationsShared(list);
}

function clearAllDentistNotifications() {
  saveDentistNotificationsShared([]);
}

function currency(value) {
  return `₱${Number(value || 0).toLocaleString()}`;
}

function escapeHtml(text) {
  return String(text ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
function cleanDuplicateMeridiem(value = "") {
  return String(value)
    .replace(/\b(AM)\s+\1\b/gi, "AM")
    .replace(/\b(PM)\s+\1\b/gi, "PM")
    .replace(/AMAM/gi, "AM")
    .replace(/PMPM/gi, "PM")
    .replace(/\bAM\s*PM\b/gi, "PM")
    .replace(/\bPM\s*AM\b/gi, "AM")
    .replace(/\s+/g, " ")
    .trim();
}
function normalizeTimeDisplay(value = "") {
  const cleaned = cleanDuplicateMeridiem(value);
  const match = cleaned.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);

  if (!match) return cleaned;

  let hour = Number(match[1]);
  const minute = match[2];
  const meridiem = match[3].toUpperCase();

  if (hour < 1) hour = 12;
  if (hour > 12) hour = ((hour - 1) % 12) + 1;

  return `${hour}:${minute} ${meridiem}`;
}
function parseScheduleParts(schedule = "") {
  const [datePartRaw = "", timePartRaw = ""] = String(schedule).split("•").map(s => s.trim());
  const timePart = normalizeTimeDisplay(timePartRaw);

  return {
    datePart: datePartRaw,
    timePart
  };
}
function getApprovedBookedSlots(dateFilter = "") {
  return getAppointments()
    .filter((apt) => {
      if (apt.archivedForDentist === true || apt.archived === true) return false;
      if (String(apt.status || "").trim() !== "Approved") return false;

      const { datePart } = parseScheduleParts(apt.schedule);
      if (dateFilter && datePart !== dateFilter) return false;

      return true;
    })
    .sort((a, b) => {
      const aTime = parseScheduleParts(a.schedule).timePart || "";
      const bTime = parseScheduleParts(b.schedule).timePart || "";
      return aTime.localeCompare(bTime);
    });
}

function renderBookedSlots(dateFilter = "") {
  const box = document.getElementById("bookedSlotsList");
  if (!box) return;

  const slots = getApprovedBookedSlots(dateFilter);
  box.innerHTML = "";

  if (!slots.length) {
    box.innerHTML = `<div class="empty-state">No approved booked slots.</div>`;
    return;
  }

  slots.forEach((apt) => {
    const { datePart, timePart } = parseScheduleParts(apt.schedule);

    box.innerHTML += `
      <div class="booked-slot-item">
        <div class="booked-slot-time">${escapeHtml(timePart || "-")}</div>
        <div class="booked-slot-info">
          <strong>${escapeHtml(apt.patientName || apt.patient || "Unknown Patient")}</strong>
          <span>${escapeHtml(apt.service || "-")} • ${escapeHtml(datePart || "-")}</span>
        </div>
      </div>
    `;
  });
}

function openBookedSlotsModal() {
  renderBookedSlotsModal();
  document.getElementById("bookedSlotsModal")?.classList.add("active");
}

function closeBookedSlotsModal() {
  document.getElementById("bookedSlotsModal")?.classList.remove("active");
}

function renderBookedSlotsModal(dateFilter = "") {
  const box = document.getElementById("bookedSlotsModalList");
  if (!box) return;

  const slots = getApprovedBookedSlots(dateFilter);
  box.innerHTML = "";

  if (!slots.length) {
    box.innerHTML = `<div class="empty-state">No approved booked slots.</div>`;
    return;
  }

  slots.forEach((apt) => {
    const { datePart, timePart } = parseScheduleParts(apt.schedule);

    box.innerHTML += `
      <div class="booked-slot-modal-item">
        <div class="booked-slot-modal-time">${escapeHtml(timePart || "-")}</div>
        <div class="booked-slot-modal-details">
          <h6>${escapeHtml(apt.patientName || apt.patient || "Unknown Patient")}</h6>
          <p>${escapeHtml(apt.service || "-")}</p>
          <span>${escapeHtml(datePart || "-")}</span>
        </div>
        <div class="booked-slot-modal-status">
          <span class="badge approved">Approved</span>
        </div>
      </div>
    `;
  });
}
function isTodayDate(dateString) {
  if (!dateString) return false;
  const d = new Date(dateString);
  const today = new Date();
  return (
    d.getFullYear() === today.getFullYear() &&
    d.getMonth() === today.getMonth() &&
    d.getDate() === today.getDate()
  );
}

function formatLongDate(dateString) {
  if (!dateString) return "No date";
  const d = new Date(dateString);
  if (Number.isNaN(d.getTime())) return dateString;
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
}



function getClinicDb() {
  try {
    return JSON.parse(localStorage.getItem("gm_dental_db_v1")) || {
      appointments: [],
      archivedAppointments: [],
      rescheduleRequests: [],
      notifications: { admin: [], dentist: [], patient: [] }
    };
  } catch {
    return {
      appointments: [],
      archivedAppointments: [],
      rescheduleRequests: [],
      notifications: { admin: [], dentist: [], patient: [] }
    };
  }
}

function saveClinicDb(db) {
  localStorage.setItem("gm_dental_db_v1", JSON.stringify(db));
  localStorage.setItem("gm_dental_sync_stamp", String(Date.now()));
}

function triggerGlobalSync() {
  localStorage.setItem("gm_dental_global_sync", Date.now());
}

function getAppointmentsShared() {
  const db = getClinicDb();
  return Array.isArray(db.appointments) ? db.appointments : [];
}

function saveAppointmentsShared(list) {
  const db = getClinicDb();
  db.appointments = Array.isArray(list) ? list : [];
  saveClinicDb(db);
  triggerGlobalSync();
}

function getRescheduleRequestsShared() {
  const db = getClinicDb();
  return Array.isArray(db.rescheduleRequests) ? db.rescheduleRequests : [];
}

function saveRescheduleRequestsShared(list) {
  const db = getClinicDb();
  db.rescheduleRequests = Array.isArray(list) ? list : [];
  saveClinicDb(db);
  triggerGlobalSync();
}
function pushPatientNotification(text) {
  const list = getData(CLINIC_SYNC_KEYS.patientNotifications, []);
  const safeList = Array.isArray(list) ? list : [];

  safeList.unshift({
    id: String(Date.now()) + "-p",
    text,
    createdAt: new Date().toISOString(),
    read: false
  });

  setData(CLINIC_SYNC_KEYS.patientNotifications, safeList);
  triggerGlobalSync?.();
  touchClinicSync();
}

function convertDisplayTimeTo24(time12) {
  const normalized = normalizeTimeDisplay(time12);
  const match = normalized.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
  if (!match) return normalized;

  let hour = parseInt(match[1], 10);
  const minute = match[2];
  const meridiem = match[3].toUpperCase();

  if (meridiem === "PM" && hour !== 12) hour += 12;
  if (meridiem === "AM" && hour === 12) hour = 0;

  return `${String(hour).padStart(2, "0")}:${minute}`;
}

function splitSchedule(schedule = "") {
  const [dateRaw = "", timeRaw = ""] = String(schedule).split("•").map(s => s.trim());
  const timeDisplay = normalizeTimeDisplay(timeRaw);

  return {
    date: dateRaw,
    timeDisplay,
    time24: convertDisplayTimeTo24(timeDisplay)
  };
}


function findService(serviceName) {
  return serviceCatalog.find(s => s.name === serviceName);
}

function convert24To12(time24) {
  if (!time24) return "";
  const [hourStr, min] = String(time24).split(":");
  let hour = Number(hourStr);
  const suffix = hour >= 12 ? "PM" : "AM";
  hour = hour % 12 || 12;
  return `${hour}:${min} ${suffix}`;
}
function buildSchedule(dateValue = "", timeValue = "") {
  const safeDate = String(dateValue || "").trim();
  const safeTime = String(timeValue || "").includes(":") && !/[AP]M/i.test(String(timeValue || ""))
    ? convert24To12(timeValue)
    : normalizeTimeDisplay(timeValue);

  return safeDate && safeTime ? `${safeDate} • ${safeTime}` : safeDate || safeTime;
}

function normalizeAppointmentStatus(status) {
  const value = String(status || "").trim();
  if (!value) return "Pending";

  const allowed = [
    "Pending",
    "Approved",
    "Completed",
    "Cancelled",
    "Rejected",
    "Reschedule Requested",
    "Reschedule Rejected",
    "Profile Only"
  ];

  return allowed.includes(value) ? value : "Pending";
}

function statusClassName(status) {
  return normalizeAppointmentStatus(status)
    .toLowerCase()
    .replace(/\s+/g, "-");
}

// ---------------------------
// TOAST + NOTIFICATIONS
// ---------------------------
function showToast(message) {
  let toast = document.getElementById("globalToast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "globalToast";
    toast.className = "toast";
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
}

function addDentistNotification(text) {
  pushDentistNotification(text);
  renderDentistNotifications();
}

function renderDentistNotifications() {
  const listEl = document.getElementById("notifList");
  const allListEl = document.getElementById("allNotifList");
  const dotEl = document.querySelector(".notif-wrapper .dot");

  if (!listEl) return;

  const notifications = getDentistNotificationsShared();

  listEl.innerHTML = "";
  if (allListEl) allListEl.innerHTML = "";

  if (!notifications.length) {
    listEl.innerHTML = `<li class="notif-empty">No notifications yet.</li>`;
    if (allListEl) {
      allListEl.innerHTML = `<li class="notif-empty">No notifications yet.</li>`;
    }
  } else {
    const previewList = notifications.slice(0, 5);

    previewList.forEach(item => {
      const li = document.createElement("li");
      li.innerHTML = `
        <span class="notif-item-title">${escapeHtml(item.text)}</span>
        <span class="notif-item-time">${new Date(item.createdAt).toLocaleString()}</span>
      `;
      listEl.appendChild(li);
    });

    if (allListEl) {
      notifications.forEach(item => {
        const li = document.createElement("li");
        li.innerHTML = `
          <span class="notif-item-title">${escapeHtml(item.text)}</span>
          <span class="notif-item-time">${new Date(item.createdAt).toLocaleString()}</span>
        `;
        allListEl.appendChild(li);
      });
    }
  }

  const unread = notifications.some(n => !n.read);
  if (dotEl) {
    dotEl.style.display = unread ? "block" : "none";
  }
}

function toggleDentistNotifPanel(forceClose = null) {
  const panel = document.getElementById("notifPanel");
  if (!panel) return;

  if (forceClose === true) {
    panel.classList.remove("active");
    return;
  }

  panel.classList.toggle("active");

  if (panel.classList.contains("active")) {
    renderDentistNotifications();
  }
}

function markAllDentistNotificationsRead() {
  const list = getDentistNotificationsShared().map(n => ({
    ...n,
    read: true
  }));
  saveDentistNotificationsShared(list);
}

// ---------------------------
// NAVIGATION
// ---------------------------
function showSection(id) {
  document.querySelectorAll(".view").forEach(v => v.classList.remove("active"));
  document.querySelectorAll(".nav-link").forEach(l => l.classList.remove("active"));

  document.getElementById(id)?.classList.add("active");

  const map = {
    dashboard: "link-dash",
    schedule: "link-schedule",
    patients: "link-patients",
    services: "link-services",
    history: "link-history",
    archive: "link-archive",
    profile: "link-profile"
  };

  document.getElementById(map[id])?.classList.add("active");
}

// ---------------------------
// SIDEBAR
// ---------------------------
function toggleSidebar() {
  const shell = document.getElementById("appShell");
  if (!shell) return;

  if (window.innerWidth <= 992) {
    shell.classList.toggle("mobile-open");
  } else {
    shell.classList.toggle("collapsed");
  }
}

// ---------------------------
// DASHBOARD
// ---------------------------
function renderDashboard() {
  const appointments = getAppointments();
  const todayAppointments = appointments.filter(a => {
    const { datePart } = parseScheduleParts(a.schedule);
    return isTodayDate(datePart) && a.status !== "Cancelled";
  });

  const patientNames = [...new Set(
    appointments.map(a => (a.patientName || a.patient || "").trim()).filter(Boolean)
  )];

  const pendingCases = appointments.filter(a =>
    ["Pending", "Reschedule Requested"].includes(a.status)
  ).length;

  const dateDisplay = document.getElementById("currentDateDisplay");
  const heroUpcomingText = document.getElementById("heroUpcomingText");
  const statTodayCount = document.getElementById("statTodayCount");
  const statPatientCount = document.getElementById("statPatientCount");
  const statPendingCount = document.getElementById("statPendingCount");

  if (dateDisplay) {
    dateDisplay.textContent = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  }

  if (heroUpcomingText) {
    heroUpcomingText.textContent = todayAppointments.length
      ? `You have ${todayAppointments.length} appointment${todayAppointments.length > 1 ? "s" : ""} scheduled for today.`
      : "You have 0 appointments scheduled for today.";
  }

  if (statTodayCount) statTodayCount.textContent = todayAppointments.length;
  if (statPatientCount) statPatientCount.textContent = patientNames.length;
  if (statPendingCount) statPendingCount.textContent = pendingCases;

  renderDashboardTable(todayAppointments);
  renderTodayQueue(todayAppointments);
  renderReminders();
}

function renderDashboardTable(todayAppointments) {
  const body = document.getElementById("dashboardTableBody");
  if (!body) return;

  body.innerHTML = "";

  if (!todayAppointments.length) {
    body.innerHTML = `
      <tr>
        <td colspan="4">No appointments for today.</td>
      </tr>
    `;
    return;
  }

  todayAppointments.forEach(apt => {
    const { timePart } = parseScheduleParts(apt.schedule);
    body.innerHTML += `
      <tr>
        <td>${escapeHtml(apt.patientName || apt.patient || "Unknown Patient")}</td>
        <td>${escapeHtml(apt.service)}</td>
        <td>${escapeHtml(timePart || "-")}</td>
        <td><span class="badge ${statusClassName(apt.status)}">${escapeHtml(apt.status)}</span></td>
      </tr>
    `;
  });
}

function renderTodayQueue(todayAppointments) {
  const list = document.getElementById("todayQueueList");
  const title = document.getElementById("todayPanelTitle");
  const subtitle = document.getElementById("todayPanelSubtitle");

  if (!list) return;

  list.innerHTML = "";

  if (!todayAppointments.length) {
    if (title) title.textContent = "No active queue";
    if (subtitle) subtitle.textContent = "Your approved and pending appointments for today will appear here.";
    list.innerHTML = `<li>No appointments for today.</li>`;
    return;
  }

  if (title) title.textContent = `${todayAppointments.length} patient${todayAppointments.length > 1 ? "s" : ""} in today’s queue`;
  if (subtitle) subtitle.textContent = "Pending, approved, and reschedule-requested cases are listed below.";

  todayAppointments.forEach(apt => {
    const { timePart } = parseScheduleParts(apt.schedule);
    list.innerHTML += `
      <li>
        <strong>${escapeHtml(apt.patientName || apt.patient || "Unknown Patient")}</strong>
        <small>${escapeHtml(apt.service)} • ${escapeHtml(timePart || "-")} • ${escapeHtml(apt.status)}</small>
      </li>
    `;
  });
}

function renderReminders() {
  const list = document.getElementById("reminderList");
  const count = document.getElementById("reminderCount");
  if (!list) return;

  const requests = getRescheduleRequests().filter(r => r.status === "Pending");
  const reminderItems = [...defaultReminders];

  if (requests.length) {
    reminderItems.unshift(`${requests.length} reschedule request${requests.length > 1 ? "s" : ""} need review.`);
  }

  list.innerHTML = "";
  reminderItems.forEach(text => {
    const li = document.createElement("li");
    li.textContent = text;
    list.appendChild(li);
  });

  if (count) count.textContent = reminderItems.length;
}

// ---------------------------
// SERVICES
// ---------------------------
function renderServices() {
  const grid = document.getElementById("serviceGrid");
  const select = document.getElementById("a_service");
  if (!grid) return;

  grid.innerHTML = "";

  serviceCatalog.forEach(service => {
    grid.innerHTML += `
      <div class="service-card">
        <div>
          <div class="service-icon"><i class="bi bi-heart-pulse"></i></div>
          <h4>${escapeHtml(service.name)}</h4>
          <div class="price-tag">${currency(service.price)}</div>
          <p class="mt-2">${escapeHtml(service.description)}</p>
        </div>
        <div class="service-actions">
          <button class="btn-soft" onclick="openServiceModal('${encodeURIComponent(service.name)}')">Overview</button>
        </div>
      </div>
    `;
  });

  if (select) {
    select.innerHTML = `<option value="">Select Service</option>`;
    serviceCatalog.forEach(service => {
      select.innerHTML += `<option value="${escapeHtml(service.name)}">${escapeHtml(service.name)}</option>`;
    });
  }
}

function openServiceModal(encodedName) {
  const serviceName = decodeURIComponent(encodedName);
  const service = findService(serviceName);
  if (!service) return;

  const modal = document.getElementById("serviceModal");
  const title = document.getElementById("servicePanelTitle");
  const desc = document.getElementById("servicePanelDescription");
  const includes = document.getElementById("servicePanelIncludes");

  if (title) title.textContent = service.name;
  if (desc) desc.textContent = service.description;

  if (includes) {
    includes.innerHTML = "";
    service.includes.forEach(item => {
      includes.innerHTML += `<li>${escapeHtml(item)}</li>`;
    });
  }

  modal?.classList.add("active");
}

function closeServiceModal() {
  document.getElementById("serviceModal")?.classList.remove("active");
}

function outsideClick(event) {
  const content = event.currentTarget.querySelector(".service-modal-content");
  if (!content.contains(event.target)) {
    closeServiceModal();
  }
}

// ---------------------------
// PATIENT DIRECTORY
// ---------------------------
function renderPatients() {
  const activeContainer = document.getElementById("patientCards");
  const disabledContainer = document.getElementById("disabledPatientCards");

  if (!activeContainer) return;
  if (disabledContainer) disabledContainer.innerHTML = "";

  const appointments = getAppointments();
  const patientMap = new Map();

  appointments.forEach(apt => {
    const rawName = String(apt.patientName || apt.patient || "").trim();
    const safeName = rawName || "Unknown Patient";
    const safeStatus = String(apt.status || "").trim();
    const isDisabled = apt.archivedForDentist === true || apt.archivedForDentist === "true";

    const isBrokenRecord =
      safeStatus === "Profile Only" ||
      rawName === "" ||
      safeName === "Unknown Patient" ||
      safeName === "Dr. Daniel Santos";

    if (!patientMap.has(safeName)) {
      patientMap.set(safeName, {
        name: safeName,
        rawName,
        contact: apt.patientPhone || apt.contact || "—",
        address: apt.patientAddress || apt.address || "—",
        gender: apt.gender || "—",
        age: apt.age || "—",
        condition: apt.patientCondition || apt.condition || "—",
        lastVisit: apt.schedule || "—",
        totalAppointments: 0,
        isBroken: isBrokenRecord,
        isDisabled
      });
    }

    const current = patientMap.get(safeName);
    current.totalAppointments += 1;

    if (!current.lastVisit || current.lastVisit === "—") {
      current.lastVisit = apt.schedule || "—";
    }

    if (current.contact === "—" && (apt.patientPhone || apt.contact)) {
      current.contact = apt.patientPhone || apt.contact;
    }

    if (current.condition === "—" && (apt.patientCondition || apt.condition)) {
      current.condition = apt.patientCondition || apt.condition;
    }

    if (isBrokenRecord) current.isBroken = true;
    if (isDisabled) current.isDisabled = true;
  });

  const patients = Array.from(patientMap.values());

  const activePatients = patients.filter(p => !p.isDisabled);
  const disabledPatients = patients.filter(p => p.isDisabled);

  const buildPatientCard = (patient, isDisabledSection = false) => {
    const { datePart } = parseScheduleParts(patient.lastVisit);

    return `
      <div class="patient-card ${patient.isBroken ? "broken-patient-card" : ""} ${isDisabledSection ? "disabled-patient-card" : ""}">
        <div class="patient-card-header">
          <div class="d-flex align-items-center gap-3">
            <div class="patient-avatar"><i class="bi bi-person"></i></div>
            <div>
              <h5>${escapeHtml(patient.name)}</h5>
              <div class="patient-meta">${patient.totalAppointments} appointment(s)</div>
            </div>
          </div>
          <span class="badge ${isDisabledSection ? "cancelled" : patient.isBroken ? "rejected" : "upcoming"}">
            ${isDisabledSection ? "Disabled" : patient.isBroken ? "Broken Record" : "Active"}
          </span>
        </div>

        <div class="patient-details">
          <div class="patient-detail-row"><span>Contact</span><strong>${escapeHtml(patient.contact)}</strong></div>
          <div class="patient-detail-row"><span>Condition</span><strong>${escapeHtml(patient.condition)}</strong></div>
          <div class="patient-detail-row"><span>Last Visit</span><strong>${escapeHtml(datePart || "—")}</strong></div>
        </div>

        <div class="patient-card-actions mt-3 d-flex gap-2 flex-wrap">
          ${
            patient.isBroken
              ? `<button class="action-chip danger" onclick="deleteBrokenPatient('${encodeURIComponent(patient.name)}')">Delete Broken Patient</button>`
              : isDisabledSection
                ? `<button class="action-chip success" onclick="restoreDisabledPatient('${encodeURIComponent(patient.name)}')">Restore</button>`
                : `<button class="action-chip warn" onclick="disablePatientRecord('${encodeURIComponent(patient.name)}')">Disable</button>`
          }
        </div>
      </div>
    `;
  };

  activeContainer.innerHTML = activePatients.length
    ? activePatients.map(patient => buildPatientCard(patient, false)).join("")
    : `<div class="settings-card">No active patients.</div>`;

  if (disabledContainer) {
    disabledContainer.innerHTML = disabledPatients.length
      ? disabledPatients.map(patient => buildPatientCard(patient, true)).join("")
      : `<div class="settings-card">No disabled patients.</div>`;
  }
}

function deleteBrokenPatient(encodedName) {
  const patientName = decodeURIComponent(encodedName);
  let appointments = getAppointments();

  const beforeCount = appointments.length;

  appointments = appointments.filter(item => {
    const rawName = String(item.patientName || item.patient || "").trim();
    const safeName = rawName || "Unknown Patient";
    const safeStatus = String(item.status || "").trim();

    const isBrokenRecord =
      safeStatus === "Profile Only" ||
      rawName === "" ||
      safeName === "Unknown Patient" ||
      safeName === "Dr. Daniel Santos";

    if (safeName === patientName && isBrokenRecord) {
      return false;
    }

    return true;
  });

  const removedCount = beforeCount - appointments.length;
  saveAppointments(appointments);

  showToast(removedCount ? "Broken patient record deleted." : "No broken records found.");
  refreshDentistUI();
}

function disablePatientRecord(encodedName) {
  const patientName = decodeURIComponent(encodedName);
  let appointments = getAppointments();
  let updated = false;

  appointments = appointments.map(item => {
    const safeName = String(item.patientName || item.patient || "").trim() || "Unknown Patient";

    if (safeName === patientName) {
      updated = true;
      return {
        ...item,
        archivedForDentist: true,
        updatedAt: new Date().toISOString()
      };
    }

    return item;
  });

  saveAppointments(appointments);
  showToast(updated ? `${patientName} disabled.` : "Patient not found.");
  refreshDentistUI();
}

function restoreDisabledPatient(encodedName) {
  const patientName = decodeURIComponent(encodedName);
  let appointments = getAppointments();
  let updated = false;

  appointments = appointments.map(item => {
    const safeName = String(item.patientName || item.patient || "").trim() || "Unknown Patient";

    if (safeName === patientName) {
      updated = true;
      return {
        ...item,
        archivedForDentist: false,
        updatedAt: new Date().toISOString()
      };
    }

    return item;
  });

  saveAppointments(appointments);
  showToast(updated ? `${patientName} restored.` : "Patient not found.");
  refreshDentistUI();
}

function disablePatientRecord(encodedName) {
  const patientName = decodeURIComponent(encodedName);
  let appointments = getAppointments();

  let updated = false;

  appointments = appointments.map(item => {
    const safeName = String(item.patientName || item.patient || "").trim() || "Unknown Patient";

    if (safeName === patientName) {
      updated = true;
      return {
        ...item,
        archivedForDentist: true,
        updatedAt: new Date().toISOString()
      };
    }

    return item;
  });

  saveAppointments(appointments);

  showToast(updated ? `${patientName} disabled.` : `Patient not found.`);
  refreshDentistUI();
}

// ---------------------------
// SCHEDULE
// ---------------------------
function renderScheduleTable() {
  const body = document.getElementById("scheduleTableBody");
  if (!body) return;

  const searchValue = (document.getElementById("scheduleSearch")?.value || "")
    .trim()
    .toLowerCase();

  const statusValue = document.getElementById("statusFilter")?.value || "All";
  const appointments = getAppointments();

  const visibleAppointments = appointments.filter(item => {
    const safeStatus = String(item.status || "Pending").trim() || "Pending";
    const patientName = String(item.patientName || item.patient || "").trim();

    return (
      safeStatus !== "Reschedule Requested" &&
      safeStatus !== "Rejected" &&
      safeStatus !== "Completed" &&
      safeStatus !== "Profile Only" &&
      patientName !== "" &&
      item.archivedForDentist !== true &&
      item.archivedForDentist !== "true"
    );
  });

  const filtered = visibleAppointments.filter(item => {
    const patientName = String(item.patientName || item.patient || "Unknown Patient");
    const safeStatus = String(item.status || "Pending").trim() || "Pending";
    const haystack = `${patientName} ${item.service || ""}`.toLowerCase();

    const textMatch = !searchValue || haystack.includes(searchValue);
    const statusMatch = statusValue === "All" || safeStatus === statusValue;

    return textMatch && statusMatch;
  });

  body.innerHTML = "";

  if (!filtered.length) {
    body.innerHTML = `
      <tr>
        <td colspan="6">No matching records found.</td>
      </tr>
    `;
    return;
  }

  filtered.forEach(item => {
    const { datePart, timePart } = parseScheduleParts(item.schedule);
    const safeStatus = String(item.status || "Pending").trim() || "Pending";
    const safeStatusClass = statusClassName(safeStatus);
    const conflictWarning = safeStatus === "Pending" && hasPendingConflict(item);

    body.innerHTML += `
      <tr>
        <td>${escapeHtml(item.patientName || item.patient || "Unknown Patient")}</td>
        <td>${escapeHtml(item.service || "-")}</td>
        <td>${escapeHtml(datePart || "-")}</td>
        <td>${escapeHtml(timePart || "-")}</td>
        <td>
          <span class="badge ${safeStatusClass}">
            ${escapeHtml(safeStatus)}
          </span>
          ${conflictWarning ? `<div class="small text-danger mt-1">⚠ Slot already occupied</div>` : ``}
        </td>
        <td>${buildDentistAppointmentActions(item)}</td>
      </tr>
    `;
  });
}

function renderRescheduleRequests() {
  const body = document.getElementById("rescheduleTableBody");
  const badge = document.getElementById("rescheduleRequestCount");
  if (!body) return;

  const requests = getRescheduleRequests().filter(req => {
    return String(req.status || "Pending").trim() === "Pending";
  });

  body.innerHTML = "";

  if (badge) {
    badge.textContent = requests.length;
  }

  if (!requests.length) {
    body.innerHTML = `
      <tr>
        <td colspan="5">No pending reschedule requests.</td>
      </tr>
    `;
    return;
  }

  requests.forEach(req => {
    body.innerHTML += `
      <tr>
        <td>${escapeHtml(req.patientName || "Unknown Patient")}</td>
        <td>${escapeHtml(req.service || "-")}</td>
        <td>
          <div class="d-flex flex-column">
            <small style="color:var(--text-muted);">Current</small>
            <strong>${escapeHtml(req.previousSchedule || req.before || "-")}</strong>
          </div>
        </td>
        <td>
          <div class="d-flex flex-column">
            <small style="color:var(--text-muted);">Requested</small>
            <strong style="color:#22c55e;">${escapeHtml(req.requestedSchedule || "-")}</strong>
            <small style="color:var(--text-muted); margin-top:6px;">
              ${escapeHtml(req.reason || "No reason provided")}
            </small>
          </div>
        </td>
        <td>
          <div class="action-buttons">
            <button class="action-chip success" onclick="approveRescheduleRequest('${req.id}')">
              Approve
            </button>

            <button class="action-chip danger" onclick="rejectRescheduleRequest('${req.id}')">
              Reject
            </button>
          </div>
        </td>
      </tr>
    `;
  });
}

function filterSchedule(status) {
  const statusFilter = document.getElementById("statusFilter");
  if (statusFilter) {
    statusFilter.value = status;
  }
  showSection("schedule");
  renderScheduleTable();
}

// ==============================
// APPOINTMENT FLOW HELPERS
// ==============================
function normalizeAppointmentFinancials(apt = {}) {
  const price = Number(apt.price || 0);
  const downPayment = Number(apt.downPayment || 0);
  const amountPaidOnline = Number(apt.amountPaidOnline || 0);
  const amountPaidInClinic = Number(apt.amountPaidInClinic || 0);
  const totalCollected = Number(
    apt.totalCollected != null
      ? apt.totalCollected
      : amountPaidOnline + amountPaidInClinic
  );

  const requiresDownPayment =
    apt.requiresDownPayment != null
      ? !!apt.requiresDownPayment
      : price >= 5000;

  const minimumDownPayment =
    Number(apt.minimumDownPayment || 0) > 0
      ? Number(apt.minimumDownPayment)
      : (requiresDownPayment ? Math.min(price, 1000) : 0);

  let paymentStatus = apt.paymentStatus || "Unpaid";
  if (totalCollected <= 0) paymentStatus = "Unpaid";
  else if (totalCollected >= price) paymentStatus = "Paid";
  else paymentStatus = "Partial";

  return {
    ...apt,
    price,
    paid: totalCollected >= price,
    requiresDownPayment,
    minimumDownPayment,
    invoiceUnlocked: !!apt.invoiceUnlocked,
    downPayment,
    amountPaidOnline,
    amountPaidInClinic,
    totalCollected,
    remainingBalance: Math.max(0, price - totalCollected),
    paymentStatus,
    revenueCountedOnline: Number(apt.revenueCountedOnline || 0),
    revenueCountedClinic: Number(apt.revenueCountedClinic || 0)
  };
}

function getAppointments() {
  const db = getClinicDb();
  let clinicList = Array.isArray(db.appointments) ? db.appointments : [];

  // Fallback from old storage key if clinic DB is still empty
  if (!clinicList.length) {
    const legacyList = getData(STORAGE_KEYS.appointments, []);
    if (Array.isArray(legacyList) && legacyList.length) {
      clinicList = legacyList.map(item => ({
        ...item,
        patientName: item.patientName || item.patient || "Unknown Patient",
        patient: item.patientName || item.patient || "Unknown Patient",
        updatedAt: item.updatedAt || new Date().toISOString()
      }));

      db.appointments = clinicList;
      saveClinicDb(db);
    }
  }

  return clinicList.map(normalizeAppointmentFinancials);
}
function saveAppointments(list) {
  const normalized = (Array.isArray(list) ? list : []).map(normalizeAppointmentFinancials);

  const db = getClinicDb();
  db.appointments = normalized;
  saveClinicDb(db);

  // keep old key in sync too, so older patient/admin logic still sees the same data
  setData(STORAGE_KEYS.appointments, normalized);

  triggerGlobalSync?.();
  touchClinicSync();
}
function migrateLegacyAppointmentsToClinicDb() {
  const db = getClinicDb();
  const clinicList = Array.isArray(db.appointments) ? db.appointments : [];
  const legacyList = getData(STORAGE_KEYS.appointments, []);

  if (!clinicList.length && Array.isArray(legacyList) && legacyList.length) {
    const migrated = legacyList.map(item => ({
      ...item,
      patientName: item.patientName || item.patient || "Unknown Patient",
      patient: item.patientName || item.patient || "Unknown Patient",
      updatedAt: item.updatedAt || new Date().toISOString()
    }));

    db.appointments = migrated.map(normalizeAppointmentFinancials);
    saveClinicDb(db);
    setData(STORAGE_KEYS.appointments, db.appointments);
  }
}
function updateDentistAppointment(id, updater) {
  const list = getAppointments();
  const index = list.findIndex(a => String(a.id) === String(id));
  if (index === -1) return null;

  const current = normalizeAppointmentFinancials(list[index]);
  const updatedRaw =
    typeof updater === "function" ? updater(current) : { ...current, ...updater };

  list[index] = normalizeAppointmentFinancials({
    ...current,
    ...updatedRaw,
    updatedAt: new Date().toISOString()
  });

  saveAppointments(list);
  return list[index];
}

function canArchiveStatus(status) {
  return ["Rejected", "Cancelled", "Completed"].includes(String(status || "").trim());
}

function normalizeDateValue(apt = {}) {
  if (apt.date) return String(apt.date).trim();

  const { datePart } = parseScheduleParts(apt.schedule || "");
  return String(datePart || "").trim();
}

function normalizeTimeValue(apt = {}) {
  if (apt.time) return String(apt.time).trim().toUpperCase();

  const { timePart } = parseScheduleParts(apt.schedule || "");
  return String(timePart || "").trim().toUpperCase();
}

function normalizeDentistValue(apt = {}) {
  return String(apt.dentist || "Dr. Daniel Santos").trim().toLowerCase();
}

function buildSlotKey(apt = {}) {
  const dentist = normalizeDentistValue(apt);
  const date = normalizeDateValue(apt);
  const time = normalizeTimeValue(apt);

  return `${dentist}__${date}__${time}`;
}
function hasAppointmentConflict(targetAppointment, options = {}) {
  const {
    excludeId = null,
    includePending = false,
    includeRescheduleRequested = false
  } = options;

  const appointments = getAppointments();
  const targetKey = buildSlotKey(targetAppointment);

  return appointments.some((apt) => {
    if (excludeId && String(apt.id) === String(excludeId)) return false;
    if (apt.archivedForDentist === true || apt.archived === true) return false;

    const aptKey = buildSlotKey(apt);
    if (aptKey !== targetKey) return false;

    const status = String(apt.status || "").trim();

    if (status === "Approved") return true;
    if (includePending && status === "Pending") return true;
    if (includeRescheduleRequested && status === "Reschedule Requested") return true;

    return false;
  });
}

function tryApproveAppointmentSlot(appointmentId, nextSchedule = null) {
  const appointments = getAppointments();
  const index = appointments.findIndex(a => String(a.id) === String(appointmentId));

  if (index === -1) {
    return {
      ok: false,
      reason: "Appointment not found."
    };
  }

  const current = normalizeAppointmentFinancials(appointments[index]);

  let candidate = {
    ...current,
    status: "Approved"
  };

  if (nextSchedule) {
    const { datePart, timePart } = parseScheduleParts(nextSchedule);

    candidate = {
      ...candidate,
      schedule: nextSchedule,
      date: datePart || current.date || "",
      time: timePart || current.time || ""
    };
  }

  candidate = normalizeAppointmentFinancials(candidate);

  const conflict = hasAppointmentConflict(candidate, {
    excludeId: candidate.id
  });

  if (conflict) {
    return {
      ok: false,
      reason: "This time slot is already occupied by another approved appointment."
    };
  }

  appointments[index] = {
    ...candidate,
    status: "Approved",
    invoiceUnlocked: true,
    updatedAt: new Date().toISOString()
  };

  saveAppointments(appointments);

  return {
    ok: true,
    appointment: appointments[index]
  };
}

function repairApprovedScheduleConflicts() {
  const appointments = getAppointments();
  const seen = new Set();
  let changed = false;

  const fixed = appointments.map((apt) => {
    const status = String(apt.status || "").trim();
    if (status !== "Approved") return apt;

    const key = buildSlotKey(apt);

    if (seen.has(key)) {
      changed = true;
      return {
        ...apt,
        status: "Pending",
        updatedAt: new Date().toISOString()
      };
    }

    seen.add(key);
    return apt;
  });

  if (changed) {
    saveAppointments(fixed);
  }
}

function hasPendingConflict(item) {
  return hasAppointmentConflict(item, {
    excludeId: item.id
  });
}
function approveAppointment(id) {
  const appointments = getAppointments();
  const current = appointments.find(a => String(a.id) === String(id));

  if (!current) {
    showToast("Appointment not found.");
    return;
  }

  if (String(current.status || "").trim() !== "Pending") {
    showToast("Only pending appointments can be approved.");
    return;
  }

  const result = tryApproveAppointmentSlot(id);

  if (!result.ok) {
    showToast(result.reason);
    pushPatientNotification(
      `Your appointment for ${current.service} on ${current.schedule} could not be approved because the slot is already taken. Please choose another schedule.`
    );
    return;
  }

  const updated = normalizeAppointmentFinancials(result.appointment);

  pushPatientNotification(
    updated.requiresDownPayment
      ? `Your appointment for ${updated.service} has been approved. A minimum down payment of ₱${updated.minimumDownPayment.toLocaleString()} is now required.`
      : `Your appointment for ${updated.service} has been approved. You may now view and pay the invoice online if you want.`
  );

  addDentistNotification(
    `Appointment approved for ${updated.patientName || updated.patient || "patient"}.`
  );

  showToast("Appointment approved.");
  refreshDentistUI();
}

function buildDentistAppointmentActions(item) {
  const apt = normalizeAppointmentFinancials(item);

  if (apt.status === "Pending") {
    return `
      <div class="d-flex gap-2 flex-wrap">
        <button class="action-chip success" onclick="approveAppointment('${apt.id}')">Approve</button>
        <button class="action-chip danger" onclick="rejectAppointment('${apt.id}')">Reject</button>
      </div>
    `;
  }

  if (apt.status === "Approved") {
    return `
      <div class="d-flex gap-2 flex-wrap">
        <button class="action-chip primary" onclick="completeAppointment('${apt.id}')">Complete</button>
        <button class="action-chip danger" onclick="cancelApprovedAppointmentByDentist('${apt.id}')">Cancel</button>
      </div>
    `;
  }

  if (canArchiveStatus(apt.status)) {
    return `
      <div class="d-flex gap-2 flex-wrap">
        <button class="action-chip secondary" onclick="archiveAppointment('${apt.id}')">Archive</button>
      </div>
    `;
  }

  return `<span class="text-muted small">No actions</span>`;
}
function rejectAppointment(id) {
  const updated = updateDentistAppointment(id, (apt) => {
    if (apt.status !== "Pending") return apt;
    return {
      ...apt,
      status: "Rejected",
      invoiceUnlocked: false
    };
  });

  if (!updated) {
    showToast("Appointment not found.");
    return;
  }

  localStorage.removeItem("pendingPayment");

  pushPatientNotification(
    `Your appointment for ${updated.service} on ${updated.schedule} was rejected by the clinic.`
  );

  showToast("Appointment rejected.");
  refreshDentistUI?.();
}

function cancelApprovedAppointmentByDentist(id) {
  const updated = updateDentistAppointment(id, (apt) => {
    if (apt.status !== "Approved") return apt;
    return {
      ...apt,
      status: "Cancelled"
    };
  });

  if (!updated) {
    showToast("Appointment not found.");
    return;
  }

  pushPatientNotification(
    `Your approved appointment for ${updated.service} on ${updated.schedule} was cancelled by the clinic.`
  );

  showToast("Appointment cancelled.");
  refreshDentistUI?.();
}

function completeAppointment(id) {
  const updated = updateDentistAppointment(id, (apt) => {
    if (apt.status !== "Approved") return apt;

    let amountPaidInClinic = Number(apt.amountPaidInClinic || 0);
    let totalCollected = Number(apt.totalCollected || 0);
    const remainingBalance = Math.max(0, Number(apt.price || 0) - totalCollected);

    if (remainingBalance > 0) {
      amountPaidInClinic += remainingBalance;
      totalCollected += remainingBalance;
    }

    return {
      ...apt,
      status: "Completed",
      amountPaidInClinic,
      totalCollected
    };
  });

  if (!updated) {
    showToast("Appointment not found.");
    return;
  }

  pushPatientNotification(
    `Your appointment for ${updated.service} has been marked as completed.`
  );

  showToast("Appointment marked as completed.");
  refreshDentistUI?.();
}
function markCancelled(id) {
  const appointments = getAppointments();
  const index = appointments.findIndex(a => String(a.id) === String(id));
  if (index === -1) return;

  const patientName = appointments[index].patientName || appointments[index].patient || "patient";
  const service = appointments[index].service || "appointment";
  const schedule = appointments[index].schedule || "";

  appointments[index].status = "Cancelled";
  appointments[index].updatedAt = new Date().toISOString();

  saveAppointments(appointments);

  addDentistNotification(`Appointment cancelled for ${patientName}.`);
  pushPatientNotification(`Your appointment for ${service} on ${schedule} was cancelled.`);

  showToast("Appointment cancelled.");
  refreshDentistUI();
}


function approveRescheduleRequest(requestId) {
  const requests = getRescheduleRequests();
  const appointments = getAppointments();

  const reqIndex = requests.findIndex(r => String(r.id) === String(requestId));
  if (reqIndex === -1) {
    alert("Reschedule request not found.");
    return;
  }

  const req = requests[reqIndex];
  const aptIndex = appointments.findIndex(a => String(a.id) === String(req.appointmentId));
  if (aptIndex === -1) {
    alert("Linked appointment not found.");
    return;
  }

  const requested = splitSchedule(req.requestedSchedule);

  appointments[aptIndex] = normalizeAppointmentFinancials({
    ...appointments[aptIndex],
    date: requested.date,
    time: requested.time24 || convertDisplayTimeTo24(requested.timeDisplay),
    schedule: buildSchedule(requested.date, requested.timeDisplay || requested.time24),
    status: "Approved",
    updatedAt: new Date().toISOString(),
    previousSchedule: buildSchedule(
      splitSchedule(req.previousSchedule || appointments[aptIndex].previousSchedule || "").date,
      splitSchedule(req.previousSchedule || appointments[aptIndex].previousSchedule || "").timeDisplay
    ),
    requestedSchedule: "",
    rescheduleReason: ""
  });

  requests.splice(reqIndex, 1);

  saveAppointments(appointments);
  saveRescheduleRequests(requests);

  pushPatientNotification(
    `Your reschedule request for ${req.service} was approved. New schedule: ${req.requestedSchedule}.`
  );

  showToast("Reschedule request approved.");
  refreshDentistUI();
}

function rejectRescheduleRequest(requestId) {
  const requests = getRescheduleRequests();
  const appointments = getAppointments();

  const reqIndex = requests.findIndex(r => String(r.id) === String(requestId));
  if (reqIndex === -1) {
    alert("Reschedule request not found.");
    return;
  }

  const req = requests[reqIndex];
  const aptIndex = appointments.findIndex(a => String(a.id) === String(req.appointmentId));
  if (aptIndex === -1) {
    alert("Linked appointment not found.");
    return;
  }

  const current = appointments[aptIndex];
  const previous = splitSchedule(req.previousSchedule || current.previousSchedule || current.schedule);

  appointments[aptIndex] = normalizeAppointmentFinancials({
    ...current,
    date: previous.date || current.date,
    time: previous.time24 || convertDisplayTimeTo24(previous.timeDisplay) || current.time,
    schedule: buildSchedule(previous.date || current.date, previous.timeDisplay || current.time),
    status: "Approved",
    updatedAt: new Date().toISOString(),
    requestedSchedule: "",
    rescheduleReason: "",
    previousSchedule: ""
  });

  requests.splice(reqIndex, 1);

  saveAppointments(appointments);
  saveRescheduleRequests(requests);

  pushPatientNotification(
    `Your reschedule request for ${req.service} was rejected. Your original appointment remains on ${req.previousSchedule}.`
  );

  addDentistNotification(
    `Reschedule request rejected for ${req.patientName || "patient"}.`
  );

  showToast("Reschedule request rejected. Original schedule remains active.");
  refreshDentistUI();
}
// ---------------------------
// HISTORY + ARCHIVE
// ---------------------------
function renderHistoryTable() {
  const body = document.getElementById("historyTableBody");
  if (!body) return;

  const appointments = getAppointments().filter(a =>
    ["Completed", "Cancelled", "Rejected"].includes(String(a.status || "").trim()) &&
    a.archivedForDentist !== true &&
    a.archived !== true
  );

  body.innerHTML = "";

  if (!appointments.length) {
    body.innerHTML = `<tr><td colspan="5">No history records yet.</td></tr>`;
    return;
  }

  appointments.forEach(apt => {
    const safeStatus = String(apt.status || "").trim();
    const badgeClass = statusClassName(safeStatus);

    body.innerHTML += `
      <tr>
        <td>${escapeHtml(apt.patientName || apt.patient || "Unknown Patient")}</td>
        <td>${escapeHtml(apt.service || "-")}</td>
        <td>${escapeHtml(apt.schedule || "-")}</td>
        <td><span class="badge ${badgeClass}">${escapeHtml(safeStatus)}</span></td>
        <td>
          ${
            safeStatus === "Rejected"
              ? `<button class="action-chip" onclick="restoreRejectedAppointment('${apt.id}')">Undo Reject</button>`
              : `<button class="action-chip" onclick="openArchiveModal('${apt.id}')">Archive</button>`
          }
        </td>
      </tr>
    `;
  });
}

function restoreRejectedAppointment(id) {
  const appointments = getAppointments();
  const index = appointments.findIndex(a => String(a.id) === String(id));
  if (index === -1) return;

  appointments[index].status = "Pending";
  appointments[index].updatedAt = new Date().toISOString();

  saveAppointments(appointments);

  pushPatientNotification(
    `Your appointment for ${appointments[index].service} on ${appointments[index].schedule} is under review again.`
  );

  addDentistNotification(
    `Rejected appointment restored for ${appointments[index].patientName || appointments[index].patient || "patient"}.`
  );

  showToast("Rejected appointment restored to Pending.");
  refreshDentistUI();
}

function renderArchiveTable() {
  const body = document.getElementById("archiveTableBody");
  if (!body) return;

  const archive = getArchive();
  body.innerHTML = "";

  if (!archive.length) {
    body.innerHTML = `
      <tr>
        <td colspan="5">No archived records yet.</td>
      </tr>
    `;
    return;
  }

  archive.forEach(item => {
    body.innerHTML += `
      <tr>
        <td>${escapeHtml(item.patientName || item.patient || "Unknown Patient")}</td>
        <td>${escapeHtml(item.service || "-")}</td>
        <td>${escapeHtml(item.schedule || "-")}</td>
        <td>
          <span class="badge ${statusClassName(item.status || "Rejected")}">
            ${escapeHtml(item.status || "Rejected")}
          </span>
        </td>
        <td>
          <button class="action-chip success" onclick="restoreArchivedAppointment('${item.id}')">Restore</button>
        </td>
      </tr>
    `;
  });
}

function openArchiveModal(id) {
  pendingArchiveId = id;
  document.getElementById("confirmArchiveModal")?.classList.add("active");
}

function closeArchiveModal() {
  pendingArchiveId = null;
  document.getElementById("confirmArchiveModal")?.classList.remove("active");
}

function archiveAppointment(id) {
  const appointments = getAppointments();
  const archive = getArchive();

  const index = appointments.findIndex(a => String(a.id) === String(id));
  if (index === -1) return;

  const target = normalizeAppointmentFinancials(appointments[index]);

  // 🚫 ONLY allow archive for CLOSED statuses
  const allowedStatuses = ["Completed", "Cancelled", "Rejected"];

  if (!allowedStatuses.includes(target.status)) {
    showToast("Only completed, cancelled, or rejected appointments can be archived.");
    return;
  }

  // ✅ mark as archived (not delete)
  appointments[index] = {
    ...target,
    archivedForDentist: true,
    updatedAt: new Date().toISOString()
  };

  // ✅ avoid duplicate archive entries
  const alreadyArchived = archive.some(a => String(a.id) === String(id));

  if (!alreadyArchived) {
    archive.unshift({
      ...appointments[index],
      archivedAt: new Date().toISOString(),
      archivedBy: "dentist"
    });
  }

  saveAppointments(appointments);
  saveArchive(archive);

  addDentistNotification(
    `Appointment archived for ${target.patientName || target.patient || "patient"}.`
  );

  pushPatientNotification(
    `Your appointment for ${target.service || "appointment"} has been archived by the clinic.`
  );

  showToast("Appointment archived.");
  refreshDentistUI();
}

function restoreArchivedAppointment(id) {
  const archive = getArchive();
  const appointments = getAppointments();

  const archiveIndex = archive.findIndex(a => String(a.id) === String(id));
  if (archiveIndex === -1) return;

  const appointmentIndex = appointments.findIndex(a => String(a.id) === String(id));

  if (appointmentIndex !== -1) {
    appointments[appointmentIndex].archivedForDentist = false;
    appointments[appointmentIndex].status = "Pending";
    appointments[appointmentIndex].updatedAt = new Date().toISOString();
    saveAppointments(appointments);
  }

  archive.splice(archiveIndex, 1);
  saveArchive(archive);

  showToast("Archived appointment restored.");
  refreshDentistUI();
}

function clearArchive() {
  saveArchive([]);
  showToast("Archive cleared.");
  refreshDentistUI();
}

// ---------------------------
// ADD APPOINTMENT / PATIENT
// ---------------------------
function showAddAppointmentModal() {
  document.getElementById("addAppointmentModal")?.classList.add("active");
}

function closeAddAppointmentModal() {
  document.getElementById("addAppointmentModal")?.classList.remove("active");
}

function showAddPatientModal() {
  document.getElementById("patientModal")?.classList.add("active");
}

function closePatientModal() {
  document.getElementById("patientModal")?.classList.remove("active");
}

function closeOverlayByBackdrop(event, modalId) {
  const content = event.currentTarget.querySelector(".service-modal-content");
  if (!content.contains(event.target)) {
    document.getElementById(modalId)?.classList.remove("active");
  }
}

function addAppointment() {
  const patientName = document.getElementById("a_patient")?.value.trim();
  const patientPhone = document.getElementById("a_patientPhone")?.value.trim();
  const service = document.getElementById("a_service")?.value.trim();
  const date = document.getElementById("a_date")?.value;
  const time24 = document.getElementById("a_time")?.value;
  const status = document.getElementById("a_status")?.value || "Pending";
  const notes = document.getElementById("a_notes")?.value.trim();

  if (!patientName || !service || !date || !time24) {
    showToast("Please complete the appointment form.");
    return;
  }

  const time12 = convert24To12(time24);
  const serviceInfo = findService(service);

  const newAppointment = normalizeAppointmentFinancials({
    id: String(Date.now()),
    patientName,
    patientPhone,
    dentist: "Dr. Daniel Santos",
    service,
    price: serviceInfo?.price || 0,
    schedule: `${date} • ${time12}`,
    status: "Pending",
    paid: false,
    paymentMethod: "",
    downPayment: 0,
    amountPaidOnline: 0,
    amountPaidInClinic: 0,
    totalCollected: 0,
    notes,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });

  const appointments = getAppointments();
  appointments.unshift(newAppointment);
  saveAppointments(appointments);

  if (status === "Approved") {
    const result = tryApproveAppointmentSlot(newAppointment.id);

    if (!result.ok) {
      showToast(result.reason);
      refreshDentistUI();
      return;
    }
  }

  addDentistNotification(`New manual appointment added for ${patientName}.`);
  showToast("Appointment added.");
  closeAddAppointmentModal();
  refreshDentistUI();
}

function addPatient() {
  const p_name = document.getElementById("p_name")?.value.trim();
  const p_age = document.getElementById("p_age")?.value.trim();
  const p_gender = document.getElementById("p_gender")?.value.trim();
  const p_contact = document.getElementById("p_contact")?.value.trim();
  const p_condition = document.getElementById("p_condition")?.value.trim();
  const p_lastVisit = document.getElementById("p_lastVisit")?.value.trim();
  const p_address = document.getElementById("p_address")?.value.trim();

  if (!p_name) {
    showToast("Patient name is required.");
    return;
  }

  const appointments = getAppointments();

  appointments.unshift({
    id: String(Date.now()),
    patientName: p_name,
    patientPhone: p_contact,
    patientAddress: p_address,
    age: p_age,
    gender: p_gender,
    patientCondition: p_condition,
    service: "No appointment yet",
    price: 0,
    schedule: p_lastVisit ? `${p_lastVisit} • -` : "",
    status: "Profile Only",
    paid: false,
    createdAt: new Date().toISOString()
  });

  saveAppointments(appointments);

  showToast("Patient added.");
  closePatientModal();
  refreshDentistUI();
}

// ---------------------------
// QUICK NOTES
// ---------------------------
function saveQuickNotes() {
  const value = document.getElementById("quickNotes")?.value || "";
  localStorage.setItem(STORAGE_KEYS.quickNotes, value);
  showToast("Quick notes saved.");
}

function loadQuickNotes() {
  const box = document.getElementById("quickNotes");
  if (box) {
    box.value = localStorage.getItem(STORAGE_KEYS.quickNotes) || "";
  }
}

// ---------------------------
// PROFILE
// ---------------------------
function loadDentistProfile() {
  const saved = getData(STORAGE_KEYS.dentistProfile, null) || {
    fullName: "Dr. Daniel Santos",
    email: "dr.daniel@email.com",
    specialty: "Orthodontist",
    phone: "09123456789",
    schedule: "Mon, Wed, Fri • 9:00 AM - 4:00 PM"
  };

  const profileFields = {
    profileFullName: saved.fullName,
    profileEmail: saved.email,
    profileSpecialty: saved.specialty,
    profilePhone: saved.phone,
    profileSchedule: saved.schedule
  };

  Object.entries(profileFields).forEach(([id, value]) => {
    const el = document.getElementById(id);
    if (el) el.value = value;
  });

  const heading = document.getElementById("profileHeadingName");
  if (heading) heading.textContent = saved.fullName;

  const headerName = document.getElementById("headerDentistName");
  if (headerName) headerName.textContent = saved.fullName;
}

function loadDentistPhoto() {
  const saved = localStorage.getItem(STORAGE_KEYS.dentistProfilePhoto);
  if (!saved) return;

  const profileDisplay = document.getElementById("profileDisplay");
  const headerProfile = document.getElementById("header-profile-img");

  if (profileDisplay) profileDisplay.src = saved;
  if (headerProfile) headerProfile.src = saved;
}

function initProfilePhotoUpload() {
  const photoUpload = document.getElementById("photoUpload");
  if (!photoUpload) return;

  photoUpload.addEventListener("change", e => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = event => {
      const image = event.target?.result;
      if (!image) return;

      localStorage.setItem(STORAGE_KEYS.dentistProfilePhoto, image);
      loadDentistPhoto();
      showToast("Profile photo updated.");
    };
    reader.readAsDataURL(file);
  });
}

function initProfileEdit() {
  const btn = document.getElementById("editProfileBtn");
  if (!btn) return;

  let editing = false;

  btn.addEventListener("click", () => {
    const editableIds = [
      "profileFullName",
      "profileEmail",
      "profileSpecialty",
      "profilePhone",
      "profileSchedule",
      "profileNewPassword",
      "profileConfirmPassword"
    ];

    if (!editing) {
      editableIds.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.disabled = false;
      });
      btn.textContent = "Save Profile";
      editing = true;
      return;
    }

    const newPassword = document.getElementById("profileNewPassword")?.value || "";
    const confirmPassword = document.getElementById("profileConfirmPassword")?.value || "";

    if (newPassword || confirmPassword) {
      if (newPassword !== confirmPassword) {
        showToast("Passwords do not match.");
        return;
      }
    }

    const saved = {
      fullName: document.getElementById("profileFullName")?.value || "Dr. Daniel Santos",
      email: document.getElementById("profileEmail")?.value || "",
      specialty: document.getElementById("profileSpecialty")?.value || "",
      phone: document.getElementById("profilePhone")?.value || "",
      schedule: document.getElementById("profileSchedule")?.value || ""
    };

    setData(STORAGE_KEYS.dentistProfile, saved);

    editableIds.forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;
      el.disabled = true;
      if (id === "profileNewPassword" || id === "profileConfirmPassword") {
        el.value = "";
      }
    });

    btn.textContent = "Edit Profile";
    editing = false;

    loadDentistProfile();
    showToast("Profile updated.");
  });
}

// ---------------------------
// THEME
// ---------------------------
function applyTheme(theme) {
  document.body.classList.toggle("dark", theme === "dark");
  localStorage.setItem(STORAGE_KEYS.theme, theme);
}

function loadTheme() {
  const toggle = document.getElementById("darkModeToggle");
  const saved = localStorage.getItem(STORAGE_KEYS.theme) || "light";

  applyTheme(saved);

  if (toggle) {
    toggle.checked = saved === "dark";
    toggle.addEventListener("change", () => {
      applyTheme(toggle.checked ? "dark" : "light");
    });
  }
}

// ---------------------------
// SEARCH / FILTER EVENTS
// ---------------------------
function initFilters() {
  document.getElementById("scheduleSearch")?.addEventListener("input", renderScheduleTable);
  document.getElementById("statusFilter")?.addEventListener("change", renderScheduleTable);
}

// ---------------------------
// PROFILE MENU + LOGOUT
// ---------------------------
function toggleProfileDropdown(forceClose = null) {
  const menu = document.getElementById("profileDropdownMenu");
  if (!menu) return;

  if (forceClose === true) {
    menu.classList.remove("active");
    return;
  }

  menu.classList.toggle("active");
}

function logoutDentist() {
  clearCurrentUser();
  window.location.replace("../Landing/landing.html");
}

// ---------------------------
// CROSS PAGE SYNC
// ---------------------------
function refreshDentistUI() {
  renderDashboard();
  renderScheduleTable();
  renderRescheduleRequests();
  renderPatients();
  renderServices();
  renderHistoryTable();
  renderArchiveTable();
  renderDentistNotifications();
  renderBookedSlots();
}

function initCrossPageSync() {
  window.addEventListener("storage", (event) => {
    const watchedKeys = [
      STORAGE_KEYS.appointments,
      STORAGE_KEYS.archive,
      STORAGE_KEYS.dentistArchive,
      STORAGE_KEYS.rescheduleRequests,
      STORAGE_KEYS.quickNotes,
      STORAGE_KEYS.dentistProfile,
      STORAGE_KEYS.dentistProfilePhoto,
      CLINIC_SYNC_KEYS.patientNotifications,
      CLINIC_SYNC_KEYS.dentistNotifications,
      CLINIC_SYNC_KEYS.clinicSyncStamp
    ];

    if (watchedKeys.includes(event.key)) {
      refreshDentistUI();
    }
  });
}



// ---------------------------
// INIT
// ---------------------------
document.addEventListener("DOMContentLoaded", () => {
  lockPageHistory();
  showSection("dashboard");
  renderServices();
  loadQuickNotes();
  loadDentistProfile();
  loadDentistPhoto();
  initProfilePhotoUpload();
  initProfileEdit();
  loadTheme();
  initFilters();
  initCrossPageSync();
  migrateLegacyAppointmentsToClinicDb();
  repairApprovedScheduleConflicts();
  refreshDentistUI();
  listenGlobalSync(() => {
    refreshDentistUI();
  });

  const notifBtn = document.getElementById("notifTrigger");
  const notifPanel = document.getElementById("notifPanel");
  const closeNotifBtn = document.getElementById("closeNotif");

  const openAllNotifModalBtn = document.getElementById("openAllNotifModal");
  const allNotifModal = document.getElementById("allNotifModal");
  const closeAllNotifModalBtn = document.getElementById("closeAllNotifModal");

  const markAllReadBtn = document.getElementById("markAllReadBtn");
  const modalMarkAllReadBtn = document.getElementById("modalMarkAllReadBtn");
  const clearAllNotifBtn = document.getElementById("clearAllNotifBtn");

  const clearNotifWarningModal = document.getElementById("clearNotifWarningModal");
  const cancelClearNotifBtn = document.getElementById("cancelClearNotifBtn");
  const confirmClearNotifBtn = document.getElementById("confirmClearNotifBtn");

  const profileMenuTrigger = document.getElementById("profileMenuTrigger");
  const profileDropdownMenu = document.getElementById("profileDropdownMenu");

  const confirmArchiveBtn = document.getElementById("confirmArchiveBtn");

  if (notifBtn && notifPanel) {
    notifBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      toggleDentistNotifPanel();
    });
  }

  if (closeNotifBtn) {
    closeNotifBtn.addEventListener("click", () => {
      toggleDentistNotifPanel(true);
    });
  }

  if (openAllNotifModalBtn && allNotifModal) {
    openAllNotifModalBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      allNotifModal.classList.add("active");
      renderDentistNotifications();
    });
  }

  if (closeAllNotifModalBtn && allNotifModal) {
    closeAllNotifModalBtn.addEventListener("click", () => {
      allNotifModal.classList.remove("active");
    });
  }

  if (allNotifModal) {
    allNotifModal.addEventListener("click", (e) => {
      if (e.target === allNotifModal) {
        allNotifModal.classList.remove("active");
      }
    });
  }

  if (markAllReadBtn) {
    markAllReadBtn.addEventListener("click", () => {
      markAllDentistNotificationsRead();
      renderDentistNotifications();
      showToast("All notifications marked as read.");
    });
  }

  if (modalMarkAllReadBtn) {
    modalMarkAllReadBtn.addEventListener("click", () => {
      markAllDentistNotificationsRead();
      renderDentistNotifications();
      showToast("All notifications marked as read.");
    });
  }

  if (clearAllNotifBtn && clearNotifWarningModal) {
    clearAllNotifBtn.addEventListener("click", () => {
      clearNotifWarningModal.classList.add("active");
    });
  }

  if (cancelClearNotifBtn && clearNotifWarningModal) {
    cancelClearNotifBtn.addEventListener("click", () => {
      clearNotifWarningModal.classList.remove("active");
    });
  }

  if (confirmClearNotifBtn && clearNotifWarningModal) {
    confirmClearNotifBtn.addEventListener("click", () => {
      clearAllDentistNotifications();
      renderDentistNotifications();
      clearNotifWarningModal.classList.remove("active");
      allNotifModal?.classList.remove("active");
      toggleDentistNotifPanel(true);
      showToast("All notifications cleared.");
    });
  }

  if (clearNotifWarningModal) {
    clearNotifWarningModal.addEventListener("click", (e) => {
      if (e.target === clearNotifWarningModal) {
        clearNotifWarningModal.classList.remove("active");
      }
    });
  }

  if (profileMenuTrigger) {
    profileMenuTrigger.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleProfileDropdown();
    });
  }

  if (profileDropdownMenu) {
    profileDropdownMenu.addEventListener("click", (e) => {
      e.stopPropagation();
    });
  }

  if (confirmArchiveBtn) {
    confirmArchiveBtn.addEventListener("click", () => {
      if (pendingArchiveId) {
        archiveAppointment(pendingArchiveId);
      }
      closeArchiveModal();
    });
  }

  document.addEventListener("click", (e) => {
    if (notifPanel && notifBtn && !notifPanel.contains(e.target) && !notifBtn.contains(e.target)) {
      toggleDentistNotifPanel(true);
    }

    if (
      profileDropdownMenu &&
      profileMenuTrigger &&
      !profileDropdownMenu.contains(e.target) &&
      !profileMenuTrigger.contains(e.target)
    ) {
      toggleProfileDropdown(true);
    }
  });

  renderDentistNotifications();
});
