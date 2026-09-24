# BlueKey company website

Company website: https://bluekeyapp.com/

A static, responsive website presenting BlueKey’s application and software development services. French is the default language; visitors can switch to English. Contact links open an email to contact@bluekeyapp.com.

## Files

- `index.html`: semantic website content, service cards, process, native expandable FAQs and email contact links. The interface illustration is a concept, not a customer project or an interactive application.
- `assets/styles.css`: responsive layouts, navigation, interface illustration, keyboard focus and reduced-motion styles.
- `assets/site.js`: French/English translations, saved language preference, accessible mobile menu and footer year. English text uses `data-en`; accessible labels use `data-en-label`. French is the default HTML content. Storage failures do not prevent switching languages.
- `assets/blue-key-mark.png`: BlueKey mark used for the website branding and browser tab icon.
- `.github/workflows/pages.yml`: deploys the website to GitHub Pages when `main` changes. Only the website files are included in the published artifact.
- `sw.js`: a compatibility cleanup worker that unregisters the old root service worker for returning visitors. The current website does not register a service worker. Retain this file while visitors may still have the previous worker installed.

## Local preview

Run `python -m http.server 8080` from this directory, then open http://localhost:8080/.

Before publishing, check both language buttons (including after reloading), navigation anchors, the mobile menu and Escape key, expandable FAQs, contact links and layouts from 320px through desktop widths. Test keyboard navigation and reduced-motion preferences. With JavaScript disabled, the French content, navigation, FAQs and contact links remain available.

The contact buttons open the visitor’s email application; this site does not send messages or collect form submissions. Social previews use the default French metadata. This site has no build dependencies, third-party fonts, application backend or customer login pages. The existing Pages workflow copies the entire assets directory, including the stylesheet and script.
