class RefreshToken {
  constructor(token) {
    this._verifyToken(token);

    this.token = token;
  }

  _verifyToken(token) {
    if (!token) {
      throw new Error("REFFRESH_TOKEN.IS_EMPTY");
    }

    if (typeof token !== "string") {
      throw new Error("REFFRESH_TOKEN.IS_NOT_STRING");
    }

    // if (!token.match(/(\w)*\\(?!\\)(\w)*\\(?!\\)(\w)*(?!\\)/g)) {
    //   throw new Error("REFFRESH_TOKEN.NOT_HAVE_CORRECT_FORMAT");
    // }
  }
}

module.exports = RefreshToken;
