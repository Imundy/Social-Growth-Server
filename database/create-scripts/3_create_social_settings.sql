CREATE TABLE `social_settings` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `account_id` int(11) NOT NULL,
  `settings` json DEFAULT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `account_id` FOREIGN KEY (`id`) REFERENCES `social_accounts` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
