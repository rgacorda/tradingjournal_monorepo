-- MySQL dump 10.13  Distrib 8.0.43, for Linux (x86_64)
--
-- Host: localhost    Database: trading_journal
-- ------------------------------------------------------
-- Server version	8.0.43-0ubuntu0.24.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `Accounts`
--

DROP TABLE IF EXISTS `Accounts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Accounts` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `name` varchar(255) NOT NULL,
  `balance` decimal(10,2) NOT NULL,
  `userId` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `isAnalyticsIncluded` tinyint(1) DEFAULT '1',
  `isCommissionsIncluded` tinyint(1) DEFAULT '0',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `userId` (`userId`),
  CONSTRAINT `Accounts_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `Users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Accounts`
--

LOCK TABLES `Accounts` WRITE;
/*!40000 ALTER TABLE `Accounts` DISABLE KEYS */;
INSERT INTO `Accounts` VALUES ('dba916a6-8097-4dfe-88e0-de8b2a6c11d7','Scalp Account',6500.00,'39c3e048-7462-4cf6-a124-80f902edb05c',1,1,'2025-10-08 07:59:57','2025-11-01 14:56:24');
/*!40000 ALTER TABLE `Accounts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Plans`
--

DROP TABLE IF EXISTS `Plans`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Plans` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `name` varchar(255) NOT NULL,
  `content` longtext,
  `userId` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `userId` (`userId`),
  CONSTRAINT `Plans_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `Users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Plans`
--

LOCK TABLES `Plans` WRITE;
/*!40000 ALTER TABLE `Plans` DISABLE KEYS */;
INSERT INTO `Plans` VALUES ('270c5af6-3fd4-4f11-8fad-5af55e9b1c37','Bounce',NULL,'39c3e048-7462-4cf6-a124-80f902edb05c','2025-10-08 13:07:40','2025-10-08 13:07:40',NULL),('3378c2b6-526b-4a2f-9af5-410d9a242bf6','KL Pullback',NULL,'39c3e048-7462-4cf6-a124-80f902edb05c','2025-10-08 13:07:44','2025-10-08 13:07:44',NULL),('d562efae-6377-4d22-9ed9-9c47ef8e0161','Bagholder Short',NULL,'39c3e048-7462-4cf6-a124-80f902edb05c','2025-10-08 13:07:53','2025-10-08 13:07:53',NULL),('de22b968-efa4-485c-b4f5-d6c11af829e2','Momentum Break',NULL,'39c3e048-7462-4cf6-a124-80f902edb05c','2025-10-08 13:07:49','2025-10-08 13:07:49',NULL);
/*!40000 ALTER TABLE `Plans` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `RefreshTokens`
--

DROP TABLE IF EXISTS `RefreshTokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `RefreshTokens` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `token` varchar(255) NOT NULL,
  `expiresAt` datetime NOT NULL,
  `userId` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `token` (`token`),
  KEY `userId` (`userId`),
  CONSTRAINT `RefreshTokens_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `Users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `RefreshTokens`
--

