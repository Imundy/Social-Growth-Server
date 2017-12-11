CREATE TABLE `facebook_pages` (
  `account_id` int(11) NOT NULL,
  `page_id` varchar(32) NOT NULL,
  KEY `fb_account_id_idx` (`account_id`),
  KEY `fb_page_id_idx` (`page_id`),
  CONSTRAINT `fb_account_id` FOREIGN KEY (`account_id`) REFERENCES `social_accounts` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
