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
- **Catalogue** — browse furniture products (name, price, image, description),
  24 per page. Product data comes from a real furniture dataset (762 items),
  imported from a MongoDB collection — see "Product catalogue source" below.
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

## Folder structure (as actually built)
```
my-furniture-buyer-app/
├── app/
│   ├── page.js                       # Home page: product catalogue + budget bar
│   ├── login/page.js                 # Login page
│   ├── orders/page.js                # Order history + total spent
│   └── api/
│       ├── auth/[...nextauth]/route.js  # NextAuth login handler
│       └── orders/route.js              # Creates an order (checks budget first)
├── components/
│   ├── Navbar.js                     # Top bar: shows email + log out, or a log-in link
│   ├── ProductCard.js                # One product + its "order" form
│   ├── BudgetBar.js                  # Budget / spent / remaining display
│   └── SessionProviderWrapper.js     # Wires up login state for the whole app
├── lib/
│   ├── prisma.js                     # Shared database connection
│   ├── auth.js                       # Login rules (checks email/password)
│   └── budget.js                     # Works out spent/remaining from orders
├── prisma/
│   ├── schema.prisma                 # User, Product, Order table definitions
│   ├── seed.js                       # Creates the demo user
│   └── dev.db                        # The actual SQLite database file
├── scripts/
│   └── import-catalog.js             # Pulls real products from MongoDB into our database
├── public/                           # Static files
└── middleware.js                     # Redirects to /login if not logged in
```

## Product catalogue source
Real product data (name, price, category, colours, dimensions, image) lives
in a training MongoDB database and is pulled in by
`scripts/import-catalog.js` (`npm run import-catalog`), which replaces
whatever is currently in our own Product table. It does **not** run
automatically — run it manually when you want to (re)load the catalogue.

- The MongoDB connection string lives in `.env` as `MONGODB_URI` — never
  hardcode it in a script, since `.env` is the one place secrets are kept
  out of git (it's already gitignored).
- Each source document doesn't have an image "URL" — despite the field name
  `image_url`, it's actually the raw image bytes encoded as base64. The
  import script turns that into a `data:image/...;base64,...` string so
  `<img src="...">` can render it directly. This is why `prisma/dev.db` is
  large (~90MB) — it's mostly embedded images.
- The script refuses to run if any orders already exist (to avoid silently
  breaking order history by deleting the products they point to).

## Conventions
- Plain JavaScript, not TypeScript (keeps things simpler to read).
- Keep explanations of code changes in plain English — no assumed jargon.
- Prefer the simplest working approach over "best practice" abstractions;
  this is a one-day hackathon build.

## How to run this app
1. Open a terminal in the `my-furniture-buyer-app` folder.
2. Run `npm install` (only needed the first time, or after new packages are
   added).
3. Run `npm run dev` — this starts the app.
4. Open **http://localhost:3000** in your browser.
5. You'll be sent to the login page. Use the demo account:
   - Email: `buyer@example.com`
   - Password: `password123`
6. After logging in you'll see the catalogue, your budget bar, and can place
   orders on any product. Click "My Orders" in the top bar to see your order
   history and total spent.

To stop the app, go back to the terminal and press `Ctrl+C`.

If you ever want to fully reset the database: delete `prisma/dev.db`, run
`npx prisma migrate dev`, then `npm run seed` (recreates the demo user) and
`npm run import-catalog` (reloads the real product catalogue from MongoDB).
