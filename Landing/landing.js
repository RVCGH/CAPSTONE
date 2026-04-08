// ==============================
// SAFE ELEMENT SELECTORS
// ==============================
const SESSION_KEY = "gm_dental_current_user";

// Only redirect if user came from login (not manual open)

const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");
const verifyForm = document.getElementById("verifyForm");

const showRegister = document.getElementById("showRegister");
const showLogin = document.getElementById("showLogin");
const showVerify = document.getElementById("showVerify");
const backToLoginAfterVerify = document.getElementById("backToLoginAfterVerify");

const loginRole = document.getElementById("loginRole");
const branchDiv = document.getElementById("branchDiv");

const registerFormElement = document.getElementById("registerFormElement");
const loginFormElement = document.getElementById("loginFormElement");

const themeToggle = document.getElementById("themeToggle");
const backToTop = document.getElementById("backToTop");
const serviceSearch = document.getElementById("serviceSearch");
const serviceItems = document.querySelectorAll(".service-item");
const noServiceMessage = document.getElementById("noServiceMessage");
const filterChips = document.querySelectorAll(".service-filter-chip");

const appToast = document.getElementById("appToast");
const appToastTitle = document.getElementById("appToastTitle");
const appToastMessage = document.getElementById("appToastMessage");
const appToastIcon = document.getElementById("appToastIcon");
const appToastClose = document.getElementById("appToastClose");

const navLinks = document.querySelectorAll(".navbar .nav-link");
const sections = document.querySelectorAll("section[id]");
const revealItems = document.querySelectorAll(".reveal-up");
const loginModal = document.getElementById("loginModal");
const faqItems = document.querySelectorAll(".faq-item");
const passwordToggles = document.querySelectorAll(".password-toggle");
const countUpItems = document.querySelectorAll(".count-up");
const scrollProgress = document.getElementById("scrollProgress");
const cursorGlow = document.getElementById("cursorGlow");
const navbar = document.getElementById("mainNavbar");
const tiltCards = document.querySelectorAll(".tilt-card, .magnetic-card, .hero-carousel-card");

const regPassword = document.getElementById("regPassword");
const regConfirmPassword = document.getElementById("regConfirmPassword");
const confirmPasswordError = document.getElementById("confirmPasswordError");
const regTerms = document.getElementById("regTerms");
const termsError = document.getElementById("termsError");
const registerBtn = document.getElementById("registerBtn");
const acceptTermsBtn = document.getElementById("acceptTermsBtn");
const termsModalEl = document.getElementById("termsModal");

const openTermsPanel = document.getElementById("openTermsPanel");
const closeTermsPanel = document.getElementById("closeTermsPanel");
const cancelTermsPanel = document.getElementById("cancelTermsPanel");
const termsPanelOverlay = document.getElementById("termsPanelOverlay");


let toastTimeout = null;
let verificationPollInterval = null;
let activeFilter = "all";

// ==============================
// TOAST
// ==============================
function showToast(type, title, message) {
  if (!appToast || !appToastTitle || !appToastMessage || !appToastIcon) return;

  appToast.classList.remove("success", "error", "info");
  appToast.classList.add(type, "show");

  appToastTitle.textContent = title;
  appToastMessage.textContent = message;

  if (type === "success") {
    appToastIcon.textContent = "✅";
  } else if (type === "error") {
    appToastIcon.textContent = "❌";
  } else {
    appToastIcon.textContent = "ℹ️";
  }

  if (toastTimeout) clearTimeout(toastTimeout);

  toastTimeout = setTimeout(() => {
    appToast.classList.remove("show");
  }, 4200);
}

if (appToastClose) {
  appToastClose.addEventListener("click", () => {
    appToast.classList.remove("show");
    if (toastTimeout) clearTimeout(toastTimeout);
  });
}

// ==============================
// THEME / DARK MODE
// ==============================
function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);

  if (themeToggle) {
    themeToggle.innerHTML =
      theme === "dark"
        ? `<i class="bi bi-sun-fill"></i><span>Light Mode</span>`
        : `<i class="bi bi-moon-stars-fill"></i><span>Dark Mode</span>`;
  }

  localStorage.setItem("theme", theme);
}

(function initTheme() {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme) {
    applyTheme(savedTheme);
  } else {
    applyTheme("light");
  }
})();

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const currentTheme = document.documentElement.getAttribute("data-theme");
    applyTheme(currentTheme === "dark" ? "light" : "dark");
  });
}



