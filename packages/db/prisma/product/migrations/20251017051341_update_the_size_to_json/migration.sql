/*
  Warnings:

  - You are about to alter the column `sizes` on the `Product` table. The data in that column could be lost. The data in that column will be cast from `String` to `Json`.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Product" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "shortDescription" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "sizes" JSONB NOT NULL,
    "colors" JSONB NOT NULL,
    "images" JSONB NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "categorySlug" TEXT NOT NULL,
    CONSTRAINT "Product_categorySlug_fkey" FOREIGN KEY ("categorySlug") REFERENCES "Category" ("slug") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Product" ("categorySlug", "colors", "createdAt", "description", "id", "images", "name", "price", "shortDescription", "sizes", "updatedAt") SELECT "categorySlug", "colors", "createdAt", "description", "id", "images", "name", "price", "shortDescription", "sizes", "updatedAt" FROM "Product";
DROP TABLE "Product";
ALTER TABLE "new_Product" RENAME TO "Product";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
