const AddAuthenticationUseCase = require("../../../../Applications/use_case/AddAuthenticationUseCase");

class AuthenticationsHandler {
  constructor(container) {
    this._container = container;

    this.postAuthenticationHandler = this.postAuthenticationHandler.bind(this);
  }

  async postAuthenticationHandler(request, h) {
    const addAuthenticationUseCase = this._container.getInstance(
      AddAuthenticationUseCase.name
    );
    const tokens = await addAuthenticationUseCase.execute(request.payload);

    const response = h.response({
      status: "success",
      data: {
        tokens,
      },
    });
    response.code(201);
    return response;
  }
}

module.exports = AuthenticationsHandler;
