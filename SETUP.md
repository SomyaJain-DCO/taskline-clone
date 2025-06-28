# Task Management App Setup Guide

## Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Supabase account and project

## Environment Configuration

1. Create a `.env` file in the `frontend` directory with the following variables:

```env
REACT_APP_SUPABASE_URL=your_supabase_project_url_here
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

2. Replace the placeholder values with your actual Supabase project credentials:
   - Go to your Supabase project dashboard
   - Navigate to Settings > API
   - Copy the Project URL and anon/public key

## Database Setup

1. In your Supabase project, create a new table called `tasks` with the following structure:

```sql
CREATE TABLE tasks (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255),
  resource VARCHAR(255),
  entity_group VARCHAR(255),
  entity VARCHAR(255),
  state VARCHAR(255),
  task TEXT,
  tribunal_court VARCHAR(255),
  billing TEXT,
  reminder TEXT,
  others TEXT,
  fees TEXT,
  misc TEXT,
  status VARCHAR(50),
  due_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

2. Set up Row Level Security (RLS) policies as needed for your use case.

## Installation and Running

1. Install dependencies:
```bash
cd frontend
npm install
```

2. Start the development server:
```bash
npm start
```

3. Open [http://localhost:3000](http://localhost:3000) to view the app.

## Features

- **Task Dashboard**: View all tasks in a modern, responsive table
- **Status Tracking**: Color-coded status badges (Completed, Pending, Overdue)
- **Statistics**: Real-time counts of total, pending, completed, and overdue tasks
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Error Handling**: Graceful error handling for database connection issues

## Data Import

You can import your CSV data into the Supabase `tasks` table using:
1. Supabase Dashboard > Table Editor
2. Import CSV functionality
3. Or use the Supabase CLI for bulk imports

## Troubleshooting

- **Connection Errors**: Verify your Supabase URL and API key are correct
- **Empty Data**: Check that your `tasks` table exists and contains data
- **Build Errors**: Ensure all dependencies are installed with `npm install` 