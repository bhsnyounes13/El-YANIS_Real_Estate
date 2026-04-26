-- CreateEnum
CREATE TYPE "Role" AS ENUM ('admin', 'user');

-- CreateEnum
CREATE TYPE "PropertyType" AS ENUM ('sale', 'rent');

-- CreateEnum
CREATE TYPE "CityKey" AS ENUM ('tlemcen', 'ainTemouchent', 'sidiBelAbbes');

-- CreateEnum
CREATE TYPE "PropertyTag" AS ENUM ('exclusive', 'new', 'featured');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'user',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "refresh_tokens" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "token_hash" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "refresh_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Agent" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "photo" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "bio_en" TEXT NOT NULL,
    "bio_fr" TEXT NOT NULL,
    "bio_ar" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Agent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Property" (
    "id" TEXT NOT NULL,
    "title_en" TEXT NOT NULL,
    "title_fr" TEXT NOT NULL,
    "title_ar" TEXT NOT NULL,
    "description_en" TEXT NOT NULL,
    "description_fr" TEXT NOT NULL,
    "description_ar" TEXT NOT NULL,
    "type" "PropertyType" NOT NULL,
    "price" INTEGER NOT NULL,
    "city" "CityKey" NOT NULL,
    "bedrooms" INTEGER NOT NULL,
    "bathrooms" INTEGER NOT NULL,
    "area" DOUBLE PRECISION NOT NULL,
    "images" JSONB NOT NULL,
    "amenities" JSONB NOT NULL,
    "booked_dates" JSONB,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "tags" JSONB,
    "agent_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Property_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "site_services" (
    "id" TEXT NOT NULL,
    "title_en" TEXT NOT NULL,
    "title_fr" TEXT NOT NULL,
    "title_ar" TEXT NOT NULL,
    "description_en" TEXT NOT NULL,
    "description_fr" TEXT NOT NULL,
    "description_ar" TEXT NOT NULL,
    "icon_key" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "site_services_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contact_submissions" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "subject" TEXT,
    "message" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "contact_submissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "property_inquiries" (
    "id" TEXT NOT NULL,
    "property_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "message" TEXT NOT NULL,
    "preferred_date" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "property_inquiries_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "refresh_tokens_token_hash_key" ON "refresh_tokens"("token_hash");

-- CreateIndex
CREATE INDEX "refresh_tokens_user_id_idx" ON "refresh_tokens"("user_id");

-- CreateIndex
CREATE INDEX "Property_city_idx" ON "Property"("city");

-- CreateIndex
CREATE INDEX "Property_type_idx" ON "Property"("type");

-- CreateIndex
CREATE INDEX "Property_featured_idx" ON "Property"("featured");

-- CreateIndex
CREATE INDEX "property_inquiries_property_id_idx" ON "property_inquiries"("property_id");

-- AddForeignKey
ALTER TABLE "refresh_tokens" ADD CONSTRAINT "refresh_tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Property" ADD CONSTRAINT "Property_agent_id_fkey" FOREIGN KEY ("agent_id") REFERENCES "Agent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "property_inquiries" ADD CONSTRAINT "property_inquiries_property_id_fkey" FOREIGN KEY ("property_id") REFERENCES "Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;
