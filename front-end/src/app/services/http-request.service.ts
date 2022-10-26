import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { map } from 'rxjs/operators';
import { AppService } from './app.service'

@Injectable({
  providedIn: 'root'
})

export class HttpRequestService {
  constructor(
    private http: HttpClient,
    private appService: AppService
  ) { }

  get(url: string) {
    return this.http.get(`${this.appService.url}${url}`);
  }

  // updateStep(idCotizacion: string, step: number) {
  //   return this.http.put(`${this.appService.url}cotizador/updateStep/${idCotizacion}/${step}`, null);
  // }
  // deleteGruposUnidades(idCotizacion: string, idGrupoUnidad: number) { // Servicio para eliminar un grupo de unidades
  //   return this.http.delete(`${this.appService.url}cotizador/grupoUnidades/${idCotizacion}/${idGrupoUnidad}`)
  //     .pipe(map(res => res));
  // }

  post(url: string, body: any) {
    return this.http.post(`${this.appService.url}${url}`,
      body).pipe(map(res => res));
  }
}

