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
const sectionLinks = navLinks
  .map((link) => ({
    link,
    section: document.querySelector(link.getAttribute("href"))
  }))
  .filter((item) => item.section);

function markActive(id) {
  sectionLinks.forEach(({ link, section }) => {
    if (section.id === id) {
      link.setAttribute("aria-current", "true");
    } else {
      link.removeAttribute("aria-current");
    }
  });
}

let navFramePending = false;

function updateActiveNavigation() {
  navFramePending = false;
  const atPageEnd = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
  const marker = window.scrollY + window.innerHeight * 0.38;
  let activeId = "";

  sectionLinks.forEach(({ section }) => {
    if (section.offsetTop <= marker) activeId = section.id;
  });

  if (atPageEnd && sectionLinks.length) {
    activeId = sectionLinks[sectionLinks.length - 1].section.id;
  }

  markActive(activeId);
}

window.addEventListener("scroll", () => {
  if (!navFramePending) {
    navFramePending = true;
    window.requestAnimationFrame(updateActiveNavigation);
  }
}, { passive: true });

window.addEventListener("resize", updateActiveNavigation);
updateActiveNavigation();
