const request = require('request');
const express = require('express');
const socialService = require('./services/social-service');

const router = express.Router();

router.get('/webhook', (req, res) => {
  const verify = req.query['hub.verify_token'];

  if (verify === 'quothTheRavenNevermore') {
    return res.json(parseInt(req.query['hub.challenge'], 10));
  }

  return res.status(200).send();
});

router.post('/webhook', (req, res) => {
  if (req.body.entry) {
    req.body.entry.forEach(async entry => {
      const change = entry.changes.find(x => x.value.verb === 'add');
      const { error, success } = await socialService.getPageById(entry.id);
      if (error != null || success == null || change == null) {
        return;
      }

      if (change.field === 'feed' && success != null && success.settings != null) {
        if (success.settings.autoHideComments.on) {
          hidePost(change.value, success);
        }
      }
    })
  }

  return res.status(200).send();
});

// SAMPLE FACEBOOK WEBHOOK POST
// {
//   "entry": [
//     {
//       "changes": [
//         {
//           "field": "feed",
//           "value": {
//             "recipient_id": "184126008807648",
//             "from": {
//               "id": "115999789188722"
//             },
//             "item": "post",
//             "post_id": "184126008807648_189146338305615",
//             "verb": "remove",
//             "created_time": 1512949967
//           }
//         }
//       ],
//       "id": "184126008807648",
//       "time": 1512949981
//     }
//   ],
//   "object": "page"
// }

const hidePost = (post, page) => {
  let flag = false;
  page.settings.autoHideComments.value.split(',').forEach(value => {
    if (value.trim().length !== 0 && post.message.toLowerCase().indexOf(value.toLowerCase()) !== -1) {
      flag = true;
    }
  });

  if (post.message != null && flag) {
    request(
      {
        method: 'POST',
        url: 'https://graph.facebook.com/' + post['post_id'],
        qs:
        {
          access_token: page.tokens[0],
          is_hidden: true
        },
      },
      async (err, response, body) => {
        if (err != null || response.statusCode < 200 || response.statusCode >= 300) {
          await socialService.logError(page.accountId, err || { error: 'request failed' });
        } else {
          return;
        }
      }
    );
  }
}

module.exports = router;
