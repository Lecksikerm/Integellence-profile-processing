🚀 Profile Intelligence Service

A backend service that enriches user names using multiple external APIs, processes the data, and exposes clean, idempotent RESTful endpoints.

---

✨ Overview

The Profile Intelligence Service is designed to:

🔗 Integrate with multiple third-party APIs
🧠 Process and structure enriched data
💾 Persist results in a database
🔁 Ensure idempotent operations (no duplicates)
⚡ Provide clean, consistent RESTful APIs

---

This project demonstrates strong backend engineering principles including API design, data validation, and error handling.

---

🧩 Features
✅ Name enrichment using:
Gender prediction
Age estimation
Nationality inference
✅ Data transformation & validation
✅ MongoDB data persistence
✅ Idempotent profile creation
✅ Filtering & querying support
✅ Clean and consistent API responses
✅ Robust error handling

---


🛠️ Tech Stack
Backend: Node.js, Express
Database: MongoDB (Mongoose)
HTTP Client: Axios
Utilities: UUID v7, dotenv, cors
🌐 External APIs Used
Genderize → Gender prediction
Agify → Age estimation
Nationalize → Country probability

---

📁 Project Structure
src/
├── config/          # Database connection
├── controllers/     # Request handlers
├── models/          # Mongoose schemas
├── routes/          # API routes
├── services/        # Business logic (API integration)
├── middleware/      # Error handling
├── utils/           # Helpers (age group, normalization)

----
