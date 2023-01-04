import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IModule } from '../interface/form';

@Injectable({
  providedIn: 'root',
})
export class FormService {
  constructor(private httpClient: HttpClient) {}

  public generateModuleComponent(moduleObj: IModule[]): Observable<IModule[]> {
    return this.httpClient.post<IModule[]>(
      'http://localhost:3000/project-setup',
      moduleObj
    );
  }
}
