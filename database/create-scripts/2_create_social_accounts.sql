CREATE TABLE `social_accounts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `type` int(11) NOT NULL,
  `tokens` json NOT NULL,
  `social_account_id` bigint(20) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `social_account_id_type` (`social_account_id`,`type`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
