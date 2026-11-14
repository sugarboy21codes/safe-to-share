# Safe-to-Share Data Sanitizer

Strip names, contact details, IDs and credentials out of text or a spreadsheet before you paste it into ChatGPT, Claude, a vendor ticket or an email. Then put the real values back into the answer you get.

Everything runs inside your web browser. Nothing you paste is uploaded, stored on a server or sent to an AI model.

**Live demo:** https://sugarboy21codes.github.io/safe-to-share/ (no sign-in needed)

---

## The problem

People want to use AI on real work: a customer complaint, a support log, a CSV export. That work is full of personal and confidential data. Pasting it into an outside AI tool can break privacy rules (PIPEDA in Canada, GDPR in Europe) and company policy, and it leaks credentials that should never leave the building.

Deleting the sensitive parts by hand is slow and easy to get wrong. Blacking them out makes the text useless, because the AI can no longer tell one customer from another.

## What it does

| Before | After |
|---|---|
| Priya Raman (priya.raman@northwind.com) says Daniel Okafor was charged twice on 4111 1111 1111 1111. | [PERSON_A] ([EMAIL_1]) says [PERSON_B] was charged twice on [CARD_1]. |

1. **Replaces** each sensitive value with a placeholder. The same value always gets the same placeholder, so the AI can still follow who did what.
2. **Restores** the real values when you paste the AI's reply back in, even if the AI drops the brackets or changes the case (PERSON_B, Person_b).
3. **Handles spreadsheets.** Upload a CSV. Columns such as `email` or `full_name` are replaced as a whole, free-text columns are scanned cell by cell, and you download a clean copy.

## How to use it

1. Open the live demo. It starts with a sample support ticket so you can see it working.
2. **Text tab:** paste your text on the left. The safe version appears on the right as you type. Black labels are personal data and red labels are credentials. Click any label to keep that value if it isn't sensitive.
3. Press **Copy** and paste the safe version into your AI tool.
4. **Restore tab:** paste the AI's answer on the left. The real names and values come back on the right.
5. **CSV tab:** drop in a file, check how each column will be handled, then download the safe file.
6. **Rules tab:** add your own patterns (for example an internal ticket format), terms that must always be hidden (client or project names), and terms that are safe to share.

**Session key.** The Restore tab can save a key file that maps every placeholder back to its real value. That file contains the sensitive data, so keep it inside your organization.

## What it detects

| Category | Examples | How |
|---|---|---|
| Credentials | OpenAI, Anthropic, AWS, Stripe, GitHub, Slack and Google API keys; JWTs and bearer tokens; passwords in config files, URLs and database connection strings; private key blocks | Known key formats plus "password=" and "token:" style assignments |
| Financial | Payment cards, IBANs | Format check plus checksum (Luhn for cards, mod-97 for IBANs), which cuts false alarms |
| Government IDs | Canadian SINs, US SSNs | Format check; SINs are also checksum-verified |
| Contact | Emails, phone numbers (North American and international), street addresses, Canadian postal codes | Pattern rules |
| Identifiers | Customer, account, order and invoice IDs; IP addresses; labelled dates of birth | Pattern rules |
| People | Full names | About 14,700 first names from many countries, cues such as "From:", "Dr." or "spoke with", and names hidden inside email addresses |

## How well it works

The tool was tested on labelled examples: sentences where every sensitive value is known in advance, so each miss and each false alarm can be counted.

**Final result on a fresh test set** (314 sensitive values in 260 short documents, with names drawn from an independent dataset covering 40 countries). No rules were changed after seeing this set.

| Measure | Result |
|---|---|
| Sensitive values caught | **95.5%** (300 of 314) |
| Structured data and credentials caught | **100%** (149 of 149) |
| Names caught | **91.5%** (151 of 165) |
| Flags that were correct (precision) | **93.5%** (300 of 321) when first scored; **97.7%** (300 of 307) in the shipped code |

**One change after final scoring.** Well-known company names that start with a first name (for example Ernst, Deloitte, Accenture) were added to an exclusion list after the final test. That removed 14 false flags and changed no catches, so precision rose from 93.5% to 97.7%. Both figures are shown so the history is clear.

**How it improved.** An early version caught 85% of items in a first test. A second test, using names from a separate source, exposed weak spots: international phone formats, names in lists, possessives, and company names mistaken for people. Those were fixed as general rules, not by adding the test names. The fixes were then scored once on the untouched third set shown above.

**Known gaps**
- Names with no cue nearby can be missed, for example "Can someone loop in Talal Hijazi?".
- Some place and company names can be flagged as people, for example the "John" in "Saint John". Use the Never replace list for names like these that come up often in your data.
- These tests use short sentences written for testing. Real documents will vary, so treat the numbers as an internal benchmark, not an audited rate.

## Privacy design

- **No server.** The whole tool is one web page. Your text is processed by code running on your own device.
- **No AI model sees raw data.** Detection uses rules and word lists, not an outside AI service.
- **No tracking.** No analytics, no cookies and no outside fonts or scripts. You can confirm this in your browser's network panel.
- **Your settings stay local.** Custom rules are saved in your own browser only.

## Roadmap

1. Run a small name-recognition AI model inside the browser (with Transformers.js) to close the name gap without sending data anywhere.
2. Release a browser extension that cleans text automatically before it is pasted into ChatGPT or Claude.
3. Offer an API version that sits between a company network and outside AI tools.
4. Score against a public labelled privacy dataset for an independent benchmark.

## Re-run the tests

The tests need Node.js. From the project folder:

```
node tests/held-out-final.js   # final score on the untouched set
node tests/held-out-1.js       # second test set, used to find gaps
node tests/dev-set.js          # first test set, used while building
```

Test names come from the open `names-dataset` Python package. All other test values are fictional: standard test card numbers, documentation example keys and 555 phone numbers.

## Built with

- Plain JavaScript, HTML and CSS in a single file, with no backend and no outside libraries
- Built using AI-assisted development with Claude: scoped, specified, tested and benchmarked by the author

**Author:** Temitomiwa Adesina. Personal proof-of-concept project.
