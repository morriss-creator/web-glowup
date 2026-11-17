(function () {
  var cfg = window.WEB_GLOWUP || {};
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function formatMoney(value) {
    var n = Number(value);
    if (!isFinite(n)) return "";
    var negative = n < 0;
    var digits = String(Math.round(Math.abs(n)));
    var grouped = digits.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return (negative ? "-$" : "$") + grouped;
  }

  function token(label) {
    return String(label)
      .split("{from}").join(formatMoney(cfg.priceFrom))
      .split("{max}").join(formatMoney(cfg.priceMax));
  }

  function priceSentence() {
    return "From " + formatMoney(cfg.priceFrom) + " up to " + formatMoney(cfg.priceMax) + ". Price by quote.";
  }

  if (cfg.priceFrom != null && cfg.priceMax != null) {
    document.querySelectorAll("[data-price-sentence]").forEach(function (el) {
      el.textContent = priceSentence();
    });
    document.querySelectorAll("[data-amount]").forEach(function (el) {
      var key = el.getAttribute("data-amount");
      el.textContent = formatMoney(key === "max" ? cfg.priceMax : cfg.priceFrom);
    });
    document.querySelectorAll("[data-currency]").forEach(function (el) {
      el.textContent = cfg.currency || "USD";
    });
  }

  if (cfg.email) {
    document.querySelectorAll("[data-email]").forEach(function (el) {
      if (el.tagName === "A") el.setAttribute("href", "mailto:" + cfg.email);
      el.textContent = cfg.email;
    });
  }

  if (cfg.demoUrl) {
    document.querySelectorAll("[data-demo-link]").forEach(function (el) {
      el.setAttribute("href", cfg.demoUrl);
    });
  }

  var budget = document.querySelector("[data-budget]");
  if (budget && Array.isArray(cfg.budgetChoices)) {
    cfg.budgetChoices.forEach(function (choice) {
      var opt = document.createElement("option");
      opt.value = choice.value;
      opt.textContent = token(choice.label);
      budget.appendChild(opt);
    });
  }

  var header = document.querySelector(".site-header");
  if (header) {
    var onScroll = function () {
      header.classList.toggle("is-scrolled", window.scrollY > 8);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  var toggle = document.querySelector("[data-nav-toggle]");
  var panel = document.querySelector("[data-nav-panel]");
  var desktopQuery = window.matchMedia("(min-width: 960px)");

  function navIsDesktop() {
    return desktopQuery.matches;
  }

  function setNav(open) {
    if (!toggle || !panel) return;
    var desktop = navIsDesktop();
    var show = desktop || open;
    panel.classList.toggle("is-open", !desktop && open);
    toggle.setAttribute("aria-expanded", String(!desktop && open));
    toggle.textContent = !desktop && open ? "Close" : "Menu";
    document.body.classList.toggle("nav-open", !desktop && open);
    if (show) {
      panel.removeAttribute("inert");
      panel.removeAttribute("aria-hidden");
    } else {
      panel.setAttribute("inert", "");
      panel.setAttribute("aria-hidden", "true");
    }
    if (!desktop && open) {
      panel.setAttribute("role", "dialog");
      panel.setAttribute("aria-modal", "true");
      panel.setAttribute("aria-label", "Menu");
    } else {
      panel.removeAttribute("role");
      panel.removeAttribute("aria-modal");
      panel.removeAttribute("aria-label");
    }
  }

  if (toggle && panel) {
    setNav(false);
    toggle.addEventListener("click", function () {
      setNav(toggle.getAttribute("aria-expanded") !== "true");
    });
    panel.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        if (!navIsDesktop()) setNav(false);
      });
    });
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") setNav(false);
      if (event.key !== "Tab" || navIsDesktop() || toggle.getAttribute("aria-expanded") !== "true") return;
      var items = [toggle].concat(Array.prototype.slice.call(panel.querySelectorAll("a, button")));
      var first = items[0];
      var last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    });
    if (typeof desktopQuery.addEventListener === "function") {
      desktopQuery.addEventListener("change", function () { setNav(false); });
    } else if (typeof desktopQuery.addListener === "function") {
      desktopQuery.addListener(function () { setNav(false); });
    }
  }

  var reveals = document.querySelectorAll(".reveal");
  if (!reduce && reveals.length && "IntersectionObserver" in window) {
    reveals.forEach(function (el) {
      var rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.92 && rect.bottom > 0) {
        el.classList.add("is-in");
      }
    });
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.14, rootMargin: "0px 0px -8% 0px" }
    );
    reveals.forEach(function (el) {
      if (!el.classList.contains("is-in")) observer.observe(el);
    });
  } else {
    reveals.forEach(function (el) { el.classList.add("is-in"); });
  }

  var cycle = document.querySelector("[data-cycle]");
  if (cycle) {
    var steps = Array.prototype.slice.call(cycle.querySelectorAll("li"));
    var stepIndex = 0;
    var timer = null;

    function paint(index) {
      steps.forEach(function (step, i) {
        step.classList.toggle("is-active", i === index);
      });
    }

    function stopCycle() {
      if (timer) window.clearInterval(timer);
      timer = null;
    }

    function startCycle() {
      if (reduce || timer || document.hidden) return;
      timer = window.setInterval(function () {
        stepIndex = (stepIndex + 1) % steps.length;
        paint(stepIndex);
      }, 2600);
    }

    if (reduce) {
      cycle.classList.add("is-static");
    } else if (steps.length) {
      paint(0);
      startCycle();
      cycle.addEventListener("pointerenter", stopCycle);
      cycle.addEventListener("pointerleave", startCycle);
      cycle.addEventListener("focusin", stopCycle);
      cycle.addEventListener("focusout", function (event) {
        if (!cycle.contains(event.relatedTarget)) startCycle();
      });
      document.addEventListener("visibilitychange", function () {
        if (document.hidden) stopCycle();
        else startCycle();
      });
    }
  }

  if (!reduce && window.matchMedia("(pointer: fine)").matches) {
    document.querySelectorAll("[data-glow]").forEach(function (el) {
      el.addEventListener("pointermove", function (event) {
        var rect = el.getBoundingClientRect();
        el.style.setProperty("--mx", event.clientX - rect.left + "px");
        el.style.setProperty("--my", event.clientY - rect.top + "px");
      });
    });
  }

  document.querySelectorAll("[data-check]").forEach(function (link) {
    link.addEventListener("click", function () {
      var box = document.getElementById("fn-" + link.getAttribute("data-check"));
      if (box) box.checked = true;
    });
  });

  var navLinks = document.querySelectorAll("[data-nav-panel] a[href^='#']");
  if (navLinks.length && "IntersectionObserver" in window) {
    var linkById = {};
    navLinks.forEach(function (link) {
      var id = link.getAttribute("href").slice(1);
      if (id && link.className.indexOf("nav-cta") === -1) linkById[id] = link;
    });
    var spy = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          var link = linkById[entry.target.id];
          if (!link) return;
          if (entry.isIntersecting) {
            navLinks.forEach(function (item) { item.removeAttribute("aria-current"); });
            link.setAttribute("aria-current", "true");
          }
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0.01 }
    );
    Object.keys(linkById).forEach(function (id) {
      var section = document.getElementById(id);
      if (section) spy.observe(section);
    });
  }

  var form = document.querySelector("[data-quote]");
  if (!form) return;

  var status = document.querySelector("[data-form-status]");
  var submit = form.querySelector("[type='submit']");

  function fieldError(id, message) {
    var el = document.getElementById(id);
    if (!el) return;
    el.hidden = !message;
    el.textContent = message || "";
  }

  function setInvalid(input, invalid) {
    if (!input) return;
    if (invalid) input.setAttribute("aria-invalid", "true");
    else input.removeAttribute("aria-invalid");
  }

  function clearErrors() {
    form.querySelectorAll("[aria-invalid]").forEach(function (el) {
      el.removeAttribute("aria-invalid");
    });
    form.querySelectorAll(".field-error").forEach(function (el) {
      el.hidden = true;
      el.textContent = "";
    });
  }

  function checkedFunctions() {
    return Array.prototype.slice.call(form.querySelectorAll('input[name="features"]:checked'));
  }

  function validate() {
    var first = null;
    function fail(input, errorId, message) {
      setInvalid(input, true);
      fieldError(errorId, message);
      if (!first) first = input;
    }

    var business = form.elements.business;
    var industry = form.elements.industry;
    var name = form.elements.name;
    var email = form.elements.email;
    var wishes = form.elements.wishes;
    var website = form.elements.website;
    var budgetField = form.elements.budget;
    var emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email.value || "").trim());
    var siteValue = String(website.value || "").trim();
    var siteOk = siteValue === "" || /^(https?:\/\/)?[^\s]+\.[^\s]{2,}$/i.test(siteValue);

    if (!String(business.value || "").trim()) fail(business, "err-business", "Add your business name.");
    if (!industry.value) fail(industry, "err-industry", "Pick an industry.");
    if (!String(name.value || "").trim()) fail(name, "err-name", "Add your name.");
    if (!emailOk) fail(email, "err-email", "Add a valid email.");
    if (!checkedFunctions().length) {
      fail(form.querySelector('input[name="features"]'), "err-features", "Pick at least one feature.");
    }
    if (!String(wishes.value || "").trim()) fail(wishes, "err-wishes", "Tell me what you want the site to do.");
    if (!siteOk) fail(website, "err-website", "Use an address like yourshop.com, or leave this blank.");
    if (!budgetField.value) fail(budgetField, "err-budget", "Pick a budget range.");

    if (first && typeof first.focus === "function") first.focus();
    return !first;
  }

  function mailtoHref(data) {
    var functions = checkedFunctions().map(function (input) { return input.value; });
    var lines = [
      "Quote request",
      "",
      "Business: " + (data.get("business") || ""),
      "Industry: " + (data.get("industry") || ""),
      "Name: " + (data.get("name") || ""),
      "Email: " + (data.get("email") || ""),
      "Phone: " + (data.get("phone") || ""),
      "Features: " + functions.join(", "),
      "Current website: " + (data.get("website") || ""),
      "Budget: " + budgetLabel(data.get("budget")),
      "",
      "Wishes:",
      String(data.get("wishes") || ""),
    ];
    return (
      "mailto:" +
      (cfg.email || "hello@web-glowup.com") +
      "?subject=" +
      encodeURIComponent("Quote request — Web Glowup") +
      "&body=" +
      encodeURIComponent(lines.join("\n"))
    );
  }

  function budgetLabel(value) {
    var match = (cfg.budgetChoices || []).filter(function (choice) {
      return choice.value === value;
    })[0];
    return match ? token(match.label) : String(value || "");
  }

  function showStatus(message, type) {
    if (!status) return;
    status.hidden = false;
    status.className = "form-status " + type;
    status.textContent = message;
  }

  function showMailto(data, intro) {
    if (!status) return;
    status.hidden = false;
    status.className = "form-status fallback";
    status.textContent = "";
    var p = document.createElement("p");
    p.textContent = intro || "The form service isn't connected yet. Your request is ready to send by email.";
    var link = document.createElement("a");
    link.className = "button";
    link.href = mailtoHref(data);
    link.textContent = "Email this quote request";
    status.appendChild(p);
    status.appendChild(link);
    link.focus();
  }

  function endpointIsPlaceholder(url) {
    if (!url) return true;
    return /x{4,}|PLATZHALTER|DEIN_FORM/i.test(url);
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    clearErrors();
    if (!validate()) {
      showStatus("Check the fields marked below.", "error");
      return;
    }

    var data = new FormData(form);
    if (String(data.get("_gotcha") || "").trim() !== "") {
      form.reset();
      showStatus("Thanks. I'll be in touch.", "success");
      return;
    }

    var endpoint = String(cfg.formEndpoint || "").trim();
    if (endpointIsPlaceholder(endpoint)) {
      showMailto(data);
      return;
    }

    if (submit) submit.disabled = true;
    form.setAttribute("aria-busy", "true");
    fetch(endpoint, {
      method: "POST",
      body: data,
      headers: { Accept: "application/json" },
    })
      .then(function (response) {
        if (!response.ok) throw new Error("form");
        form.reset();
        showStatus("Thanks. The request is on its way. I'll send the quote myself.", "success");
      })
      .catch(function () {
        showMailto(data, "The form didn't go through. Send the request by email instead.");
      })
      .then(function () {
        if (submit) submit.disabled = false;
        form.removeAttribute("aria-busy");
      });
  });
})();
