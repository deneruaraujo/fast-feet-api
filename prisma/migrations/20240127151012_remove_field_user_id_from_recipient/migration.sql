/*
  Warnings:

  - You are about to drop the column `user_id` on the `recipients` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "recipients" DROP CONSTRAINT "recipients_user_id_fkey";

-- AlterTable
ALTER TABLE "recipients" DROP COLUMN "user_id";
