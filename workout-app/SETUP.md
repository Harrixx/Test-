# Setting up Lift Log with accounts

Lift Log runs in two modes:

- **On this device** (no setup): leave `config.js` empty. Everything is saved in the browser on that phone. This is how the Claude preview link works.
- **Accounts** (this guide): people sign up with email and password, and their plans and logs sync across their devices. Each person only ever sees their own data.

Everything below is on free plans. Use a **new** Supabase project and a **new** hosting project, separate from anything else you run.

## 1. Create the database (Supabase, free)

1. Go to https://supabase.com, sign in and click **New project**. Name it `lift-log`, pick the London region (eu-west-2), and save the database password somewhere safe.
2. When it's ready, open **SQL Editor**, paste in the whole of `supabase/schema.sql` and click **Run**. It's safe to run again later.

## 2. Turn on email sign-up

In **Authentication > Sign In / Providers**:

1. Make sure **Email** is enabled.
2. Leave **Confirm email** on, so people have to confirm their address before logging in.
3. Set the minimum password length to 8.

In **Authentication > URL Configuration**:

1. Set **Site URL** to the address the app will live at, e.g. `https://lift-log.netlify.app` (you get this in step 4, so come back and fill it in).
2. Add the same address under **Redirect URLs**. Confirmation and password-reset links send people back here.

**Emails:** Supabase's built-in email sender only sends a few emails an hour and is meant for testing. Before inviting more than a couple of people, add your own SMTP under **Authentication > Emails > SMTP settings**. Resend's free plan (3,000 emails a month) works well.

## 3. Connect the app

Open **Project Settings > API** (or **API Keys**) and copy:

- the **Project URL**
- the **publishable** key (older projects call it the `anon` `public` key)

Paste them into `config.js`:

```js
window.LIFTLOG_CONFIG = {
  supabaseUrl: "https://abcdefgh.supabase.co",
  supabaseKey: "sb_publishable_..."
};
```

The publishable key is designed to be public. Row-level security in `schema.sql` is what keeps each person's data private. **Never** put the `service_role` or secret key in this file.

## 4. Put it online (free)

The app is plain files, with no build step. Deploy the whole `workout-app` folder. Pick one:

- **Netlify Drop:** go to https://app.netlify.com/drop and drag the `workout-app` folder onto the page. Rename the site under **Site configuration** to get a tidy address.
- **Vercel:** create a new project from this GitHub repo and set **Root Directory** to `workout-app`. Don't add it to an existing project.
- **Cloudflare Pages:** connect the repo and set the output directory to `workout-app`.

Then go back to step 2 and put the address in **Site URL** and **Redirect URLs**.

## 5. Add it to your phone's home screen

Open the address in Safari, tap **Share > Add to Home Screen**. On Android in Chrome: **⋮ > Add to Home screen**. It then opens full-screen like an app.

## Checking it works

1. Open the site, tap **Create an account**, and sign up.
2. Confirm the email, log in, pick a plan and log a set. The header should say **Saved**.
3. Log in on another phone or browser. Your plan and the set should be there.
4. In Supabase, **Table Editor > lift_logs** shows one row per person.

## Making changes

- Exercises and animations: `exercises.js` (`LIB` for text, `FIG` for the figure).
- Guides and ready-made plans: `guides.js`.
- The app itself: `app.html`. Then run `./build.sh` to regenerate `index.html`, which is the file the hosting serves.

## Good to know

- People can't delete their own account from the app yet. To remove someone, delete them in Supabase under **Authentication > Users**, and their data goes with them.
- The nutrition calculator gives general estimates, not medical advice, and says so in the app.
