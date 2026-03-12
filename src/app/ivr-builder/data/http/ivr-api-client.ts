import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class IvrApiClient {
  private readonly http = inject(HttpClient);

  get<TResponse>(url: string): Promise<TResponse> {
    return firstValueFrom(this.http.get<TResponse>(url));
  }
}
