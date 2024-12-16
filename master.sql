
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `full_name` varchar(100) DEFAULT NULL,
  `email` varchar(100) NOT NULL,
  `contact_number` varchar(20) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('Admin','User') DEFAULT 'User',
  `reset_token` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
);


INSERT INTO `users` (`id`, `full_name`, `email`, `contact_number`, `password`, `role`, `reset_token`, `created_at`, `updated_at`) VALUES
(16, 'vijay user', 'nawalevijay84@gmail.com', '1234567890', '$2a$10$mw6MFo.jeDWRzKciWNNFSuyiS5Ee9c4Fuc3ar2lSZ5cFwXmPwsw7G', 'Admin', NULL, '2024-11-20 19:21:56', '2024-11-20 20:20:52');

