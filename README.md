# Laboratory Management System (LMS)

A local-development starter system with:
- Patient registration and search
- Laboratory order/test registration
- Test status and result entry
- Payment tracking (partial/full payment)
- Manager dashboard (patients, orders, unpaid balance, revenue)
- Role-based HTTP Basic authentication (MANAGER, RECEPTIONIST, LAB_TECHNICIAN, CASHIER)

## Technology
- Frontend: React + Vite
- Backend: Java 17 + Spring Boot 3 + Spring Data JPA + Spring Security
- Database: MySQL 8+

## 1. Create the database
Open MySQL and run:
```sql
CREATE DATABASE laboratory_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

## 2. Configure backend
Edit `backend/src/main/resources/application.properties`:
- Set your MySQL username/password.
- Set strong passwords for all demo users. The included values are for local development only.
- Do not expose this development configuration to the public internet.

## 3. Run backend (Windows CMD)
```bat
cd backend
mvnw.cmd spring-boot:run
```
If Maven Wrapper is not available on your machine, install Maven and run:
```bat
mvn spring-boot:run
```
Backend: http://localhost:8080
API base: http://localhost:8080/api

## 4. Run frontend (new CMD window)
```bat
cd frontend
npm install
npm run dev
```
Frontend: http://localhost:5173

Login demo accounts (change passwords before real use):
- Manager: `manager` / `Manager@12345`
- Receptionist: `reception` / `Reception@12345`
- Lab technician: `technician` / `Technician@12345`
- Cashier: `cashier` / `Cashier@12345`

## Main API endpoints
- `GET/POST /api/patients`
- `GET /api/patients/{id}`
- `GET/POST /api/orders`
- `PATCH /api/orders/{id}/status`
- `PATCH /api/orders/{id}/result`
- `PATCH /api/orders/{id}/payment`
- `GET /api/dashboard/summary`

## Important clinical and security notes
This is a functional starter/MVP, not a certified clinical information system. A qualified laboratory professional must verify and authorize every result. It does not interpret results or provide diagnoses. Before using real patient data, have the system reviewed for your local health-data, laboratory, privacy, backup, audit, and security requirements. Replace demo passwords, use HTTPS, restrict network access, configure automated encrypted backups, and add an audit trail and patient-consent workflow. Do not use the demo credentials with real patient data.
