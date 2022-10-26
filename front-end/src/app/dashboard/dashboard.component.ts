import { Component, OnInit, ViewChild, AfterViewChecked, AfterViewInit } from '@angular/core';
import { PricingService, ChatService } from '../services';
import { DireccionFlotillaSelectComponent } from '../shared/direccion-flotilla-select/direccion-flotilla-select.component';
import { Router } from '@angular/router';
import { NotificationService } from '../services/notification.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, AfterViewInit {

  cantidad = '';
  @ViewChild(DireccionFlotillaSelectComponent) dirFlotillas: DireccionFlotillaSelectComponent;


  // Pie
  public pieChartOptions = {
    responsive: true,
  };
  public pieChartLabels = [['Compras', 'Asignación'], ['Ventas'], 'Producción'];
  public pieChartData = [300, 500, 100];
  public pieChartType = 'pie';
  public pieChartLegend = true;
  public pieChartPlugins = [];
  public messages: any[] = [];

  cotizacionesCount = 0;
  gestionCount = 0;

  currentIdFlotilla = '';

  private idUsuario: number;
  rol: number;
  notifaciones: any[];

  constructor(private pricingService: PricingService
    , private chartService: ChatService
    , private router: Router
    , private notificationService: NotificationService) { }

  ngOnInit() {
    this.notificationService.getNotificationDashboard()
        .subscribe((notificaciones: any) => {
          this.notifaciones = notificaciones;
        });
  }

  ngAfterViewInit(): void {
    if( !(window.location.search.split('idUsuario=')) ){
    }else{
      this.router.navigate(['main/dashboard']);
    }
    const objAuth: any = JSON.parse(localStorage.getItem('app_token'));
    this.idUsuario = objAuth.data.user.id;
    this.rol = objAuth.data.security.rol[0].RolId;
    this.currentIdFlotilla = this.dirFlotillas.direccionSelected.name;
    // validar el rol del usuario para filtrar las cotizaciones
    if (this.rol === 50) {
      this.pricingService.getPricingsByIdDireccionFlotillas(this.dirFlotillas.direccionSelected.name)
        .subscribe((cotizaciones: any) => {
          const coti = cotizaciones.filter(item => item.status !== 'APROBADA');
          const gest = cotizaciones.filter(item => item.status === 'APROBADA' || item.status === 'PEDIDO GENERADO');
          this.cotizacionesCount = coti.length;
          this.gestionCount = gest.length;
        });

    } else {
      // Si el usuario no es un admin, entonces las cotizaciones se filtran por usuario.
      this.pricingService.getPricingsByIdDireccionFlotillasByUser(this.dirFlotillas.direccionSelected.name, this.idUsuario)
        .subscribe((cotizaciones: any) => {
          const coti = cotizaciones.filter(item => item.status !== 'APROBADA');
          const gest = cotizaciones.filter(item => item.status === 'APROBADA' || item.status === 'PEDIDO GENERADO');
          this.cotizacionesCount = coti.length;
          this.gestionCount = gest.length;
        });
    }

    this.getMessages();
  }

  getMessages() {
    // obtener los ultimos mensajes
    this.messages = [];
    this.chartService.getMessageByUser(this.idUsuario).subscribe((data: any) => {
      this.messages = data;
      this.messages.reverse();
      this.messages.forEach((m, i) => this.messages[i].usuario = this.shortName(this.messages[i].usuario));
    });
  }

  shortName(value: string) {
    const names = value.split(' ') as any[];
    let initials = names[0].substring(0, 1).toUpperCase() as string;
    if (names.length >= 1) {
      initials += names[1].substring(0, 1).toUpperCase() as string;
    }
    return initials;
  }

  public chartClicked(e: any): void {
  }
  public chartHovered(e: any): void {
  }

  public changeDir(event) {
    this.currentIdFlotilla = event;
    if (this.rol === 50) {
      this.pricingService.getPricingsByIdDireccionFlotillas(event).subscribe((cotizaciones: any) => {
        const coti = cotizaciones.filter(item => item.status !== 'APROBADA');
        const gest = cotizaciones.filter(item => item.status === 'APROBADA' || item.status === 'PEDIDO GENERADO');
        this.cotizacionesCount = coti.length;
        this.gestionCount = gest.length;
      });
    } else {
      this.pricingService.getPricingsByIdDireccionFlotillasByUser(event, this.idUsuario).subscribe((cotizaciones: any) => {
        const coti = cotizaciones.filter(item => item.status !== 'APROBADA');
        const gest = cotizaciones.filter(item => item.status === 'APROBADA' || item.status === 'PEDIDO GENERADO');
        this.cotizacionesCount = coti.length;
        this.gestionCount = gest.length;
      });
    }
  }

  goTo(uri, value) {
    if (value === 0) {
      return;
    }
    this.router.navigate([uri], { queryParams: { idFlotilla: this.currentIdFlotilla } });
  }

  irChatCotizaciones(item) {
    // this.router.navigate(['/main/chatNotificaciones'], { queryParams: { idGrupoChat: item.idGrupoChat } });
  }
}
