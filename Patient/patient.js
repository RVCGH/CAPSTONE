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

const currentPatientUser = getCurrentUser();

if (!currentPatientUser) {
  window.location.replace("../Landing/landing.html");
} else if (currentPatientUser.role !== "patient") {
  window.location.replace("../Landing/landing.html");
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
const services = [
    {
        name: "Enhanced Infection Control",
        price: 300,
        duration: "15 mins",
        description: "Our signature safety protocol involving hospital-grade sterilization of all instruments and continuous room disinfection to ensure a germ-free environment.",
        includes: ["Sterilized instruments", "Clinic-wide disinfection", "Protective equipment use"]
    },
    {
        name: "Consultation",
        price: 500,
        duration: "30 mins",
        description: "A thorough evaluation of your current oral health, including a visual exam and professional advice on necessary treatments or preventive care.",
        includes: ["Dental examination", "Oral health assessment", "Treatment planning"]
    },
    {
        name: "Oral Prophylaxis",
        price: 1000,
        duration: "45 mins",
        description: "A professional cleaning session to remove stubborn plaque and tartar buildup that regular brushing cannot reach, finished with a high-shine polish.",
        includes: ["Teeth cleaning", "Plaque & tartar removal", "Polishing"]
    },
    {
        name: "Restorative Treatment",
        price: 800,
        duration: "45 mins",
        description: "Commonly known as a filling, this procedure repairs a decayed or damaged tooth using tooth-colored composite resin to restore its strength and appearance.",
        includes: ["Cavity cleaning", "Tooth filling", "Tooth restoration"]
    },
    {
        name: "Tooth Extraction",
        price: 1000,
        duration: "30-45 mins",
        description: "Safe and gentle removal of a damaged or problematic tooth under local anesthesia to prevent further pain or infection.",
        includes: ["Local anesthesia", "Tooth removal", "Post-extraction care"]
    },
    {
        name: "Odontectomy",
        price: 10000,
        duration: "1-2 hours",
        description: "A specialized surgical procedure typically used for impacted wisdom teeth that are trapped under the gum line or bone.",
        includes: ["Surgical extraction", "Wisdom tooth removal", "Sutures if needed"]
    },
    {
        name: "Root Canal Treatment",
        price: 6000,
        duration: "1.5 hours",
        description: "An advanced procedure designed to save a severely decayed or infected tooth by removing the damaged pulp and sealing the internal canal.",
        includes: ["Infection removal", "Canal cleaning", "Tooth sealing"]
    },
    {
        name: "Complete Denture",
        price: 15000,
        duration: "Multiple Visits",
        description: "A full-coverage prosthetic solution for patients missing all teeth in an arch, custom-molded for a natural look and comfortable fit.",
        includes: ["Full denture fitting", "Custom molding", "Bite adjustment"]
    },
    {
        name: "Partial Denture (Stayplate)",
        price: 6500,
        duration: "2-3 Visits",
        description: "An affordable, removable acrylic plate used to replace one or several missing teeth, ideal for temporary or budget-friendly restoration.",
        includes: ["Partial denture creation", "Lightweight material", "Basic fitting"]
    },
    {
        name: "Partial Denture (Casted)",
        price: 12000,
        duration: "3-4 Visits",
        description: "A high-durability partial denture featuring a metal framework for superior strength, stability, and a thinner, more comfortable profile.",
        includes: ["Metal framework denture", "Precise fitting", "Durable design"]
    },
    {
        name: "Flexible Denture",
        price: 16000,
        duration: "2-3 Visits",
        description: "The most comfortable denture option, made from a premium nylon material that adapts to the shape of your gums and lacks visible metal clasps.",
        includes: ["Flexible material denture", "Comfort fit design", "Aesthetic finish"]
    },
    {
        name: "Crowns and Bridges",
        price: 6000,
        duration: "2 Visits",
        description: "Fixed prosthetic devices used to cover a damaged tooth (Crown) or bridge the gap created by one or more missing teeth.",
        includes: ["Tooth restoration", "Crown or bridge placement", "Bite alignment"]
    },
    {
        name: "Orthodontic Treatment",
        price: 60000,
        duration: "12-24 Months",
        description: "Comprehensive alignment correction using traditional braces. This price typically covers the installation and start of your journey to a perfect smile.",
        includes: ["Braces installation", "Alignment correction", "Monthly adjustments"]
    },
    {
        name: "Retainers",
        price: 6000,
        duration: "1 Week",
        description: "Custom-made appliances worn after orthodontic treatment to prevent teeth from shifting back to their original positions.",
        includes: ["Custom retainer", "Teeth alignment support", "Post-braces maintenance"]
    },
    {
        name: "Mouth Guard",
        price: 6000,
        duration: "1 Week",
        description: "A custom-fitted protective device for athletes or patients who grind their teeth (bruxism) at night to prevent dental wear and injury.",
        includes: ["Custom mouth guard", "Protection for teeth", "Comfort fit"]
    },
    {
        name: "Whitening",
        price: 12000,
        duration: "1 hour",
        description: "A high-strength professional bleaching treatment that removes deep stains caused by food, coffee, or smoking, brightening your smile by several shades.",
        includes: ["Teeth bleaching", "Stain removal", "Shade enhancement"]
    },
    {
        name: "Periapical X-Ray",
        price: 500,
        duration: "10 mins",
        description: "A focused X-ray that shows the entire tooth from the crown to the end of the root, essential for diagnosing infections or root issues.",
        includes: ["Tooth imaging", "Root analysis", "Diagnostic results"]
    },
    {
        name: "Panoramic X-Ray",
        price: 1000,
        duration: "15 mins",
        description: "A wide-angle X-ray of the entire jaw, providing a comprehensive view of all teeth, jawbones, and sinuses in a single image.",
        includes: ["Full mouth scan", "Jaw imaging", "Comprehensive diagnosis"]
    }
];

// =============================
// SHARED CLINIC SYNC LAYER
// Paste this in BOTH patient and dentist JS
// =============================
const CLINIC_SYNC_KEYS = {
  appointments: "appointments",
  archivedAppointments: "archivedAppointments",
  rescheduleRequests: "rescheduleRequests",
  pendingPayment: "pendingPayment",
  patientNotifications: "patientNotifications",
  dentistNotifications: "dentistNotifications",
  clinicSyncStamp: "clinicSyncStamp"
};

function getClinicData(key, fallback = []) {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback;
  } catch {
    return fallback;
  }
}

function setClinicData(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
  touchClinicSync();
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

function getPatientNotificationsShared() {
  const list = getClinicData(CLINIC_SYNC_KEYS.patientNotifications, []);
  return Array.isArray(list) ? list : [];
}

function savePatientNotificationsShared(list) {
  setClinicData(CLINIC_SYNC_KEYS.patientNotifications, list);
}

function getDentistNotificationsShared() {
  const list = getClinicData(CLINIC_SYNC_KEYS.dentistNotifications, []);
  return Array.isArray(list) ? list : [];
}

function saveDentistNotificationsShared(list) {
  setClinicData(CLINIC_SYNC_KEYS.dentistNotifications, list);
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

function markSharedNotificationsRead(type = "patient") {
  const key =
    type === "dentist"
      ? CLINIC_SYNC_KEYS.dentistNotifications
      : CLINIC_SYNC_KEYS.patientNotifications;

  const list = getClinicData(key, []).map(item => ({
    ...item,
    read: true
  }));

  setClinicData(key, list);
}


// Automatically refresh page sections when the other page changes localStorage
function initCrossPageSync(refreshFn) {
  window.addEventListener("storage", (event) => {
    const watchedKeys = [
      CLINIC_SYNC_KEYS.appointments,
      CLINIC_SYNC_KEYS.archivedAppointments,
      CLINIC_SYNC_KEYS.rescheduleRequests,
      CLINIC_SYNC_KEYS.pendingPayment,
      CLINIC_SYNC_KEYS.userProfileData,
      CLINIC_SYNC_KEYS.patientNotifications,
      CLINIC_SYNC_KEYS.dentistNotifications,
      CLINIC_SYNC_KEYS.clinicSyncStamp
    ];

    if (watchedKeys.includes(event.key)) {
      if (typeof refreshFn === "function") {
        refreshFn();
      }
    }
  });
}

    // ✅ BILLING FORM
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
// NAVIGATION
/**
 * Handles section switching and sidebar highlighting
 * @param {string} id - The ID of the content section to show
 */
function showSection(id) {
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));

    const target = document.getElementById(id);
    if (target) {
        target.classList.add('active');
    }

    let navId = '';

    if (id === 'dashboard') navId = 'link-dash';
    else if (id === 'book-apt') navId = 'link-book';
    else if (id === 'my-appointments') navId = 'link-appointments';
    else if (id === 'history') navId = 'link-history';
    else if (id === 'services') navId = 'link-services';
    else if (id === 'archive') navId = 'link-archive';
    else if (id === 'profile') navId = 'link-profile';
    else if (id === 'billing') navId = 'link-book';

    const navLink = document.getElementById(navId);
    if (navLink) {
        navLink.classList.add('active');
    }
}function cleanDuplicateMeridiem(value = "") {
    return String(value)
        .replace(/\b(AM)\s*\1\b/gi, "AM")
        .replace(/\b(PM)\s*\1\b/gi, "PM")
        .replace(/AMAM/gi, "AM")
        .replace(/PMPM/gi, "PM")
        .trim();
}

function normalizeAppointmentSchedule(apt) {
    if (!apt) return apt;

    const fixed = { ...apt };

    if (fixed.schedule) {
        const parts = fixed.schedule.split("•").map(s => s.trim());

        const datePart = parts[0] || "";
        const timePart = cleanDuplicateMeridiem(parts[1] || "");

        fixed.schedule = `${datePart} • ${timePart}`;
    }

    return fixed;
}

/**
 * INITIALIZATION: 
 * This ensures the Dashboard is active when the page first opens.
 */
