# 🚀 Do-It-Inator Setup Guide
## For Complete Beginners - No Technical Knowledge Required

---

## 📋 What You'll Need

Before starting, you'll create free accounts on these services:
- ✅ **Google Account** (you probably already have one)
- ✅ **GitHub Account** (for storing code)
- ✅ **MongoDB Atlas** (for database - completely free)
- ✅ **Vercel** (for hosting the website - completely free)

**Time needed:** 45-60 minutes total

---

## Part 1: Install Required Software

### Step 1: Install Node.js

**What is Node.js?** It's software that lets your computer run the app locally.

1. Go to https://nodejs.org/
2. Click the **green button** that says "Download Node.js (LTS)"
3. Once downloaded, **double-click** the installer file
4. Click **Next → Next → Next → Install** (keep all default settings)
5. When finished, click **Finish**

**How to check it worked:**
- On Windows: Press `Windows Key + R`, type `cmd`, press Enter
- On Mac: Press `Command + Space`, type `terminal`, press Enter

Type this and press Enter:
```
node --version
```

You should see something like `v20.10.0`. If you do, it worked! ✅

### Step 2: Install Git

**What is Git?** It tracks changes to your code and uploads it to GitHub.

1. Go to https://git-scm.com/downloads
2. Click your operating system (Windows/Mac/Linux)
3. Download and install (click Next through everything - keep defaults)

**How to check it worked:**
In your terminal/command prompt, type:
```
git --version
```

You should see something like `git version 2.43.0` ✅

### Step 3: Install VS Code (Code Editor)

**What is VS Code?** It's like Microsoft Word, but for code.

1. Go to https://code.visualstudio.com/
2. Click **Download** (it auto-detects your operating system)
3. Install it (Next → Next → Install)
4. Open VS Code after installation

---

## Part 2: Download the Code

### Step 1: Get the Code Files

**Option A: If you have the files already**
- Skip to Part 3

**Option B: If downloading from scratch**
1. Open VS Code
2. Press `Ctrl+` (backtick key) or go to Terminal → New Terminal
3. A terminal will open at the bottom of VS Code
4. Type this command and press Enter:
```bash
cd Desktop
```
(This goes to your Desktop folder)

5. Now you'll extract the Do-It-Inator files you received

---

## Part 3: Set Up MongoDB (Database)

### Step 1: Create MongoDB Account

1. Go to https://www.mongodb.com/cloud/atlas/register
2. Click **"Sign up with Google"** (easier than creating new account)
3. Sign in with your Google account
4. You'll see a welcome screen

### Step 2: Create a Free Database

