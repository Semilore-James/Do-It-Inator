# Do-It-Inator 🎯💀

**Turning procrastination into extinction — one deadline at a time.**

A gamified task management web app with real consequences. Miss your deadlines, lose health points, die, and face public humiliation. Complete tasks, build streaks, level up, and survive.

---

## 🎮 Features

### Core Gameplay
- ✅ **Task Management** with optional subtasks and deadlines
- ❤️ **Health System** - Start with 10 HP, lose 1 per missed deadline
- ⚡ **XP & Leveling** - Gain experience for completing tasks, level up to increase max HP
- 🔥 **Streak System** - Complete 100% of daily tasks to earn streaks
- ✨ **Fragment System** - Earn fragments for 80-99% completion (5 fragments = 1 streak)
- 💀 **Death & Revival** - Hit 0 HP? Wait 3 days or spend streaks to revive
- 🎭 **Roast Messages** - Get publicly roasted when you fail

### Social Features
- 👥 **Friend System** - Add friends, share tasks
- 👀 **Task Sharing** - Private, Shared (view-only), or Joint (collaborative) tasks
- 📊 **Progress Tracking** - See your daily completion rate

### Design
- 🎨 **Neo-Brutalism** aesthetic with bold borders and hard shadows
- 🎯 **Mobile-responsive** design
- 🤖 **Teddy Mascot** that reacts to your performance

---

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** (App Router)
- **React 18**
- **TypeScript**
- **Tailwind CSS**
- **Lucide Icons**

### Backend
- **Next.js API Routes**
- **NextAuth.js** (Google OAuth)
- **MongoDB** (via Mongoose)
- **Zod** (validation)

### Infrastructure
- **Vercel** (hosting + serverless functions)
- **Vercel Cron** (scheduled jobs)
- **MongoDB Atlas** (database)

---

## 📦 Installation

### Prerequisites
- Node.js 20.x LTS
- npm 10.x
- MongoDB Atlas account
- Google Cloud account (for OAuth)
- Vercel account (for deployment)

### Quick Start

1. **Clone the repository**
```bash
git clone https://github.com/your-username/do-it-inator.git
cd do-it-inator
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env.local
```

Fill in `.env.local` with your credentials:
- MongoDB connection string
- Google OAuth Client ID & Secret
- NextAuth secret
- Cron secret

4. **Run development server**
```bash
npm run dev
```

5. **Open in browser**
```
http://localhost:3000
```

---

## 📖 Documentation

- **[Beginner Setup Guide](BEGINNER_SETUP_GUIDE.md)** - Ultra-detailed walkthrough for non-technical users
- **[Setup Guide](SETUP_GUIDE__1_.md)** - Original technical setup instructions
- **[PRD](DO_IT_INATOR_PRD.md)** - Full product requirements document

---

## 🎯 How It Works

### Gamification Loop

1. **Create Tasks** with deadlines and subtasks
2. **Complete or Die** - finish before deadline or lose 1 HP
3. **Earn Rewards** - gain XP, health, and level up
4. **Build Streaks** - complete all daily tasks for streak points
5. **Face Consequences** - reach 0 HP and get locked out for 3 days

### XP System
- Create task: **+5 XP**
- Complete task: **+10 XP**
- Complete subtask: **+2 XP each**
- 100% daily completion: **+20 XP**
- Daily streak: **+15 XP**
- Level up: **+50 XP bonus**

### Health System
- Start: **10 HP max**
- Miss deadline: **-1 HP**
- Complete task (if under max): **+1 HP**
- Every 5 levels: **+2 max HP**

### Streak System
- **100% daily tasks**: Earn 1 streak
- **80-99% daily tasks**: Earn 1 fragment
- **5 fragments**: Convert to 1 streak
- **Revival cost**: 3 streaks (+ 1 per 10 levels)

---

## 🚀 Deployment

### Deploy to Vercel

