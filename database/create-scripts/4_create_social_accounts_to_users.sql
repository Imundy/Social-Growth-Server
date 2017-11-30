CREATE TABLE `social_accounts_to_users` (
  `account_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `signed_in` tinyint(4) NOT NULL,
  UNIQUE KEY `social_user_accounts` (`user_id`,`account_id`),
  KEY `account_id_idx` (`account_id`),
  KEY `user_id_idx` (`user_id`),
  CONSTRAINT `ua_account_id` FOREIGN KEY (`account_id`) REFERENCES `social_accounts` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `ua_user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
