
export abstract class BaseService {
  protected url: string;
  protected token: string;

  /**
   *
   */
  constructor(url: string) {
    this.url = url;
    this.token = "";
  }

  setToken(token: string) {
    this.token = token;
  }
}
