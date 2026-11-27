# Chatbit

Chatbit is a full-stack chat room application designed to provide a lightweight and interactive real-time communication experience. Users can create and join different chat rooms to communicate with others through text and voice messages.

The project focuses on room management, user authentication, real-time communication, voice message handling, and access control for private rooms.

## Related Project

[Chatbit Server](CHATBIT_SERVER_REPOSITORY_URL)

## Features

- **Room Management** — Create and manage public and private chat rooms.
- **Temporary and Permanent Rooms** — Support for rooms with configurable expiration times and permanent rooms.
- **Access Control** — Restrict access to private rooms using password protection.
- **Real-Time Messaging** — Send and receive messages using Socket.IO.
- **Voice Messages** — Record, upload, and play voice messages within chat rooms.
- **Audio Waveform** — Visualize audio waveforms and control voice message playback.
- **Room Members** — Display online members and track membership changes in real time.
- **Typing Indicator** — Show when other users are typing.
- **Message History** — Retrieve and display previous messages when joining a room.
- **Session Management** — Handle user authentication and sessions with Better Auth.
- **Room Expiration** — Handle expired rooms and notify connected users.
- **Responsive UI** — Interactive user interface designed for different screen sizes.

## Technologies

**Frontend**
- Next.js (App Router)
- React
- TypeScript
- Tailwind CSS
- shadcn/ui

**Backend & Database**
- Next.js Server Actions and Route Handlers
- Prisma ORM
- PostgreSQL
- Better Auth

**Real-Time Communication & Storage**
- Socket.IO Client
- Neon Object Storage
- AWS SDK (S3 Compatible)

**Additional Tools**
- WaveSurfer.js
- Sonner
- React Hook Form
- Zod
- pnpm

## Architecture

Chatbit uses Next.js App Router as its primary application architecture. The main application handles the user interface, authentication, database operations, and voice file management.

Real-time communication is handled by a separate Express and Socket.IO server, maintained in the `chatbit-server` repository.

Clients communicate with the real-time server through Socket.IO. Text messages are processed and persisted by the main application's backend before being broadcast to room members.

Voice messages are uploaded through HTTP endpoints and stored in Neon Object Storage. After a successful upload, the client notifies the Socket.IO server, which broadcasts the new voice message to other room members.

Prisma manages database access and relational data, while PostgreSQL stores application data.

## Getting Started

### Prerequisites

- Node.js
- pnpm
- PostgreSQL
- The Chatbit Server repository

### Installation

Clone the repository:

```bash
git clone <repository-url>
cd chatbit
```

Install dependencies:

```bash
pnpm install
```

### Environment Variables

Create a `.env` file and configure the required environment variables.

These include database connection settings, Better Auth configuration, the Socket.IO server URL, and Object Storage credentials.

### Database Setup

Generate Prisma Client and run the database migrations:

```bash
pnpm exec prisma generate
pnpm exec prisma migrate dev
```

### Run the Development Server

```bash
pnpm dev
```

The Socket.IO server from the `chatbit-server` repository must also be running to enable real-time features.

## Technical Goals

Chatbit provides practical experience with:

- Building a full-stack application using Next.js
- Implementing authentication and session management
- Designing relational database models with Prisma and PostgreSQL
- Implementing real-time communication using Socket.IO
- Managing users and membership in chat rooms
- Building real-time messaging functionality
- Handling voice uploads and audio playback
- Integrating HTTP-based backend operations with a separate Socket.IO server
- Implementing access control for private resources
- Building responsive and interactive user interfaces