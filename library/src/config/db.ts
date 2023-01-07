const setupDatabase = {
	host: 'localhost',
  connectionUrl: process.env.MONGODB_URL || 'mongodb://root:example@mongo:27017/',
	user: process.env.MONGODB_LOGIN || 'root',
	password: process.env.MONGODB_PASSWORD || 'example',
	database: process.env.DB_NAME || 'library',
}

module.exports = setupDatabase;