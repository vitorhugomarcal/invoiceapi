export class InvalidCredentialsError extends Error {
  constructor() {
    super('E-mail e/ou senha incorreta.')
  }
}
