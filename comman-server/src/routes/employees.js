var express = require('express');
var router = express.Router();
const auth = require('../middleware/index');

const EmployeeController = require('../app/controllers/EmployeeController');
const { uploadUserAvatar } = require('../uploadModal/uploadModal');

router.get('/', auth, EmployeeController.getAllEmployee);
router.get('/searching/:search_value', auth, EmployeeController.searchEmployees);
router.get('/managers', auth, EmployeeController.getAllManager);
router.get('/by-department/:depId', auth, EmployeeController.getEmployeeByDepartment);
router.get('/inindividual-info', auth, EmployeeController.getIndividualInfo);
router.post('/', auth, uploadUserAvatar.single('userAvatar'), EmployeeController.postEmployee);
router.post('/change-password-by-admin', auth, EmployeeController.changePasswordByAdmin);
router.post('/change-password', auth, EmployeeController.changePassword);
router.get('/:empId', auth, EmployeeController.getEmployeeInfo);

router.put('/:empId', auth, uploadUserAvatar.single('userAvatar'), EmployeeController.updateEmployee);

router.put(
    '/personal-profile/:empId',
    auth,
    uploadUserAvatar.single('userAvatar'),
    EmployeeController.updatePersonalProfile,
);

router.delete('/:empId', auth, EmployeeController.deleteEmployee);

module.exports = router;