LOCK TABLES `RefreshTokens` WRITE;
/*!40000 ALTER TABLE `RefreshTokens` DISABLE KEYS */;
INSERT INTO `RefreshTokens` VALUES ('4d253928-7698-403a-a493-0bfd33c454d3','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjM5YzNlMDQ4LTc0NjItNGNmNi1hMTI0LTgwZjkwMmVkYjA1YyIsInJvbGUiOiJwYWlkIiwiaWF0IjoxNzYzMDQ2NzI3LCJleHAiOjE3NjM2NTE1Mjd9.NKZr_fI8lx4OWSI4RjkqlU9Bo5mQIb7SHUKwGyEpeok','2025-11-20 15:12:07','39c3e048-7462-4cf6-a124-80f902edb05c','2025-11-13 15:12:07','2025-11-13 15:12:07');
/*!40000 ALTER TABLE `RefreshTokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Trades`
--

DROP TABLE IF EXISTS `Trades`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Trades` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `ticker` varchar(255) NOT NULL,
  `side` enum('long','short') DEFAULT NULL,
  `quantity` int NOT NULL,
  `entry` decimal(10,2) NOT NULL,
  `exit` decimal(10,2) NOT NULL,
  `fees` decimal(10,2) DEFAULT '0.00',
  `grade` int DEFAULT NULL,
  `mistakes` json DEFAULT NULL,
  `notes` varchar(255) DEFAULT NULL,
  `date` date NOT NULL,
  `time` time NOT NULL,
  `realized` decimal(10,2) NOT NULL,
  `account` varchar(255) NOT NULL,
  `security` enum('stock') NOT NULL DEFAULT 'stock',
  `broker` varchar(255) DEFAULT NULL,
  `userId` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `planId` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `accountId` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `userId` (`userId`),
  KEY `planId` (`planId`),
  KEY `accountId` (`accountId`),
  CONSTRAINT `Trades_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `Users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `Trades_ibfk_2` FOREIGN KEY (`planId`) REFERENCES `Plans` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `Trades_ibfk_3` FOREIGN KEY (`accountId`) REFERENCES `Accounts` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Trades`
--

LOCK TABLES `Trades` WRITE;
/*!40000 ALTER TABLE `Trades` DISABLE KEYS */;
INSERT INTO `Trades` VALUES ('08c3749f-467f-427f-a3b0-ee9955219d81','KSS','long',100,16.38,16.23,0.00,5,NULL,NULL,'2025-08-27','21:33:42',-15.49,'RAC80711','stock',NULL,'39c3e048-7462-4cf6-a124-80f902edb05c','3378c2b6-526b-4a2f-9af5-410d9a242bf6','dba916a6-8097-4dfe-88e0-de8b2a6c11d7','2025-10-08 13:09:36','2025-10-08 13:10:38'),('10785d9e-821a-4aab-a258-e45e4a02e80d','RGTI','long',50,36.15,36.58,2.00,5,NULL,NULL,'2025-10-03','21:35:36',21.50,'RAC80711','stock',NULL,'39c3e048-7462-4cf6-a124-80f902edb05c','270c5af6-3fd4-4f11-8fad-5af55e9b1c37','dba916a6-8097-4dfe-88e0-de8b2a6c11d7','2025-10-08 09:01:12','2025-10-08 13:16:22'),('1db4c323-b513-442e-96cf-b2b40c339b8a','CRWV','short',100,81.34,81.84,3.00,2,'[\"Over-Risked\"]',NULL,'2025-11-13','09:49:20',-50.18,'RAC80711','stock',NULL,'39c3e048-7462-4cf6-a124-80f902edb05c','3378c2b6-526b-4a2f-9af5-410d9a242bf6','dba916a6-8097-4dfe-88e0-de8b2a6c11d7','2025-11-13 14:57:04','2025-11-13 14:57:26'),('283ecd09-1d6e-4bf7-a24b-97d57868c3d6','CRWV','long',20,139.06,140.84,2.00,5,NULL,NULL,'2025-09-30','21:44:44',35.60,'RAC80711','stock',NULL,'39c3e048-7462-4cf6-a124-80f902edb05c','3378c2b6-526b-4a2f-9af5-410d9a242bf6','dba916a6-8097-4dfe-88e0-de8b2a6c11d7','2025-10-08 09:00:27','2025-10-08 13:15:05'),('38368201-a58a-4d42-85ee-d05a495f64b1','SOFI','long',100,30.09,30.39,2.00,5,NULL,NULL,'2025-10-28','09:38:59',30.08,'RAC80711','stock',NULL,'39c3e048-7462-4cf6-a124-80f902edb05c','270c5af6-3fd4-4f11-8fad-5af55e9b1c37','dba916a6-8097-4dfe-88e0-de8b2a6c11d7','2025-10-29 00:45:08','2025-10-31 00:37:47'),('461db897-fda2-45b7-b800-e0ad585a90a9','APVO','short',100,2.48,2.66,2.00,2,'[\"Too Tight Risk\"]',NULL,'2025-09-16','21:37:39',-17.97,'RAC80711','stock',NULL,'39c3e048-7462-4cf6-a124-80f902edb05c','d562efae-6377-4d22-9ed9-9c47ef8e0161','dba916a6-8097-4dfe-88e0-de8b2a6c11d7','2025-10-08 08:57:30','2025-10-08 13:13:11'),('4b07ec50-74b9-4f20-a9e7-4e17ed78e747','DPRO','long',100,8.70,8.48,2.00,5,NULL,NULL,'2025-09-30','21:33:21',-21.98,'RAC80711','stock',NULL,'39c3e048-7462-4cf6-a124-80f902edb05c','3378c2b6-526b-4a2f-9af5-410d9a242bf6','dba916a6-8097-4dfe-88e0-de8b2a6c11d7','2025-10-08 09:00:27','2025-10-08 13:15:07'),('587ad361-58d9-4e7b-8a42-5e5fabf26a67','INTC','long',100,34.70,34.96,2.00,4,NULL,NULL,'2025-09-26','21:32:25',25.60,'RAC80711','stock',NULL,'39c3e048-7462-4cf6-a124-80f902edb05c','270c5af6-3fd4-4f11-8fad-5af55e9b1c37','dba916a6-8097-4dfe-88e0-de8b2a6c11d7','2025-10-08 09:00:00','2025-10-08 13:14:22'),('5d0520ed-6241-43dc-881b-6c6592eac343','AVGO','long',10,358.50,360.84,2.00,5,NULL,NULL,'2025-09-10','21:44:05',23.40,'RAC80711','stock',NULL,'39c3e048-7462-4cf6-a124-80f902edb05c','3378c2b6-526b-4a2f-9af5-410d9a242bf6','dba916a6-8097-4dfe-88e0-de8b2a6c11d7','2025-10-08 08:55:29','2025-10-08 13:11:41'),('5e493b45-86c4-47ff-b1a1-4055ba4707b9','IREN','long',40,58.00,57.21,2.00,2,'[\"Over-Risked\"]',NULL,'2025-10-07','21:32:36',-31.57,'RAC80711','stock',NULL,'39c3e048-7462-4cf6-a124-80f902edb05c','270c5af6-3fd4-4f11-8fad-5af55e9b1c37','dba916a6-8097-4dfe-88e0-de8b2a6c11d7','2025-10-08 13:07:23','2025-10-08 13:16:54'),('62eb88db-22e0-4ba3-bb7f-4e4baeba7beb','RGTI','long',50,36.64,36.94,2.00,5,NULL,NULL,'2025-10-03','21:43:23',15.01,'RAC80711','stock',NULL,'39c3e048-7462-4cf6-a124-80f902edb05c','270c5af6-3fd4-4f11-8fad-5af55e9b1c37','dba916a6-8097-4dfe-88e0-de8b2a6c11d7','2025-10-08 09:01:12','2025-10-08 13:16:25'),('64d647ed-6452-460b-ac10-a7a379c931d7','TSLA','long',10,420.15,424.07,2.00,5,NULL,NULL,'2025-09-15','21:32:26',39.20,'RAC80711','stock',NULL,'39c3e048-7462-4cf6-a124-80f902edb05c','270c5af6-3fd4-4f11-8fad-5af55e9b1c37','dba916a6-8097-4dfe-88e0-de8b2a6c11d7','2025-10-08 08:57:17','2025-10-08 13:12:11'),('6b2d2811-efd0-465d-b8fe-9cc6194e544c','IREN','long',40,71.27,72.43,2.00,5,'[]',NULL,'2025-10-15','09:39:06',46.63,'RAC80711','stock',NULL,'39c3e048-7462-4cf6-a124-80f902edb05c','270c5af6-3fd4-4f11-8fad-5af55e9b1c37','dba916a6-8097-4dfe-88e0-de8b2a6c11d7','2025-10-16 01:31:04','2025-10-19 11:27:30'),('6e88acc1-e409-435b-aedd-e14fe692bd2c','NERV','short',100,7.14,6.89,2.00,5,NULL,NULL,'2025-10-21','09:36:25',25.00,'RAC80711','stock',NULL,'39c3e048-7462-4cf6-a124-80f902edb05c','d562efae-6377-4d22-9ed9-9c47ef8e0161','dba916a6-8097-4dfe-88e0-de8b2a6c11d7','2025-10-22 00:51:47','2025-11-13 15:12:54'),('6f131d68-8dbb-4031-a011-5a42ab5b0fba','PLTR','long',30,200.95,202.09,2.00,5,NULL,NULL,'2025-10-31','09:41:44',34.22,'RAC80711','stock',NULL,'39c3e048-7462-4cf6-a124-80f902edb05c','3378c2b6-526b-4a2f-9af5-410d9a242bf6','dba916a6-8097-4dfe-88e0-de8b2a6c11d7','2025-10-31 13:54:24','2025-10-31 13:54:44'),('75609608-ee70-403e-bec8-e7d0ccc84f1f','IREN','long',30,73.20,72.30,2.00,1,'[\"Failed to TP\", \"Failed to Accept Small Win\"]',NULL,'2025-11-06','09:56:19',-27.00,'RAC80711','stock',NULL,'39c3e048-7462-4cf6-a124-80f902edb05c','270c5af6-3fd4-4f11-8fad-5af55e9b1c37','dba916a6-8097-4dfe-88e0-de8b2a6c11d7','2025-11-06 15:03:23','2025-11-06 15:04:25'),('785689b2-8789-4510-8daf-25fc9dcea11f','AMZN','long',30,248.98,247.86,2.00,5,NULL,NULL,'2025-10-31','09:33:44',-33.73,'RAC80711','stock',NULL,'39c3e048-7462-4cf6-a124-80f902edb05c','270c5af6-3fd4-4f11-8fad-5af55e9b1c37','dba916a6-8097-4dfe-88e0-de8b2a6c11d7','2025-10-31 13:54:24','2025-10-31 13:54:44'),('7cfd03f2-680b-4260-91b2-ecc87b4e9d93','IREN','long',30,74.13,73.47,2.00,4,'[\"Less Patient Entry\"]',NULL,'2025-11-06','09:42:31',-19.80,'RAC80711','stock',NULL,'39c3e048-7462-4cf6-a124-80f902edb05c','270c5af6-3fd4-4f11-8fad-5af55e9b1c37','dba916a6-8097-4dfe-88e0-de8b2a6c11d7','2025-11-06 15:03:23','2025-11-08 01:19:25'),('841c6d08-38a6-4cf0-8c34-9424b7e1ea81','TSLA','long',10,421.89,420.34,2.00,5,NULL,NULL,'2025-09-15','21:37:54',-15.50,'RAC80711','stock',NULL,'39c3e048-7462-4cf6-a124-80f902edb05c','270c5af6-3fd4-4f11-8fad-5af55e9b1c37','dba916a6-8097-4dfe-88e0-de8b2a6c11d7','2025-10-08 08:57:17','2025-10-08 13:12:16'),('844b972f-bded-4899-8d61-2e11a0435816','PLTR','long',20,194.61,195.65,2.00,5,NULL,NULL,'2025-10-30','09:40:52',20.82,'RAC80711','stock',NULL,'39c3e048-7462-4cf6-a124-80f902edb05c','270c5af6-3fd4-4f11-8fad-5af55e9b1c37','dba916a6-8097-4dfe-88e0-de8b2a6c11d7','2025-10-31 00:37:32','2025-10-31 00:37:44'),('8696bcc5-4f5c-40c9-9cc6-07bd7f660ff7','PLTR','long',30,200.90,201.36,2.00,5,NULL,NULL,'2025-10-31','09:39:47',13.81,'RAC80711','stock',NULL,'39c3e048-7462-4cf6-a124-80f902edb05c','3378c2b6-526b-4a2f-9af5-410d9a242bf6','dba916a6-8097-4dfe-88e0-de8b2a6c11d7','2025-10-31 13:54:24','2025-10-31 13:54:45'),('8d2cf357-42a1-472b-8847-264732b89143','IREN','long',30,73.84,74.50,2.00,4,'[\"Less Patient Entry\"]',NULL,'2025-11-06','09:37:46',19.80,'RAC80711','stock',NULL,'39c3e048-7462-4cf6-a124-80f902edb05c','270c5af6-3fd4-4f11-8fad-5af55e9b1c37','dba916a6-8097-4dfe-88e0-de8b2a6c11d7','2025-11-06 15:03:23','2025-11-08 01:19:22'),('9481da0e-3e20-43c0-aa9e-9d1542cf02d0','PLTR','long',20,196.29,195.35,2.00,5,NULL,NULL,'2025-10-30','09:36:40',-18.78,'RAC80711','stock',NULL,'39c3e048-7462-4cf6-a124-80f902edb05c','270c5af6-3fd4-4f11-8fad-5af55e9b1c37','dba916a6-8097-4dfe-88e0-de8b2a6c11d7','2025-10-31 00:37:32','2025-10-31 00:37:45'),('99022924-66fd-4a1d-b455-8fe9a7ffed42','QS','long',100,10.35,10.12,2.00,5,NULL,NULL,'2025-09-08','21:32:34',-22.99,'RAC80711','stock',NULL,'39c3e048-7462-4cf6-a124-80f902edb05c','3378c2b6-526b-4a2f-9af5-410d9a242bf6','dba916a6-8097-4dfe-88e0-de8b2a6c11d7','2025-10-08 08:56:08','2025-10-08 13:11:33'),('9c99e275-e70c-49a9-8bf0-f16a03ada068','APVO','short',100,2.49,2.56,2.00,4,NULL,NULL,'2025-09-16','21:34:05',-7.50,'RAC80711','stock',NULL,'39c3e048-7462-4cf6-a124-80f902edb05c','d562efae-6377-4d22-9ed9-9c47ef8e0161','dba916a6-8097-4dfe-88e0-de8b2a6c11d7','2025-10-08 08:57:30','2025-10-08 13:13:18'),('a22c6ed7-faa2-45b8-913e-a023c2c2ed28','ONON','long',60,42.80,42.37,2.00,5,'[]',NULL,'2025-11-12','09:36:08',-26.02,'RAC80711','stock',NULL,'39c3e048-7462-4cf6-a124-80f902edb05c','270c5af6-3fd4-4f11-8fad-5af55e9b1c37','dba916a6-8097-4dfe-88e0-de8b2a6c11d7','2025-11-12 14:50:23','2025-11-13 01:20:29'),('a57106fc-c7b0-4ac7-abf8-907f030d047c','AMD','long',10,216.46,220.12,2.00,5,NULL,NULL,'2025-10-06','21:38:06',36.60,'RAC80711','stock',NULL,'39c3e048-7462-4cf6-a124-80f902edb05c','270c5af6-3fd4-4f11-8fad-5af55e9b1c37','dba916a6-8097-4dfe-88e0-de8b2a6c11d7','2025-10-08 09:02:20','2025-10-08 13:16:37'),('aac684ec-be08-4ceb-9b6e-ed3a29ef61b8','IREN','long',50,58.87,58.26,2.00,2,'[\"Over-Risked\"]',NULL,'2025-10-07','21:31:33',-30.50,'RAC80711','stock',NULL,'39c3e048-7462-4cf6-a124-80f902edb05c','270c5af6-3fd4-4f11-8fad-5af55e9b1c37','dba916a6-8097-4dfe-88e0-de8b2a6c11d7','2025-10-08 13:07:23','2025-10-08 13:16:54'),('af20fa53-b612-4218-9d5a-b7e0314cb671','IREN','long',40,71.85,71.25,2.00,5,NULL,NULL,'2025-10-15','09:35:18',-24.00,'RAC80711','stock',NULL,'39c3e048-7462-4cf6-a124-80f902edb05c','270c5af6-3fd4-4f11-8fad-5af55e9b1c37','dba916a6-8097-4dfe-88e0-de8b2a6c11d7','2025-10-16 01:31:04','2025-10-16 01:31:32'),('b69a9a9b-ac37-471f-8ae3-7b114b712912','AMZN','long',30,247.46,248.25,2.00,5,NULL,NULL,'2025-10-31','09:36:00',23.70,'RAC80711','stock',NULL,'39c3e048-7462-4cf6-a124-80f902edb05c','270c5af6-3fd4-4f11-8fad-5af55e9b1c37','dba916a6-8097-4dfe-88e0-de8b2a6c11d7','2025-10-31 13:54:24','2025-10-31 13:54:45'),('c9e308cf-4c8a-4201-83c1-22dffc44e4ed','NVDA','long',20,190.16,190.87,2.00,5,NULL,NULL,'2025-10-02','21:37:11',14.20,'RAC80711','stock',NULL,'39c3e048-7462-4cf6-a124-80f902edb05c','3378c2b6-526b-4a2f-9af5-410d9a242bf6','dba916a6-8097-4dfe-88e0-de8b2a6c11d7','2025-10-08 09:01:02','2025-10-08 13:16:11'),('ca4f4089-46a9-445a-9403-3c94bb343bde','AMD','long',15,254.64,253.66,2.00,3,'[\"Insufficient Risk\"]',NULL,'2025-10-27','09:45:35',-14.69,'RAC80711','stock',NULL,'39c3e048-7462-4cf6-a124-80f902edb05c','270c5af6-3fd4-4f11-8fad-5af55e9b1c37','dba916a6-8097-4dfe-88e0-de8b2a6c11d7','2025-10-28 01:01:16','2025-10-29 00:46:41'),('cc90b83b-7a15-4ddc-974f-51103c551475','TSLA','long',7,467.96,466.70,2.00,4,'[\"Insufficient Risk\"]',NULL,'2025-10-02','21:32:14',-8.86,'RAC80711','stock',NULL,'39c3e048-7462-4cf6-a124-80f902edb05c','270c5af6-3fd4-4f11-8fad-5af55e9b1c37','dba916a6-8097-4dfe-88e0-de8b2a6c11d7','2025-10-08 09:01:02','2025-10-08 13:16:00'),('cf468f25-149c-47d9-ab25-b8744eb3e708','AMD','long',10,235.27,236.09,2.00,5,'[\"Insufficient Risk\"]',NULL,'2025-10-09','21:44:55',8.20,'RAC80711','stock',NULL,'39c3e048-7462-4cf6-a124-80f902edb05c','270c5af6-3fd4-4f11-8fad-5af55e9b1c37','dba916a6-8097-4dfe-88e0-de8b2a6c11d7','2025-10-10 13:24:44','2025-10-16 01:31:28'),('d09538e0-ed52-4f55-9e71-db4e5689b035','IREN','long',30,73.43,72.41,2.00,5,NULL,NULL,'2025-11-06','09:44:45',-30.59,'RAC80711','stock',NULL,'39c3e048-7462-4cf6-a124-80f902edb05c','270c5af6-3fd4-4f11-8fad-5af55e9b1c37','dba916a6-8097-4dfe-88e0-de8b2a6c11d7','2025-11-06 15:03:23','2025-11-06 15:04:28'),('d1577d4a-0c87-47e7-879c-336b4324fe32','BABA','long',20,176.38,175.65,2.00,4,'[\"Insufficient Risk\"]',NULL,'2025-09-24','21:46:49',-14.56,'RAC80711','stock',NULL,'39c3e048-7462-4cf6-a124-80f902edb05c','270c5af6-3fd4-4f11-8fad-5af55e9b1c37','dba916a6-8097-4dfe-88e0-de8b2a6c11d7','2025-10-08 08:59:49','2025-10-08 13:13:58'),('d8518cbe-a9bf-478a-b9c0-6084a4c84598','ONON','long',60,44.09,43.53,2.00,5,NULL,NULL,'2025-11-12','09:31:52',-33.59,'RAC80711','stock',NULL,'39c3e048-7462-4cf6-a124-80f902edb05c','3378c2b6-526b-4a2f-9af5-410d9a242bf6','dba916a6-8097-4dfe-88e0-de8b2a6c11d7','2025-11-12 14:50:23','2025-11-12 14:50:52'),('f31b1400-2b5a-400d-bd30-090ec7a3dd26','AMD','long',15,255.00,255.30,2.00,5,NULL,NULL,'2025-10-27','09:39:04',4.50,'RAC80711','stock',NULL,'39c3e048-7462-4cf6-a124-80f902edb05c','270c5af6-3fd4-4f11-8fad-5af55e9b1c37','dba916a6-8097-4dfe-88e0-de8b2a6c11d7','2025-10-28 01:01:16','2025-10-29 00:46:36'),('f764ac93-91d1-43d9-bf2d-cb4480056746','HOOD','long',30,140.56,140.94,2.00,3,'[\"Didn\'t Track Well\"]',NULL,'2025-10-01','21:38:10',11.43,'RAC80711','stock',NULL,'39c3e048-7462-4cf6-a124-80f902edb05c','270c5af6-3fd4-4f11-8fad-5af55e9b1c37','dba916a6-8097-4dfe-88e0-de8b2a6c11d7','2025-10-08 09:00:41','2025-10-08 13:15:26'),('ffd6c9f8-577b-4a35-b089-f9f0c8115e3b','APLD','long',40,36.59,37.23,2.00,3,'[\"Didn\'t Track Well\"]',NULL,'2025-10-10','21:40:03',25.60,'RAC80711','stock',NULL,'39c3e048-7462-4cf6-a124-80f902edb05c','270c5af6-3fd4-4f11-8fad-5af55e9b1c37','dba916a6-8097-4dfe-88e0-de8b2a6c11d7','2025-10-12 00:43:26','2025-10-16 01:31:28');
/*!40000 ALTER TABLE `Trades` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Users`
--

DROP TABLE IF EXISTS `Users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Users` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `firstname` varchar(255) NOT NULL,
  `lastname` varchar(255) NOT NULL,
  `middlename` varchar(255) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('free','paid') DEFAULT 'free',
  `isVerified` tinyint(1) DEFAULT '0',
  `verificationToken` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Users`
--

LOCK TABLES `Users` WRITE;
/*!40000 ALTER TABLE `Users` DISABLE KEYS */;
INSERT INTO `Users` VALUES ('39c3e048-7462-4cf6-a124-80f902edb05c','Ronjay','Acorda',NULL,'rgacorda02@gmail.com',NULL,'$2b$10$zwa.FmtNfBQlJB5QUpfSwepNAOlVl.ZDlALMppTpJyg6rHRJcQjZW','paid',1,NULL,'2025-10-08 07:30:21','2025-10-08 07:59:07');
/*!40000 ALTER TABLE `Users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-11-14  4:40:59
