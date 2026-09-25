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
  talkTitle: "The Transformative AI Adoption Playbook HR Actually Needs",
  speakerName: "Christopher Hudson",
  speakerCredentials: "SHRM-SCP, Associate CIPD",  // Shown after your name on the card. "" to hide.
  eventName: "HR Tampa Annual Conference and Expo",
  eventDate: "October 2, 2026",    // Any format you like. It's shown exactly as typed.
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
    text: "A few quick questions. Tap an answer to move on.",
    // Privacy note shown in a box above the start button. Leave as "" to hide it.
    disclaimer: "Nothing you enter is saved permanently in this application. No data is collected.",
    startButton: "Let's go"
  },

  // ----------------------------------------------------------
  //  "ARE YOU AT THE RIGHT TALK?" SCREEN
  //  Shows your title slide so people can confirm they're in the
  //  right room. Export your title slide as a JPEG, drop it in the
  //  same folder as this file, and put its file name below.
  //  Leave titleSlide as "" to skip this screen.
  // ----------------------------------------------------------
  rightTalk: {
    titleSlide: "title-slide.jpg",
    heading: "Are you at the right talk?",
    yesButton: "Yes, that's the one",
    noButton: "No, wrong talk",
    // Shown if they tap the "No" button.
    wrongTalkHeading: "Oops, different session",
    wrongTalkText: "Looks like you scanned a code for a different talk. Check the room number or ask the event staff."
  },

  // ----------------------------------------------------------
  //  UNLOCK CODE SCREEN
  //  People wait here until you show the code on a slide. Once they
  //  type it in, the questions start.
  //   - The code can be any length. Capitals and spaces don't matter,
  //     so "AIADOPT", "aiadopt" and "ai adopt" all work.
  //   - Leave code as "" to skip this screen.
  //   - Heads up: anyone who digs into this file can see the code.
  //     It keeps people in step with you, not out of the app.
  // ----------------------------------------------------------
  unlock: {
    code: "AIADOPT",
    heading: "Welcome! You're in the right place.",
    text: "Hang tight until Christopher gives you the code.",
    placeholder: "Enter code",
    button: "Start",
    wrongCodeText: "That's not quite it. Check the slide and try again."
  },

  // ----------------------------------------------------------
  //  RESULTS CARD WORDING
  // ----------------------------------------------------------
  cardHeadline: "Here are my results!",  // Big text in the header bar at the top of the card
  stageLabel: "MY STAGE",                // Small text above the stage name inside the circle

  // Show the person's title/company (if they typed one) under their name?
  showTitleOnCard: true,

  // Show the number score as small text inside the circle, like "12 of 16 points"?
  // false keeps the card to just the stage. People always see their score
  // privately on the results screen either way.
  showScoreOnCard: false,

  // ----------------------------------------------------------
  //  STAGES
  //  Instead of a raw number, the card shows which stage someone landed in.
  //  Each stage has:
  //    name:        short, shows big inside the circle (one or two words is best)
  //    description: one short line shown under the circle
  //    min / max:   the lowest and highest score that lands in this stage
  //
  //  You can have as many stages as you like (2 to 5 feels right).
  //
  //  THE RANGES HAVE TO COVER EVERY POSSIBLE SCORE, with no gaps and no
  //  overlaps. The easy way to get it right:
  //    1. Work out the lowest possible score (add up the lowest-point answer
  //       from every question) and the highest (add up the highest-point
  //       answers). With the sample questions below that's 0 to 16.
  //    2. The first stage's min is the lowest score. The last stage's max is
  //       the highest score.
  //    3. Each stage's min is exactly 1 more than the stage before it's max.
  //       (0-4, then 5-8, then 9-12... never 0-4 then 6-8, never 0-4 then 4-8.)
  //
  //  Points need to be whole numbers for this to work.
  //
  //  If something doesn't line up, the app shows a message on screen saying
  //  exactly which numbers to fix, so you'll know before anyone scans the code.
  //  Always open the link once after changing questions or stages.
  // ----------------------------------------------------------
  stages: [
    { name: "Curious",   min: 0,  max: 4,  description: "Watching AI closely and ready to take a first step." },
    { name: "Exploring", min: 5,  max: 8,  description: "Trying AI in pockets and learning what works." },
    { name: "Building",  min: 9,  max: 12, description: "Turning early wins into real momentum." },
    { name: "Leading",   min: 13, max: 16, description: "Setting the pace for how HR adopts AI." }
  ],

  // Post text that's filled in when someone taps "Open LinkedIn" on a computer.
  // These placeholders get swapped in automatically:
  //   {stage} {talkTitle} {speakerName} {eventName} {hashtag}
  //   {score} {max}  (only use these if you want the number public)
  shareCaption: "I landed in the {stage} stage during \"{talkTitle}\" with {speakerName} at {eventName}. {hashtag}",

  // ----------------------------------------------------------
  //  STAY CONNECTED (buttons on the results screen)
  //  Leave a link or email as "" to hide that button.
  // ----------------------------------------------------------
  connect: {
    linkedInUrl: "https://www.linkedin.com/in/christopherhudsonhr/",
    linkedInButton: "Connect with Christopher",
    websiteUrl: "https://hrsoul.com/",
    websiteButton: "Connect with HR Soul",
    email: "christopherhudsonhr@gmail.com",   // Where feedback emails go
    feedbackButton: "Give Feedback to Christopher"
  },

  // ----------------------------------------------------------
  //  FEEDBACK SCREEN
  //  "Email Christopher" opens the person's own email app with a new
  //  message to the address above. The subject is the talk title and
  //  the body is whatever they typed. Nothing is sent until they hit
  //  send in their email app.
  // ----------------------------------------------------------
  feedback: {
    heading: "Feedback for Christopher",
    intro: "What landed? What would you like to hear more about? Every note gets read.",
    placeholder: "Type your feedback here",
    attachReminder: "Don't forget to attach your results!",  // Shown right above the email button
    emailButton: "Email Christopher",
    backButton: "Back to my results",
    emptyError: "Type a few words first, then tap the button again."
  },

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
