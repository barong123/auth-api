const RefreshToken = require("../RefreshToken");

describe("a RefreshToken entities", () => {
  it("should throw error when refresh token argument is empty", () => {
    // Arrange
    const token = "";

    // Action and Assert
    expect(() => new RefreshToken(token)).toThrowError(
      "REFFRESH_TOKEN.IS_EMPTY"
    );
  });

  it("should throw error when refresh token argument is not string", () => {
    // Arrange
    const token = 123;

    // Action and Assert
    expect(() => new RefreshToken(token)).toThrowError(
      "REFFRESH_TOKEN.IS_NOT_STRING"
    );
  });

  // it("should throw error when refresh token argument doesn't have correct format", () => {
  //   // Arrange
  //   const token = "dummyValue";

  //   // Action and Assert
  //   expect(() => new RefreshToken(token)).toThrowError(
  //     "REFFRESH_TOKEN.NOT_HAVE_CORRECT_FORMAT"
  //   );
  // });
});
