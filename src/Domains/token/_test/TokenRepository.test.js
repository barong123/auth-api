const TokenRepository = require("../TokenRepository");

describe("TokenRepository interface", () => {
  it("should throw error when invoke abstract behavior", async () => {
    // Arrange
    const tokenRepository = new TokenRepository();

    // Action and Assert
    await expect(tokenRepository.addRefreshToken({})).rejects.toThrowError(
      "TOKEN_REPOSITORY.METHOD_NOT_IMPLEMENTED"
    );
    await expect(tokenRepository.verifyRefreshToken("")).rejects.toThrowError(
      "TOKEN_REPOSITORY.METHOD_NOT_IMPLEMENTED"
    );
    await expect(tokenRepository.deleteRefreshToken("")).rejects.toThrowError(
      "TOKEN_REPOSITORY.METHOD_NOT_IMPLEMENTED"
    );
  });
});
