# CareFlow

### Modern Healthcare Management Platform

CareFlow is a full-stack healthcare management platform designed to bring clinical, administrative, and operational workflows into a unified digital system.

It demonstrates production-oriented full-stack development across **React, TypeScript, NestJS, Prisma, PostgreSQL, RBAC, and Keycloak**, with a focus on modular architecture, maintainability, configurable workflows, and usability.

## Live Demo

**Application:** https://careflowhealth.netlify.app

**Backend API:** https://careflow-backend-urkz.onrender.com

> The public deployment runs in **Demo Mode**, allowing visitors to explore the application without configuring an external identity provider.

---

## What CareFlow Includes

CareFlow brings together major healthcare workflows in one platform, including:

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
* Reporting
* Role and permission management
* Configurable workflow support

The system is designed so authentication, authorization, and organizational access controls can be enabled for a full authenticated deployment.

---

## Technology Stack

### Frontend

* React
* TypeScript
* Vite
* Material UI
* React Router
* REST API integration
* Keycloak integration

### Backend

* NestJS
* TypeScript
* Prisma ORM
* PostgreSQL
* REST APIs
* JWT authentication
* Keycloak
* Role-Based Access Control (RBAC)
* Permission-based authorization

### Infrastructure

* Netlify — frontend
* Render — backend
* Supabase — PostgreSQL
* Keycloak — identity and access management

---

## Architecture

```text
┌─────────────────────────────┐
│       CareFlow Frontend     │
│   React + TypeScript + MUI  │
│            Vite             │
└──────────────┬──────────────┘
               │
               │ REST API
               ▼
┌─────────────────────────────┐
│       CareFlow Backend      │
│     NestJS + TypeScript     │
│                             │
│  Business Logic             │
│  RBAC / Authorization       │
│  REST APIs                  │
└──────────────┬──────────────┘
               │
               │ Prisma
               ▼
┌─────────────────────────────┐
│         PostgreSQL          │
│          Supabase           │
└─────────────────────────────┘

        Authentication
               │
               ▼
┌─────────────────────────────┐
│          Keycloak           │
│ Identity & Access Management│
└─────────────────────────────┘
```

---

## Authentication & Authorization

CareFlow supports a full authentication architecture based on **Keycloak** and JWTs.

The backend supports:

* Keycloak authentication
* JWT validation
* Role-based access control
* Permission-based authorization
* Protected API endpoints
* Hospital-level access restrictions
* Environment-based configuration
* Production CORS configuration

For the public portfolio deployment, authentication is intentionally simplified through **Demo Mode** so visitors can explore the application without running a separate Keycloak instance.

The full authentication architecture remains available for authenticated deployments.

---

## Demo Mode

The portfolio deployment uses:

```env
DEMO_MODE=true
```

Demo Mode provides:

* No external identity provider requirement
* Preconfigured demo access
* Representative healthcare data
* Full access to the available demonstration workflows

This allows the deployed application to remain accessible while keeping the production authentication architecture in the codebase.

---

## Database

CareFlow uses **PostgreSQL** with **Prisma ORM**.

Database changes are managed through Prisma migrations.

The backend deployment follows the general workflow:

```text
Prisma Client Generation
          ↓
Database Migration
          ↓
NestJS Build
          ↓
Application Start
```

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

## Running Locally

### Frontend

```bash
npm install
npm run dev
```

Example local environment:

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

For a full authenticated deployment, configure Keycloak and disable Demo Mode.

---

## Deployment

The portfolio deployment is structured as:

```text
GitHub
  │
  ├── CareFlow Frontend
  │        │
  │        ▼
  │      Netlify
  │
  └── CareFlow Backend
           │
           ▼
         Render
           │
           ▼
        Supabase
```

The frontend and backend are maintained as separate repositories so they can be developed, tested, and deployed independently.

---

## Engineering Focus

CareFlow was developed with an emphasis on:

* Modular architecture
* Clean API contracts
* Maintainability
* Security
* Configurable workflows
* Role-based access
* Separation of frontend and backend concerns
* Scalable backend design
* Usable clinical interfaces
* Production-oriented development practices

The goal is to provide more than a collection of CRUD screens: CareFlow is structured as a foundation that can evolve with different healthcare organizations and workflow requirements.

---

## Project Status

The current implementation includes:

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
* PostgreSQL persistence
* Keycloak integration
* Public demo deployment

CareFlow continues to evolve as a portfolio and engineering project, with additional workflow configuration, integrations, and production hardening planned.

---

## Author

**Hanan Temam**

Software Developer · Data Analyst · AI & Emerging Technology Researcher

CareFlow demonstrates my work across full-stack software development, backend architecture, healthcare workflows, data management, authentication, authorization, and cloud deployment.

---

## Portfolio Notice

CareFlow is maintained as a portfolio and demonstration project.

The application is intended to demonstrate software architecture and engineering practices and should not be used for handling real patient data without appropriate security, privacy, compliance, and operational controls.
