const Jwt = require("@hapi/jwt");
const JwtTokenManager = require("../JwtTokenManager");
const InvariantError = require("../../../Commons/exceptions/InvariantError");

describe("JwtTokenManager", () => {
  describe("generateAccessToken", () => {
    it("should generate token correctly", async () => {
      // Arrange
      const spyGenerateAccessToken = jest.spyOn(Jwt.token, "generate");
      const jwtTokenManager = new JwtTokenManager(Jwt);
      const id = "user-123";

      // Action
      const token = await jwtTokenManager.generateAccessToken({ id });

      expect(typeof token).toEqual("string");
      expect(spyGenerateAccessToken).toBeCalledWith(
        { id },
        process.env.ACCESS_TOKEN_KEY
      );
    });
  });

  describe("generateRefreshToken", () => {
    it("should generate token correctly", async () => {
      // Arrange
      const spyGenerateRefreshToken = jest.spyOn(Jwt.token, "generate");
      const jwtTokenManager = new JwtTokenManager(Jwt);
      const id = "user-123";

      // Action
      const token = await jwtTokenManager.generateRefreshToken({ id });

      expect(typeof token).toEqual("string");
      expect(spyGenerateRefreshToken).toBeCalledWith(
        { id },
        process.env.REFRESH_TOKEN_KEY
      );
    });
  });

  describe("verifyRefreshToken", () => {
    it("should verify token correctly", async () => {
      // Arrange
      // const spyVerifyRefreshToken = jest.spyOn(Jwt.token, "decode");
      const jwtTokenManager = new JwtTokenManager(Jwt);

      const id = "user-123";
      const refreshToken = await jwtTokenManager.generateRefreshToken({ id });

      // Action
      const payload = await jwtTokenManager.verifyRefreshToken(refreshToken);

      // Assert
      await expect(
        jwtTokenManager.verifyRefreshToken(123)
      ).rejects.toThrowError(InvariantError);
      expect(typeof payload).toEqual("object");
      // expect(spyVerifyRefreshToken).toBeCalledWith(refreshToken);
    });
  });
});
