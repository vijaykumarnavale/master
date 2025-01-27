-- MySQL dump 10.13  Distrib 8.0.40, for Win64 (x86_64)
--
-- Host: localhost    Database: master
-- ------------------------------------------------------
-- Server version	8.0.40

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
  `adu_type` varchar(100) NOT NULL,
  `adu_count` int NOT NULL,
  `adu_max_sqft` decimal(10,2) NOT NULL,
  `height` decimal(10,2) DEFAULT NULL,
  `length` decimal(10,2) DEFAULT NULL,
  `breadth` decimal(10,2) DEFAULT NULL,
  `setbacks_front_back` decimal(10,2) DEFAULT NULL,
  `side_yards` decimal(10,2) DEFAULT NULL,
  `no_of_units` int DEFAULT NULL,
  PRIMARY KEY (`adu_id`),
  KEY `property_id` (`property_id`),
  CONSTRAINT `adu_details_ibfk_1` FOREIGN KEY (`property_id`) REFERENCES `properties` (`property_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `adu_details`
--

LOCK TABLES `adu_details` WRITE;
/*!40000 ALTER TABLE `adu_details` DISABLE KEYS */;
INSERT INTO `adu_details` VALUES (1,15,'Attached',345,345345.00,345.00,345.00,345.00,343.00,34.00,345),(2,16,'Attached',67,67.00,76.00,76.00,76.00,76.00,6.00,76),(3,17,'Attached',5,5.00,5.00,5.00,2.00,5.00,5.00,5),(6,17,'Detached',2,800.00,15.00,30.00,20.00,66.00,66.00,1),(7,20,'Detached',2,800.00,15.00,30.00,20.00,66.00,66.00,1),(8,20,'Attached',1,500.00,10.00,25.00,15.00,50.00,50.00,2),(9,21,'Attached',3,3.00,3.00,3.00,3.00,3.00,3.00,3),(10,21,'Attached',666,76.00,676.00,56.00,456.00,456.00,456.00,76),(11,21,'Detached',45,45.00,456.00,456.00,456.00,456.00,456.00,456),(12,21,'Attached',456,456.00,456.00,456.00,456.00,456.00,456.00,456),(13,22,'Attached',9,9.00,9.00,9.00,9.00,9.00,9.00,9);
/*!40000 ALTER TABLE `adu_details` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `jadu_details`
--

DROP TABLE IF EXISTS `jadu_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jadu_details` (
  `jadu_id` int NOT NULL AUTO_INCREMENT,
  `property_id` int NOT NULL,
  `jadu_type` varchar(100) NOT NULL,
  `jadu_count` int NOT NULL,
  `jadu_max_sqft` decimal(10,2) NOT NULL,
  `height` decimal(10,2) DEFAULT NULL,
  `length` decimal(10,2) DEFAULT NULL,
  `breadth` decimal(10,2) DEFAULT NULL,
  `setbacks_front_back` decimal(10,2) DEFAULT NULL,
  `side_yards` decimal(10,2) DEFAULT NULL,
  `no_of_units` int DEFAULT NULL,
  PRIMARY KEY (`jadu_id`),
  KEY `property_id` (`property_id`),
  CONSTRAINT `jadu_details_ibfk_1` FOREIGN KEY (`property_id`) REFERENCES `properties` (`property_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `jadu_details`
--

LOCK TABLES `jadu_details` WRITE;
/*!40000 ALTER TABLE `jadu_details` DISABLE KEYS */;
INSERT INTO `jadu_details` VALUES (1,17,'Detached',2,800.00,15.00,30.00,20.00,66.00,66.00,1),(2,17,'Attached',1,500.00,10.00,25.00,15.00,50.00,50.00,2),(3,22,'Attached',87,786.00,87.00,99.00,67.00,546.00,546.00,546),(4,22,'Detached',99,456.00,456.00,546.00,456.00,456.00,456.00,546),(5,22,'Detached',7,34.00,45.00,345.00,345.00,435.00,435.00,345),(6,22,'Attached',5555,5.00,55.00,5.00,5.00,5.00,5.00,5),(7,22,'Attached',5,66.00,6.00,6.00,6.00,6.00,6.00,6),(8,22,'Attached',4577,7.00,7.00,7.00,7.00,7.00,7.00,7),(9,22,'Attached',77,7.00,7.00,7.00,7.00,7.00,7.00,7),(10,22,'Detached',7,7.00,7.00,7.00,7.00,7.00,7.00,7),(11,22,'Attached',76,76.00,67.00,67.00,76.00,67.00,67.00,67),(12,22,'Attached',87,34.00,34.00,324.00,234.00,234.00,234.00,324),(13,22,'Attached',76,76.00,67.00,67.00,76.00,76.00,67.00,67),(14,22,'Detached',11,11.00,11.00,11.00,11.00,11.00,11.00,11),(15,22,'Attached',67,67.00,676.00,76.00,767.00,67.00,67.00,6);
/*!40000 ALTER TABLE `jadu_details` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `lot_zoning_details`
--

DROP TABLE IF EXISTS `lot_zoning_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `lot_zoning_details` (
  `lot_zoning_id` int NOT NULL AUTO_INCREMENT,
  `property_id` int NOT NULL,
  `use_type` varchar(100) NOT NULL,
  `lot_area_sqft` decimal(10,2) NOT NULL,
  `lot_width_ft` decimal(10,2) NOT NULL,
  `lot_depth_ft` decimal(10,2) NOT NULL,
  `setback_front_ft` decimal(10,2) NOT NULL,
  `setback_back_ft` decimal(10,2) NOT NULL,
  `setback_side_ft` decimal(10,2) NOT NULL,
  `max_height_ft` decimal(10,2) NOT NULL,
  `parking_spaces_required` int NOT NULL,
  PRIMARY KEY (`lot_zoning_id`),
  KEY `property_id` (`property_id`),
  CONSTRAINT `lot_zoning_details_ibfk_1` FOREIGN KEY (`property_id`) REFERENCES `properties` (`property_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lot_zoning_details`
--

LOCK TABLES `lot_zoning_details` WRITE;
/*!40000 ALTER TABLE `lot_zoning_details` DISABLE KEYS */;
INSERT INTO `lot_zoning_details` VALUES (1,15,'Affordable Housing',345.00,345.00,345.00,34.00,345.00,345.00,345.00,345),(2,15,'Single-family residential',5000.50,50.25,100.75,20.00,25.00,10.00,35.00,2),(3,15,'Townhouses',6000.00,60.00,120.00,15.00,30.00,12.50,40.00,3),(4,16,'Affordable Housing',456.00,343.00,343.00,76.00,767.00,767.00,767.00,76),(5,17,'Affordable Housing',5.00,5.00,55.00,5.00,5.00,5.00,5.00,5),(6,18,'Condominiums',786.00,76876.00,868.00,76876.00,876.00,8768.00,768.00,6876),(7,19,'Condominiums',3.00,3.00,3.00,3.00,3.00,3.00,3.00,3),(8,20,'Affordable Housing',11.00,11.00,11.00,11.00,11.00,11.00,11.00,11),(9,21,'Condominiums',3.00,3.00,3.00,3.00,3.00,3.00,3.00,3),(10,22,'Affordable Housing',9.00,9.00,9.00,9.00,9.00,9.00,9.00,9);
/*!40000 ALTER TABLE `lot_zoning_details` ENABLE KEYS */;
UNLOCK TABLES;

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `parking_requirements`
--

LOCK TABLES `parking_requirements` WRITE;
/*!40000 ALTER TABLE `parking_requirements` DISABLE KEYS */;
/*!40000 ALTER TABLE `parking_requirements` ENABLE KEYS */;
UNLOCK TABLES;

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
-- Dumping data for table `plans`
--

LOCK TABLES `plans` WRITE;
/*!40000 ALTER TABLE `plans` DISABLE KEYS */;
INSERT INTO `plans` VALUES (1,12,12,'tile','2d','2024-12-23 14:26:59'),(2,12,12,'wood','2d','2024-12-23 14:27:16'),(3,12,12,'wood','2d','2024-12-23 14:27:19'),(4,12,12,'carpet','2d','2024-12-23 14:27:26');
/*!40000 ALTER TABLE `plans` ENABLE KEYS */;
UNLOCK TABLES;

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
-- Dumping data for table `properties`
--

LOCK TABLES `properties` WRITE;
/*!40000 ALTER TABLE `properties` DISABLE KEYS */;
INSERT INTO `properties` VALUES (13,'At Soundala, Post Bhenda, Tel Newasa, Dist Ahmednagar, Pin 414605 Maharashatra India.','67','414605','45',34.00,34.00,34.00,345.00,345.00,0,0),(14,'At Soundala, Post Bhenda, Tel Newasa, Dist Ahmednagar, Pin 414605 Maharashatra India.','4018-009-019','414605','45',45.00,345.00,345.00,345.00,345.00,0,0),(15,'sdf','34','345','345',435.00,345.00,345.00,345.00,345.00,0,0),(16,'sdf','546','3456','345',345.00,3453.00,345.00,345.00,34.00,0,0),(17,'At Soundala, Post Bhenda, Tel Newasa, Dist Ahmednagar, Pin 414605 Maharashatra India.','wer','34','5',5.00,5.00,5.00,5.00,5.00,5,5),(18,'At Soundala, Post Bhenda, Tel Newasa, Dist Ahmednagar, Pin 414605 Maharashatra India.','67687','67867','678',768.00,68768.00,686.00,8686.00,868.00,67876,876876),(19,'abc','1','1','1',1.00,1.00,1.00,1.00,1.00,1,1),(20,'11','11','11','11',11.00,11.00,11.00,1.00,1.00,1,1),(21,'3','3','3','3',3.00,3.00,3.00,3.00,3.00,3,3),(22,'9','9','9','9',9.00,9.00,9.00,9.00,9.00,9,9);
/*!40000 ALTER TABLE `properties` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `setbacks`
--

DROP TABLE IF EXISTS `setbacks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `setbacks` (
  `setback_id` int NOT NULL AUTO_INCREMENT,
  `property_id` int NOT NULL,
  `front_ft` decimal(10,2) NOT NULL,
  `back_ft` decimal(10,2) NOT NULL,
  `side_ft` decimal(10,2) NOT NULL,
  PRIMARY KEY (`setback_id`),
  KEY `property_id` (`property_id`),
  CONSTRAINT `setbacks_ibfk_1` FOREIGN KEY (`property_id`) REFERENCES `properties` (`property_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `setbacks`
--

LOCK TABLES `setbacks` WRITE;
/*!40000 ALTER TABLE `setbacks` DISABLE KEYS */;
INSERT INTO `setbacks` VALUES (1,13,345.00,345.00,345.00),(2,14,345.00,345.00,345.00),(3,15,345.00,345.00,345.00),(4,16,456.00,345.00,345.00),(5,17,5.00,5.00,5.00),(6,18,787.00,768.00,8768.00),(7,19,2.00,2.00,2.00),(8,20,11.00,11.00,11.00),(9,21,3.00,3.00,3.00),(10,22,9.00,9.00,9.00);
/*!40000 ALTER TABLE `setbacks` ENABLE KEYS */;
UNLOCK TABLES;

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
) ENGINE=InnoDB AUTO_INCREMENT=69 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `uploaded_files`
--

