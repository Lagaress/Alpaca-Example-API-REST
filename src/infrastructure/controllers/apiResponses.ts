import statusCodes from 'http-status-codes';
import AlpacaResponse from '../../domain/primitives/alpacaResponse';

export const ServiceOk = new AlpacaResponse({ code: 'SV20000', statusCode: statusCodes.OK, message: 'Service is OK' });
export const UserRetrievedOk = new AlpacaResponse({ code: 'US20001', statusCode: statusCodes.OK, message: 'User retrieved correctly' });
export const UsersRetrievedOk = new AlpacaResponse({ code: 'US20002', statusCode: statusCodes.OK, message: 'Users retrieved correctly' });

export const UserCreatedOk = new AlpacaResponse({ code: 'US20100', statusCode: statusCodes.CREATED, message: 'User created successfully' });

export const UserUpdatedOk = new AlpacaResponse({ code: 'US20200', statusCode: statusCodes.ACCEPTED, message: 'User updated successfully' });

export const UserDeletedOk = new AlpacaResponse({ code: 'US20400', statusCode: statusCodes.NO_CONTENT, message: 'User deleted successfully' });
