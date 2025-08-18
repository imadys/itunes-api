-- CreateTable
CREATE TABLE "public"."Podcast" (
    "id" SERIAL NOT NULL,
    "trackId" INTEGER NOT NULL,
    "trackName" TEXT NOT NULL,
    "artistName" TEXT NOT NULL,
    "collectionName" TEXT,
    "trackViewUrl" TEXT NOT NULL,
    "artworkUrl30" TEXT,
    "artworkUrl60" TEXT,
    "artworkUrl100" TEXT,
    "artworkUrl600" TEXT,
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

    CONSTRAINT "Podcast_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."episodes" (
    "id" SERIAL NOT NULL,
    "trackId" INTEGER,
    "podcastId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "audioUrl" TEXT,
    "duration" TEXT,
    "pubDate" TIMESTAMP(3) NOT NULL,
    "description" TEXT,
    "episodeNumber" INTEGER,
    "episodeType" TEXT,
    "image" TEXT,
    "isFavorite" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "episodes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Podcast_trackId_key" ON "public"."Podcast"("trackId");

-- CreateIndex
CREATE UNIQUE INDEX "episodes_trackId_key" ON "public"."episodes"("trackId");

-- AddForeignKey
ALTER TABLE "public"."episodes" ADD CONSTRAINT "episodes_podcastId_fkey" FOREIGN KEY ("podcastId") REFERENCES "public"."Podcast"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
