document.documentElement.classList.add("js");

// Theme toggle & year
const body = document.body;
const themeToggle = document.getElementById("themeToggle");
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");
const yearSpan = document.getElementById("year");

// Set current year
if (yearSpan) {
  yearSpan.textContent = new Date().getFullYear();
}

// Detect system theme preference and apply it
const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

// Load theme from localStorage or use system preference
const storedTheme = localStorage.getItem("theme");
if (storedTheme === "light") {
  body.classList.remove("dark-theme");
  body.classList.add("light-theme");
  if (themeToggle) themeToggle.textContent = "☀";
} else if (storedTheme === "dark" || (storedTheme === null && systemPrefersDark)) {
  body.classList.remove("light-theme");
  body.classList.add("dark-theme");
  if (themeToggle) themeToggle.textContent = "☾";
} else {
  body.classList.remove("dark-theme");
  body.classList.add("light-theme");
  if (themeToggle) themeToggle.textContent = "☀";
}

if (themeToggle) {
  themeToggle.setAttribute("aria-pressed", String(body.classList.contains("dark-theme")));
}

function toggleTheme() {
  if (body.classList.contains("dark-theme")) {
    body.classList.remove("dark-theme");
    body.classList.add("light-theme");
    localStorage.setItem("theme", "light");
    themeToggle.textContent = "☀";
    themeToggle.setAttribute("aria-pressed", "false");
  } else {
    body.classList.remove("light-theme");
    body.classList.add("dark-theme");
    localStorage.setItem("theme", "dark");
    themeToggle.textContent = "☾";
    themeToggle.setAttribute("aria-pressed", "true");
  }
}

if (themeToggle) {
  themeToggle.addEventListener("click", toggleTheme);
}

// Mobile menu functionality
if (menuToggle && navLinks) {
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("nav-open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  // Close on link click (mobile)
  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("nav-open");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });
}

// ============================
// SCROLL-TRIGGERED SECTION REVEAL
// ============================

const sections = document.querySelectorAll(".section");

if ("IntersectionObserver" in window) {
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          sectionObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
  );

  sections.forEach((section) => sectionObserver.observe(section));
} else {
  sections.forEach((section) => section.classList.add("visible"));
}

// ============================
// ACTIVE NAV LINK HIGHLIGHTING
// ============================

const navAnchors = document.querySelectorAll(".nav-links a[href^='#']");
const sectionTargets = [];

navAnchors.forEach((anchor) => {
  const id = anchor.getAttribute("href").substring(1);
  const el = document.getElementById(id);
  if (el) sectionTargets.push({ anchor, el });
});

function updateActiveNav() {
  const scrollY = window.scrollY + 120;

  let currentSection = null;
  for (const { anchor, el } of sectionTargets) {
    if (el.offsetTop <= scrollY) {
      currentSection = anchor;
    }
  }

  navAnchors.forEach((a) => a.classList.remove("active"));
  if (currentSection) currentSection.classList.add("active");
}

window.addEventListener("scroll", updateActiveNav, { passive: true });
updateActiveNav();

// ============================
// SMOOTH SCROLL FOR NAV LINKS
// ============================

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    const targetId = this.getAttribute("href").substring(1);
    const targetEl = document.getElementById(targetId);
    if (targetEl) {
      e.preventDefault();
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      targetEl.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });

      // Update URL without jumping
      history.pushState(null, null, `#${targetId}`);
    }
  });
});
