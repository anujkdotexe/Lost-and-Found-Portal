const Item = require('../models/Item');

// In-Memory Cache System (Zero-latency Redis alternative for Windows)
const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

const clearItemCache = () => {
    cache.clear();
};

exports.getLatestItems = async (req, res) => {
    try {
        const cacheKey = 'latest_items';
        const cached = cache.get(cacheKey);
        
        if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
            return res.json(cached.data);
        }

        const items = await Item.find().populate('owner', 'name avatar').sort({ createdAt: -1 }).limit(3);
        
        cache.set(cacheKey, { data: items, timestamp: Date.now() });
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.createItem = async (req, res) => {
    try {
        const { title, description, category, location, date } = req.body;
        const imageUrl = req.file ? req.file.path : '';

        const item = await Item.create({
            title,
            description,
            category,
            location,
            date,
            image: imageUrl,
            owner: req.user._id
        });

        clearItemCache(); // Invalidate cache on new item
        res.status(201).json(item);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.getItems = async (req, res) => {
    try {
        const { category, search } = req.query;
        // Generate unique cache key based on query parameters
        const cacheKey = `items_${category || 'all'}_${search || 'none'}`;
        const cached = cache.get(cacheKey);

        if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
            return res.json(cached.data);
        }

        let query = {};
        if (category) query.category = category;
        if (search) query.title = { $regex: search, $options: 'i' };

        const items = await Item.find(query).populate('owner', 'name avatar').sort({ createdAt: -1 });
        
        cache.set(cacheKey, { data: items, timestamp: Date.now() });
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.getItemById = async (req, res) => {
    try {
        const cacheKey = `item_${req.params.id}`;
        const cached = cache.get(cacheKey);

        if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
            return res.json(cached.data);
        }

        const item = await Item.findById(req.params.id).populate('owner', 'name email avatar');
        if (!item) return res.status(404).json({ message: 'Item not found' });
        
        cache.set(cacheKey, { data: item, timestamp: Date.now() });
        res.json(item);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.updateItemStatus = async (req, res) => {
    try {
        const item = await Item.findById(req.params.id);
        if (!item) return res.status(404).json({ message: 'Item not found' });

        if (item.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to update this item' });
        }

        item.status = req.body.status || item.status;
        await item.save();
        
        clearItemCache(); // Invalidate cache on update
        res.json(item);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.deleteItem = async (req, res) => {
    try {
        const item = await Item.findById(req.params.id);
        if (!item) return res.status(404).json({ message: 'Item not found' });

        if (item.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to delete this item' });
        }

        await item.deleteOne();
        
        clearItemCache(); // Invalidate cache on delete
        res.json({ message: 'Item removed' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
