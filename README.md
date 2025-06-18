# Cold Postgres

Automated PostgreSQL backups to Amazon S3 with Glacier storage class using cron schedules, Winston logging, and modular Node.js structure.

---

## 🚀 Features

- 🔁 Schedule PostgreSQL backups multiple times a day using cron expressions
- 🗃️ Upload `.sql` dumps directly to **Amazon S3** with `GLACIER` storage class
- 📝 Logs all operations using **Winston** with daily rotation
- 🧪 Environment validation with helpful error messages
- 📚 Converts cron strings to human-readable descriptions

---

## 🗂️ Project Structure

```
src/
├── index.js                 # Entry point
├── config/
│   └── env.config.js        # Environment variable validation and constants
├── lib/
│   ├── storage.js           # S3 client config and uploadToStorage() function
│   └── scheduler.js         # Loads cron schedules and triggers backup
├── utils/
│   ├── logger.js            # Winston logger with daily rotate
│   ├── cronToText.js        # Converts cron to human-readable text
│   └── createBackupDump.js  # Creates the Postgres dump and uploads it
.env.example                  # Sample environment configuration
```

---

## 📦 Requirements

- Node.js v16+
- PostgreSQL client utilities (`pg_dump`)
- AWS credentials with S3 write access

---

## 🛠️ Setup

1. **Clone the repo**

```bash
git clone https://github.com/rishikesh-suvarna/cold-postgres
cd cold-postgres
```

2. **Install dependencies**

```bash
npm install
```

3. **Configure environment variables**
   cp .env.example .env

4. **Edit `.env` file** with your PostgreSQL and AWS credentials:

```dotenv
# .env example
NODE_ENV=production
TZ=UTC

PG_HOST=localhost
PG_PORT=5432
PG_USER=postgres
PG_PASSWORD=yourpassword
PG_DATABASE=yourdb

AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_REGION=us-east-1

S3_BUCKET_NAME=my-backups
S3_PREFIX=postgres

CRON_SCHEDULES=*/30 * * * *,0 2 * * *
```
