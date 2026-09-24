/*
 * ============================================================
 *  TALK SCORECARD - CONFIG FILE
 * ============================================================
 *
 *  This is the ONLY file you need to edit for each speaking gig.
 *  Everything the audience sees comes from here.
 *
 *  A few rules so nothing breaks:
 *   - Keep text inside quotes: "like this"
 *   - If your text has a double quote in it, use single quotes around
 *     it instead: 'The "real" answer'  (or put a backslash: "The \"real\" answer")
 *   - Every item in a list ends with a comma. A trailing comma on the
 *     last item is fine.
 *   - Lines starting with // are comments. The app ignores them.
 *
 *  After editing, open index.html (or your GitHub Pages link) and run
 *  through it once to make sure it looks right.
 * ============================================================
 */

window.SCORECARD_CONFIG = {

  // ----------------------------------------------------------
  //  THE BASICS
  //  These show up on the start screen and on the results card.
  // ----------------------------------------------------------
  talkTitle: "Your Talk Title Goes Here",
  speakerName: "Christopher Hudson",
  eventName: "Event Name 2026",
  eventDate: "October 15, 2026",   // Any format you like. It's shown exactly as typed.
  hashtag: "#YourHashtag",         // Include the #. Leave as "" to hide it.

  // ----------------------------------------------------------
  //  LOGO (optional)
  //  Drop an image file (PNG or SVG) in the same folder as this file
  //  and put its file name here, like "logo.png".
  //  Leave as "" for no logo.
  //
  //  showLogoOnCard: true puts the logo in the top corner of the
  //  results card too. false keeps it on the start screen only.
  // ----------------------------------------------------------
  logo: "",
  showLogoOnCard: false,

  // ----------------------------------------------------------
  //  COLORS
  //  Use hex codes (like "#18324B"). Google "hex color picker" if you
  //  need help finding one that matches your brand.
  // ----------------------------------------------------------
  colors: {
    primary: "#18324B",        // Main brand color: buttons, card header and footer, score number
    highlight: "#F2D44E",      // Pop color: score ring, hashtag, header stripe, progress bar
    accent: "#456A82",         // Supporting color: small labels, softer text, outline buttons
    background: "#F4F4F2",     // Page background on the phone
    cardBackground: "#ffffff", // Background of the middle of the results card and answer buttons
    text: "#18324B",           // Main text color (questions, names)
    buttonText: "#ffffff"      // Text on primary-colored buttons
  },

  // ----------------------------------------------------------
  //  START SCREEN WORDING
  // ----------------------------------------------------------
  intro: {
    heading: "Let's see where you land",
    text: "A few quick questions. Tap an answer to move on. Nothing you enter leaves your phone.",
    startButton: "Let's go"
  },

  // ----------------------------------------------------------
  //  RESULTS CARD WORDING
  // ----------------------------------------------------------
  cardHeadline: "Here are my results!",  // Big text at the top of the card
  scoreLabel: "MY SCORE",                // Small text above the score number

  // Show the person's title/company (if they typed one) under their name?
  showTitleOnCard: true,

  // OPTIONAL: a label based on the score range, shown under the score.
  // Leave the list empty [] to skip labels entirely.
  // "min" is the lowest score that earns that label. Order doesn't matter.
  // Example:
  //   resultLabels: [
  //     { min: 0,  label: "Just Getting Started" },
  //     { min: 10, label: "Building Momentum" },
  //     { min: 16, label: "Leading the Way" }
  //   ],
  resultLabels: [],

  // Suggested post text people can copy with the "Copy caption" button.
  // LinkedIn doesn't let apps pre-fill post text, so this gives them a head start.
  // These placeholders get swapped in automatically:
  //   {score} {max} {talkTitle} {speakerName} {eventName} {hashtag}
  shareCaption: "Just scored {score}/{max} during \"{talkTitle}\" with {speakerName} at {eventName}. {hashtag}",

  // File name for the saved image (no spaces works best).
  fileName: "my-results.png",

  // ----------------------------------------------------------
  //  QUESTIONS
  //  Each question has:
  //    question: the text shown at the top of the screen
  //    options:  the answer buttons. Each one has:
  //                text:   what the button says
  //                points: how many points that answer is worth
  //
  //  The max score is figured out automatically by adding up the
  //  highest-point answer from every question.
  //
  //  Keep answers short (under ~60 characters) so the buttons stay
  //  easy to tap. 3 to 5 options per question feels best on a phone.
  //
  //  To add a question: copy one whole { question: ..., options: [...] },
  //  block (including the comma after it) and paste it below the others.
  // ----------------------------------------------------------
  questions: [
    {
      question: "Placeholder question 1: How often do you do the thing?",
      options: [
        { text: "Never", points: 0 },
        { text: "Once in a while", points: 1 },
        { text: "Most weeks", points: 2 },
        { text: "Every day", points: 3 }
      ]
    },
    {
      question: "Placeholder question 2: How confident do you feel about it?",
      options: [
        { text: "Not at all", points: 0 },
        { text: "A little", points: 1 },
        { text: "Pretty confident", points: 2 },
        { text: "Could teach it", points: 3 }
      ]
    },
    {
      question: "Placeholder question 3: Does your team talk about it?",
      options: [
        { text: "Not really", points: 0 },
        { text: "Sometimes", points: 2 },
        { text: "All the time", points: 4 }
      ]
    },
    {
      question: "Placeholder question 4: Pick the one that sounds most like you.",
      options: [
        { text: "Waiting to see what happens", points: 0 },
        { text: "Curious but cautious", points: 1 },
        { text: "Trying things out", points: 2 },
        { text: "All in", points: 3 }
      ]
    },
    {
      question: "Placeholder question 5: Where do you want to be a year from now?",
      options: [
        { text: "Same place, honestly", points: 0 },
        { text: "A little further along", points: 1 },
        { text: "Way further along", points: 2 },
        { text: "Leading the charge", points: 3 }
      ]
    }
  ]
};
