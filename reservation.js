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


// ===== Breakfast choice =====
// Each room card has its own pair of pill buttons — "Breakfast included"
// and "Room only" — that work like a little radio group (because that's
// exactly what they are). Picking one only changes the price shown on
// that one card — it does not select the room. The price with breakfast
// lives in the room's data-rate, and the price without breakfast lives in
// its data-rate-no-breakfast, both set on the room's own radio button in
// the HTML.

const breakfastRadios = document.querySelectorAll(".breakfast-radio");
const breakfastField = document.getElementById("breakfast-field");

// Turn a plain number like 1500 into the text "฿1,500" (comma added
// automatically, so we never have to type the commas ourselves).
function formatPrice(amount) {
    return "฿" + Number(amount).toLocaleString("en-US");
}

// Update one room card's price to match whichever breakfast pill in that
// card was just picked. "breakfastRadio" is the pill that was clicked —
// its "value" is either "yes" or "no".
function updateCardPrice(breakfastRadio) {
    const card = breakfastRadio.closest(".room-option");
    const roomRadio = card.querySelector('input[name="room"]');
    const priceAmount = card.querySelector(".room-price-amount");

    if (breakfastRadio.value === "yes") {
        priceAmount.textContent = formatPrice(roomRadio.dataset.rate);
    } else {
        priceAmount.textContent = formatPrice(roomRadio.dataset.rateNoBreakfast);
    }
}

// Tell Netlify whether the room the guest has picked includes breakfast.
// This always looks at the pills on the currently SELECTED room, not
// every room's pills, since only one room can be booked at a time.
function updateBreakfastField() {
    const chosenRoomRadio = document.querySelector('input[name="room"]:checked');
    if (!chosenRoomRadio) {
        return;
    }
    const card = chosenRoomRadio.closest(".room-option");
    const checkedBreakfastRadio = card.querySelector(".breakfast-radio:checked");
    breakfastField.value = checkedBreakfastRadio.value === "yes" ? "Yes" : "No";
}

breakfastRadios.forEach(function (breakfastRadio) {
    // Set the starting price for this card when the page loads
    if (breakfastRadio.checked) {
        updateCardPrice(breakfastRadio);
    }

    breakfastRadio.addEventListener("change", function () {
        updateCardPrice(breakfastRadio);
        updateBreakfastField();
    });
});

// Picking a different room can also change the breakfast field, since it
// needs to follow whichever room is selected now
roomRadios.forEach(function (radio) {
    radio.addEventListener("change", updateBreakfastField);
});

updateBreakfastField();


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
    // Make sure the hidden breakfast field reflects the currently selected
    // room's switch, in case it hasn't been touched since page load
    updateBreakfastField();

    const chosenRoomRadio = document.querySelector('input[name="room"]:checked');
    const roomName = chosenRoomRadio.value;
    const guestName = document.getElementById("name").value;
    const checkinDate = checkin.value;
    const breakfastChoice = breakfastField.value === "Yes" ? "with breakfast" : "no breakfast";
    const submittedAt = new Date().toLocaleString();

    subjectField.value = "New reservation request - " + roomName + " (" + breakfastChoice + ") - " +
        guestName + " (check-in " + checkinDate + ") - sent " + submittedAt;
});


// ===== Run once when the page loads =====

showGuests();