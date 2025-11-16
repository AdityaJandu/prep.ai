# **Prep.ai – AI-Powered Virtual Interview & Collaboration Platform**

Prep.ai is a modern, intelligent platform that helps users prepare for interviews, brainstorm ideas, and collaborate using personalized AI agents. Built with a fully serverless, type-safe architecture, it brings together **chat**, **voice**, and **screen sharing** for seamless virtual meetings.

---

## 🚀 Features

### 🤖 Personalized AI Agents
- Create AI agents for interview prep, brainstorming, ideation, or meeting assistance.
- Context-aware and adaptive responses for more realistic interactions.

### 💬 Real-Time Chat
- Clean, fast chat interface.
- Powered by tRPC + Next.js for fully type-safe communication.

### 🔊 Voice Interaction
- Supports natural, hands-free interaction with AI.
- Real-time audio processing.

### 🖥️ Screen Sharing
- Integrated WebRTC screen sharing.
- Ideal for coding rounds, design walkthroughs, and team collaboration.

### 📝 Auto Notes & Summaries
- AI-generated summaries and key points after each session.

---

## 🏗️ Tech Stack

### **Core Framework**
- **Next.js (App Router)**
- **TypeScript**

### **Serverless Backend**
- **tRPC** – end-to-end type safety  
- **Inngest** – background jobs, workflows, scheduled tasks  
- **Better Auth** – authentication & sessions  

### **Database Layer**
- **Neon** – serverless Postgres  
- **Drizzle ORM** – schema-first SQL with migrations  

### **AI & Real-Time**
- LLM integration (OpenAI / custom)
- WebRTC for voice & screen sharing

---

## 📁 Project Structure

```

prep.ai/
├── src/
│   ├── app/               # Next.js App Router routes
│   ├── components/        # Reusable UI components
│   ├── db/                # Drizzle schemas, queries, migrations
│   ├── hooks/             # Custom React hooks
│   ├── inngest/           # Inngest functions, workflows, jobs
│   ├── lib/               # Utilities, helpers, configs
│   ├── modules/           # Feature-based modules
│   │   ├── agents/        # AI agent logic & UI
│   │   ├── auth/          # Better Auth (login, register, session)
│   │   ├── dashboard/     # User dashboard
│   │   ├── home/          # Landing & home pages
│   │   ├── meetings/      # Meeting creation & scheduling
│   │   └── video-call/    # WebRTC calls & screen sharing
│   ├── trpc/              # tRPC routers & API server
│   └── constants.ts       # Global constants
├── public/                # Static assets
├── drizzle/               # Drizzle migrations
├── package.json
└── README.md

```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the repository
```bash
git clone https://github.com/AdityaJandu/prep.ai.git
cd prep.ai
````

### 2️⃣ Install dependencies

```bash
npm install
```

### 3️⃣ Configure environment variables

Create a `.env.local` file:

```

# -----------------------------------------
# BetterAuth (Email & Password Auth)
# -----------------------------------------
BETTER_AUTH_SECRET=""
BETTER_AUTH_URL="http://localhost:3000"

# -----------------------------------------
# OAuth Providers (GitHub & Google)
# -----------------------------------------
GITHUB_CLIENT_ID=""
GITHUB_CLIENT_SECRET=""

GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""

# -----------------------------------------
# App URL (tRPC / Router)
# -----------------------------------------
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# -----------------------------------------
# Stream (Video & Chat)
# -----------------------------------------
NEXT_PUBLIC_STREAM_VIDEO_API_KEY=""
STREAM_VIDEO_SECRET_KEY=""

NEXT_PUBLIC_STREAM_CHAT_API_KEY=""
STREAM_CHAT_SECRET_KEY=""

# -----------------------------------------
# OpenAI API Key
# -----------------------------------------
OPENAI_API_KEY=""

# -----------------------------------------
# Gemini API Key
# -----------------------------------------
GEMINI_API_KEY=""

```

### 4️⃣ Run Drizzle migrations

```bash
npm run db:push
```

### 5️⃣ Start webhook server

```bash
npm run webhook
```

### 6️⃣ Start development server

```bash
npm run dev
```

App runs at:
👉 **[http://localhost:3000](http://localhost:3000)**

---

## 🧠 Why Prep.ai?

* Realistic AI interview simulations
* Built for brainstorming and ideation
* Crisp voice interaction and screen sharing
* Type-safe, serverless architecture
* Perfect for job seekers, students, and teams

---

## 🤝 Contributing

1. Fork the repo
2. Create a feature branch
3. Commit your changes
4. Open a pull request

Contributions and suggestions are welcome!

---

