import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { TrasladosCatalogService } from 'src/app/services/traslados.service';
import { UbicacionTraslado } from 'src/app/models';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-traslados',
  templateUrl: './traslados.component.html',
  styleUrls: ['./traslados.component.scss']
})
export class TrasladosComponent implements OnInit {
  forma: FormGroup;
  idUbicacionTraslado: number;
  nombreLugar: string;
  descripcionLugar: string;
  direccionLugar: string;
  ubicacionTraslado: UbicacionTraslado[];
  nombreEliminar: string;
  idEliminar: number;
  searchNombre = '';
  constructor(private toastrService: ToastrService, private trasladoService: TrasladosCatalogService, private modalService: NgbModal) {
    this.forma = new FormGroup({
      nombre: new FormControl(null, [Validators.required]),
      descripcion: new FormControl(null, [Validators.required]),
      direccion: new FormControl(null, [Validators.required])
    });
  }

  ngOnInit() {
    this.trasladoService.getUbicacionTraslados().subscribe((ubicacionTraslados: UbicacionTraslado[]) => {
      this.ubicacionTraslado = ubicacionTraslados;
    });
  }

  updateFilter(event) {
    if (!this.ubicacionTraslado) { return []; }
    if (!this.searchNombre) {
      this.ubicacionTraslado;
    }
    const temp = this.ubicacionTraslado.filter(car => {
      return car.nombre.toLowerCase().includes(this.searchNombre.toLowerCase());
    });
    this.ubicacionTraslado = temp;
    if (event.key === 'Backspace') {
      this.trasladoService.getUbicacionTraslados().subscribe((ubicacionTraslados: UbicacionTraslado[]) => {
        this.ubicacionTraslado = JSON.parse(JSON.stringify(ubicacionTraslados));
      });
    }
  }

  clearUbicacionTraslados() {
    this.idUbicacionTraslado =  null;
    this.forma.reset();
  }

  saveUbicacionTraslados() {
    const ubTraslado: UbicacionTraslado[] = [];
    const item = {
      idUbicacionTraslado: this.idUbicacionTraslado,
      nombre: this.nombreLugar,
      descripcion: this.descripcionLugar,
      direccion: this.direccionLugar,
    };

    ubTraslado.push(item);

    if (ubTraslado !== undefined) {
      this.trasladoService.saveUbicacionTraslados(ubTraslado).subscribe((res) => {
        this.trasladoService.getUbicacionTraslados().subscribe((ubicacionTraslados: UbicacionTraslado[]) => {
          this.ubicacionTraslado = ubicacionTraslados;
        });
        this.toastrService.success(`Se guardo un nuevo lugar de salida/recepción de vehiculos con el nombre de ${this.nombreLugar}
        y ubicado en ${this.direccionLugar}`, ` SE ALMACENO ${this.nombreLugar}`);
        this.forma.reset();
        this.idUbicacionTraslado =  null;

      }, (err) => {
        this.toastrService.error(`Se produjo un error al intentar guardar ${this.nombreLugar}`,
        ` Error ${this.nombreLugar}`);
      });
    }
  }

  editUbicacionTraslados(event, ubicacionTraslado: UbicacionTraslado) {
    event.preventDefault();
    if (ubicacionTraslado) {
      this.idUbicacionTraslado = ubicacionTraslado.idUbicacionTraslado;
      this.nombreLugar = ubicacionTraslado.nombre;
      this.descripcionLugar = ubicacionTraslado.descripcion;
      this.direccionLugar = ubicacionTraslado.direccion;
    }
    this.toastrService.success(`Ha seleccionado lugar de salida/recepción de vehiculos con el nombre de ${ubicacionTraslado.nombre}
   y ubicado en ${ubicacionTraslado.descripcion} para editarlo`,
   ` Seleccionado ${ubicacionTraslado.nombre}`);
  }

  openModalDelete(event, deleteTemplate: any, ubicacionTraslado: UbicacionTraslado) {
    event.preventDefault();
    this.nombreEliminar = ubicacionTraslado.nombre;
    this.idEliminar = ubicacionTraslado.idUbicacionTraslado;
    this.modalService.open(deleteTemplate, { ariaLabelledBy: 'modal-basic-title', centered: true });
  }

  deleteUbicacionTraslados() {
    this.trasladoService.deleteUbicacionTraslados(this.idEliminar).subscribe((res) => {
      this.toastrService.success(`Se eleminiro el registro ${this.nombreEliminar} de manera satisfactoria`,
      `ELIMINADA UBICACION ${this.nombreEliminar}`);
      this.modalService.dismissAll('Archivo Eliminado');
      this.trasladoService.getUbicacionTraslados().subscribe((ubicacionTraslados: UbicacionTraslado[]) => {
        this.ubicacionTraslado = ubicacionTraslados;
      });
    }, (err) => {
      this.toastrService.error(`Se produjo un error al intenar eliminar ${this.nombreEliminar} si el problema persiste
      contante al personal técnico`,
      `ERRROR ${this.nombreEliminar}`);
    });
  }

}
