# PetMatch

## Prerequisites
- Docker Desktop installed
- Git

## Setup Instructions

1. Clone the repository:
```bash
git clone https://github.com/yourusername/petmatch.git
cd petmatch
```

2. Start all services:
```bash
docker-compose up --build
```

3. Access the application:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- MySQL: localhost:3307

## Stopping the Application
```bash
docker-compose down
```

## Rebuilding After Code Changes
```bash
docker-compose up --build
```

## Resetting the Database
```bash
docker-compose down -v  # Removes volumes
docker-compose up --build
```

## Project Structure
```
petmatch/
├── backend/          # Laravel API
├── frontend/         # React frontend
├── docker-compose.yml
└── README.md
```