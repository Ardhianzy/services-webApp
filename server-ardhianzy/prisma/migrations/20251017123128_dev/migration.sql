-- CreateEnum
CREATE TYPE "DifficultyLevel" AS ENUM ('BEGINNER', 'INTERMEDIATE', 'EXPERT');

-- CreateEnum
CREATE TYPE "ArticleCategory" AS ENUM ('IDEAS_AND_TRADITIONS', 'POP_CULTURE');

-- CreateTable
CREATE TABLE "Admin" (
    "id" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tot" (
    "id" TEXT NOT NULL,
    "admin_id" TEXT NOT NULL,
    "image" TEXT,
    "philosofer" TEXT NOT NULL,
    "geoorigin" TEXT NOT NULL,
    "detail_location" TEXT NOT NULL,
    "years" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "meta_title" TEXT,
    "meta_description" TEXT,
    "keywords" TEXT,
    "is_published" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tot_meta" (
    "id" TEXT NOT NULL,
    "ToT_id" TEXT NOT NULL,
    "metafisika" TEXT NOT NULL,
    "epsimologi" TEXT NOT NULL,
    "aksiologi" TEXT NOT NULL,
    "conclusion" TEXT NOT NULL,

    CONSTRAINT "tot_meta_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reading_guidline" (
    "id" TEXT NOT NULL,
    "ToT_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "image" TEXT,
    "author" TEXT NOT NULL,
    "publisher" TEXT NOT NULL,
    "year" TEXT NOT NULL,
    "detailed" TEXT NOT NULL,
    "category" "DifficultyLevel" NOT NULL,

    CONSTRAINT "reading_guidline_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Monologues" (
    "id" TEXT NOT NULL,
    "admin_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "image" TEXT,
    "dialog" TEXT NOT NULL,
    "judul" TEXT NOT NULL,
    "slug" TEXT,
    "meta_title" TEXT,
    "meta_description" TEXT,
    "is_published" BOOLEAN NOT NULL DEFAULT false,
    "pdf_file_id" TEXT,
    "pdf_url" TEXT,
    "pdf_filename" TEXT,
    "pdf_mime" TEXT,
    "pdf_size" INTEGER,
    "pdf_uploaded_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Monologues_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "researches" (
    "id" TEXT NOT NULL,
    "admin_id" TEXT NOT NULL,
    "research_title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "research_sum" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "researcher" TEXT NOT NULL,
    "research_date" TIMESTAMP(3) NOT NULL,
    "fiel" TEXT NOT NULL,
    "pdf_file_id" TEXT,
    "pdf_url" TEXT,
    "pdf_filename" TEXT,
    "pdf_mime" TEXT,
    "pdf_size" INTEGER,
    "pdf_uploaded_at" TIMESTAMP(3),
    "meta_title" TEXT,
    "meta_description" TEXT,
    "keywords" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "is_published" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "researches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "articles" (
    "id" TEXT NOT NULL,
    "admin_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "category" "ArticleCategory" NOT NULL,
    "meta_title" TEXT,
    "meta_description" TEXT,
    "keywords" TEXT,
    "excerpt" TEXT,
    "canonical_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "is_published" BOOLEAN NOT NULL DEFAULT false,
    "is_featured" BOOLEAN NOT NULL DEFAULT false,
    "view_count" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "articles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shops" (
    "id" TEXT NOT NULL,
    "admin_id" TEXT NOT NULL,
    "stock" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "price" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "desc" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "slug" TEXT,
    "meta_title" TEXT,
    "meta_description" TEXT,
    "is_available" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "shops_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "megazine" (
    "id" TEXT NOT NULL,
    "admin_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "megazine_isi" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "meta_title" TEXT,
    "meta_description" TEXT,
    "keywords" TEXT,
    "pdf_file_id" TEXT,
    "pdf_url" TEXT,
    "pdf_filename" TEXT,
    "pdf_mime" TEXT,
    "pdf_size" INTEGER,
    "pdf_uploaded_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "megazine_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Admin_username_key" ON "Admin"("username");

-- CreateIndex
CREATE UNIQUE INDEX "tot_slug_key" ON "tot"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Monologues_slug_key" ON "Monologues"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "researches_slug_key" ON "researches"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "articles_slug_key" ON "articles"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "shops_slug_key" ON "shops"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "megazine_slug_key" ON "megazine"("slug");

-- AddForeignKey
ALTER TABLE "tot" ADD CONSTRAINT "tot_admin_id_fkey" FOREIGN KEY ("admin_id") REFERENCES "Admin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tot_meta" ADD CONSTRAINT "tot_meta_ToT_id_fkey" FOREIGN KEY ("ToT_id") REFERENCES "tot"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reading_guidline" ADD CONSTRAINT "reading_guidline_ToT_id_fkey" FOREIGN KEY ("ToT_id") REFERENCES "tot"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Monologues" ADD CONSTRAINT "Monologues_admin_id_fkey" FOREIGN KEY ("admin_id") REFERENCES "Admin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "researches" ADD CONSTRAINT "researches_admin_id_fkey" FOREIGN KEY ("admin_id") REFERENCES "Admin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "articles" ADD CONSTRAINT "articles_admin_id_fkey" FOREIGN KEY ("admin_id") REFERENCES "Admin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shops" ADD CONSTRAINT "shops_admin_id_fkey" FOREIGN KEY ("admin_id") REFERENCES "Admin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "megazine" ADD CONSTRAINT "megazine_admin_id_fkey" FOREIGN KEY ("admin_id") REFERENCES "Admin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
