# 🎂 TreatSplit

TreatSplit is a web application that helps teams **plan birthday events, split contributions fairly, track payments, and vote for food** — all in one place.  
Built with **Next.js, Supabase, TypeScript, and TailwindCSS**.

---

## 🚀 Features

- **Event Planning** – Create team events with a birthday person, notes, and custom details.
- **Contribution Tracking** – Split and track who has paid their share.
- **Food Voting** – Let participants vote for the celebration meal.
- **Dashboard Stats** – Monitor active events, participation rate, and collected amounts.
- **Authentication** – Supabase Auth with magic links & SSO.
- **Modern UI** – Styled with TailwindCSS and ShadCN components.

---

## 🛠 Tech Stack

- **Frontend:** [Next.js 14](https://nextjs.org), [React 18](https://react.dev), [TypeScript](https://www.typescriptlang.org)
- **Backend & DB:** [Supabase](https://supabase.com) (Postgres)
- **UI & Styling:** [TailwindCSS](https://tailwindcss.com), [ShadCN/UI](https://ui.shadcn.com)
- **State Management:** Server Components + React Hooks
- **Other:** [Sonner](https://sonner.emilkowal.ski) for toasts, [Lucide Icons](https://lucide.dev)

---

## 📦 Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/tanialapalelo/treatsplit.git
   cd treatsplit 
  ```
2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
  ```
3. **Set up environment variables**
Create a .env.local file with:
   ```bash
    NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
  ```
4. **Run the development server**
   ```bash
    npm run dev
    # or
    yarn dev
  ```
5. **Visit**
  ```bash
    http://localhost:3000
  ```

## 📜 License
MIT © 2025 TreatSplit Team