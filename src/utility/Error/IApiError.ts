import { ErrorCode } from './ErrorCode';
import { StructuredErrors } from './StructuredErrors';

export interface IApiError {
  code: ErrorCode,
  structured: StructuredErrors,
  message?: string,
  details?: any,
}
