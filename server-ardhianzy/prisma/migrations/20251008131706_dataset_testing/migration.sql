/*
  Warnings:

  - Added the required column `category` to the `reading_guidline` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "reading_guidline" ADD COLUMN     "category" TEXT NOT NULL;
