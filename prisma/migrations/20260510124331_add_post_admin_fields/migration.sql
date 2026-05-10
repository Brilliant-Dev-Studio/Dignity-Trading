-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "category" TEXT NOT NULL DEFAULT 'Education',
ADD COLUMN     "reads" INTEGER NOT NULL DEFAULT 0;