1. **Push to GitHub**
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/your-username/do-it-inator.git
git push -u origin main
```

2. **Import to Vercel**
- Go to vercel.com
- Import your GitHub repository
- Add environment variables
- Deploy!

3. **Update Google OAuth**
- Add production URL to authorized origins
- Add production callback URL

4. **Enable Cron Jobs**
- Vercel automatically configures cron from `vercel.json`
- Check "Settings" → "Crons" to verify

---

## 🔧 API Routes

### Authentication
- `POST /api/auth/[...nextauth]` - NextAuth.js handler

### Tasks
- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Create new task
- `GET /api/tasks/[id]` - Get single task
- `PATCH /api/tasks/[id]` - Update task
- `DELETE /api/tasks/[id]` - Delete task

### User
- `GET /api/stats` - Get user stats and XP progress
- `POST /api/revive` - Revive after death

### Friends
- `GET /api/friends` - Get friends and friend requests
- `POST /api/friends` - Send friend request
- `PATCH /api/friends/[id]` - Accept friend request
- `DELETE /api/friends/[id]` - Reject/remove friend

### Cron Jobs
- `GET /api/cron/check-deadlines` - Check missed deadlines (hourly)
- `GET /api/cron/daily-streaks` - Calculate daily streaks (midnight)

---

## 🎨 Color Palette

| Color | Hex | Usage |
|-------|-----|-------|
| Navy Blue | `#0B1D51` | Backgrounds, headers |
| Purple | `#725CAD` | Interactive elements, shadows, XP |
| Sky Blue | `#8CCDEB` | Success states, health (high) |
| Cream | `#FFE3A9` | Card backgrounds, highlights |
| Black | `#000000` | Borders, text |

---

## 📁 Project Structure

```
do-it-inator/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   └── dashboard/
│   │   │       └── page.tsx          # Main dashboard
│   │   ├── api/
│   │   │   ├── auth/                 # NextAuth
│   │   │   ├── tasks/                # Task CRUD
│   │   │   ├── friends/              # Friend system
│   │   │   ├── stats/                # User stats
│   │   │   ├── revive/               # Death revival
│   │   │   └── cron/                 # Scheduled jobs
│   │   ├── globals.css               # Tailwind + custom styles
│   │   ├── layout.tsx                # Root layout
│   │   └── page.tsx                  # Landing page
│   ├── components/
│   │   ├── game/
│   │   │   ├── HealthBar.tsx
│   │   │   ├── XPBar.tsx
│   │   │   ├── StreakCounter.tsx
│   │   │   └── TeddyMascot.tsx
│   │   ├── ui/
│   │   │   ├── TaskCard.tsx
│   │   │   ├── CreateTaskModal.tsx
│   │   │   └── DeathScreen.tsx
│   │   └── SessionProvider.tsx
│   ├── lib/
│   │   ├── models/
│   │   │   ├── User.ts               # User schema
│   │   │   └── Task.ts               # Task schema
│   │   ├── dbConnect.ts              # MongoDB connection
│   │   ├── gamification.ts           # Game logic
│   │   ├── roasts.ts                 # Death roast messages
│   │   └── validation.ts             # Zod schemas
│   └── types/
│       ├── index.ts                  # TypeScript types
│       └── next-auth.d.ts            # NextAuth types
├── public/
│   └── icons/                        # (Future: custom mascot assets)
├── .env.example                      # Environment template
├── package.json                      # Dependencies
├── tsconfig.json                     # TypeScript config
├── tailwind.config.ts                # Tailwind config
├── next.config.js                    # Next.js config
├── vercel.json                       # Vercel cron config
└── README.md                         # This file
```

---

## 🧪 Testing

### Manual Testing Checklist

- [ ] User can sign in with Google
- [ ] User can create task with/without deadline
- [ ] User can add subtasks
- [ ] User can complete tasks and see XP increase
- [ ] User can complete subtasks
- [ ] Missing deadline reduces health
- [ ] Completing task increases health (if under max)
- [ ] Reaching 0 HP triggers death screen
- [ ] Death screen shows random roast
- [ ] User can revive with streaks (if they have enough)
- [ ] Lockout prevents access for 3 days
- [ ] Streaks calculate correctly at midnight
- [ ] Fragments convert to streaks (5:1 ratio)
- [ ] Level up increases max HP every 5 levels

---

## 🤝 Contributing

This is a personal project, but feel free to fork and customize!

---

## 📄 License

MIT License - feel free to use this for your own projects.

---

## 🙏 Acknowledgments

- **Neo-Brutalism design** inspired by modern web design trends
- **Gamification mechanics** inspired by RPGs and productivity apps
- **Dark humor** inspired by procrastinators everywhere

---

## 🎯 Roadmap (Future Enhancements)

- [ ] Mobile app (React Native)
- [ ] Custom teddy bear artwork
- [ ] Sound effects and animations
- [ ] Achievement badges
- [ ] Leaderboards
- [ ] Task categories/tags
- [ ] Recurring tasks
- [ ] Calendar view
- [ ] Email reminders
- [ ] Dark mode

---

**Built with ☕ and the fear of 3-day lockouts**
