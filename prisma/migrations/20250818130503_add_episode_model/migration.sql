-- CreateTable
CREATE TABLE "public"."episodes" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "enclosureUrl" TEXT,
    "enclosureType" TEXT,
    "enclosureLength" INTEGER,
    "pubDate" TIMESTAMP(3),
    "duration" TEXT,
    "explicit" BOOLEAN DEFAULT false,
    "episodeNumber" INTEGER,
    "seasonNumber" INTEGER,
    "episodeType" TEXT,
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "podcastId" INTEGER NOT NULL,

    CONSTRAINT "episodes_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."episodes" ADD CONSTRAINT "episodes_podcastId_fkey" FOREIGN KEY ("podcastId") REFERENCES "public"."podcasts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
