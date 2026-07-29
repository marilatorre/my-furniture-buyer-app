# Requirements

## Overview
A web app for a furniture shop's buyers. A buyer logs in, browses a
product catalogue, and places orders. Each buyer has a budget, and the
app tracks how much of it they've spent so they don't overspend.

Built in a single day (hackathon Day 1). Scope is intentionally small.

## User roles
Just one role for Day 1: **Buyer**. No admin panel, no staff accounts.
(Products are seeded directly into the database rather than managed
through a UI.)

## Functional requirements

### 1. Login
- A buyer logs in with an email and password.
- Wrong credentials show a plain error message ("email or password
  incorrect").
- Once logged in, the buyer stays logged in (via a session cookie) until
  they log out or the session expires.
- Pages other than the login page are not viewable unless logged in —
  visiting them redirects to /login.

### 2. Catalogue
- Buyer sees a list/grid of furniture products: image, name, price,
  short description.
- No search or filtering required for Day 1 — a single scrollable page
  of all products is enough.

### 3. Budget tracking
- Every buyer has a budget (a dollar amount), set when their account is
  created.
- The app displays: budget total, amount spent so far, amount remaining.
- Spent amount = sum of the price × quantity for all orders the buyer
  has placed.

### 4. Placing an order
- From the catalogue, a buyer can order a product (choose a quantity,
  confirm).
- If the order would push total spend over budget, the app blocks it
  and shows a clear message (e.g., "This would put you $40 over
  budget").
- If it's within budget, the order is saved and the budget display
  updates.

### 5. Order history
- A buyer can view a list of orders they've placed: product, quantity,
  price, date.

## Non-functional requirements
- **Beginner-friendly codebase** — the person maintaining this has no
  coding background; code and explanations should stay simple and
  readable over "clever."
- **Runs locally with no external services to configure** — no cloud
  database, no third-party API keys required to get the app running.
- **Basic security** — passwords are hashed (never stored in plain
  text), and pages requiring login actually enforce it.
- **Fast to build** — favor the simplest working approach; this is a
  one-day build, not a production system.

## Out of scope (Day 1)
- Admin/staff UI for managing products.
- Password reset / email verification.
- Payments or checkout (orders are just recorded, not paid for).
- Editing or cancelling an order after it's placed.
- Multiple currencies, taxes, shipping.
- Mobile app (responsive web is enough).

## Open questions
- Is the budget fixed per buyer, or does it reset (e.g., monthly)? Day 1
  assumes it's a single fixed amount set at account creation.
- Should an order ever be allowed to exceed budget with a warning
  (rather than a hard block)? Day 1 assumes a hard block.