document.addEventListener('DOMContentLoaded', () => {
    // Calling your function here fixes the "no highlight on load" issue
    showSection('dashboard'); 
});
// SERVICES GRID
// SERVICES GRID - Updated to include Overview button
// RENDER THE GRID (In the Services Section)
function renderServices() {
    const grid = document.getElementById('serviceGrid');
    grid.innerHTML = "";

    services.forEach(s => {
        grid.innerHTML += `
            <div class="service-card shadow-sm border-0">
                <i class="bi bi-shield-check text-primary fs-1"></i>
                <h4 class="mt-3 fw-bold">${s.name}</h4>
                <span class="price-tag mb-3">₱${s.price.toLocaleString()}</span>
                
                <div class="d-grid gap-2 w-100 px-3 pb-3">
                    <button class="btn-gradient mb-1" onclick="goToBooking('${s.name}')">
                        Book Appointment
                    </button>
                    <button class="btn btn-link btn-sm text-decoration-none text-muted fw-bold" 
                            data-bs-toggle="offcanvas" 
                            data-bs-target="#serviceDetailsPanel"
                            onclick="populateOverviewPanel('${s.name}')">
                        View Overview
                    </button>
                </div>
            </div>
        `;
    });
}
function renderSharedNotifications(type = "patient") {
  const listEl = document.getElementById("notifList");
  const allListEl = document.getElementById("allNotifList");
  const dotEl = document.querySelector(".notif-wrapper .dot");

  if (!listEl) return;

  const notifications =
    type === "dentist"
      ? getDentistNotificationsShared()
      : getPatientNotificationsShared();

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
        <span class="notif-item-title">${item.text}</span>
        <span class="notif-item-time">${new Date(item.createdAt).toLocaleString()}</span>
      `;
      listEl.appendChild(li);
    });

    if (allListEl) {
      notifications.forEach(item => {
        const li = document.createElement("li");
        li.innerHTML = `
          <span class="notif-item-title">${item.text}</span>
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
// POPULATE THE OVERVIEW SIDEBAR
function populateOverviewPanel(serviceName) {
    // Look up data directly from the services array, NOT from the 'selectedServiceObj'
    const service = services.find(s => s.name === serviceName);
    
    if (service) {
        document.getElementById('panelTitle').innerText = service.name;
        document.getElementById('panelDescription').innerText = service.description;
        
        // Ensure the Overview Sidebar uses its own ID: 'panelIncludes'
        const list = document.getElementById('panelIncludes');
        
        if (list) {
            list.innerHTML = ""; // Clear only the Sidebar list
            service.includes.forEach(item => {
                const li = document.createElement('li');
                li.className = "mb-2 d-flex align-items-center list-unstyled";
                li.innerHTML = `
                    <i class="bi bi-check-circle-fill text-success me-2"></i>
                    <span class="small ms-2">${item}</span>
                `;
                list.appendChild(li);
            });
        }
    }
}


// POPULATE SELECT
function populateSelect() {
    const select = document.getElementById('serviceSelect');
    select.innerHTML = "";

    services.forEach(s => {
        select.innerHTML += `<option>${s.name}</option>`;
    });
}

// BOOKING


function openBilling(appointment) {
  const freshAppointment =
    typeof appointment === "object" && appointment?.id
      ? getAppointmentById(appointment.id)
      : getAppointmentById(appointment);

  if (!freshAppointment || !freshAppointment.id) {
    showToast("Appointment not found ❗");
    return;
  }

  if (freshAppointment.status !== "Approved") {
    showToast("Payment is only available after the clinic approves the appointment.");
    return;
  }

  const item = normalizeAppointmentFinancials(freshAppointment);

  localStorage.setItem("pendingPayment", JSON.stringify(item));

  const totalEl = document.getElementById("billTotal");
  const downEl = document.getElementById("billDown");
  const balanceEl = document.getElementById("billRemaining");
  const noteEl = document.getElementById("billingNote");

  if (totalEl) totalEl.textContent = `₱${item.price.toLocaleString()}`;
    if (downEl) {
    const suggestedAmount =
        item.paymentStatus === "Partial"
        ? item.remainingBalance
        : (item.requiresDownPayment ? item.minimumDownPayment : item.remainingBalance);

    downEl.value = suggestedAmount > 0 ? String(suggestedAmount) : "";
    downEl.dataset.lastOnlineAmount = downEl.value;
    downEl.min = item.requiresDownPayment ? String(item.minimumDownPayment) : "1";
    downEl.max = String(item.remainingBalance);
    }

  if (balanceEl) {
    balanceEl.textContent = `₱${item.remainingBalance.toLocaleString()}`;
  }

  if (noteEl) {
    if (item.paymentStatus === "Paid") {
      noteEl.textContent = "This appointment is already fully paid.";
    } else if (item.requiresDownPayment && item.paymentStatus === "Unpaid") {
      noteEl.textContent =
        `This service requires at least ₱${item.minimumDownPayment.toLocaleString()} down payment after approval.`;
    } else if (item.paymentStatus === "Partial") {
      noteEl.textContent =
        `Remaining balance: ₱${item.remainingBalance.toLocaleString()}.`;
    } else {
      noteEl.textContent =
        "You may pay online now, or pay later at the clinic.";
    }
  }

  showSection?.("billing");
}
//BILLING FORM

// =============================
// SHARED APPOINTMENT DATA LAYER
// USE THIS EVERYWHERE IN PATIENT PAGE
// =============================
function getAppointmentsShared() {
  const db = getClinicDb();
  const dbList = Array.isArray(db.appointments) ? db.appointments : [];
  const legacyList = getClinicData(CLINIC_SYNC_KEYS.appointments, []);

  // Prefer DB, but fall back safely
  if (dbList.length) return dbList;
  return Array.isArray(legacyList) ? legacyList : [];
}

function saveAppointmentsShared(list) {
  const safeList = Array.isArray(list) ? list : [];

  const db = getClinicDb();
  db.appointments = safeList;
  saveClinicDb(db);

  // keep old key mirrored so older parts of your UI still work
  setClinicData(CLINIC_SYNC_KEYS.appointments, safeList);
  localStorage.setItem("appointments", JSON.stringify(safeList));
}

function getArchivedAppointmentsShared() {
  const db = getClinicDb();
  const dbList = Array.isArray(db.archivedAppointments) ? db.archivedAppointments : [];
  const legacyList = getClinicData(CLINIC_SYNC_KEYS.archivedAppointments, []);

  if (dbList.length) return dbList;
  return Array.isArray(legacyList) ? legacyList : [];
}

function saveArchivedAppointmentsShared(list) {
  const safeList = Array.isArray(list) ? list : [];

  const db = getClinicDb();
  db.archivedAppointments = safeList;
  saveClinicDb(db);

  setClinicData(CLINIC_SYNC_KEYS.archivedAppointments, safeList);
  localStorage.setItem("archivedAppointments", JSON.stringify(safeList));
}

function getRescheduleRequestsShared() {
  const db = getClinicDb();
  const dbList = Array.isArray(db.rescheduleRequests) ? db.rescheduleRequests : [];
  const legacyList = getClinicData(CLINIC_SYNC_KEYS.rescheduleRequests, []);

  if (dbList.length) return dbList;
  return Array.isArray(legacyList) ? legacyList : [];
}

function saveRescheduleRequestsShared(list) {
  const safeList = Array.isArray(list) ? list : [];

  const db = getClinicDb();
  db.rescheduleRequests = safeList;
  saveClinicDb(db);

  setClinicData(CLINIC_SYNC_KEYS.rescheduleRequests, safeList);
  localStorage.setItem("rescheduleRequests", JSON.stringify(safeList));
}
function getCurrentReschedulableAppointment() {
    const appointments = getAppointmentsShared();

    const candidates = appointments
        .filter(a =>
            a &&
            a.schedule &&
            a.service &&
            a.archivedForPatient !== true &&
            a.archived !== true &&
            ["Approved", "Upcoming"].includes(String(a.status || "").trim())
        )
        .map(a => ({
            ...a,
            parsedDate: parseAppointmentDateTime(a.schedule)
        }))
        .filter(a => a.parsedDate);

    if (!candidates.length) return null;

    candidates.sort((a, b) => a.parsedDate - b.parsedDate);

    const now = new Date();
    return candidates.find(a => a.parsedDate >= now) || candidates[0];
}
function updateRescheduleModalText() {
    const helperText = document.getElementById("rescheduleHelperText");
    if (!helperText) return;

    const selectedAppointmentId = document.getElementById("rescheduleAppointmentId")?.value || "";
    const appointments = getAppointmentsShared();

    const targetAppointment = selectedAppointmentId
        ? appointments.find(a => String(a.id) === String(selectedAppointmentId))
        : getCurrentReschedulableAppointment();

    if (!targetAppointment || !targetAppointment.service) {
        helperText.innerHTML = `Please select a new preferred date for your <strong>appointment</strong>.`;
        return;
    }

    helperText.innerHTML = `Please select a new preferred date for your <strong>${targetAppointment.service}</strong>.`;
}
function matchesRecordFilter(record, searchValue, statusValue) {
    const search = String(searchValue || "").trim().toLowerCase();
    const status = String(statusValue || "").trim();

    const service = String(record.service || "").toLowerCase();
    const schedule = String(record.schedule || "").toLowerCase();
    const recordStatus = String(record.status || "").trim();

    const searchMatch =
        !search ||
        service.includes(search) ||
        schedule.includes(search);

    const statusMatch =
        !status || recordStatus === status;

    return searchMatch && statusMatch;
}

function getPatientFilterValues() {
  return {
    appointmentsSearch: document.getElementById("appointmentsSearchInput")?.value || "",
    appointmentsStatus: document.getElementById("appointmentsStatusFilter")?.dataset.value || "",
    historySearch: document.getElementById("historySearchInput")?.value || "",
    historyStatus: document.getElementById("historyStatusFilter")?.dataset.value || "",
    archiveSearch: document.getElementById("archiveSearchInput")?.value || "",
    archiveStatus: document.getElementById("archiveStatusFilter")?.dataset.value || ""
  };
}

function initPatientRecordFilters() {
    const searchIds = [
        "appointmentsSearchInput",
        "historySearchInput",
        "archiveSearchInput"
    ];

    searchIds.forEach(id => {
        const el = document.getElementById(id);
        if (!el) return;

        el.addEventListener("input", () => {
            loadAppointmentsUI();
            loadArchiveUI();
        });
    });
}

function moveAppointmentToArchive(id, source = "patient") {
    const appointments = getAppointmentsShared();
    const archive = getArchivedAppointmentsShared();

    const index = appointments.findIndex(apt => String(apt.id) === String(id));
    if (index === -1) {
        showToast("Appointment not found.");
        return false;
    }

    const target = { ...appointments[index] };

    // remove from active/history source list
    appointments.splice(index, 1);

    // normalize archived record
    target.archived = true;
    target.archivedForPatient = true;
    target.updatedAt = new Date().toISOString();
    target.archivedAt = new Date().toISOString();
    target.archivedBy = source;

    // avoid duplicate archive entries
    const alreadyArchivedIndex = archive.findIndex(item => String(item.id) === String(id));
    if (alreadyArchivedIndex > -1) {
        archive[alreadyArchivedIndex] = target;
    } else {
        archive.unshift(target);
    }

    saveAppointmentsShared(appointments);
    saveArchivedAppointmentsShared(archive);

    return true;
}

// LOAD TABLE
function loadAppointmentsUI() {
    const dashboardBody = document.getElementById("dashboardTableBody");
    const appointmentsBody = document.getElementById("myAppointmentsTableBody");
    const historyBody = document.getElementById("historyTableBody");

    const data = getAppointmentsShared().map(normalizeAppointmentSchedule);
    const filters = getPatientFilterValues();

    if (dashboardBody) dashboardBody.innerHTML = "";
    if (appointmentsBody) appointmentsBody.innerHTML = "";
    if (historyBody) historyBody.innerHTML = "";

    const visibleAppointments = data.filter(apt => {
        return apt.archivedForPatient !== true && apt.archived !== true;
    });

    const activeStatuses = ["Pending", "Approved", "Upcoming", "Reschedule Requested"];
    const historyStatuses = ["Completed", "Cancelled", "Rejected", "Reschedule Rejected"];

    const activeAppointmentsRaw = visibleAppointments.filter(apt =>
        activeStatuses.includes(String(apt.status || "").trim())
    );

    const historyAppointmentsRaw = visibleAppointments.filter(apt =>
        historyStatuses.includes(String(apt.status || "").trim())
    );

    const activeAppointments = activeAppointmentsRaw.filter(apt =>
        matchesRecordFilter(apt, filters.appointmentsSearch, filters.appointmentsStatus)
    );

    const historyAppointments = historyAppointmentsRaw.filter(apt =>
        matchesRecordFilter(apt, filters.historySearch, filters.historyStatus)
    );

    const dashboardPreview = [...activeAppointmentsRaw].slice(0, 3);

    if (dashboardBody) {
        if (!dashboardPreview.length) {
            dashboardBody.innerHTML = `
                <tr>
                    <td colspan="4">No active appointments.</td>
                </tr>
            `;
        } else {
            dashboardPreview.forEach((apt) => {
                const safeStatus = String(apt.status || "Pending").trim() || "Pending";
                const safeStatusClass = safeStatus.toLowerCase().replace(/\s+/g, "-");

                dashboardBody.innerHTML += `
                    <tr>
                        <td>${apt.service}</td>
                        <td>${apt.schedule}</td>
                        <td><span class="badge ${safeStatusClass}">${safeStatus}</span></td>
                        <td>
                            <i class="bi bi-trash text-danger"
                               style="cursor:pointer"
                               onclick="deleteAppointment('${apt.id}')"></i>
                        </td>
                    </tr>
                `;
            });
        }
    }

    if (appointmentsBody) {
        if (!activeAppointments.length) {
            appointmentsBody.innerHTML = `
                <tr>
                    <td colspan="4">No matching appointment records found.</td>
                </tr>
            `;
        } else {
            activeAppointments.forEach((apt) => {
                const safeStatus = String(apt.status || "Pending").trim() || "Pending";
                const safeStatusClass = safeStatus.toLowerCase().replace(/\s+/g, "-");

                appointmentsBody.innerHTML += `
                    <tr>
                    <td>${apt.service}</td>
                    <td>${apt.schedule}</td>
                    <td>
                    <span class="badge ${String(apt.status || '').toLowerCase()}">
                        ${apt.status}
                    </span>
                    </td>
                    <td>${buildPatientAppointmentActions(apt)}</td>
                </tr>
                `;
            });
        }
    }

    if (historyBody) {
        if (!historyAppointments.length) {
            historyBody.innerHTML = `
                <tr>
                    <td colspan="4">No matching history records found.</td>
                </tr>
            `;
        } else {
            historyAppointments.forEach((apt) => {
                const safeStatus = String(apt.status || "Completed").trim() || "Completed";
                const safeStatusClass = safeStatus.toLowerCase().replace(/\s+/g, "-");

                historyBody.innerHTML += `
                    <tr>
                        <td>${apt.service}</td>
                        <td>${apt.schedule}</td>
                        <td><span class="badge ${safeStatusClass}">${safeStatus}</span></td>
                        <td>
                            <i class="bi bi-trash text-danger"
                               style="cursor:pointer"
                               onclick="deleteHistory('${apt.id}')"></i>
                        </td>
                    </tr>
                `;
            });
        }
    }
}

function deleteHistory(id) {
    const moved = moveAppointmentToArchive(id, "patient-history");
    if (!moved) return;

    showToast("History record moved to archive.");
    addNotification("A history record was moved to archive.");
    renderAllPatientUI();
}


// DELETE APPOINTMENT
let appointmentIdToDelete = null;

// 1. Trigger the Custom Modal instead of alert
function deleteAppointment(id) {
    appointmentIdToDelete = id;
    document.getElementById("deleteModal").classList.add("active");
}

// 2. Close the modal
// 3. The actual deletion logic (Attached to the Red Button)
// 3. The updated archiving logic
// 3. The updated archiving logic (Calls the helper function)
document.getElementById("confirmDeleteBtn").onclick = function() {
    if (!appointmentIdToDelete) return;
    archiveAppointment(appointmentIdToDelete);
    closeDeleteModal(); 
};

// NOTIFICATIONS

// =============================
// PATIENT NOTIFICATIONS
// Replace old addNotification / toggleNotifPanel logic
// =============================


function toggleSharedNotifPanel(type = "patient", forceClose = null) {
  const panel = document.getElementById("notifPanel");
  if (!panel) return;

  if (forceClose === true) {
    panel.classList.remove("active");
    return;
  }

  panel.classList.toggle("active");

  if (panel.classList.contains("active")) {
    renderSharedNotifications(type);
  }
}
function addNotification(text) {
  pushPatientNotification(text);
  renderSharedNotifications("patient");
}
function markAllPatientNotificationsRead() {
  const list = getPatientNotificationsShared().map(n => ({
    ...n,
    read: true
  }));

  savePatientNotificationsShared(list);
}

function clearAllPatientNotifications() {
  savePatientNotificationsShared([]);
}
function toggleSidebar() {
    document.querySelector(".app-shell").classList.toggle("collapsed");
}
function renderAllPatientUI() {
  loadAppointmentsUI?.();
  loadArchiveUI?.();
  renderHeroAppointment?.();
  loadSavedProfile?.();
  renderSharedNotifications("patient");
}

function showToast(message) {
    const toast = document.getElementById("toastMessage");

    if (!toast) return;

    toast.innerHTML = `✔️ ${message}`;

    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 7000);
}

