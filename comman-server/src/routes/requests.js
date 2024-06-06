var express = require('express');
var router = express.Router();
const auth = require('../middleware/index');

const RequestController = require('../app/controllers/RequestController');

router.get('/', auth, RequestController.getAllRequest);
router.get('/received-requests', auth, RequestController.getReceivedRequest);
router.get('/sent-requests', auth, RequestController.getSentRequest);
router.get('/:reqId', auth, RequestController.getRequest);
router.post('/', auth, RequestController.postRequest);
router.put('/:reqId', auth, RequestController.updateRequest);
router.put('/status/:reqId', auth, RequestController.updateStatusRequest);
router.delete('/:reqId', auth, RequestController.deleteRequest);

module.exports = router;
