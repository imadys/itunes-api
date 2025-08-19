# iTunes API

## Getting Started

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Environment Variables**
   Copy `.env.example` to `.env` and configure your database:
   ```bash
   cp .env.example .env
   ```

3. **Database Setup**
   ```bash
   npx prisma migrate dev
   ```

4. **Start Development Server**
   ```bash
   npm run start:dev
   ```

API will be available at `http://localhost:3000`
