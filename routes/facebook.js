var express = require('express');
var router = express.Router();

router.get('/webhook', (req, res) => {
  const verify = req.query['hub.verify_token'];

  if (verify === 'quothTheRavenNevermore') {
    return res.json(parseInt(req.query['hub.challenge'], 10));
  }

  return res.status(200).send();
});

router.post('/webhook', (req, res) => {
  if (req.body.entry) {
    req.body.entry.forEach(entry => {
      const change = entry.changes.find(x => x.verb === 'add');
      if (change.field === 'feed') {
        likePost(change.value);
        hidePost(change.value);
      }
    })
  }
  return res.status(200).send();
});

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

likePost(post) {

}

module.exports = router;
