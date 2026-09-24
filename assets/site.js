const translations = [...document.querySelectorAll("[data-en]")];
const labels = [...document.querySelectorAll("[data-en-label]")];
const menuToggle = document.querySelector(".menu-toggle");
const projectComposer = document.querySelector("#project-composer");
const projectType = document.querySelector("#project-type");
const projectMessage = document.querySelector("#project-message");
const draftEmail = document.querySelector("#draft-email");
const copyMessage = document.querySelector("#copy-message");
const copyEmail = document.querySelector("#copy-email");
const contactStatus = document.querySelector("#contact-status");
const emailCopyStatus = document.querySelector("#email-copy-status");
const copyFallback = document.querySelector("#copy-fallback");
const copyFallbackText = document.querySelector("#copy-fallback-text");
const contactAddress = "contact@bluekeyapp.com";
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
let copyAttempt = 0;

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

const contactText = {
  fr: {
    services: {
      unsure: "À définir ensemble",
      application: "Application web ou mobile",
      software: "Logiciel sur mesure",
      automation: "Automatisation et intégrations",
    },
    subject: "Parlons de mon projet",
    greeting: "Bonjour Blue Key Apps,",
    projectLabel: "Mon projet :",
    defaultMessage: "J’aimerais échanger avec vous pour définir mon projet et les prochaines étapes.",
    closing: "Merci !",
    messageCopied: "Message copié. Collez-le dans un e-mail à contact@bluekeyapp.com.",
    emailCopied: "Adresse e-mail copiée.",
    copyManually: "La copie automatique est indisponible. Le texte est sélectionné ci-dessous : copiez-le avec le menu de votre appareil ou Ctrl+C (⌘C sur Mac).",
  },
  en: {
    services: {
      unsure: "Let’s work it out together",
      application: "Web or mobile app",
      software: "Custom software",
      automation: "Automation and integrations",
    },
    subject: "Let’s discuss my project",
    greeting: "Hello Blue Key Apps,",
    projectLabel: "My project:",
    defaultMessage: "I’d like to discuss my project and work out the next steps with you.",
    closing: "Thank you!",
    messageCopied: "Message copied. Paste it into an email to contact@bluekeyapp.com.",
    emailCopied: "Email address copied.",
    copyManually: "Automatic copying is unavailable. The text is selected below: copy it using your device’s menu or Ctrl+C (⌘C on Mac).",
  },
};

function currentLanguage() {
  return document.documentElement.lang === "en" ? "en" : "fr";
}

function updateMenu() {
  if (!menuToggle) return;
  const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
  const menuText = menuToggle.querySelector("[data-menu-text], [data-en]");
  const menuIcon = menuToggle.querySelector(".menu-icon");
  if (menuText) {
    menuText.textContent = isOpen
      ? currentLanguage() === "en" ? "Close" : "Fermer"
      : "Menu";
  }
  if (menuIcon) menuIcon.textContent = isOpen ? "×" : "☰";
}

function closeMenu() {
  if (!menuToggle) return;
  menuToggle.setAttribute("aria-expanded", "false");
  updateMenu();
}

function clearContactFeedback() {
  copyAttempt += 1;
  if (contactStatus) contactStatus.textContent = "";
  if (emailCopyStatus) emailCopyStatus.textContent = "";
  if (copyFallback) copyFallback.hidden = true;
  if (copyFallbackText) copyFallbackText.value = "";
}

function getDraft() {
  const text = contactText[currentLanguage()];
  const service = text.services[projectType?.value] || text.services.unsure;
  const message = projectMessage?.value.trim() || text.defaultMessage;
  return {
    subject: `${text.subject} — ${service}`,
    body: `${text.greeting}\n\n${text.projectLabel} ${service}\n\n${message}\n\n${text.closing}`,
  };
}

function updateDraft() {
  clearContactFeedback();
  if (!draftEmail) return;
  const draft = getDraft();
  draftEmail.href = `mailto:${contactAddress}?subject=${encodeURIComponent(draft.subject)}&body=${encodeURIComponent(draft.body)}`;
}

