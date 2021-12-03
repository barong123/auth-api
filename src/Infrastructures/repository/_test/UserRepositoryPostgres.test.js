const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const InvariantError = require("../../../Commons/exceptions/InvariantError");
const AuthenticationError = require("../../../Commons/exceptions/AuthenticationError");
const RegisterUser = require("../../../Domains/users/entities/RegisterUser");
const RegisteredUser = require("../../../Domains/users/entities/RegisteredUser");
const pool = require("../../database/postgres/pool");
const UserRepositoryPostgres = require("../UserRepositoryPostgres");
const PasswordHash = require("../../../Applications/security/PasswordHash");

describe("UserRepositoryPostgres", () => {
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe("verifyAvailableUsername function", () => {
    it("should throw InvariantError when username not available", async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ username: "dicoding" }); // memasukan user baru dengan username dicoding
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, {}, {});

      // Action & Assert
      await expect(
        userRepositoryPostgres.verifyAvailableUsername("dicoding")
      ).rejects.toThrowError(InvariantError);
    });

    it("should not throw InvariantError when username available", async () => {
      // Arrange
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(
        userRepositoryPostgres.verifyAvailableUsername("dicoding")
      ).resolves.not.toThrowError(InvariantError);
    });
  });

  describe("addUser function", () => {
    it("should persist register user", async () => {
      // Arrange
      const registerUser = new RegisterUser({
        username: "dicoding",
        password: "secret_password",
        fullname: "Dicoding Indonesia",
      });
      const fakeIdGenerator = () => "123"; // stub!
      const userRepositoryPostgres = new UserRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      // Action
      await userRepositoryPostgres.addUser(registerUser);

      // Assert
      const users = await UsersTableTestHelper.findUsersById("user-123");
      expect(users).toHaveLength(1);
    });

    it("should return registered user correctly", async () => {
      // Arrange
      const registerUser = new RegisterUser({
        username: "dicoding",
        password: "secret_password",
        fullname: "Dicoding Indonesia",
      });
      const fakeIdGenerator = () => "123"; // stub!
      const userRepositoryPostgres = new UserRepositoryPostgres(
        pool,
        fakeIdGenerator,
        {}
      );

      // Action
      const registeredUser = await userRepositoryPostgres.addUser(registerUser);

      // Assert
      expect(registeredUser).toStrictEqual(
        new RegisteredUser({
          id: "user-123",
          username: "dicoding",
          fullname: "Dicoding Indonesia",
        })
      );
    });
  });

  describe("verifyUserCredential function", () => {
    it("should throw AuthenticationError when username or password is not found", async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ username: "dicoding" });

      const mockPasswordHash = new PasswordHash();
      // resolve false karena username & passwword tidak cocok dengan data di database
      mockPasswordHash.compare = jest
        .fn()
        .mockImplementation(() => Promise.resolve(false));

      const userRepositoryPostgres = new UserRepositoryPostgres(
        pool,
        {},
        mockPasswordHash
      );

      // Action & Assert
      await expect(
        userRepositoryPostgres.verifyUserCredential(
          "dicoding",
          "secretpassword"
        )
      ).rejects.toThrowError(AuthenticationError); // wrong password
      await expect(
        userRepositoryPostgres.verifyUserCredential("fakeUser", "secret")
      ).rejects.toThrowError(AuthenticationError); // wrong username
    });

    it("should not throw AuthenticationError when both username and password are found, then return an id", async () => {
      // Arrange
      await UsersTableTestHelper.addUser({
        username: "dicoding",
        password: "secretpassword",
      }); // memasukan user baru dengan username dan password yang sesuai

      const mockPasswordHash = new PasswordHash();
      mockPasswordHash.compare = jest
        .fn()
        .mockImplementation(() => Promise.resolve(true));

      const userRepositoryPostgres = new UserRepositoryPostgres(
        pool,
        {},
        mockPasswordHash
      );
      const expectedId = "user-123";

      // Action
      const verify = userRepositoryPostgres.verifyUserCredential(
        "dicoding",
        "secretpassword"
      );

      // Action & Assert
      await expect(verify).resolves.not.toThrowError(AuthenticationError);
      await expect(await verify).toStrictEqual(expectedId);
    });
  });
});
