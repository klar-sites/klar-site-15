document.addEventListener("DOMContentLoaded", () => {
  const root = document.documentElement;
  const header = document.querySelector("[data-header]");
  const mobileToggle = document.querySelector("[data-mobile-toggle]");
  const mobileMenu = document.querySelector("[data-mobile-menu]");
  const themeToggles = document.querySelectorAll("[data-theme-toggle]");
  const billingToggles = document.querySelectorAll("[data-billing-toggle]");
  const priceAmounts = document.querySelectorAll(".price-amount");
  const pricePeriods = document.querySelectorAll(".price-period");
  const faqButtons = document.querySelectorAll("[data-faq-button]");
  const revealItems = document.querySelectorAll(".reveal");
  const interactiveCards = document.querySelectorAll(".card, .btn, .social-link");

  const storedTheme = localStorage.getItem("klarify-theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const initialTheme = storedTheme || (prefersDark ? "dark" : "light");

  root.setAttribute("data-theme", initialTheme);
  updateThemeButtonLabels(initialTheme);

  function updateThemeButtonLabels(theme) {
    const nextTheme = theme === "dark" ? "light" : "dark";
    themeToggles.forEach((button) => {
      button.setAttribute("aria-label", `Switch to ${nextTheme} theme`);
    });
  }

  function closeMobileMenu() {
    if (!mobileToggle || !mobileMenu) return;
    mobileToggle.setAttribute("aria-expanded", "false");
    mobileToggle.setAttribute("aria-label", "Open menu");
    mobileMenu.classList.remove("is-open");
    document.body.classList.remove("nav-open");
  }

  function handleHeaderScroll() {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 8);
  }

  handleHeaderScroll();
  window.addEventListener("scroll", handleHeaderScroll, { passive: true });

  if (mobileToggle && mobileMenu) {
    mobileToggle.addEventListener("click", () => {
      const isOpen = mobileToggle.getAttribute("aria-expanded") === "true";
      mobileToggle.setAttribute("aria-expanded", String(!isOpen));
      mobileToggle.setAttribute("aria-label", isOpen ? "Open menu" : "Close menu");
      mobileMenu.classList.toggle("is-open", !isOpen);
      document.body.classList.toggle("nav-open", !isOpen);
    });
  }

  themeToggles.forEach((button) => {
    button.addEventListener("click", () => {
      const currentTheme = root.getAttribute("data-theme") || "light";
      const nextTheme = currentTheme === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", nextTheme);
      localStorage.setItem("klarify-theme", nextTheme);
      updateThemeButtonLabels(nextTheme);
    });
  });

  billingToggles.forEach((button) => {
    button.addEventListener("click", () => {
      const billing = button.dataset.billingToggle;

      billingToggles.forEach((toggle) => {
        const isActive = toggle === button;
        toggle.classList.toggle("is-active", isActive);
        toggle.setAttribute("aria-pressed", String(isActive));
      });

      priceAmounts.forEach((amount) => {
        const nextValue = amount.dataset[billing];
        if (nextValue) {
          amount.textContent = nextValue;
        }
      });

      pricePeriods.forEach((period) => {
        if (!period.previousElementSibling) return;
        const amount = period.previousElementSibling;
        if (amount.textContent === "Custom") {
          period.textContent = "";
        } else {
          period.textContent = billing === "yearly" ? "/mo, billed yearly" : "/mo";
        }
      });
    });
  });

  faqButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const answerId = button.getAttribute("aria-controls");
      const answer = answerId ? document.getElementById(answerId) : null;
      const isExpanded = button.getAttribute("aria-expanded") === "true";

      faqButtons.forEach((otherButton) => {
        const otherAnswerId = otherButton.getAttribute("aria-controls");
        const otherAnswer = otherAnswerId ? document.getElementById(otherAnswerId) : null;
        otherButton.setAttribute("aria-expanded", "false");
        if (otherAnswer) {
          otherAnswer.classList.remove("is-open");
        }
      });

      if (!isExpanded && answer) {
        button.setAttribute("aria-expanded", "true");
        answer.classList.add("is-open");
      }
    });
  });

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetId = link.getAttribute("href");
      if (!targetId || targetId === "#") return;

      const target = document.querySelector(targetId);
      if (!target) return;

      event.preventDefault();
      closeMobileMenu();

      target.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
        block: "start"
      });

      if (history.pushState) {
        history.pushState(null, "", targetId);
      }
    });
  });

  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.14,
        rootMargin: "0px 0px -48px 0px"
      }
    );

    revealItems.forEach((item) => revealObserver.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  }

  interactiveCards.forEach((element) => {
    element.addEventListener("pointerenter", () => {
      element.classList.add("is-hovered");
    });

    element.addEventListener("pointerleave", () => {
      element.classList.remove("is-hovered");
    });

    element.addEventListener("pointerdown", () => {
      element.style.transform = "translateY(0)";
    });

    element.addEventListener("pointerup", () => {
      element.style.transform = "";
    });

    element.addEventListener("pointercancel", () => {
      element.style.transform = "";
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMobileMenu();
    }
  });
});
