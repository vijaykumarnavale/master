-- MySQL dump 10.13  Distrib 8.0.40, for Win64 (x86_64)
--
-- Host: localhost    Database: master
-- ------------------------------------------------------
-- Server version	8.0.41-0ubuntu0.24.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `adu_details`
--

DROP TABLE IF EXISTS `adu_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `adu_details` (
  `adu_id` int NOT NULL AUTO_INCREMENT,
  `property_id` int NOT NULL,
  `adu_type` varchar(100) DEFAULT NULL,
  `adu_count` int DEFAULT NULL,
  `adu_max_sqft` decimal(10,2) DEFAULT NULL,
  `height` decimal(10,2) DEFAULT NULL,
  `length` decimal(10,2) DEFAULT NULL,
  `breadth` decimal(10,2) DEFAULT NULL,
  `setbacks_front_back` decimal(10,2) DEFAULT NULL,
  `side_yards` decimal(10,2) DEFAULT NULL,
  `no_of_units` int DEFAULT NULL,
  PRIMARY KEY (`adu_id`),
  KEY `property_id` (`property_id`),
  CONSTRAINT `adu_details_ibfk_1` FOREIGN KEY (`property_id`) REFERENCES `properties` (`property_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `jadu_details`
--

DROP TABLE IF EXISTS `jadu_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jadu_details` (
  `jadu_id` int NOT NULL AUTO_INCREMENT,
  `property_id` int NOT NULL,
  `jadu_type` varchar(100) DEFAULT NULL,
  `jadu_count` int DEFAULT NULL,
  `jadu_max_sqft` decimal(10,2) DEFAULT NULL,
  `height` decimal(10,2) DEFAULT NULL,
  `length` decimal(10,2) DEFAULT NULL,
  `breadth` decimal(10,2) DEFAULT NULL,
  `setbacks_front_back` decimal(10,2) DEFAULT NULL,
  `side_yards` decimal(10,2) DEFAULT NULL,
  `no_of_units` int DEFAULT NULL,
  PRIMARY KEY (`jadu_id`),
  KEY `property_id` (`property_id`),
  CONSTRAINT `jadu_details_ibfk_1` FOREIGN KEY (`property_id`) REFERENCES `properties` (`property_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `lot_zoning_details`
--

DROP TABLE IF EXISTS `lot_zoning_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `lot_zoning_details` (
  `lot_zoning_id` int NOT NULL AUTO_INCREMENT,
  `property_id` int NOT NULL,
  `use_type` varchar(100) DEFAULT NULL,
  `lot_area_sqft` decimal(10,2) DEFAULT NULL,
  `lot_width_ft` decimal(10,2) DEFAULT NULL,
  `lot_depth_ft` decimal(10,2) DEFAULT NULL,
  `setback_front_ft` decimal(10,2) DEFAULT NULL,
  `setback_back_ft` decimal(10,2) DEFAULT NULL,
  `setback_side_ft` decimal(10,2) DEFAULT NULL,
  `max_height_ft` decimal(10,2) DEFAULT NULL,
  `parking_spaces_required` int DEFAULT NULL,
  PRIMARY KEY (`lot_zoning_id`),
  KEY `property_id` (`property_id`),
  CONSTRAINT `lot_zoning_details_ibfk_1` FOREIGN KEY (`property_id`) REFERENCES `properties` (`property_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=35 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `parking_requirements`
--

DROP TABLE IF EXISTS `parking_requirements`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `parking_requirements` (
  `parking_id` int NOT NULL AUTO_INCREMENT,
  `property_id` int NOT NULL,
  `parking_spaces` int NOT NULL,
  `Eligible_For_Bonus` tinyint(1) NOT NULL,
  `Bonus_Type` varchar(100) DEFAULT NULL,
  `Bonus_Percentage` decimal(5,2) DEFAULT NULL,
  PRIMARY KEY (`parking_id`),
  KEY `property_id` (`property_id`),
  CONSTRAINT `parking_requirements_ibfk_1` FOREIGN KEY (`property_id`) REFERENCES `properties` (`property_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `plans`
--

DROP TABLE IF EXISTS `plans`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `plans` (
  `id` int NOT NULL AUTO_INCREMENT,
  `length` float NOT NULL,
  `width` float NOT NULL,
  `material` varchar(50) NOT NULL,
  `type` varchar(10) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `properties`
--

DROP TABLE IF EXISTS `properties`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `properties` (
  `property_id` int NOT NULL AUTO_INCREMENT,
  `address` varchar(255) NOT NULL,
  `apn` varchar(100) NOT NULL,
  `pincode` varchar(20) NOT NULL,
  `zoning` varchar(100) NOT NULL,
  `plot_area_sqft` decimal(10,2) NOT NULL,
  `height_limit_ft` decimal(10,2) NOT NULL,
  `depth_ft` decimal(10,2) NOT NULL,
  `width_ft` decimal(10,2) NOT NULL,
  `building_sqft` decimal(10,2) NOT NULL,
  `parking_spaces` int DEFAULT '0',
  `garages` int DEFAULT '0',
  PRIMARY KEY (`property_id`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `setbacks`
--

DROP TABLE IF EXISTS `setbacks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `setbacks` (
  `setback_id` int NOT NULL AUTO_INCREMENT,
  `property_id` int NOT NULL,
  `front_ft` decimal(10,2) DEFAULT NULL,
  `back_ft` decimal(10,2) DEFAULT NULL,
  `side_ft` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`setback_id`),
  KEY `property_id` (`property_id`),
  CONSTRAINT `setbacks_ibfk_1` FOREIGN KEY (`property_id`) REFERENCES `properties` (`property_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `uploaded_files`
--

DROP TABLE IF EXISTS `uploaded_files`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `uploaded_files` (
  `id` int NOT NULL AUTO_INCREMENT,
  `filename` varchar(255) DEFAULT NULL,
  `file_path` varchar(255) DEFAULT NULL,
  `upload_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=78 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `full_name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `contact_number` varchar(20) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('Admin','User') DEFAULT 'User',
  `reset_token` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-02-13  0:25:39
