const navToggle = document.querySelector(".nav-toggle");
const primaryNav = document.querySelector(".primary-nav");
const header = document.querySelector(".hotel-header");
const body = document.body;

// The header bar is transparent to begin with and only fades in its white
// background once you scroll — that works because every page it was
// written for opens with a full-bleed photo for the white lettering to sit
// on top of.
//
// The loykrathong pages no longer do: they open with a pale signpost band
// naming the two festivals, and white lettering on a fixed transparent bar
// over a cream background is invisible. Those pages put "solid-header" on
// their <body>, which pins the header to the same solid look it would
// normally only reach after scrolling — reusing every ".scrolled" rule in
// styles.css rather than describing the solid look a second time.
const headerAlwaysSolid = body.classList.contains("solid-header");


// ===== Hamburger =====

navToggle.addEventListener("click", function (e) {
    e.stopPropagation();
    if (body.classList.contains("nav-open")) {
        closeNav();
    } else {
        openNav();
    }
});

primaryNav.addEventListener("click", function () {
    closeNav();
});

body.addEventListener("click", function () {
    if (body.classList.contains("nav-open")) {
        closeNav();
    }
});

document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
        closeNav();
    }
});


// ===== LINE QR modal =====
// Several buttons open the same dialog, so query all of them.

const lineTriggers = document.querySelectorAll(".js-line-qr");
const lineModal = document.querySelector("#line-modal");

if (lineModal && lineTriggers.length > 0) {

    lineTriggers.forEach(function (trigger) {
        trigger.addEventListener("click", function (e) {
            e.stopPropagation();
            lineModal.showModal();
        });
    });

    lineModal.querySelector(".modal-close").addEventListener("click", function () {
        lineModal.close();
    });

    // Clicks on the backdrop report the dialog itself as the target.
    lineModal.addEventListener("click", function (e) {
        if (e.target === lineModal) {
            lineModal.close();
        }
    });
}


// ===== Scrolled header =====

window.addEventListener("scroll", updateScrolled, { passive: true });
updateScrolled();


// ===== Function definitions =====

function openNav() {
    body.classList.add("nav-open");
    navToggle.setAttribute("aria-expanded", "true");
    navToggle.setAttribute("aria-label", "Close menu");
}

function closeNav() {
    body.classList.remove("nav-open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Open menu");
}

function updateScrolled() {
    if (headerAlwaysSolid || window.scrollY > 40) {
        header.classList.add("scrolled");
    } else {
        header.classList.remove("scrolled");
    }
}





// Fix the scroll smooth problem on iOS device 
const HEADER_OFFSET = 80;   // matches scroll-padding-top: 5rem
const DURATION = 600;       // ms

function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function smoothScrollTo(target) {
  const startY = window.scrollY;
  const endY = target.getBoundingClientRect().top + startY - HEADER_OFFSET;
  const distance = endY - startY;
  const startTime = performance.now();

  function step(now) {
    const progress = Math.min((now - startTime) / DURATION, 1);
    window.scrollTo(0, startY + distance * easeInOutCubic(progress));
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

document.addEventListener("click", function (e) {
  const link = e.target.closest('a[href^="#"]');
  if (!link) return;

  const id = link.getAttribute("href");
  const target = document.querySelector(id);
  if (!target) return;

  e.preventDefault();

  if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
    window.scrollTo(0, target.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET);
  } else {
    smoothScrollTo(target);
  }

  history.pushState(null, "", id);
});