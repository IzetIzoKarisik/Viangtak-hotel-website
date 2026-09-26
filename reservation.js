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

// Turn a Date into the "YYYY-MM-DD" text that <input type="date"> uses.
// We read the LOCAL year/month/day (the guest's own clock).
// We do NOT use toISOString(), because that gives the date in UTC (London time).
// Thailand is 7 hours ahead of UTC, so between midnight and 7am in Thailand
// toISOString() would still say "yesterday".
function toDateText(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");   // months start at 0, so +1
    const day = String(date.getDate()).padStart(2, "0");
    return year + "-" + month + "-" + day;                         // "2026-09-26"
}

// Take a "YYYY-MM-DD" text and give back the text for the NEXT day.
// Example: "2026-09-30" -> "2026-10-01"
function nextDayText(dateText) {
    const parts = dateText.split("-");        // ["2026", "09", "30"]
    const year = Number(parts[0]);
    const month = Number(parts[1]) - 1;       // back to 0-based months for Date
    const day = Number(parts[2]);

    // Asking for "day + 1" is safe even at the end of a month:
    // Date turns September 31 into October 1 by itself.
    const next = new Date(year, month, day + 1);
    return toDateText(next);
}

const today = toDateText(new Date());         // e.g. "2026-09-26"
const tomorrow = nextDayText(today);          // e.g. "2026-09-27"

// Check-in can be today at the earliest.
// Check-out must be at least one night later, so tomorrow at the earliest.
checkin.min = today;
checkout.min = tomorrow;

checkin.addEventListener("change", function () {
    // If the check-in box was cleared, go back to the default rule.
    if (checkin.value === "") {
        checkout.min = tomorrow;
        return;
    }

    // Earliest check-out = the day AFTER check-in (one night minimum).
    const earliestCheckout = nextDayText(checkin.value);
    checkout.min = earliestCheckout;

    // The guest may have picked check-out FIRST and then moved check-in later.
    // Setting .min does not change a date that is already in the box,
    // so if the old check-out is now too early, we clear it
    // and the guest has to choose it again.
    // (Comparing "YYYY-MM-DD" texts with < works, because they sort like dates.)
    if (checkout.value !== "" && checkout.value < earliestCheckout) {
        checkout.value = "";
    }

    // We changed the check-out box from code, which does NOT fire an "input"
    // or "change" event, so we re-check the submit button ourselves.
    updateSubmit();
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