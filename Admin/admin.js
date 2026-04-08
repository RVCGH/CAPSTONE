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

const currentAdminUser = getCurrentUser();

if (!currentAdminUser) {
  window.location.replace("../Landing/landing.html");
} else if (currentAdminUser.role !== "admin") {
  window.location.replace("../Landing/landing.html");
}

const STORAGE_KEY = "dental-admin-ui-v3";

function uid() {
  return Math.random().toString(36).slice(2, 11);
}

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
const defaultData = {
  theme: "dark",
  clinic: {
    name: "Ganal-Mappala Dental Clinic",
    phone: "09228724320",
    email: "clinic@email.com",
    address: "Antipolo City, Philippines",
    openingTime: "09:00",
    closingTime: "18:00",
    workingDays: "Monday - Saturday"
  },
  admin: {
    username: "admin",
    email: "admin@email.com",
    profileImage: "https://i.pravatar.cc/60?img=12"
  },
  services: [
    { id: uid(), name: "Consultation", price: 500, archived: false },
    { id: uid(), name: "Oral Prophylaxis (Teeth Cleaning)", price: 1000, archived: false },
    { id: uid(), name: "Tooth Extraction", price: 1000, archived: false },
    { id: uid(), name: "Teeth Whitening", price: 3000, archived: false },
    { id: uid(), name: "Dental Fillings", price: 800, archived: false },
    { id: uid(), name: "Root Canal Treatment", price: 6000, archived: false },
    { id: uid(), name: "Orthodontic Treatment (Braces)", price: 60000, archived: false }
  ],
  dentists: [
    {
      id: uid(),
      name: "Dr. Imelda G. Mappala",
      specialty: "General Dentist",
      contact: "09123456789",
      schedules: [{ day: "Monday", start: "09:00", end: "17:00" }],
      archived: false
    },
    {
      id: uid(),
      name: "Dr. Daniel Santos",
      specialty: "Orthodontist",
      contact: "09987654321",
      schedules: [{ day: "Tuesday", start: "10:00", end: "18:00" }],
      archived: false
    },
    {
      id: uid(),
      name: "Dr. Maria Reyes",
      specialty: "Pediatric Dentist",
      contact: "09112223333",
      schedules: [{ day: "Wednesday", start: "09:00", end: "13:00" }],
      archived: false
    }
  ],
  patients: [
    {
      id: uid(),
      name: "Juan Dela Cruz",
      age: 30,
      gender: "Male",
      condition: "Tooth Decay",
      address: "Quezon City",
      contact: "09123456789",
      archived: false
    },
    {
      id: uid(),
      name: "Maria Santos",
      age: 25,
      gender: "Female",
      condition: "Braces Adjustment",
      address: "Manila",
      contact: "09987654321",
      archived: false
    },
    {
      id: uid(),
      name: "Pedro Reyes",
      age: 10,
      gender: "Male",
      condition: "Routine Checkup",
      address: "Quezon City",
      contact: "09112223333",
      archived: false
    }
  ],
  appointments: [
    {
      id: uid(),
      patient: "Juan Dela Cruz",
      dentist: "Dr. Daniel Santos",
      service: "Consultation",
      date: "2026-03-25",
      time: "10:00",
      status: "Pending",
      archived: false
    },
    {
      id: uid(),
      patient: "Maria Santos",
      dentist: "Dr. Maria Reyes",
      service: "Orthodontic Treatment (Braces)",
      date: "2026-03-26",
      time: "14:00",
      status: "Approved",
      archived: false
    },
    {
      id: uid(),
      patient: "Pedro Reyes",
      dentist: "Dr. Imelda G. Mappala",
      service: "Consultation",
      date: "2026-03-27",
      time: "09:00",
      status: "Rejected",
      archived: false
    }
  ],
  accounts: [
    {
      id: uid(),
      name: "Dr. Juan Dela Cruz",
      email: "juan@email.com",
      username: "drjuan"
    }
  ],
  notifications: [
    { id: uid(), title: "New Appointment", body: "Juan Dela Cruz booked Consultation", time: "Just now", read: true },
    { id: uid(), title: "Pending Approval", body: "5 appointments waiting for approval", time: "2 mins ago", read: true },
    { id: uid(), title: "New Patient", body: "Maria Santos registered", time: "10 mins ago", read: true },
    { id: uid(), title: "Appointment Approved", body: "Pedro Reyes appointment approved", time: "20 mins ago", read: true },
    { id: uid(), title: "Reminder", body: "Upcoming appointment at 2:00 PM", time: "Today", read: true }
  ]
};
const CLINIC_SYNC_KEYS = {
  patientNotifications: "patientNotifications",
  dentistNotifications: "dentistNotifications",
  clinicSyncStamp: "clinicSyncStamp"
};

function touchClinicSync() {
  localStorage.setItem(
    CLINIC_SYNC_KEYS.clinicSyncStamp,
    JSON.stringify({
      updatedAt: new Date().toISOString(),
      stamp: Date.now()
    })
  );
}

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

function getClinicAppointments() {
  const db = getClinicDb();
  return Array.isArray(db.appointments) ? db.appointments : [];
}

function saveClinicAppointments(list) {
  const db = getClinicDb();
  db.appointments = Array.isArray(list) ? list : [];
  saveClinicDb(db);
  touchClinicSync();
}

function getClinicRescheduleRequests() {
  const db = getClinicDb();
  return Array.isArray(db.rescheduleRequests) ? db.rescheduleRequests : [];
}

function saveClinicRescheduleRequests(list) {
  const db = getClinicDb();
  db.rescheduleRequests = Array.isArray(list) ? list : [];
  saveClinicDb(db);
  touchClinicSync();
}

function getPatientNotificationsShared() {
  const list = getJson(CLINIC_SYNC_KEYS.patientNotifications, []);
  return Array.isArray(list) ? list : [];
}

function savePatientNotificationsShared(list) {
  localStorage.setItem(CLINIC_SYNC_KEYS.patientNotifications, JSON.stringify(list));
  touchClinicSync();
}

function getDentistNotificationsShared() {
  const list = getJson(CLINIC_SYNC_KEYS.dentistNotifications, []);
  return Array.isArray(list) ? list : [];
}

function saveDentistNotificationsShared(list) {
  localStorage.setItem(CLINIC_SYNC_KEYS.dentistNotifications, JSON.stringify(list));
  touchClinicSync();
}

function pushPatientNotification(text) {
  const list = getPatientNotificationsShared();
  list.unshift({
    id: uid(),
    text,
    createdAt: new Date().toISOString(),
    read: false
  });
  savePatientNotificationsShared(list);
}

function pushDentistNotification(text) {
  const list = getDentistNotificationsShared();
  list.unshift({
    id: uid(),
    text,
    createdAt: new Date().toISOString(),
    read: false
  });
  saveDentistNotificationsShared(list);
}

function getJson(key, fallback = []) {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback;
  } catch {
    return fallback;
  }
}



function lockPageHistory() {
  history.replaceState({ pageLocked: true }, "", location.href);
  history.pushState({ pageLocked: true }, "", location.href);

  window.addEventListener("popstate", () => {
    history.pushState({ pageLocked: true }, "", location.href);
  });
}
let state = loadState();
let currentSection = "home";

const pageMeta = {
  home: { title: "Dashboard", subtitle: "Welcome back, Admin 👋" },
  services: { title: "Services", subtitle: "Manage dental clinic services." },
  appointments: { title: "Appointments", subtitle: "Track, update, and review bookings." },
  dentists: { title: "Dentists", subtitle: "Manage dentist profiles and schedules." },
  patients: { title: "Patients", subtitle: "Manage patient records and details." },
  account: { title: "Account", subtitle: "Update admin credentials and dentist accounts." },
  settings: { title: "Settings", subtitle: "Configure clinic details and preferences." }
};

document.addEventListener("DOMContentLoaded", init);

function init() {
  lockPageHistory();
  applyTheme();
  bindNavigation();
  bindTopbarMenus();
  bindSidebar();
  bindSettings();
  bindSectionButtons();
  bindRestoreModal();
  bindSharedModal();
  bindProfileUploadUI();
  fillSettingsForms();
  fillAdminForm();
  renderAdminProfile();
  renderAdminName();
  cleanupBrokenProfileOnlyRecords();

  fullAdminSync();
  renderAll();

 listenGlobalSync(() => {
  fullAdminSync();
  renderAll();
});

  window.addEventListener("storage", (event) => {
    const watchedKeys = [
      CLINIC_DB_KEY,
      "gm_dental_sync_stamp",
      CLINIC_SYNC_KEYS.clinicSyncStamp,
      CLINIC_SYNC_KEYS.patientNotifications,
      CLINIC_SYNC_KEYS.dentistNotifications
    ];

    if (watchedKeys.includes(event.key)) {
      fullAdminSync();
      renderAll();
    }
  });

  setInterval(refreshNotificationTimes, 60000);
}