async function copyContactText(value, successKey) {
  clearContactFeedback();
  const attempt = copyAttempt;
  const text = contactText[currentLanguage()];
  const status = successKey === "emailCopied" ? emailCopyStatus : contactStatus;
  try {
    if (!navigator.clipboard?.writeText) throw new Error("Clipboard unavailable");
    await navigator.clipboard.writeText(value);
    if (attempt !== copyAttempt) return;
    if (status) status.textContent = text[successKey];
  } catch {
    if (attempt !== copyAttempt) return;
    if (copyFallback && copyFallbackText) {
      copyFallback.hidden = false;
      copyFallbackText.value = value;
      copyFallback.scrollIntoView({ behavior: reducedMotion.matches ? "instant" : "smooth", block: "center" });
      copyFallbackText.focus({ preventScroll: true });
      copyFallbackText.select();
    }
    if (status) status.textContent = text.copyManually;
  }
}

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
  updateMenu();
  updateDraft();
  try {
    localStorage.setItem("bluekey-language", language);
  } catch {
    /* Switching still works when storage is unavailable. */
  }
}

document.querySelectorAll("[data-lang]").forEach((button) => {
  button.addEventListener("click", () => setLanguage(button.dataset.lang));
});

menuToggle?.addEventListener("click", () => {
  menuToggle.setAttribute(
    "aria-expanded",
    String(menuToggle.getAttribute("aria-expanded") !== "true"),
  );
  updateMenu();
});
document.addEventListener("keydown", (event) => {
  if (
    event.key === "Escape" &&
    menuToggle?.getAttribute("aria-expanded") === "true"
  ) {
    closeMenu();
    menuToggle.focus();
  }
});
document.addEventListener("click", (event) => {
  if (!(event.target instanceof Element)) return;
  if (!event.target.closest(".header-inner")) closeMenu();

  const link = event.target.closest('a[href^="#"]');
  if (
    !link || event.defaultPrevented || event.button !== 0 ||
    event.metaKey || event.ctrlKey || event.shiftKey || event.altKey ||
    link.hasAttribute("download") || (link.target && link.target !== "_self")
  ) return;

  let target;
  try {
    target = document.getElementById(decodeURIComponent(link.hash.slice(1)));
  } catch {
    return;
  }
  if (!target) return;
  event.preventDefault();
  closeMenu();

  const service = link.dataset.project;
  const hasService = projectType &&
    Object.hasOwn(contactText[currentLanguage()].services, service);
  if (hasService) {
    projectType.value = service;
    updateDraft();
  }

  // Keep the destination in browser history without a second scroll jump.
  if (window.location.hash !== link.hash) {
    window.history.pushState(null, "", link.hash);
  }
  const headingId = target.getAttribute("aria-labelledby")?.split(" ")[0];
  const showProject = hasService && projectComposer && !projectComposer.hidden;
  const focusTarget = showProject
    ? projectType
    : (headingId && document.getElementById(headingId)) ||
      target.querySelector("h1, h2, h3") || target;
  const temporaryTabIndex = !focusTarget.hasAttribute("tabindex") && focusTarget.tabIndex < 0;
  if (temporaryTabIndex) {
    focusTarget.setAttribute("tabindex", "-1");
    focusTarget.addEventListener("blur", () => focusTarget.removeAttribute("tabindex"), { once: true });
  }
  focusTarget.focus({ preventScroll: true });
  const scrollTarget = showProject ? projectComposer : target;
  scrollTarget.scrollIntoView({ behavior: reducedMotion.matches ? "instant" : "smooth", block: "start" });
});
window.matchMedia("(min-width: 901px)").addEventListener("change", closeMenu);

if (projectComposer && projectType && projectMessage && draftEmail) {
  projectComposer.hidden = false;
  projectType.addEventListener("change", updateDraft);
  projectMessage.addEventListener("input", updateDraft);
  copyMessage?.addEventListener("click", () => copyContactText(getDraft().body, "messageCopied"));
}
if (copyEmail) {
  copyEmail.hidden = false;
  copyEmail.addEventListener("click", () => copyContactText(contactAddress, "emailCopied"));
}

try {
  const savedLanguage = localStorage.getItem("bluekey-language");
  if (savedLanguage) setLanguage(savedLanguage);
} catch {
  /* French remains the default. */
}
updateMenu();
updateDraft();
const year = document.getElementById("year");
if (year) year.textContent = new Date().getFullYear();
document.documentElement.classList.add("js");
