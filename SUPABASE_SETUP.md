# Supabase + Google sign-in — setup (≈10 min)

Follow these steps once. When done, paste 2 values into `.env.local` and restart.

---

## 1. Create the Supabase project
1. Go to **https://supabase.com** → sign in → **New project**.
2. Name it `arva-drawing-pad`, pick a region close to you, set a database password.
3. Wait ~2 min for it to provision.

## 2. Create the database tables
1. In the left sidebar: **SQL Editor → New query**.
2. Open the file `supabase/schema.sql` from this project, copy **all** of it, paste, and click **Run**.
3. You should see “Success”. (This creates `projects`, `polls`, sharing policies, etc.)

## 3. Turn on Google sign-in
You need a Google OAuth client. ~5 minutes:

**A. In Google Cloud Console** (https://console.cloud.google.com):
1. Create/select any project (top bar).
2. **APIs & Services → OAuth consent screen** → choose **External** → fill app name “Arva Talks Academy”, your email → Save (you can leave it in “Testing”).
3. **APIs & Services → Credentials → Create Credentials → OAuth client ID**.
   - Application type: **Web application**
   - Name: `Arva Web`
   - **Authorized redirect URI** — add this (replace `YOUR-REF`):
     ```
     https://YOUR-REF.supabase.co/auth/v1/callback
     ```
     (Find `YOUR-REF` in Supabase → Project Settings → Data API → it’s the part before `.supabase.co` in your Project URL.)
4. Click **Create**. Copy the **Client ID** and **Client secret**.

**B. In Supabase** (your project):
1. **Authentication → Sign In / Providers → Google** → enable it.
2. Paste the **Client ID** and **Client secret** → **Save**.

## 4. Allow the app’s URLs
In Supabase → **Authentication → URL Configuration**:
- **Site URL**: `http://localhost:3000`
- **Redirect URLs** → Add: `http://localhost:3000/**`
- (Later, when you deploy, add your real site URL the same way.)

## 5. Add your keys to the app
In Supabase → **Project Settings → Data API** (and **API Keys**), copy:
- **Project URL**
- **anon public** key

Create a file named `.env.local` in the project root (copy from `.env.local.example`) and fill in:
```
NEXT_PUBLIC_SUPABASE_URL=https://YOUR-REF.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...your-anon-key...
```

## 6. Restart
```
npm run dev
```
Open http://localhost:3000/board → click **Sessions** (top-right) → **Sign in with Google**.

---

### What you get once connected
- **Sign in with Google** (mentors).
- **Save current** session to the cloud + auto-save while teaching.
- **My sessions** library — reopen any class on any device.
- **Share** button on each session → copies a public read-only link
  `…/s/<id>` students can open after class (slides with prev/next). Click share
  again to stop sharing.

> The app keeps working **without** these keys — it just stays in local
> browser-only mode (no login, no cloud library).
