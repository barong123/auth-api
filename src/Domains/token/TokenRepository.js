class TokenRepository {
  async addRefreshToken(refreshToken) {
    throw new Error("TOKEN_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  }

  async verifyRefreshToken(token) {
    throw new Error("TOKEN_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  }

  async deleteRefreshToken(token) {
    throw new Error("TOKEN_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  }
}

module.exports = TokenRepository;
