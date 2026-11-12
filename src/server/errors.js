export class HttpError extends Error {
  constructor(status, code, message, fields) {
    super(message);
    this.status = status;
    this.code = code;
    this.fields = fields;
  }
}
export class ValidationError extends HttpError {
  constructor(message, fields) {
    super(400, "VALIDATION_ERROR", message, fields);
  }
}
export class AuthenticationError extends HttpError {
  constructor(message = "Требуется авторизация.") {
    super(401, "AUTHENTICATION_REQUIRED", message);
  }
}
export class ForbiddenError extends HttpError {
  constructor(message = "Запрос отклонён политикой безопасности.") {
    super(403, "FORBIDDEN", message);
  }
}
export class NotFoundError extends HttpError {
  constructor(message = "Ресурс не найден.") {
    super(404, "NOT_FOUND", message);
  }
}
export class ConflictError extends HttpError {
  constructor(message) {
    super(409, "CONFLICT", message);
  }
}
export class RateLimitError extends HttpError {
  constructor() {
    super(
      429,
      "RATE_LIMITED",
      "Слишком много попыток. Повторите через 15 минут.",
    );
  }
}
