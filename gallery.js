// ===== Get the elements we need =====

const galleryTiles = document.querySelectorAll(".gallery-tile");
const galleryModal = document.querySelector("#gallery-modal");
const galleryModalImg = document.querySelector("#gallery-modal-img");
const galleryModalCaption = document.querySelector("#gallery-modal-caption");
const galleryModalClose = document.querySelector(".gallery-modal-close");
const galleryModalPrev = document.querySelector(".gallery-modal-prev");
const galleryModalNext = document.querySelector(".gallery-modal-next");

// Only the loykrathong pages have a "3 / 14" counter under the caption —
// index.html's lightbox dialog doesn't include one, since its gallery is
// small enough to flip through without losing track. This line just looks
// for it; every place below that uses it checks "if (galleryModalCounter)"
// first, so the same script works correctly on both kinds of page.
const galleryModalCounter = document.querySelector("#gallery-modal-counter");

let currentPhotoIndex = 0;

// Remembers how far down the page we were before the lightbox opened.
// Native <dialog> elements have a quirk where closing them can reset the
// page's scroll position to the top (it happens while the browser moves
// focus back to the photo you clicked). Saving the scroll position here
// and putting it back in the "close" handler below undoes that jump.
let scrollPositionBeforeOpen = 0;


// ===== Build one list of photos per gallery =====
// A page can hold more than one separate set of photos. The loykrathong
// pages now have two: the row of festival site maps in the kite section,
// and the big photo gallery further down. Each set needs its own list, or
// the lightbox's Next/Previous arrows and its "3 / 14" counter would run
// straight out of one set and into the other — clicking past the last
// site map would land you in the middle of the krathong photos, counting
// "4 / 17".
//
// A set is whatever element carries data-gallery in the HTML. Pages that
// don't mark their gallery at all still work: those tiles all fall back
// to <body>, which puts them in a single set, exactly as before.

const photoSets = new Map();

galleryTiles.forEach(function (tile) {
    const set = tile.closest("[data-gallery]") || document.body;

    if (!photoSets.has(set)) {
        photoSets.set(set, []);
    }

    const photosInThisSet = photoSets.get(set);

    // Remember where this tile sits inside its own set, so the click
    // handler below can open the right photo without hunting for it.
    tile.dataset.photoIndex = photosInThisSet.length;

    photosInThisSet.push(readPhotoFromTile(tile));
});

// The one set the lightbox is showing right now. Clicking a tile points
// this at that tile's set first, so everything below this line — the
// arrows, the counter, the swipe handlers — carries on working with a
// single flat list of photos exactly the way it always did.
let photos = [];


// ===== Open the lightbox when a tile is clicked =====

galleryTiles.forEach(function (tile) {
    tile.addEventListener("click", function (e) {
        e.preventDefault();
        photos = photoSets.get(tile.closest("[data-gallery]") || document.body);
        openPhoto(Number(tile.dataset.photoIndex));
    });
});


// ===== Close the lightbox =====

galleryModalClose.addEventListener("click", function () {
    galleryModal.close();
});

// Clicks on the backdrop report the dialog itself as the target.
galleryModal.addEventListener("click", function (e) {
    if (e.target === galleryModal) {
        galleryModal.close();
    }
});

// The dialog fires "close" no matter how it was closed (the close button,
// a backdrop click, or the Escape key), so this one listener catches every
// case and puts the scroll position back where it was.
galleryModal.addEventListener("close", function () {
    window.scrollTo(0, scrollPositionBeforeOpen);
});


// ===== Move between photos =====

galleryModalPrev.addEventListener("click", function () {
    showPreviousPhoto();
});

galleryModalNext.addEventListener("click", function () {
    showNextPhoto();
});

// Left / right arrow keys, but only while the lightbox is open.
document.addEventListener("keydown", function (e) {
    if (!galleryModal.open) {
        return;
    }

    if (e.key === "ArrowLeft") {
        showPreviousPhoto();
    }
    if (e.key === "ArrowRight") {
        showNextPhoto();
    }
});


// ===== Move between photos with a swipe, on touch screens =====
// Remembers the x position where a touch begins, then compares it to
// where that same touch ends. A swipe has to travel at least
// SWIPE_DISTANCE pixels to count — anything shorter is more likely to be
// a tap, or a finger wobbling slightly while scrolling, so those are
// ignored rather than accidentally flipping the photo.

