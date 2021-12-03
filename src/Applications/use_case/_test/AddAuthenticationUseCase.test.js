const RefreshToken = require("../../../Domains/token/entities/RefreshToken");
const TokenRepository = require("../../../Domains/token/TokenRepository");
const UserRepository = require("../../../Domains/users/UserRepository");
const TokenManager = require("../../security/TokenManager");
const AddAuthenticationUseCase = require("../AddAuthenticationUseCase");

describe("AddAuthenticationUseCase", () => {
  it("should orchestrating the add user action correctly", async () => {
    // Arrange
    const useCasePayload = {
      username: "dicoding",
      password: "secret",
    };
    const expectedReturnedTokens = {
      accessToken: "dummyAccessToken",
      refreshToken: "dummyRefreshToken",
    };

    /** creating dependency of use case */
    // const refreshToken = new RefreshToken();
    const mockTokenRepository = new TokenRepository();
    const mockUserRepository = new UserRepository();
    const mockTokenManager = new TokenManager();

    /** mocking needed function */
    mockUserRepository.verifyUserCredential = jest
      .fn()
      .mockImplementation(() => Promise.resolve("id-123"));
    mockTokenManager.generateAccessToken = jest
      .fn()
      .mockImplementation(() => Promise.resolve("dummyAccessToken"));
    mockTokenManager.generateRefreshToken = jest
      .fn()
      .mockImplementation(() => Promise.resolve("dummyRefreshToken"));
    mockTokenRepository.addRefreshToken = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    /** creating use case instance */
    const getAuthenticationUseCase = new AddAuthenticationUseCase({
      tokenRepository: mockTokenRepository,
      userRepository: mockUserRepository,
      tokenManager: mockTokenManager,
    });

    // Action
    const returnedTokens = await getAuthenticationUseCase.execute(
      useCasePayload
    );

    // Assert
    expect(returnedTokens).toStrictEqual(expectedReturnedTokens);
    expect(mockUserRepository.verifyUserCredential).toBeCalledWith(
      useCasePayload.username,
      useCasePayload.password
    );
    expect(mockTokenManager.generateAccessToken).toBeCalled();
    expect(mockTokenManager.generateRefreshToken).toBeCalled();
    expect(mockTokenRepository.addRefreshToken).toBeCalledWith(
      new RefreshToken(expectedReturnedTokens.refreshToken)
    );
  });
});
