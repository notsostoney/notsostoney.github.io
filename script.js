const CONFIG = {
  launcherDownloadUrl: "https://github.com/notsostoney/helfart-modpack/releases/download/v1.0.0-alpha/Helf.Art.Online.Setup.1.0.0-alpha.exe",
  launcherDownloadMac: "https://github.com/notsostoney/helfart-modpack/releases/download/v1.0.0-alpha/Helf.Art.Online-1.0.0-alpha-arm64.dmg",
  discordUrl: "https://discord.gg/S9qMGHk3tJ",
  serverHost: "game09.helloserv.fr:25517",
  serverPort: 25517,
  rulesUrl: "#",
  supportUrl: "#"
};

const setupDynamicLinks = () => {
  // Ces boutons scrollent vers la section launcher (choix Mac/Windows)
  const scrollToLauncherTargets = [
    "download-header",
    "download-hero",
    "download-join",
    "download-footer"
  ];

  const discordTargets = ["discord-hero", "discord-footer", "discord-faq"];

  scrollToLauncherTargets.forEach((id) => {
    const el = document.getElementById(id);
    if (el) { el.href = "#launcher"; el.removeAttribute("target"); }
  });

  discordTargets.forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.href = CONFIG.discordUrl;
  });

  // Boutons de téléchargement réels (fichiers)
  const macBtn = document.getElementById("download-mac");
  if (macBtn) macBtn.href = CONFIG.launcherDownloadMac;

  const winBtn = document.getElementById("download-win");
  if (winBtn) winBtn.href = CONFIG.launcherDownloadUrl;

  document.querySelectorAll('a[href="#"]').forEach((anchor) => {
    if (anchor.textContent.toLowerCase().includes("règlement")) {
      anchor.href = CONFIG.rulesUrl;
    }

    if (anchor.textContent.toLowerCase().includes("support")) {
      anchor.href = CONFIG.supportUrl;
    }
  });
};

const setupMobileMenu = () => {
  const toggle = document.querySelector(".menu-toggle");
  const nav = document.getElementById("main-nav");

  if (!toggle || !nav) return;

  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  nav.querySelectorAll("a").forEach((item) => {
    item.addEventListener("click", () => {
      nav.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
};

const setupRevealOnScroll = () => {
  const items = document.querySelectorAll(".reveal");

  if (!items.length) return;

  const observer = new IntersectionObserver(
    (entries, currentObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("visible");
        currentObserver.unobserve(entry.target);
      });
    },
    {
      rootMargin: "0px 0px -8% 0px",
      threshold: 0.12
    }
  );

  items.forEach((item) => observer.observe(item));
};

const setupHeaderState = () => {
  const header = document.querySelector(".site-header");

  if (!header) return;

  const update = () => {
    if (window.scrollY > 16) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  };

  update();
  window.addEventListener("scroll", update, { passive: true });
};

const setupParallax = () => {
  const layers = document.querySelectorAll("[data-parallax]");

  if (!layers.length || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return;
  }

  let rafId = null;
  let mouseX = 0;
  let mouseY = 0;

  const render = () => {
    const x = (mouseX / window.innerWidth - 0.5) * 2;
    const y = (mouseY / window.innerHeight - 0.5) * 2;

    layers.forEach((layer) => {
      const strength = Number(layer.getAttribute("data-parallax") || 0.1);
      const tx = x * strength * 28;
      const ty = y * strength * 18;
      layer.style.transform = `translate3d(${tx}px, ${ty}px, 0)`;
    });

    rafId = null;
  };

  const schedule = () => {
    if (rafId !== null) return;
    rafId = window.requestAnimationFrame(render);
  };

  window.addEventListener(
    "mousemove",
    (event) => {
      mouseX = event.clientX;
      mouseY = event.clientY;
      schedule();
    },
    { passive: true }
  );
};

const setupParticles = () => {
  const canvas = document.getElementById("particles-canvas");

  if (!canvas || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return;
  }

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  let width = 0;
  let height = 0;
  let animationFrame = 0;

  const particles = [];
  const densityFactor = window.innerWidth < 768 ? 22_000 : 17_000;
  const particleCount = Math.max(26, Math.min(56, Math.round((window.innerWidth * window.innerHeight) / densityFactor)));

  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };

  const createParticle = () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    size: Math.random() * 2.4 + 0.5,
    speedY: Math.random() * 0.22 + 0.06,
    speedX: (Math.random() - 0.5) * 0.18,
    alpha: Math.random() * 0.58 + 0.16,
    twinkle: Math.random() * Math.PI * 2
  });

  const init = () => {
    particles.length = 0;
    for (let i = 0; i < particleCount; i += 1) {
      particles.push(createParticle());
    }
  };

  const draw = () => {
    ctx.clearRect(0, 0, width, height);

    particles.forEach((p) => {
      p.y -= p.speedY;
      p.x += p.speedX;
      p.twinkle += 0.018;

      if (p.y < -8) {
        p.y = height + 8;
        p.x = Math.random() * width;
      }

      if (p.x < -8) p.x = width + 8;
      if (p.x > width + 8) p.x = -8;

      const flicker = 0.55 + Math.sin(p.twinkle) * 0.45;
      ctx.beginPath();
      ctx.fillStyle = `rgba(145, 228, 255, ${p.alpha * flicker})`;
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    });

    animationFrame = window.requestAnimationFrame(draw);
  };

  resize();
  init();
  draw();

  window.addEventListener("resize", () => {
    resize();
    init();
  });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      cancelAnimationFrame(animationFrame);
      animationFrame = 0;
      return;
    }

    if (!animationFrame) draw();
  });
};

const setCurrentYear = () => {
  const year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());
};

// ── Statut serveur (polling via mcsrvstat.us) ──────────────────────────────
const setupServerStatus = () => {
  const elPlayers = document.getElementById("hero-players");
  const elStatus  = document.getElementById("hero-status");
  if (!elPlayers || !elStatus) return;

  const update = () => {
    fetch(`https://api.mcsrvstat.us/3/${CONFIG.serverHost}`)
      .then(r => r.json())
      .then(data => {
        if (data.online) {
          elPlayers.textContent = data.players?.online ?? 0;
          elStatus.textContent  = "En ligne";
          elStatus.style.color  = "#6aff9e";
        } else {
          elPlayers.textContent = "0";
          elStatus.textContent  = "Hors ligne";
          elStatus.style.color  = "#ff6a6a";
        }
      })
      .catch(() => {
        elPlayers.textContent = "—";
        elStatus.textContent  = "Hors ligne";
        elStatus.style.color  = "#ff6a6a";
      });
  };

  update();
  setInterval(update, 60_000); // rafraîchit chaque minute
};

setupDynamicLinks();
setupMobileMenu();
setupRevealOnScroll();
setupHeaderState();
setupParallax();
setupParticles();
setCurrentYear();
setupServerStatus();
