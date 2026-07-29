# My Furniture Buyer App

## What this is
A hackathon (Day 1) web app for a furniture shop's buyers. A user logs in,
browses a product catalogue, and places orders — the app tracks their
spending against a set budget so they can't order more than they're allowed.

The person building this has no coding background. Claude is choosing the
stack and doing all the implementation. Explanations should stay in plain
English; avoid assuming prior programming knowledge.

## Core features (Day 1 scope)
- **Login** — a buyer logs in with email/password.
- **Catalogue** — browse furniture products (name, price, image, description).
- **Budget** — each user has a budget; the UI shows how much they've spent
  and how much is left.
- **Orders** — a user places an order for a product; the order is blocked
  (or warned) if it would exceed their remaining budget.
- **Order history** — a user can see what they've already ordered.

## Tech stack
- **Next.js** (App Router, JavaScript, not TypeScript) — one project for
  both the pages users see and the backend/API logic. Fewer moving parts.
- **Prisma + SQLite** — Prisma describes the data (User, Product, Order) and
  writes the database queries for us. SQLite is a single file, no database
  server to install/configure.
- **NextAuth.js** — handles login sessions/cookies so we don't hand-roll
  password and session security.
- **Tailwind CSS** — utility classes for styling without writing custom CSS.

## Data model (plain terms)
- **User** — login credentials + a budget amount.
- **Product** — an item in the catalogue (name, price, image, description).
- **Order** — links a User to a Product (+ quantity); used to compute how
  much of the budget has been spent.

## Folder structure
```
my-furniture-buyer-app/
├── app/                    # Pages and routes
│   ├── login/page.js       # Login page
│   ├── catalogue/page.js   # Browse products
│   ├── orders/page.js      # Order history / budget status
│   └── api/                # Backend logic (auth, placing orders)
├── components/             # Reusable UI pieces (ProductCard, Navbar, BudgetBar)
├── lib/                    # Helpers (database connection, auth config)
├── prisma/
│   └── schema.prisma       # User, Product, Order definitions
├── public/                 # Images and static files
└── middleware.js           # Redirects to /login if not authenticated
```

## Conventions
- Plain JavaScript, not TypeScript (keeps things simpler to read).
- Keep explanations of code changes in plain English — no assumed jargon.
- Prefer the simplest working approach over "best practice" abstractions;
  this is a one-day hackathon build.
