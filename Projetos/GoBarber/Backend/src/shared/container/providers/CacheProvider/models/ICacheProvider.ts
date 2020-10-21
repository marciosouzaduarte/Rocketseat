export default interface ICacheProvider {
  save(key: string, value: any): Promise<void>;
  remove(key: string): Promise<void>;
  recover<T>(key: string): Promise<T | null>;
  invalidate(prefix: string): Promise<void>;
}
