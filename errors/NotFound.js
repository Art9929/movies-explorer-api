class NotFound extends Error {
  constructor(message) {
    super(message || 'Not Found');
    this.statusCode = 404;
  }
}

module.exports = NotFound;
