-- CreateTable
CREATE TABLE "public"."podcasts" (
    "id" SERIAL NOT NULL,
    "trackId" INTEGER NOT NULL,
    "trackName" TEXT NOT NULL,
    "artistName" TEXT NOT NULL,
    "collectionName" TEXT,
    "trackViewUrl" TEXT NOT NULL,
    "artworkUrl30" TEXT,
    "artworkUrl60" TEXT,
    "artworkUrl100" TEXT,
    "collectionPrice" DOUBLE PRECISION,
    "trackPrice" DOUBLE PRECISION,
    "releaseDate" TIMESTAMP(3),
    "collectionExplicitness" TEXT,
    "trackExplicitness" TEXT,
    "trackCount" INTEGER,
    "country" TEXT NOT NULL,
    "currency" TEXT,
    "primaryGenreName" TEXT,
    "contentAdvisoryRating" TEXT,
    "feedUrl" TEXT,
    "genres" TEXT[],
    "searchKeyword" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "podcasts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "podcasts_trackId_key" ON "public"."podcasts"("trackId");
