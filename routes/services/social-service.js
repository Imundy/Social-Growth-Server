const mysql = require('mysql2/promise');
const config = require('../../config');
const socialAccountTypes = require('./social-account-types');

const SocialService = {
  addAccount: async ({ userId, type, tokens, socialAccountId }) => {
    try {
      const connection = await mysql.createConnection(config.mysqlCreds);
      const socialAccountType = socialAccountTypes[type];

      let [rows, fields] = await connection.query(
        `SELECT * FROM social_accounts WHERE social_account_id = :socialAccountId;`,
        { socialAccountId }
      );

      let accountId;
      let socialAccountToUser;
      if (!rows[0]) {
        [rows] = await connection.query(
          'INSERT INTO social_accounts (type, tokens, social_account_id) VALUES (:type, :tokens, :socialAccountId);', 
          { type: socialAccountType, tokens: JSON.stringify(tokens), socialAccountId });
        accountId = rows.insertId;
      } else {
        accountId = rows[0].id;
        if (rows[0].tokens == null) {
          await connection.execute(
            `UPDATE social_accounts SET tokens = :tokens WHERE id = :accountId;`,
            { tokens: JSON.stringify(tokens), accountId }
          );
        }
        [rows, fields] = await connection.query(
          `SELECT * FROM social_accounts_to_users WHERE account_id = :accountId AND user_id = :userId;`,
          { accountId,  userId }
        );
        socialAccountToUser = rows[0];
      }

      if (!socialAccountToUser) {
        [rows] = await connection.query(
          'INSERT INTO social_accounts_to_users (account_id, user_id, signed_in) VALUES (:accountId, :userId, TRUE);', 
          { accountId, userId });
      } else if (!socialAccountToUser.signed_in) {
        [rows] = await connection.query(
          'UPDATE social_accounts_to_users SET signed_in = TRUE WHERE account_id = :accountId AND user_id = :userId;', 
          { accountId, userId });
      }

      connection.destroy();
      return accountId;
    } catch(err) {
      // err
      console.log(err);
      return 'error';
    }
  },
  removeAccount: async ({ userId, accountId }) => {
    try {
      const connection = await mysql.createConnection(config.mysqlCreds);

      let [rows] = await connection.query(
        `UPDATE social_accounts_to_users SET signed_in = FALSE WHERE account_id = :accountId AND user_id = :userId;`,
        { accountId,  userId }
      );

      [rows, fields] = await connection.query(
        `SELECT * FROM social_accounts_to_users WHERE account_id = :accountId;`,
        { accountId }
      );

      const anySignedIn = rows.some(x => x.signed_in);
      if (!anySignedIn) {
        await connection.execute(
          `UPDATE social_accounts SET tokens = NULL WHERE id = :accountId;`,
          { accountId }
        );
      }

      connection.destroy();
      return;
    } catch(err) {
      // err
      console.log(err);
      return 'error';
    }
  },
  getAccountsForUser: async ({ userId }) => {

  },
  getAccount: async ({ accountId }) => {

  },
  getSettingsForService: async ({ accountId }) => {

  },
  updateSettingsForService: async ({ accountId, settings }) => {

  }
};

module.exports = SocialService;
