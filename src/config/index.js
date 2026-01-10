class Config {
  static get API_BASE_URL() {
    return process.env.REACT_APP_API_BASE_URL || 'http://127.0.0.1:8000';
  }

  static get API_TIMEOUT() {
    return parseInt(process.env.REACT_APP_API_TIMEOUT) || 10000;
  }

  static get ENVIRONMENT() {
    return process.env.REACT_APP_ENVIRONMENT || 'development';
  }

  static get IS_PRODUCTION() {
    return this.ENVIRONMENT === 'production';
  }

  static get IS_DEVELOPMENT() {
    return this.ENVIRONMENT === 'development';
  }

  static get ENABLE_MOCK_DATA() {
    return process.env.REACT_APP_ENABLE_MOCK_DATA === 'true';
  }

  static get PAGINATION_SIZE() {
    return 10;
  }

  static get MAX_FILE_SIZE() {
    return 50 * 1024 * 1024; // 50MB
  }

  static get ALLOWED_FILE_TYPES() {
    return ['.pdf', '.doc', '.docx', '.txt', '.md'];
  }
}

export default Config;