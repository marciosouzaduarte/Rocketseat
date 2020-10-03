export default interface ITokenProvider {
  sign(subject: string): Promise<string>;
  verify(token: string): Promise<string | object>;
}
