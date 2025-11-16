export class Constants {
  public static readonly JWTSECRET = 'secretKey';
  public static readonly SERVER_URL = process.env.SERVER_URL || 'http://localhost';
  public static readonly SERVER_PORT = process.env.SERVER_PORT || 3000;
}