function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return structuredClone(defaultData);
    const parsed = JSON.parse(raw);
    return mergeDefaults(parsed);
  } catch {
    return structuredClone(defaultData);
  }
}

function mergeDefaults(saved) {
  const base = structuredClone(defaultData);

  const normalizeNotifications = (items) =>
    (Array.isArray(items) ? items : base.notifications).map(item => ({
      read: true,
      ...item
    }));

  return {
    ...base,
    ...saved,
    clinic: { ...base.clinic, ...(saved.clinic || {}) },
    admin: { ...base.admin, ...(saved.admin || {}) },
    services: Array.isArray(saved.services) && saved.services.length ? saved.services : base.services,
    dentists: Array.isArray(saved.dentists) && saved.dentists.length ? saved.dentists : base.dentists,
    patients: Array.isArray(saved.patients) && saved.patients.length ? saved.patients : base.patients,
    appointments: Array.isArray(saved.appointments) && saved.appointments.length ? saved.appointments : base.appointments,
    accounts: Array.isArray(saved.accounts) ? saved.accounts : base.accounts,
    notifications: normalizeNotifications(saved.notifications)
  };
}

function saveState(skipClinicMirror = false) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));

  if (
    !skipClinicMirror &&
    typeof syncAdminStateToClinicDb === "function"
  ) {
    syncAdminStateToClinicDb();
  }
}
function syncAdminPatientsFromClinicDb() {
  const db = getClinicDb();
  const sharedPatients = Array.isArray(db.patients) ? db.patients : [];
  const clinicAppointments = getClinicAppointments();
  const patientMap = new Map();

  sharedPatients.forEach(p => {
    const name = String(p.name || "").trim();
    if (!name) return;

    patientMap.set(name.toLowerCase(), {
      id: p.id || uid(),
      name,
      age: p.age || "",
      gender: p.gender || "",
      condition: p.condition || "",
      address: p.address || "",
      contact: p.contact || p.mobile || "",
      email: p.email || "",
      archived: !!p.archived
    });
  });

  clinicAppointments.forEach(a => {
    const name = String(a.patientName || a.patient || "").trim();
    const status = String(a.status || "").trim();

    if (!name) return;
    if (a.archived === true) return;
    if (status === "Profile Only") return;
    if (!a.service && !a.date && !a.time && !a.schedule) return;

    const key = name.toLowerCase();

    if (!patientMap.has(key)) {
      patientMap.set(key, {
        id: a.patientId || uid(),
        name,
        age: a.age || "",
        gender: a.gender || "",
        condition: a.patientCondition || a.condition || "",
        address: a.patientAddress || a.address || "",
        contact: a.patientPhone || a.contact || "",
        email: a.patientEmail || "",
        archived: false
      });
    }
  });

  state.patients = Array.from(patientMap.values());
  saveState(true);
}

function syncAdminStateToClinicDb() {
  const db = getClinicDb();

  db.patients = (state.patients || []).map(p => ({
    id: p.id || uid(),
    name: p.name || "",
    age: p.age || "",
    gender: p.gender || "",
    condition: p.condition || "",
    address: p.address || "",
    contact: p.contact || "",
    email: p.email || "",
    archived: !!p.archived,
    updatedAt: new Date().toISOString()
  }));

  db.dentists = (state.dentists || []).map(d => ({
    id: d.id || uid(),
    name: d.name || "",
    specialty: d.specialty || "",
    contact: d.contact || "",
    schedules: Array.isArray(d.schedules) ? d.schedules : [],
    archived: !!d.archived,
    updatedAt: new Date().toISOString()
  }));

  db.appointments = (state.appointments || []).map(a => ({
    id: a.id || uid(),
    patientName: a.patient || "",
    patient: a.patient || "",
    dentist: a.dentist || "",
    service: a.service || "",

    // ✅ KEEP FINANCIAL DATA
    price: Number(a.price || 0),
    paid: !!a.paid,
    downPayment: Number(a.downPayment || 0),
    amountPaidOnline: Number(a.amountPaidOnline || 0),
    amountPaidInClinic: Number(a.amountPaidInClinic || 0),
    totalCollected: Number(a.totalCollected || 0),
    remainingBalance: Number(a.remainingBalance || 0),
    paymentMethod: a.paymentMethod || "",
    paymentStatus: a.paymentStatus || "Unpaid",
    requiresDownPayment: !!a.requiresDownPayment,
    minimumDownPayment: Number(a.minimumDownPayment || 0),
    invoiceUnlocked: !!a.invoiceUnlocked,
    revenueCountedOnline: Number(a.revenueCountedOnline || 0),
    revenueCountedClinic: Number(a.revenueCountedClinic || 0),

    // ✅ KEEP SCHEDULE DATA
    date: a.date || "",
    time: a.time || "",
    schedule: buildSchedule(
      a.date || "",
      a.time || normalizeTimeDisplay(
        String(a.schedule || "").split("•")[1] || ""
      )
    ),

    status: a.status || "Pending",
    archived: !!a.archived,
    archivedForDentist: !!a.archivedForDentist,
    archivedForPatient: !!a.archivedForPatient,
    review: a.review || null,
    rating: a.rating || null,
    updatedAt: new Date().toISOString()
  }));

  saveClinicDb(db);
  touchClinicSync();
  triggerGlobalSync();
}
function qs(selector, root = document) {
  return root.querySelector(selector);
}

function qsa(selector, root = document) {
  return [...root.querySelectorAll(selector)];
}

function bindNavigation() {
  qsa(".nav-item").forEach(btn => {
    btn.addEventListener("click", () => showSection(btn.dataset.section));
  });

  qsa("[data-section-jump]").forEach(btn => {
    btn.addEventListener("click", () => {
      closeFloatingMenus();
      showSection(btn.dataset.sectionJump);
    });
  });
}

function addNotification(title, body, time = "Just now") {
  state.notifications.unshift({
    id: uid(),
    title,
    body,
    time,
    read: false,
    createdAt: new Date().toISOString()
  });

  state.notifications = state.notifications.slice(0, 20);

  saveState(true);
  renderNotifications();
}

function fullAdminSync() {
  syncAdminAppointmentsFromClinicDb();
  syncAdminPatientsFromClinicDb();
  syncAdminDentistsFromClinicDb();
  syncAdminNotificationsFromShared();

  saveState(true);
}



function syncAdminDentistsFromClinicDb() {
  const clinicAppointments = getClinicAppointments();
  const dentistMap = new Map();

  clinicAppointments.forEach(a => {
    const name = (a.dentist || "").trim();
    if (!name) return;

    if (!dentistMap.has(name)) {
      dentistMap.set(name, {
        id: uid(),
        name,
        specialty: "Dentist",
        contact: "",
        schedules: [],
        archived: false
      });
    }
  });

  if (dentistMap.size) {
    const existing = state.dentists || [];
    const merged = [...existing];

    Array.from(dentistMap.values()).forEach(d => {
      if (!merged.some(x => x.name === d.name)) {
        merged.push(d);
      }
    });

    state.dentists = merged;
    saveState(true);
  }
}

function syncAdminNotificationsFromShared() {
  const dentistNotifs = getDentistNotificationsShared().map(n => ({
    id: `dent-${n.id}`,
    title: "Dentist Update",
    body: n.text,
    time: formatNotificationTime(n.createdAt),
    read: !!n.read,
    createdAt: n.createdAt
  }));

  const patientNotifs = getPatientNotificationsShared().map(n => ({
    id: `pat-${n.id}`,
    title: "Patient Update",
    body: n.text,
    time: formatNotificationTime(n.createdAt),
    read: !!n.read,
    createdAt: n.createdAt
  }));

  const localAdminNotifs = (state.notifications || []).map(n => ({
    ...n,
    createdAt: n.createdAt || new Date().toISOString()
  }));

  const merged = [...localAdminNotifs, ...dentistNotifs, ...patientNotifs]
    .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
    .slice(0, 40);

  state.notifications = merged;
  saveState(true);
}

function syncAdminAllFromClinicDb() {
  syncAdminAppointmentsFromClinicDb();
  syncAdminPatientsFromClinicDb();
  syncAdminDentistsFromClinicDb();
  syncAdminNotificationsFromShared();
}

function formatNotificationTime(iso) {
  if (!iso) return "Just now";
  const date = new Date(iso);
  const diffMs = Date.now() - date.getTime();
  const mins = Math.floor(diffMs / 60000);

  if (mins <= 0) return "Just now";
  if (mins === 1) return "1 min ago";
  if (mins < 60) return `${mins} mins ago`;

  const hours = Math.floor(mins / 60);
  if (hours === 1) return "1 hour ago";
  if (hours < 24) return `${hours} hours ago`;

  return date.toLocaleDateString();
}

