-- CreateTable
CREATE TABLE `Project` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `playerid` TEXT NOT NULL,
    `price` TEXT NOT NULL,
    `names` TEXT NOT NULL,
    `whatsapp` TEXT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
