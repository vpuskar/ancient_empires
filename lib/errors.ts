// lib/errors.ts — centralised error handling

export class AppError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly statusCode: number = 500
  ) {
    super(message);
    this.name = 'AppError';
  }

  static notFound(resource: string) {
    return new AppError(`${resource} not found`, 'NOT_FOUND', 404);
  }

  static forbidden() {
    return new AppError('Forbidden', 'FORBIDDEN', 403);
  }

  static badRequest(message: string) {
    return new AppError(message, 'BAD_REQUEST', 400);
  }

  static internal(message = 'Internal server error') {
    return new AppError(message, 'INTERNAL', 500);
  }
}

/** Converts AppError (or unknown) to a { error, status } shape for API routes. */
export function toApiError(err: unknown): { error: string; status: number } {
  if (err instanceof AppError) {
    return { error: err.message, status: err.statusCode };
  }
  console.error('[unhandled]', err);
  return { error: 'Internal server error', status: 500 };
}
