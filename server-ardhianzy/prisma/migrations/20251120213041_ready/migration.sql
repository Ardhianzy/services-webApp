-- AlterTable
ALTER TABLE "megazine" ADD COLUMN     "is_published" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "tot_meta" ADD COLUMN     "is_published" BOOLEAN NOT NULL DEFAULT false;
