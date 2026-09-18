// ===== Get the elements we need =====

const guestsDisplay = document.getElementById("guests-display");
const guestsField = document.getElementById("guests-field");
const minusBtn = document.getElementById("guests-minus");
const plusBtn = document.getElementById("guests-plus");
const roomMaxText = document.getElementById("room-max-value");
const roomRadios = document.querySelectorAll('input[name="room"]');
const checkin = document.getElementById("checkin");
const checkout = document.getElementById("checkout");

let guests = 2;


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

    guestsDisplay.textContent = guests;
    guestsField.value = guests;
    roomMaxText.textContent = max;

    minusBtn.disabled = guests === 1;
    plusBtn.disabled = guests === max;
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

// ===== Give every reservation email a different subject line =====
// Netlify sends an email every time this form is submitted. If the subject
// line were exactly the same every time (like the placeholder text sitting
// in the hidden "subject" field in the HTML right now), Gmail would group
// every request into one long conversation, and a new request could get
// buried in there instead of showing up as its own message. Filling in the
// hidden field right before the form submits gives each email its own
// subject line, built from details of that one request, so Gmail keeps
// them separate.

const subjectField = document.getElementById("subject");

form.addEventListener("submit", function () {
    const chosenRoomRadio = document.querySelector('input[name="room"]:checked');
    const roomName = chosenRoomRadio.value;
    const guestName = document.getElementById("name").value;
    const checkinDate = checkin.value;
    const submittedAt = new Date().toLocaleString();

    subjectField.value = "New reservation request - " + roomName + " - " + guestName +
        " (check-in " + checkinDate + ") - sent " + submittedAt;
});


// ===== Run once when the page loads =====

showGuests();