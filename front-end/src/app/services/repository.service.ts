import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { AppService } from './app.service';


@Injectable({
  providedIn: 'root'
})
export class RepositoryService {

  constructor(private http: HttpClient, private appService: AppService) { }
  getDocumentPaths() {
    return this.http.get(`${this.appService.url}repositorio/findDocument`).pipe(map(res => res));
  }

  getDocument(filePath: string) {
    return this.http.post(`${this.appService.url}repositorio/getDocument`,
      { path: filePath },
      { responseType: 'text' }).pipe(map(res => res));
  }

  setDocument(filePath: string, base64: string) {
    return this.http.post(`${this.appService.url}repositorio/setDocument`,
      { path: filePath, fileContent: base64 },
      { responseType: 'text' }).pipe(map(res => res));
  }

  deleteDocument(filePath: string) {
    return this.http.post(`${this.appService.url}repositorio/deleteDocument`,
      { path: filePath },
      { responseType: 'text' }).pipe(map(res => res));
  }

}
