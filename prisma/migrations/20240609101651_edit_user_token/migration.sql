/*
  Warnings:

  - You are about to drop the column `accessToken` on the `user_tokens` table. All the data in the column will be lost.
  - Added the required column `refreshToken` to the `user_tokens` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `user_tokens` DROP COLUMN `accessToken`,
    ADD COLUMN `refreshToken` VARCHAR(2048) NOT NULL;
