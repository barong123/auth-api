const TokenRepository = require("../../Domains/token/TokenRepository");
const RefreshToken = require("../../Domains/token/entities/RefreshToken");
const InvariantError = require("../../Commons/exceptions/InvariantError");

class TokenRepositoryPostgres extends TokenRepository {
  constructor(pool) {
    super();
    this._pool = pool;
  }

  async addRefreshToken(refreshToken) {
    if (refreshToken instanceof RefreshToken === false) {
      throw new InvariantError("token tidak valid");
    }

    const { token } = refreshToken;

    const query = {
      text: "INSERT INTO authentications VALUES($1)",
      values: [token],
    };

    await this._pool.query(query);
  }

  async verifyRefreshToken(token) {
    const query = {
      text: "SELECT token FROM authentications WHERE token = $1",
      values: [token],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError("Refresh token tidak valid");
    }
  }

  async deleteRefreshToken(token) {
    await this.verifyRefreshToken(token);

    const query = {
      text: "DELETE FROM authentications WHERE token = $1",
      values: [token],
    };

    await this._pool.query(query);
  }
}

module.exports = TokenRepositoryPostgres;