LOCK TABLES `uploaded_files` WRITE;
/*!40000 ALTER TABLE `uploaded_files` DISABLE KEYS */;
INSERT INTO `uploaded_files` VALUES (65,'To calculate the building area that can be built on a lot.pdf','/uploads/1737398398250.pdf','2025-01-20 18:39:58'),(66,'To calculate the building area that can be built on a lot.pdf','/uploads/1737398415228.pdf','2025-01-20 18:40:15'),(67,'To calculate the building area that can be built on a lot.pdf','/uploads/1737398590050.pdf','2025-01-20 18:43:10'),(68,'To calculate the building area that can be built on a lot.pdf','/uploads/1737398727935.pdf','2025-01-20 18:45:27');
/*!40000 ALTER TABLE `uploaded_files` ENABLE KEYS */;
UNLOCK TABLES;

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
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (2,'Vijay Navale','navalevijay85@gmail.com','9307076766','$2a$10$Fkjg9J3raAHbx5qafTcpkesIO.othWh.pM8qC/rJZ4tt9thwPE8rG','Admin',NULL,'2024-12-17 17:39:02','2025-01-06 18:43:04'),(3,'Vijay Navale','navalevijay83@gmail.com','09307076765','$2a$10$BJ8VrLxKgIIpd4/N9MFeS.Ts3w4IN/daS5Gfmw1VyCxZNqmEXo1La','User',NULL,'2024-12-17 17:39:16','2024-12-17 17:39:16');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-01-22  0:52:19
