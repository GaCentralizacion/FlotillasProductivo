import { Component, OnInit } from '@angular/core';
import { BrandService } from '../services/brand.service';
import { Marca, RepositoryFile } from '../models';
import { forkJoin } from 'rxjs';
import { RepositoryService } from '../services/repository.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-file-repository',
  templateUrl: './file-repository.component.html',
  styleUrls: ['./file-repository.component.scss']
})
export class FileRepositoryComponent implements OnInit {

  marcas: Marca[];
  marcaSelected: Marca;
  marcaSelectedUpload: string;
  filePaths: string[];
  repositoryFiles: RepositoryFile[];
  selectedMonth: string;
  selectedFiles: string[];
  textoArchivosEncotrados: number;
  closeResult: string;
  anios = [(new Date()).getFullYear(), ((new Date()).getFullYear() - 1)];
  anioSelectedUpload = (new Date()).getFullYear();
  meses = ['enero',
    'febrero',
    'marzo',
    'abril',
    'mayo',
    'junio',
    'julio',
    'agosto',
    'septiembre',
    'octubre',
    'noviembre',
    'diciembre'
  ];
  mesSelectedUpload: string;
  base64Upload: string;
  fileNameUpload: string;
  fileNameDelete: string;
  mensajeError: string;
  mensajeErrorEliminar: string;

  constructor(private repositoryService: RepositoryService,
    private brandService: BrandService,
    private modalService: NgbModal) { }

  ngOnInit() {
    forkJoin(this.brandService.getBrands(),
      this.repositoryService.getDocumentPaths()
    ).subscribe((results: any[]) => {
      [this.marcas,] = results;
      this.filePaths = [];
      results[1].map(filePath => {
        this.filePaths.push(filePath.replace(/\\/g, '/'));
      });
      if (this.marcas.length > 0) {
        this.marcaSelected = this.marcas[0];
        this.selectMarca(this.marcaSelected);
      }
    });
  }

  private range = (start, stop, step = -1) =>
    Array(Math.ceil((stop - start) / step)).fill(start).map((x, y) => x + y * step);

  selectMarca(marca: Marca = this.marcaSelected, search: string = '') {
    this.selectedFiles = [];
    this.marcaSelected = marca;
    this.marcaSelectedUpload = marca.idMarca;
    const selectedFilePathsMarca = this.filePaths.filter(item => item.startsWith(marca.idMarca)
      && item.toLowerCase().indexOf(search.toLowerCase()) >= 0);
    this.textoArchivosEncotrados = selectedFilePathsMarca.length;
    this.repositoryFiles = [];
    selectedFilePathsMarca.map(filePath => {
      const yearValue = filePath.split('/')[1];
      if (Number(yearValue) < (new Date().getFullYear() - 1) && !this.anios.some(a => a == Number(yearValue))) {
        this.anios = this.range(new Date().getFullYear(), Number(yearValue) - 1);
      }
      const monthNameValue = filePath.split('/')[2];
      let monthValue = 1;
      switch (monthNameValue) {
        case 'enero':
          monthValue = 1;
          break;
        case 'febrero':
          monthValue = 2;
          break;
        case 'marzo':
          monthValue = 3;
          break;
        case 'abril':
          monthValue = 4;
          break;
        case 'mayo':
          monthValue = 5;
          break;
        case 'junio':
          monthValue = 6;
          break;
        case 'julio':
          monthValue = 7;
          break;
        case 'agosto':
          monthValue = 8;
          break;
        case 'septiembre':
          monthValue = 9;
          break;
        case 'octubre':
          monthValue = 10;
          break;
        case 'noviembre':
          monthValue = 11;
          break;
        default:
          monthValue = 12;
          break;
      }
      const filePathValue = filePath.split('/')[3];
      const fileExtension = filePathValue.toLocaleLowerCase().split('.')[1];
      const iconClassValue = fileExtension === 'xlsx' ? 'far fa-file-excel' :
        fileExtension === 'docx' ? 'far fa-file-word' :
          fileExtension === 'pdf' ? 'far fa-file-pdf' : 'far fa-file';
      if (!this.repositoryFiles.some((itemYear) => itemYear.year === yearValue)) {
        const yearItem = {
          year: yearValue, months: [{
            month: monthValue, monthName: monthNameValue,
            fileNames: [{ filename: filePathValue, iconClass: iconClassValue }]
          }]
        };
        this.repositoryFiles.push(yearItem);
      } else {
        this.repositoryFiles.map(repositoryFile => {
          if (repositoryFile.year === yearValue) {
            if (!repositoryFile.months.some((itemMonth => itemMonth.monthName === monthNameValue))) {
              repositoryFile.months.push({
                month: monthValue, monthName: monthNameValue,
                fileNames: [{ filename: filePathValue, iconClass: iconClassValue }]
              })
            } else {
              repositoryFile.months.map(monthRepositoryFile => {
                if (monthNameValue === monthRepositoryFile.monthName) {
                  monthRepositoryFile.fileNames.push({ filename: filePathValue, iconClass: iconClassValue });
                }
              });
            }
          }
        });
      }
    });
    this.repositoryFiles.map(year => {
      year.months = year.months.sort((monthA, monthB) =>
        monthA.month - monthB.month
      );
    })
    this.repositoryFiles = this.repositoryFiles.sort((itemA: RepositoryFile, itemB: RepositoryFile) => {
      return itemB.year < itemA.year ? -1 : 1;
    });
  }

