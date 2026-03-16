const express = require('express');
const { createItem, getItems, getItemById, updateItemStatus, deleteItem } = require('../controllers/itemController');
const { protect } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');
const router = express.Router();

router.route('/')
    .get(getItems)
    .post(protect, upload.single('image'), createItem);

router.route('/:id')
    .get(getItemById)
    .put(protect, updateItemStatus)
    .delete(protect, deleteItem);

module.exports = router;
