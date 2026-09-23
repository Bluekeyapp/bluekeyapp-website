# BlueKey company website

Company website: https://bluekeyapp.com/

A static, responsive website presenting BlueKey’s application and software development services. French is the default language; visitors can switch to English. Contact links open an email to contact@bluekeyapp.com.

## Files

- `index.html`: website content, responsive styles and language switch. English translations use `data-en` attributes; French text is the default HTML content.
- `.github/workflows/pages.yml`: deploys the website to GitHub Pages when `main` changes. Only the website files are included in the published artifact.
- `sw.js`: a compatibility cleanup worker that unregisters the old root service worker for returning visitors. The current website does not register a service worker. Retain this file while visitors may still have the previous worker installed.

## Local preview

Run `python -m http.server 8080` from this directory, then open http://localhost:8080/.

Before publishing, check both language buttons, navigation anchors, contact links and mobile layout. This site has no build dependencies, application backend or customer login pages.
