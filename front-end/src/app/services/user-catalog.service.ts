import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { AppService } from '../services/app.service';


@Injectable({
  providedIn: 'root'
})
export class UserCatalogService {
    constructor(private http: HttpClient, private appService: AppService) { }

    getAll() {
        return this.http.get(`${this.appService.url}seguridad/usuario/getAll`)
            .pipe(map(usuarios => usuarios));
    }
}