let selectedServiceObj = null;
let selectedTime = "";

// AUTO TIME SLOTS
let currentDate = new Date();
let selectedDate = "";

function generateCalendar() {
    const daysContainer = document.getElementById("calendarDays");
    const monthLabel = document.getElementById("calendarMonth");

    daysContainer.innerHTML = "";

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    // Update header
    const options = { month: 'long', year: 'numeric' };
    monthLabel.innerText = currentDate.toLocaleDateString('en-US', options);

    // Get first + last day
    const firstDay = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();

    // Empty spaces before first day
    for (let i = 0; i < firstDay; i++) {
        const empty = document.createElement("div");
        daysContainer.appendChild(empty);
    }

    // Generate real days
    for (let i = 1; i <= totalDays; i++) {
        const day = document.createElement("div");
        day.className = "calendar-day";
        day.innerText = i;

        day.onclick = () => {
            document.querySelectorAll(".calendar-day").forEach(d => d.classList.remove("active"));
            day.classList.add("active");

            selectedDate = `${year}-${month + 1}-${i}`;
            updateSummary();
        };

        daysContainer.appendChild(day);
    }
}

function changeMonth(direction) {
    currentDate.setMonth(currentDate.getMonth() + direction);
    generateCalendar();
}

let currentPeriod = "morning";

function generateTimeSlots() {
    const allTimes = [
        "9:00 AM","10:00 AM","11:00 AM",
        "12:00 PM","1:00 PM","2:00 PM",
        "3:00 PM","4:00 PM","5:00 PM"
    ];

    const container = document.getElementById("timeSlots");
    container.innerHTML = "";

    const filtered = allTimes.filter(t => {
        if (currentPeriod === "morning") {
            return t.includes("AM");
        } else {
            return t.includes("PM");
        }
    });

    filtered.forEach(t => {
        const btn = document.createElement("div");
        btn.className = "time-btn";
        btn.innerText = t;

        btn.onclick = () => {
            document.querySelectorAll(".time-btn").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");

            selectedTime = t;
            updateSummary();
        };

        container.appendChild(btn);
    });
}
document.querySelectorAll(".time-filter").forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelectorAll(".time-filter").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        currentPeriod = btn.dataset.period;
        generateTimeSlots();
    });
});

// SELECT SERVICE FROM SERVICES PAGE
function goToBooking(serviceName) {
    showSection('book-apt', document.querySelectorAll('.nav-link')[1]);

    selectedServiceObj = services.find(s => s.name === serviceName);

    if (selectedServiceObj) {
        document.getElementById("selectedService").innerText = serviceName;
        document.getElementById("summaryService").innerText = serviceName;
        document.getElementById("summaryPrice").innerText = "₱" + selectedServiceObj.price.toLocaleString();

        const includesList = document.getElementById("serviceIncludes");
        const panelIncludes = document.getElementById("panelIncludes"); // Added this
        
        if (includesList) {
            includesList.innerHTML = selectedServiceObj.includes.map(item => `<li>✔ ${item}</li>`).join('');
        }
        
        // Sync the panel as well just in case the user opens it later
        if (panelIncludes) {
            panelIncludes.innerHTML = selectedServiceObj.includes.map(item => `
                <li class="mb-2 d-flex align-items-center list-unstyled">
                    <i class="bi bi-check-circle-fill text-success me-2"></i>
                    <span class="small ms-2">${item}</span>
                </li>
            `).join('');
        }

        updateSummary();
    }
}

// DATE CHANGE

