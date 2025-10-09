-- AlterTable
ALTER TABLE "researches" ADD COLUMN     "pdf_file_id" TEXT,
ADD COLUMN     "pdf_filename" TEXT,
ADD COLUMN     "pdf_mime" TEXT,
ADD COLUMN     "pdf_size" INTEGER,
ADD COLUMN     "pdf_uploaded_at" TIMESTAMP(3),
ADD COLUMN     "pdf_url" TEXT;
