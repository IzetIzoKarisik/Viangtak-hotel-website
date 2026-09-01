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


// ===== Scrolled header =====

window.addEventListener("scroll", updateScrolled);
updateScrolled();

// Function Definition

function openNav() {
    body.classList.add("nav-open");
    navToggle.setAttribute("aria-expanded", "true");
}

function closeNav() {
    body.classList.remove("nav-open");
    navToggle.setAttribute("aria-expanded", "false");
}

function updateScrolled() {
    if (window.scrollY > 40) {
        header.classList.add("scrolled");
    } else {
        header.classList.remove("scrolled");
    }
}