// ==============================
// FORM SWITCHING
// ==============================
// ==============================
// 🔥 NEW AUTH SLIDE SYSTEM
// ==============================

// ==============================
// AUTH SLIDER SYSTEM
// ==============================
const authContainer = document.getElementById("authContainer");
const signInContainer = document.querySelector(".sign-in-container");
const signUpContainer = document.querySelector(".sign-up-container");

const showRegisterBtns = [
  document.getElementById("showRegisterOverlay")
].filter(Boolean);

const showLoginBtns = [
  document.getElementById("showLoginOverlay"),
  document.getElementById("backToLoginAfterVerify")
].filter(Boolean);

function switchAuth(mode) {
  const isMobile = window.innerWidth <= 991;

  if (isMobile) {
    signInContainer?.classList.remove("active-mobile");
    signUpContainer?.classList.remove("active-mobile");

    if (mode === "register") {
      signUpContainer?.classList.add("active-mobile");
    } else {
      signInContainer?.classList.add("active-mobile");
    }
    return;
  }

  if (mode === "register") {
    authContainer?.classList.add("right-panel-active");
  } else {
    authContainer?.classList.remove("right-panel-active");
  }
}

showRegisterBtns.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    switchAuth("register");
  });
});

showLoginBtns.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    if (verifyForm) verifyForm.classList.add("d-none");
    switchAuth("login");
  });
});

window.addEventListener("load", () => {
  switchAuth("login");
});

window.addEventListener("resize", () => {
  if (!authContainer) return;

  if (authContainer.classList.contains("right-panel-active")) {
    switchAuth("register");
  } else {
    switchAuth("login");
  }
});
// ==============================
// OPTIONAL LOGIN ROLE LOGIC
// ==============================
if (loginRole && branchDiv) {
  loginRole.addEventListener("change", () => {
    branchDiv.style.display = loginRole.value === "admin" ? "block" : "none";
  });
}



function updateRegisterButtonState() {
  if (!registerBtn || !regTerms) return;
  registerBtn.disabled = !regTerms.checked;
}

function showConfirmPasswordError(show) {
  if (!regConfirmPassword || !confirmPasswordError) return;

  regConfirmPassword.classList.toggle("input-error", show);
  confirmPasswordError.classList.toggle("d-none", !show);
}

function showTermsError(show) {
  if (!termsError) return;
  termsError.classList.toggle("d-none", !show);
}

function validateConfirmPassword() {
  if (!regPassword || !regConfirmPassword) return true;

  const password = regPassword.value;
  const confirmPassword = regConfirmPassword.value;

  if (!confirmPassword) {
    showConfirmPasswordError(false);
    return false;
  }

  const matched = password === confirmPassword;
  showConfirmPasswordError(!matched);
  return matched;
}

if (regPassword && regConfirmPassword) {
  regPassword.addEventListener("input", validateConfirmPassword);
  regConfirmPassword.addEventListener("input", validateConfirmPassword);
}

if (regTerms) {
  regTerms.addEventListener("change", () => {
    updateRegisterButtonState();
    if (regTerms.checked) {
      showTermsError(false);
    }
  });
}


window.addEventListener("load", updateRegisterButtonState);
// ==============================
// REGISTER FORM SUBMIT
// ==============================
// ==============================
// REGISTER FORM SUBMIT
// ==============================
// ==============================
// REGISTER FORM SUBMIT
// ==============================
if (registerFormElement) {
  registerFormElement.addEventListener("submit", async function (e) {
    e.preventDefault();

    const submitBtn = this.querySelector('button[type="submit"]');

    const userData = {
      name: document.getElementById("regName")?.value.trim(),
      email: document.getElementById("regEmail")?.value.trim(),
      password: document.getElementById("regPassword")?.value,
      sex: document.getElementById("regSex")?.value,
      dob: document.getElementById("regDOB")?.value,
      mobile: document.getElementById("regMobile")?.value.trim(),
    };

    const confirmPassword = document.getElementById("regConfirmPassword")?.value;

    if (!userData.name || !userData.email || !userData.password || !confirmPassword || !userData.mobile) {
      showToast("error", "Missing Information", "Please fill in all required fields before registering.");
      validateConfirmPassword();
      if (!regTerms?.checked) showTermsError(true);
      return;
    }

    if (!validateConfirmPassword()) {
      showToast("error", "Password Mismatch", "Password and confirm password do not match.");
      return;
    }

    if (!regTerms?.checked) {
      showTermsError(true);
      showToast("error", "Terms Required", "Please agree to the Terms and Conditions before registering.");
      updateRegisterButtonState();
      return;
    }

    try {
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = "Registering...";
      }

      const response = await fetch("http://localhost:3000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(userData)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Registration failed.");
      }

      showConfirmPasswordError(false);
      showTermsError(false);

      if (verifyForm) {
        verifyForm.classList.remove("d-none");
      }

      showToast("info", "Verification Sent", "We sent a verification email. Please check your inbox.");
      startVerificationPolling(userData.email);

    } catch (error) {
      console.error("Registration error:", error);
      showToast("error", "Registration Failed", error.message || "Registration failed. Please try again.");
    } finally {
      if (submitBtn) {
        submitBtn.textContent = "Register";
        updateRegisterButtonState();
      }
    }
  });
}

