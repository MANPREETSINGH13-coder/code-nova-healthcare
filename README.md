# Code Nova Healthcare

CareTrack-style professional healthcare frontend with Patient, Doctor and Super Admin dashboards.

## Features

- Patient login with mobile number or ABHA number
- Doctor and Super Admin login with email id and password
- Patient token generation and waiting time
- Doctor appointment approval dashboard
- AI assistant voice prompt and summary forwarding to doctor
- Reports, past health records and profile update sections
- Mic/camera permission demo button
- Super Admin analytics and doctor registration section
- FHIR + Supabase schema-ready structure
- Branding: Created by Code Nova

## Demo Login

Patient:

```txt
9876543210
patient123
```

Doctor:

```txt
doctor@codenova.test
doctor123
```

Super Admin:

```txt
admin@codenova.test
admin123
```

## Run Locally

```bash
npm install
npm run dev
```

Open the local URL shown by Vite, usually:

```txt
http://localhost:5173
```

## Build

```bash
npm run build
npm run preview
```

## Supabase

1. Open Supabase SQL editor.
2. Paste and run `supabase/schema.sql`.
3. Copy `.env.example` to `.env`.
4. Replace values with your Supabase project URL and publishable key.
