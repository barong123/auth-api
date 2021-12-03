const RefreshToken = require("../../Domains/token/entities/RefreshToken");

class AddAuthenticationUseCase {
  constructor({ tokenRepository, userRepository, tokenManager }) {
    this._tokenRepository = tokenRepository;
    this._userRepository = userRepository;
    this._tokenManager = tokenManager;
  }

  async execute({ username, password }) {
    const id = await this._userRepository.verifyUserCredential(
      username,
      password
    );

    const accessToken = await this._tokenManager.generateAccessToken({ id });
    const refreshToken = await this._tokenManager.generateRefreshToken({ id });

    await this._tokenRepository.addRefreshToken(new RefreshToken(refreshToken));

    return { accessToken, refreshToken };
  }
}

module.exports = AddAuthenticationUseCase;