// ==============================
// LOGIN FORM SUBMIT
// ==============================
if (loginFormElement) {
  loginFormElement.addEventListener("submit", async function (e) {
    e.preventDefault();

    const email = document.getElementById("loginEmail")?.value.trim().toLowerCase();
    const password = document.getElementById("loginPassword")?.value;

    if (!email || !password) {
      showToast("error", "Login Required", "Please enter your email and password.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Login failed.");
      }

      if (!result.user) {
        throw new Error("No user data returned from server.");
      }
        const safeUser = {
          id: result.user.id || "",
          name: result.user.name || "",
          email: (result.user.email || email).toLowerCase(),
          role: result.user.role || "patient",

          // 🔥 ADD THESE
          sex: result.user.sex || "",
          dob: result.user.dob || "",
          mobile: result.user.mobile || "",
          address: result.user.address || "",
          condition: result.user.condition || ""
        };

      if (!["admin", "dentist", "patient"].includes(safeUser.role)) {
        throw new Error("Invalid role returned from server.");
      }

      sessionStorage.setItem("gm_dental_current_user", JSON.stringify(safeUser));
      sessionStorage.setItem("gm_dental_session_lock", JSON.stringify({
        email: safeUser.email,
        role: safeUser.role
      }));
      showToast("success", "Login Successful", `Welcome back, ${safeUser.name || safeUser.email}!`);

      setTimeout(() => {
        if (safeUser.role === "admin") {
          window.location.replace("../Admin/admin.html");
        } else if (safeUser.role === "dentist") {
          window.location.replace("../Dentist/dentist_page.html");
        } else {
          window.location.replace("../Patient/patient.html");
        }
      }, 700);

    } catch (error) {
      console.error("Login error:", error);
      showToast("error", "Login Failed", error.message || "Login failed. Please try again.");
    }
  });
}

// ==============================
// PASSWORD TOGGLE
// ==============================
passwordToggles.forEach((btn) => {
  const targetId = btn.getAttribute("data-target");
  const input = document.getElementById(targetId);
  const icon = btn.querySelector("i");

  if (!input || !icon) return;

  function syncPasswordIcon() {
    if (input.type === "password") {
      icon.className = "bi bi-eye-slash";
    } else {
      icon.className = "bi bi-eye";
    }
  }

  syncPasswordIcon();

  btn.addEventListener("click", () => {
    input.type = input.type === "password" ? "text" : "password";
    syncPasswordIcon();
  });
});


function openTermsOverlay() {
  if (!termsPanelOverlay) return;
  termsPanelOverlay.classList.remove("d-none");
  document.body.style.overflow = "hidden";
}

function closeTermsOverlay() {
  if (!termsPanelOverlay) return;
  termsPanelOverlay.classList.add("d-none");
  document.body.style.overflow = "";
}

if (openTermsPanel) {
  openTermsPanel.addEventListener("click", (e) => {
    e.preventDefault();
    openTermsOverlay();
  });
}

if (closeTermsPanel) {
  closeTermsPanel.addEventListener("click", closeTermsOverlay);
}

if (cancelTermsPanel) {
  cancelTermsPanel.addEventListener("click", closeTermsOverlay);
}

if (termsPanelOverlay) {
  termsPanelOverlay.addEventListener("click", (e) => {
    if (e.target === termsPanelOverlay) {
      closeTermsOverlay();
    }
  });
}

