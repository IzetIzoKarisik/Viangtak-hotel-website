// ===== The kite festival's countdown badge =====
//
// The little badge at the top of the kite block says "in 10 days" while
// the festival is still coming, "on now" during the festival week, and
// "finished for this year" once it's over. Working that out here, in the
// browser, rather than typing the number into the HTML means the page
// can't quietly go stale and start telling visitors the wrong thing the
// moment nobody remembers to edit it.
//
// Everything this script needs is written on the badge itself in the
// HTML, as data- attributes:
//
//   data-starts / data-ends   the festival's first and last day, as
//                             YYYY-MM-DD. Both days count as "on now".
//   data-upcoming             wording for before it starts. The text
//                             "{days}" inside it is swapped for the
//                             number of days left.
//   data-tomorrow             wording for the last day before it starts.
//                             English needs this because "in 1 days" is
//                             not a sentence; Thai would read perfectly
//                             well without it, and has one anyway so that
//                             both pages say the same thing.
//   data-during               wording for the festival days themselves.
//   data-ended                wording for afterwards.
//
// Keeping the wording in the HTML is what lets loykrathong.html and
// loykrathong-th.html share this one file: the English page hands it
// English phrases, the Thai page hands it Thai ones, and the script
// itself never contains a word of either language.

const kiteCountdown = document.querySelector(".kite-countdown");

// Every other page on the site loads its scripts from the same <head>
// block, so this file may well run somewhere that has no badge on it.
// Checking first means an empty result quietly does nothing instead of
// throwing and taking the rest of the page's JavaScript down with it.
if (kiteCountdown) {
    updateKiteCountdown(kiteCountdown);
}


// ===== Function definitions =====

function updateKiteCountdown(badge) {
    const today = startOfToday();
    const startsOn = parseLocalDate(badge.dataset.starts);
    const endsOn = parseLocalDate(badge.dataset.ends);

    // A missing or mistyped date would otherwise show up as the word
    // "NaN" in the badge. Leaving whatever was typed into the HTML in
    // place is the safer failure: it is at least a sentence.
    if (!startsOn || !endsOn) {
        return;
    }

    if (today < startsOn) {
        const daysLeft = countDaysBetween(today, startsOn);

        if (daysLeft === 1) {
            badge.textContent = badge.dataset.tomorrow;
        } else {
            badge.textContent = badge.dataset.upcoming.replace("{days}", daysLeft);
        }

        badge.classList.add("is-upcoming");
        return;
    }

    if (today <= endsOn) {
        badge.textContent = badge.dataset.during;
        badge.classList.add("is-on-now");
        return;
    }

    badge.textContent = badge.dataset.ended;
    badge.classList.add("is-over");
}


// Turn "2026-09-29" into a Date at midnight in the visitor's own time
// zone. Handing that string straight to new Date() would not do: the
// browser reads a bare YYYY-MM-DD as midnight UTC, which is already seven
// hours into the previous evening as far as a phone in Tak is concerned —
// enough to make the badge count one day too many for most of the day.
// Building the date part by part avoids that entirely, because those
// arguments are always read as local time.
function parseLocalDate(text) {
    if (!text) {
        return null;
    }

    const parts = text.split("-");
    const year = Number(parts[0]);
    const month = Number(parts[1]);
    const day = Number(parts[2]);

    if (!year || !month || !day) {
        return null;
    }

    // Months are counted from 0 in JavaScript, so September is 8, not 9.
    return new Date(year, month - 1, day);
}


// Today, with the clock time stripped off. Both sides of every comparison
// above are then plain calendar days, so the badge reads the same at
// breakfast as it does last thing at night.
function startOfToday() {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}


// How many whole days from one midnight to another.
//
// Dividing the gap in milliseconds by the length of a day is very nearly
// the whole answer, but not quite: in a country that puts its clocks
// forward, one of the days in between is 23 hours long, which leaves a
// fraction like 9.96 instead of a clean 10. Rounding absorbs that.
// Thailand doesn't change its clocks, but plenty of the people reading
// this page before they travel are somewhere that does.
function countDaysBetween(fromDate, toDate) {
    const MILLISECONDS_PER_DAY = 24 * 60 * 60 * 1000;
    return Math.round((toDate - fromDate) / MILLISECONDS_PER_DAY);
}
