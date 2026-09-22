# The ViangTak Riverside Hotel — Official Website

The official bilingual (English / Thai) website of **The ViangTak Riverside Hotel** in Tak, Thailand.

**🌐 Live site: [viangtakriverside.com](https://viangtakriverside.com)**

![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)
![Netlify](https://img.shields.io/badge/Netlify-00C7B7?logo=netlify&logoColor=white)

<!-- Add a screenshot here: ![Homepage](assets/readme/homepage.png) -->

## The story

I work at this hotel's front desk. I taught myself to code, and built this site from scratch in plain HTML, CSS and JavaScript within about two months of writing my first line of code.

- The hotel's **Managing Director approved it**, and it replaced the hotel's previous paid website service.
- It now runs on the hotel's own domain and **receives real booking requests from guests**.
- I also handled the launch myself: moving the domain to a new registrar, DNS, HTTPS and SEO.

## Features

- **Bilingual EN / TH** — every page has a Thai twin, linked with `hreflang` tags.
- **Booking request form**
  - Room picker, which can be preselected from a room card (`reservation?room=...`)
  - Guest counter capped by each room's capacity, plus a room counter
  - Date checks: check-in can't be in the past, and check-out can't be before check-in
  - The submit button stays disabled until the form is valid
  - Submissions go through **Netlify Forms** (with a honeypot field against spam bots) and are emailed to the hotel instantly
- **Photo gallery lightbox** built on the native `<dialog>` element, with previous/next arrows, swipe, a "3 / 14" counter and separate photo sets per page.
- **Festival guide pages** for Tak's Loy Krathong and kite festivals, with a countdown badge that updates itself ("in 10 days" → "on now" → "finished for this year"), so the page never goes stale.
- **Responsive, mobile-first layout**
  - Hamburger menu that closes on an outside click or the Esc key
  - Header that turns solid on scroll
  - Smooth scrolling that also works on iOS
- **LINE QR popup** so guests can contact the hotel on LINE.
- **Privacy-first analytics** — an EN/TH cookie banner; Google Analytics loads only after the visitor clicks *Accept*. Privacy policy pages in both languages.
- **Performance and accessibility** — WebP images, lazy loading, ARIA labels, and animations that respect `prefers-reduced-motion`.
- **SEO**
  - Canonical and `hreflang` tags, plus Hotel structured data (JSON-LD) and Open Graph tags
  - `sitemap.xml` and `robots.txt`
  - Google Search Console
  - 301 redirects from the old website's URLs and to clean, extension-less URLs

## Tech stack

| | |
|---|---|
| **Front-end** | HTML5, CSS3, vanilla JavaScript. No frameworks, no build step |
| **Hosting** | Netlify: static hosting, Netlify Forms, redirects, HTTPS (Let's Encrypt) |
| **Domain** | Custom domain moved to a new registrar, with DNS and nameservers configured by me |

## Project structure

```
├── index.html / index-th.html                Home page (EN / TH)
├── reservation.html / reservation-th.html    Booking request form
├── thanks.html / thanks-th.html              Confirmation page after booking
├── loykrathong.html / loykrathong-th.html    Festival guide pages
├── privacy.html / privacy-th.html            Privacy policy
├── styles.css                                Main stylesheet
├── animation.css                             Animations (respects reduced motion)
├── main.js                                   Menu, header on scroll, smooth scroll, LINE popup
├── reservation.js                            Booking form logic
├── gallery.js                                Photo lightbox
├── kite-countdown.js                         Self-updating festival countdown
├── fade-up.js                                Scroll-reveal effect
├── cookie-consent.js                         Cookie banner + consent-based analytics
├── _redirects                                Netlify redirects (old URLs → new)
├── robots.txt / sitemap.xml                  SEO
└── assets/                                   Images (WebP), icons, favicon
```

## How the booking form works

1. The guest picks a room, dates and number of guests, then fills in their contact details.
2. JavaScript checks the form as they type, and the submit button only turns on when everything is valid.
3. Netlify Forms receives the submission, filters bots with a honeypot field, and emails it to the hotel.
4. The guest lands on a thank-you page.

It is a booking **request**. No online payment is taken.

## How I used AI

I build with AI tools every day, and I check what they produce before it goes live.

- **Claude Code** — writing and editing code, setting up the SEO files, and scanning the whole project for bugs and typos before every push.
- **Claude** — explaining code line by line, planning what to learn next, research, and drafting the prompts I give to Claude Code.
- **ChatGPT** — image editing and typography choices.

**My rule:** test every change in the browser and read the code before it ships. Anything I don't fully understand, I ask Claude to explain until I do.

## Run it locally

```bash
git clone https://github.com/IzetIzoKarisik/Viangtak-hotel-website.git
cd Viangtak-hotel-website
```

Open `index.html` with a local server such as VS Code Live Preview or Live Server. There is nothing to install or build.

> The booking form, clean URLs and redirects only work on Netlify.

## What's next

- Learning SQL to add a backend to this site.

## About me

Built and maintained by **Izzet Izo Karisik**, front desk staff at the hotel and self-taught developer (CS50x in progress).
GitHub: [@IzetIzoKarisik](https://github.com/IzetIzoKarisik)

---

Photos, text and branding © The ViangTak Riverside Hotel. Please don't reuse them without permission.
