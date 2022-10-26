import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { AppService } from './app.service';
import { AprobacionDirUnidad, AprobacionUtilidadFlotillas } from '../models';


@Injectable({
  providedIn: 'root'
})
export class ApproveCatalogService {
  constructor(private http: HttpClient, private appService: AppService) { }

  getDirectionsUnits() {
    return this.http.get(`${this.appService.url}/aprobacion/getAllAprobacionUnidadDireccion`).pipe(map(res => res));
  }

  createApproveDirUnits(aprobacionDirUnidad: AprobacionDirUnidad[]) {
    return this.http.post(`${this.appService.url}/aprobacion/insertAprobacionUnidadDireccion`, aprobacionDirUnidad).pipe(map(res => res));
  }

  deleteApproveDirUnits(idDireccionFlotillas: string, idUsuario: string) {
    return this.http.delete(`${this.appService.url}/aprobacion/removeAprobacionUnidadDireccion/${idDireccionFlotillas}/${idUsuario}`)
      .pipe(map(res => res));
  }

  getDirectionsCredicts() {
    return this.http.get(`${this.appService.url}/aprobacion/getAllAprobacionCredito`).pipe(map(res => res));
  }

  createApproveDirCredicts(aprobacionDirUnidad: AprobacionDirUnidad[]) {
    return this.http.post(`${this.appService.url}/aprobacion/insertAprobacionCredito`, aprobacionDirUnidad).pipe(map(res => res));
  }

  deleteApproveCreditcs(idDireccionFlotillas: string, idUsuario: string) {
    return this.http.delete(`${this.appService.url}/aprobacion/removeAprobacionCredito/${idDireccionFlotillas}/${idUsuario}`)
      .pipe(map(res => res));
  }

  getDirectionsProfits() {
    return this.http.get(`${this.appService.url}/aprobacion/getAllAprobacionUtilidad`).pipe(map(res => res));
  }

  createApproveDirProfit(aprobacionUtilidadFlotillas: AprobacionUtilidadFlotillas[]) {
    return this.http.post(`${this.appService.url}/aprobacion/insertAprobacionUtilidadDireccion`, aprobacionUtilidadFlotillas).pipe(map(res => res));
  }

  deleteApproveDirProfit(idDireccionFlotillas: string, idUsuario: string) {
    return this.http.delete(`${this.appService.url}/aprobacion/removeAprobacionUtilidadDireccion/${idDireccionFlotillas}/${idUsuario}`)
      .pipe(map(res => res));
  }

  updateApprove(data) {
    return this.http.post(`${this.appService.url}/aprobacion/updateAprobacionUtilidadDireccion`, data).pipe(map(res => res));
  }



}
