// ===== Get the elements we need =====

// GUESTS
const guestsDisplay = document.getElementById("guests-display");
const guestsField = document.getElementById("guests-field");
const minusBtn = document.getElementById("guests-minus");
const plusBtn = document.getElementById("guests-plus");
const roomMaxText = document.getElementById("room-max-value");
const roomRadios = document.querySelectorAll('input[name="room"]');
const checkin = document.getElementById("checkin");
const checkout = document.getElementById("checkout");

// ROOMS
const roomsDisplay = document.getElementById("rooms-display");
const roomsField = document.getElementById("rooms-field");
const roomsMinus = document.getElementById("rooms-minus");
const roomsPlus = document.getElementById("rooms-plus");



let guests = 2;

const MAX_ROOMS = 5;
let rooms = 1;

function showRooms() {
    const max = getMax();
    if (max === 4) {
        if (rooms > 3) {
            rooms = 3;
        }
    }
    if (rooms < 1) {
        rooms = 1;
    }

    if (rooms > MAX_ROOMS) {
        rooms = MAX_ROOMS;
    }

    roomsDisplay.textContent = rooms;
    roomsField.value = rooms;

    roomsMinus.disabled = rooms === 1;
    roomsPlus.disabled = rooms === MAX_ROOMS;
}

roomsMinus.addEventListener("click", function () {
    rooms = rooms - 1;
    showRooms();
});

roomsPlus.addEventListener("click", function () {
    rooms = rooms + 1;
    showRooms();
});

showRooms();

// ===== Preselect the room from the URL =====
// reservation.html?room=corner-suite  ->  "corner-suite"

const text = location.search;
const params = new URLSearchParams(text);
const slug = params.get("room");


if (slug) {
    const radio = document.getElementById("room-" + slug);
    if (radio) {
        radio.checked = true;
    }
}


// ===== Guests =====

// How many people the chosen room allows
function getMax() {
    const chosen = document.querySelector('input[name="room"]:checked');
    if (!chosen) {
        return 2;
    }
    return Number(chosen.dataset.max);
}

// Put the current number on the screen and into the form
function showGuests() {
    const max = getMax();

    if (guests > max) {
        guests = max;
    }
    if (guests < 1) {
        guests = 1;
    }
    if (max === 4) {
        if (guests < 2) {
            guests = 2;
        }
    }

    guestsDisplay.textContent = guests;
    guestsField.value = guests;
    roomMaxText.textContent = max;

    minusBtn.disabled = guests === 1;
    plusBtn.disabled = guests === max;

    showRooms();
}

minusBtn.addEventListener("click", function () {
    guests = guests - 1;
    showGuests();
});

plusBtn.addEventListener("click", function () {
    guests = guests + 1;
    showGuests();
});

// Picking a different room can change the maximum
roomRadios.forEach(function (radio) {
    radio.addEventListener("change", showGuests);
});


// ===== Dates =====

const today = new Date().toISOString().slice(0, 10);   // "2026-09-13"

checkin.min = today;
checkout.min = today;

checkin.addEventListener("change", function () {
    checkout.min = checkin.value;
});

// ===== Submit button stays off until the form is valid =====

const form = document.querySelector(".form-container");
const submitBtn = form.querySelector(".submit-btn");

function updateSubmit() {
    submitBtn.disabled = !form.checkValidity();
}

form.addEventListener("input", updateSubmit);
form.addEventListener("change", updateSubmit);

// ===== Don't send optional fields that were left blank =====

const notes = document.getElementById("notes");
const emailField = document.getElementById("email");

form.addEventListener("submit", function () {
    [notes, emailField].forEach(function (field) {
        if (field.value.trim() === "") {
            field.removeAttribute("name");
        } else {
            field.setAttribute("name", field.id);
        }
    });
});


showGuests();