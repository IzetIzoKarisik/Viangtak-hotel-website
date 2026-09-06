const navToggle = document.querySelector(".nav-toggle");
const primaryNav = document.querySelector(".primary-nav");
const header = document.querySelector(".hotel-header");
const body = document.body;


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
    if (window.scrollY > 40) {
        header.classList.add("scrolled");
    } else {
        header.classList.remove("scrolled");
    }
}