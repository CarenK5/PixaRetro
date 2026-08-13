# PixaRetro

**On-demand booking platform for photographers and videographers**

PixaRetro is building a full-stack web application to connect clients with creative professionals. The project roadmap includes a production-ready webapp, followed by native Android and iOS mobile apps.

## 🎯 Project Vision

- **Phase 1**: Full-featured web application
- **Phase 2**: Android app
- **Phase 3**: iOS app

## ✨ Current Features

- Responsive landing page and hero sections
- Sign up and login flows (client & pro)
- Client and pro dashboards
- Portfolio browsing and search
- Booking and request workflows
- Profile management

## 🛠️ Tech Stack

**Frontend:**
- React + Vite
- HTML, CSS, JavaScript

**Backend:**
- Node.js
- Express.js

**Infrastructure:**
- Docker & Docker Compose
- MongoDB (planned)
- JWT Authentication (planned)

## Getting Started

### Prerequisites
- Node.js (v16+)
- npm or yarn
- Docker (optional)

### Installation & Development

1. Clone the repository:
```bash
git clone https://github.com/CarenK5/PixaRetro.git
cd pixaretro-local
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. (Optional) Run with Docker:
```bash
docker-compose up
```

## Contributing

We're actively building this platform. Contributions are welcome! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

## Roadmap

- [ ] Production-ready database integration
- [ ] Advanced matching algorithm
- [ ] Payment processing
- [ ] Rating and review system
- [ ] Android app (React Native)
- [ ] iOS app (React Native)

## License

MIT License - see [LICENSE](LICENSE) file for details

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
