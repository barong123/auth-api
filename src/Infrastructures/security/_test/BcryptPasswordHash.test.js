const bcrypt = require("bcrypt");
const BcryptPasswordHash = require("../BcryptPasswordHash");

describe("BcryptPasswordHash", () => {
  describe("hash function", () => {
    it("should encrypt password correctly", async () => {
      // Arrange
      const spyHash = jest.spyOn(bcrypt, "hash");
      const bcryptPasswordHash = new BcryptPasswordHash(bcrypt);

      // Action
      const encryptedPassword = await bcryptPasswordHash.hash("plain_password");

      // Assert
      expect(typeof encryptedPassword).toEqual("string");
      expect(encryptedPassword).not.toEqual("plain_password");
      expect(spyHash).toBeCalledWith("plain_password", 10); // 10 adalah nilai saltRound default untuk BcryptPasswordHash
    });
  });

  describe("compare function", () => {
    it("should return false when password and encryptedPassword doesn't match", async () => {
      // Arrange
      const spyCompare = jest.spyOn(bcrypt, "compare");
      const bcryptPasswordHash = new BcryptPasswordHash(bcrypt);

      // Action
      const match = await bcryptPasswordHash.compare(
        "plain_password",
        "fake_encrypted_password"
      );

      // Assert
      expect(spyCompare).toBeCalledWith(
        "plain_password",
        "fake_encrypted_password"
      );
      expect(match).toStrictEqual(false);
    });

    it("should return true when password and encryptedPassword match", async () => {
      // Arrange
      const spyCompare = jest.spyOn(bcrypt, "compare");
      const bcryptPasswordHash = new BcryptPasswordHash(bcrypt);

      // Action
      const encryptedPassword = await bcryptPasswordHash.hash("plain_password");
      const match = await bcryptPasswordHash.compare(
        "plain_password",
        encryptedPassword
      );

      // Assert
      expect(spyCompare).toBeCalledWith("plain_password", encryptedPassword);
      expect(match).toStrictEqual(true);
    });
  });
});
