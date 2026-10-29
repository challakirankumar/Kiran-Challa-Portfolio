/* Kiran Kumar Challa — Portfolio interactions (no dependencies) */
(() => {
  "use strict";

  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const root = document.documentElement;
  root.classList.add("js");

  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = matchMedia("(hover: hover) and (pointer: fine)").matches;

  /* ---------- Toast ---------- */
  const toastEl = $("#toast");
  let toastTimer;
  const toast = (msg) => {
    toastEl.textContent = msg;
    toastEl.classList.add("is-on");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove("is-on"), 2200);
  };

  /* ---------- Split headings into words for the reveal ---------- */
  $$(".split").forEach((el) => {
    let i = 0;
    const walk = (node) => {
      [...node.childNodes].forEach((child) => {
        if (child.nodeType === 3) {
          const frag = document.createDocumentFragment();
          child.textContent.split(/(\s+)/).forEach((part) => {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.append(part); return; }
            const w = document.createElement("span");
            w.className = "w";
            const inner = document.createElement("span");
            inner.textContent = part;
            inner.style.setProperty("--i", i++);
            w.append(inner);
            frag.append(w);
          });
          child.replaceWith(frag);
        } else if (child.nodeType === 1) {
          walk(child);
        }
      });
    };
    walk(el);
  });

  /* ---------- Reveal on scroll ---------- */
  const revealIO = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("is-in");
        revealIO.unobserve(e.target);
      }
    });
  }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
  $$("[data-reveal]").forEach((el) => revealIO.observe(el));

  /* ---------- Count-up numbers ---------- */
  const countIO = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      countIO.unobserve(e.target);
      const el = e.target;
      const end = +el.dataset.count;
      const suffix = el.dataset.suffix || "";
      if (reduceMotion) return;
      const dur = 1400;
      const t0 = performance.now();
      const tick = (t) => {
        const p = Math.min(1, (t - t0) / dur);
        const eased = 1 - Math.pow(1 - p, 4);
        el.textContent = (p < 1 ? Math.round(end * eased) : end) + suffix;
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
  }, { threshold: 0.6 });
  $$("[data-count]").forEach((el) => countIO.observe(el));

  /* ---------- Nav: scroll progress, scroll-spy, sliding pill, mobile menu ---------- */
  const nav = $("#nav");
  const navLinks = $$(".nav-links a");
  const pill = $(".nav-pill");
  const progress = $(".progress");
  const toggle = $(".nav-toggle");

  const movePill = (link) => {
    if (!link) { pill.style.opacity = "0"; return; }
    pill.style.opacity = "1";
    pill.style.width = link.offsetWidth + "px";
    pill.style.transform = `translateX(${link.offsetLeft}px)`;
  };

  const setActive = (id) => {
    let current = null;
    navLinks.forEach((a) => {
      const on = a.getAttribute("href") === "#" + id;
      a.classList.toggle("is-active", on);
      if (on) { a.setAttribute("aria-current", "true"); current = a; }
      else a.removeAttribute("aria-current");
    });
    movePill(current);
  };

  const sections = navLinks.map((a) => $(a.getAttribute("href"))).filter(Boolean);
  const spy = () => {
    const y = window.scrollY + window.innerHeight * 0.35;
    let id = null;
    sections.forEach((s) => { if (s.offsetTop <= y) id = s.id; });
    setActive(id);
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
  };

  toggle.addEventListener("click", () => {
    const open = !nav.classList.contains("is-open");
    nav.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", open);
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    $("use", toggle).setAttribute("href", open ? "#i-x" : "#i-menu");
  });
  navLinks.forEach((a) => a.addEventListener("click", () => {
    if (nav.classList.contains("is-open")) toggle.click();
  }));

  /* ---------- Experience timeline spine ---------- */
  const timeline = $("#timeline");
  const spine = $(".spine i", timeline);
  const stops = $$(".stop", timeline);
  const updateTimeline = () => {
    const r = timeline.getBoundingClientRect();
    const mark = window.innerHeight * 0.62;
    const p = Math.min(1, Math.max(0, (mark - r.top) / r.height));
    spine.parentElement.style.setProperty("--fill", p);
    spine.style.transform = `scaleY(${p})`;
    stops.forEach((s) => {
      const sr = s.getBoundingClientRect();
      s.classList.toggle("is-lit", sr.top + 30 < mark);
    });
  };

  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => { spy(); updateTimeline(); ticking = false; });
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  window.addEventListener("load", onScroll);
  document.fonts && document.fonts.ready.then(onScroll);
  onScroll();

  /* ---------- Projects accordion ---------- */
  const projects = $$(".project");
  const openProject = (p) => {
    projects.forEach((x) => {
      const on = x === p;
      x.classList.toggle("is-open", on);
      $(".project-tab", x).setAttribute("aria-expanded", on);
    });
  };
  // Size the open panel's content to the space left beside the collapsed tabs (desktop)
  const projectsEl = $("#projects");
  const sizeProjects = () => {
    const cs = getComputedStyle(projectsEl);
    const tab = parseFloat(cs.getPropertyValue("--tab")) || 56;
    const gap = parseFloat(cs.getPropertyValue("--gap")) || 8;
    const w = projectsEl.clientWidth - (projects.length - 1) * (tab + gap);
    projectsEl.style.setProperty("--open-w", w > 0 ? w + "px" : "100%");
    projectsEl.classList.toggle("is-narrow", w < 720);
  };
  sizeProjects();
  window.addEventListener("resize", sizeProjects);

  projects.forEach((p) => {
    const tab = $(".project-tab", p);
    tab.addEventListener("click", () => {
      openProject(p);
      if (window.innerWidth <= 860) {
        setTimeout(() => p.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" }), 60);
      }
    });
    // Skill tags rendered from data-skills (single source of truth with the skills inspector)
    const tags = $("[data-tags]", p);
    p.dataset.skills.split("|").forEach((s) => {
      const c = document.createElement("span");
      c.className = "chip";
      c.textContent = s;
      tags.append(c);
    });
  });

  /* ---------- Skills: periodic table + inspector ---------- */
  const tiles = $$(".el");
  const ins = Object.fromEntries($$("[data-ins]").map((n) => [n.dataset.ins, n]));
  const usage = {};
  projects.forEach((p) => p.dataset.skills.split("|").forEach((s) => {
    (usage[s] = usage[s] || []).push(p.dataset.title);
  }));

  const inspect = (tile) => {
    if (!tile) return;
    tiles.forEach((t) => t.classList.toggle("is-selected", t === tile));
    const d = tile.dataset;
    ins.idx.textContent = String(d.i).padStart(2, "0");
    ins.sym.textContent = d.sym;
    ins.icon.setAttribute("href", "#i-" + d.icon);
    ins.name.textContent = d.name;
    ins.meta.textContent = `${d.catname} · Symbol ${d.sym}`;
    const used = usage[d.name] || [];
    ins.used.replaceChildren(...used.map((u) => {
      const c = document.createElement("span");
      c.className = "chip";
      c.textContent = u;
      return c;
    }));
    if (!used.length) {
      const c = document.createElement("span");
      c.className = "chip";
      c.textContent = "Professional practice";
      ins.used.append(c);
    }
    ins.count.textContent = used.length
      ? `${used.length} project${used.length > 1 ? "s" : ""} reference${used.length > 1 ? "" : "s"} this skill`
      : "Applied across roles and client engagements";
    $$("[data-anim]", $("#inspector")).forEach((n) => {
      n.removeAttribute("data-anim"); void n.offsetWidth; n.setAttribute("data-anim", "");
    });
  };

  tiles.forEach((t) => {
    t.addEventListener("click", () => inspect(t));
    t.addEventListener("focus", () => inspect(t));
    if (finePointer) t.addEventListener("mouseenter", () => inspect(t));
  });
  inspect(tiles[0]);

  $$(".filter").forEach((f) => f.addEventListener("click", () => {
    $$(".filter").forEach((x) => {
      x.classList.toggle("is-active", x === f);
      x.setAttribute("aria-pressed", x === f);
    });
    const cat = f.dataset.filter;
    let first = null;
    tiles.forEach((t) => {
      const match = cat === "all" || t.dataset.cat === cat;
      t.classList.toggle("is-dim", !match);
      t.tabIndex = match ? 0 : -1;
      if (match && !first) first = t;
    });
    inspect(first);
  }));

  /* ---------- Lanyard ID card: tilt + flip ---------- */
  const badge = $("#badge");
  const flip = (state) => {
    const on = typeof state === "boolean" ? state : !badge.classList.contains("is-flipped");
    badge.classList.toggle("is-flipped", on);
    badge.setAttribute("aria-pressed", on);
  };
  badge.addEventListener("click", () => flip());
  badge.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); flip(); }
  });
  if (finePointer && !reduceMotion) {
    badge.addEventListener("mouseenter", () => flip(true));
    badge.addEventListener("mousemove", (e) => {
      const r = badge.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      badge.style.setProperty("--ry", `${x * 18}deg`);
      badge.style.setProperty("--rx", `${-y * 14}deg`);
      $$(".badge-face", badge).forEach((f) => f.style.setProperty("--shine", `${x * 120}%`));
    });
    badge.addEventListener("mouseleave", () => {
      flip(false);
      badge.style.setProperty("--ry", "0deg");
      badge.style.setProperty("--rx", "0deg");
      $$(".badge-face", badge).forEach((f) => f.style.setProperty("--shine", "-60%"));
    });
  }

  /* ---------- Achievements: drag-to-scroll + progress ---------- */
  const track = $("#ach-track");
  const achBar = $(".ach-progress i");
  const updateAch = () => {
    const max = track.scrollWidth - track.clientWidth;
    const p = max > 0 ? track.scrollLeft / max : 1;
    achBar.style.setProperty("--p", 0.2 + p * 0.8);
  };
  track.addEventListener("scroll", updateAch, { passive: true });
  updateAch();
  if (finePointer) {
    let down = false, startX = 0, startLeft = 0, moved = false;
    track.addEventListener("pointerdown", (e) => {
      if (e.pointerType !== "mouse") return;
      down = true; moved = false; startX = e.clientX; startLeft = track.scrollLeft;
      track.classList.add("is-drag");
    });
    window.addEventListener("pointermove", (e) => {
      if (!down) return;
      const dx = e.clientX - startX;
      if (Math.abs(dx) > 3) moved = true;
      track.scrollLeft = startLeft - dx;
    });
    window.addEventListener("pointerup", () => {
      if (!down) return;
      down = false;
      track.classList.remove("is-drag");
    });
    track.addEventListener("click", (e) => { if (moved) { e.preventDefault(); e.stopPropagation(); } }, true);
  }
  track.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") track.scrollBy({ left: 320, behavior: "smooth" });
    if (e.key === "ArrowLeft") track.scrollBy({ left: -320, behavior: "smooth" });
  });

  /* ---------- Copy email ---------- */
  $$("[data-copy]").forEach((btn) => btn.addEventListener("click", async () => {
    const text = btn.dataset.copy;
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = Object.assign(document.createElement("textarea"), { value: text });
      document.body.append(ta); ta.select(); document.execCommand("copy"); ta.remove();
    }
    const label = $("span", btn);
    btn.classList.add("is-done");
    label.textContent = "Copied";
    $("use", btn).setAttribute("href", "#i-check");
    toast("Email copied to clipboard");
    setTimeout(() => {
      btn.classList.remove("is-done");
      label.textContent = "Copy";
      $("use", btn).setAttribute("href", "#i-copy");
    }, 1800);
  }));

  /* ---------- Hero intro video ---------- */
  // Plays muted on load (browser autoplay rules), offers sound, then cross-fades
  // into the cut-out portrait. Pauses while the hero is off-screen.
  const figure = $("#hero-figure");
  const video = $("#intro-video");
  const soundBtn = $("#sound-btn");
  const soundLabel = $("span", soundBtn);
  const soundIcon = $("use", soundBtn);
  const saveData = navigator.connection && navigator.connection.saveData;

  const renderSound = () => {
    const ended = figure.classList.contains("is-ended");
    soundBtn.classList.toggle("is-replay", ended);
    if (ended) {
      soundLabel.textContent = "Replay intro";
      soundIcon.setAttribute("href", "#i-rotate-ccw");
      soundBtn.setAttribute("aria-pressed", "false");
    } else {
      soundLabel.textContent = video.muted ? "Sound on" : "Mute";
      soundIcon.setAttribute("href", video.muted ? "#i-volume-x" : "#i-volume-2");
      soundBtn.setAttribute("aria-pressed", String(!video.muted));
    }
  };
  const endIntro = () => { figure.classList.add("is-ended"); renderSound(); };
  const playIntro = (withSound) => {
    figure.classList.remove("is-ended");
    if (video.ended || video.currentTime > video.duration - 0.2) video.currentTime = 0;
    video.muted = !withSound;
    video.play().catch(() => { video.muted = true; video.play().catch(endIntro); });
    renderSound();
  };

  video.addEventListener("ended", endIntro);
  video.addEventListener("error", endIntro, true);
  video.addEventListener("timeupdate", () => {
    if (video.duration) soundBtn.style.setProperty("--p", video.currentTime / video.duration);
  });
  soundBtn.addEventListener("click", () => {
    if (figure.classList.contains("is-ended")) return playIntro(true);
    if (video.paused) return playIntro(true);
    video.muted = !video.muted;
    renderSound();
  });

  if (reduceMotion || saveData) {
    video.removeAttribute("autoplay");
    video.pause();
    endIntro();
  } else {
    video.play().catch(endIntro); // autoplay blocked → show the portrait
    new IntersectionObserver(([entry]) => {
      if (figure.classList.contains("is-ended")) return;
      if (entry.isIntersecting) video.play().catch(() => {});
      else video.pause();
    }, { threshold: 0.15 }).observe(figure);
  }
  renderSound();

  /* ---------- Footer year ---------- */
  const year = $("#year");
  if (year) year.textContent = new Date().getFullYear();
})();
