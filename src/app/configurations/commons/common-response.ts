import {ErrorHandler} from '../../helpers/error-handler';

export interface CommonResponse {
  _id: string
  success: boolean;
  content: any;
  status: number;
  error: ErrorHandler;
}
