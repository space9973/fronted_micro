# Micro-Frontend Architecture Demo

This project demonstrates a micro-frontend architecture using Module Federation with Vite, React, and Firebase.

## Architecture Overview

The application consists of three main parts:

1. Host Application (Main)
   - Manages authentication and routing
   - Provides shared components and design system
   - Integrates micro-frontends

2. Chat Application (Micro-frontend)
   - Handles chat functionality
   - Uses Firebase Realtime Database

3. Email Application (Micro-frontend)
   - Manages email-related features
   - Independent deployment

## Technology Stack

- **Module Federation**: For micro-frontend implementation
- **Vite**: Build tool and development server
- **React**: UI library
- **Firebase**: Authentication and real-time data
- **Zustand**: State management
- **TailwindCSS**: Styling

## Setup Instructions

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## Architecture Decisions

### Module Federation
Chosen for its native integration with Vite and efficient runtime loading of micro-frontends.

### State Management
Zustand is used for its simplicity and easy sharing between micro-frontends.

### Authentication
Firebase Authentication provides secure, scalable user management.

### Styling
TailwindCSS ensures consistent styling across all micro-frontends.

## Adding New Micro-frontends

1. Create a new Vite project
2. Configure Module Federation
3. Add the remote entry to the host's vite.config.ts
4. Create a new route in the host application