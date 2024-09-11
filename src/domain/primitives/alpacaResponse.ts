type AlpacaResponseParams = {
  code: string;
  statusCode: number;
  message: string;
}

export default class AlpacaResponse {
  public code: string;
  public statusCode: number;
  public message: string;

  constructor(response: AlpacaResponseParams) {
    this.code = response.code;
    this.statusCode = response.statusCode;
    this.message = response.message;
  }
}

