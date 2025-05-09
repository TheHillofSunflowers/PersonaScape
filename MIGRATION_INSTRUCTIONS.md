# Migration Instructions for Profile Likes Feature

Follow these steps carefully to fix the migration issues and set up the likes feature:

## Step 1: Check Database State

First, make sure your database exists and has the initial migration applied:

```bash
cd backend
npx prisma migrate status
```

This will show you the current state of your migrations.

## Step 2: Create a New Migration

Instead of using our pre-created migration file, let Prisma create one based on the current schema:

```bash
cd backend
npx prisma migrate dev --name add_profile_likes
```

If you get any errors about the shadow database, you may need to reset it:

```bash
cd backend
npx prisma migrate reset
```

**Note:** This will clear your database and apply all migrations from scratch, then run your seed script.

## Step 3: Generate Prisma Client

After the migration is applied, regenerate the Prisma client:

```bash
cd backend
npx prisma generate
```

## Step 4: Seed the Database (Optional)

If you want to populate your database with some sample likes:

```bash
cd backend
npm run seed:likes
```

## Step 5: Start the Backend

Now you can start your backend server:

```bash
cd backend
npm run dev
```

## Alternative Approach (If Migration Still Fails)

If you continue to have issues with migrations, you can try a direct database push:

```bash
cd backend
npx prisma db push
```

This will sync your database schema with your Prisma schema without creating migrations. However, it's less ideal for production environments. 