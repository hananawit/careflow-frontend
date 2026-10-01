
  # CareFlow

### Modern Healthcare Management Platform

CareFlow is a full-stack hospital and healthcare management platform designed to bring clinical, administrative, and operational workflows into a unified digital system.

The project focuses on building a maintainable healthcare platform with modular architecture, role-based access control, configurable workflows, and a modern user experience.

## Live Demo

**Frontend:**
https://careflowhealth.netlify.app

**Backend API:**
https://careflow-backend-urkz.onrender.com

> The portfolio deployment runs in **Demo Mode**, allowing visitors to explore the system without creating an account or configuring an external identity provider.

---

## Overview

CareFlow provides a centralized platform for managing healthcare operations across multiple hospital workflows.

The system includes functionality for:

* Patient management
* Hospital and department management
* Staff and user management
* Doctor and clinical workflows
* Appointments
* Triage
* Encounters
* Consultations
* Prescriptions
* Laboratory requests
* Reports
* Hospital administration
* Role and permission management
* Configurable workflow support

The architecture is designed so that authentication, authorization, and hospital-level access controls can be enabled for a full production deployment.

---

## Technology Stack

### Frontend

* React
* TypeScript
* Vite
* Material UI
* React Router
* Keycloak integration
* REST API integration

### Backend

* NestJS
* TypeScript
* Prisma ORM
* PostgreSQL
* REST APIs
* JWT / Keycloak authentication
* Role-Based Access Control (RBAC)
* Permission-based authorization

### Infrastructure

* Netlify — frontend deployment
* Render — backend deployment
* Supabase — PostgreSQL database
* Keycloak — identity and access management for full deployments

---

## Architecture

```text
                    ┌──────────────────────────┐
                    │      CareFlow Frontend   │
                    │      React + TypeScript  │
                    │          Vite + MUI      │
                    └────────────┬─────────────┘
                                 │
                                 │ REST API
                                 ▼
                    ┌──────────────────────────┐
                    │      CareFlow Backend    │
                    │     NestJS + TypeScript  │
                    │                          │
                    │  RBAC / Authorization    │
                    │  Business Logic          │
                    │  REST APIs               │
                    └────────────┬─────────────┘
                                 │
                                 │ Prisma
                                 ▼
                    ┌──────────────────────────┐
                    │      PostgreSQL          │
                    │        Supabase          │
                    └──────────────────────────┘

             Full Deployment Authentication

                    ┌──────────────────────────┐
                    │         Keycloak         │
                    │ Identity & Access Mgmt   │
                    └────────────┬─────────────┘
                                 │
                                 ▼
                    CareFlow Backend / RBAC
```

---

## Demo Mode

The public portfolio deployment uses:

```text
DEMO_MODE=true
```

In this mode:

* No Keycloak server is required.
* Visitors can access the application without a password.
* A dedicated demo account is used by the backend.
* Demo data is pre-populated for exploration.
* The application's normal authentication architecture remains available in the codebase.

This approach allows the public demo to remain simple while preserving the architecture required for a full authenticated deployment.

### Demo Account

```text
Email: demo@careflow.local
Password: Not required in Demo Mode
```

---

## Security & Access Control

CareFlow was designed with security and authorization as core architectural concerns.

The backend supports:

* Keycloak-based authentication
* JWT validation
* Role-based access control
* Permission-based authorization
* Hospital-level access restrictions
* Protected API endpoints
* Explicit production CORS configuration
* Environment-based configuration
* Secure handling of application secrets

The public demo intentionally bypasses external identity-provider authentication through `DEMO_MODE`, while the full authentication implementation remains available for private/production deployments.

---

## Database & Migrations

CareFlow uses PostgreSQL with Prisma ORM.

Database schema changes are managed through Prisma migrations.

The deployment pipeline automatically performs:

```text
Prisma Client Generation
        ↓
Database Migration
        ↓
NestJS Build
        ↓
Application Start
```

The demo environment includes representative healthcare data for exploring the platform.

---

## Project Structure

### Frontend

```text
src/
├── app/
│   ├── components/
│   ├── context/
│   └── App.tsx
├── auth/
├── services/
├── main.tsx
└── ...
```

### Backend

```text
src/
├── auth/
├── patients/
├── appointments/
├── encounters/
├── consultation/
├── triage/
├── laboratory/
├── pharmacy/
├── staff/
├── users/
└── ...
```

---

## Development

### Frontend

```bash
npm install
npm run dev
```

Create a local `.env` file:

```env
VITE_API_URL=http://localhost:3000
VITE_DEMO_MODE=true
```

### Backend

```bash
npm install
npx prisma generate
npx prisma migrate deploy
npm run start:dev
```

Configure the backend environment variables according to the deployment environment.

For a full authenticated deployment, configure Keycloak and disable:

```env
DEMO_MODE=false
```

---

## Deployment

The portfolio environment is deployed using:

```text
GitHub
   │
   ├── CareFlow Frontend
   │        ↓
   │     Netlify
   │
   └── CareFlow Backend
            ↓
          Render
            ↓
         Supabase
```

The frontend and backend are maintained as separate repositories so that each application can be independently developed, tested, and deployed.

---

## Design Goals

CareFlow is being developed around several principles:

* **Modular architecture**
* **Clean API contracts**
* **Maintainability**
* **Security**
* **Configurable workflows**
* **Role-based access**
* **Scalable backend architecture**
* **Usable clinical interfaces**
* **Separation of frontend and backend concerns**
* **Production-oriented development practices**

The goal is not simply to create a collection of CRUD screens, but to establish a foundation for a healthcare platform that can evolve with different organizational workflows and requirements.

---

## Project Status

### Implemented

* Patient management
* Hospital management
* Staff management
* User management
* Role and permission management
* Appointment management
* Triage
* Encounters
* Consultations
* Prescriptions
* Laboratory requests
* Dashboard
* Reporting
* Demo deployment
* PostgreSQL persistence
* Keycloak integration architecture

### In Progress

CareFlow continues to evolve toward a more complete hospital information management platform, with additional workflows, integrations, configuration capabilities, and production-hardening planned.

---

## Author

**Hanan Temam**

Software Developer · Data Analyst · AI & Emerging Technology Researcher

CareFlow represents my work across full-stack software development, backend architecture, healthcare workflows, data management, authentication, and deployment.

---

## License

This project is maintained as a portfolio and demonstration project.

Please contact the author before using the code, design, or implementation in a production healthcare environment.
