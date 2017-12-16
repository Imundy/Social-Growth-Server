const mysql = require('mysql2/promise');
const config = require('../../config');
const { socialAccountTypes, socialAccountMapper } = require('./social-account-types');

const SocialService = {
  logError: async (pageId, error) => {
    const connection = await mysql.createConnection(config.mysqlCreds);
    try {
      let [rows, fields] = await connection.query(
        `INSERT INTO facebook_auto_error (page_id, error) VALUES (:pageId, :error);`,
        { pageId, error }
      );
    } catch (error) {
      console.log(error);
    }
  },
  getPageById: async (pageId) => {
    const connection = await mysql.createConnection(config.mysqlCreds);
    let page;
    try {
      let [rows, fields] = await connection.query(
        `SELECT account_id as accountId, page_id as pageId FROM facebook_pages WHERE page_id = :pageId;`,
        { pageId }
      );

      if (!rows[0]) {
        return { success: null };
      }

      page = rows[0];
    } catch (error) {
      return { error };
    }

    try {
      let [rows, fields] = await connection.query(
        `SELECT account_id as accountId, settings, tokens FROM social_settings s INNER JOIN social_accounts a ON s.account_id = a.id WHERE account_id = :accountId;`,
        { accountId: page.accountId }
      );

      if (!rows[0]) {
        return { success: null };
      }

      return { success: rows[0] };
    } catch (error) {
      return { error };
    }
  },
  getFacebookPages: async (accountId) => {
    const connection = await mysql.createConnection(config.mysqlCreds);
    try {
      let [rows, fields] = await connection.query(
        `SELECT * FROM facebook_pages WHERE account_id = :accountId;`,
        { accountId }
      );
      
      if (!rows[0]) {
        return { success: [] };
      }
  
      return { success: rows };
    } catch (error) {
      return { error };
    }
  },
  addFacebookPage: async ({ pageId, accountId }) => {
    const connection = await mysql.createConnection(config.mysqlCreds);
    // need to validate faebook page

    let [rows, fields] = await connection.query(
      'SELECT * FROM facebook_pages WHERE page_id = :pageId;',
      { pageId }
    );

    if (!rows[0]) {
      try {
        [rows] = await connection.query(
          'INSERT INTO facebook_pages (page_id, account_id) VALUES (:pageId, :accountId)',
          { pageId: pageId.toString(), accountId }
        );
        return { error: null, success: true };
      } catch (error) {
        return { error };
      }
    } else {
      // validate 
      return { error: 'Page is already managed' };
    }
  },
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
    try {
      const connection = await mysql.createConnection(config.mysqlCreds);

      let [rows, fields] = await connection.query(
        `SELECT * FROM social_accounts_to_users WHERE user_id = :userId AND signed_in = TRUE;`,
        { userId }
      );

      let accounts = [];
      if (rows.length > 0) {
        [rows, fields] = await connection.query(
          `SELECT * FROM social_accounts WHERE id IN (:accountIds);`,
          { accountIds: rows.map(x => x.account_id) }
        );
        accounts = rows.map(account => ({
          id: account.id,
          userId,
          socialAccountId: account.social_account_id,
          tokens: account.tokens,
          type: socialAccountMapper[account.type],
        }));
      }
      connection.destroy();
      return accounts;
    } catch(err) {
      // err
      console.log(err);
      return 'error';
    }
  },
  getAccountForUser: async ({ userId, accountId }) => {
    try {
      const connection = await mysql.createConnection(config.mysqlCreds);

      let [rows, fields] = await connection.query(
        `SELECT * FROM social_accounts_to_users WHERE account_id = :accountId AND user_id = :userId;`,
        { accountId, userId }
      );
      const accountUser = rows[0];
      if (!accountUser || !accountUser.signed_in) {
        connection.destroy();
        return null;
      }

      [rows, fields] = await connection.query(
        `SELECT * FROM social_accounts WHERE id = :accountId;`,
        { accountId }
      );
      const account = rows[0];
      connection.destroy();
      return {
        id: account.id,
        userId,
        socialAccountId: account.social_account_id,
        tokens: account.tokens,
        type: socialAccountMapper[account.type],
      };
    } catch(err) {
      // err
      console.log(err);
      return 'error';
    }
  },
  getSettingsForAccount: async ({ accountId, userId }) => {
    try {
      const connection = await mysql.createConnection(config.mysqlCreds);

      let [rows, fields] = await connection.query(
        `SELECT * FROM social_accounts_to_users WHERE user_id = :userId AND account_id = :accountId AND signed_in = TRUE;`,
        { accountId , userId }
      );

      if (!rows[0]) {
        connection.destroy();
        return null;
      }

      [rows, fields] = await connection.query(
        `SELECT * FROM social_settings WHERE account_id = :accountId;`,
        { accountId }
      );

      const settingsRow = rows[0];
      return settingsRow ? {
        id: settingsRow.id,
        accountId,
        settings: settingsRow.settings,
      } : null;
    } catch(err) {
      // err
      console.log(err);
      return 'error';
    }
  },
  updateSettingsForAccount: async ({ accountId, userId, settings }) => {
    try {
      const connection = await mysql.createConnection(config.mysqlCreds);

      let [rows, fields] = await connection.query(
        `SELECT * FROM social_accounts_to_users WHERE user_id = :userId AND account_id = :accountId AND signed_in = TRUE;`,
        { accountId , userId }
      );

      if (!rows[0]) {
        connection.destroy();
        throw new Error('unauthorized');
      }

      [rows, fields] = await connection.query(
        `SELECT * FROM social_settings WHERE account_id = :accountId;`,
        { accountId }
      );

      let settingId;
      if (!rows[0]) {
        [rows] = await connection.query(
          `INSERT INTO social_settings (account_id, settings) VALUES (:accountId, :settings);`,
          { accountId,  settings: JSON.stringify(settings) }
        );
        settingId = rows.insertId;
      } else {
        settingId = rows[0].id;
        [rows] = await connection.query(
          `UPDATE social_settings SET settings = :settings WHERE account_id = :accountId;`,
          { accountId,  settings: JSON.stringify(settings) }
        );
      }

      connection.destroy();
      return settingId;
    } catch(err) {
      // err
      console.log(err);
      return 'error';
    }
  }
};

module.exports = SocialService;
