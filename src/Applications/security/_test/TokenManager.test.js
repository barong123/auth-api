const TokenManager = require("../TokenManager");

describe("TokenManager interface", () => {
  it("should throw error when invoke abstract behavior", async () => {
    // Arrange
    const tokenManager = new TokenManager();
    const id = "123456";
    const payload = { id };
    const refreshToken =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";

    // Action & Assert
    await expect(
      tokenManager.generateAccessToken(payload)
    ).rejects.toThrowError("TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED");
    await expect(
      tokenManager.generateRefreshToken(payload)
    ).rejects.toThrowError("TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED");
    await expect(
      tokenManager.verifyRefreshToken(refreshToken)
    ).rejects.toThrowError("TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED");
  });
});
