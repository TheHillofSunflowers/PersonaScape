-- Add profilePicture column to Profile table
ALTER TABLE "Profile" ADD COLUMN "profilePicture" TEXT;

-- Add likesCount column to Profile table with default value 0
ALTER TABLE "Profile" ADD COLUMN "likesCount" INTEGER NOT NULL DEFAULT 0;

-- Create ProfileLike table if it doesn't exist
CREATE TABLE IF NOT EXISTS "ProfileLike" (
    "id" SERIAL NOT NULL,
    "profileId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProfileLike_pkey" PRIMARY KEY ("id")
);

-- Create unique constraint on profileId and userId
CREATE UNIQUE INDEX IF NOT EXISTS "ProfileLike_profileId_userId_key" ON "ProfileLike"("profileId", "userId");

-- Add foreign keys
ALTER TABLE "ProfileLike" ADD CONSTRAINT "ProfileLike_profileId_fkey" 
    FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "ProfileLike" ADD CONSTRAINT "ProfileLike_userId_fkey" 
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE; 