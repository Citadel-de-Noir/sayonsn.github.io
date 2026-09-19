const root = document.documentElement;
const progress = document.getElementById("scrollProgress");
const backToTop = document.getElementById("backToTop");
const cursorGlow = document.getElementById("cursorGlow");
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");
const navItems = [...document.querySelectorAll(".nav-link")];
const sectionNavItems = navItems.filter((item) => item.getAttribute("href").startsWith("#"));

document.getElementById("year").textContent = new Date().getFullYear();

// Scroll progress + back-to-top
function updateScrollUI() {
  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const percent = scrollable > 0 ? Math.min(100, Math.max(0, (scrollTop / scrollable) * 100)) : 0;

  progress.style.width = `${percent}%`;
  backToTop.classList.toggle("visible", scrollTop > 650);
}

window.addEventListener("scroll", updateScrollUI, { passive: true });
window.addEventListener("resize", updateScrollUI);
updateScrollUI();

backToTop.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// Mobile navigation
menuToggle.addEventListener("click", () => {
  const open = navLinks.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(open));
});

navItems.forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  });
});

// Active navigation state
const sections = [...document.querySelectorAll("main section[id]")];

const sectionObserver = new IntersectionObserver(
  (entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

    if (!visible.length) return;
    const id = visible[0].target.id;

    sectionNavItems.forEach((item) => {
      item.classList.toggle("active", item.getAttribute("href") === `#${id}`);
    });
  },
  {
    rootMargin: "-32% 0px -52% 0px",
    threshold: [0, 0.15, 0.3, 0.5]
  }
);

sections.forEach((section) => sectionObserver.observe(section));

// Reveal animations
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    });
  },
  { threshold: 0.1 }
);

document.querySelectorAll(".reveal").forEach((element, index) => {
  element.style.transitionDelay = `${Math.min(index % 4, 3) * 55}ms`;
  revealObserver.observe(element);
});

// Expandable current courses
document.querySelectorAll(".course-card").forEach((card) => {
  const button = card.querySelector(".course-toggle");
  if (!button) return;

  button.addEventListener("click", () => {
    const open = card.classList.toggle("open");
    button.setAttribute("aria-expanded", String(open));
  });
});

// Course tabs
const tabs = [...document.querySelectorAll(".course-tab")];
const panels = [...document.querySelectorAll(".course-panel")];

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    const target = tab.dataset.courseTab;

    tabs.forEach((otherTab) => {
      const active = otherTab === tab;
      otherTab.classList.toggle("active", active);
      otherTab.setAttribute("aria-selected", String(active));
    });

    panels.forEach((panel) => {
      const active = panel.dataset.coursePanel === target;
      panel.hidden = !active;
      panel.classList.toggle("active", active);

      if (active) {
        panel.querySelectorAll(".reveal").forEach((el) => el.classList.add("visible"));
      }
    });
  });
});

// Subtle cursor light for fine-pointer devices
const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");

if (finePointer.matches && cursorGlow) {
  window.addEventListener("pointermove", (event) => {
    cursorGlow.style.left = `${event.clientX}px`;
    cursorGlow.style.top = `${event.clientY}px`;
    cursorGlow.style.opacity = "1";
  }, { passive: true });

  window.addEventListener("mouseout", (event) => {
    if (!event.relatedTarget) cursorGlow.style.opacity = "0";
  });
}

// Lightweight card tilt, disabled on touch and reduced-motion
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (finePointer.matches && !reduceMotion) {
  document.querySelectorAll(".tilt-card").forEach((card) => {
    card.addEventListener("pointermove", (event) => {
      const rect = card.getBoundingClientRect();
      const px = (event.clientX - rect.left) / rect.width;
      const py = (event.clientY - rect.top) / rect.height;
      const rotateY = (px - 0.5) * 4;
      const rotateX = (0.5 - py) * 4;

      card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-3px)`;
    });

    card.addEventListener("pointerleave", () => {
      card.style.transform = "";
    });
  });
}
