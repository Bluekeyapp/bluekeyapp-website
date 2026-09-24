const translations = [...document.querySelectorAll("[data-en]")];
const labels = [...document.querySelectorAll("[data-en-label]")];
translations.forEach((element) => {
  element.dataset.fr = element.textContent;
});
labels.forEach((element) => {
  element.dataset.frLabel = element.getAttribute("aria-label");
});

const metadata = {
  fr: {
    title: "BlueKey — Développement d’applications et de logiciels",
    description:
      "BlueKey, entreprise de développement d’applications et de logiciels. Applications web, solutions mobiles et logiciels sur mesure pour les entreprises.",
    socialTitle: "BlueKey — Vos idées. Notre code.",
    socialDescription:
      "Des applications web, mobiles et des logiciels sur mesure, pensés pour votre entreprise.",
  },
  en: {
    title: "BlueKey — App & software development",
    description:
      "BlueKey is an app and software development company building web applications, mobile solutions and custom business software.",
    socialTitle: "BlueKey — Your ideas. Our code.",
    socialDescription:
      "Web apps, mobile experiences and custom software, built around your business.",
  },
};

function setLanguage(language) {
  if (!Object.hasOwn(metadata, language)) return;
  document.documentElement.lang = language;
  translations.forEach((element) => {
    element.textContent = element.dataset[language];
  });
  labels.forEach((element) => {
    element.setAttribute("aria-label", element.dataset[`${language}Label`]);
  });
  document.querySelectorAll("[data-lang]").forEach((button) => {
    button.setAttribute(
      "aria-pressed",
      String(button.dataset.lang === language),
    );
  });
  document.title = metadata[language].title;
  document.querySelector('meta[name="description"]').content =
    metadata[language].description;
  document.querySelector('meta[property="og:title"]').content =
    metadata[language].socialTitle;
  document.querySelector('meta[property="og:description"]').content =
    metadata[language].socialDescription;
  try {
    localStorage.setItem("bluekey-language", language);
  } catch {
    /* Switching still works when storage is unavailable. */
  }
}

document.querySelectorAll("[data-lang]").forEach((button) => {
  button.addEventListener("click", () => setLanguage(button.dataset.lang));
});
try {
  const savedLanguage = localStorage.getItem("bluekey-language");
  if (savedLanguage) setLanguage(savedLanguage);
} catch {
  /* French remains the default. */
}

const menuToggle = document.querySelector(".menu-toggle");
const navigation = document.querySelector("#navigation");
function closeMenu() {
  menuToggle.setAttribute("aria-expanded", "false");
}
menuToggle.addEventListener("click", () => {
  menuToggle.setAttribute(
    "aria-expanded",
    String(menuToggle.getAttribute("aria-expanded") !== "true"),
  );
});
navigation
  .querySelectorAll("a")
  .forEach((link) => link.addEventListener("click", closeMenu));
document.addEventListener("keydown", (event) => {
  if (
    event.key === "Escape" &&
    menuToggle.getAttribute("aria-expanded") === "true"
  ) {
    closeMenu();
    menuToggle.focus();
  }
});
document.addEventListener("click", (event) => {
  if (!event.target.closest(".header-inner")) closeMenu();
});
window.matchMedia("(min-width: 901px)").addEventListener("change", closeMenu);
document.getElementById("year").textContent = new Date().getFullYear();
document.documentElement.classList.add("js");