function updateSummary(){
    document.getElementById("summaryDate").innerText = selectedDate || "-";
    document.getElementById("summaryTime").innerText = selectedTime || "-";


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

function buildSchedule(dateValue = "", timeValue = "") {
    const safeDate = String(dateValue || "").trim();
    const safeTime = normalizeTimeDisplay(timeValue);
    return safeDate && safeTime ? `${safeDate} • ${safeTime}` : safeDate || safeTime;
}

function splitSchedule(schedule = "") {
    const parts = String(schedule).split("•").map(s => s.trim());
    const cleanTime = normalizeTimeDisplay(parts[1] || "");

    return {
        date: parts[0] || "",
        timeDisplay: cleanTime,
        time24: convertDisplayTimeTo24(cleanTime)
    };
}
// CONFIRM BOOKING
// CONFIRM BOOKING
function confirmBookingNew() {
  if (!selectedServiceObj) {
    showToast("Select a service first ❗");
    return;
  }

  if (!selectedDate || !selectedTime) {
    showToast("Select date & time ❗");
    return;
  }

  const patientSession = currentPatientUser || {};
  const patientName =
    patientSession.name ||
    patientSession.fullName ||
    patientSession.email ||
    "Patient";

  const patientEmail = patientSession.email || "";
  const appointments = getAppointmentsShared();

  const price = Number(selectedServiceObj.price || 0);
  const requiresDownPayment = price >= 5000;
  const minimumDownPayment = requiresDownPayment ? Math.min(price, 1000) : 0;

  const newApt = normalizeAppointmentFinancials({
    id: String(Date.now()),
    patientName,
    patientEmail,
    dentist: "Dr. Daniel Santos",
    service: selectedServiceObj.name,
    price,
    date: selectedDate,
    time: convertDisplayTimeTo24(selectedTime),
    schedule: buildSchedule(selectedDate, selectedTime),
    status: "Pending",
    paid: false,
    paymentStatus: "Unpaid",
    paymentMethod: "",
    downPayment: 0,
    amountPaidOnline: 0,
    amountPaidInClinic: 0,
    totalCollected: 0,
    remainingBalance: price,

    requiresDownPayment,
    minimumDownPayment,
    invoiceUnlocked: false,

    revenueCountedOnline: 0,
    revenueCountedClinic: 0,

    archived: false,
    archivedForPatient: false,
    archivedForDentist: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });

  appointments.unshift(newApt);
  saveAppointmentsShared(appointments);

  localStorage.removeItem("pendingPayment");

  pushDentistNotification(
    `New appointment request from ${newApt.patientName} for ${newApt.service} on ${newApt.schedule}.`
  );

  showToast(
    "Booking submitted. Please wait for clinic approval before payment."
  );

  addNotification?.(
    `Appointment request sent for ${newApt.service} on ${newApt.schedule}.`
  );

  renderAllPatientUI?.();
  showSection?.("my-appointments");
}
// INIT
// INIT (RUN ON PAGE LOAD)
generateCalendar();
generateTimeSlots();

function populateServiceDropdown() {
    const dropdown = document.getElementById("serviceDropdown");

    dropdown.innerHTML = `<option value="">Select a Service</option>`;

    services.forEach(s => {
        dropdown.innerHTML += `<option value="${s.name}">${s.name}</option>`;
    });
}



function openServicePicker() {
    document.getElementById("serviceModal").classList.add("active");
    renderServiceList();
}

function closeServicePicker() {
    document.getElementById("serviceModal").classList.remove("active");
}

function renderServiceList() {
    const list = document.getElementById("serviceList");
    list.innerHTML = "";

    services.forEach(s => {
        const div = document.createElement("div");
        div.className = "service-item";
        div.innerHTML = `
            <strong>${s.name}</strong><br>
            <small>₱${s.price.toLocaleString()}</small>
        `;

        div.onclick = () => selectService(s);

        list.appendChild(div);
    });
}

function selectService(service) {
    selectedServiceObj = service; // This is for the actual appointment

    const includesList = document.getElementById("serviceIncludes");
    if (includesList) {
        includesList.innerHTML = ""; 
        service.includes.forEach(item => {
            const li = document.createElement('li');
            li.innerHTML = `✔ ${item}`; // Styles for the Booking page
            includesList.appendChild(li);
        });
    }

    // Update labels for Step 3 Summary
    document.getElementById("selectedService").innerText = service.name;
    document.getElementById("summaryService").innerText = service.name;
    document.getElementById("summaryPrice").innerText = "₱" + service.price.toLocaleString();

    closeServicePicker();
    updateSummary();
}
function outsideClick(e) {
    const modalContent = document.querySelector(".service-modal-content");

    // If clicked outside the modal box → close
    if (!modalContent.contains(e.target)) {
        closeServicePicker();
    }
}

document.addEventListener("DOMContentLoaded", () => {
    lockPageHistory();
    syncCurrentPatientToSharedDirectory();
    history.pushState(null, null, location.href);

    window.addEventListener("popstate", function () {
        history.pushState(null, null, location.href);
    });
    // 1. Initialize UI elements
    renderServices();
    loadAppointmentsUI();
    generateCalendar();
    generateTimeSlots();
    loadArchiveUI();
    renderHeroAppointment();
    loadSavedProfile();
    setProfileEditingState(false);
    renderSharedNotifications("patient");
    initCustomDropdown("appointmentsStatusFilter");
    initCustomDropdown("historyStatusFilter");
    initCustomDropdown("archiveStatusFilter");
    initPatientRecordFilters();;
    initCrossPageSync(renderAllPatientUI);
    listenGlobalSync(() => {
    renderAllPatientUI();
    });
const rescheduleModalEl = document.getElementById("rescheduleModal");

if (rescheduleModalEl) {
    rescheduleModalEl.addEventListener("show.bs.modal", () => {
        updateRescheduleModalText();
    });
}

const markAllReadBtn = document.getElementById("markAllReadBtn");
const modalMarkAllReadBtn = document.getElementById("modalMarkAllReadBtn");
const clearAllNotifBtn = document.getElementById("clearAllNotifBtn");

const clearNotifWarningModal = document.getElementById("clearNotifWarningModal");
const cancelClearNotifBtn = document.getElementById("cancelClearNotifBtn");
const confirmClearNotifBtn = document.getElementById("confirmClearNotifBtn");

// MARK ALL READ (small panel)
markAllReadBtn?.addEventListener("click", () => {
    markAllPatientNotificationsRead();
    renderSharedNotifications("patient");
    showToast("All notifications marked as read.");
});

// MARK ALL READ (modal)
modalMarkAllReadBtn?.addEventListener("click", () => {
    markAllPatientNotificationsRead();
    renderSharedNotifications("patient");
    showToast("All notifications marked as read.");
});

// OPEN CLEAR WARNING
clearAllNotifBtn?.addEventListener("click", () => {
    clearNotifWarningModal?.classList.add("active");
});

// CANCEL CLEAR
cancelClearNotifBtn?.addEventListener("click", () => {
    clearNotifWarningModal?.classList.remove("active");
});

// CONFIRM CLEAR
confirmClearNotifBtn?.addEventListener("click", () => {
    clearAllPatientNotifications();
    renderSharedNotifications("patient");

    clearNotifWarningModal?.classList.remove("active");
    document.getElementById("allNotifModal")?.classList.remove("active");

    showToast("All notifications cleared.");
});
const openAllNotifModalBtn = document.getElementById("openAllNotifModal");
const allNotifModal = document.getElementById("allNotifModal");
const closeAllNotifModalBtn = document.getElementById("closeAllNotifModal");

if (openAllNotifModalBtn && allNotifModal) {
    openAllNotifModalBtn.addEventListener("click", () => {
        allNotifModal.classList.add("active");
        renderSharedNotifications("patient");
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


const confirmDeleteBtn = document.getElementById("confirmDeleteBtn");
if (confirmDeleteBtn) {
    confirmDeleteBtn.onclick = function() {
        if (!appointmentIdToDelete) return;
        archiveAppointment(appointmentIdToDelete);
        closeDeleteModal();
    };
}

    const profileMenuTrigger = document.getElementById("profileMenuTrigger");
    const profileDropdownMenu = document.getElementById("profileDropdownMenu");
    const goToSettingsBtn = document.getElementById("goToSettingsBtn");
    const logoutBtn = document.getElementById("logoutBtn");
        if (logoutBtn) {
            logoutBtn.addEventListener("click", () => {
                clearCurrentUser(); // ✅ uses sessionStorage

                window.location.replace("../Landing/landing.html");
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

    if (goToSettingsBtn) {
        goToSettingsBtn.addEventListener("click", () => {
            toggleProfileDropdown(true);
            showSection('profile');
        });
    }


    document.addEventListener("click", () => {
        toggleProfileDropdown(true);
    });

    const editBtn = document.getElementById("editProfileBtn");

    if (editBtn) {
        editBtn.addEventListener("click", () => {
            if (!isEditingProfile) {
                setProfileEditingState(true);
            } else {
                const saved = saveProfileChanges();
                if (saved) {
                    setProfileEditingState(false);
                }
            }
        });
    }



    // Toggle logic for Notifications and Tips


// Add to Calendar Logic

const submitBtn = document.getElementById('submitRescheduleBtn');

if (submitBtn) {
    submitBtn.addEventListener('click', function () {
        const dateInput = document.getElementById('newDateInput');
        const timeInput = document.getElementById('newTimeInput');
        const reasonInput = document.getElementById('rescheduleReason');

        const newDate = dateInput?.value?.trim() || "";
        const newTime = timeInput?.value?.trim() || "";
        const reason = reasonInput?.value?.trim() || "";

        if (!newDate) {
            showToast("Please select a new date.");
            return;
        }

        if (!newTime) {
            showToast("Please select a new time.");
            return;
        }

        const targetAppointment = getCurrentReschedulableAppointment();

        if (!targetAppointment) {
            showToast("No approved appointment available for reschedule.");
            return;
        }

        const appointments = getAppointmentsShared();
        const requests = getRescheduleRequestsShared();

        const aptIndex = appointments.findIndex(a => String(a.id) === String(targetAppointment.id));
        if (aptIndex === -1) {
            showToast("Appointment not found.");
            return;
        }

        const requestedSchedule = buildSchedule(newDate, newTime);
        const previousSchedule = buildSchedule(
            appointments[aptIndex].date || splitSchedule(appointments[aptIndex].schedule).date,
            appointments[aptIndex].time || splitSchedule(appointments[aptIndex].schedule).timeDisplay
        );
        appointments[aptIndex].status = "Reschedule Requested";
        appointments[aptIndex].requestedSchedule = requestedSchedule;
        appointments[aptIndex].previousSchedule = previousSchedule;
        appointments[aptIndex].time = appointments[aptIndex].time || splitSchedule(appointments[aptIndex].schedule).time24;
        appointments[aptIndex].schedule = buildSchedule(
            appointments[aptIndex].date || splitSchedule(appointments[aptIndex].schedule).date,
            appointments[aptIndex].time || splitSchedule(appointments[aptIndex].schedule).timeDisplay
        );
        appointments[aptIndex].rescheduleReason = reason;
        appointments[aptIndex].updatedAt = new Date().toISOString();

        const existingRequestIndex = requests.findIndex(
            r => String(r.appointmentId) === String(targetAppointment.id)
        );

        const requestPayload = {
            id: existingRequestIndex > -1 ? requests[existingRequestIndex].id : String(Date.now()) + "-rr",
            appointmentId: targetAppointment.id,
            patientName: targetAppointment.patientName || "Patient",
            patientEmail: targetAppointment.patientEmail || "",
            service: targetAppointment.service || "",
            before: previousSchedule,
            previousSchedule,
            requestedSchedule,
            requestedDate: newDate,
            requestedTime: newTime,
            reason,
            status: "Pending",
            createdAt: existingRequestIndex > -1
                ? (requests[existingRequestIndex].createdAt || new Date().toISOString())
                : new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        if (existingRequestIndex > -1) {
            requests[existingRequestIndex] = requestPayload;
        } else {
            requests.unshift(requestPayload);
        }

        saveAppointmentsShared(appointments);
        saveRescheduleRequestsShared(requests);

        pushDentistNotification(
            `${requestPayload.patientName} requested to reschedule ${requestPayload.service} from ${previousSchedule} to ${requestedSchedule}.`
        );

        pushPatientNotification(
            `Your reschedule request for ${requestPayload.service} has been sent. Requested schedule: ${requestedSchedule}.`
        );

        const modalEl = document.getElementById('rescheduleModal');
        const modalInstance = bootstrap.Modal.getOrCreateInstance(modalEl);
        modalInstance.hide();

        if (dateInput) dateInput.value = "";
        if (timeInput) timeInput.value = "";
        if (reasonInput) reasonInput.value = "";

        showToast("Reschedule request submitted.");
        renderAllPatientUI();
    });
}
    // Put this inside your DOMContentLoaded


// 1. Put this inside your main DOMContentLoaded block

    // ---------------------------

    // 2. Define Tips Elements (Note: I removed the extra 'DOMContentLoaded' here)


 const tipsLink = document.querySelector('.more-tips-link');
const tipsPanel = document.getElementById('tipsPanel');
const closeTips = document.getElementById('closeTips');

function toggleTipsPanel(show) {
    if (!tipsPanel) return;
    tipsPanel.classList.toggle('active', show);
}

tipsLink?.addEventListener('click', (e) => {
    e.preventDefault();
    toggleTipsPanel(true);
});

closeTips?.addEventListener('click', () => {
    toggleTipsPanel(false);
});

document.addEventListener('click', (e) => {
    if (!tipsPanel?.classList.contains('active')) return;

    if (!tipsPanel.contains(e.target) && !tipsLink.contains(e.target)) {
        toggleTipsPanel(false);
    }
});

    const dateElement = document.getElementById('currentDateDisplay');
    if (dateElement) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        // Sets the date to March 30, 2026
        dateElement.textContent = new Date().toLocaleDateString('en-US', options);
    }

    const calendarTrigger = document.getElementById('heroCalendarTrigger');
    if (calendarTrigger) {
        calendarTrigger.onclick = () => {
            // This triggers your existing booking view logic
            const bookingBtn = document.querySelector('[onclick*="booking"]');
            if (bookingBtn) {
                bookingBtn.click();
            } else {
                // Fallback if the button click doesn't work
                if (typeof showView === 'function') showView('booking');
            }
        };
    }

    // --- PHOTO UPLOAD LOGIC ---
        const photoInput = document.getElementById('photoUpload');
const profileImg = document.getElementById('profileDisplay');
const headerImg = document.getElementById('header-profile-img');

// Function to apply the image to all UI elements
const updateProfileUI = (imageData) => {
    if (profileImg) profileImg.src = imageData;
    if (headerImg) headerImg.src = imageData;
};

if (photoInput) {
    photoInput.onchange = function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                const newImage = event.target.result;
                
                // 1. Update all UI elements
                updateProfileUI(newImage);
                
                // 2. Persist to localStorage
                const sessionUser = getCurrentUser() || {};
                const photoKey = `userProfilePhoto_${sessionUser.email || sessionUser.id || "patient"}`;
                localStorage.setItem(photoKey, newImage);
                
                // 3. Feedback
                showToast("Profile photo updated! 📸");
            };
            reader.readAsDataURL(file);
        }
    };
}

// Load saved photo on startup for both locations
window.addEventListener('DOMContentLoaded', () => {
    const sessionUser = getCurrentUser() || {};
    const photoKey = `userProfilePhoto_${sessionUser.email || sessionUser.id || "patient"}`;
    const savedPhoto = localStorage.getItem(photoKey);
    if (savedPhoto) {
        updateProfileUI(savedPhoto);
    }
});

        // --- DARK MODE LOGIC ---
        // 1. Re-initialize selectors to ensure they match your HTML IDs
// 🌙 DARK MODE SYSTEM (CLEAN + COMPLETE)

const themeToggle = document.getElementById('darkModeToggle');

function applyTheme(theme) {
    if (theme === 'dark') {
        document.body.classList.add('dark-mode');
        document.documentElement.setAttribute('data-bs-theme', 'dark');
        if (themeToggle) themeToggle.checked = true;
    } else {
        document.body.classList.remove('dark-mode');
        document.documentElement.setAttribute('data-bs-theme', 'light');
        if (themeToggle) themeToggle.checked = false;
    }
}

// Load saved theme
applyTheme(localStorage.getItem('theme'));

// Toggle
if (themeToggle) {
    themeToggle.addEventListener('change', () => {
        const newTheme = themeToggle.checked ? 'dark' : 'light';
        applyTheme(newTheme);
        localStorage.setItem('theme', newTheme);
    });
}

// Load saved theme immediately
(function () {
    const savedTheme = localStorage.getItem('theme') || 'light';
    applyTheme(savedTheme);
})();

// Toggle listener
if (themeToggle) {
    themeToggle.addEventListener('change', () => {
        const newTheme = themeToggle.checked ? 'dark' : 'light';
        applyTheme(newTheme);
        localStorage.setItem('theme', newTheme);
    });
}

// 3. Run immediately on page load to prevent "flashing" white
const savedTheme = localStorage.getItem('theme');
applyTheme(savedTheme);

// 4. The new, clean event listener
if (themeToggle) {
    themeToggle.addEventListener('change', () => {
        const newTheme = themeToggle.checked ? 'dark' : 'light';
        applyTheme(newTheme);
        localStorage.setItem('theme', newTheme); // Persists the choice
    });
}

    // 2. Define our elements
   const notifBtn = document.querySelector('.notif-wrapper');
const notifPanel = document.getElementById('notifPanel');
const closeNotifBtn = document.getElementById('closeNotif');
const dot = document.querySelector('.notif-wrapper .dot');

if (notifBtn && notifPanel) {
    notifBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleSharedNotifPanel("patient");
    });
}

if (closeNotifBtn && notifPanel) {
    closeNotifBtn.addEventListener('click', () => {
        toggleSharedNotifPanel("patient", true);
    });
}

document.addEventListener('click', (e) => {
    if (!notifPanel || !notifBtn) return;

    if (!notifPanel.contains(e.target) && !notifBtn.contains(e.target)) {
        toggleSharedNotifPanel("patient", true);
    }
});

    // BILLING FORM
    const billingForm = document.getElementById("billingForm");
    if (billingForm) {
        billingForm.addEventListener("submit", handlePaymentSubmit);
    }

    // PAYMENT CARDS (FIXED - IMPORTANT)
        document.querySelectorAll('.payment-card').forEach(card => {
    card.addEventListener('click', function () {
        document.querySelectorAll('.payment-card').forEach(c => c.classList.remove('active'));
        this.classList.add('active');

        const method = this.getAttribute('data-method');
        const downPaymentWrapper = document.getElementById('downPaymentWrapper');
        const downPaymentInput = document.getElementById('billDown');
        const confirmBtn = document.getElementById('confirmPaymentBtn');
        const paymentMethodInput = document.getElementById('paymentMethod');

        if (!downPaymentWrapper || !downPaymentInput || !confirmBtn) return;

        // keep hidden input synced
        if (paymentMethodInput) {
            paymentMethodInput.value = method;
        }

        // save the last entered online amount BEFORE switching to cash
        if (method !== 'cash' && !downPaymentInput.dataset.lastOnlineAmount && downPaymentInput.value) {
            downPaymentInput.dataset.lastOnlineAmount = downPaymentInput.value;
        }

        if (method === 'cash') {
            // store current value first so it can be restored later
            if (downPaymentInput.value) {
                downPaymentInput.dataset.lastOnlineAmount = downPaymentInput.value;
            }

            downPaymentWrapper.classList.add('d-none');
            downPaymentInput.removeAttribute('required');

            // do NOT wipe the value permanently, just hide it
            confirmBtn.innerText = "Confirm Booking";
        } else {
            downPaymentWrapper.classList.remove('d-none');
            downPaymentInput.setAttribute('required', 'required');
            confirmBtn.innerText = "Confirm Payment";

            // restore last value if input became empty after visiting cash
            if (!downPaymentInput.value) {
                const pending = JSON.parse(localStorage.getItem("pendingPayment") || "null");
                const savedValue =
                    downPaymentInput.dataset.lastOnlineAmount ||
                    (pending && pending.paymentStatus === "Partial"
                        ? String(pending.remainingBalance || "")
                        : "");

                if (savedValue) {
                    downPaymentInput.value = savedValue;
                }
            }
        }

        document.querySelectorAll('.payment-form').forEach(form => form.classList.add('d-none'));
        const targetForm = document.getElementById(method + 'Form');
        if (targetForm) targetForm.classList.remove('d-none');
    });
});


    // INIT
    renderServices();
    populateServiceDropdown();
    loadAppointmentsUI();
    generateCalendar();
    generateTimeSlots();



});

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

function getAppointmentsShared() {
  const db = getClinicDb();
  const list = Array.isArray(db.appointments) ? db.appointments : [];
  return list.map(normalizeAppointmentFinancials);
}

function saveAppointmentsShared(list) {
  const db = getClinicDb();
  db.appointments = (Array.isArray(list) ? list : []).map(normalizeAppointmentFinancials);
  saveClinicDb(db);
  triggerGlobalSync?.();
}

function getAppointmentById(id) {
  return getAppointmentsShared().find(a => String(a.id) === String(id)) || null;
}

function updateAppointmentById(id, updater) {
  const list = getAppointmentsShared();
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

  saveAppointmentsShared(list);
  return list[index];
}

function canPatientCancel(status) {
  return ["Pending", "Approved"].includes(String(status || "").trim());
}

function canPatientPay(apt) {
  const item = normalizeAppointmentFinancials(apt);
  return item.status === "Approved" && item.remainingBalance > 0;
}

function getInvoiceLabel(apt) {
  const item = normalizeAppointmentFinancials(apt);
  if (item.requiresDownPayment && item.paymentStatus === "Unpaid") {
    return `Down Payment Required (₱${item.minimumDownPayment.toLocaleString()})`;
  }
  if (item.paymentStatus === "Partial") return "Pay Remaining Balance";
  if (item.paymentStatus === "Paid") return "View Invoice";
  return "Pay / View Invoice";
}

function handlePaymentSubmit(e) {
  e.preventDefault();

  const pending = JSON.parse(localStorage.getItem("pendingPayment") || "null");
  if (!pending || !pending.id) {
    showToast("No appointment selected ❗");
    return;
  }

  const current = getAppointmentById(pending.id);
  if (!current) {
    showToast("Appointment not found ❗");
    return;
  }

  if (current.status !== "Approved") {
    showToast("You can only pay once the appointment is approved.");
    return;
  }

  const item = normalizeAppointmentFinancials(current);

  if (item.remainingBalance <= 0) {
    showToast("This appointment is already fully paid.");
    return;
  }

  const activeCard = document.querySelector(".payment-card.active");
  const method = activeCard?.getAttribute("data-method") || "cash";

    const downInput = document.getElementById("billDown");
    let amountToPay = parseFloat(downInput?.value || "0");

    if (item.paymentStatus === "Partial") {
    amountToPay = item.remainingBalance;
    }

  if (isNaN(amountToPay) || amountToPay <= 0) {
    showToast("Please enter a valid payment amount ❗");
    return;
  }

  if (item.requiresDownPayment && item.paymentStatus === "Unpaid" && amountToPay < item.minimumDownPayment) {
    showToast(`Minimum required down payment is ₱${item.minimumDownPayment.toLocaleString()}.`);
    return;
  }

  if (amountToPay > item.remainingBalance) {
    amountToPay = item.remainingBalance;
  }

  const updated = updateAppointmentById(item.id, (apt) => {
    const nextOnline = Number(apt.amountPaidOnline || 0) + amountToPay;
    const nextCollected = nextOnline + Number(apt.amountPaidInClinic || 0);

    return {
      ...apt,
      paymentMethod: method,
      downPayment: Number(apt.downPayment || 0) + amountToPay,
      amountPaidOnline: nextOnline,
      totalCollected: nextCollected
    };
  });

  localStorage.setItem("pendingPayment", JSON.stringify(updated));

  if (updated.paymentStatus === "Paid") {
    showToast("Payment completed successfully 💳");
    addNotification?.(`Full payment recorded for ${updated.service}.`);
    pushDentistNotification(
      `${updated.patientName} fully paid online for ${updated.service}.`
    );
  } else {
    showToast("Down payment recorded successfully 💳");
    addNotification?.(`Down payment recorded for ${updated.service}.`);
    pushDentistNotification(
      `${updated.patientName} paid ₱${amountToPay.toLocaleString()} online for ${updated.service}.`
    );
  }

  renderAllPatientUI?.();
  showSection?.("my-appointments");
}

function cancelPatientAppointment(id) {
  const apt = getAppointmentById(id);
  if (!apt) {
    showToast("Appointment not found.");
    return;
  }

  if (!canPatientCancel(apt.status)) {
    showToast("Only pending or approved appointments can be cancelled.");
    return;
  }

  const updated = updateAppointmentById(id, {
    status: "Cancelled"
  });

  localStorage.removeItem("pendingPayment");

  pushDentistNotification(
    `${updated.patientName || "A patient"} cancelled the appointment for ${updated.service} on ${updated.schedule}.`
  );

  addNotification?.(`Appointment cancelled for ${updated.service}.`);
  showToast("Appointment cancelled successfully.");
  renderAllPatientUI?.();
}

function getSharedPatients() {
  const db = getClinicDb();
  return Array.isArray(db.patients) ? db.patients : [];
}

function saveSharedPatients(list) {
  const db = getClinicDb();
  db.patients = Array.isArray(list) ? list : [];
  saveClinicDb(db);
}

function syncCurrentPatientToSharedDirectory() {
  const patientSession = currentPatientUser || {};

  const patientName = String(
    patientSession.name ||
    patientSession.fullName ||
    patientSession.email ||
    ""
  ).trim();

  if (!patientName) return;

  const patients = getSharedPatients();
  const key = patientName.toLowerCase();

  const record = {
    id: patientSession.id || `patient-${Date.now()}`,
    name: patientName,
    email: patientSession.email || "",
    age: calculateAge(patientSession.dob),
    gender: patientSession.sex || "",
    condition: patientSession.condition || "",
    address: patientSession.address || "",
    contact: patientSession.mobile || "",
    archived: false,
    updatedAt: new Date().toISOString()
  };

  const existingIndex = patients.findIndex(
    p => String(p.name || "").trim().toLowerCase() === key
  );

  if (existingIndex > -1) {
    patients[existingIndex] = {
      ...patients[existingIndex],
      ...record
    };
  } else {
    patients.unshift(record);
  }

  saveSharedPatients(patients);
}
function buildPatientAppointmentActions(item) {
  const apt = normalizeAppointmentFinancials(item);
  const safeSchedule = String(apt.schedule || "");
  const parts = safeSchedule.split("•").map(s => s.trim());
  const aptDate = String(apt.date || parts[0] || "").trim();
  const aptTime = String(parts[1] || apt.time || "").trim();
  let primaryButtons = "";
  let dropdownItems = "";

  if (canPatientCancel(apt.status)) {
    primaryButtons += `
      <button class="patient-action-btn danger"
        onclick="cancelPatientAppointment('${apt.id}')">
        Cancel
      </button>
    `;
  }

  if (apt.status === "Approved") {
    if (apt.paymentStatus === "Unpaid") {
      primaryButtons += `
        <button class="patient-action-btn primary"
          onclick="openPaymentModal('${apt.id}')">
          ${apt.requiresDownPayment ? "Pay Down Payment" : "Pay Invoice"}
        </button>
      `;
    } else if (apt.paymentStatus === "Partial") {
      primaryButtons += `
        <button class="patient-action-btn primary"
          onclick="openPaymentModal('${apt.id}')">
          Pay Remaining
        </button>
      `;
    }

    dropdownItems += `
      <button type="button" class="patient-dropdown-item"
        onclick="openInvoiceModal('${apt.id}'); closeAllPatientActionMenus();">
        <i class="bi bi-receipt"></i>
        <span>View Invoice</span>
      </button>

      <button type="button" class="patient-dropdown-item"
        onclick="openRowRescheduleModal('${apt.id}'); closeAllPatientActionMenus();">
        <i class="bi bi-calendar2-week"></i>
        <span>Request Reschedule</span>
      </button>

        <button type="button" class="patient-dropdown-item"
        onclick="handleDropdownAddToCalendar(event, '${escapeSingleQuote(apt.service || "Appointment")}', '${escapeSingleQuote(aptDate)}', '${escapeSingleQuote(aptTime)}')">
        <i class="bi bi-calendar-plus"></i>
        <span>Add to Calendar</span>
        </button>
    `;
  } else if (apt.status === "Completed" || apt.paymentStatus === "Paid") {
    dropdownItems += `
      <button type="button" class="patient-dropdown-item"
        onclick="openInvoiceModal('${apt.id}'); closeAllPatientActionMenus();">
        <i class="bi bi-receipt"></i>
        <span>View Invoice</span>
      </button>

        <button type="button" class="patient-dropdown-item"
        onclick="handleDropdownAddToCalendar(event, '${escapeSingleQuote(apt.service || "Appointment")}', '${escapeSingleQuote(aptDate)}', '${escapeSingleQuote(aptTime)}')">
        <i class="bi bi-calendar-plus"></i>
        <span>Add to Calendar</span>
        </button>
    `;
  }

  if (["Rejected", "Cancelled", "Completed"].includes(apt.status)) {
    dropdownItems += `
      <button type="button" class="patient-dropdown-item danger"
        onclick="archiveAppointment('${apt.id}'); closeAllPatientActionMenus();">
        <i class="bi bi-archive"></i>
        <span>Archive</span>
      </button>
    `;
  }

  if (!primaryButtons && !dropdownItems) {
    return `<span class="text-muted small">No actions</span>`;
  }

  return `
    <div class="patient-row-actions">
      <div class="patient-row-actions-main">
        ${primaryButtons}
      </div>

      ${
        dropdownItems
          ? `
          <div class="patient-action-menu-wrap">
            <button type="button"
              class="patient-action-btn ghost more-toggle"
              onclick="togglePatientActionMenu(event, '${apt.id}')">
              <i class="bi bi-three-dots"></i>
            </button>

            <div class="patient-action-dropdown" id="patientActionMenu-${apt.id}">
              ${dropdownItems}
            </div>
          </div>
        `
          : ""
      }
    </div>
  `;
}



function escapeSingleQuote(value = "") {
  return String(value).replace(/'/g, "\\'");
}
function addToCalendar(service, date, time) {
    if (!service || !date || !time) {
        showToast("Missing appointment details for calendar.");
        return;
    }

    function normalizeDateParts(dateStr) {
        const cleaned = String(dateStr).trim();
        const parts = cleaned.split("-").map(part => part.trim());

        if (parts.length !== 3) return null;

        const year = Number(parts[0]);
        const month = Number(parts[1]);
        const day = Number(parts[2]);

        if (!year || !month || !day) return null;

        return { year, month, day };
    }

    function normalizeTimeTo24(timeStr) {
        const raw = String(timeStr).trim().toUpperCase();

        // supports "4:00 PM"
        let match = raw.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
        if (match) {
            let hour = parseInt(match[1], 10);
            const minute = parseInt(match[2], 10);
            const meridiem = match[3].toUpperCase();

            if (meridiem === "PM" && hour !== 12) hour += 12;
            if (meridiem === "AM" && hour === 12) hour = 0;

            return { hour, minute };
        }

        // supports "16:00"
        match = raw.match(/^(\d{1,2}):(\d{2})$/);
        if (match) {
            return {
                hour: parseInt(match[1], 10),
                minute: parseInt(match[2], 10)
            };
        }

        return null;
    }

    const dateParts = normalizeDateParts(date);
    const timeParts = normalizeTimeTo24(time);

    if (!dateParts || !timeParts) {
        showToast("Invalid appointment date or time for calendar.");
        return;
    }

    const start = new Date(
        dateParts.year,
        dateParts.month - 1,
        dateParts.day,
        timeParts.hour,
        timeParts.minute,
        0
    );

    const end = new Date(start.getTime() + 60 * 60 * 1000);

    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
        showToast("Invalid appointment date or time for calendar.");
        return;
    }

    const formatGoogleDate = (d) => {
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");
        const h = String(d.getHours()).padStart(2, "0");
        const min = String(d.getMinutes()).padStart(2, "0");
        return `${y}${m}${day}T${h}${min}00`;
    };

    const googleUrl =
        `https://calendar.google.com/calendar/render?action=TEMPLATE` +
        `&text=${encodeURIComponent(service)}` +
        `&dates=${formatGoogleDate(start)}/${formatGoogleDate(end)}` +
        `&details=${encodeURIComponent("Dental appointment at G-M Dental Clinic")}` +
        `&location=${encodeURIComponent("G-M Dental Clinic")}`;

    window.open(googleUrl, "_blank", "noopener");
}

function handleDropdownAddToCalendar(event, service, date, time) {
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }

    addToCalendar(service, date, time);

    setTimeout(() => {
        closeAllPatientActionMenus();
    }, 50);
}
function getPatientActionBackdrop() {
  return document.getElementById("patientActionBackdrop");
}

function closeAllPatientActionMenus() {
  document.querySelectorAll(".patient-action-dropdown").forEach(menu => {
    menu.classList.remove("show");
  });

  document.querySelectorAll(".patient-action-menu-wrap").forEach(wrap => {
    wrap.classList.remove("open");
  });

  document.querySelectorAll(".more-toggle").forEach(btn => {
    btn.classList.remove("menu-owner");
  });

  document.body.classList.remove("patient-menu-open");

  const backdrop = getPatientActionBackdrop();
  if (backdrop) backdrop.classList.remove("show");
}

function togglePatientActionMenu(event, id) {
  event.preventDefault();
  event.stopPropagation();

  const target = document.getElementById(`patientActionMenu-${id}`);
  if (!target) return;

  const wrap = target.closest(".patient-action-menu-wrap");
  const button = event.currentTarget;
  if (!wrap || !button) return;

  const isOpen = target.classList.contains("show");

  closeAllPatientActionMenus();

  if (isOpen) return;

  wrap.classList.add("open");
  target.classList.add("show");
  button.classList.add("menu-owner");
  document.body.classList.add("patient-menu-open");

  const backdrop = getPatientActionBackdrop();
  if (backdrop) backdrop.classList.add("show");
}

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") {
    closeAllPatientActionMenus();
  }
});

