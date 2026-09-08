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

  // Soft preference removed: it fought manual language switching on GitHub Pages.
});