const SWIPE_DISTANCE = 50; // pixels
let touchStartX = 0;

galleryModal.addEventListener("touchstart", function (e) {
    touchStartX = e.touches[0].clientX;
});

galleryModal.addEventListener("touchend", function (e) {
    const touchEndX = e.changedTouches[0].clientX;
    const swipeDistance = touchEndX - touchStartX;

    if (swipeDistance > SWIPE_DISTANCE) {
        // finger moved left-to-right: the previous photo
        showPreviousPhoto();
    } else if (swipeDistance < -SWIPE_DISTANCE) {
        // finger moved right-to-left: the next photo
        showNextPhoto();
    }
});


// ===== Function definitions =====

// Work out which photo a tile should open in the lightbox.
//
// Almost every tile is a photo thumbnail, and the lightbox simply reopens
// that same <img> — it reads the "src" attribute rather than whichever
// size the grid happened to display, so the full-size file opens even
// though the grid showed the small one (see the "srcset" comments in the
// HTML).
//
// The festival site-map buttons on the loykrathong pages are tiles too,
// but they show a map icon and a label instead of a thumbnail, so there
// is no <img> inside them to read. Those name their photo on the button
// itself with data- attributes instead. Keeping the map out of the button
// this way also means the map file — around half a megabyte, because it
// is full of small print that has to stay sharp — is only ever downloaded
// if somebody actually opens it.
function readPhotoFromTile(tile) {
    const img = tile.querySelector("img");
    const caption = tile.querySelector("figcaption");

    if (img) {
        return {
            src: img.src,
            alt: img.alt,
            caption: caption ? caption.textContent : ""
        };
    }

    return {
        src: tile.dataset.photo,
        alt: tile.dataset.photoAlt || "",
        caption: tile.dataset.photoCaption || tile.textContent.trim()
    };
}


// Show one photo in the lightbox and remember which one it is,
// so the prev/next buttons know where to go next.
function openPhoto(index) {
    currentPhotoIndex = index;

    // Only grab the scroll position when the dialog is not open yet (a
    // fresh click on a gallery tile). openPhoto() also runs every time
    // Next/Previous is clicked, and by then the browser has already done
    // its focus-jump-to-top thing, so window.scrollY would just be 0 —
    // capturing it again here would overwrite the real starting position
    // with that already-wrong 0.
    if (!galleryModal.open) {
        scrollPositionBeforeOpen = window.scrollY;
    }

    const photo = photos[currentPhotoIndex];
    galleryModalImg.src = photo.src;
    galleryModalImg.alt = photo.alt;
    galleryModalCaption.textContent = photo.caption;

    if (galleryModalCounter) {
        const photoNumber = currentPhotoIndex + 1;
        const totalPhotos = photos.length;
        galleryModalCounter.textContent = photoNumber + " / " + totalPhotos;
    }

    // iOS Safari has a bug with <dialog>: if the photo is still downloading
    // when showModal() runs, the dialog's box gets stuck at whatever size
    // it had before and never resizes to fit the photo once it arrives —
    // so the photo just never appears (the arrow buttons still show up
    // fine because they're pinned to the screen with "position: fixed"
    // instead of sitting inside that box). decode() waits for the photo to
    // be fully downloaded AND ready to paint before the dialog opens, so
    // the browser already knows the right size on the very first frame and
    // never needs to resize the box at all.
    galleryModalImg
        .decode()
        .catch(function () {
            // A broken image link would land here. Opening the dialog
            // anyway still shows the caption and lets the person move on
            // with Next/Previous, instead of the click doing nothing.
        })
        .finally(function () {
            galleryModal.showModal();
        });
}

function showPreviousPhoto() {
    const lastIndex = photos.length - 1;
    const newIndex = currentPhotoIndex === 0 ? lastIndex : currentPhotoIndex - 1;
    openPhoto(newIndex);
}

function showNextPhoto() {
    const lastIndex = photos.length - 1;
    const newIndex = currentPhotoIndex === lastIndex ? 0 : currentPhotoIndex + 1;
    openPhoto(newIndex);
}
