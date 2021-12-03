const AuthenticationsTableTestHelper = require("../../../../tests/AuthenticationsTableTestHelper");
const pool = require("../../database/postgres/pool");
const TokenRepositoryPostgres = require("../TokenRepositoryPostgres");
const InvariantError = require("../../../Commons/exceptions/InvariantError");
const RefreshToken = require("../../../Domains/token/entities/RefreshToken");

describe("TokenRepositoryPostgres", () => {
  afterEach(async () => {
    await AuthenticationsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe("addRefreshToken function", () => {
    it("should throw InvariantError when token is not valid", async () => {
      // Arrange
      const tokenRepositoryPostgres = new TokenRepositoryPostgres(pool);

      // Action & Assert
      await expect(
        tokenRepositoryPostgres.addRefreshToken("")
      ).rejects.toThrowError(InvariantError);
    });

    it("should not throw InvariantError when token is valid", async () => {
      // Arrange
      const refreshToken = new RefreshToken("xxxxx.yyyyy.zzzzz");
      const tokenRepositoryPostgres = new TokenRepositoryPostgres(pool);

      // Action & Assert
      await expect(
        tokenRepositoryPostgres.addRefreshToken(refreshToken)
      ).resolves.not.toThrowError(InvariantError);
      await expect(
        tokenRepositoryPostgres.verifyRefreshToken("xxxxx.yyyyy.zzzzz")
      ).resolves.not.toThrowError(InvariantError);
    });
  });

  describe("verifyRefreshToken function", () => {
    it("should throw InvariantError when token is not available", async () => {
      // Arrange
      const tokenRepositoryPostgres = new TokenRepositoryPostgres(pool);

      // Action & Assert
      await expect(
        tokenRepositoryPostgres.verifyRefreshToken("")
      ).rejects.toThrowError(InvariantError);
    });

    it("should not throw InvariantError when token is available", async () => {
      // Arrange
      await AuthenticationsTableTestHelper.addToken("xxxxx.yyyyy.zzzzz");
      const tokenRepositoryPostgres = new TokenRepositoryPostgres(pool);

      // Action & Assert
      await expect(
        tokenRepositoryPostgres.verifyRefreshToken("xxxxx.yyyyy.zzzzz")
      ).resolves.not.toThrowError(InvariantError);
    });
  });

  describe("deleteRefreshToken function", () => {
    it("should throw InvariantError when token is not available", async () => {
      // Arrange
      const tokenRepositoryPostgres = new TokenRepositoryPostgres(pool);

      // Action & Assert
      await expect(
        tokenRepositoryPostgres.deleteRefreshToken("")
      ).rejects.toThrowError(InvariantError);
    });

    it("should not throw InvariantError when token is available and token is deleted from database", async () => {
      // Arrange
      await AuthenticationsTableTestHelper.addToken("xxxxx.yyyyy.zzzzz");
      const tokenRepositoryPostgres = new TokenRepositoryPostgres(pool);

      // Action & Assert
      await expect(
        tokenRepositoryPostgres.deleteRefreshToken("xxxxx.yyyyy.zzzzz")
      ).resolves.not.toThrowError(InvariantError); // delete token
      await expect(
        tokenRepositoryPostgres.deleteRefreshToken("xxxxx.yyyyy.zzzzz")
      ).rejects.toThrowError(InvariantError); // should return error when token has been deleted
    });
  });
});
