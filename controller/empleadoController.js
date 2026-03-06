const pool = require('../db');
// Obtener todos los empleados
exports.getAllEmpleados = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM empleados ORDER BY nombre');
        res.json(rows);
    } catch (error) {
        console.error('Error al obtener los empleados:', error);
        res.status(500).json({ error: 'Error al obtener los empleados' });
    }
};
// Obtener un empleado por ID
exports.getEmpleadoById = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM empleados WHERE id = ?', [req.params.id]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Empleado no encontrado' });
        }
        res.json(rows[0]);
    } catch (error) {
        console.error('Error al obtener el empleado:', error);
        res.status(500).json({ error: 'Error al obtener el empleado' });
    }
};
// Crear un nuevo empleado
exports.createEmpleado = async (req, res) => {
    const { nombre, correo, rol, prioridad } = req.body;
    // Validación básica
    if (!nombre) {
        return res.status(400).json({ error: 'El nombre del empleado es obligatorio' });
    }
    try {
        const [result] = await pool.query(
            'INSERT INTO empleados (nombre, correo, rol, prioridad) VALUES (?, ?, ?, ?)',
            [nombre, correo, rol, prioridad]
        );
        const [rows] = await pool.query('SELECT * FROM empleados WHERE id = ?', [result.insertId]);
        res.status(201).json(rows[0]);
    } catch (error) {
        console.error('Error al crear el empleado:', error);
        res.status(500).json({ error: 'Error al crear el empleado' });
    }
};

// Actualizar un empleado existente
exports.updateEmpleado = async (req, res) => {
    const { nombre, correo, rol, prioridad } = req.body;
    const empleadoId = req.params.id;
    // Validación básica
    if (!nombre) {
        return res.status(400).json({ error: 'El nombre del empleado es obligatorio' });
    }
    try {
        // Verificar si el empleado existe
        const [checkRows] = await pool.query('SELECT * FROM empleados WHERE id = ?', [empleadoId]);
        if (checkRows.length === 0) {
            return res.status(404).json({ error: 'Empleado no encontrado' });
        }
        // Actualizar el empleado
        await pool.query(
            'UPDATE empleados SET nombre = ?, correo = ?, rol = ?, prioridad = ? WHERE id = ?',
            [nombre, correo, rol, prioridad, empleadoId]
        );
        const [rows] = await pool.query('SELECT * FROM empleados WHERE id = ?', [empleadoId]);
        res.json(rows[0]);
    } catch (error) {
        console.error('Error al actualizar el empleado:', error);
        res.status(500).json({ error: 'Error al actualizar el empleado' });
    }
};
// Eliminar un empleado
exports.deleteEmpleado = async (req, res) => {
    const empleadoId = req.params.id;
    try {
        // Verificar si el empleado existe
        const [checkRows] = await pool.query('SELECT * FROM empleados WHERE id = ?', [empleadoId]);
        if (checkRows.length === 0) {
            return res.status(404).json({ error: 'Empleado no encontrado' });
        }
        // Eliminar el empleado
        await pool.query('DELETE FROM empleados WHERE id = ?', [empleadoId]);
        res.json({ message: 'Empleado eliminado con éxito' });
    } catch (error) {
        console.error('Error al eliminar el empleado:', error);
        res.status(500).json({ error: 'Error al eliminar el empleado' });
    }
};