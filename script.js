/* ==========================
   Mobile Navigation
========================== */

function initMobileMenu() {
  const button = document.querySelector(".menu-button");
  const menu = document.querySelector(".mobile-menu");

  if (!button || !menu) return;

  const closeMenu = () => {
    menu.classList.remove("open");
    button.setAttribute("aria-expanded", "false");
    button.setAttribute("aria-label", "Open navigation");
  };

  button.addEventListener("click", () => {
    const isOpen = menu.classList.toggle("open");

    button.setAttribute("aria-expanded", String(isOpen));
    button.setAttribute(
      "aria-label",
      isOpen ? "Close navigation" : "Open navigation"
    );
  });

  menu.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
      closeMenu();
      button.focus();
    }
  });
}


/* ==========================
   Before / After Sliders
========================== */

function initBeforeAfter() {
  document.querySelectorAll(".ba-images").forEach(el => {
    const slider = el.querySelector(".ba-slider");

    if (!slider) return;

    let position = 50;

    const applyPosition = value => {
      position = Math.max(5, Math.min(95, value));

      el.style.setProperty("--pos", `${position}%`);
      slider.style.setProperty("--pos", `${position}%`);

      el.setAttribute("aria-valuenow", String(Math.round(position)));
    };

    const setFromPointer = clientX => {
      const rect = el.getBoundingClientRect();
      const value = ((clientX - rect.left) / rect.width) * 100;

      applyPosition(value);
    };

    el.addEventListener("pointerdown", event => {
      el.setPointerCapture(event.pointerId);
      setFromPointer(event.clientX);
    });

    el.addEventListener("pointermove", event => {
      if (!el.hasPointerCapture(event.pointerId)) return;

      setFromPointer(event.clientX);
    });

    el.addEventListener("keydown", event => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        applyPosition(position - 5);
      }

      if (event.key === "ArrowRight") {
        event.preventDefault();
        applyPosition(position + 5);
      }

      if (event.key === "Home") {
        event.preventDefault();
        applyPosition(5);
      }

      if (event.key === "End") {
        event.preventDefault();
        applyPosition(95);
      }
    });

    applyPosition(50);
  });
}


/* ==========================
   Project Cards
========================== */

function initProjectCards() {
  document.querySelectorAll(".project-card").forEach(card => {
    card.setAttribute("tabindex", "0");
    card.setAttribute("role", "button");
    card.setAttribute("aria-expanded", "false");

    const toggleCard = () => {
      const isFlipped = card.classList.toggle("is-flipped");

      card.setAttribute("aria-expanded", String(isFlipped));
    };

    card.addEventListener("click", toggleCard);

    card.addEventListener("keydown", event => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        toggleCard();
      }
    });
  });
}


/* ==========================
   Initialise
========================== */

document.addEventListener("DOMContentLoaded", () => {
  initMobileMenu();
  initBeforeAfter();
  initProjectCards();
});