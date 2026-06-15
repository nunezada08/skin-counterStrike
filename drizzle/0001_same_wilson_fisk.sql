CREATE TABLE `aimTrainerScores` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`score` int NOT NULL,
	`targetsHit` int NOT NULL,
	`totalTargets` int NOT NULL,
	`accuracy` decimal(5,2) NOT NULL,
	`keysEarned` int NOT NULL DEFAULT 0,
	`caseId` int,
	`playedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `aimTrainerScores_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `caseSkins` (
	`id` int AUTO_INCREMENT NOT NULL,
	`caseId` int NOT NULL,
	`skinId` int NOT NULL,
	`weight` int NOT NULL DEFAULT 1,
	CONSTRAINT `caseSkins_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `cases` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(128) NOT NULL,
	`description` text,
	`image` varchar(512),
	`rarity` varchar(64) NOT NULL,
	`keyPrice` int NOT NULL DEFAULT 1,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `cases_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `inventory` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`skinId` int NOT NULL,
	`caseId` int NOT NULL,
	`quantity` int NOT NULL DEFAULT 1,
	`obtainedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `inventory_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `keys` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`caseId` int NOT NULL,
	`balance` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `keys_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `skins` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(256) NOT NULL,
	`image` varchar(512),
	`rarity` varchar(64) NOT NULL,
	`rarityColor` varchar(7) DEFAULT '#888888',
	`rarityChance` decimal(5,2) DEFAULT '1.00',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `skins_id` PRIMARY KEY(`id`)
);
