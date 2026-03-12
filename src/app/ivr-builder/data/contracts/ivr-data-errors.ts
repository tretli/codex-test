export type IvrDataError = {
  code: string;
  message: string;
  retriable: boolean;
};

export function toIvrDataError(error: unknown, fallbackMessage: string): IvrDataError {
  if (error instanceof Error) {
    return {
      code: 'exception',
      message: error.message || fallbackMessage,
      retriable: true
    };
  }
  return {
    code: 'unknown',
    message: fallbackMessage,
    retriable: true
  };
}
