# Talk Scorecard

A little phone-friendly quiz for live audiences. People answer a few questions, type their name, and get a branded 1200x1200 results card they can share to LinkedIn or save to their photos.

Plain HTML, CSS, and JavaScript. No backend, no analytics, no cookies. Everything runs on the attendee's phone, and the page's security policy blocks it from sending data anywhere.

## Files

| File | What it is |
| --- | --- |
| `config.js` | **The only file you edit per gig.** Talk title, event, date, hashtag, colors, logo, questions, scoring. |
| `title-slide.jpg` | Your title slide, shown on the "Are you at the right talk?" screen. |
| `index.html` | The page. |
| `app.js` | The app logic and the card drawing. |
| `styles.css` | How it looks on the phone. |

## Setting up for a new talk

1. Open `config.js` and update the basics, colors, and questions. The comments in the file walk through each part.
2. Export your title slide as a JPEG, save it next to `config.js` (replacing `title-slide.jpg`), and set a new unlock code under `unlock` in `config.js`.
3. If you want a logo, drop the image file next to `config.js` and put its file name in `logo`.
4. Commit and push. GitHub Pages updates in a minute or two.

## Turning on GitHub Pages

1. On GitHub, go to the repo's **Settings > Pages**.
2. Under **Build and deployment**, pick **Deploy from a branch**.
3. Choose the branch (`main` once this is merged) and the `/ (root)` folder, then **Save**.
4. After a minute or two your link shows up at the top of that page, something like `https://<your-username>.github.io/talk-scorecard/`.

## Trying it on your computer

Open `index.html` in a browser, or run `python3 -m http.server` in this folder and go to `http://localhost:8000`. Sharing only works on phones (and some desktop browsers), so on a computer the button just downloads the PNG.
