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

  var state = { index: 0, answers: [], name: "", title: "", unlocked: false };

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

  // Lowest and highest scores anyone can get with the questions in config.js.
  function scoreRange() {
    return C.questions.reduce(function (range, q) {
      var pts = q.options.map(function (o) { return Number(o.points) || 0; });
      return { min: range.min + Math.min.apply(null, pts), max: range.max + Math.max.apply(null, pts) };
    }, { min: 0, max: 0 });
  }

  function score() {
    return state.answers.reduce(function (sum, optIndex, qIndex) {
      return sum + (Number(C.questions[qIndex].options[optIndex].points) || 0);
    }, 0);
  }

  function sortedStages() {
    return C.stages.slice().sort(function (a, b) { return a.min - b.min; });
  }

  function stageFor(points) {
    var stages = sortedStages();
    for (var i = 0; i < stages.length; i++) {
      if (points >= stages[i].min && points <= stages[i].max) return { stage: stages[i], index: i, count: stages.length };
    }
    return null;
  }

  function isWhole(n) { return typeof n === "number" && Math.floor(n) === n; }

  // Checks that the stages cover every possible score with no gaps or overlaps,
  // and explains in plain words how to fix anything that's off.
  function stageProblems() {
    var problems = [];
    if (!Array.isArray(C.stages) || !C.stages.length) return ["Add at least one stage to the stages list."];

    C.questions.forEach(function (q, i) {
      q.options.forEach(function (o) {
        if (!isWhole(Number(o.points))) {
          problems.push("Question " + (i + 1) + ', answer "' + o.text + '" is worth ' + o.points + " points. Points need to be whole numbers.");
        }
      });
    });
    C.stages.forEach(function (st, i) {
      var label = st.name ? '"' + st.name + '"' : "Stage " + (i + 1);
      if (!st.name) problems.push("Stage " + (i + 1) + " needs a name.");
      if (!isWhole(st.min) || !isWhole(st.max)) problems.push(label + " needs a whole-number min and max.");
      else if (st.min > st.max) problems.push(label + " has a min (" + st.min + ") bigger than its max (" + st.max + ").");
    });
    if (problems.length) return problems;

    var range = scoreRange();
    var stages = sortedStages();
    var first = stages[0], last = stages[stages.length - 1];
    if (first.min > range.min) {
      problems.push("The lowest possible score is " + range.min + ', but the first stage starts at ' + first.min +
        '. Set "' + first.name + '" min to ' + range.min + ".");
    }
    if (last.max < range.max) {
      problems.push("The highest possible score is " + range.max + ', but the last stage ends at ' + last.max +
        '. Set "' + last.name + '" max to ' + range.max + ".");
    }
    for (var i = 1; i < stages.length; i++) {
      var prev = stages[i - 1], cur = stages[i];
      if (cur.min > prev.max + 1) {
        var missing = cur.min - 1 === prev.max + 1 ? "Score " + (prev.max + 1) + " doesn't" : "Scores " + (prev.max + 1) + " to " + (cur.min - 1) + " don't";
        problems.push(missing + ' land in any stage. "' + prev.name +
          '" ends at ' + prev.max + ' and "' + cur.name + '" starts at ' + cur.min + '. Set "' + cur.name + '" min to ' + (prev.max + 1) + ".");
      } else if (cur.min <= prev.max) {
        problems.push('"' + prev.name + '" (' + prev.min + " to " + prev.max + ') and "' + cur.name + '" (' + cur.min + " to " + cur.max +
          ') overlap. Set "' + cur.name + '" min to ' + (prev.max + 1) + ".");
      }
    }
    stages.forEach(function (st) {
      if (st.max < range.min || st.min > range.max) {
        problems.push('Nobody can land in "' + st.name + '" (' + st.min + " to " + st.max + "). Possible scores run from " +
          range.min + " to " + range.max + ".");
      }
    });
    return problems;
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
    if (!problems.length) problems = stageProblems();
    if (problems.length) {
      show(el("div", { class: "config-error" }, [
        el("h2", { text: "Something's off in config.js" }),
        el("ul", {}, problems.map(function (p) { return el("li", { text: p }); }))
      ]));
      return false;
    }
    return true;
  }

  function applyTheme() {
    var c = C.colors || {};
    var root = document.documentElement.style;
    var map = { primary: "--primary", highlight: "--highlight", accent: "--accent", background: "--bg",
                text: "--text", buttonText: "--button-text", cardBackground: "--surface" };
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
      intro.disclaimer ? el("p", { class: "disclaimer", text: intro.disclaimer }) : null,
      el("button", { class: "btn btn-primary", text: intro.startButton || "Start", onclick: function () {
        state = { index: 0, answers: [], name: state.name, title: state.title, unlocked: state.unlocked };
        // Once someone has unlocked, "Start over" takes them straight back to the questions.
        if (state.unlocked) questionScreen();
        else if (C.rightTalk && C.rightTalk.titleSlide) rightTalkScreen();
        else unlockScreen();
      } })
    ]));
  }

  function rightTalkScreen() {
    var rt = C.rightTalk;
    show(el("section", { class: "screen" }, [
      el("h2", { text: rt.heading || "Are you at the right talk?" }),
      el("img", { class: "title-slide", src: rt.titleSlide, alt: "Title slide: " + (C.talkTitle || "") }),
      el("div", { class: "spacer" }),
      el("button", { class: "btn btn-primary", text: rt.yesButton || "Yes", onclick: unlockScreen }),
      el("button", { class: "btn btn-secondary", text: rt.noButton || "No", onclick: wrongTalkScreen }),
      el("button", { class: "btn-link", text: "Back", onclick: introScreen })
    ]));
  }

  function wrongTalkScreen() {
    var rt = C.rightTalk;
    show(el("section", { class: "screen" }, [
      el("h2", { text: rt.wrongTalkHeading || "Different session" }),
      el("p", { class: "lead", text: rt.wrongTalkText || "" }),
      el("div", { class: "spacer" }),
      el("button", { class: "btn btn-secondary", text: "Back", onclick: rightTalkScreen })
    ]));
  }

  function normalizeCode(value) {
    return String(value || "").replace(/\s+/g, "").toUpperCase();
  }

  function unlockScreen() {
    var u = C.unlock || {};
    if (!normalizeCode(u.code)) { state.unlocked = true; questionScreen(); return; }

    var input = el("input", { type: "text", id: "code", class: "code-input", placeholder: u.placeholder || "Enter code",
                              autocomplete: "off", autocapitalize: "characters", autocorrect: "off",
                              spellcheck: "false", enterkeyhint: "go", "aria-label": u.placeholder || "Enter code" });
    var error = el("p", { class: "error", role: "alert" });

    function submit(e) {
      e.preventDefault();
      if (normalizeCode(input.value) === normalizeCode(u.code)) {
        input.blur();
        state.unlocked = true;
        questionScreen();
      } else {
        error.textContent = u.wrongCodeText || "That's not it. Try again.";
        input.select();
      }
    }

    show(el("form", { class: "screen", novalidate: "novalidate", onsubmit: submit }, [
      el("h2", { text: u.heading || "Welcome!" }),
      el("p", { class: "lead", text: u.text || "" }),
      el("div", {}, [input, error]),
      el("div", { class: "spacer" }),
      el("button", { class: "btn btn-primary", type: "submit", text: u.button || "Start" }),
      el("button", { class: "btn-link", type: "button", text: "Back", onclick: function () {
        if (C.rightTalk && C.rightTalk.titleSlide) rightTalkScreen(); else introScreen();
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

  // Touchscreen laptops count as computers here, so they get a plain download.
  function isPhoneOrTablet() {
    if (navigator.userAgentData && navigator.userAgentData.mobile) return true;
    var ua = navigator.userAgent || "";
    if (/Android|iPhone|iPad|iPod|Mobile/i.test(ua)) return true;
    // iPads ask for the desktop site by default and pretend to be a Mac.
    return /Macintosh/.test(ua) && navigator.maxTouchPoints > 1;
  }

  function resultScreen() {
    var points = score();
    var range = scoreRange();
    var result = stageFor(points);
    // Phones and tablets get the share sheet. Computers get a plain download,
    // since the Windows/Mac share window doesn't list LinkedIn.
    var isPhone = isPhoneOrTablet();
    var preview = el("img", { class: "card-preview", alt: "Your results card" });
    var status = el("p", { class: "status", text: "Making your card..." });
    var mainBtn = el("button", { class: "btn btn-primary", disabled: "disabled",
                                 text: isPhone ? "Save / Share" : "Download image" });
    var saveBtn = isPhone ? el("button", { class: "btn btn-secondary", disabled: "disabled", text: "Save to my phone" }) : null;
    var captionBtn = el("button", { class: "btn btn-secondary", text: "Copy caption" });
    var file = null;
    var objectUrl = null;

    var caption = fillTemplate(C.shareCaption, {
      stage: result.stage.name, score: points, max: range.max, talkTitle: C.talkTitle || "", speakerName: C.speakerName || "",
      eventName: C.eventName || "", hashtag: C.hashtag || ""
    });

    // Opens a new LinkedIn post (caption filled in through the link) and copies the
    // card image to the clipboard so it can be pasted in with Ctrl+V. Browsers don't
    // let a website attach a file to another website's post, so this is the closest we get.
    var linkedInUrl = "https://www.linkedin.com/feed/?shareActive=true&text=" + encodeURIComponent(caption);
    var linkedInBtn = isPhone ? null : el("a", {
      class: "btn btn-secondary", target: "_blank", rel: "noopener noreferrer",
      href: linkedInUrl, text: "Open LinkedIn", onclick: openLinkedIn
    });

    show(el("section", { class: "screen" }, [
      el("h2", { text: "Nice work, " + state.name + "!" }),
      privateScore(points, range, result),
      preview,
      el("p", { class: "hint", text: isPhone
        ? "Tip: you can also press and hold the image to save it."
        : "Open LinkedIn copies your card. In the new post, press Ctrl+V (Cmd+V on a Mac) to add it." }),
      mainBtn,
      saveBtn,
      linkedInBtn,
      captionBtn,
      status,
      el("button", { class: "btn-link", text: "Start over", onclick: function () {
        if (objectUrl) URL.revokeObjectURL(objectUrl);
        introScreen();
      } })
    ]));

    // Build the PNG right away so the share button can open the share sheet
    // instantly when tapped (iPhones require that).
    drawCard(points, range, result).then(function (canvas) {
      canvas.toBlob(function (blob) {
        if (!blob) { status.textContent = "Couldn't make the image on this browser. Try a screenshot."; return; }
        file = new File([blob], C.fileName || "my-results.png", { type: "image/png" });
        objectUrl = URL.createObjectURL(blob);
        preview.src = objectUrl;
        mainBtn.removeAttribute("disabled");
        if (saveBtn) saveBtn.removeAttribute("disabled");
        status.textContent = "";
      }, "image/png");
    });

    mainBtn.addEventListener("click", function () {
      if (!file) return;
      if (isPhone && navigator.canShare && navigator.canShare({ files: [file] })) {
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
    if (saveBtn) saveBtn.addEventListener("click", function () { if (file) download(); });

    function download() {
      var a = el("a", { href: objectUrl, download: file.name });
      document.body.appendChild(a);
      a.click();
      a.remove();
      status.textContent = isPhone
        ? "Saved to your Downloads. It should show up in your photos app too."
        : "Downloaded. Look in your Downloads folder.";
    }

    function openLinkedIn(e) {
      if (!file || !navigator.clipboard || !navigator.clipboard.write || !window.ClipboardItem) {
        status.textContent = "In LinkedIn, click the photo button and pick " + (file ? file.name : "the image") + " from your Downloads.";
        if (file) download();
        return; // let the link open LinkedIn as normal
      }
      // Copy first, then open the tab. The copy fails if this page loses focus first.
      e.preventDefault();
      function open() {
        var tab = window.open(linkedInUrl, "_blank");
        if (tab) tab.opener = null;
      }
      navigator.clipboard.write([new ClipboardItem({ "image/png": file })]).then(function () {
        status.textContent = "Card copied. In the LinkedIn post, press Ctrl+V (Cmd+V on a Mac) to add it.";
        open();
      }, function () {
        download();
        status.textContent = "In LinkedIn, click the photo button and pick " + file.name + " from your Downloads.";
        open();
      });
    }

    function copyCaption(quiet) {
      function fallback() {
        if (quiet) return;
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
    }
    captionBtn.addEventListener("click", function () { copyCaption(false); });
  }

  // The full score, shown only on this screen. The card shows the stage.
  function privateScore(points, range, result) {
    var list = sortedStages().map(function (st, i) {
      return el("li", { class: i === result.index ? "current" : "" }, [
        el("span", { text: st.name }),
        el("span", { class: "range", text: st.min + " to " + st.max })
      ]);
    });
    return el("div", { class: "private-score" }, [
      el("p", { class: "eyebrow", text: "Just for you" }),
      el("p", { class: "private-line", text: "You scored " + points + " out of " + range.max + " points." }),
      el("p", { class: "private-stage", text: "That puts you in the " + result.stage.name + " stage. " + (result.stage.description || "") }),
      el("ul", { class: "stage-list" }, list),
      C.showScoreOnCard ? null : el("p", { class: "hint", text: "Only you see your number. Your card shows your stage." })
    ]);
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

  // If text wraps onto exactly two lines, split it so both lines are about the
  // same width instead of leaving one word hanging on the second line.
  function balanceLines(ctx, lines, maxWidth) {
    if (lines.length !== 2 || /…$/.test(lines[1])) return lines;
    var words = (lines[0] + " " + lines[1]).split(" ");
    var best = lines, bestWidth = Infinity;
    for (var i = 1; i < words.length; i++) {
      var a = words.slice(0, i).join(" "), b = words.slice(i).join(" ");
      var w = Math.max(ctx.measureText(a).width, ctx.measureText(b).width);
      if (w <= maxWidth && w < bestWidth) { best = [a, b]; bestWidth = w; }
    }
    return best;
  }

  function drawCard(points, range, result) {
    var showLogo = C.logo && C.showLogoOnCard;
    return loadImage(showLogo ? C.logo : "").then(function (logo) {
      var S = CARD_SIZE;
      var col = C.colors || {};
      var primary = col.primary || "#18324B";
      var highlight = col.highlight || "#F2D44E";
      var text = col.text || "#1c2430";
      var accent = col.accent || "#456A82";
      var onPrimary = col.buttonText || "#ffffff";
      var inner = S - 160;
      var headerH = 190;
      var stage = result.stage;

      var canvas = document.createElement("canvas");
      canvas.width = S;
      canvas.height = S;
      var ctx = canvas.getContext("2d");
      ctx.textAlign = "center";
      ctx.textBaseline = "alphabetic";

      // Background
      ctx.fillStyle = col.cardBackground || "#ffffff";
      ctx.fillRect(0, 0, S, S);

      // 1. Header bar + headline, with the yellow line under it
      var headline = C.cardHeadline || "Here are my results!";
      ctx.fillStyle = primary;
      ctx.fillRect(0, 0, S, headerH);
      ctx.fillStyle = highlight;
      ctx.fillRect(0, headerH, S, 10);
      if (logo) {
        var lw = Math.min(240, logo.width * (80 / logo.height));
        ctx.drawImage(logo, 40, 40, lw, lw * (logo.height / logo.width));
      }
      ctx.fillStyle = onPrimary;
      fitText(ctx, headline, "800", 76, 40, logo ? inner - 240 : inner);
      ctx.fillText(headline, S / 2, 124);

      // 5. Footer (drawn first so we know how much room is left in the middle):
      //    speaker + credentials, event · date, hashtag. It sizes itself to its lines.
      var speaker = [C.speakerName, C.speakerCredentials].filter(Boolean).join(", ");
      var footerLines = [
        { text: speaker, weight: "700", size: 34, color: onPrimary },
        { text: [C.eventName, C.eventDate].filter(Boolean).join("  ·  "), weight: "500", size: 28, color: onPrimary },
        { text: C.hashtag, weight: "800", size: 32, color: highlight }
      ].filter(function (line) { return line.text; });
      var lineH = 44, footPad = 30;
      var fy = S - footPad * 2 - footerLines.length * lineH;
      ctx.fillStyle = primary;
      ctx.fillRect(0, fy, S, S - fy);
      footerLines.forEach(function (line, n) {
        ctx.fillStyle = line.color;
        fitText(ctx, line.text, line.weight, line.size, 18, inner);
        ctx.fillText(line.text, S / 2, fy + footPad + (n + 1) * lineH - 10);
      });

      // Middle section: stacked blocks, centered between the yellow line and the footer.
      setFont(ctx, "700", 40);
      var titleLines = balanceLines(ctx, wrapText(ctx, C.talkTitle || "", inner, 2), inner);
      var company = C.showTitleOnCard !== false ? state.title : "";
      var r = 150;
      var blocks = [
        // 2. Talk label + title
        { h: 20, gap: 18, draw: function (y) {
          ctx.fillStyle = accent; setFont(ctx, "700", 24);
          ctx.fillText("FROM THE TALK", S / 2, y + 18);
        } },
        { h: titleLines.length * 50 - 20, gap: 50, draw: function (y) {
          ctx.fillStyle = text; setFont(ctx, "700", 40);
          titleLines.forEach(function (line, n) { ctx.fillText(line, S / 2, y + 29 + n * 50); });
        } },
        // 3. Name + company
        { h: 58, gap: company ? 18 : 44, draw: function (y) {
          ctx.fillStyle = text; fitText(ctx, state.name, "800", 80, 40, inner);
          ctx.fillText(state.name, S / 2, y + 58);
        } },
        company ? { h: 26, gap: 44, draw: function (y) {
          ctx.fillStyle = accent; fitText(ctx, company, "500", 34, 22, inner);
          ctx.fillText(company, S / 2, y + 26);
        } } : null,
        // 4. Stage circle + one-line description
        { h: r * 2 + 20, gap: 40, draw: function (y) { drawStageCircle(ctx, S / 2, y + r + 10, r); } },
        stage.description ? { h: 22, gap: 0, draw: function (y) {
          ctx.fillStyle = text; fitText(ctx, stage.description, "600", 32, 20, inner);
          var line = wrapText(ctx, stage.description, inner, 1)[0];
          ctx.fillText(line, S / 2, y + 23);
        } } : null
      ].filter(Boolean);
      var total = blocks.reduce(function (sum, b, i) { return sum + b.h + (i < blocks.length - 1 ? b.gap : 0); }, 0);
      var y = headerH + 10 + Math.max(24, (fy - headerH - 10 - total) / 2);
      blocks.forEach(function (b) { b.draw(y); y += b.h + b.gap; });

      function drawStageCircle(ctx, cx, cy, r) {
        // The ring fills by stage: first stage is a small slice, top stage is a full circle.
        var pct = (result.index + 1) / result.count;
        ctx.lineWidth = 20;
        ctx.lineCap = "round";
        ctx.strokeStyle = "rgba(0,0,0,0.08)";
        ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.stroke();
        ctx.strokeStyle = highlight;
        ctx.beginPath();
        if (pct >= 1) ctx.arc(cx, cy, r, 0, Math.PI * 2);
        else ctx.arc(cx, cy, r, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * pct);
        ctx.stroke();

        // Stage name: as big as fits, on up to two lines.
        var maxW = r * 2 - 70, size = 56, lines;
        for (; size >= 26; size -= 2) {
          setFont(ctx, "800", size);
          lines = wrapText(ctx, stage.name, maxW, 99);
          if (lines.length <= 2 && lines.every(function (l) { return ctx.measureText(l).width <= maxW; })) break;
        }
        lines = balanceLines(ctx, lines.slice(0, 2), maxW);
        var nameLh = Math.round(size * 1.1);
        var showScore = !!C.showScoreOnCard;
        var h = 16 + 16 + size * 0.72 + (lines.length - 1) * nameLh + (showScore ? 18 + 18 : 0);
        var top = cy - h / 2;

        ctx.fillStyle = accent; setFont(ctx, "700", 22);
        ctx.fillText(C.stageLabel || "MY STAGE", cx, top + 16);
        var base = top + 16 + 16 + size * 0.72;
        ctx.fillStyle = primary; setFont(ctx, "800", size);
        lines.forEach(function (l, n) { ctx.fillText(l, cx, base + n * nameLh); });
        if (showScore) {
          ctx.fillStyle = accent; setFont(ctx, "600", 24);
          ctx.fillText(points + " of " + range.max + " points", cx, base + (lines.length - 1) * nameLh + 18 + 18);
        }
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
