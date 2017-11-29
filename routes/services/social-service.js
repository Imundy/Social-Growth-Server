const mysql = require('mysql2/promise');
const config = require('../../config');

const SocialService = {
  addAccount: async ({ userId, type, tokens }) => {

  },
  removeAccount: async ({ userId, accountId }) => {

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
