# PixaRetro

PixaRetro is a local web app for booking photographers and videographers on demand. The project includes a landing page, account flow, portfolio browsing, matching/search experience, and a lightweight local backend for development use.

## Overview

This project was built as a functional prototype to demonstrate:

- a marketing-style landing page
- client and pro onboarding flows
- profile and portfolio browsing
- booking / request workflows
- local persistence for demo data

## Features

- Responsive landing page and hero sections
- Sign up and log in flow
- Client dashboard
- Pro dashboard
- Explore and search for creators
- Portfolio and request management
- Local file-based or in-memory data fallback for easy testing

## Tech Stack

- HTML, CSS, JavaScript
- Node.js
- Express
- Local static file serving
- Lightweight demo storage layer

## Project Structure

```text
pixaretro-local/
├── public/
│   └── index.html
├── server.js
├── package.json
├── README.md
└── ...

pixaretro-backend/
├── server.js
├── data/
├── package.json
└── ...
```

## Run locally

1. Open a terminal in the frontend folder:

```bash
cd C:\Users\id40063857\Downloads\pixaretro-local
npm install
node server.js
```

2. Open a second terminal in the backend folder:

```bash
cd C:\Users\id40063857\Downloads\pixaretro-backend
npm install
node server.js
```

3. Open the app in a browser:

```text
http://localhost:3000/
```

## Notes

- The app is intended for local development and demo use.
- Sensitive configuration and deployment details should not be included in shared documentation.
- If a database or external API is later added, credentials should be stored securely in environment variables and not committed to source control.

## Development Notes

- The frontend serves the landing page and app shell.
- The backend provides data access and persistence layer support.
- When external services are unavailable, the app can run with safe demo/in-memory fallback data.

## License

This project is for local development and demonstration purposes only.
