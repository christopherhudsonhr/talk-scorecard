/*
 * Talk Scorecard app. You shouldn't need to edit this file.
 * All the content lives in config.js.
 */
(function () {
  "use strict";

  var C = window.SCORECARD_CONFIG;
  var app = document.getElementById("app");
  var CARD_SIZE = 1200;
  var FONT = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';

  var state = { index: 0, answers: [], name: "", title: "" };

  // ---------- Helpers ----------

  function el(tag, attrs, children) {
    var node = document.createElement(tag);
    Object.keys(attrs || {}).forEach(function (key) {
      if (key === "text") node.textContent = attrs[key];
      else if (key === "class") node.className = attrs[key];
      else if (key.indexOf("on") === 0) node.addEventListener(key.slice(2), attrs[key]);
      else node.setAttribute(key, attrs[key]);
    });
    (children || []).forEach(function (child) { if (child) node.appendChild(child); });
    return node;
  }

  function show(screen) {
    app.innerHTML = "";
    app.appendChild(screen);
    window.scrollTo(0, 0);
  }

  function maxScore() {
    return C.questions.reduce(function (sum, q) {
      return sum + Math.max.apply(null, q.options.map(function (o) { return Number(o.points) || 0; }));
    }, 0);
  }

  function score() {
    return state.answers.reduce(function (sum, optIndex, qIndex) {
      return sum + (Number(C.questions[qIndex].options[optIndex].points) || 0);
    }, 0);
  }

  function resultLabel(points) {
    var match = null;
    (C.resultLabels || []).forEach(function (r) {
      if (points >= r.min && (!match || r.min > match.min)) match = r;
    });
    return match ? match.label : "";
  }

  function fillTemplate(text, values) {
    return String(text || "").replace(/\{(\w+)\}/g, function (all, key) {
      return key in values ? values[key] : all;
    }).replace(/\s+$/, "");
  }

  function loadImage(src) {
    return new Promise(function (resolve) {
      if (!src) return resolve(null);
      var img = new Image();
      img.onload = function () { resolve(img); };
      img.onerror = function () { resolve(null); };
      img.src = src;
    });
  }

  // ---------- Setup ----------

  function checkConfig() {
    var problems = [];
    if (!C) problems.push("config.js didn't load. Check it for a missing comma or quote.");
    else if (!Array.isArray(C.questions) || !C.questions.length) problems.push("config.js has no questions.");
    else C.questions.forEach(function (q, i) {
      if (!q.options || !q.options.length) problems.push("Question " + (i + 1) + " has no options.");
    });
    if (problems.length) {
      show(el("div", { class: "config-error" }, [
        el("h2", { text: "Something's off in config.js" }),
        el("p", { text: problems.join(" ") })
      ]));
      return false;
    }
    return true;
  }

  function applyTheme() {
    var c = C.colors || {};
    var root = document.documentElement.style;
    var map = { primary: "--primary", accent: "--accent", background: "--bg", text: "--text",
                mutedText: "--muted", buttonText: "--button-text", cardBackground: "--surface" };
    Object.keys(map).forEach(function (key) { if (c[key]) root.setProperty(map[key], c[key]); });
    document.title = C.talkTitle || "Talk Scorecard";
  }

  // ---------- Screens ----------

  function introScreen() {
    var intro = C.intro || {};
    show(el("section", { class: "screen" }, [
      C.logo ? el("img", { class: "logo", src: C.logo, alt: "" }) : null,
      el("p", { class: "eyebrow", text: [C.eventName, C.eventDate].filter(Boolean).join(" · ") }),
      el("p", { class: "talk-title", text: C.talkTitle }),
      el("h1", { text: intro.heading || "Let's get started" }),
      el("p", { class: "lead", text: intro.text || "" }),
      el("div", { class: "spacer" }),
      el("button", { class: "btn btn-primary", text: intro.startButton || "Start", onclick: function () {
        state = { index: 0, answers: [], name: state.name, title: state.title };
        questionScreen();
      } })
    ]));
  }

  function questionScreen() {
    var i = state.index;
    var q = C.questions[i];
    var total = C.questions.length;
    var locked = false;

    var options = q.options.map(function (opt, optIndex) {
      var btn = el("button", { class: "option" + (state.answers[i] === optIndex ? " selected" : ""), text: opt.text });
      btn.addEventListener("click", function () {
        if (locked) return;
        locked = true;
        state.answers[i] = optIndex;
        Array.prototype.forEach.call(btn.parentNode.children, function (b) { b.classList.remove("selected"); });
        btn.classList.add("selected");
        // Short pause so they see which one they tapped.
        setTimeout(function () {
          state.index++;
          if (state.index < total) questionScreen(); else detailsScreen();
        }, 220);
      });
      return btn;
    });

    // Set via .style (not a style="" attribute) so the page's security policy allows it.
    var progressFill = el("div", { class: "progress-fill" });
    progressFill.style.width = (i / total) * 100 + "%";

    show(el("section", { class: "screen" }, [
      el("div", { class: "progress-row" }, [
        el("div", { class: "progress" }, [progressFill]),
        el("span", { class: "progress-text", text: (i + 1) + " of " + total })
      ]),
      el("h2", { text: q.question }),
      el("div", { class: "options" }, options),
      el("div", { class: "spacer" }),
      el("button", { class: "btn-link", text: i === 0 ? "Back to start" : "Back", onclick: function () {
        if (i === 0) introScreen(); else { state.index--; questionScreen(); }
      } })
    ]));
  }

  function detailsScreen() {
    var nameInput = el("input", { type: "text", id: "name", maxlength: "40", autocomplete: "given-name",
                                  autocapitalize: "words", enterkeyhint: "next" });
    var titleInput = el("input", { type: "text", id: "title", maxlength: "60", autocomplete: "organization-title",
                                   enterkeyhint: "done" });
    var error = el("p", { class: "error", role: "alert" });
    nameInput.value = state.name;
    titleInput.value = state.title;

    function submit(e) {
      e.preventDefault();
      var name = nameInput.value.trim();
      if (!name) { error.textContent = "Add your first name so it can go on your card."; nameInput.focus(); return; }
      state.name = name;
      state.title = titleInput.value.trim();
      nameInput.blur(); titleInput.blur();
      resultScreen();
    }

    var form = el("form", { class: "screen", novalidate: "novalidate", onsubmit: submit }, [
      el("h2", { text: "Last step. Who's this card for?" }),
      el("div", {}, [el("label", { for: "name", text: "First name" }), nameInput, error]),
      el("div", {}, [
        el("label", { for: "title" }, [
          document.createTextNode("Title / company "),
          el("span", { class: "optional", text: "(optional)" })
        ]),
        titleInput
      ]),
      el("div", { class: "spacer" }),
      el("button", { class: "btn btn-primary", type: "submit", text: "See my results" }),
      el("button", { class: "btn-link", type: "button", text: "Back", onclick: function () {
        state.name = nameInput.value.trim(); state.title = titleInput.value.trim();
        state.index = C.questions.length - 1; questionScreen();
      } })
    ]);
    titleInput.addEventListener("keydown", function (e) { if (e.key === "Enter") submit(e); });
    show(form);
  }

  function resultScreen() {
    var points = score();
    var max = maxScore();
    var preview = el("img", { class: "card-preview", alt: "Your results card" });
    var status = el("p", { class: "status", text: "Making your card..." });
    var shareBtn = el("button", { class: "btn btn-primary", text: "Save / Share", disabled: "disabled" });
    var captionBtn = el("button", { class: "btn btn-secondary", text: "Copy caption" });
    var file = null;
    var objectUrl = null;

    var caption = fillTemplate(C.shareCaption, {
      score: points, max: max, talkTitle: C.talkTitle || "", speakerName: C.speakerName || "",
      eventName: C.eventName || "", hashtag: C.hashtag || ""
    });

    show(el("section", { class: "screen" }, [
      el("h2", { text: "Nice work, " + state.name + "!" }),
      preview,
      el("p", { class: "hint", text: "Tip: you can also press and hold the image to save it." }),
      shareBtn,
      captionBtn,
      status,
      el("button", { class: "btn-link", text: "Start over", onclick: function () {
        if (objectUrl) URL.revokeObjectURL(objectUrl);
        introScreen();
      } })
    ]));

    // Build the PNG right away so the share button can open the share sheet
    // instantly when tapped (iPhones require that).
    drawCard(points, max).then(function (canvas) {
      canvas.toBlob(function (blob) {
        if (!blob) { status.textContent = "Couldn't make the image on this browser. Try a screenshot."; return; }
        file = new File([blob], C.fileName || "my-results.png", { type: "image/png" });
        objectUrl = URL.createObjectURL(blob);
        preview.src = objectUrl;
        shareBtn.removeAttribute("disabled");
        status.textContent = "";
      }, "image/png");
    });

    shareBtn.addEventListener("click", function () {
      if (!file) return;
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        navigator.share({ files: [file], title: C.cardHeadline || "My results" })
          .then(function () { status.textContent = "Shared!"; })
          .catch(function (err) {
            if (err && err.name === "AbortError") return; // they closed the share sheet
            download();
          });
      } else {
        download();
      }
    });

    function download() {
      var a = el("a", { href: objectUrl, download: file.name });
      document.body.appendChild(a);
      a.click();
      a.remove();
      status.textContent = "Downloaded. Check your downloads or photos.";
    }

    captionBtn.addEventListener("click", function () {
      function fallback() {
        var box = el("textarea", { class: "caption-box", readonly: "readonly" });
        box.value = caption;
        captionBtn.replaceWith(box);
        box.focus(); box.select();
        status.textContent = "Press and hold the text to copy it.";
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(caption).then(function () {
          status.textContent = "Caption copied. Paste it into your post.";
        }, fallback);
      } else {
        fallback();
      }
    });
  }

  // ---------- The results card (drawn on a canvas, saved as PNG) ----------

  function setFont(ctx, weight, size) { ctx.font = weight + " " + size + "px " + FONT; }

  // Shrinks text until it fits on one line.
  function fitText(ctx, text, weight, size, minSize, maxWidth) {
    setFont(ctx, weight, size);
    while (size > minSize && ctx.measureText(text).width > maxWidth) {
      size -= 2;
      setFont(ctx, weight, size);
    }
    return size;
  }

  // Splits text into lines that fit, adding "..." if it runs past maxLines.
  function wrapText(ctx, text, maxWidth, maxLines) {
    var words = String(text).split(/\s+/).filter(Boolean);
    var lines = [];
    var line = "";
    words.forEach(function (word) {
      var test = line ? line + " " + word : word;
      if (ctx.measureText(test).width <= maxWidth || !line) line = test;
      else { lines.push(line); line = word; }
    });
    if (line) lines.push(line);
    if (lines.length > maxLines) {
      lines = lines.slice(0, maxLines);
      var last = lines[maxLines - 1];
      while (last && ctx.measureText(last + "…").width > maxWidth) last = last.slice(0, -1);
      lines[maxLines - 1] = last.replace(/\s+$/, "") + "…";
    }
    return lines;
  }

  function drawCard(points, max) {
    var showLogo = C.logo && C.showLogoOnCard;
    return loadImage(showLogo ? C.logo : "").then(function (logo) {
      var S = CARD_SIZE;
      var col = C.colors || {};
      var primary = col.primary || "#1a3c6e";
      var accent = col.accent || "#f2a900";
      var text = col.text || "#1c2430";
      var muted = col.mutedText || "#5b6678";
      var onPrimary = col.buttonText || "#ffffff";
      var pad = 80;
      var inner = S - pad * 2;

      var canvas = document.createElement("canvas");
      canvas.width = S;
      canvas.height = S;
      var ctx = canvas.getContext("2d");
      ctx.textAlign = "center";
      ctx.textBaseline = "alphabetic";

      // Background
      ctx.fillStyle = col.cardBackground || "#ffffff";
      ctx.fillRect(0, 0, S, S);

      // Header band + headline
      ctx.fillStyle = primary;
      ctx.fillRect(0, 0, S, 210);
      ctx.fillStyle = accent;
      ctx.fillRect(0, 210, S, 10);
      if (logo) {
        var lh = 90, lw = Math.min(260, logo.width * (lh / logo.height));
        ctx.drawImage(logo, 40, 40, lw, lw * (logo.height / logo.width));
      }
      ctx.fillStyle = onPrimary;
      fitText(ctx, C.cardHeadline || "Here are my results!", "800", 80, 40, logo ? inner - 240 : inner);
      ctx.fillText(C.cardHeadline || "Here are my results!", S / 2, 138);

      // Name + optional title/company
      var y = 330;
      ctx.fillStyle = text;
      fitText(ctx, state.name, "800", 92, 44, inner);
      ctx.fillText(state.name, S / 2, y);
      if (C.showTitleOnCard !== false && state.title) {
        ctx.fillStyle = muted;
        fitText(ctx, state.title, "500", 38, 24, inner);
        ctx.fillText(state.title, S / 2, y + 60);
      }

      // Score ring
      var cx = S / 2, cy = 610, r = 150;
      var pct = max > 0 ? Math.max(0, Math.min(1, points / max)) : 0;
      ctx.lineWidth = 26;
      ctx.lineCap = "round";
      ctx.strokeStyle = "rgba(0,0,0,0.08)";
      ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.stroke();
      if (pct > 0) {
        ctx.strokeStyle = accent;
        ctx.beginPath(); ctx.arc(cx, cy, r, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * pct); ctx.stroke();
      }
      ctx.fillStyle = muted;
      setFont(ctx, "700", 26);
      ctx.fillText(C.scoreLabel || "MY SCORE", cx, cy - 62);
      ctx.fillStyle = primary;
      fitText(ctx, String(points), "800", 130, 60, r * 1.6);
      ctx.fillText(String(points), cx, cy + 45);
      ctx.fillStyle = muted;
      setFont(ctx, "600", 32);
      ctx.fillText("out of " + max, cx, cy + 95);

      // Optional score-range label
      y = cy + r + 70;
      var label = resultLabel(points);
      if (label) {
        ctx.fillStyle = primary;
        fitText(ctx, label, "800", 50, 28, inner);
        ctx.fillText(label, S / 2, y);
        y += 70;
      } else {
        y += 10;
      }

      // Talk title
      ctx.fillStyle = muted;
      setFont(ctx, "700", 24);
      ctx.fillText("FROM THE TALK", S / 2, y);
      ctx.fillStyle = text;
      setFont(ctx, "700", 42);
      wrapText(ctx, C.talkTitle || "", inner, label ? 1 : 2).forEach(function (line, n) {
        ctx.fillText(line, S / 2, y + 56 + n * 52);
      });

      // Footer band: speaker · event · date, then hashtag
      var fy = 1070;
      ctx.fillStyle = primary;
      ctx.fillRect(0, fy, S, S - fy);
      var footer = [C.speakerName, C.eventName, C.eventDate].filter(Boolean).join("  ·  ");
      ctx.fillStyle = onPrimary;
      fitText(ctx, footer, "600", 32, 20, inner);
      ctx.fillText(footer, S / 2, C.hashtag ? fy + 55 : fy + 75);
      if (C.hashtag) {
        ctx.fillStyle = accent;
        fitText(ctx, C.hashtag, "800", 34, 20, inner);
        ctx.fillText(C.hashtag, S / 2, fy + 102);
      }

      return canvas;
    });
  }

  // ---------- Go ----------

  if (checkConfig()) {
    applyTheme();
    introScreen();
  }
})();
