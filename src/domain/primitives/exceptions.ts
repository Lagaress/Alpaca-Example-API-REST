import statusCodes from 'http-status-codes';
import AlpacaResponse from './alpacaResponse';

export const UserNotFound = new AlpacaResponse({ code: 'US40401', statusCode: statusCodes.BAD_REQUEST, message: 'The user does not exist' });

export const UserAlreadyExists = new AlpacaResponse({ code: 'US40901', statusCode: statusCodes.CONFLICT, message: 'User already exists' });

export const InternalError = new AlpacaResponse({ code: 'ER50001', statusCode: statusCodes.INTERNAL_SERVER_ERROR, message: 'Internal server error' });