  selectMonth(year: string, monthItem: { month: number, monthName: string, fileNames: string[] }) {
    this.anioSelectedUpload = Number(year);
    this.mesSelectedUpload = monthItem.monthName;
    this.selectedMonth = year + '/' + monthItem.monthName;
    this.selectedFiles = monthItem.fileNames;
  }

  downloadFile(filename: string) {
    const filePathToDownload = this.marcaSelected.idMarca + '/' + this.selectedMonth + '/' + filename;
    this.repositoryService.getDocument(filePathToDownload).subscribe((fileBase64: string) => {
      const linkSource = `data:application/octet-stream;base64,${fileBase64}`;
      const downloadLink = document.createElement('a');
      downloadLink.href = linkSource;
      downloadLink.download = filename;
      downloadLink.click();
    });
  }

  openModal(content) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', size: 'lg', centered: true }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  openModalDelete(content, filename: string) {
    this.fileNameDelete = filename;
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', centered: true }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  handleInputChange(e) {
    const file = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];
    const reader = new FileReader();
    this.fileNameUpload = file.name;
    switch (file.type) {
      case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
        break;
      case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        break;
      case 'application/pdf':
        break;
      default:
        alert('Archivo invalido');
        return;
    }
    reader.onload = this._handleReaderLoaded.bind(this);
    reader.readAsDataURL(file);
  }
  _handleReaderLoaded(e) {
    const reader = e.target;
    this.base64Upload = reader.result.split(';')[1].split(',')[1];
  }

  private validarArchivo(): boolean {
    this.mensajeError = null;
    if (this.marcaSelectedUpload == undefined) {
      this.mensajeError = 'Seleccione una marca';
      return false;
    }
    if (this.anioSelectedUpload == undefined) {
      this.mensajeError = 'Seleccione el año';
      return false;
    }
    if (this.mesSelectedUpload == undefined) {
      this.mensajeError = 'Seleccione el mes';
      return false;
    }
    if (this.base64Upload == undefined) {
      this.mensajeError = 'Seleccionn un archivo';
      return false;
    }
    return true;
  }

  setDocument() {
    if (this.validarArchivo()) {
      const filePath = this.marcaSelectedUpload + '/' + this.anioSelectedUpload + '/' + this.mesSelectedUpload + '/' + this.fileNameUpload;
      this.repositoryService.setDocument(filePath, this.base64Upload).subscribe(() => {
        this.modalService.dismissAll('Archivo Guardado');
        this.marcaSelectedUpload = null;
        this.anioSelectedUpload = null;
        this.mesSelectedUpload = null;
        this.fileNameUpload = null;
        this.ngOnInit();
      }, error => {
        this.mensajeError = error.statusText;
      });
    }
  }

  deleteDocument() {
    const filePath = this.marcaSelectedUpload + '/' + this.anioSelectedUpload + '/' + this.mesSelectedUpload + '/' + this.fileNameDelete;
    this.repositoryService.deleteDocument(filePath).subscribe(() => {
      this.modalService.dismissAll('Archivo Eliminado');
      this.marcaSelectedUpload = null;
      this.anioSelectedUpload = null;
      this.mesSelectedUpload = null;
      this.fileNameUpload = null;
      this.ngOnInit();
    }, error => {
      this.mensajeErrorEliminar = error.statusText;
    });
  }

  closeMessage() {
    this.mensajeError = null;
  }

  closeMessageEliminar() {
    this.mensajeErrorEliminar = null;
  }

}
