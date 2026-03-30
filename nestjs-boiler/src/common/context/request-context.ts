import { AsyncLocalStorage } from 'async_hooks';
import { RequestUser } from '../../modules/auth/interfaces/index.js';

export interface RequestContextData {
  requestId: string;
  user?: RequestUser;
  ip?: string;
  method?: string;
  url?: string;
}

export class RequestContext {
  private static storage = new AsyncLocalStorage<RequestContextData>();

  static run(data: RequestContextData, fn: () => void) {
    this.storage.run(data, fn);
  }

  static get(): RequestContextData | undefined {
    return this.storage.getStore();
  }

  static getRequestId(): string | undefined {
    return this.storage.getStore()?.requestId;
  }

  static getUser(): RequestUser | undefined {
    return this.storage.getStore()?.user;
  }
}
