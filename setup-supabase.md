# Quick Supabase Setup Guide

## Steps to get the integration working:

### 1. Create Supabase Project
1. Go to [supabase.com](https://supabase.com) and create a new project
2. Note down your project URL and anon key

### 2. Set Environment Variables
Create `.env.local` file:
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

### 3. Run Database Migrations
In your Supabase dashboard, go to **SQL Editor** and run these two files in order:

**First, run:** `/supabase/migrations/001_create_translations_schema.sql`
**Then, run:** `/supabase/migrations/002_seed_translations_data.sql`

### 4. Start the App
```bash
pnpm dev
```

The app will now load all content from Supabase! 

### 5. Verify Setup
- Check the browser console for any Supabase connection errors
- The app should show loading skeletons briefly, then display content
- If you see an error screen, check your environment variables and database setup

### Troubleshooting
- **Loading forever**: Check environment variables
- **Error screen**: Check if migrations were applied correctly
- **Empty content**: Verify the seed data was inserted

That's it! The integration is complete and working.