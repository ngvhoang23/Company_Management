var express = require('express');
var router = express.Router();
const auth = require('../middleware/index');
const DocumentController = require('../app/controllers/DocumentController');
const { uploadDocument } = require('../uploadModal/uploadModal');

router.get('/', auth, DocumentController.getAllDocument);
router.get('/searching/:search_value', auth, DocumentController.searchDocument);
router.post('/', auth, uploadDocument.single('document'), DocumentController.postDocument);

router.delete('/:docId', auth, DocumentController.deleteDocument);

module.exports = router;