1. Choose **FREE tier** (should be selected already - it's called "M0 Sandbox")
2. For **Provider**, choose **AWS**
3. For **Region**, choose the one closest to you geographically
4. Cluster Name: type `do-it-inator-db`
5. Click **"Create"**
6. Wait 1-3 minutes while it sets up (you'll see a loading screen)

### Step 3: Create Database User

1. A popup will appear saying "Security Quickstart"
2. **Username**: type `do_it_inator_user`
3. **Password**: Click "Autogenerate Secure Password"
4. **IMPORTANT:** Copy this password and paste it into a text file/note app
   - You'll need it later!
   - Example: `xK9mP2nQ7fL5wR`
5. Click **"Create User"**

### Step 4: Allow Access From Anywhere

1. Below the user creation, you'll see "Where would you like to connect from?"
2. Click **"Add My Current IP Address"** button
3. Then click **"Add Entry"** on the popup
4. For development, also click **"Allow Access from Anywhere"**
   - IP Address: `0.0.0.0/0`
   - Click **"Add Entry"**
5. Click **"Finish and Close"**

### Step 5: Get Connection String

1. Click **"Go to Databases"** (or click "Database" in left sidebar)
2. Find your cluster `do-it-inator-db`
3. Click the **"Connect"** button
4. Click **"Connect your application"**
5. Make sure **Node.js** is selected and version **5.5 or later**
6. You'll see a connection string that looks like:
   ```
   mongodb+srv://do_it_inator_user:<password>@do-it-inator-db.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
7. **Copy this entire string**
8. Replace `<password>` with the password you saved earlier
9. Add `/do-it-inator` right after `.mongodb.net`

**Final connection string should look like:**
```
mongodb+srv://do_it_inator_user:xK9mP2nQ7fL5wR@do-it-inator-db.xxxxx.mongodb.net/do-it-inator?retryWrites=true&w=majority
```

10. Save this in your text file - you'll need it soon!

---

## Part 4: Set Up Google Sign-In

### Step 1: Create Google Cloud Project

1. Go to https://console.cloud.google.com/
2. Sign in with your Google account
3. Click **"Select a project"** dropdown at the top
4. Click **"New Project"**
5. Project Name: `Do-It-Inator`
6. Click **"Create"**
7. Wait ~30 seconds for it to create
8. Make sure your new project is selected (check top bar)

### Step 2: Enable Google+ API

1. In the left menu, click **"APIs & Services"** → **"Library"**
2. In the search box, type: `Google+ API`
3. Click on **"Google+ API"**
4. Click **"Enable"**
5. Wait for it to enable (~10 seconds)

### Step 3: Configure OAuth Consent Screen

1. In left menu, click **"APIs & Services"** → **"OAuth consent screen"**
2. Choose **"External"**
3. Click **"Create"**
4. Fill in:
   - App name: `Do-It-Inator`
   - User support email: your email
   - Developer contact email: your email
5. Click **"Save and Continue"**
6. Click **"Add or Remove Scopes"**
7. Select these two scopes (check the boxes):
   - `.../auth/userinfo.email`
   - `.../auth/userinfo.profile`
8. Click **"Update"**
9. Click **"Save and Continue"**
10. Click **"Add Users"**
11. Add your email address
12. Click **"Add"**
13. Click **"Save and Continue"**
14. Click **"Back to Dashboard"**

### Step 4: Create OAuth Credentials

1. In left menu, click **"APIs & Services"** → **"Credentials"**
2. Click **"Create Credentials"** → **"OAuth 2.0 Client ID"**
3. Application type: **"Web application"**
4. Name: `Do-It-Inator Web Client`
5. Under **"Authorized JavaScript origins"**, click **"Add URI"**
   - Type: `http://localhost:3000`
6. Under **"Authorized redirect URIs"**, click **"Add URI"**
   - Type: `http://localhost:3000/api/auth/callback/google`
7. Click **"Create"**
8. A popup will show your **Client ID** and **Client Secret**
9. **IMPORTANT:** Copy both of these to your text file
   - Client ID looks like: `123456789-abc...xyz.apps.googleusercontent.com`
   - Client Secret looks like: `GOCSPX-Abc...Xyz`

---

## Part 5: Configure the App

### Step 1: Create Environment File

1. Open VS Code
2. Open your `do-it-inator` folder in VS Code:
   - File → Open Folder → select `do-it-inator`
3. Look in the file explorer on the left
4. Find the file `.env.example`
5. Right-click it → **"Duplicate"**
6. Rename the copy to `.env.local` (important: must be exactly this name)

### Step 2: Fill in Environment Variables

1. Open `.env.local` by clicking on it
2. You'll see empty placeholders - fill them in:

```bash
# Database (paste your MongoDB connection string)
MONGODB_URI=mongodb+srv://do_it_inator_user:YOUR_PASSWORD@do-it-inator-db.xxxxx.mongodb.net/do-it-inator?retryWrites=true&w=majority

# Google OAuth (paste from Google Cloud Console)
GOOGLE_CLIENT_ID=123456789-abc...xyz.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-Abc...Xyz

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=generate_this_next

# Cron Secret (for security - create any random string)
CRON_SECRET=any_random_string_you_want_12345

# Optional: Leave blank for now
NEXT_PUBLIC_SENTRY_DSN=
```

### Step 3: Generate NEXTAUTH_SECRET

**Option A - On Mac/Linux:**
1. Open Terminal (not VS Code terminal)
2. Type this and press Enter:
```bash
openssl rand -base64 32
```
3. Copy the output and paste it as `NEXTAUTH_SECRET`

**Option B - On Windows:**
1. In VS Code terminal (bottom panel)
2. Type this and press Enter:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```
3. Copy the output and paste it as `NEXTAUTH_SECRET`

**Example result:**
```bash
NEXTAUTH_SECRET=xYz123aBc456DeF789gHi012jKl345mNoPqRsTuVwXy=
```

4. **Save the file** (Ctrl+S or Cmd+S)

---

## Part 6: Install and Run the App

### Step 1: Install Dependencies

1. In VS Code, open the terminal (View → Terminal or Ctrl+`)
2. Make sure you're in the `do-it-inator` folder
3. Type this command and press Enter:
```bash
npm install
```

4. Wait 2-5 minutes while it downloads everything
5. You'll see lots of text scrolling - this is normal!
6. When it's done, you'll see your cursor again

### Step 2: Run the App

1. In the terminal, type:
```bash
npm run dev
```

2. Wait ~10 seconds
3. You should see:
```
▲ Next.js 14.2.16
- Local:        http://localhost:3000
- Ready in 2.3s
```

4. **The app is now running!** 🎉

### Step 3: Open in Browser

1. Open your web browser (Chrome, Firefox, etc.)
2. Go to: `http://localhost:3000`
3. You should see the Do-It-Inator landing page!
4. Click **"Sign in with Google"**
5. Choose your Google account
6. You should be redirected to your dashboard!

---

## Part 7: Deploy to the Internet (Vercel)

Right now, the app only works on your computer. Let's make it live on the internet!

### Step 1: Create GitHub Repository

1. Go to https://github.com
2. Sign up/Sign in
3. Click the **"+"** in top right → **"New repository"**
4. Repository name: `do-it-inator`
5. Choose **"Public"** or **"Private"** (your choice)
6. Do NOT check "Initialize with README"
7. Click **"Create repository"**

### Step 2: Upload Code to GitHub

1. In VS Code terminal, type these commands one at a time:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/do-it-inator.git
git push -u origin main
```

(Replace `YOUR_USERNAME` with your actual GitHub username)

2. Refresh your GitHub repository page - you should see all your code!

### Step 3: Deploy on Vercel

1. Go to https://vercel.com
2. Click **"Sign Up"** → **"Continue with GitHub"**
3. Authorize Vercel to access your GitHub
4. Click **"Import Project"**
5. Find `do-it-inator` in your list → Click **"Import"**
6. It will detect Next.js automatically
7. Click **"Environment Variables"**
8. Add each variable from your `.env.local` file:
   - Click **"Add"** for each one
   - Name: `MONGODB_URI`, Value: (paste your MongoDB string)
   - Name: `GOOGLE_CLIENT_ID`, Value: (paste your Client ID)
   - Name: `GOOGLE_CLIENT_SECRET`, Value: (paste your Client Secret)
   - Name: `NEXTAUTH_SECRET`, Value: (paste your secret)
   - Name: `CRON_SECRET`, Value: (paste your cron secret)
   - Name: `NEXTAUTH_URL`, Value: `https://YOUR_PROJECT_NAME.vercel.app` (leave this for now, we'll fix it)
9. Click **"Deploy"**
10. Wait 2-3 minutes for deployment

### Step 4: Update Google OAuth for Production

1. After deployment, Vercel will show you your live URL (something like `do-it-inator-abc123.vercel.app`)
2. Copy this URL
3. Go back to Google Cloud Console → Credentials
4. Click on your OAuth client
5. Under **"Authorized JavaScript origins"**, click **"Add URI"**
   - Add: `https://YOUR_VERCEL_URL` (e.g., `https://do-it-inator-abc123.vercel.app`)
6. Under **"Authorized redirect URIs"**, click **"Add URI"**
   - Add: `https://YOUR_VERCEL_URL/api/auth/callback/google`
7. Click **"Save"**

### Step 5: Update Vercel Environment Variable

1. In Vercel dashboard, go to your project
2. Click **"Settings"** → **"Environment Variables"**
3. Find `NEXTAUTH_URL`
4. Click **"Edit"**
5. Change value to your Vercel URL: `https://do-it-inator-abc123.vercel.app`
6. Click **"Save"**
7. Go to **"Deployments"** tab → click **"..."** on latest deployment → **"Redeploy"**

### Step 6: Enable Vercel Cron Jobs

1. In your project dashboard on Vercel
2. Go to **"Settings"** → **"Crons"**
3. You should see two cron jobs listed from `vercel.json`:
   - `check-deadlines` (runs every hour)
   - `daily-streaks` (runs every day at midnight)
4. Make sure they're enabled (toggle should be on)

---

## 🎉 You're Done!

Your app is now live at your Vercel URL!

### Testing Checklist

- ✅ Visit your Vercel URL
- ✅ Click "Sign in with Google"
- ✅ Create a new task
- ✅ Set a deadline
- ✅ Complete the task (check the circle)
- ✅ Watch your XP bar fill up!
- ✅ Check your health bar

---

## 🐛 Troubleshooting

### "Module not found" error
**Solution:** Run `npm install` again

### Can't sign in with Google
**Solution:** Double-check your Google OAuth redirect URIs include both:
- `http://localhost:3000/api/auth/callback/google`
- `https://YOUR_VERCEL_URL/api/auth/callback/google`

### Tasks not saving
**Solution:** Check your MongoDB connection string in `.env.local` - make sure you:
- Replaced `<password>` with your actual password
- Added `/do-it-inator` after `.mongodb.net`

### App crashes when opening
**Solution:** 
1. Check VS Code terminal for error messages
2. Make sure all environment variables are set in `.env.local`
3. Restart the dev server: Stop with `Ctrl+C`, then `npm run dev`

### Vercel deployment fails
**Solution:**
1. Check that all environment variables are added in Vercel
2. Make sure `NEXTAUTH_URL` matches your Vercel URL exactly
3. Try redeploying

---

## 📝 Daily Development Workflow

When you want to work on the app:

1. Open VS Code
2. Open Terminal
3. Type: `npm run dev`
4. Go to `http://localhost:3000` in browser
5. Make changes to code
6. Browser auto-refreshes!

When you're done:
- Press `Ctrl+C` in terminal to stop the server
- Close VS Code

---

## 🚀 Updating the Live Site

When you make changes and want them on the live site:

```bash
git add .
git commit -m "Describe what you changed"
git push
```

Vercel will automatically deploy your changes in ~2 minutes!

---

## 💡 Need Help?

If you get stuck:
1. Read the error message carefully
2. Google the error message
3. Check MongoDB Atlas dashboard (is your cluster active?)
4. Check Vercel logs (Settings → Functions → View logs)
5. Ask for help with the specific error message

**Common resources:**
- Next.js docs: https://nextjs.org/docs
- MongoDB docs: https://docs.mongodb.com
- Vercel docs: https://vercel.com/docs

---

## 🎮 How to Use the App

### Creating Tasks
1. Click the **"+ New Task"** button
2. Fill in title (required)
3. Add description (optional)
4. Set deadline (optional - but if you miss it, you lose 1 HP!)
5. Add subtasks for more XP
6. Choose visibility (private/shared/joint)

### Gamification Mechanics
- **XP:** Earn by creating/completing tasks
- **Health:** Lose 1 HP per missed deadline, gain 1 HP per completed task (if under max)
- **Streaks:** Complete 100% of daily tasks to earn 1 streak
- **Fragments:** Complete 80-99% of daily tasks to earn 1 fragment (5 fragments = 1 streak)
- **Death:** Hit 0 HP and you can't use the app for 3 days OR spend streaks to revive
- **Leveling:** Every 5 levels = +2 max HP

### Friend System
(Note: Friend features are in the API but UI is minimal - you can add this later!)

---

**Congratulations! You've built and deployed a full-stack gamified task management app!** 🎉