function convertDisplayTimeTo24(time12) {
  if (!time12) return "";
  const match = String(time12).match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
  if (!match) return time12;

  let hour = parseInt(match[1], 10);
  const minute = match[2];
  const meridiem = match[3].toUpperCase();

  if (meridiem === "PM" && hour !== 12) hour += 12;
  if (meridiem === "AM" && hour === 12) hour = 0;

  return `${String(hour).padStart(2, "0")}:${minute}`;
}

function convert24ToDisplayTime(time24) {
  if (!time24) return "";
  const [hourStr, min] = String(time24).split(":");
  let hour = Number(hourStr);
  const suffix = hour >= 12 ? "PM" : "AM";
  hour = hour % 12 || 12;
  return `${hour}:${min} ${suffix}`;
}

function refreshNotificationTimes() {
  if (!Array.isArray(state.notifications)) return;

  state.notifications = state.notifications.map((item, index) => {
    if (index === 0) return { ...item, time: "Just now" };
    if (index === 1) return { ...item, time: "1 min ago" };
    if (index === 2) return { ...item, time: "2 mins ago" };
    return item;
  });

  saveState();
  renderNotifications();
}

function showSection(sectionId) {
  currentSection = sectionId;

  qsa(".section").forEach(section => section.classList.remove("active"));
  qsa(".nav-item").forEach(btn => btn.classList.remove("active"));

  const targetSection = qs(`#${sectionId}`);
  const targetNav = qs(`.nav-item[data-section="${sectionId}"]`);

  if (targetSection) targetSection.classList.add("active");
  if (targetNav) targetNav.classList.add("active");

  const meta = pageMeta[sectionId];
  if (meta) {
    qs("#pageTitle").textContent = meta.title;
    qs("#pageSubtitle").textContent = meta.subtitle;
  }

  closeFloatingMenus();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function bindTopbarMenus() {
  const notifToggle = qs("#notifToggle");
  const notifPanel = qs("#notifPanel");
  const profileToggle = qs("#profileToggle");
  const profilePanel = qs("#profilePanel");

  function hidePanels() {
    notifPanel.classList.remove("show");
    profilePanel.classList.remove("show");
  }

  notifToggle.addEventListener("click", (e) => {
    e.stopPropagation();

    const open = notifPanel.classList.contains("show");
    hidePanels();

    if (!open) {
      notifPanel.classList.add("show");

      state.notifications = state.notifications.map(n => ({
        ...n,
        read: true
      }));

      saveState();
      renderNotifications();
    }
  });

  profileToggle.addEventListener("click", (e) => {
    e.stopPropagation();
    const open = profilePanel.classList.contains("show");
    hidePanels();
    if (!open) profilePanel.classList.add("show");
  });

  notifPanel.addEventListener("click", (e) => e.stopPropagation());
  profilePanel.addEventListener("click", (e) => e.stopPropagation());

  document.addEventListener("click", hidePanels);
  window.addEventListener("resize", hidePanels);

  window.addEventListener("scroll", (e) => {
    if (notifPanel.classList.contains("show")) {
      if (e.target === document || e.target === document.documentElement || e.target === document.body) {
        hidePanels();
      }
    }

    if (profilePanel.classList.contains("show")) {
      if (e.target === document || e.target === document.documentElement || e.target === document.body) {
        hidePanels();
      }
    }
  }, true);

  qs("#logoutBtn").addEventListener("click", () => {
    clearCurrentUser();
    window.location.replace("../Landing/landing.html");
  });
}

function closeFloatingMenus() {
  qsa(".menu-panel").forEach(p => p.classList.remove("show"));
  closeAllDropdowns();
}

function bindSidebar() {
  qs("#sidebarToggle").addEventListener("click", () => {
    qs("#sidebar").classList.toggle("collapsed");
  });
}

function bindSettings() {
  qs("#themeToggle").addEventListener("click", () => {
    state.theme = state.theme === "dark" ? "light" : "dark";
    saveState();
    applyTheme();
  });

  qs("#saveClinicBtn").addEventListener("click", saveClinicInfo);
  qs("#saveScheduleBtn").addEventListener("click", saveClinicSchedule);
  qs("#saveAdminBtn").addEventListener("click", saveAdminAccount);
  qs("#createAccountBtn").addEventListener("click", createDentistAccount);
}

function bindSectionButtons() {
  qs("#addServiceBtn").addEventListener("click", () => openServiceModal());
  qs("#addAppointmentBtn").addEventListener("click", () => openAppointmentModal());
  qs("#addDentistBtn").addEventListener("click", () => openDentistModal());
  qs("#addPatientBtn").addEventListener("click", () => openPatientModal());

  qs("#dentistSearch").addEventListener("input", renderDentists);
  qs("#dentistSort").addEventListener("change", renderDentists);
  qs("#patientSearch").addEventListener("input", renderPatients);
  qs("#patientSort").addEventListener("change", renderPatients);

  qsa("[data-restore-type]").forEach(btn => {
    btn.addEventListener("click", () => openRestoreModal(btn.dataset.restoreType));
  });
}

function bindSharedModal() {
  qs("#closeModalBtn").addEventListener("click", closeSharedModal);
  qs("#modalBackdrop").addEventListener("click", e => {
    if (e.target.id === "modalBackdrop") closeSharedModal();
  });

  qs("#closeViewBtn").addEventListener("click", closeViewModal);
  qs("#viewBackdrop").addEventListener("click", e => {
    if (e.target.id === "viewBackdrop") closeViewModal();
  });
}

function bindRestoreModal() {
  qs("#closeRestoreBtn").addEventListener("click", closeRestoreModal);
  qs("#restoreBackdrop").addEventListener("click", e => {
    if (e.target.id === "restoreBackdrop") closeRestoreModal();
  });
}

function applyTheme() {
  document.body.classList.toggle("dark", state.theme === "dark");
}

function fillSettingsForms() {
  qs("#clinicName").value = state.clinic.name;
  qs("#clinicPhone").value = state.clinic.phone;
  qs("#clinicEmail").value = state.clinic.email;
  qs("#clinicAddress").value = state.clinic.address;
  qs("#openingTime").value = state.clinic.openingTime;
  qs("#closingTime").value = state.clinic.closingTime;
  qs("#workingDays").value = state.clinic.workingDays;
}

function fillAdminForm() {
  qs("#adminUsername").value = state.admin.username;
  qs("#adminEmail").value = state.admin.email;
}

function renderAdminProfile() {
  const img = qs("#topbarProfileImage");
  if (img) {
    img.src = state.admin.profileImage || "https://i.pravatar.cc/60?img=12";
  }
}

function renderAdminName() {
  const nameEl = qs("#topbarAdminName");
  if (nameEl) {
    nameEl.textContent = state.admin.username || "Admin";
  }
}

function saveClinicInfo() {
  state.clinic.name = qs("#clinicName").value.trim();
  state.clinic.phone = qs("#clinicPhone").value.trim();
  state.clinic.email = qs("#clinicEmail").value.trim();
  state.clinic.address = qs("#clinicAddress").value.trim();
  saveState();
  addNotification("Clinic Updated", "Clinic information was updated.");
  alert("Clinic information saved.");
}

function saveClinicSchedule() {
  state.clinic.openingTime = qs("#openingTime").value;
  state.clinic.closingTime = qs("#closingTime").value;
  state.clinic.workingDays = qs("#workingDays").value;
  saveState();
  addNotification("Schedule Updated", "Clinic schedule was updated.");
  alert("Clinic schedule saved.");
}

function saveAdminAccount() {
  const username = qs("#adminUsername").value.trim();
  const email = qs("#adminEmail").value.trim();
  const password = qs("#adminPassword").value;
  const confirm = qs("#adminConfirm").value;
  const fileInput = qs("#adminProfileImage");
  const uploadName = qs("#profileUploadName");
  const uploadBox = qs("#profileUploadBox");

  if (uploadName) uploadName.textContent = "No file selected";
  if (uploadBox) uploadBox.classList.remove("is-active");

  const file = fileInput ? fileInput.files[0] : null;

  if (!username || !email) {
    alert("Username and email are required.");
    return;
  }

  if (password || confirm) {
    if (password !== confirm) {
      alert("Passwords do not match.");
      return;
    }
  }

  state.admin.username = username;
  state.admin.email = email;

  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      state.admin.profileImage = e.target.result;
      saveState();
      renderAdminProfile();
      renderAdminName();

      qs("#adminPassword").value = "";
      qs("#adminConfirm").value = "";
      fileInput.value = "";

      addNotification("Admin Updated", `${username} updated the admin account.`);
      alert("Admin account updated.");
    };
    reader.readAsDataURL(file);
  } else {
    saveState();
    renderAdminProfile();
    renderAdminName();

    qs("#adminPassword").value = "";
    qs("#adminConfirm").value = "";

    addNotification("Admin Updated", `${username} updated the admin account.`);
    alert("Admin account updated.");
  }
}

