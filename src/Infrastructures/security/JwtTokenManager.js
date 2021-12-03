const InvariantError = require("../../Commons/exceptions/InvariantError");
const TokenManager = require("../../Applications/security/TokenManager");

class JwtTokenManager extends TokenManager {
  constructor(Jwt) {
    super();
    this._Jwt = Jwt;
  }

  generateAccessToken(payload) {
    return this._Jwt.token.generate(payload, process.env.ACCESS_TOKEN_KEY);
  }

  generateRefreshToken(payload) {
    return this._Jwt.token.generate(payload, process.env.REFRESH_TOKEN_KEY);
  }

  async verifyRefreshToken(refreshToken) {
    try {
      const artifacts = this._Jwt.token.decode(refreshToken);
      this._Jwt.token.verifySignature(artifacts, process.env.REFRESH_TOKEN_KEY);
      const { payload } = artifacts.decoded;
      return payload;
    } catch (error) {
      throw new InvariantError("Refresh token tidak valid");
    }
  }
}

module.exports = JwtTokenManager;
