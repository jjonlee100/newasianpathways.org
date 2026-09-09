document.addEventListener("DOMContentLoaded", function () {
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

  function stripLangPrefix(relPath) {
    return relPath.replace(/^(ko|zh)\//, "");
  }

  function normalizePagePath(pathname, base) {
    var rel = pathname;
    if (base !== "/" && rel.indexOf(base) === 0) {
      rel = rel.slice(base.length - 1);
    }
    rel = rel.replace(/^\/+/, "");
    rel = stripLangPrefix(rel);
    if (!rel || rel === "index.html") {
      return "";
    }
    return rel;
  }

  function urlForLang(lang, pagePath, base) {
    var prefix = lang === "en" ? "" : lang + "/";
    if (!pagePath) {
      return base + prefix;
    }
    return base + prefix + pagePath;
  }

  var base = getSiteBase();
  var switcher = document.querySelector(".lang-switcher");
  if (switcher) {
    switcher.querySelectorAll("a[data-lang]").forEach(function (link) {
      link.addEventListener("click", function (e) {
        e.preventDefault();
        var lang = link.getAttribute("data-lang") || "en";
        try {
          localStorage.setItem(LANG_KEY, lang);
        } catch (err) { /* private mode */ }
        var pagePath = normalizePagePath(window.location.pathname || "/", base);
        window.location.assign(urlForLang(lang, pagePath, base));
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

      var dots = [];

      function cardStep() {
        if (cards.length < 2) {
          return cards[0] ? cards[0].getBoundingClientRect().width : track.clientWidth;
        }
        return cards[1].offsetLeft - cards[0].offsetLeft;
      }

      function maxScrollLeft() {
        return Math.max(0, track.scrollWidth - track.clientWidth);
      }

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
        var idx = Math.round(track.scrollLeft / step);
        return Math.max(0, Math.min(pages - 1, idx));
      }

      function atEnd() {
        return track.scrollLeft >= maxScrollLeft() - 2;
      }

      function scrollToPage(i) {
        var pages = pageCount();
        var step = cardStep();
        var target = Math.max(0, Math.min(i, pages - 1));
        var left = Math.min(target * step, maxScrollLeft());
        track.scrollTo({ left: left, behavior: "smooth" });
      }

      function rebuildDots() {
        if (!dotsWrap) return;
        var pages = pageCount();
        dotsWrap.innerHTML = "";
        dots = [];
        for (var i = 0; i < pages; i++) {
          (function (page) {
            var dot = document.createElement("button");
            dot.type = "button";
            dot.className = "carousel-dot";
            dot.setAttribute("role", "tab");
            dot.setAttribute("aria-label", "Go to slide " + (page + 1));
            dot.addEventListener("click", function () {
              scrollToPage(page);
            });
            dotsWrap.appendChild(dot);
            dots.push(dot);
          })(i);
        }
      }

      function updateUI() {
        var idx = currentPage();
        if (prevBtn) prevBtn.disabled = track.scrollLeft <= 2;
        if (nextBtn) nextBtn.disabled = atEnd();
        dots.forEach(function (dot, i) {
          var active = i === idx;
          dot.classList.toggle("is-active", active);
          dot.setAttribute("aria-selected", active ? "true" : "false");
        });
      }

      if (prevBtn) {
        prevBtn.addEventListener("click", function () {
          scrollToPage(currentPage() - 1);
        });
      }
      if (nextBtn) {
        nextBtn.addEventListener("click", function () {
          scrollToPage(currentPage() + 1);
        });
      }

      track.addEventListener("keydown", function (e) {
        if (e.key === "ArrowLeft") {
          e.preventDefault();
          scrollToPage(currentPage() - 1);
        } else if (e.key === "ArrowRight") {
          e.preventDefault();
          scrollToPage(currentPage() + 1);
        } else if (e.key === "Home") {
          e.preventDefault();
          scrollToPage(0);
        } else if (e.key === "End") {
          e.preventDefault();
          scrollToPage(pageCount() - 1);
        }
      });

      var ticking = false;
      track.addEventListener("scroll", function () {
        if (ticking) return;
        ticking = true;
        window.requestAnimationFrame(function () {
          updateUI();
          ticking = false;
        });
      }, { passive: true });

      var resizeTimer;
      window.addEventListener("resize", function () {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function () {
          rebuildDots();
          updateUI();
        }, 120);
      });

      rebuildDots();
      updateUI();
    });
  }

  initCarousels();

  function initFocusMap() {
    var map = document.querySelector(".focus-map");
    if (!map) return;
    var regions = map.querySelectorAll(".focus-region[data-region]");
    var cards = document.querySelectorAll(".focus-card[data-region]");
    if (!regions.length) return;

    function setActive(id) {
      map.classList.toggle("is-hovering", !!id);
      regions.forEach(function (el) {
        el.classList.toggle("is-active", el.getAttribute("data-region") === id);
      });
      cards.forEach(function (el) {
        el.classList.toggle("is-active", el.getAttribute("data-region") === id);
      });
    }

    function bind(el) {
      var id = el.getAttribute("data-region");
      el.addEventListener("mouseenter", function () { setActive(id); });
      el.addEventListener("focus", function () { setActive(id); });
      el.addEventListener("mouseleave", function () { setActive(null); });
      el.addEventListener("blur", function () { setActive(null); });
    }

    regions.forEach(bind);
    cards.forEach(bind);
  }

  initFocusMap();
});
