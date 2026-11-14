# Handoff: publish Safe-to-Share to GitHub Pages

Goal: put this folder in a new public GitHub repo, `sugarboy21codes/safe-to-share`, and serve `index.html` free at https://sugarboy21codes.github.io/safe-to-share/ so anyone can use it without signing in.

Work through the steps in order. Before each step, tell the user in one line what you're about to do and why. Stop and ask if anything fails. Do not guess.

## Step 1: Check the tools
Run `git --version`, `gh --version` and `gh auth status`.
- If `gh` is missing or not signed in, ask the user to install GitHub CLI (https://cli.github.com) and run `gh auth login` themselves. Wait for them to confirm.

## Step 2: Check the files
Confirm this folder holds: `index.html`, `README.md`, `CLAUDE.md`, `HANDOFF.md`, `docs/Safe-to-Share_Sanitizer_Summary.pdf`, and `tests/` (3 scripts and 3 JSON files).
Run `node tests/held-out-final.js` and confirm the first line shows `"recall":95.5` and `"precision":97.7`.

## Step 3: Create the repo and push
```
git init
git add .
git commit -m "Safe-to-Share Data Sanitizer: browser-only PII and secret scrubber with reversible placeholders"
git branch -M main
gh repo create sugarboy21codes/safe-to-share --public --source=. --remote=origin --push --description "Scrub personal data and credentials in your browser before it reaches an AI tool, then restore the real values. Nothing is uploaded."
```
If GitHub push protection blocks the push because a test value looks like a real secret, do NOT bypass it. Show the user the flagged file and line, replace that value with an obviously fake one in the same format, re-run `node tests/dev-set.js` to confirm it still passes, then commit and push again.

## Step 4: Turn on GitHub Pages
```
gh api -X POST repos/sugarboy21codes/safe-to-share/pages -f "source[branch]=main" -f "source[path]=/"
```
If that fails, tell the user to open the repo on github.com, go to Settings, then Pages, set Source to "Deploy from a branch", choose `main` and `/ (root)`, and press Save.

## Step 5: Verify
Wait about 1 minute, then run:
```
gh api repos/sugarboy21codes/safe-to-share/pages --jq .status
```
Repeat until it says `built`. Then ask the user to open https://sugarboy21codes.github.io/safe-to-share/ in a private or incognito window and confirm it loads with no sign-in.

## Step 6: Tidy the repo page
```
gh repo edit sugarboy21codes/safe-to-share --homepage "https://sugarboy21codes.github.io/safe-to-share/" --add-topic privacy --add-topic pii --add-topic data-redaction --add-topic ai-safety --add-topic javascript
```
Then report the two links (repo and live page) back to the user.