function openRowRescheduleModal(id) {
  const appointments = getAppointmentsShared();
  const target = appointments.find(a => String(a.id) === String(id));

  if (!target) {
    showToast("Appointment not found.");
    return;
  }

  const status = String(target.status || "").trim();
  if (status !== "Approved" && status !== "Upcoming") {
    showToast("Only approved appointments can be rescheduled.");
    return;
  }

  const hiddenInput = document.getElementById("rescheduleAppointmentId");
  const helperText = document.getElementById("rescheduleHelperText");

  if (hiddenInput) hiddenInput.value = target.id;
  if (helperText) {
    helperText.innerHTML = `Please select a new preferred date for your <strong>${target.service || "appointment"}</strong>.`;
  }

  const modalEl = document.getElementById("rescheduleModal");
  if (!modalEl) {
    showToast("Reschedule modal not found.");
    return;
  }

  const modalInstance = bootstrap.Modal.getOrCreateInstance(modalEl);
  modalInstance.show();
}
function openInvoiceModal(id) {
  const apt = getAppointmentById(id);
  if (!apt) {
    showToast("Appointment not found.");
    return;
  }

  const item = normalizeAppointmentFinancials(apt);

  const invoiceService = document.getElementById("invoiceService");
  const invoiceSchedule = document.getElementById("invoiceSchedule");
  const invoiceTotal = document.getElementById("invoiceTotal");
  const invoicePaid = document.getElementById("invoicePaid");
  const invoiceRemaining = document.getElementById("invoiceRemaining");
  const invoiceMethod = document.getElementById("invoiceMethod");
  const invoiceStatus = document.getElementById("invoiceStatus");

  if (invoiceService) invoiceService.textContent = item.service || "-";
  if (invoiceSchedule) invoiceSchedule.textContent = item.schedule || "-";
  if (invoiceTotal) invoiceTotal.textContent = `₱${Number(item.price || 0).toLocaleString()}`;
  if (invoicePaid) invoicePaid.textContent = `₱${Number(item.totalCollected || 0).toLocaleString()}`;
  if (invoiceRemaining) invoiceRemaining.textContent = `₱${Number(item.remainingBalance || 0).toLocaleString()}`;
  if (invoiceMethod) invoiceMethod.textContent = item.paymentMethod || "Not yet selected";
  if (invoiceStatus) invoiceStatus.textContent = item.paymentStatus || "Unpaid";

  document.getElementById("invoiceModal")?.classList.add("active");
}
function closeInvoiceModal() {
  document.getElementById("invoiceModal")?.classList.remove("active");
}

