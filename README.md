# FloreX — Web3 Finance Suite

> **Bloom Commerce · Web3 Demo Experience**
>
> A Web3 platform uniting flower commerce, peer-to-peer trading, and
> decentralised lending through conceptual product flows.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Live Demo & Screenshots](#2-live-demo--screenshots)
3. [The Three Sub-Platforms](#3-the-three-sub-platforms)
4. [Technology Stack](#4-technology-stack)
5. [Project Structure](#5-project-structure)
6. [Getting Started — Non-Technical Guide](#6-getting-started--non-technical-guide)
7. [Getting Started — Developer Guide](#7-getting-started--developer-guide)
8. [Key Features](#8-key-features)
9. [How MetaMask Wallet Integration Works](#9-how-metamask-wallet-integration-works)
10. [Smart Contract Architecture (Conceptual)](#10-smart-contract-architecture-conceptual)
11. [Design System](#11-design-system)
12. [Academic Context & Disclaimer](#12-academic-context--disclaimer)

---

## 1. Project Overview

**FloreX** is a proof-of-concept Web3 application built for an academic group exercise
(HKU SBIF7413). It demonstrates how blockchain technology and decentralised finance (DeFi)
concepts can be applied to real-world commercial scenarios.

The project started as three independent HTML marketing pages and was refactored into a
single, production-style React web application with:

- A unified brand identity and shared navigation
- Wallet authentication via MetaMask (sign-to-login)
- Client-side routing (no page reloads between screens)
- Simulated on-chain transaction flows (no real funds are ever moved)
- A dark Web3 visual theme with full-page scroll-snap navigation

> **This is a demo only.** No real cryptocurrency is used. No real contracts are deployed.
> All "transactions" are simulated with `setTimeout` and display a fake transaction hash.

---

## 2. Live Demo & Screenshots

| Screen             | Description                                                  |
| ------------------ | ------------------------------------------------------------ |
| `/`                | Home — brand hero, platform cards, animated stats, how-to guide |
| `/bloomtoken`      | BloomToken — flower product grid with rarity filter          |
| `/bloomtoken/:id`  | Product detail — buy modal with 4-step TX simulation         |
| `/marketplace`     | Trovex — real-time search across 8 demo NFT-style listings   |
| `/marketplace/:id` | Item detail — demo activity history, buy/bid, similar items  |
| `/lending`         | PeerLend — loan request listings with grade filter           |
| `/lending/:id`     | Loan detail — repayment schedule, risk metrics, lend modal   |

---

## 3. The Three Sub-Platforms

### 🌸 BloomToken

A Web3 flower shop where customers pre-purchase ERC-20 coupon tokens (BLMT) and
mint ERC-721 bouquet NFTs and redeem them for fresh flower arrangements within
12 months. Transaction flow is modeled on Base, including KEYP operational and
maintenance fee lines in each purchase flow.

| Attribute | Value              |
| --------- | ------------------ |
| Token     | BloomPass (ERC-721) |
| Network   | Base                |
| Theme     | Rose red `#f43f5e` |
| Route     | `/bloomtoken`      |

### 💎 Trovex

A peer-to-peer C2C marketplace where every item is tokenised as an NFT (ERC-721)
on Polygon. Buyers and sellers trade directly, with funds held in a smart contract
escrow model shown in a simulated settlement flow.

| Attribute | Value            |
| --------- | ---------------- |
| Token     | TRVX             |
| Network   | Polygon          |
| Theme     | Orange `#f97316` |
| Route     | `/marketplace`   |

### 🤝 PeerLend

A DeFi P2P lending platform connecting individual lenders with grade-rated borrowers.
Collateral locking, monthly repayments, and liquidation are represented as conceptual
product behavior in this demo.

| Attribute | Value            |
| --------- | ---------------- |
| Token     | PLDT             |
| Network   | Polygon          |
| Theme     | Indigo `#4f46e5` |
| Route     | `/lending`       |

---

## 4. Technology Stack

| Category         | Technology                | Version | Purpose                                    |
| ---------------- | ------------------------- | ------- | ------------------------------------------ |
| UI Library       | React                     | 18.3    | Component-based UI rendering               |
| Build Tool       | Vite                      | 5.4     | Fast dev server + production bundler       |
| Routing          | React Router v6           | 6.26    | Client-side navigation (SPA)               |
| Web3 / Wallet    | ethers.js                 | 5.7     | MetaMask connection, signing               |
| Styling          | Plain CSS + CSS Variables | —       | Dark theme, glassmorphism, animations      |
| State Management | React Context API         | —       | Shared wallet state, no Redux              |
| Animations       | CSS `@keyframes`          | —       | Scroll snap, petal fall, shimmer, count-up |

**Zero additional npm dependencies** beyond the above. No Tailwind, no styled-components,
no chart libraries, no animation frameworks.

---

## 5. Project Structure

```
KEYPFlowerShop-main/
├── index.html                  ← Original standalone page (BloomToken)
├── second-hand-trading.html    ← Original standalone page (Trovex)
├── lending.html                ← Original standalone page (PeerLend)
│
└── react-app/                  ← 🚀 The React application (start here)
    ├── index.html              ← Vite HTML entry point
    ├── package.json            ← Project dependencies & scripts
    ├── vite.config.js          ← Vite configuration
    │
    └── src/
        ├── main.jsx            ← React app entry (mounts to #root)
        ├── App.jsx             ← Root component, route definitions
        ├── index.css           ← Global styles (CSS variable theme system)
        │
        ├── context/
        │   └── WalletContext.jsx   ← MetaMask state shared across all pages
        │
        ├── components/             ← Reusable UI components
        │   ├── BrandLogo.jsx       ← SVG logo (flower + hexagon + gradient)
        │   ├── Navbar.jsx          ← Fixed top nav, mobile drawer, wallet button
        │   ├── Footer.jsx          ← Site footer with grouped links
        │   └── Toast.jsx           ← Floating notification bar
        │
        └── pages/
            ├── Home/
            │   └── index.jsx       ← Landing page (4 scroll-snap sections)
            │
            ├── BloomToken/
            │   ├── index.jsx       ← Product listing grid + petal animation
            │   ├── ProductDetail.jsx  ← Individual product page + breadcrumb
            │   └── PurchasePanel.jsx  ← Buy modal with TX simulation
            │
            ├── Trovex/
            │   ├── index.jsx       ← Marketplace with real-time search filter
            │   ├── ListingCard.jsx  ← NFT item card with rarity ribbon
            │   ├── ItemDetail.jsx   ← Item detail + demo activity history + bid
            │   └── ListItemPanel.jsx ← Seller form to list a new item
            │
            └── PeerLend/
                ├── index.jsx       ← Loan request listings with grade filter
                ├── LoanDetail.jsx  ← Loan detail + repayment table + risk chart
                └── LendPanel.jsx   ← Lend modal with return preview + TX sim
```

---

## 6. Getting Started — Non-Technical Guide

> This section is written for team members, instructors, or evaluators who are
> **not familiar with software development**. Follow these steps exactly and
> you will have the project running in your browser within 5 minutes.

---

### What you need before starting

You need two free pieces of software installed on your computer:

#### Step A — Install Node.js

Node.js is the engine that runs this project on your computer.

1. Open your web browser and go to: **https://nodejs.org**
2. Click the big green button that says **"LTS"** (recommended for most users)
3. Download the installer for your operating system (Windows or macOS)
4. Run the installer — click "Next" / "Continue" through all the steps, accepting defaults
5. When it finishes, Node.js is installed ✅

**How to check it worked:**

- On **Windows**: Press `Win + R`, type `cmd`, press Enter. A black window opens.
- On **Mac**: Press `Cmd + Space`, type `Terminal`, press Enter. A window opens.
- In that window, type exactly: `node --version` and press Enter.
- You should see something like `v18.16.0`. If you do, Node.js is ready ✅

---

#### Step B — Get the project files

If you received the project as a ZIP file:

1. Find the ZIP file (it may be called `KEYPFlowerShop-main.zip`)
2. Double-click it to extract/unzip it
3. You will get a folder called `KEYPFlowerShop-main`
4. Note where this folder is saved (e.g., your Desktop or Downloads folder)

---

### Running the project (5 steps)

#### Step 1 — Open a Terminal / Command Prompt

- **Windows**: Press `Win + R`, type `cmd`, press Enter
- **Mac**: Press `Cmd + Space`, type `Terminal`, press Enter

A text window will open. Don't worry — you only need to type a few simple commands.

---

#### Step 2 — Navigate to the project folder

In the terminal, type the command below and press Enter.
Replace the path with the actual location of your folder.

**On Mac** (if the folder is in Downloads):

```
cd ~/Downloads/KEYPFlowerShop-main/react-app
```

**On Windows** (if the folder is on the Desktop):

```
cd C:\Users\YourName\Desktop\KEYPFlowerShop-main\react-app
```

> 💡 **Tip**: You can drag the `react-app` folder from Finder/Explorer directly into
> the terminal window — it will type the path for you automatically.

---

#### Step 3 — Install dependencies

This downloads all the code libraries the project needs. You only need to do this **once**.

Type this command and press Enter:

```
npm install
```

You will see a lot of text scrolling by. This is normal. Wait until it stops
(usually 30–60 seconds). You should see something like `added 123 packages`.

> ⚠️ **If you see errors**: Make sure you have an internet connection and that
> Node.js was installed correctly (see Step A above).

---

#### Step 4 — Start the project

Type this command and press Enter:

```
npm run dev
```

You will see output like:

```
  VITE v5.4.8  ready in 312 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

**The project is now running!** ✅

---

#### Step 5 — Open in your browser

1. Open any web browser (Chrome, Firefox, Safari, Edge)
2. In the address bar at the top, type: **`http://localhost:5173`**
3. Press Enter
4. You will see the FloreX homepage 🎉

---

### Stopping the project

When you are done, go back to the terminal window and press:

- **Mac**: `Ctrl + C`
- **Windows**: `Ctrl + C`

The project will stop. You can close the terminal window.

---

### Starting the project again next time

You do NOT need to run `npm install` again. Just:

1. Open Terminal / Command Prompt
2. Navigate to the `react-app` folder (Step 2 above)
3. Run `npm run dev` (Step 4 above)
4. Open `http://localhost:5173` in your browser

---

### Trying the wallet features (optional)

The project demonstrates a MetaMask wallet connection. To try this:

1. Install the **MetaMask** browser extension from **https://metamask.io**
2. Create a wallet (follow MetaMask's setup guide — use a test wallet, not a real one)
3. Click **"Connect Wallet"** in the top-right corner of the site
4. MetaMask will ask you to sign a message — click **"Sign"**
5. Your wallet address will appear in the navbar (e.g., `0x742d...3F4a`)

> 🔒 **Safe to try**: This app never sends real transactions. No real cryptocurrency
> is used at any point. The "transactions" you see are simulated for demonstration.

---

### Troubleshooting common issues

| Problem                             | Likely Cause             | Solution                                               |
| ----------------------------------- | ------------------------ | ------------------------------------------------------ |
| `npm: command not found`            | Node.js not installed    | Re-run the Node.js installer from nodejs.org           |
| `ENOENT: no such file or directory` | Wrong folder in terminal | Double-check the path in Step 2                        |
| Port 5173 already in use            | Another app is using it  | Try `npm run dev -- --port 3000`                       |
| Page is blank / white screen        | JavaScript error         | Open browser DevTools (F12), check Console tab         |
| MetaMask not detected               | Extension not installed  | Install MetaMask from metamask.io                      |
| `npm install` takes forever         | Slow internet            | Wait — it can take up to 5 minutes on slow connections |

---

## 7. Getting Started — Developer Guide

### Prerequisites

- Node.js ≥ 18.x
- npm ≥ 9.x

### Installation

```bash
# Clone or extract the project
cd KEYPFlowerShop-main/react-app

# Install all dependencies
npm install

# Start development server (hot module replacement enabled)
npm run dev
```

### Available Scripts

| Script           | Command           | Description                                       |
| ---------------- | ----------------- | ------------------------------------------------- |
| Development      | `npm run dev`     | Starts Vite dev server at `http://localhost:5173` |
| Production Build | `npm run build`   | Bundles to `dist/` folder (optimised, minified)   |
| Preview Build    | `npm run preview` | Serves the `dist/` build locally for testing      |

### Environment

No `.env` file is required. All data is hardcoded as static arrays in the page files.

To add real smart contract integration, you would:

1. Add contract addresses and ABIs to a `src/contracts/` folder
2. Replace `setTimeout` simulations in `PurchasePanel.jsx`, `LendPanel.jsx`, `ItemDetail.jsx`
   with actual `ethers.js` contract calls
3. Optionally add a `.env` file for `VITE_CONTRACT_ADDRESS=0x...`

### Adding a new product (BloomToken)

Open `src/pages/BloomToken/index.jsx` and add an entry to `FLOWER_PRODUCTS`:

```js
{
  id: 7,
  name: 'Pink Peony Luxury Set',
  emoji: '🌷',
  price: 0.12,
  priceUsd: 430,
  stock: 8,
  totalStock: 10,
  rarity: 'Uncommon',   // Common | Uncommon | Rare | Legendary
  tags: ['luxury', 'peony'],
  description: 'A curated luxury arrangement of 8 seasonal pink peonies...',
}
```

### Adding a new listing (Trovex)

Open `src/pages/Trovex/index.jsx` and add an entry to `LISTINGS`.

### Adding a new loan (PeerLend)

Open `src/pages/PeerLend/index.jsx` and add an entry to `LOAN_LISTINGS`.

### CSS Theme System

Each sub-platform uses a CSS variable override class applied to the page wrapper:

```css
/* In index.css */
.theme-bloomtoken { --primary: #f43f5e; --primary-rgb: 244, 63, 94; }
.theme-trovex     { --primary: #f97316; --primary-rgb: 249, 115, 22; }
.theme-peerlend   { --primary: #4f46e5; --primary-rgb: 79, 70, 229;  }
```

All colour-dependent styles use `var(--primary)` or `rgba(var(--primary-rgb), 0.15)`,
so changing the class on the page wrapper automatically re-themes the entire page.

---

## 8. Key Features

### Scroll-Snap Full-Page Navigation

All four level-1 pages use CSS `scroll-snap-type: y mandatory`.
Each section occupies at least one full viewport height and snaps precisely into view
when scrolled — no JavaScript required.

```css
.snap-page    { scroll-snap-type: y mandatory; height: 100vh; overflow-y: scroll; }
.snap-section { scroll-snap-align: start; min-height: 100vh; }
```

### Real-Time Search (Trovex)

The search bar uses `onChange` (not `onSubmit`), filtering the `LISTINGS` array
on every keystroke by `title`, `category`, and `nft` fields:

```jsx
const filtered = LISTINGS.filter(item =>
  item.title.toLowerCase().includes(query.toLowerCase()) ||
  item.category.toLowerCase().includes(query)
)
```

### Transaction Simulation

Clicking "Buy Now" or "Fund This Loan" steps through 4 stages using `setTimeout`,
then displays a randomly generated fake TX hash:

```js
const hash = '0x' + Math.random().toString(16).slice(2, 12)
showToast(`✅ Purchase confirmed! TX: ${hash}`)
```

### Wallet Persistence (localStorage)

On page refresh, the previously connected wallet address is restored from
`localStorage` so users do not need to reconnect on every visit.
A full re-signature is required for new sessions or different browsers.

### Animated Statistics Counter

The Home page stats use `requestAnimationFrame` with a cubic ease-out curve:

```js
const eased = 1 - Math.pow(1 - progress, 3)
setValue(+(target * eased).toFixed(decimals))
```

### Rarity Badge System

Products and listings are classified into four tiers with distinct colours:

| Rarity    | Colour | CSS Class          |
| --------- | ------ | ------------------ |
| Common    | Gray   | `.badge-common`    |
| Uncommon  | Green  | `.badge-uncommon`  |
| Rare      | Purple | `.badge-rare`      |
| Legendary | Gold   | `.badge-legendary` |

---

## 9. How MetaMask Wallet Integration Works

The wallet connection flow lives entirely in `src/context/WalletContext.jsx`:

```
User clicks "Connect Wallet"
        ↓
Check window.ethereum (MetaMask present?)
  → No:  show "Install MetaMask" link → metamask.io
  → Yes: call eth_requestAccounts
        ↓
Get signer, address, network name
        ↓
Ask user to sign a text message (proves wallet ownership, no gas fee)
        ↓
Save address to localStorage (persists across page refreshes)
        ↓
Update React context → address, networkName, isConnected = true
        ↓
All components reading useWallet() automatically re-render
```

The context also listens for MetaMask events:

- `accountsChanged` — updates the displayed address if user switches accounts
- `chainChanged` — reloads the page to avoid state mismatches across networks

---

## 10. Smart Contract Architecture (Conceptual)

> These contracts are **not deployed**. The descriptions below explain the intended
> real-world implementation for academic discussion purposes.

### BloomToken Contract

```
ERC-721 collection (BloomPass NFTs on Base)
├── mintPass()         — mints one bouquet NFT per purchase
├── redeemPass()       — burns/redeems NFT for flower delivery
├── chargeKeypFees()   — charges KEYP operational + maintenance fees
└── settlePayout()     — handles supplier/courier/florist payout routing
```

### Trovex Escrow Contract

```
ERC-721 token (per item) + Escrow
├── listItem()    — seller mints NFT, sets price
├── buyItem()     — buyer sends TRVX; funds locked in escrow
├── confirmDelivery() — delivery status input confirms shipment; releases funds to seller
└── dispute()     — either party triggers the dispute resolution workflow
```

### PeerLend Contract

```
Lending Pool + Repayment Scheduler
├── requestLoan()     — borrower submits request + locks collateral
├── fundLoan()        — lender deposits ETH; pool fills up
├── executeLoan()     — at 100% funding: disburse to borrower
├── repay()           — borrower repays monthly instalments
└── liquidate()       — triggered if repayment misses deadline
```

---

## 11. Design System

### Colour Palette

| Token              | Value                    | Usage                           |
| ------------------ | ------------------------ | ------------------------------- |
| `--bg-base`        | `#0d0d14`                | Page background                 |
| `--bg-secondary`   | `#111118`                | Alternate section background    |
| `--bg-card`        | `rgba(255,255,255,0.04)` | Glassmorphism card              |
| `--text-primary`   | `#f0f0f8`                | Main body text                  |
| `--text-secondary` | `#8888aa`                | Subdued text                    |
| `--green`          | `#10b981`                | Success, positive APR, verified |
| `--amber`          | `#f59e0b`                | Warning, legendary rarity       |
| `--purple`         | `#8b5cf6`                | Rare rarity                     |

### Typography

| Use              | Font             | Weight          |
| ---------------- | ---------------- | --------------- |
| Body             | Inter            | 300 – 600       |
| Headings / brand | Playfair Display | 700             |
| Wallet addresses | Courier New      | 400 (monospace) |

### Button Variants

| Class                   | Style                          | Use Case              |
| ----------------------- | ------------------------------ | --------------------- |
| `.btn-primary`          | Brand gradient + glow on hover | Main CTAs             |
| `.btn-secondary`        | Transparent + brand border     | Secondary actions     |
| `.btn-ghost`            | Text only, no background       | Tertiary / navigation |
| `.btn-primary:disabled` | 40% opacity, `not-allowed`     | Unavailable actions   |

---

## 12. Academic Context & Disclaimer

This project was developed as a **group exercise for HKU SBIF7413**.

**Team / Context**

- Course: SBIF7413 — Fintech & Blockchain
- Semester: Semester 2, 2025–2026
- Institution: The University of Hong Kong

**Scope**

- Proof of Concept (PoC) only
- No real smart contracts are deployed to any blockchain
- No real cryptocurrency transactions are executed
- All wallet interactions are simulated or use testnets

**Not Financial Advice**
All yield figures, APR rates, token prices, and financial returns shown in this
application are fictional and for demonstration purposes only. Nothing in this
application constitutes investment advice or a solicitation to buy or sell
any financial product.

**Open Source**
This codebase is intended for academic review. Please do not deploy it in
production without a full security audit of the smart contract architecture.

---

*Built with React 18 · Vite · ethers.js · Base (conceptual) · No external UI libraries*
