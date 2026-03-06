const express = require('express');
const empleadoController = require('../controller/empleadoController');
const router = express.Router();
// Rutas para los países
router.get('/', empleadoController.getAllEmpleados);
router.get('/:id', empleadoController.getEmpleadoById);
router.post('/', empleadoController.createEmpleado);
router.put('/:id', empleadoController.updateEmpleado);
router.delete('/:id', empleadoController.deleteEmpleado);
module.exports = router;