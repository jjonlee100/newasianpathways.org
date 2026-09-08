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
  var switcher = document.querySelector(".lang-switcher");
  if (switcher) {
    switcher.querySelectorAll("a[data-lang]").forEach(function (link) {
      link.addEventListener("click", function () {
        try {
          localStorage.setItem(LANG_KEY, link.getAttribute("data-lang"));
        } catch (e) { /* private mode */ }
      });
    });
  }

  // Soft preference: if landing on English home with a saved non-EN preference,
  // redirect once per session to the preferred language home (opt-in UX).
  try {
    var preferred = localStorage.getItem(LANG_KEY);
    var path = window.location.pathname || "";
    var isEnHome =
      /(?:^|\/)(?:index\.html)?$/.test(path.replace(/\/+$/, "/") ) &&
      path.indexOf("/ko/") === -1 &&
      path.indexOf("/zh/") === -1;
    // More reliable: check html[lang] and a data attribute on body
    var htmlLang = (document.documentElement.getAttribute("lang") || "en").toLowerCase();
    var isRootHome = document.body && document.body.getAttribute("data-page") === "home";
    var alreadyRedirected = sessionStorage.getItem("nap-lang-redirected");
    if (
      isRootHome &&
      htmlLang.indexOf("en") === 0 &&
      (preferred === "ko" || preferred === "zh") &&
      !alreadyRedirected
    ) {
      sessionStorage.setItem("nap-lang-redirected", "1");
      var base = document.body.getAttribute("data-base") || "";
      window.location.replace(base + preferred + "/index.html");
    }
  } catch (e) { /* ignore */ }
});
