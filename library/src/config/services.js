const servicesSetup = {
	redisName: process.env.REDIS_SERVICE_NAME || 'storage',
  counterName: process.env.COUNTER_SERVICE_NAME || 'counter',
  counterPort: process.env.COUNTER_SERVICE_PORT || 3001,
  mongoName: process.env.MONGO_SERVICE_NAME || 'mongo',
  mongoPort: process.env.MONGO_SERVICE_PORT || 27017
}

module.exports = servicesSetup;