# Civic Issue Tracker - Development Prompts Log

This file contains the chronological list of AI prompts used to build the Civic Issue Tracker project from scratch. It serves as an implementation roadmap and documentation of the development process.

## Phase 1: Project Initialization & Architecture

```text
Task: Initialize the Civic Issue Tracker Project

I want to build a "Civic Issue Tracker" web application for a local Panchayat/Municipality.
Please set up a new project with the following stack:
- Next.js 16 (App Router)
- Prisma ORM with SQLite (for easy local development)
- Tailwind CSS & lucide-react for styling and icons

Define the Prisma Schema with the following models:
1. User Model: For authentication. Needs roles: ADMIN, OFFICER, CITIZEN. Also needs a 'ward' field (Int) for officers.
2. Complaint Model: Needs a unique Complaint ID, citizen name, phone, ward number, category (Water, Road, Electricity, etc.), description, image URL, status (OPEN, IN_PROGRESS, RESOLVED, CLOSED), and a relation to the Officer who handled it.

Set up the basic folder structure for the App Router (app/page.tsx, app/submit, app/track, app/dashboard/admin, app/dashboard/officer).
```

## Phase 2: Custom Authentication & Middleware

```text
Task: Implement Custom JWT Authentication and Role-Based Access

I want to implement custom authentication without using external libraries like NextAuth.
1. Create a secure JWT utility using `jose` and `bcryptjs` to hash passwords and sign tokens.
2. Build an API route `/api/login` that authenticates users and sets an HTTP-only secure cookie containing their Role and Ward (if applicable).
3. Build a Next.js Middleware (`middleware.ts`) that protects routes:
   - `/dashboard/admin` should only be accessible if role === ADMIN.
   - `/dashboard/officer` should only be accessible if role === OFFICER.
   - Redirect unauthorized users back to the `/login` page.
4. Create a clean UI for the `/login` page.
```

## Phase 3: Citizen, Officer, and Admin Dashboards

```text
Task: Build the Core Dashboards and Forms

1. Citizen Submission Form (`/submit`): Build a form for citizens to submit issues. It must include fields for Name, Phone, Ward Number, Category, Description, and an Image Upload. Use Next.js Server Actions to write to the SQLite database.
2. Officer Dashboard (`/dashboard/officer`): Build a secure page where an Officer logs in and ONLY sees complaints matching their assigned Ward. Add the ability for the Officer to update the complaint Status and write Internal comments/notes.
3. Admin Dashboard (`/dashboard/admin`): Build a global dashboard that fetches all complaints across all wards. Include aggregation logic to show total complaints, open tickets, resolved tickets, and SLA breaches (complaints older than 3 days). Include `recharts` to show visual bar charts and pie charts of Categories and Statuses.
```

## Phase 4: Dynamic File Uploads & Real-Time Polling

```text
Task: Implement Real Image Uploads and Live Auto-Refreshing

1. Fix the Image Upload: Instead of taking a URL string, update the Citizen Submission form to accept actual image file uploads. Create an API route `/api/upload` using the standard `fs` module to save images locally into the `public/uploads` directory.
2. Make Dashboards Real-Time: Build a Client Component `AutoRefresh.tsx` that uses `useRouter` and `setInterval` to trigger a `router.refresh()` every 5 seconds. Inject this hidden component into the Officer and Admin layout pages so the UI updates silently in the background without needing a manual browser refresh when new complaints come in.
```

## Phase 5: The Premium Dark Mode Overhaul & UX Polish

```text
Task: Dark Mode, Seeding, and Slide-Over Modal

I want to enhance the application to a highly premium, sleek Dark Mode aesthetic.
1. Global Theme: Overhaul `globals.css`, the Landing Page, Login, Admin, and Officer dashboards to use a deep dark theme (`bg-neutral-950`). Use glassy cards, subtle gradient background blurs, and neon accents. Update Recharts to use dark-mode compatible colors.
2. Officer Modal: Remove the inline table rows on the Officer dashboard. Instead, build an interactive Client Component (`ComplaintClientList.tsx`) so that clicking a complaint opens a beautiful slide-over sidebar/modal showing full citizen details, attached images, and the status update forms.
3. Database Seeding: Update `prisma/seed.ts` to wipe the database clean, generate exactly 1 Admin account with a hashed password, and generate 5 individual Officer accounts assigned to Wards 1 through 5. Generate a few realistic demo complaints (including one that breaches the 3-day SLA).
```

## Phase 6: Final Clean Slate & UI Normalization (The Most Recent Prompt)

```text
Task: Fix Status Check UI and Prepare Clean Database Seed

1. Update prisma/seed.ts for a "Clean Slate": Modify the seed script so it only creates the Admin account and the 5 Officer accounts. DO NOT create any mock complaints so I can test the full user journey from scratch.
2. Fix Citizen Status Check Page (`/track`): Apply the global dark mode design language (`bg-slate-950`). Style the search input with a dark background (`bg-slate-800`), white text, and glowing Tailwind text/background colors for the status badges (e.g., bg-yellow-500/20 text-yellow-400). Display the result in a sleek, floating dark card.
3. Global UI Consistency: Ensure all form inputs (Citizen submission, Admin login, Officer notes) globally use dark backgrounds (`bg-slate-800`) and light text (`text-gray-100`) so there are no blinding white inputs on dark pages.
```
