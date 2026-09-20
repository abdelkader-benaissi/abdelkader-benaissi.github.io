document.documentElement.classList.add("js");

const root = document.documentElement;
const themeToggle = document.getElementById("themeToggle");
const menuToggle = document.getElementById("menuToggle");
const navigation = document.getElementById("primaryNavigation");
const year = document.getElementById("year");
const systemTheme = window.matchMedia("(prefers-color-scheme: dark)");
const themeKey = "portfolio-theme";

function readStoredTheme() {
  try {
    return localStorage.getItem(themeKey);
  } catch {
    return null;
  }
}

function storeTheme(theme) {
  try {
    localStorage.setItem(themeKey, theme);
  } catch {
    // The selected theme still applies for the current page view.
  }
}

function applyTheme(theme) {
  root.dataset.theme = theme;
  const nextTheme = theme === "dark" ? "light" : "dark";
  if (themeToggle) {
    themeToggle.setAttribute("aria-label", "Switch to " + nextTheme + " theme");
    themeToggle.setAttribute("aria-pressed", String(theme === "dark"));
  }

  const themeMeta = document.querySelector('meta[name="theme-color"]');
  if (themeMeta) {
    themeMeta.setAttribute("content", theme === "dark" ? "#11130f" : "#f3f1ec");
  }
}

const storedTheme = readStoredTheme();
applyTheme(storedTheme === "light" || storedTheme === "dark"
  ? storedTheme
  : systemTheme.matches ? "dark" : "light");

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const nextTheme = root.dataset.theme === "dark" ? "light" : "dark";
    applyTheme(nextTheme);
    storeTheme(nextTheme);
  });
}

systemTheme.addEventListener("change", (event) => {
  if (!readStoredTheme()) {
    applyTheme(event.matches ? "dark" : "light");
  }
});

if (year) {
  year.textContent = String(new Date().getFullYear());
}

function setMenu(open) {
  if (!menuToggle || !navigation) return;
  navigation.classList.toggle("nav-open", open);
  menuToggle.setAttribute("aria-expanded", String(open));
  root.classList.toggle("nav-is-open", open);
}

if (menuToggle && navigation) {
  menuToggle.addEventListener("click", () => {
    setMenu(menuToggle.getAttribute("aria-expanded") !== "true");
  });

  navigation.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => setMenu(false));
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      setMenu(false);
      menuToggle.focus();
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 860) setMenu(false);
  });
}

const navLinks = Array.from(document.querySelectorAll('.primary-nav a[href^="#"]'));
const observedSections = navLinks
  .map((link) => ({
    link,
    section: document.querySelector(link.getAttribute("href"))
  }))
  .filter((item) => item.section);

function markActive(id) {
  observedSections.forEach(({ link, section }) => {
    if (section.id === id) {
      link.setAttribute("aria-current", "true");
    } else {
      link.removeAttribute("aria-current");
    }
  });
}

if ("IntersectionObserver" in window) {
  const visibility = new Map();
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => visibility.set(entry.target.id, entry.intersectionRatio));
    const active = Array.from(visibility.entries())
      .filter(([, ratio]) => ratio > 0)
      .sort((a, b) => b[1] - a[1])[0];
    if (active) markActive(active[0]);
  }, {
    rootMargin: "-20% 0px -55% 0px",
    threshold: [0, 0.2, 0.5, 0.8]
  });

  observedSections.forEach(({ section }) => observer.observe(section));
}
