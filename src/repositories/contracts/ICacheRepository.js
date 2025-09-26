class ICacheRepository {
  async get(key) {
    throw new Error("Method not implemented");
  }

  async set(key, value, ttl) {
    throw new Error("Method not implemented");
  }

  async del(key) {
    throw new Error("Method not implemented");
  }
}

export default ICacheRepository;