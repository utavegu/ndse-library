const servicesSetup = {
	redisName: process.env.REDIS_SERVICE_NAME || 'storage',
  counterName: process.env.COUNTER_SERVICE_NAME || 'counter',
  counterPort: process.env.COUNTER_INTERNAL_PORT || 3001,
  mongoName: process.env.MONGO_SERVICE_NAME || 'mongo',
  mongoPort: process.env.MONGO_INTERNAL_PORT || 27017,
  libraryPort: process.env.LIBRARY_INTERNAL_PORT || 3002,
}

module.exports = servicesSetup;