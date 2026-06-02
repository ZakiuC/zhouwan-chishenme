-- CreateTable
CREATE TABLE "Whitelist" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "wechatId" TEXT NOT NULL,
    "nickname" TEXT,
    "isUsed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "wechatId" TEXT NOT NULL,
    "nickname" TEXT,
    "avatarUrl" TEXT,
    "role" TEXT NOT NULL DEFAULT 'USER',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Store" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT,
    "address" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "uploaderId" TEXT NOT NULL,
    "avgWantScore" REAL NOT NULL DEFAULT 0,
    "avgTasteScore" REAL NOT NULL DEFAULT 0,
    "avgValueScore" REAL NOT NULL DEFAULT 0,
    "avgAmbienceScore" REAL NOT NULL DEFAULT 0,
    "avgSpeedScore" REAL NOT NULL DEFAULT 0,
    "recommendCount" INTEGER NOT NULL DEFAULT 0,
    "notRecommendCount" INTEGER NOT NULL DEFAULT 0,
    "ratingCount" INTEGER NOT NULL DEFAULT 0,
    "compositeScore" REAL NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Store_uploaderId_fkey" FOREIGN KEY ("uploaderId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "MapLink" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "storeId" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "longitude" REAL,
    "latitude" REAL,
    CONSTRAINT "MapLink_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "Store" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Rating" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "storeId" TEXT NOT NULL,
    "wantScore" INTEGER NOT NULL,
    "triedRating" TEXT NOT NULL DEFAULT 'NOT_TRIED',
    "tasteScore" INTEGER,
    "valueScore" INTEGER,
    "ambienceScore" INTEGER,
    "speedScore" INTEGER,
    "comment" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Rating_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Rating_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "Store" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Whitelist_wechatId_key" ON "Whitelist"("wechatId");

-- CreateIndex
CREATE UNIQUE INDEX "User_wechatId_key" ON "User"("wechatId");

-- CreateIndex
CREATE INDEX "User_wechatId_idx" ON "User"("wechatId");

-- CreateIndex
CREATE INDEX "User_role_idx" ON "User"("role");

-- CreateIndex
CREATE INDEX "Store_uploaderId_idx" ON "Store"("uploaderId");

-- CreateIndex
CREATE INDEX "Store_status_idx" ON "Store"("status");

-- CreateIndex
CREATE INDEX "Store_category_idx" ON "Store"("category");

-- CreateIndex
CREATE INDEX "Store_compositeScore_idx" ON "Store"("compositeScore" DESC);

-- CreateIndex
CREATE INDEX "MapLink_storeId_idx" ON "MapLink"("storeId");

-- CreateIndex
CREATE UNIQUE INDEX "MapLink_storeId_provider_key" ON "MapLink"("storeId", "provider");

-- CreateIndex
CREATE INDEX "Rating_storeId_idx" ON "Rating"("storeId");

-- CreateIndex
CREATE INDEX "Rating_userId_idx" ON "Rating"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Rating_userId_storeId_key" ON "Rating"("userId", "storeId");