function createDentistAccount() {
  const name = qs("#accDentistName").value.trim();
  const email = qs("#accDentistEmail").value.trim();
  const username = qs("#accDentistUsername").value.trim();
  const password = qs("#accDentistPassword").value.trim();

  if (!name || !email || !username || !password) {
    alert("Please fill all dentist account fields.");
    return;
  }

  state.accounts.push({ id: uid(), name, email, username });
  saveState();
  renderAccounts();

  qs("#accDentistName").value = "";
  qs("#accDentistEmail").value = "";
  qs("#accDentistUsername").value = "";
  qs("#accDentistPassword").value = "";

  addNotification("New Dentist Account", `${name} account was created.`);
  alert("Dentist account created.");
}

function renderAll() {
  renderNotifications();
  renderDashboard();
  renderServices();
  renderAppointments();
  renderDentists();
  renderPatients();
  renderAccounts();
  fillSettingsForms();
  fillAdminForm();
  renderAdminProfile();
  renderAdminName();
}

function renderNotifications() {
  const list = qs("#notifList");
  const dot = qs("#notifDot");
  let hasUnread = false;

  list.innerHTML = "";

  state.notifications.forEach(item => {
    if (item.read === false) hasUnread = true;

    const div = document.createElement("div");
    div.className = "notification-item";
    div.innerHTML = `
      <strong>${escapeHtml(item.title)}</strong>
      <p>${escapeHtml(item.body)}</p>
      <span>${escapeHtml(item.time)}</span>
    `;
    list.appendChild(div);
  });

  if (dot) {
    dot.classList.toggle("hidden", !hasUnread);
  }

  const count = qs("#notifCount");
  if (count) {
    count.textContent = String(state.notifications.length);
  }

  const seeAllBtn = qs("#seeAllNotificationsBtn");
  if (seeAllBtn) {
    seeAllBtn.onclick = () => {
      closeFloatingMenus();

      openViewModal(
        "All Notifications",
        state.notifications.length
          ? state.notifications.map(item => `
              <div class="detail-box">
                <strong>${escapeHtml(item.title)}</strong>
                <div>${escapeHtml(item.body)}</div>
                <div style="margin-top:6px;color:var(--muted);">${escapeHtml(item.time)}</div>
              </div>
            `).join("")
          : `<div class="empty-state">No notifications available.</div>`
      );
    };
  }
}

function renderDashboard() {
  const activeAppointments = state.appointments.filter(a => !a.archived);
  const pending = activeAppointments.filter(a => a.status === "Pending").length;
  const approved = activeAppointments.filter(a =>
  ["Approved", "Paid", "Completed"].includes(a.status)
).length;
  const paid = activeAppointments.filter(a => a.status === "Paid").length;
  const completed = activeAppointments.filter(a => a.status === "Completed").length;

  const servicePriceMap = new Map(
    state.services.filter(s => !s.archived).map(s => [s.name, Number(s.price)])
  );

const revenue = activeAppointments.reduce((sum, a) => {
  const online = Number(a.amountPaidOnline || 0);
  const clinic = Number(a.amountPaidInClinic || 0);
  return sum + online + clinic;
}, 0);

  qs("#statAppointments").textContent = String(activeAppointments.length);
  qs("#statPending").textContent = String(pending);
  qs("#statApproved").textContent = String(approved);
  qs("#statRevenue").textContent = formatMoney(revenue);

  const recentBody = qs("#dashboardRecentAppointments");
  recentBody.innerHTML = "";

  const recent = [...activeAppointments]
    .sort((a, b) => dateTimeValue(b.date, b.time) - dateTimeValue(a.date, a.time))
    .slice(0, 12);

  if (!recent.length) {
    recentBody.innerHTML = `<tr><td colspan="5" class="empty-state">No appointments yet.</td></tr>`;
  } else {
    recent.forEach(item => {
      recentBody.insertAdjacentHTML(
        "beforeend",
        `
        <tr>
          <td>${escapeHtml(item.patient)}</td>
          <td>${escapeHtml(item.dentist)}</td>
          <td>${escapeHtml(item.service)}</td>
          <td>${formatDate(item.date)}</td>
          <td>${statusBadge(item.status)}</td>
        </tr>
        `
      );
    });
  }

  const todayBox = qs("#todaySchedule");
  todayBox.innerHTML = "";

  const todayKey = todayISO();
  const todayItems = activeAppointments
    .filter(a => a.date === todayKey)
    .sort((a, b) => a.time.localeCompare(b.time));

  if (!todayItems.length) {
    todayBox.innerHTML = `<div class="empty-state">No appointments today.</div>`;
  } else {
    todayItems.forEach(a => {
      todayBox.insertAdjacentHTML(
        "beforeend",
        `
        <div class="list-item">
          <strong>${formatTime(a.time)} - ${escapeHtml(a.patient)}</strong>
          <span>${escapeHtml(a.service)} with ${escapeHtml(a.dentist)}</span>
        </div>
        `
      );
    });
  }

  const alertsBox = qs("#alertsBox");
  alertsBox.innerHTML = `
    <div class="list-item">
      <strong>${pending} pending appointments</strong>
      <p>Waiting for review or approval.</p>
    </div>
    <div class="list-item">
      <strong>${paid} paid appointments</strong>
      <p>Payments recorded successfully.</p>
    </div>
    <div class="list-item">
      <strong>${completed} completed appointments</strong>
      <p>Treatments marked as finished.</p>
    </div>
    <div class="list-item">
      <strong>${state.patients.filter(p => !p.archived).length} active patients</strong>
      <p>Patient records currently visible.</p>
    </div>
  `;

  bindDashboardSeeMore(todayItems);
}

function bindDashboardSeeMore(todayItems) {
  const scheduleBtn = qs("#seeMoreScheduleBtn");
  const alertsBtn = qs("#seeMoreAlertsBtn");

  if (scheduleBtn) {
    scheduleBtn.onclick = () => {
      openViewModal(
        "Today’s Schedule",
        todayItems.length
          ? todayItems.map(a => `
              <div class="detail-box">
                <strong>${formatTime(a.time)} - ${escapeHtml(a.patient)}</strong>
                <div>${escapeHtml(a.service)}</div>
                <div>${escapeHtml(a.dentist)}</div>
              </div>
            `).join("")
          : `<div class="empty-state">No appointments today.</div>`
      );
    };
  }

  if (alertsBtn) {
    alertsBtn.onclick = () => {
      const activeAppointments = state.appointments.filter(a => !a.archived);
      const pending = activeAppointments.filter(a => a.status === "Pending").length;
      const paid = activeAppointments.filter(a => a.status === "Paid").length;
      const completed = activeAppointments.filter(a => a.status === "Completed").length;

      openViewModal(
        "All Alerts",
        `
          <div class="detail-list">
            <div class="detail-box"><strong>${pending} pending appointments</strong>Waiting for review or approval.</div>
            <div class="detail-box"><strong>${paid} paid appointments</strong>Payments recorded successfully.</div>
            <div class="detail-box"><strong>${completed} completed appointments</strong>Treatments marked as finished.</div>
            <div class="detail-box"><strong>${state.patients.filter(p => !p.archived).length} active patients</strong>Patient records currently visible.</div>
            <div class="detail-box"><strong>${state.dentists.filter(d => !d.archived).length} active dentists</strong>Dentists available in the system.</div>
          </div>
        `
      );
    };
  }
}

