-- CreateEnum
CREATE TYPE "MessageType" AS ENUM ('TEXT', 'VOICE');

-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "audioKey" TEXT,
ADD COLUMN     "duration" INTEGER,
ADD COLUMN     "type" "MessageType" NOT NULL DEFAULT 'TEXT',
ALTER COLUMN "content" DROP NOT NULL;
