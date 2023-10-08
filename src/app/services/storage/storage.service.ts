import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(
    private storage: Storage

  ) {
    this.init();
  }

  // Executa ao iniciar
  async init() {
    const storage = await this.storage.create();
    this.storage = storage;
  }

  /**
   * Obtém informação do storage
   * @param key
   */
  public get (key: string) {
    return this.storage.get(key)
  }

  /**
   * Adiciona informação do storage
   * @param key
   * @param value
   */
  public set (key: string, value: any) {
    return this.storage.set(key, value);
  }

  /**
   * Remove informação do storage
   * @param key
   */
  public remove(key: string) {
    return this.storage.remove(key);
  }

}
