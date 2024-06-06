var express = require('express');
var router = express.Router();
const auth = require('../middleware/index');

const CalendarController = require('../app/controllers/CalendarController');

router.get('/', auth, CalendarController.getAllCalendar);
router.get('/requests', auth, CalendarController.getCalendarRequests);
router.get('/requests/:calReqId', auth, CalendarController.getCalendarRequest);
router.get('/:calId', auth, CalendarController.getCalendar);
router.post('/', auth, CalendarController.postCalendar);
router.post('/requests', auth, CalendarController.postCalendarRequest);
router.put('/:calId', auth, CalendarController.updateCalendar);
router.put('/requests/:calId', auth, CalendarController.updateCalendarRequest);
router.delete('/:calId', auth, CalendarController.deleteCalendar);
router.delete('/requests/:calId', auth, CalendarController.deleteCalendarRequest);

module.exports = router;