function renderServices() {
  const tbody = qs("#servicesTable");
  tbody.innerHTML = "";

  const items = state.services.filter(s => !s.archived);

  if (!items.length) {
    tbody.innerHTML = `<tr><td colspan="3" class="empty-state">No services found.</td></tr>`;
    return;
  }

  items.forEach(service => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${escapeHtml(service.name)}</td>
      <td>${formatMoney(service.price)}</td>
      <td>
        <div class="inline-actions">
          <button class="action-btn edit" type="button" title="Edit">
            <i class="bi bi-pencil"></i>
          </button>
          <button class="action-btn delete" type="button" title="Archive">
            <i class="bi bi-trash"></i>
          </button>
        </div>
      </td>
    `;

    tr.querySelector(".edit").addEventListener("click", () => openServiceModal(service.id));
    tr.querySelector(".delete").addEventListener("click", () => archiveItem("services", service.id));
    tbody.appendChild(tr);
  });
}

function renderAppointments() {
  const tbody = qs("#appointmentsTable");
  tbody.innerHTML = "";

  const items = state.appointments.filter(a => !a.archived);

  if (!items.length) {
    tbody.innerHTML = `<tr><td colspan="7" class="empty-state">No appointments found.</td></tr>`;
    return;
  }

  items
    .sort((a, b) => dateTimeValue(a.date, a.time) - dateTimeValue(b.date, b.time))
    .forEach(item => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${escapeHtml(item.patient)}</td>
        <td>${escapeHtml(item.dentist)}</td>
        <td>${escapeHtml(item.service)}</td>
        <td>${formatDate(item.date)}</td>
        <td>${formatTime(item.time)}</td>
        <td>${statusBadge(item.status)}</td>
        <td class="action-menu-cell">
          <button class="kebab-btn" type="button">
            <i class="bi bi-three-dots-vertical"></i>
          </button>
          <div class="dropdown">
            <button type="button">Edit</button>
            <button type="button" class="danger-text">Archive</button>
          </div>
        </td>
      `;

      const kebab = tr.querySelector(".kebab-btn");
      const menu = tr.querySelector(".dropdown");
      const [editBtn, archiveBtn] = menu.querySelectorAll("button");

      kebab.addEventListener("click", e => {
        e.stopPropagation();
        toggleDropdown(menu, kebab);
      });

      editBtn.addEventListener("click", () => {
        closeAllDropdowns();
        openAppointmentModal(item.id);
      });

      archiveBtn.addEventListener("click", () => {
        closeAllDropdowns();
        archiveItem("appointments", item.id);
      });

      tbody.appendChild(tr);
    });
}

function renderDentists() {
  const grid = qs("#dentistsGrid");
  grid.innerHTML = "";

  const search = qs("#dentistSearch").value.trim().toLowerCase();
  const sort = qs("#dentistSort").value;

  let items = state.dentists.filter(d => !d.archived);

  if (search) {
    items = items.filter(d =>
      d.name.toLowerCase().includes(search) ||
      d.specialty.toLowerCase().includes(search)
    );
  }

  if (sort === "name") {
    items.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sort === "specialty") {
    items.sort((a, b) => a.specialty.localeCompare(b.specialty));
  }

  if (!items.length) {
    grid.innerHTML = `<div class="empty-state panel">No dentists found.</div>`;
    return;
  }

  items.forEach(dentist => {
    const card = document.createElement("article");
    card.className = "person-card";
    card.innerHTML = `
      <div class="menu-wrap">
        <button class="kebab-btn" type="button">
          <i class="bi bi-three-dots-vertical"></i>
        </button>
        <div class="dropdown">
          <button type="button">Edit</button>
          <button type="button" class="danger-text">Archive</button>
        </div>
      </div>

      <div class="person-avatar blue"><i class="bi bi-person-circle"></i></div>
      <h3>${escapeHtml(dentist.name)}</h3>
      <p>${escapeHtml(dentist.specialty)}</p>
      <p>${escapeHtml(dentist.contact)}</p>
      <div class="person-actions">
        <button class="btn primary" type="button">View Info</button>
      </div>
    `;

    const kebab = card.querySelector(".kebab-btn");
    const menu = card.querySelector(".dropdown");
    const [editBtn, archiveBtn] = menu.querySelectorAll("button");
    const viewBtn = card.querySelector(".btn");

    kebab.addEventListener("click", e => {
      e.stopPropagation();
      toggleDropdown(menu, kebab);
    });

    editBtn.addEventListener("click", () => {
      closeAllDropdowns();
      openDentistModal(dentist.id);
    });

    archiveBtn.addEventListener("click", () => {
      closeAllDropdowns();
      archiveItem("dentists", dentist.id);
    });

    viewBtn.addEventListener("click", () => showDentistView(dentist.id));

    grid.appendChild(card);
  });
}

function renderPatients() {
  const grid = qs("#patientsGrid");
  grid.innerHTML = "";

  const search = qs("#patientSearch").value.trim().toLowerCase();
  const sort = qs("#patientSort").value;

  let items = state.patients.filter(p => !p.archived);

  if (search) {
    items = items.filter(p => p.name.toLowerCase().includes(search));
  }

  if (sort === "name") {
    items.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sort === "age") {
    items.sort((a, b) => a.age - b.age);
  }

  if (!items.length) {
    grid.innerHTML = `<div class="empty-state panel">No patients found.</div>`;
    return;
  }

  items.forEach(patient => {
    const card = document.createElement("article");
    card.className = "person-card";
    card.innerHTML = `
      <div class="menu-wrap">
        <button class="kebab-btn" type="button">
          <i class="bi bi-three-dots-vertical"></i>
        </button>
        <div class="dropdown">
          <button type="button">Edit</button>
          <button type="button" class="danger-text">Archive</button>
        </div>
      </div>

      <div class="person-avatar green"><i class="bi bi-person"></i></div>
      <h3>${escapeHtml(patient.name)}</h3>
      <p>${escapeHtml(capitalize(patient.gender))}${patient.age ? ` • ${patient.age} yrs old` : ""}</p>
      <p>${escapeHtml(patient.condition)}</p>
      <div class="person-actions">
        <button class="btn primary" type="button">View Info</button>
      </div>
    `;

    const kebab = card.querySelector(".kebab-btn");
    const menu = card.querySelector(".dropdown");
    const [editBtn, archiveBtn] = menu.querySelectorAll("button");
    const viewBtn = card.querySelector(".btn");

    kebab.addEventListener("click", e => {
      e.stopPropagation();
      toggleDropdown(menu, kebab);
    });

    editBtn.addEventListener("click", () => {
      closeAllDropdowns();
      openPatientModal(patient.id);
    });

    archiveBtn.addEventListener("click", () => {
      closeAllDropdowns();
      archiveItem("patients", patient.id);
    });

    viewBtn.addEventListener("click", () => showPatientView(patient.id));

    grid.appendChild(card);
  });
}