function openPaymentModal(id) {
  const apt = getAppointmentById(id);
  if (!apt) {
    showToast("Appointment not found.");
    return;
  }

  const item = normalizeAppointmentFinancials(apt);

  if (item.status !== "Approved") {
    showToast("Payment is only available for approved appointments.");
    return;
  }

  localStorage.setItem("pendingPayment", JSON.stringify(item));

  const totalEl = document.getElementById("billTotal");
  const amountEl = document.getElementById("billDown");
  const balanceEl = document.getElementById("billRemaining");
  const noteEl = document.getElementById("billingNote");

  if (totalEl) totalEl.textContent = `₱${item.price.toLocaleString()}`;
  if (balanceEl) balanceEl.textContent = `₱${item.remainingBalance.toLocaleString()}`;

  if (amountEl) {
  amountEl.readOnly = false;
  amountEl.value = "";

    if (item.paymentStatus === "Unpaid") {
      if (item.requiresDownPayment) {
        amountEl.value = item.minimumDownPayment;
        amountEl.min = item.minimumDownPayment;
        amountEl.max = item.remainingBalance;
      } else {
        amountEl.value = item.remainingBalance;
        amountEl.min = 1;
        amountEl.max = item.remainingBalance;
      }
    } else if (item.paymentStatus === "Partial") {
      amountEl.value = item.remainingBalance;
      amountEl.min = item.remainingBalance;
      amountEl.max = item.remainingBalance;
      amountEl.readOnly = true;
    } else {
      amountEl.value = 0;
      amountEl.readOnly = true;
    }
  }

  if (noteEl) {
    if (item.paymentStatus === "Unpaid" && item.requiresDownPayment) {
      noteEl.textContent = `Required down payment: ₱${item.minimumDownPayment.toLocaleString()}.`;
    } else if (item.paymentStatus === "Partial") {
      noteEl.textContent = `Remaining balance to pay: ₱${item.remainingBalance.toLocaleString()}.`;
    } else if (item.paymentStatus === "Paid") {
      noteEl.textContent = "This appointment is already fully paid.";
    } else {
      noteEl.textContent = "You may now pay this invoice.";
    }
  }

  showSection("billing");
}

function submitReview(appointmentId, rating, text) {
  const db = getClinicDb();

  const appt = db.appointments.find(a => a.id === appointmentId);
  if (!appt) return;

  appt.review = text;
  appt.rating = rating;

  saveClinicDb(db);
  triggerGlobalSync();

  showToast("success", "Review submitted!");
}

function archiveAppointment(id) {
    const moved = moveAppointmentToArchive(id, "patient");
    if (!moved) return;

    showToast("Appointment archived.");
    addNotification("An appointment was moved to archive.");
    renderAllPatientUI();
}

function clearAppointments() {
    const appointments = getAppointmentsShared();
    const archive = getArchivedAppointmentsShared();

    const activeStatuses = ["Pending", "Approved", "Upcoming", "Reschedule Requested"];
    const toArchive = appointments.filter(item =>
        activeStatuses.includes(String(item.status || "").trim()) &&
        item.archivedForPatient !== true &&
        item.archived !== true
    );

    if (!toArchive.length) {
        showToast("No active appointments to archive.");
        return;
    }

    const remaining = appointments.filter(item =>
        !toArchive.some(a => String(a.id) === String(item.id))
    );

    const archivedItems = toArchive.map(item => ({
        ...item,
        archived: true,
        archivedForPatient: true,
        updatedAt: new Date().toISOString(),
        archivedAt: new Date().toISOString(),
        archivedBy: "patient-clear-all"
    }));

    saveAppointmentsShared(remaining);
    saveArchivedAppointmentsShared([...archivedItems, ...archive]);

    showToast("All active appointments moved to archive.");
    addNotification("All active appointments were archived.");
    renderAllPatientUI();
}

function clearArchive() {
    const archive = getArchivedAppointmentsShared();

    if (!archive.length) {
        showToast("Archive is already empty.");
        return;
    }

    saveArchivedAppointmentsShared([]);
    showToast("Archive cleared permanently.");
    addNotification("Archived records were permanently removed.");
    renderAllPatientUI();
}

// Function to pull an appointment out of Archive
function restoreFromArchive(id) {
    let data = JSON.parse(localStorage.getItem('appointments')) || [];
    let archive = getArchivedAppointmentsShared();

    const itemIndex = archive.findIndex(item => String(item.id) === String(id));

    if (itemIndex > -1) {
        const itemToRestore = archive.splice(itemIndex, 1)[0];
        data.unshift(itemToRestore);

        localStorage.setItem('appointments', JSON.stringify(data));
        localStorage.setItem('archivedAppointments', JSON.stringify(archive));

        loadArchiveUI(); // Refresh archive table
        loadAppointmentsUI(); // Refresh main table
        showToast("Appointment restored 🔄");
    }
}

