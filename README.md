![Black Friday Deal Finder](https://make.fun/badge/black-friday-deal-finder-01.svg)
![Rank](https://make.fun/badge/black-friday-deal-finder-01/Akhmad045/black-friday-deal-finder/rank.svg)
![Reward](https://make.fun/badge/black-friday-deal-finder-01/Akhmad045/black-friday-deal-finder/reward.svg)

# DealHound — Real Black Friday Deals, Checked 27 Nov 2026

A static deal finder for [black-friday-deal-finder-01](https://make.fun/c/black-friday-deal-finder-01):
21 real Black Friday deals, each checked at its store on 27 Nov 2026, with sale price, usual
price, discount, store link and check time — plus an honest verdict on whether each deal is
really a deal.

## What it does

- **21 verified deals** across 6 categories (Tech, Gaming, Toys, Beauty, Home & Kitchen,
  Appliances) from 6 stores (Best Buy, Walmart, Amazon, Target, Nordstrom, Dyson).
  Total savings: **$4,632.96**.
- **Search + filters that work**: full-text search, category chips, store and minimum-discount
  filters, and sorting by biggest % off, biggest $ saving, or price.
- **"Is it really a deal?" verdicts**: NEW LOW (lowest price ever tracked), STRONG (30%+ off
  or $100+ saved), GOOD (15–30% off), ROUTINE (under 15% — a real cut, but no rush).
  Every verdict carries its evidence, and two deals show a same-product comparison across
  stores (MacBook Air M5 and Apple Watch Series 12 are cheaper at Amazon).
- **Deal detail pages** (`#/deal/<id>`) with the verdict evidence, the store link and the
  source of the check.
- **Desktop + phone layouts**, a live Cyber Monday countdown, and zero network requests —
  the whole site is four local files.

## How deals were checked

Each price was verified on 27 Nov 2026 against the store's own product page, or a deals
source naming that store. The research trail (product, store, URL, sale/usual price, source,
check time) is in the work log, and every card shows its store link and check time so anyone
can re-verify. Prices change fast on Black Friday weekend — the store's price at checkout is
the final word.

## Build checks

`main.ts` validates every deal before it hands the site in: each row needs an id, a
store, an https store link, a sale price below its usual price, and a check date, and
the build prints the deal count, store count and total savings (21 deals, 6 stores,
$4,632.96). The home page also shows the total saving across whatever the current
search and filters match, so the number on screen always agrees with the deals shown.

## Run it

Serve the `app/` folder with any static server, or run `node serve.ts` and open
http://localhost:8080. No build step, no dependencies, no network requests.

## Hand-in

`main.ts` (Node 22, stdlib only) copies `app/` and `screenshots/` to `/output` and writes
`/output/dossier.json` via the vendored `vendor/makefun-frontend.ts` (unchanged from the kit).

---

Built for the [make.fun](https://make.fun) bounty
[black-friday-deal-finder-01](https://make.fun/c/black-friday-deal-finder-01).
Referral code: `4g7knchf`
