-- CreateEnum
CREATE TYPE "RoomVisibility" AS ENUM ('PUBLIC', 'PRIVATE');

-- CreateEnum
CREATE TYPE "RoomDuration" AS ENUM ('PERMANENT', 'TEMPORARY');

-- CreateEnum
CREATE TYPE "RoomCategory" AS ENUM ('LOFI_AND_CHILL', 'SYNTHWAVE_AND_RETRO', 'DEEP_AMBIENT', 'GAMING_AND_BEATS', 'STUDY_AND_FOCUS', 'LATE_NIGHT_TALK');

-- CreateTable
CREATE TABLE "Room" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "visibility" "RoomVisibility" NOT NULL,
    "duration" "RoomDuration" NOT NULL,
    "category" "RoomCategory" NOT NULL,
    "passwordEncrypted" TEXT,
    "tags" TEXT[],
    "expiresAt" TIMESTAMP(3),
    "ownerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Room_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_RoomDJs" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_RoomDJs_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "Room_ownerId_idx" ON "Room"("ownerId");

-- CreateIndex
CREATE INDEX "Room_visibility_createdAt_idx" ON "Room"("visibility", "createdAt");

-- CreateIndex
CREATE INDEX "Room_category_idx" ON "Room"("category");

-- CreateIndex
CREATE INDEX "Room_expiresAt_idx" ON "Room"("expiresAt");

-- CreateIndex
CREATE INDEX "_RoomDJs_B_index" ON "_RoomDJs"("B");

-- AddForeignKey
ALTER TABLE "Room" ADD CONSTRAINT "Room_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RoomDJs" ADD CONSTRAINT "_RoomDJs_A_fkey" FOREIGN KEY ("A") REFERENCES "Room"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RoomDJs" ADD CONSTRAINT "_RoomDJs_B_fkey" FOREIGN KEY ("B") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
