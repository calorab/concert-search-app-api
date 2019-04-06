exports.DATABASE_URL = process.env.DATABASE_URL || global.DATABASE_URL || 'mongodb+srv://admin:12345@cluster0-6akq9.mongodb.net/test?retryWrites=true';

// -------need to update this with the correct link if this isn't right-------
exports.TEST_DATABASE_URL = process.env.TEST_DATABASE_URL ||
    'mongodb+srv://admin:12345@cluster0-6akq9.mongodb.net/test?retryWrites=true';
exports.PORT = process.env.PORT || 8080;
