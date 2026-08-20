# Portfolio Handover Documentation

**Website:** [https://drwaeldk.com](https://drwaeldk.com)  
**Dashboard:** [https://drwaeldk.com/dashboard](https://drwaeldk.com/dashboard)  
**Prepared for:** Dr. Wael A. Al-Dakroury

This guide explains how to use and update the website from the dashboard, how to keep the design looking clean, and where everything is hosted and managed.

---

## Table of contents

1. [Section 1 — How to use the website & dashboard](#section-1--how-to-use-the-website--dashboard)
2. [Section 2 — Keeping the website looking presentable](#section-2--keeping-the-website-looking-presentable)
3. [Section 3 — Website information (host, domain, storage, accounts)](#section-3--website-information-host-domain-storage-accounts)

---

# Section 1 — How to use the website & dashboard

## 1.1 Website pages (what visitors see)

| Page | URL | What it shows |
|------|-----|---------------|
| Home | `/` | Hero banner, profile & credentials wheel, affiliations, Why Trust, services preview, promo video, field activity preview, testimonials, contact |
| About Me | `/about-me` | Full profile, certificates, career timeline, leadership/service, publications |
| Services | `/services` | Therapy service cards, clinical expertise cases, testimonials |
| Gallery | `/gallery` | Featured videos, video library, promo banner, photo/video gallery |
| In the Field | `/in-the-field` | Interactive globe, events timeline, memberships, closing CTA band |
| Contact | `/contact` | Location, hours, email/phone, appointment form |

The top menu links to these pages. The floating contact button and footer also lead visitors to Contact.

---

## 1.2 Opening the dashboard

1. Go to **https://drwaeldk.com/dashboard**
2. Sign in with your **dashboard admin email and password** (the Supabase admin account linked to this project).
3. After login you see the **Content Manager** sidebar on the left and the editor for the selected section on the right.
4. Use **View live site** (bottom of the sidebar) or each panel’s **Preview live page →** link to check the public site after saving.
5. Click **Log out** in the top-right when you are finished.

**Important:** Changes only appear on the live website after you press the relevant **Save** button (for example *Save changes*, *Save header*, *Save profile*, *Save service*). Editing a field without saving will not update the site.

---

## 1.3 Dashboard overview

The left sidebar has six main sections. Each one matches a part of the website:

| Dashboard section | Controls content on… |
|-------------------|----------------------|
| **Home** | Home page top areas (hero, credentials wheel, affiliations, Why Trust) |
| **About Me** | About Me page + home profile text/photo |
| **Services** | Services page + home services preview, clinical cases preview, testimonials |
| **Gallery** | Gallery page + home promo video banner |
| **In the Field** | In the Field page + home activity cards |
| **Contact** | Contact section (also used on the home page contact area) |

Inside each section, blocks are listed in roughly the **same order** as they appear on the live page.

---

## 1.4 Home (Dashboard → Home)

**Live page:** `/`

### Hero section
- **Where it appears:** Very top of the home page (full-width banner).
- **What you can edit:**
  - Desktop background image
  - Mobile background image (phones / small screens)
  - Professional title, name, description
  - Primary and secondary button labels
- **Tip:** Use a wide landscape photo for desktop. Mobile can use a tighter crop if needed.

### Credentials wheel
- **Where it appears:** Inside the profile area on the home page (interactive ring / compass).
- **What you can edit:** Tagline, and each ring point (short ring label, center title, detail text).
- Add, edit, or delete points with **Add point** / **Edit** / **Delete**.

### Affiliations
- **Where it appears:** Below the profile bio on the home page (organization logos).
- **What you can edit:** Section title, subtitle, “view all” label, and each affiliation (name, role, logos).
- Logo options include fit (contain/cover) and optional badge logo layouts.

### Why Trust
- **Where it appears:** Home page “Why Trust” block with side image and paragraphs.
- **What you can edit:** Eyebrow label, title, side image, paragraphs.

> Other home sections (services preview, promo video, field events, testimonials, contact) are edited from **Services**, **Gallery**, **In the Field**, and **Contact** respectively — see below.

---

## 1.5 About Me (Dashboard → About Me)

**Live page:** `/about-me` (profile text/photo also feed the home profile)

### About Dr. Wael (profile)
- **Name, tagline, title**
- **Credentials** list
- **Homepage bio** — short paragraphs on the **home** profile only
- **About page bio** — full paragraphs on **About Me**
- **Profile photo**
- **Career impact stat cards** (four number cards under the bio on About Me)

Save with **Save profile** and **Save stat cards**.

### Certificates & training archive
- **Where it appears:** About Me → Certificates gallery.
- Edit section label/title, then manage certificate cards.
- Each certificate: title, year, issuer, description, and **certificate image**.
- **Featured slots 1–9:** checkboxes choose which certificates appear first on About Me (and on page 1 in the dashboard list). If none are selected, the nine most recently added are used.

#### Feature: Edit certificate photo (simple guide)

Certificate photos often come from a phone (desk, wall, uneven lighting). The site includes an **Edit certificate photo** tool so every certificate looks clean in the same **landscape (4:3)** card.

**How to upload and edit:**

1. Open a certificate → **Certificate image**.
2. Drop or choose a photo (JPG, PNG, WebP, etc., max about **12 MB**).  
   - **HEIC/HEIF** (common iPhone format) is **not** supported — convert to JPG or PNG first.
3. The **Edit certificate photo** window opens automatically.
4. In that window you can:
   - **Drag** the photo inside the orange frame and use **Zoom** (See more ↔ Closer).
   - Choose an **Improve style**, then press **Improve photo**:
     | Style | What it does |
     |-------|----------------|
     | **Center only** | Frame & center — keeps exact original colors (Strength not used) |
     | **Fix light** | Gentle exposure — keeps natural color |
     | **Clear details** | Sharper seals & text — no color shift |
     | **Balanced** | Light + clarity — recommended |
     | **Vivid** | Richer color for dull phone photos |
   - Set **Strength**: Subtle / Normal / Strong (except with Center only).
   - Choose **Background**:
     - **White** or **Black** — clean studio look
     - **Keep photo** — matches the photo’s own background so the card fills seamlessly
   - Optional: turn on **Clear background** only if you want a cutout studio look (off by default). The first time you use it, the AI model may need to download.
5. Press **Improve photo** to apply the style, adjust drag/zoom if needed, then press **Save** to upload.
6. You can also crop and **Save** without improving if the photo already looks good.
7. **Cancel** closes without uploading.

**After a photo is saved:**

- **Replace** — upload a new original photo (opens the editor again).
- **Edit photo** — re-open the editor on the last saved card image so you can improve/crop again. Settings from the last save are restored when possible.
- **Remove** — clears both the remastered card image and the original.

The original upload is kept so you can re-edit later. After the image looks right, press **Save** on the certificate form so the live About Me page keeps it.

### Career timeline
- **Where it appears:** About Me timeline.
- Edit section header (label, title, intro) and timeline entries (year, type, title, organization, etc.).

### International leadership & professional service
- **Where it appears:** About Me leadership / academic service tabs.
- Edit section header, categories (tabs), and entries inside each category (title, org, period, description, optional links, journals, workshops).

### Refereed publications
- **Where it appears:** About Me publications list.
- Edit section header and papers (year, type, title, venue, etc.).

---

## 1.6 Services (Dashboard → Services)

**Live pages:** `/services` and related blocks on `/`

This panel is one of the most important content areas.

### Services section header
- **Where it appears:** Heading under the Services page hero (the large top hero title itself is fixed).
- Fields: section title, tagline, intro.

### Service pathway cards (therapy services)
- **Where they appear:**
  - Full detail cards on **Services** (`/services`)
  - Preview cards on the **Home** services section
- **What you can edit per service:**
  - Title, subtitle
  - **Summary** — shown on the **homepage** preview only (not on the Services page)
  - **Cover image** — one shared original, framed separately for two places (see below)
  - Detail paragraphs and optional bullet points (Services page)

#### Feature: Service cover images (upload once, frame twice)

Each service uses **one original photo**, then two separate framed versions:

| Card | Ratio | Where it appears |
|------|-------|------------------|
| **Services page card** | **5:4** | Detail cards on `/services` |
| **Homepage service card** | **1:1** (square) | Side image in the homepage services section |

**How to use it:**

1. Open a service → **Cover image**.
2. **Upload once** (drop or choose a photo). Same rules as certificates: JPG/PNG/WebP, max ~12 MB, no HEIC.
3. The editor opens first for the **Services page** frame (5:4). Use the same tools as certificates:
   - Drag + Zoom
   - Improve style + Strength
   - Background (White / Black / Keep photo)
   - Optional Clear background
   - **Improve photo** → adjust → **Save**
4. After that, you see two previews side by side:
   - **Services page card (5:4)** — **Edit photo** / **Clear frame**
   - **Homepage service card (1:1)** — **Edit photo** / **Clear frame**
5. Click **Edit photo** on the homepage card to frame the **same original** for the square home layout (Improve fills the card edge-to-edge so there are no empty bars).
6. **Replace original** uploads a new shared photo (you will need to frame each card again).
7. **Remove all** clears the original and both framed images.
8. Press **Save service** on the form so the live site keeps everything.

**Simple tip:** Upload a photo with room around the subject, frame the 5:4 card for Services, then frame the 1:1 card for Home — same photo, two clean crops.

### Clinical Expertise section
- **Where it appears:** Cases / clinical specializations on Services; a selection also feeds the home services area.
- Edit section title/intro.
- Each case can include: title, abbreviation, category, filter group (Neurodevelopmental, Learning, Developmental, Communication), excerpts (Services + homepage), cover image, detail paragraphs, therapy areas.
- **Featured slots:** choose which cases appear first (up to 10 featured slots). Unchecked cases still exist in the full list.

### Testimonials
- **Where they appear:** Services page and home testimonials showcase.
- Edit section header (eyebrow, title, description) and each testimonial (quote, name, details, etc.).

---

## 1.7 Gallery (Dashboard → Gallery)

**Live page:** `/gallery` (promo video also on home)

### Watch section (two featured videos)
- **Where it appears:** Directly under the Gallery page hero.
- First video: text left / video right  
- Second video: video left / text right  
- Per video: YouTube ID or URL, title, poster image, paragraphs.

### Video library
- **Where it appears:** “Key moments” cards under the Watch section.
- Edit label, title, description, and each moment video.
- Featured slot checkboxes control which items appear first / on homepage-related selections where applicable.

### Promo video section
- **Where it appears:**
  - Gallery page (featured video banner)
  - Home page (after the services preview)
- Edit: background video file, eyebrow, headline, description, primary/secondary button labels.

### Photo & video gallery
- **Where it appears:** Bottom of the Gallery page.
- Edit header text and gallery items (images/videos, captions, featured order).

---

## 1.8 In the Field (Dashboard → In the Field)

**Live page:** `/in-the-field` (selected events also on home)

### Earth globe
- Header text (label, title, description).
- **Globe countries:** add countries/locations that appear as points on the interactive map.

### Dr. Wael’s month & year (events)
- Section header + event cards (upcoming shown distinctly).
- Each event has media, dates, titles, descriptions, etc.
- **Homepage slots (Left / Middle / Right):** choose the three events on the home page. If none are selected, the three most recently added events appear.
- Separate In-the-Field featured slots control prioritization on the full page.

### Professional membership
- Section header + organization cards (logos, names, roles).

### Academic & Clinical Presence (closing band)
- Bottom call-to-action on In the Field (label, title, description, button labels).

---

## 1.9 Contact (Dashboard → Contact)

**Live pages:** `/contact` and the contact block on home

### Section header
- Label, title, intro above the contact layout.

### Location card
- Practice name, department, city.

### Office hours
- Hours for each day; optional weekend flag.

### Email & phone
- Direct contact details shown beside the location card.

The appointment form on the contact page sends messages to the connected inbox (**info@drwaeldk.com** via the form service). You do not edit the form fields themselves from the dashboard—only the surrounding contact information.

---

## 1.10 Quick “where do I edit this?” map

| I want to change… | Open dashboard section | Appears on |
|-------------------|------------------------|------------|
| Home banner photo / name / CTAs | Home → Hero | Home |
| Credentials ring points | Home → Credentials wheel | Home |
| Affiliation logos | Home → Affiliations | Home |
| Why Trust text/image | Home → Why Trust | Home |
| Profile photo / bio | About Me → About Dr. Wael | Home + About Me |
| Certificates | About Me → Certificates | About Me |
| Timeline / leadership / papers | About Me | About Me |
| Therapy services & dual frames | Services → Service pathway cards | Home + Services |
| Clinical cases | Services → Clinical Expertise | Services (+ home preview) |
| Testimonials | Services → Testimonials | Home + Services |
| Featured YouTube blocks | Gallery → Watch | Gallery |
| Promo video banner | Gallery → Promo video | Home + Gallery |
| Photo gallery items | Gallery → Photo & video gallery | Gallery |
| Globe / events / memberships | In the Field | In the Field (+ home events) |
| Address, hours, email, phone | Contact | Home + Contact |

---

# Section 2 — Keeping the website looking presentable

These habits keep the site looking professional after every update.

## 2.1 Match photos to the frame shape

Different places on the site use different frames. Always choose (or crop) photos that fit the shape:

| Frame type | Shape | Common uses |
|------------|-------|-------------|
| **Horizontal / landscape** | Wider than tall | Home hero (desktop), certificate cards (4:3), services page service cards (5:4), many gallery / case covers |
| **Square** | Equal sides | Homepage service side image (1:1), logos, some membership / affiliation marks |
| **Vertical / portrait** | Taller than wide | Some profile or phone layouts |

**Do:**
- Prefer landscape for wide banners, certificates, and Services page cards.
- Prefer **square** crops for homepage service images.
- Use the built-in **Edit photo / Improve photo** tools whenever the dashboard offers them.

**Don’t:**
- Upload a tightly cropped face into a wide banner (empty stretched sides or awkward cuts).
- Force a tall poster into a wide or square frame without editing first.
- Upload HEIC iPhone photos without converting to JPG/PNG.

## 2.2 Shoot photos with room to edit

When you take a photo that will go on the website:

1. Stand back a little — capture a **wide scope**, not only the object filling the whole lens.
2. Leave space around certificates, people, and logos so you can crop later.
3. Keep the subject centered-ish, with light as even as possible.
4. Avoid extreme tilt; straighten later if needed, but start fairly level.

Close-up shots leave almost no crop room. Wider shots let the Edit photo tool fix framing cleanly for 4:3, 5:4, or 1:1 cards.

## 2.3 Keep text length suitable for each section

Every text box sits inside a designed layout. Too much text can overflow, wrap badly, or make the page look crowded.

**Guidelines:**
- **Hero description:** a short paragraph (a few lines), not an essay.
- **Section intros:** 2–4 short sentences is usually enough.
- **Card summaries / excerpts:** 1–3 short sentences.
- **Button labels:** a few words (“Book a consultation”, “View services”).
- **Credentials wheel ring labels:** very short phrases.
- **Certificate descriptions:** keep readable; visitors also see title, issuer, and year.

After saving, open **Preview live page** on phone and desktop. If a block looks cramped, shorten the text rather than fighting the layout.

## 2.4 Images quality checklist

- Prefer clear, sharp photos (not blurry phone shots).
- Avoid heavy filters that clash with the site’s calm clinical look.
- Logos: use transparent PNG when possible; keep them readable on light backgrounds.
- Videos: use decent resolution; large files use more storage (see Section 3).
- For certificates and services, use **Improve photo** (Balanced is a good default) when phone lighting looks dull.
- Replace temporary / personal background clutter when needed (optional **Clear background**, or White/Black studio backgrounds).

## 2.5 Consistency habits

- Keep naming style consistent (same capitalization for titles).
- Prefer similar photo style within one section (e.g. certificates with a clean, consistent look).
- When adding many items (certificates, events, cases), fill **featured slots** intentionally so the first screen shows your best items.
- Delete outdated drafts instead of leaving empty or placeholder cards.
- After big edits, hard-refresh the live page (or open in a private window) so you are not looking at an old cached image.

## 2.6 Before / after save routine

1. Edit in the dashboard.
2. For photos: finish **Edit photo** → **Save** in the photo window, then press the section’s **Save** button (certificate / service / etc.).
3. Wait for the success message.
4. Click **Preview live page →**.
5. Check desktop and mobile widths.
6. Adjust crop or shorten text if anything looks off.

---

# Section 3 — Website information (host, domain, storage, accounts)

## 3.1 Project architecture (simple)

This portfolio **does not use a custom backend server**.

- The public site is a front-end application.
- All editable content and uploaded media are stored in **Supabase** (database + file storage).
- The dashboard reads and writes that Supabase data after you sign in.
- Hosting of the website files is on **Vercel**.

So: **Vercel shows the website · Supabase stores the content.**

## 3.2 Domain name

| Item | Detail |
|------|--------|
| **Domain** | `drwaeldk.com` |
| **Registrar** | Namecheap |
| **Billing** | Domain is paid **annually** |
| **Current term** | Purchased for **2 years** — must be **renewed after those 2 years** so the website address stays active |

### Namecheap account (domain management)

- **Username:** `waelslp`
- **Password:** `YousifWael26`
- **Login:** [https://www.namecheap.com/myaccount/login/](https://www.namecheap.com/myaccount/login/)

Use Namecheap to renew the domain, manage DNS pointing to the host, and review domain email/DNS settings if needed.

> Keep this password private. Change it if it has been shared beyond trusted people, and store the new password somewhere safe.

## 3.3 Website hosting (Vercel)

| Item | Detail |
|------|--------|
| **Host** | Vercel |
| **Current plan** | **Free** host on our end (**shared host**) |
| **What that means** | The live site runs on the free/shared hosting setup managed for this project |

**If you need a higher hosting plan later:**
- Upgrading to a **Vercel Pro** (paid) host is possible when traffic or features require it.
- That upgrade should be **requested from us** (the development team) so deployment and billing are handled correctly.

**If you want your own dedicated hosting account:**
- You may purchase and use your own host at any time.
- Ask us to help reconnect the domain and deployment so nothing breaks during the move.

## 3.4 Supabase (content & media storage)

| Item | Detail |
|------|--------|
| **Role** | Stores all dashboard content and uploaded images/videos |
| **Current plan** | **Supabase Free plan** |
| **Access** | Project is tied to **Dr. Wael’s Google account** — sign in to Supabase with Google to open the project console |

On the free plan, storage space is limited. When storage is nearly full you will need to either:

1. **Delete unused media/content**, or  
2. **Upgrade to Supabase Pro** (paid monthly)

Until storage is freed or upgraded, new uploads may fail.

**Dashboard login** uses the admin email/password configured in Supabase for publishing. The **Supabase project itself** (tables, storage bucket, users) is accessed by signing into Supabase with the Google account that owns the project.

## 3.5 Professional email

| Item | Detail |
|------|--------|
| **Address** | `info@drwaeldk.com` |
| **Provider** | Zoho Mail |
| **Use** | Website contact identity; form submissions are connected to this address |

Log in to Zoho Mail with the account created for this mailbox to read and send mail as `info@drwaeldk.com`.

## 3.6 Cost summary (at a glance)

| Service | Plan now | Billing |
|---------|----------|---------|
| Domain (`drwaeldk.com`) | Active (2-year purchase) | Renew **annually** via Namecheap after the prepaid period |
| Website host (Vercel) | Free / shared (on our end) | Pro upgrade only if requested / purchased later |
| Supabase | Free | Upgrade to Pro **monthly** if storage/limits are exceeded |
| Zoho Mail | Connected for `info@drwaeldk.com` | Per Zoho’s plan for that mailbox |

## 3.7 Who to contact for technical upgrades

For hosting upgrades, moving to a private Vercel account, Supabase Pro migration, or deployment issues, contact the development team that delivered this portfolio. Domain renewal and mailbox day-to-day use can be handled directly in Namecheap and Zoho with the accounts above.

---

## Quick start checklist

1. Open **https://drwaeldk.com/dashboard** and sign in.  
2. Choose the sidebar section that matches the page you want to update.  
3. Edit text/images → press **Save** (and **Save service** / certificate **Save** after photo edits).  
4. Use **Preview live page →** and check mobile + desktop.  
5. For certificates: upload → **Improve photo** (optional) → crop/zoom → **Save** → save the certificate. Use **Edit photo** anytime to re-adjust.  
6. For services: **upload once** → frame **5:4** for Services → frame **1:1** for Home → **Save service**.  
7. Keep photos wide enough to crop, and keep text short enough for the layout.  
8. Watch Supabase storage on the free plan; renew the domain before the 2-year term ends.

---

*End of Portfolio Handover Documentation*
