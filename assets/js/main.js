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
      rel = rel.slice(base.length - 1); // keep leading /
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


  // Programs carousel (scroll-snap + controls)
  function initCarousels() {
    var roots = document.querySelectorAll("[data-carousel]");
    roots.forEach(function (root) {
      var track = root.querySelector(".carousel-track");
      var prevBtn = root.querySelector(".carousel-btn.prev");
      var nextBtn = root.querySelector(".carousel-btn.next");
      var dotsWrap = root.querySelector(".carousel-dots");
      var currentEl = root.querySelector("[data-carousel-current]");
      var totalEl = root.querySelector("[data-carousel-total]");
      if (!track) return;

      var cards = Array.prototype.slice.call(track.querySelectorAll(".card"));
      var total = cards.length;
      if (totalEl) totalEl.textContent = String(total);
      if (!total) return;

      var dots = [];
      if (dotsWrap) {
        dotsWrap.innerHTML = "";
        cards.forEach(function (_card, i) {
          var dot = document.createElement("button");
          dot.type = "button";
          dot.className = "carousel-dot";
          dot.setAttribute("role", "tab");
          dot.setAttribute("aria-label", "Go to program " + (i + 1));
          dot.addEventListener("click", function () {
            scrollToIndex(i);
          });
          dotsWrap.appendChild(dot);
          dots.push(dot);
        });
      }

      function cardStep() {
        if (cards.length < 2) {
          return cards[0] ? cards[0].offsetWidth : track.clientWidth;
        }
        return cards[1].offsetLeft - cards[0].offsetLeft;
      }

      function maxScrollLeft() {
        return Math.max(0, track.scrollWidth - track.clientWidth);
      }

      function currentIndex() {
        var step = cardStep();
        if (step <= 0) return 0;
        return Math.max(0, Math.min(total - 1, Math.round(track.scrollLeft / step)));
      }

      function atEnd() {
        return track.scrollLeft >= maxScrollLeft() - 2;
      }

      function scrollToIndex(i) {
        var step = cardStep();
        var target = Math.max(0, Math.min(i, total - 1));
        var left = Math.min(target * step, maxScrollLeft());
        track.scrollTo({ left: left, behavior: "smooth" });
      }

      function updateUI() {
        var idx = currentIndex();
        if (currentEl) currentEl.textContent = String(idx + 1);
        if (prevBtn) prevBtn.disabled = track.scrollLeft <= 2;
        if (nextBtn) nextBtn.disabled = atEnd();
        dots.forEach(function (dot, i) {
          var active = i === idx;
          dot.classList.toggle("is-active", active);
          dot.setAttribute("aria-selected", active ? "true" : "false");
          dot.hidden = false;
        });
      }

      if (prevBtn) {
        prevBtn.addEventListener("click", function () {
          scrollToIndex(currentIndex() - 1);
        });
      }
      if (nextBtn) {
        nextBtn.addEventListener("click", function () {
          scrollToIndex(currentIndex() + 1);
        });
      }

      track.addEventListener("keydown", function (e) {
        if (e.key === "ArrowLeft") {
          e.preventDefault();
          scrollToIndex(currentIndex() - 1);
        } else if (e.key === "ArrowRight") {
          e.preventDefault();
          scrollToIndex(currentIndex() + 1);
        } else if (e.key === "Home") {
          e.preventDefault();
          scrollToIndex(0);
        } else if (e.key === "End") {
          e.preventDefault();
          scrollToIndex(total - 1);
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

      window.addEventListener("resize", function () {
        updateUI();
      });

      updateUI();
    });
  }

  initCarousels();

  // Soft preference removed: it fought manual language switching on GitHub Pages.
});