if (acceptTermsBtn && regTerms) {
  acceptTermsBtn.addEventListener("click", () => {
    regTerms.checked = true;
    updateRegisterButtonState();
    showTermsError(false);
    closeTermsOverlay();
  });
}
// ==============================
// SERVICE FILTER + SEARCH
// ==============================
function filterServices() {
  const searchValue = (serviceSearch?.value || "").toLowerCase().trim();
  let visibleCount = 0;

  serviceItems.forEach((item) => {
    const text = item.innerText.toLowerCase();
    const category = item.getAttribute("data-category");
    const matchesSearch = text.includes(searchValue);
    const matchesCategory = activeFilter === "all" || category === activeFilter;
    const matched = matchesSearch && matchesCategory;

    item.style.display = matched ? "" : "none";
    if (matched) visibleCount++;
  });

  if (noServiceMessage) {
    noServiceMessage.classList.toggle("d-none", visibleCount !== 0);
  }
}

if (serviceSearch) {
  serviceSearch.addEventListener("input", filterServices);
}

filterChips.forEach((chip) => {
  chip.addEventListener("click", () => {
    filterChips.forEach((btn) => btn.classList.remove("active"));
    chip.classList.add("active");
    activeFilter = chip.getAttribute("data-filter") || "all";
    filterServices();
  });
});

// ==============================
// BACK TO TOP + SCROLL PROGRESS + NAVBAR
// ==============================
function handleScrollEffects() {
  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

  if (scrollProgress) {
    scrollProgress.style.width = `${progress}%`;
  }

  if (backToTop) {
    if (scrollTop > 400) {
      backToTop.style.display = "grid";
      backToTop.style.placeItems = "center";
    } else {
      backToTop.style.display = "none";
    }
  }

  if (navbar) {
    navbar.classList.toggle("navbar-scrolled", scrollTop > 15);
  }

  updateActiveNav();
}

window.addEventListener("scroll", handleScrollEffects);

if (backToTop) {
  backToTop.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
}

// ==============================
// NAV ACTIVE LINK ON SCROLL
// ==============================
function updateActiveNav() {
  let current = "";

  sections.forEach((section) => {
    const sectionTop = section.offsetTop - 140;
    const sectionHeight = section.offsetHeight;

    if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
      current = section.getAttribute("id");
    }
  });

  navLinks.forEach((link) => {
    link.classList.remove("active");
    const href = link.getAttribute("href");
    if (href === `#${current}`) {
      link.classList.add("active");
    }
  });
}

window.addEventListener("load", handleScrollEffects);

// ==============================
// REVEAL ON SCROLL
// ==============================
if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("active");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.15,
    }
  );

  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("active"));
}

// ==============================
// COUNT-UP ANIMATION
// ==============================
function animateCounter(card) {
  const heading = card.querySelector("h3");
  if (!heading) return;

  const target = Number(card.getAttribute("data-target"));
  if (!target || Number.isNaN(target)) return;

  let current = 0;
  const duration = 1200;
  const steps = 40;
  const increment = target / steps;
  const intervalTime = duration / steps;

  const counter = setInterval(() => {
    current += increment;
    if (current >= target) {
      current = target;
      clearInterval(counter);
    }
    heading.textContent = `${Math.round(current)}+`;
  }, intervalTime);
}

if ("IntersectionObserver" in window && countUpItems.length) {
  const countObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        countObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  countUpItems.forEach((item) => countObserver.observe(item));
}

// ==============================
// FAQ
// ==============================
faqItems.forEach((item) => {
  const question = item.querySelector(".faq-question");
  if (!question) return;

  question.addEventListener("click", () => {
    const isActive = item.classList.contains("active");

    faqItems.forEach((faq) => faq.classList.remove("active"));

    if (!isActive) {
      item.classList.add("active");
    }
  });
});

