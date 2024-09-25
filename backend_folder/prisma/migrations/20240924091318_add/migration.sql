/*
  Warnings:

  - You are about to drop the column `profileImageId` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId]` on the table `DocImage` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `DocImage` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_profileImageId_fkey";

-- DropIndex
DROP INDEX "User_profileImageId_key";

-- AlterTable
ALTER TABLE "DocImage" ADD COLUMN     "userId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "profileImageId";

-- CreateIndex
CREATE UNIQUE INDEX "DocImage_userId_key" ON "DocImage"("userId");

-- AddForeignKey
ALTER TABLE "DocImage" ADD CONSTRAINT "DocImage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
