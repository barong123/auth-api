/* istanbul ignore file */

const { createContainer } = require("instances-container");

// external agency
const { nanoid } = require("nanoid");
const bcrypt = require("bcrypt");
const Jwt = require("@hapi/jwt");
const pool = require("./database/postgres/pool");

// service (repository, helper, manager, etc)
const UserRepositoryPostgres = require("./repository/UserRepositoryPostgres");
const TokenRepositoryPostgres = require("./repository/TokenRepositoryPostgres");
const BcryptPasswordHash = require("./security/BcryptPasswordHash");
const JwtTokenManager = require("./security/JwtTokenManager");

// use case
const AddUserUseCase = require("../Applications/use_case/AddUserUseCase");
const AddAuthenticationUseCase = require("../Applications/use_case/AddAuthenticationUseCase");
const UserRepository = require("../Domains/users/UserRepository");
const TokenRepository = require("../Domains/token/TokenRepository");
const PasswordHash = require("../Applications/security/PasswordHash");
const TokenManager = require("../Applications/security/TokenManager");

// creating container
const container = createContainer();

// registering services and repository
container.register([
  {
    key: UserRepository.name,
    Class: UserRepositoryPostgres,
    parameter: {
      dependencies: [
        {
          concrete: pool,
        },
        {
          concrete: nanoid,
        },
        {
          concrete: bcrypt,
        },
      ],
    },
  },
  {
    key: TokenRepository.name,
    Class: TokenRepositoryPostgres,
    parameter: {
      dependencies: [
        {
          concrete: pool,
        },
      ],
    },
  },
  {
    key: PasswordHash.name,
    Class: BcryptPasswordHash,
    parameter: {
      dependencies: [
        {
          concrete: bcrypt,
        },
      ],
    },
  },
  {
    key: TokenManager.name,
    Class: JwtTokenManager,
    parameter: {
      dependencies: [
        {
          concrete: Jwt,
        },
      ],
    },
  },
]);

// registering use cases
container.register([
  {
    key: AddUserUseCase.name,
    Class: AddUserUseCase,
    parameter: {
      injectType: "destructuring",
      dependencies: [
        {
          name: "userRepository",
          internal: UserRepository.name,
        },
        {
          name: "passwordHash",
          internal: PasswordHash.name,
        },
      ],
    },
  },
  {
    key: AddAuthenticationUseCase.name,
    Class: AddAuthenticationUseCase,
    parameter: {
      injectType: "destructuring",
      dependencies: [
        {
          name: "tokenRepository",
          internal: TokenRepository.name,
        },
        {
          name: "userRepository",
          internal: UserRepository.name,
        },
        {
          name: "tokenManager",
          internal: TokenManager.name,
        },
      ],
    },
  },
]);

module.exports = container;
