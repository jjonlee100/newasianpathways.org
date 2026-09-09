document.addEventListener("DOMContentLoaded", function () {
  var extra = document.createElement("style");
  extra.textContent = ".sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0;}.subscribe-form{display:flex;flex-wrap:wrap;gap:.5rem;margin-top:.75rem;}.subscribe-form input[type=email]{flex:1 1 10rem;min-width:0;padding:.65rem .8rem;border:1px solid var(--color-border);border-radius:999px;font:inherit;}.subscribe-note{width:100%;margin:.35rem 0 0;color:var(--color-primary);font-weight:600;font-size:.9rem;}.contact-email{font-weight:600;margin-bottom:1rem;}.contact-form{display:grid;gap:.65rem;text-align:left;}.contact-form input,.contact-form textarea{width:100%;padding:.7rem .85rem;border:1px solid var(--color-border);border-radius:10px;font:inherit;background:#fff;}.contact-form textarea{resize:vertical;min-height:7rem;}.contact-form .btn{justify-self:start;}.help-card>.btn{display:block;width:fit-content;margin:.35rem auto 0;}";
  document.head.appendChild(extra);

  var toggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector(".nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  var LANG_KEY = "nap-lang";
  function getSiteBase() {
    var host = window.location.hostname || "";
    var path = window.location.pathname || "/";
    if (/\.github\.io$/i.test(host)) {
      var seg = path.split("/").filter(Boolean)[0];
      return seg ? "/" + seg + "/" : "/";
    }
    return "/";
  }
  function stripLangPrefix(relPath) { return relPath.replace(/^(ko|zh)\//, ""); }
  function normalizePagePath(pathname, base) {
    var rel = pathname;
    if (base !== "/" && rel.indexOf(base) === 0) rel = rel.slice(base.length - 1);
    rel = rel.replace(/^\/+/, "");
    rel = stripLangPrefix(rel);
    if (!rel || rel === "index.html") return "";
    return rel;
  }
  function urlForLang(lang, pagePath, base) {
    var prefix = lang === "en" ? "" : lang + "/";
    return !pagePath ? base + prefix : base + prefix + pagePath;
  }
  var base = getSiteBase();
  var switcher = document.querySelector(".lang-switcher");
  if (switcher) {
    switcher.querySelectorAll("a[data-lang]").forEach(function (link) {
      link.addEventListener("click", function (e) {
        e.preventDefault();
        var lang = link.getAttribute("data-lang") || "en";
        try { localStorage.setItem(LANG_KEY, lang); } catch (err) {}
        window.location.assign(urlForLang(lang, normalizePagePath(window.location.pathname || "/", base), base));
      });
    });
  }

  function initCarousels() {
    var roots = document.querySelectorAll("[data-carousel]");
    roots.forEach(function (root) {
      var track = root.querySelector(".carousel-track");
      var prevBtn = root.querySelector(".carousel-btn.prev");
      var nextBtn = root.querySelector(".carousel-btn.next");
      var dotsWrap = root.querySelector(".carousel-dots");
      if (!track) return;
      var cards = Array.prototype.slice.call(track.querySelectorAll(".card"));
      if (!cards.length) return;
      function cardStep() {
        if (cards.length < 2) return cards[0] ? cards[0].getBoundingClientRect().width : track.clientWidth;
        return cards[1].offsetLeft - cards[0].offsetLeft;
      }
      function maxScrollLeft() { return Math.max(0, track.scrollWidth - track.clientWidth); }
      function pageCount() {
        var step = cardStep();
        if (step <= 0) return 1;
        var max = maxScrollLeft();
        if (max <= 2) return 1;
        return Math.max(1, Math.round(max / step) + 1);
      }
      function currentPage() {
        var pages = pageCount();
        var step = cardStep();
        if (step <= 0 || pages <= 1) return 0;
        return Math.max(0, Math.min(pages - 1, Math.round(track.scrollLeft / step)));
      }
      function atEnd() { return track.scrollLeft >= maxScrollLeft() - 2; }
      function scrollToPage(i) {
        var pages = pageCount();
        var step = cardStep();
        var target = Math.max(0, Math.min(i, pages - 1));
        track.scrollTo({ left: Math.min(target * step, maxScrollLeft()), behavior: "smooth" });
      }
      function rebuildDots() {
        if (!dotsWrap) return;
        var pages = pageCount();
        dotsWrap.innerHTML = "";
        var dots = [];
        for (var i = 0; i < pages; i++) {
          (function (page) {
            var dot = document.createElement("button");
            dot.type = "button";
            dot.className = "carousel-dot";
            dot.setAttribute("role", "tab");
            dot.setAttribute("aria-label", "Go to slide " + (page + 1));
            dot.addEventListener("click", function () { scrollToPage(page); });
            dotsWrap.appendChild(dot);
            dots.push(dot);
          })(i);
        }
        root._dots = dots;
      }
      function updateUI() {
        var idx = currentPage();
        if (prevBtn) prevBtn.disabled = track.scrollLeft <= 2;
        if (nextBtn) nextBtn.disabled = atEnd();
        (root._dots || []).forEach(function (dot, i) {
          var active = i === idx;
          dot.classList.toggle("is-active", active);
          dot.setAttribute("aria-selected", active ? "true" : "false");
        });
      }
      if (prevBtn) prevBtn.addEventListener("click", function () { scrollToPage(currentPage() - 1); });
      if (nextBtn) nextBtn.addEventListener("click", function () { scrollToPage(currentPage() + 1); });
      track.addEventListener("keydown", function (e) {
        if (e.key === "ArrowLeft") { e.preventDefault(); scrollToPage(currentPage() - 1); }
        else if (e.key === "ArrowRight") { e.preventDefault(); scrollToPage(currentPage() + 1); }
        else if (e.key === "Home") { e.preventDefault(); scrollToPage(0); }
        else if (e.key === "End") { e.preventDefault(); scrollToPage(pageCount() - 1); }
      });
      var ticking = false;
      track.addEventListener("scroll", function () {
        if (ticking) return;
        ticking = true;
        window.requestAnimationFrame(function () { updateUI(); ticking = false; });
      }, { passive: true });
      window.addEventListener("resize", function () {
        rebuildDots();
        updateUI();
      });
      rebuildDots();
      updateUI();
    });
  }
  initCarousels();

  document.querySelectorAll("[data-subscribe]").forEach(function (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var note = form.querySelector(".subscribe-note");
      var input = form.querySelector("input[type=email]");
      if (note) note.hidden = false;
      if (input) input.value = "";
    });
  });

  document.querySelectorAll("[data-contact]").forEach(function (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var to = form.getAttribute("data-contact-email") || "hello@newasianpathways.org";
      var name = (form.querySelector("[name=name]") || {}).value || "";
      var email = (form.querySelector("[name=email]") || {}).value || "";
      var message = (form.querySelector("[name=message]") || {}).value || "";
      var subject = encodeURIComponent("NAP website inquiry from " + name);
      var body = encodeURIComponent("Name: " + name + "\nEmail: " + email + "\n\n" + message);
      var note = form.querySelector(".subscribe-note");
      if (note) note.hidden = false;
      window.location.href = "mailto:" + to + "?subject=" + subject + "&body=" + body;
    });
  });
});
