const express = require('express')
const router = express.Router()
const auth = require('../middleware/authMiddleware')
const {createTask, getTasks, updateTask, deleteTask, smartAssign, claimTask} = require('../controllers/taskController')
const { getLastActions } = require('../controllers/actionController');


router.post('/', auth, createTask)
router.get('/', auth, getTasks)
router.put('/:id', auth, updateTask)
router.delete('/:id', auth, deleteTask)
router.post('/smart-assign/:taskId', auth, smartAssign)
router.post('/claim/:taskId', auth, claimTask);
router.get('/actions', auth, getLastActions);


module.exports = router