// Function to render the Archive table
function loadArchiveUI() {
    const archiveBody = document.getElementById("archiveTableBody");
    if (!archiveBody) return;

    const filters = getPatientFilterValues();
    let archive = getArchivedAppointmentsShared();

    archive = archive.filter(apt =>
        matchesRecordFilter(apt, filters.archiveSearch, filters.archiveStatus)
    );

    archiveBody.innerHTML = "";

    if (!archive.length) {
        archiveBody.innerHTML = `
            <tr>
                <td colspan="3" class="text-center text-muted py-4">
                    No matching archived records found.
                </td>
            </tr>
        `;
        return;
    }

    archive.forEach(apt => {
        archiveBody.innerHTML += `
            <tr>
                <td class="fw-bold">${apt.service}</td>
                <td>${apt.schedule}</td>
                <td>
                    <button class="btn btn-sm btn-outline-primary me-1" onclick="restoreAppointment('${apt.id}')">
                        Restore
                    </button>
                    <button class="btn btn-sm btn-outline-danger" onclick="permanentlyDelete('${apt.id}')">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    });
}


function restoreAppointment(id) {
    let archive = getArchivedAppointmentsShared();
    let appointments = getAppointmentsShared();

    const itemIndex = archive.findIndex(item => String(item.id) === String(id));
    if (itemIndex === -1) {
        showToast("Archived item not found.");
        return;
    }

    const itemToRestore = { ...archive[itemIndex] };
    archive.splice(itemIndex, 1);

    itemToRestore.archived = false;
    itemToRestore.archivedForPatient = false;
    itemToRestore.updatedAt = new Date().toISOString();
    delete itemToRestore.archivedAt;
    delete itemToRestore.archivedBy;

    const existingIndex = appointments.findIndex(item => String(item.id) === String(id));
    if (existingIndex > -1) {
        appointments[existingIndex] = itemToRestore;
    } else {
        appointments.unshift(itemToRestore);
    }

    saveAppointmentsShared(appointments);
    saveArchivedAppointmentsShared(archive);

    showToast("Appointment restored.");
    addNotification("An archived appointment was restored.");
    renderAllPatientUI();
}



// 2. Close the modal
function closeClearModal() {
    document.getElementById("clearArchiveModal").classList.remove("active");
}

// 3. Handle the actual clearing logic
document.getElementById("confirmClearAllBtn").onclick = function() {
    // Perform the permanent deletion
    localStorage.removeItem('archivedAppointments');
    
    // UI Updates
    loadArchiveUI();
    closeClearModal();
    showToast("Archive cleared 🧹");
    addNotification("Archive history has been wiped.");
};

// Function to permanently wipe an archived item
// Variable to store the ID of the item to be permanently deleted
// ==============================
// PERMANENT DELETE FROM ARCHIVE
// ==============================
let permanentDeleteId = null;

function permanentlyDelete(id) {
    permanentDeleteId = String(id);
    const modal = document.getElementById("permanentDeleteModal");
    if (modal) {
        modal.classList.add("active");
    }
}

function closePermanentDeleteModal() {
    const modal = document.getElementById("permanentDeleteModal");
    if (modal) {
        modal.classList.remove("active");
    }
    permanentDeleteId = null;
}

document.getElementById("confirmPermanentDeleteBtn")?.addEventListener("click", function () {
    if (!permanentDeleteId) return;

    let archive = getArchivedAppointmentsShared();

    archive = archive.filter(item => String(item.id) !== String(permanentDeleteId));

    saveArchivedAppointmentsShared(archive);

    closePermanentDeleteModal();
    loadArchiveUI();
    loadAppointmentsUI();
    renderHeroAppointment?.();

    showToast("Archived record permanently deleted.");
    addNotification("An archived record was permanently deleted.");
});
let isEditingProfile = false;

function setProfileEditingState(isEditing) {
    const fields = [
        document.getElementById("profileFullName"),
        document.getElementById("profileEmail"),
        document.getElementById("profilePhone"),
        document.getElementById("profileNewPassword"),
        document.getElementById("profileConfirmPassword")
    ];

    fields.forEach(field => {
        if (field) field.disabled = !isEditing;
    });

    const btn = document.getElementById("editProfileBtn");
    if (btn) {
        btn.textContent = isEditing ? "Save Changes" : "Edit Profile";
    }

    isEditingProfile = isEditing;
}

function loadSavedProfile() {
    loadLoggedInPatientUI();

    const sessionUser = getCurrentUser() || {};
    const profileKey = `userProfileData_${sessionUser.email || sessionUser.id || "patient"}`;
    const savedProfile = JSON.parse(localStorage.getItem(profileKey)) || {};

    const fullNameInput = document.getElementById("profileFullName");
    const emailInput = document.getElementById("profileEmail");
    const phoneInput = document.getElementById("profilePhone");

    if (fullNameInput && savedProfile.fullName) {
        fullNameInput.value = savedProfile.fullName;
    }

    if (emailInput && savedProfile.email) {
        emailInput.value = savedProfile.email;
    }

    if (phoneInput && savedProfile.phone) {
        phoneInput.value = savedProfile.phone;
    }

    updateProfileTextUI();
}

function updateProfileTextUI() {
    const fullName = document.getElementById("profileFullName")?.value || "Patient";

    const settingsName = document.getElementById("settingsPatientName");
    if (settingsName) settingsName.textContent = fullName;

    const headerName = document.getElementById("headerPatientName");
    if (headerName) headerName.textContent = fullName;
}

function saveProfileChanges() {
    const fullNameInput = document.getElementById("profileFullName");
    const emailInput = document.getElementById("profileEmail");
    const phoneInput = document.getElementById("profilePhone");
    const newPasswordInput = document.getElementById("profileNewPassword");
    const confirmPasswordInput = document.getElementById("profileConfirmPassword");

    const fullName = fullNameInput?.value.trim() || "";
    const email = emailInput?.value.trim() || "";
    const phone = phoneInput?.value.trim() || "";
    const newPassword = newPasswordInput?.value || "";
    const confirmPassword = confirmPasswordInput?.value || "";

    if (!fullName) {
        showToast("Full name is required ❗");
        return false;
    }

    if (!email) {
        showToast("Email is required ❗");
        return false;
    }

    if (newPassword || confirmPassword) {
        if (newPassword !== confirmPassword) {
            showToast("Passwords do not match ❗");
            return false;
        }
    }

        const sessionUser = getCurrentUser() || {};
        const profileKey = `userProfileData_${sessionUser.email || sessionUser.id || "patient"}`;

        const profileData = {
            fullName,
            email,
            phone
        };

        localStorage.setItem(profileKey, JSON.stringify(profileData));

    updateProfileTextUI();

    if (newPasswordInput) newPasswordInput.value = "";
    if (confirmPasswordInput) confirmPasswordInput.value = "";

    showToast("Profile updated successfully! ✅");
    return true;
}
function loadLoggedInPatientUI() {
    const sessionUser = getCurrentUser() || {};

    const profileKey = `userProfileData_${sessionUser.email || sessionUser.id || "patient"}`;
    const savedProfile = JSON.parse(localStorage.getItem(profileKey)) || {};

    const fullName =
        sessionUser.name ||
        sessionUser.fullName ||
        savedProfile.fullName ||
        "Patient";

    const email =
        sessionUser.email ||
        savedProfile.email ||
        "";

    const phone =
        savedProfile.phone || "";

    const patientId =
        sessionUser.patientId ||
        sessionUser.patient_id ||
        (sessionUser.id ? `PT-${String(sessionUser.id).slice(0, 6).toUpperCase()}` : "PT-001");

    const fullNameInput = document.getElementById("profileFullName");
    const emailInput = document.getElementById("profileEmail");
    const phoneInput = document.getElementById("profilePhone");

    if (fullNameInput) fullNameInput.value = fullName;
    if (emailInput) emailInput.value = email;
    if (phoneInput) phoneInput.value = phone;

    const headerPatientName = document.getElementById("headerPatientName");
    const headerPatientId = document.getElementById("headerPatientId");

    if (headerPatientName) headerPatientName.textContent = fullName;
    if (headerPatientId) headerPatientId.textContent = `ID: #${patientId}`;

    const settingsPatientName = document.getElementById("settingsPatientName");
    const settingsPatientId = document.getElementById("settingsPatientId");

    if (settingsPatientName) settingsPatientName.textContent = fullName;
    if (settingsPatientId) settingsPatientId.textContent = `Patient ID: #${patientId}`;

    const generatedAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=4e73df&color=fff`;

    const profileDisplay = document.getElementById("profileDisplay");
    const headerProfileImg = document.getElementById("header-profile-img");

    const photoKey = `userProfilePhoto_${sessionUser.email || sessionUser.id || "patient"}`;
    const savedPhoto = localStorage.getItem(photoKey);
    const finalPhoto = savedPhoto || generatedAvatar;

    if (profileDisplay) profileDisplay.src = finalPhoto;
    if (headerProfileImg) headerProfileImg.src = finalPhoto;
}


// 2. Handle the "Delete" button click inside the modal
document.getElementById("confirmPermanentDeleteBtn").onclick = function() {
    if (!permanentDeleteId) return;

    // Fetch archive data
    let archive = JSON.parse(localStorage.getItem('archivedAppointments')) || [];
    
    // Filter out the selected item
    archive = archive.filter(item => String(item.id) !== String(permanentDeleteId));
    
    // Save back to localStorage
    localStorage.setItem('archivedAppointments', JSON.stringify(archive));
    
    // UI Updates
    loadArchiveUI();
    closePermanentDeleteModal();
    showToast("Permanently deleted ❌");
};

// 3. Helper to close the permanent delete modal


document.addEventListener('click', function(event) {
    const panel = document.querySelector('.side-panel');
    const moreTipsLink = document.querySelector('.more-tips-link');

    // Check if the panel is currently open
    if (panel.classList.contains('active')) {
        // If the click is NOT inside the panel AND NOT on the "More Tips" link
        if (!panel.contains(event.target) && !moreTipsLink.contains(event.target)) {
            panel.classList.remove('active');
        }
    }
});

function openDeleteModal() {
    const modal = document.getElementById('deleteModal');
    if (modal) modal.style.display = 'flex';
}

function closeDeleteModal() {
    const modal = document.getElementById("deleteModal");
    if (modal) {
        modal.classList.remove("active");
    }

    const backdrops = document.querySelectorAll(".modal-backdrop");
    backdrops.forEach(b => b.remove());

    document.body.classList.remove("modal-open");
    document.body.style.overflow = "";
    document.body.style.paddingRight = "";

    appointmentIdToDelete = null;
}

// Apply the same 'flex' logic to your permanentDeleteModal and clearArchiveModal
// 1. Select the correct elements
function openGuide() {
    document.getElementById("dental-guide-panel").style.display = "block";
    document.body.style.overflow = "hidden"; // Locks the background
}

function closeGuide() {
    document.getElementById("dental-guide-panel").style.display = "none";
    document.body.style.overflow = "auto"; // Restores scrolling
}

document.getElementById('addToCalendarBtn')?.addEventListener('click', function() {
    const apt = window.currentHeroAppointment;

    if (!apt) {
        showToast("No upcoming appointment found.");
        return;
    }

    const start = parseAppointmentDateTime(apt.schedule);
    if (!start) {
        showToast("Invalid appointment schedule.");
        return;
    }

    const end = new Date(start.getTime() + 60 * 60 * 1000);

    const formatGoogleDate = (d) => {
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const dd = String(d.getDate()).padStart(2, '0');
        const hh = String(d.getHours()).padStart(2, '0');
        const mi = String(d.getMinutes()).padStart(2, '0');
        const ss = "00";
        return `${yyyy}${mm}${dd}T${hh}${mi}${ss}`;
    };

    const eventTitle = `${apt.service} - G-M Dental`;
    const location = "Ganal-Mappala Dental Clinic";
    const description = `Dental appointment for ${apt.service}.`;

    const googleCalendarUrl =
        `https://www.google.com/calendar/render?action=TEMPLATE` +
        `&text=${encodeURIComponent(eventTitle)}` +
        `&dates=${formatGoogleDate(start)}/${formatGoogleDate(end)}` +
        `&details=${encodeURIComponent(description)}` +
        `&location=${encodeURIComponent(location)}` +
        `&sf=true&output=xml`;

    window.open(googleCalendarUrl, '_blank');
});

function toggleTipsPanel(show) {
    const panel = document.getElementById('tipsPanel');
    if (!panel) {
        console.log("tipsPanel NOT FOUND");
        return;
    }

    console.log("toggle fired:", show);

    panel.classList.toggle('active', show);
}
function parseAppointmentDateTime(schedule) {
    if (!schedule) return null;

    const parts = schedule.split('•').map(s => s.trim());
    if (parts.length !== 2) return null;

    const datePart = parts[0];
    const timePart = parts[1];

    const parsed = new Date(`${datePart} ${timePart}`);
    return isNaN(parsed.getTime()) ? null : parsed;
}

function formatHeroWhen(dateObj) {
    if (!dateObj) return "soon";

    const now = new Date();

    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const target = new Date(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate());

    const diffMs = target - today;
    const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "today";
    if (diffDays === 1) return "tomorrow";

    return dateObj.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
}

function getNextUpcomingAppointment() {
    const appointments = getAppointmentsShared();

    const validAppointments = appointments
        .filter(a =>
            a &&
            a.schedule &&
            a.service &&
            a.archivedForPatient !== true &&
            a.archived !== true &&
            ["Pending", "Approved", "Upcoming", "Reschedule Requested"].includes(String(a.status || "").trim())
        )
        .map(a => ({
            ...a,
            parsedDate: parseAppointmentDateTime(a.schedule)
        }))
        .filter(a => a.parsedDate);

    if (!validAppointments.length) return null;

    validAppointments.sort((a, b) => a.parsedDate - b.parsedDate);

    const now = new Date();
    const future = validAppointments.find(a => a.parsedDate >= now);

    return future || validAppointments[0];
}

function renderHeroAppointment() {
    const heroWelcomeText = document.getElementById("heroWelcomeText");
    const heroText = document.getElementById("heroUpcomingText");
    const heroBtn = document.getElementById("heroViewDetailsBtn");

    const badge = document.getElementById("appointmentStatusBadge");
    const title = document.getElementById("appointmentServiceTitle");
    const scheduleText = document.getElementById("appointmentScheduleText");
    const includesList = document.getElementById("appointmentIncludesList");
    const addToCalendarBtn = document.getElementById("addToCalendarBtn");
    const rescheduleBtn = document.getElementById("rescheduleBtn");

    const sessionUser = currentPatientUser || getCurrentUser() || {};
    const firstNameRaw =
        sessionUser.name ||
        sessionUser.fullName ||
        sessionUser.email ||
        "Patient";

    const firstName = String(firstNameRaw).trim().split(" ")[0] || "Patient";

    if (heroWelcomeText) {
        heroWelcomeText.textContent = `Welcome, ${firstName}! 👋`;
    }

    const upcoming = getNextUpcomingAppointment();

    if (!upcoming) {
        if (heroText) {
            heroText.textContent = "You have no upcoming appointments.";
        }

        if (heroBtn) {
            heroBtn.disabled = true;
            heroBtn.style.opacity = "0.6";
            heroBtn.style.pointerEvents = "none";
        }

        if (badge) badge.textContent = "No Appointment";
        if (title) title.textContent = "No upcoming appointments";
        if (scheduleText) scheduleText.textContent = "Book an appointment to see details here.";

        if (includesList) {
            includesList.innerHTML = `<li class="mb-2">No service selected yet.</li>`;
        }

        if (addToCalendarBtn) addToCalendarBtn.disabled = true;
        if (rescheduleBtn) rescheduleBtn.disabled = true;

        window.currentHeroAppointment = null;
        return;
    }

    const serviceData = services.find(s => s.name === upcoming.service);
    const whenText = formatHeroWhen(upcoming.parsedDate);

    if (heroText) {
        heroText.innerHTML = `You have an upcoming <strong>${upcoming.service}</strong> ${whenText}.`;
    }

    if (heroBtn) {
        heroBtn.disabled = false;
        heroBtn.style.opacity = "1";
        heroBtn.style.pointerEvents = "auto";
    }

    if (badge) badge.textContent = upcoming.status || "Upcoming";
    if (title) title.textContent = upcoming.service;
    if (scheduleText) scheduleText.textContent = `Scheduled for ${upcoming.schedule}`;

    if (includesList) {
        if (serviceData && Array.isArray(serviceData.includes) && serviceData.includes.length) {
            includesList.innerHTML = serviceData.includes.map(item => `
                <li class="mb-2">
                    <i class="bi bi-check2-circle text-primary me-2"></i>${item}
                </li>
            `).join("");
        } else {
            includesList.innerHTML = `<li class="mb-2">No included details available.</li>`;
        }
    }

    if (addToCalendarBtn) addToCalendarBtn.disabled = false;
    if (rescheduleBtn) rescheduleBtn.disabled = false;

    window.currentHeroAppointment = upcoming;
}
function toggleProfileDropdown(forceClose = false) {
    const dropdown = document.getElementById("profileDropdownMenu");
    if (!dropdown) return;

    if (forceClose) {
        dropdown.classList.remove("active");
        return;
    }

    dropdown.classList.toggle("active");
}
function initCustomDropdown(id) {
  const dropdown = document.getElementById(id);
  if (!dropdown) return;

  const selected = dropdown.querySelector(".dropdown-selected");
  const options = dropdown.querySelector(".dropdown-options");
  if (!selected || !options) return;

  // default value
  if (!dropdown.dataset.value) {
    dropdown.dataset.value = "";
  }

  selected.addEventListener("click", (e) => {
    e.stopPropagation();

    document.querySelectorAll(".custom-dropdown").forEach(d => {
      if (d !== dropdown) d.classList.remove("open");
    });

    dropdown.classList.toggle("open");
  });

  options.querySelectorAll("div").forEach(opt => {
    opt.addEventListener("click", (e) => {
      e.stopPropagation();

      const value = opt.dataset.value || "";
      selected.textContent = opt.textContent.trim();

      // save selected value here
      dropdown.dataset.value = value;

      dropdown.classList.remove("open");

      // refresh tables immediately
      loadAppointmentsUI();
      loadArchiveUI();
    });
  });

  document.addEventListener("click", (e) => {
    if (!dropdown.contains(e.target)) {
      dropdown.classList.remove("open");
    }
  });
}
function calculateAge(dob) {
  if (!dob) return "";

  const birthDate = new Date(dob);
  if (Number.isNaN(birthDate.getTime())) return "";

  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return age >= 0 ? age : "";
}
function cancelBillingPayment() {
    const pending = JSON.parse(localStorage.getItem("pendingPayment") || "null");

    const billDown = document.getElementById("billDown");
    const paymentMethodInput = document.getElementById("paymentMethod");
    const confirmBtn = document.getElementById("confirmPaymentBtn");
    const downPaymentWrapper = document.getElementById("downPaymentWrapper");

    // reset UI
    document.querySelectorAll('.payment-card').forEach(card => {
        card.classList.remove('active');
    });

    const defaultCard = document.querySelector('.payment-card[data-method="card"]');
    if (defaultCard) defaultCard.classList.add('active');

    document.querySelectorAll('.payment-form').forEach(form => form.classList.add('d-none'));
    const cardForm = document.getElementById('cardForm');
    if (cardForm) cardForm.classList.remove('d-none');

    if (paymentMethodInput) paymentMethodInput.value = "card";
    if (confirmBtn) confirmBtn.innerText = "Confirm Payment";
    if (downPaymentWrapper) downPaymentWrapper.classList.remove('d-none');

    if (billDown) {
        if (pending) {
            const restoreAmount =
                pending.paymentStatus === "Partial"
                    ? Number(pending.remainingBalance || 0)
                    : Number(
                        pending.minimumDownPayment > 0
                            ? pending.minimumDownPayment
                            : pending.remainingBalance || 0
                      );

            billDown.value = restoreAmount > 0 ? String(restoreAmount) : "";
            billDown.dataset.lastOnlineAmount = billDown.value;
        } else {
            billDown.value = "";
            delete billDown.dataset.lastOnlineAmount;
        }

        billDown.setAttribute("required", "required");
    }

    showSection("my-appointments");
    showToast("Payment cancelled for now.");
}
const chatbotFab = document.getElementById("chatbotFab");
const chatbotPanel = document.getElementById("chatbotPanel");
const closeChatbot = document.getElementById("closeChatbot");
const chatbotMessages = document.getElementById("chatbotMessages");
const chatbotInput = document.getElementById("chatbotInput");
const sendChatbotBtn = document.getElementById("sendChatbotBtn");

chatbotFab?.addEventListener("click", () => {
  chatbotPanel?.classList.toggle("active");
});

closeChatbot?.addEventListener("click", () => {
  chatbotPanel?.classList.remove("active");
});

function addChatMessage(role, text) {
  if (!chatbotMessages) return;

  const div = document.createElement("div");
  div.className = role === "user" ? "user-msg" : "bot-msg";
  div.textContent = text;
  chatbotMessages.appendChild(div);
  chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
}

function getSelectedServiceDetails() {
  if (window.selectedServiceObj) {
    return {
      name: window.selectedServiceObj.name || "",
      price: window.selectedServiceObj.price || 0,
      description: window.selectedServiceObj.description || "",
      includes: window.selectedServiceObj.includes || []
    };
  }

  return {
    name: "",
    price: 0,
    description: "",
    includes: []
  };
}

function getChatbotPageContext() {
  const activeView = document.querySelector(".view.active")?.id || "dashboard";
  const currentUser = JSON.parse(sessionStorage.getItem("gm_dental_current_user") || "null");
  const pendingPayment = JSON.parse(localStorage.getItem("pendingPayment") || "null");
  const selected = getSelectedServiceDetails();

  return {
    patientName:
      currentUser?.name ||
      currentUser?.fullName ||
      currentUser?.email ||
      "Patient",

    currentSection: activeView,

    selectedService: selected.name || pendingPayment?.service || "",
    selectedPrice: selected.price || pendingPayment?.price || 0,

    appointmentStatus: pendingPayment?.status || "",
    paymentStatus: pendingPayment?.paymentStatus || ""
  };
}

async function sendChatbotMessage(customText = "") {
  const message = customText || chatbotInput?.value.trim();

  if (!message) return;

  addChatMessage("user", message);
  if (chatbotInput) chatbotInput.value = "";

  const loadingNode = document.createElement("div");
  loadingNode.className = "bot-msg";
  loadingNode.textContent = "Typing...";
  chatbotMessages?.appendChild(loadingNode);
  chatbotMessages.scrollTop = chatbotMessages.scrollHeight;

  try {
    const context = getChatbotPageContext();

    const response = await fetch("http://localhost:3000/api/patient-chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message,
        ...context
      })
    });

    const data = await response.json();
    loadingNode.remove();

    addChatMessage(
      "bot",
      data?.reply || "Sorry, I could not generate a reply right now."
    );
  } catch (error) {
    loadingNode.remove();
    addChatMessage(
      "bot",
      "Sorry, the chatbot is currently unavailable."
    );
    console.error("Chatbot frontend error:", error);
  }
}

sendChatbotBtn?.addEventListener("click", () => {
  sendChatbotMessage();
});

chatbotInput?.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    sendChatbotMessage();
  }
});

document.querySelectorAll(".chat-chip").forEach((chip) => {
  chip.addEventListener("click", () => {
    sendChatbotMessage(chip.dataset.chat || "");
  });
});

async function askPatientAssistant(message) {
  const selectedServiceObj = window.selectedServiceObj || null;
  const appointments = JSON.parse(localStorage.getItem("appointments") || "[]");
  const latestAppointment = appointments.length ? appointments[appointments.length - 1] : null;

  const payload = {
    message,
    currentSection: document.querySelector(".view.active")?.id || "unknown",
    selectedService: selectedServiceObj?.name || "",
    selectedPrice: selectedServiceObj?.price || 0,
    appointmentStatus: latestAppointment?.status || "",
    paymentStatus: latestAppointment?.paid ? "Paid" : "Unpaid",
    patientName: JSON.parse(localStorage.getItem("loggedInUser") || "{}")?.name || "Patient"
  };

  const res = await fetch("http://localhost:3000/api/patient-chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  const data = await res.json();
  return data.reply || "Sorry, I could not answer that right now.";
}