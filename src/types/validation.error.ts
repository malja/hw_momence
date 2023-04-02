export class ValidationError extends Error {
  constructor(message: string, public readonly errors: string[]) {
    super(message)
  }

  toString() {
    return `${this.message} Validation Errors: ${this.errors.join(' ')}`
  }
}
