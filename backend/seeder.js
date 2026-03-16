const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Item = require('./models/Item');
const Message = require('./models/Message');

dotenv.config();

const users = [
    {
        name: 'Sophie Pink',
        email: 'sophie@example.com',
        password: 'password123',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sophie'
    },
    {
        name: 'Bluey Marshmallow',
        email: 'bluey@example.com',
        password: 'password123',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bluey'
    }
];

const items = [
    {
        title: 'Fluffy Strawberry Keychain',
        description: 'A very cute, soft strawberry keychain. It has a small green leaf on top.',
        category: 'Lost',
        location: 'Sakura Cafe, Corner Table',
        date: new Date('2026-03-10'),
        image: 'https://images.unsplash.com/photo-1629131726692-1accd118353f?auto=format&fit=crop&q=80&w=1000',
        status: 'Unclaimed'
    },
    {
        title: 'Pastel Blue Umbrella',
        description: 'Found this cute umbrella near the library entrance. It has a wooden handle.',
        category: 'Found',
        location: 'City Library Entrance',
        date: new Date('2026-03-15'),
        image: 'https://images.unsplash.com/photo-1541888941294-18d04e1c44bb?auto=format&fit=crop&q=80&w=1000',
        status: 'Unclaimed'
    },
    {
        title: 'Ghibli Style Totoro Wallet',
        description: 'Ggrey wallet with Totoro embroidery. Contains some coins and a library card.',
        category: 'Lost',
        location: 'Central Park East Gate',
        date: new Date('2026-03-12'),
        image: 'https://images.unsplash.com/photo-1626497746270-0bcc7-4632c050?auto=format&fit=crop&q=80&w=1000',
        status: 'Unclaimed'
    }
];

const seedData = async () => {
    try {
        const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/lostfound';
        await mongoose.connect(uri);
        console.log('Connected to MongoDB for seeding...');

        // Clear existing data
        await User.deleteMany();
        await Item.deleteMany();
        await Message.deleteMany();

        // Create Users
        const createdUsers = await User.create(users);
        const sophie = createdUsers[0];
        const bluey = createdUsers[1];

        // Create Items
        const itemsWithOwners = items.map((item, index) => ({
            ...item,
            owner: index % 2 === 0 ? sophie._id : bluey._id
        }));
        const createdItems = await Item.insertMany(itemsWithOwners);

        // Create Mock Chats
        const messages = [
            {
                sender: bluey._id,
                receiver: sophie._id,
                item: createdItems[0]._id, // Strawberry Keychain
                content: 'Hi Sophie! I think I saw your strawberry keychain at the cafe yesterday. Is it still lost?'
            },
            {
                sender: sophie._id,
                receiver: bluey._id,
                item: createdItems[0]._id,
                content: 'Oh my gosh, really? Yes, it is! Where exactly did you see it?'
            },
            {
                sender: bluey._id,
                receiver: sophie._id,
                item: createdItems[0]._id,
                content: 'It was near the counter, on that small white shelf. Maybe the barista kept it!'
            }
        ];
        await Message.insertMany(messages);

        console.log('Mock data seeded successfully! ✨');
        process.exit();
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
};

seedData();
