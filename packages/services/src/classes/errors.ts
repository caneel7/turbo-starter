/**
 * Base application error class
 */
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode: number, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }

    // Set the prototype explicitly
    Object.setPrototypeOf(this, this.constructor.prototype);
  }
}

/**
 * Unauthorized Error (401)
 */
export class UnauthorizedException extends AppError {
  constructor(message = 'Unauthorized') {
    super(message, 401);
  }
}

/**
 * Forbidden Error (403)
 */
export class ForbiddenException extends AppError {
  constructor(message = 'Forbidden') {
    super(message, 403);
  }
}

/**
 * Resource Not Found Error (404)
 */
export class ResourceNotFoundException extends AppError {
  constructor(message = 'Resource not found') {
    super(message, 404);
  }
}

/**
 * Conflict Error (409)
 */
export class ConflictException extends AppError {
  constructor(message = 'Conflict') {
    super(message, 409);
  }
}

/**
 * Internal Server Error (500)
 */
export class InternalServerErrorException extends AppError {
  constructor(message = 'Internal server error') {
    super(message, 500);
  }
}