// ==============================
// RESET MODAL STATE WHEN CLOSED
// ==============================
if (loginModal) {
  loginModal.addEventListener("hidden.bs.modal", () => {
    switchAuth("login");

    // Reset forms
    if (registerFormElement) registerFormElement.reset();
    if (loginFormElement) loginFormElement.reset();

    // 🔥 RESET VALIDATION STATES
    if (typeof showConfirmPasswordError === "function") {
      showConfirmPasswordError(false);
    }

    if (typeof showTermsError === "function") {
      showTermsError(false);
    }

    // 🔥 RESET BUTTON STATE
    if (typeof updateRegisterButtonState === "function") {
      updateRegisterButtonState();
    }
        if (typeof closeTermsOverlay === "function") {
      closeTermsOverlay();
    }

    // 🔥 REMOVE ERROR BORDER (extra safety)
    const confirmInput = document.getElementById("regConfirmPassword");
    if (confirmInput) {
      confirmInput.classList.remove("input-error");
    }
  });
}
// ==============================
// VERIFICATION POLLING
// ==============================
function startVerificationPolling(email) {
  if (!email) return;

  if (verificationPollInterval) {
    clearInterval(verificationPollInterval);
  }

  verificationPollInterval = setInterval(async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/verification-status?email=${encodeURIComponent(email)}`
      );

      const result = await response.json();

      if (result.verified) {
        clearInterval(verificationPollInterval);
        verificationPollInterval = null;

        showToast("success", "Email Verified", `${email} is now registered and ready to use.`);
        showVerifyToast(email);

        const loginModalElement = document.getElementById("loginModal");
        if (loginModalElement && typeof bootstrap !== "undefined") {
          const modal =
            bootstrap.Modal.getInstance(loginModalElement) ||
            new bootstrap.Modal(loginModalElement);
          modal.show();
        }

       if (verifyForm) verifyForm.classList.add("d-none");
        switchAuth("login");

        const loginEmail = document.getElementById("loginEmail");
        if (loginEmail) {
          loginEmail.value = email;
        }
      }
    } catch (error) {
      console.error("Verification polling error:", error);
    }
  }, 3000);
}

function showVerifyToast(email) {
  const toast = document.getElementById("verifyToast");
  const text = document.getElementById("verifyEmailText");

  if (!toast || !text) return;

  text.textContent = email + " is now registered.";
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 4000);
}

// ==============================
// CURSOR GLOW
// ==============================
if (cursorGlow) {
  window.addEventListener("mousemove", (e) => {
    cursorGlow.style.left = `${e.clientX}px`;
    cursorGlow.style.top = `${e.clientY}px`;
  });
}

// ==============================
// TILT EFFECT
// ==============================
// ==============================
// TILT EFFECT (SMOOTHER)
// ==============================
tiltCards.forEach((card) => {
  card.style.transition = "transform 0.65s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.65s cubic-bezier(0.22, 1, 0.36, 1)";

  card.addEventListener("mousemove", (e) => {
    if (window.innerWidth < 992) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -2.2;
    const rotateY = ((x - centerX) / centerX) * 2.2;

    card.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-2px) scale(1.01)`;
  });

  card.addEventListener("mouseleave", () => {
    card.style.transform = "perspective(1200px) rotateX(0deg) rotateY(0deg) translateY(0) scale(1)";
  });
});
// ==============================
// CLOSE MOBILE NAV ON LINK CLICK
// ==============================
navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    const navCollapse = document.getElementById("navbarNav");
    if (!navCollapse || typeof bootstrap === "undefined") return;

    if (navCollapse.classList.contains("show")) {
      const bsCollapse = bootstrap.Collapse.getInstance(navCollapse) || new bootstrap.Collapse(navCollapse, { toggle: false });
      bsCollapse.hide();
    }
  });
});
// ==============================
// 🔥 PREMIUM INTERACTIONS
// ==============================

// NAVBAR SCROLL EFFECT
window.addEventListener("scroll", () => {
  const navbar = document.querySelector(".custom-navbar");
  if (!navbar) return;

  if (window.scrollY > 50) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }
});

// HERO PARALLAX EFFECT
window.addEventListener("scroll", () => {
  const hero = document.querySelector(".hero-section");
  if (!hero) return;

  let offset = window.scrollY * 0.3;
  hero.style.backgroundPosition = `center ${offset}px`;
});

// MAGNETIC HOVER EFFECT (CARDS)
const magneticItems = document.querySelectorAll(".service-card, .choose-card, .dentist-card, .process-card, .contact-card, .mini-feature-card");

magneticItems.forEach((item) => {
  item.addEventListener("mousemove", (e) => {
    if (window.innerWidth < 992) return;

    const rect = item.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const moveX = (x - rect.width / 2) * 0.015;
    const moveY = (y - rect.height / 2) * 0.015;

    item.style.transform = `translate3d(${moveX}px, ${moveY - 8}px, 0)`;
  });

  item.addEventListener("mouseleave", () => {
    item.style.transform = "";
  });
});
