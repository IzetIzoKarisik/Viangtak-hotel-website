const fadeElements = document.querySelectorAll(".fade-up");

const options = {
  threshold: 0.15,
  rootMargin: "0px 0px -50px 0px"
};

function revealElement(entries, observer) {
  for (const entry of entries) {
    if (entry.isIntersecting === false) {
      continue;
    }
    entry.target.classList.add("is-visible");
    observer.unobserve(entry.target);
  }
}

const observer = new IntersectionObserver(revealElement, options);

for (const element of fadeElements) {
  observer.observe(element);
}
