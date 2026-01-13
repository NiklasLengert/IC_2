document.addEventListener("DOMContentLoaded", () => {
  const steps = document.querySelectorAll(".pipeline-step");

  const observerOptions = {
    root: null,
    rootMargin: "0px",
    threshold: 0.1,
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        // Optional: Stop observing once visible if you don't want it to fade out again
        // observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  steps.forEach((step) => {
    observer.observe(step);
  });
});