function renderAccounts() {
  const tbody = qs("#accountsTable");
  tbody.innerHTML = "";

  if (!state.accounts.length) {
    tbody.innerHTML = `<tr><td colspan="4" class="empty-state">No dentist accounts found.</td></tr>`;
    return;
  }

  state.accounts.forEach(acc => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${escapeHtml(acc.name)}</td>
      <td>${escapeHtml(acc.email)}</td>
      <td>${escapeHtml(acc.username)}</td>
      <td>
        <div class="inline-actions">
          <button class="action-btn delete" type="button" title="Delete">
            <i class="bi bi-trash"></i>
          </button>
        </div>
      </td>
    `;

    tr.querySelector(".delete").addEventListener("click", () => {
      state.accounts = state.accounts.filter(a => a.id !== acc.id);
      saveState(true);
      renderAccounts();
    });

    tbody.appendChild(tr);
  });
}

function toggleDropdown(menu, anchor) {
  const isOpen = menu.classList.contains("show");
  closeAllDropdowns();
  if (isOpen) return;

  menu.classList.add("show");
  menu.classList.remove("up");

  const menuHeight = menu.offsetHeight || 120;
  const anchorRect = anchor.getBoundingClientRect();
  const bottomSpace = window.innerHeight - (anchorRect.bottom + menuHeight + 8);

  if (bottomSpace < 0) {
    menu.classList.add("up");
  }
}

function closeAllDropdowns() {
  qsa(".dropdown").forEach(d => d.classList.remove("show", "up"));
}

document.addEventListener("click", e => {
  if (!e.target.closest(".menu-wrap") && !e.target.closest(".action-menu-cell")) {
    closeAllDropdowns();
  }
});

function archiveItem(type, id) {
  const item = state[type].find(x => x.id === id);
  if (!item) return;

  if (type === "services") {
    const confirmed = confirm(`Are you sure you want to archive "${item.name}"?`);
    if (!confirmed) return;
  }

  item.archived = true;

  if (type === "patients") {
    const targetName = String(item.name || "").trim().toLowerCase();

    const db = getClinicDb();
    db.appointments = (Array.isArray(db.appointments) ? db.appointments : []).filter(a => {
      const patientName = String(a.patientName || a.patient || "").trim().toLowerCase();
      const isProfileOnly = String(a.status || "").trim() === "Profile Only";
      return !(patientName === targetName && isProfileOnly);
    });
    saveClinicDb(db);
  }

  if (type === "dentists") {
    const targetName = String(item.name || "").trim().toLowerCase();

    const db = getClinicDb();
    db.appointments = (Array.isArray(db.appointments) ? db.appointments : []).filter(a => {
      const dentistName = String(a.dentist || "").trim().toLowerCase();
      const isProfileOnly = String(a.status || "").trim() === "Profile Only";
      return !(dentistName === targetName && isProfileOnly);
    });
    saveClinicDb(db);
  }

  saveState();

  const label = type.slice(0, -1);
  addNotification("Item Archived", `${label.charAt(0).toUpperCase() + label.slice(1)} was archived.`);

  fullAdminSync();
  renderAll();
}

function cleanupBrokenProfileOnlyRecords() {
  const db = getClinicDb();
  const list = Array.isArray(db.appointments) ? db.appointments : [];

  db.appointments = list.filter(a => {
    const status = String(a.status || "").trim();
    const patientName = String(a.patientName || a.patient || "").trim();
    const dentistName = String(a.dentist || "").trim();
    const hasRealAppointmentData = !!(a.service || a.date || a.time || a.schedule);

    if (status !== "Profile Only") return true;

    if (!patientName && !dentistName) return false;
    if (!hasRealAppointmentData) return false;

    return true;
  });

  saveClinicDb(db);
}

function openRestoreModal(type) {
  const body = qs("#restoreBody");
  const title = qs("#restoreTitle");

  const labelMap = {
    services: "Restore Services",
    appointments: "Restore Appointments",
    dentists: "Restore Dentists",
    patients: "Restore Patients"
  };

  title.textContent = labelMap[type] || "Restore Items";
  body.innerHTML = "";

  const items = state[type].filter(item => item.archived);

  if (!items.length) {
    body.innerHTML = `<div class="empty-state">No archived items.</div>`;
  } else {
    const wrap = document.createElement("div");
    wrap.className = "restore-list";

    items.forEach(item => {
      const row = document.createElement("div");
      row.className = "restore-item";
      row.innerHTML = `
        <div>${escapeHtml(restoreItemLabel(type, item))}</div>
        <div class="inline-actions">
          <button class="btn success" type="button">Recover</button>
          <button class="btn danger" type="button">Delete</button>
        </div>
      `;

      const [recoverBtn, deleteBtn] = row.querySelectorAll("button");
      recoverBtn.addEventListener("click", () => recoverItem(type, item.id));
      deleteBtn.addEventListener("click", () => deleteArchivedItem(type, item.id));

      wrap.appendChild(row);
    });

    body.appendChild(wrap);
  }

  qs("#restoreBackdrop").classList.remove("hidden");
}

function closeRestoreModal() {
  qs("#restoreBackdrop").classList.add("hidden");
}

function restoreItemLabel(type, item) {
  if (type === "services") return item.name;
  if (type === "appointments") return `${item.patient} - ${item.service}`;
  return item.name;
}

function recoverItem(type, id) {
  const item = state[type].find(x => x.id === id);
  if (!item) return;

  item.archived = false;
  saveState();
  openRestoreModal(type);

  const label = type.slice(0, -1);
  addNotification("Item Restored", `${label.charAt(0).toUpperCase() + label.slice(1)} was restored.`);

  renderAll();
}

function deleteArchivedItem(type, id) {
  const item = state[type].find(x => x.id === id);
  if (!item) return;

  if (type === "services") {
    const confirmed = confirm(`Are you sure you want to permanently delete "${item.name}"?`);
    if (!confirmed) return;
  }

  state[type] = state[type].filter(x => x.id !== id);
  saveState();
  openRestoreModal(type);

  const label = type.slice(0, -1);
  addNotification("Item Deleted", `${label.charAt(0).toUpperCase() + label.slice(1)} was permanently deleted.`);

  renderAll();
}

function openSharedModal(title, html) {
  qs("#modalTitle").textContent = title;
  qs("#modalBody").innerHTML = html;
  qs("#modalBackdrop").classList.remove("hidden");
}

function closeSharedModal() {
  qs("#modalBackdrop").classList.add("hidden");
  qs("#modalBody").innerHTML = "";
}

function openViewModal(title, html) {
  qs("#viewTitle").textContent = title;
  qs("#viewBody").innerHTML = html;
  qs("#viewBackdrop").classList.remove("hidden");
}

function closeViewModal() {
  qs("#viewBackdrop").classList.add("hidden");
  qs("#viewBody").innerHTML = "";
}

function openServiceModal(id = null) {
  const item = id ? state.services.find(s => s.id === id) : null;

  openSharedModal(
    item ? "Edit Service" : "Add Service",
    `
      <div class="form-grid one">
        <div>
          <label class="label" for="modalServiceName">Service Name</label>
          <input class="input" id="modalServiceName" type="text" value="${item ? escapeAttr(item.name) : ""}" />
        </div>
        <div>
          <label class="label" for="modalServicePrice">Price</label>
          <input class="input" id="modalServicePrice" type="number" min="0" value="${item ? escapeAttr(item.price) : ""}" />
        </div>
        <button class="btn primary" type="button" id="saveServiceModalBtn">${item ? "Save Changes" : "Save Service"}</button>
      </div>
    `
  );

  qs("#saveServiceModalBtn").addEventListener("click", () => {
    const name = qs("#modalServiceName").value.trim();
    const price = Number(qs("#modalServicePrice").value);

    if (!name || Number.isNaN(price) || price < 0) {
      alert("Please enter a valid service name and price.");
      return;
    }

    if (item) {
      item.name = name;
      item.price = price;
      addNotification("Service Updated", `${name} was updated.`);
    } else {
      state.services.push({ id: uid(), name, price, archived: false });
      addNotification("New Service", `${name} was added.`);
    }

    saveState();
    closeSharedModal();
    renderAll();
  });
}
function pushAdminAppointmentsToClinicDb() {
  const clinicAppointments = state.appointments.map(a => ({
    id: a.id || uid(),
    patientName: a.patient,
    patient: a.patient,
    dentist: a.dentist,
    service: a.service,
    date: a.date,
    time: a.time,
    schedule: `${a.date} • ${convert24ToDisplayTime(a.time)}`,
    status: a.status,
    archived: !!a.archived,
    archivedForDentist: !!a.archived,
    archivedForPatient: !!a.archived,
    updatedAt: new Date().toISOString()
  }));

  saveClinicAppointments(clinicAppointments);
}
function openAppointmentModal(id = null) {
  const item = id ? state.appointments.find(a => a.id === id) : null;
  const dentists = state.dentists.filter(d => !d.archived);
  const services = state.services.filter(s => !s.archived);
  const patients = state.patients.filter(p => !p.archived);

  openSharedModal(
    item ? "Edit Appointment" : "Add Appointment",
    `
      <div class="form-grid one">
        <div>
          <label class="label" for="modalPatient">Patient</label>
          <select class="input select" id="modalPatient">
            <option value="">Select patient</option>
            ${patients.map(p => `<option ${item?.patient === p.name ? "selected" : ""}>${escapeHtml(p.name)}</option>`).join("")}
          </select>
        </div>
        <div>
          <label class="label" for="modalDentist">Dentist</label>
          <select class="input select" id="modalDentist">
            <option value="">Select dentist</option>
            ${dentists.map(d => `<option ${item?.dentist === d.name ? "selected" : ""}>${escapeHtml(d.name)}</option>`).join("")}
          </select>
        </div>
        <div>
          <label class="label" for="modalAppointmentService">Service</label>
          <select class="input select" id="modalAppointmentService">
            <option value="">Select service</option>
            ${services.map(s => `<option ${item?.service === s.name ? "selected" : ""}>${escapeHtml(s.name)}</option>`).join("")}
          </select>
        </div>
        <div>
          <label class="label" for="modalAppointmentDate">Date</label>
          <input class="input" id="modalAppointmentDate" type="date" value="${item ? escapeAttr(item.date) : ""}" />
        </div>
        <div>
          <label class="label" for="modalAppointmentTime">Time</label>
          <input class="input" id="modalAppointmentTime" type="time" value="${item ? escapeAttr(item.time) : ""}" />
        </div>
        <div>
          <label class="label" for="modalAppointmentStatus">Status</label>
          <select class="input select" id="modalAppointmentStatus">
            ${["Pending", "Approved", "Paid", "Completed", "Rejected"].map(status => `<option ${item?.status === status ? "selected" : ""}>${status}</option>`).join("")}
          </select>
        </div>
        <button class="btn primary" type="button" id="saveAppointmentModalBtn">${item ? "Save Changes" : "Save Appointment"}</button>
      </div>
    `
  );

qs("#saveAppointmentModalBtn").addEventListener("click", () => {
  const patient = qs("#modalPatient").value;
  const dentist = qs("#modalDentist").value;
  const service = qs("#modalAppointmentService").value;
  const date = qs("#modalAppointmentDate").value;
  const time = qs("#modalAppointmentTime").value;
  const status = qs("#modalAppointmentStatus").value;

  if (!patient || !dentist || !service || !date || !time) {
    alert("Please fill all appointment fields.");
    return;
  }

  const matchedService = state.services.find(s => s.name === service);
  const price = matchedService ? Number(matchedService.price || 0) : 0;

  if (item) {
    Object.assign(item, {
      patient,
      dentist,
      service,
      date,
      time,
      status,
      price,
      remainingBalance: price
    });
    addNotification("Appointment Updated", `${patient} appointment was updated.`);
  } else {
    state.appointments.push({
      id: uid(),
      patient,
      dentist,
      service,
      date,
      time,
      status,
      price,
      paid: false,
      downPayment: 0,
      amountPaidOnline: 0,
      amountPaidInClinic: 0,
      totalCollected: 0,
      remainingBalance: price,
      paymentMethod: "",
      paymentStatus: "Unpaid",
      requiresDownPayment: price >= 5000,
      minimumDownPayment: price >= 5000 ? Math.min(price, 1000) : 0,
      invoiceUnlocked: status === "Approved",
      archived: false
    });
    addNotification("New Appointment", `${patient} booked ${service}.`);
  }

  saveState();
  closeSharedModal();
  renderAll();
});
}
function pushAdminPatientsToClinicState() {
  const clinicAppointments = getClinicAppointments();

  state.patients.forEach(p => {
    const exists = clinicAppointments.some(a => (a.patientName || a.patient || "").trim() === p.name.trim());
    if (!exists) {
      clinicAppointments.push({
        id: uid(),
        patientName: p.name,
        patient: p.name,
        patientPhone: p.contact || "",
        patientAddress: p.address || "",
        age: p.age || "",
        gender: p.gender || "",
        patientCondition: p.condition || "",
        service: "No appointment yet",
        schedule: "",
        status: "Profile Only",
        archived: !!p.archived,
        createdAt: new Date().toISOString()
      });
    }
  });

  saveClinicAppointments(clinicAppointments);
}

function pushAdminDentistsToClinicState() {
  const clinicAppointments = getClinicAppointments();

  state.dentists.forEach(d => {
    const exists = clinicAppointments.some(a => (a.dentist || "").trim() === d.name.trim());
    if (!exists) {
      clinicAppointments.push({
        id: uid(),
        patientName: "",
        dentist: d.name,
        service: "",
        schedule: "",
        status: "Profile Only",
        archived: !!d.archived,
        createdAt: new Date().toISOString()
      });
    }
  });

  saveClinicAppointments(clinicAppointments);
}
function openDentistModal(id = null) {
  const item = id ? state.dentists.find(d => d.id === id) : null;
  let schedules = item ? structuredClone(item.schedules) : [];

  const specialtyOptions = [
    "General Dentist",
    "Orthodontist",
    "Pediatric Dentist",
    "Prosthodontist",
    "Endodontist",
    "Oral Surgeon",
    "Periodontist",
    "Cosmetic Dentist"
  ];

  function renderModal() {
    openSharedModal(
      item ? "Edit Dentist" : "Add Dentist",
      `
        <div class="form-grid one">
          <div>
            <label class="label" for="modalDentistName">Full Name</label>
            <input class="input" id="modalDentistName" type="text" value="${item ? escapeAttr(item.name) : ""}" />
          </div>

          <div>
            <label class="label" for="modalDentistSpecialty">Specialty</label>
            <select class="input select" id="modalDentistSpecialty">
              <option value="">Select specialty</option>
              ${specialtyOptions.map(spec => `
                <option value="${escapeAttr(spec)}" ${item?.specialty === spec ? "selected" : ""}>
                  ${escapeHtml(spec)}
                </option>
              `).join("")}
            </select>
          </div>

          <div>
            <label class="label" for="modalDentistContact">Contact</label>
            <input class="input" id="modalDentistContact" type="text" maxlength="11" value="${item ? escapeAttr(item.contact) : ""}" />
          </div>

          <div class="form-grid three">
            <select class="input select" id="schedDay">
              <option value="">Select day</option>
              ${["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"].map(day => `<option>${day}</option>`).join("")}
            </select>
            <input class="input" id="schedStart" type="time" />
            <input class="input" id="schedEnd" type="time" />
          </div>

          <button class="btn secondary" type="button" id="addScheduleBtn">Add Schedule</button>

          <div id="schedListWrap">
            ${renderScheduleListHtml(schedules)}
          </div>

          <button class="btn primary" type="button" id="saveDentistModalBtn">${item ? "Save Changes" : "Save Dentist"}</button>
        </div>
      `
    );

    qs("#addScheduleBtn").addEventListener("click", () => {
      const day = qs("#schedDay").value;
      const start = qs("#schedStart").value;
      const end = qs("#schedEnd").value;

      if (!day || !start || !end) {
        alert("Please complete the schedule fields.");
        return;
      }

      if (schedules.some(s => s.day === day)) {
        alert("That day is already added.");
        return;
      }

      schedules.push({ day, start, end });
      renderModal();
    });

    qsa("[data-remove-schedule]").forEach(btn => {
      btn.addEventListener("click", () => {
        schedules.splice(Number(btn.dataset.removeSchedule), 1);
        renderModal();
      });
    });

    qs("#saveDentistModalBtn").addEventListener("click", () => {
      const name = qs("#modalDentistName").value.trim();
      const specialty = qs("#modalDentistSpecialty").value;
      const contact = qs("#modalDentistContact").value.trim();

      if (!name || !specialty || !contact) {
        alert("Please fill all dentist fields.");
        return;
      }

      if (!/^[0-9]{11}$/.test(contact)) {
        alert("Contact number must be exactly 11 digits.");
        return;
      }

      if (!schedules.length) {
        alert("Please add at least one schedule.");
        return;
      }

      if (item) {
        Object.assign(item, { name, specialty, contact, schedules });
        addNotification("Dentist Updated", `${name} profile was updated.`);
      } else {
        state.dentists.push({ id: uid(), name, specialty, contact, schedules, archived: false });
        addNotification("New Dentist", `${name} was added.`);
      }

      saveState();
      closeSharedModal();
      renderAll();
    });
  }

  renderModal();
}

function renderScheduleListHtml(schedules) {
  if (!schedules.length) {
    return `<div class="empty-state">No schedules added yet.</div>`;
  }

  return schedules.map((s, index) => `
    <div class="restore-item">
      <div>${escapeHtml(s.day)} • ${formatTime(s.start)} - ${formatTime(s.end)}</div>
      <button class="btn danger" type="button" data-remove-schedule="${index}">Remove</button>
    </div>
  `).join("");
}

function openPatientModal(id = null) {
  const item = id ? state.patients.find(p => p.id === id) : null;

  const conditionOptions = [
    "Tooth Decay",
    "Braces Adjustment",
    "Routine Checkup",
    "Gingivitis",
    "Tooth Sensitivity",
    "Dental Cleaning",
    "Tooth Extraction",
    "Root Canal",
    "Mouth Ulcer",
    "Broken Tooth"
  ];

  openSharedModal(
    item ? "Edit Patient" : "Add Patient",
    `
      <div class="form-grid one">
        <div>
          <label class="label" for="modalPatientName">Name</label>
          <input class="input" id="modalPatientName" type="text" value="${item ? escapeAttr(item.name) : ""}" />
        </div>

        <div>
          <label class="label" for="modalPatientAge">Age</label>
          <input class="input" id="modalPatientAge" type="number" min="0" value="${item ? escapeAttr(item.age) : ""}" />
        </div>

        <div>
          <label class="label" for="modalPatientGender">Gender</label>
          <select class="input select" id="modalPatientGender">
            <option value="">Select gender</option>
            ${["Male", "Female"].map(g => `
              <option value="${g}" ${item?.gender === g ? "selected" : ""}>${g}</option>
            `).join("")}
          </select>
        </div>

        <div>
          <label class="label" for="modalPatientCondition">Condition</label>
          <select class="input select" id="modalPatientCondition">
            <option value="">Select condition</option>
            ${conditionOptions.map(condition => `
              <option value="${escapeAttr(condition)}" ${item?.condition === condition ? "selected" : ""}>
                ${escapeHtml(condition)}
              </option>
            `).join("")}
          </select>
        </div>

        <div>
          <label class="label" for="modalPatientAddress">Address</label>
          <input class="input" id="modalPatientAddress" type="text" value="${item ? escapeAttr(item.address) : ""}" />
        </div>

        <div>
          <label class="label" for="modalPatientContact">Contact</label>
          <input class="input" id="modalPatientContact" type="text" maxlength="11" value="${item ? escapeAttr(item.contact) : ""}" />
        </div>

        <button class="btn primary" type="button" id="savePatientModalBtn">${item ? "Save Changes" : "Save Patient"}</button>
      </div>
    `
  );

  qs("#savePatientModalBtn").addEventListener("click", () => {
    const name = qs("#modalPatientName").value.trim();
    const age = Number(qs("#modalPatientAge").value);
    const gender = qs("#modalPatientGender").value;
    const condition = qs("#modalPatientCondition").value;
    const address = qs("#modalPatientAddress").value.trim();
    const contact = qs("#modalPatientContact").value.trim();

    if (!name || Number.isNaN(age) || !gender || !condition || !address || !contact) {
      alert("Please fill all patient fields.");
      return;
    }

    if (!/^[0-9]{11}$/.test(contact)) {
      alert("Contact number must be exactly 11 digits.");
      return;
    }

    if (item) {
      Object.assign(item, { name, age, gender, condition, address, contact });
      addNotification("Patient Updated", `${name} record was updated.`);
    } else {
      state.patients.push({ id: uid(), name, age, gender, condition, address, contact, archived: false });
      addNotification("New Patient", `${name} was added.`);
    }

    saveState();
    closeSharedModal();
    renderAll();
  });
}

function showPatientView(id) {
  const p = state.patients.find(x => x.id === id);
  if (!p) return;

  openViewModal(
    p.name,
    `
      <div class="detail-list">
        <div class="detail-box"><strong>Age</strong>${p.age} yrs old</div>
        <div class="detail-box"><strong>Gender</strong>${escapeHtml(capitalize(p.gender))}</div>
        <div class="detail-box"><strong>Condition</strong>${escapeHtml(p.condition)}</div>
        <div class="detail-box"><strong>Address</strong>${escapeHtml(p.address)}</div>
        <div class="detail-box"><strong>Contact</strong>${escapeHtml(p.contact)}</div>
      </div>
    `
  );
}

function showDentistView(id) {
  const d = state.dentists.find(x => x.id === id);
  if (!d) return;

  openViewModal(
    d.name,
    `
      <div class="detail-list">
        <div class="detail-box"><strong>Specialty</strong>${escapeHtml(d.specialty)}</div>
        <div class="detail-box"><strong>Contact</strong>${escapeHtml(d.contact)}</div>
        <div class="detail-box">
          <strong>Schedules</strong>
          ${d.schedules.map(s => `<div>${escapeHtml(s.day)} • ${formatTime(s.start)} - ${formatTime(s.end)}</div>`).join("")}
        </div>
      </div>
    `
  );
}

function formatMoney(value) {
  return "₱" + Number(value || 0).toLocaleString();
}

function formatDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr + "T00:00:00");
  if (Number.isNaN(d.getTime())) return dateStr;

  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
}

function formatTime(timeStr) {
  if (!timeStr) return "";
  const [h, m] = timeStr.split(":");
  const hour = Number(h);
  const suffix = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${m} ${suffix}`;
}

function dateTimeValue(dateStr, timeStr) {
  return new Date(`${dateStr}T${timeStr || "00:00"}`).getTime();
}

function todayISO() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function statusBadge(status) {
  const key = String(status).toLowerCase();
  let cls = "status-pending";

  if (key === "approved") cls = "status-approved";
  else if (key === "paid") cls = "status-paid";
  else if (key === "completed") cls = "status-completed";
  else if (key === "rejected") cls = "status-rejected";

  return `<span class="status-pill ${cls}">${escapeHtml(status)}</span>`;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function escapeAttr(value) {
  return escapeHtml(value);
}

function bindProfileUploadUI() {
  const input = qs("#adminProfileImage");
  const trigger = qs("#profileUploadTrigger");
  const nameEl = qs("#profileUploadName");
  const box = qs("#profileUploadBox");

  if (!input || !trigger || !nameEl || !box) return;

  trigger.addEventListener("click", () => input.click());

  input.addEventListener("change", () => {
    const file = input.files && input.files[0];

    if (file) {
      nameEl.textContent = file.name;
      box.classList.add("is-active");
    } else {
      nameEl.textContent = "No file selected";
      box.classList.remove("is-active");
    }
  });
}
function capitalize(text) {
  if (!text) return "";
  return text.charAt(0).toUpperCase() + text.slice(1);
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

function convert24ToDisplayTime(time24) {
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
    ? convert24ToDisplayTime(timeValue)
    : normalizeTimeDisplay(timeValue);

  return safeDate && safeTime ? `${safeDate} • ${safeTime}` : safeDate || safeTime;
}
function syncAdminAppointmentsFromClinicDb() {
  const clinicAppointments = getClinicAppointments();

  state.appointments = clinicAppointments
    .filter(item => String(item.status || "").trim() !== "Profile Only")
    .map(item => {
      const schedule = String(item.schedule || "");
      const [scheduleDate = "", rawScheduleTime = ""] = schedule.split("•").map(s => s.trim());
      const scheduleTime = normalizeTimeDisplay(rawScheduleTime);

      const price = Number(item.price || 0);
      const amountPaidOnline = Number(item.amountPaidOnline || 0);
      const amountPaidInClinic = Number(item.amountPaidInClinic || 0);
      const totalCollected = Number(
        item.totalCollected != null
          ? item.totalCollected
          : amountPaidOnline + amountPaidInClinic
      );

      const requiresDownPayment =
        item.requiresDownPayment != null
          ? !!item.requiresDownPayment
          : price >= 5000;

      const minimumDownPayment =
        Number(item.minimumDownPayment || 0) > 0
          ? Number(item.minimumDownPayment)
          : (requiresDownPayment ? Math.min(price, 1000) : 0);

      let paymentStatus = item.paymentStatus || "Unpaid";
      if (totalCollected <= 0) paymentStatus = "Unpaid";
      else if (totalCollected >= price) paymentStatus = "Paid";
      else paymentStatus = "Partial";

      return {
        id: item.id || uid(),
        patient: item.patientName || item.patient || "Unknown Patient",
        dentist: item.dentist || "Assigned Dentist",
        service: item.service || "Consultation",

        date: item.date || scheduleDate || "",
        time: item.time
          ? convertDisplayTimeTo24(item.time)
          : convertDisplayTimeTo24(scheduleTime) || "",

        schedule: buildSchedule(
          item.date || scheduleDate || "",
          item.time || scheduleTime || ""
        ),

        status: item.status || "Pending",
        archived: item.archived === true || item.archived === "true",
        archivedForDentist: item.archivedForDentist === true || item.archivedForDentist === "true",
        archivedForPatient: item.archivedForPatient === true || item.archivedForPatient === "true",

        // keep ALL financial fields
        price,
        paid: totalCollected >= price,
        downPayment: Number(item.downPayment || 0),
        amountPaidOnline,
        amountPaidInClinic,
        totalCollected,
        remainingBalance: Math.max(0, price - totalCollected),
        paymentMethod: item.paymentMethod || "",
        paymentStatus,
        requiresDownPayment,
        minimumDownPayment,
        invoiceUnlocked: !!item.invoiceUnlocked,
        revenueCountedOnline: Number(item.revenueCountedOnline || 0),
        revenueCountedClinic: Number(item.revenueCountedClinic || 0),

        review: item.review || null,
        rating: item.rating || null,
        updatedAt: item.updatedAt || "",
        completedAt: item.completedAt || ""
      };
    });
}
function getSharedPatients() {
  const db = getClinicDb();
  return Array.isArray(db.patients) ? db.patients : [];
}
function removeBrokenPatientCompletely(targetName) {
  const safeName = String(targetName || "").trim().toLowerCase();
  if (!safeName) return;

  state.patients = (state.patients || []).filter(
    p => String(p.name || "").trim().toLowerCase() !== safeName
  );

  const db = getClinicDb();

  db.appointments = (Array.isArray(db.appointments) ? db.appointments : []).filter(a => {
    const patientName = String(a.patientName || a.patient || "").trim().toLowerCase();
    return patientName !== safeName;
  });

  db.archivedAppointments = (Array.isArray(db.archivedAppointments) ? db.archivedAppointments : []).filter(a => {
    const patientName = String(a.patientName || a.patient || "").trim().toLowerCase();
    return patientName !== safeName;
  });

  db.rescheduleRequests = (Array.isArray(db.rescheduleRequests) ? db.rescheduleRequests : []).filter(r => {
    const patientName = String(r.patientName || "").trim().toLowerCase();
    return patientName !== safeName;
  });

  db.patients = (Array.isArray(db.patients) ? db.patients : []).filter(
    p => String(p.name || "").trim().toLowerCase() !== safeName
  );

  saveClinicDb(db);
  saveState(true);
  fullAdminSync();
  renderAll();
}
