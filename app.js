
/* =========================================
   GTA VI — LANDING PAGE
   script.js
========================================= */

"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const navbar = document.getElementById("navbar");
  const menuToggle = document.getElementById("menuToggle");
  const navLinks = document.getElementById("navLinks");
  const loader = document.querySelector(".page-loader");
  const revealElements = document.querySelectorAll(".reveal");
  const navigationLinks = document.querySelectorAll(
    '.nav-links a[href^="#"]'
  );

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  /* -----------------------------------------
     LOADER
  ----------------------------------------- */

  const hideLoader = () => {
    if (!loader) {
      body.classList.remove("is-loading");
      return;
    }

    loader.classList.add("is-hidden");
    body.classList.remove("is-loading");

    window.setTimeout(() => {
      loader.setAttribute("hidden", "");
    }, 700);
  };

  body.classList.add("is-loading");

  if (document.readyState === "complete") {
    window.setTimeout(hideLoader, 350);
  } else {
    window.addEventListener(
      "load",
      () => window.setTimeout(hideLoader, 350),
      { once: true }
    );
  }

  // Evita dejar el contenido bloqueado si la carga tarda.
  window.setTimeout(hideLoader, 3500);

  /* -----------------------------------------
     MOBILE NAVIGATION
  ----------------------------------------- */

  const closeMenu = () => {
    if (!menuToggle || !navLinks) return;

    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Abrir menú");
    navLinks.classList.remove("open");
    body.classList.remove("menu-open");
  };

  const openMenu = () => {
    if (!menuToggle || !navLinks) return;

    menuToggle.setAttribute("aria-expanded", "true");
    menuToggle.setAttribute("aria-label", "Cerrar menú");
    navLinks.classList.add("open");
    body.classList.add("menu-open");
  };

  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
      const isOpen =
        menuToggle.getAttribute("aria-expanded") === "true";

      if (isOpen) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    navigationLinks.forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    // Cierra el menú al pulsar fuera de sus enlaces.
    navLinks.addEventListener("click", (event) => {
      if (event.target === navLinks) {
        closeMenu();
      }
    });

    // Cierra el menú con Escape.
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeMenu();
      }
    });

    // Restablece la navegación al volver a escritorio.
    window.addEventListener("resize", () => {
      if (window.innerWidth > 900) {
        closeMenu();
      }
    });
  }

  /* -----------------------------------------
     STICKY NAVBAR
  ----------------------------------------- */

  let scrollTicking = false;

  const updateNavbar = () => {
    if (navbar) {
      navbar.classList.toggle(
        "scrolled",
        window.scrollY > 40
      );
    }

    scrollTicking = false;
  };

  window.addEventListener(
    "scroll",
    () => {
      if (!scrollTicking) {
        window.requestAnimationFrame(updateNavbar);
        scrollTicking = true;
      }
    },
    { passive: true }
  );

  updateNavbar();

  /* -----------------------------------------
     SCROLL REVEAL
  ----------------------------------------- */

  if ("IntersectionObserver" in window && !reducedMotion) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -45px 0px"
      }
    );

    revealElements.forEach((element, index) => {
      // Escalonado sutil en las tarjetas de personajes.
      if (element.classList.contains("character-card")) {
        element.style.transitionDelay =
          `${(index % 2) * 120}ms`;
      }

      revealObserver.observe(element);
    });
  } else {
    revealElements.forEach((element) => {
      element.classList.add("is-visible");
    });
  }

  /* -----------------------------------------
     ACTIVE NAVIGATION SECTION
  ----------------------------------------- */

  const sections = document.querySelectorAll(
    "main section[id]"
  );

  if ("IntersectionObserver" in window && sections.length) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const currentId = entry.target.id;

          navigationLinks.forEach((link) => {
            const isActive =
              link.getAttribute("href") === `#${currentId}`;

            if (isActive) {
              link.classList.add("active");
              link.setAttribute("aria-current", "location");
            } else {
              link.classList.remove("active");
              link.removeAttribute("aria-current");
            }
          });
        });
      },
      {
        rootMargin: "-30% 0px -55% 0px",
        threshold: 0
      }
    );

    sections.forEach((section) => {
      sectionObserver.observe(section);
    });
  }

  /* -----------------------------------------
     SMOOTH ANCHOR NAVIGATION
  ----------------------------------------- */

  document
    .querySelectorAll('a[href^="#"]')
    .forEach((link) => {
      link.addEventListener("click", (event) => {
        const href = link.getAttribute("href");

        if (!href || href === "#") return;

        const target = document.querySelector(href);

        if (!target) return;

        event.preventDefault();

        target.scrollIntoView({
          behavior: reducedMotion ? "auto" : "smooth",
          block: "start"
        });

        // Actualiza la URL sin saltar bruscamente.
        if (window.location.hash !== href) {
          window.history.pushState(null, "", href);
        }
      });
    });

  /* -----------------------------------------
     IMAGE FALLBACKS
  ----------------------------------------- */

  document.querySelectorAll("img").forEach((img) => {
    img.addEventListener("error", () => {
      img.classList.add("image-unavailable");
      img.style.visibility = "hidden";
    });
  });

  /* -----------------------------------------
     HERO PARALLAX
  ----------------------------------------- */

  const heroImage = document.querySelector(".hero-image");

  if (heroImage && !reducedMotion) {
    let parallaxTicking = false;

    window.addEventListener(
      "scroll",
      () => {
        if (parallaxTicking) return;

        parallaxTicking = true;

        window.requestAnimationFrame(() => {
          const scrollY = window.scrollY;

          if (scrollY < window.innerHeight) {
            heroImage.style.transform =
              `translate3d(0, ${scrollY * 0.12}px, 0) scale(1.035)`;
          }

          parallaxTicking = false;
        });
      },
      { passive: true }
    );
  }

  /* -----------------------------------------
     YEAR IN FOOTER
  ----------------------------------------- */

  const footerText = document.querySelector(".footer p");

  if (footerText) {
    footerText.textContent =
      `PROYECTO DE FANS NO OFICIAL · ${new Date().getFullYear()}`;
  }
});


  /* -----------------------------------------
     YEAR IN FOOTER
  ----------------------------------------- */

  const footerText = document.querySelector(".footer p");

  if (footerText) {
    footerText.textContent =
      `PROYECTO DE FANS NO OFICIAL · ${new Date().getFullYear()}`;
  }

  /* -----------------------------------------
     COMMUNITY FORM
  ----------------------------------------- */

  const communityForm = document.getElementById("communityForm");

  if (communityForm) {
    communityForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const name = document.getElementById("communityName")?.value.trim();
      const email = document.getElementById("communityEmail")?.value.trim();
      const platform = document.getElementById("communityPlatform")?.value;
      const consent = document.getElementById("communityConsent")?.checked;
      const message = document.getElementById("communityMessage");

      if (!message) return;

      if (!name || name.length < 2 || !email || !platform || !consent) {
        message.textContent =
          "Completa todos los campos y acepta las condiciones.";
        message.className = "community-message error";
        return;
      }

      message.textContent =
        `¡Gracias, ${name}! El formulario de demostración se completó para ${platform}.`;

      message.className = "community-message success";
      communityForm.reset();
    });
  }

  /* -----------------------------------------
     NEWSLETTER FORM
  ----------------------------------------- */

  const newsletterForm = document.querySelector("#newsletterForm");
  const formMessage = document.querySelector("#formMessage");

  if (newsletterForm && formMessage) {
    newsletterForm.addEventListener("submit", (event) => {
      event.preventDefault();

      if (!newsletterForm.reportValidity()) return;

      formMessage.textContent =
        "Formulario validado. Aún falta conectar el servicio de registro.";
    });
  }
});

