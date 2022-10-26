import { Component, Input, Output, EventEmitter, OnChanges, ViewChild, ElementRef, AfterViewChecked, OnInit  } from '@angular/core';
import { ChatService } from 'src/app/services';
import { ChatMessage, Media, Receptores } from 'src/app/models/chat.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-chat-mensajes',
  templateUrl: './chat-mensajes.component.html',
  styleUrls: ['./chat-mensajes.component.scss']
})

export class ChatMensajesComponent implements OnChanges, AfterViewChecked, OnInit  {
  @Input() idGrupoChat: string;
  @Input() receptores: Receptores[];
  @ViewChild('fileMedia') fileMedia: ElementRef;
  @Output() messageEvent = new EventEmitter<ChatMessage>();
  @ViewChild('scrollMe') private scrollContainer: ElementRef;

  fileNameUpload: string;
  base64Upload: string;
  message = '';

  nameTypeFile: {
    name: string,
    type: string
  };

  mediaClean = null;

  initials: string;
  idContacto: string;
  messageView: string;

  media: Media;
  messages: ChatMessage[] = [];
  grupoChat = new ChatMessage();

  receptoresRows: any[] = [];
  messagesRows: ChatMessage[] = [];

  fileRepository;

  mimeTypes = [
    'image/png',
    'image/jpg',
    'image/jpeg',
    'application/pdf',
    'application/msword',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ] as any[];

  idUsuario: number;
  rol: number;

  constructor(
    private chatService: ChatService,
    private toastrService: ToastrService,
    ) {
  }

  ngOnInit(): void {
    const objAuth: any = JSON.parse(localStorage.getItem('app_token'));
    this.idUsuario = objAuth.data.user.id;
    this.rol = objAuth.data.security.rol[0].RolId;
  }

  ngOnChanges() {
    this.receptoresRows = [];
    const userName = JSON.parse(localStorage.app_token).data.user.fullname;
    this.initials = this._getInitials(userName);

    if (this.idGrupoChat) { this.getMessages(this.idGrupoChat); }
    this.idContacto = JSON.parse(localStorage.app_token).data.user.id;
    if (this.receptores.length > 0) { this.receptoresRows = JSON.parse(JSON.stringify(this.receptores)); }
    this.scrollToBottom();
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    try {
        this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
    } catch (err) { }
  }

  _getInitials(name) {
    const names = name.split(' ') as any[];
    let initials = names[0].substring(0, 1).toUpperCase() as string;
    if (names.length >= 1) {
      initials += names[1].substring(0, 1).toUpperCase() as string;
    }
    return initials;
  }

  _getFileNameType(name: string) {
    const arrayFileName = name.split('.');
    const indexExtension = arrayFileName.length - 1;
    arrayFileName.pop();

    return {
      name: arrayFileName.join('.'),
      type: name.split('.')[indexExtension].toLowerCase()
    };
  }

  _cleanMedia() {
    return {
      nombre: '',
      idContactoChat: '',
      tipoMedio: '',
      contenido: '',
      idMediaChat: null,
      mediaPath: null
    } as Media;
  }

  _cleanStructureMessage() {
    this.message = '';
    this.fileNameUpload = '';
    this.grupoChat.media = null; // this._cleanMedia();
    this.grupoChat.cuerpoMensaje = '';
    this.fileMedia.nativeElement.value = null;
    this.mediaClean = true;
    this.grupoChat = Object.assign(new ChatMessage(), {});
  }

  getMessages(idGrupoChat: string) {
    this.messages = [];
    this.messagesRows = [];
    this.chatService.getMessage(idGrupoChat).subscribe((messages: any[]) => {
      if (!messages.length) {
        this.messageView = 'No se han iniciado conversaciones';
      } else {
        this.messageView = '';
        messages.map((message, index: number) => {
          message.usuario = this.shortName(messages[index].nombreCompleto);
          if (message.idMediaChat) {
            const media: Media = {
              idMediaChat: message.idMediaChat,
              nombre: message.nombre,
              mediaPath: message.mediaPath,
              idContactoChat: message.idContactoChat,
              tipoMedio: message.tipoMedio,
              contenido: message.contenido
            };

            message.media = media;
          }
          this.messagesRows.push(message);
        });
      }
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

  _handleReaderLoaded(e) {
    const reader = e.target;
    this.base64Upload = reader.result.split(';')[1].split(',')[1];
  }

  handleInputChange(e) {
    const myReader = new FileReader();
    if (e) {
      const file = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];
      if (file) {
        if (!this.mimeTypes.includes(file.type)) {
          this.toastrService.warning('Archivo no valido', 'Archivo');
        } else {
          this.mediaClean = false;
          this.fileNameUpload = file.name;
          myReader.readAsDataURL(file);
          myReader.onload = this._handleReaderLoaded.bind(this);
          this.nameTypeFile = this._getFileNameType(this.fileNameUpload);
        }
      } else {
        this.mediaClean = true;
        this.fileNameUpload = '';
      }
    }
  }

  _downloadFile(media: Media) {
    this.chatService.getMedia(media.idMediaChat).subscribe((file: Media) => {
      const linkSource = `data:application/octet-stream;base64,${file.contenido}`;
      const downloadLink = document.createElement('a');
      downloadLink.href = linkSource;
      downloadLink.download = file.nombre + '.' + file.tipoMedio;
      downloadLink.click();
    }, error => {
      this.toastrService.warning('No se puede descargar el archivo', 'Archivo');
    });
  }

  getIdContactoChat() {
    const idContactoChat = this.receptoresRows.find(receptor => {
      return receptor.idUsuario === this.idContacto;
    });
    return (idContactoChat) ? idContactoChat.idContactoChat : null;
  }

  sendMessage() {
    this.grupoChat.idMediaChat = null;
    this.grupoChat.cuerpoMensaje = this.message;
    this.grupoChat.idGrupoChat = this.idGrupoChat;
    this.grupoChat.idContactoChat = this.getIdContactoChat();

    if (this.mediaClean || this.mediaClean === null) {
      this.grupoChat.media = null;
    } else {
      this.grupoChat.media = {
        nombre: (this.nameTypeFile && this.nameTypeFile.hasOwnProperty('name')) ? this.nameTypeFile.name : '',
        idContactoChat: this.getIdContactoChat(),
        tipoMedio: (this.nameTypeFile && this.nameTypeFile.hasOwnProperty('type')) ? this.nameTypeFile.type : '',
        contenido: (this.base64Upload) ? this.base64Upload : '',
        idMediaChat: null,
        mediaPath: null
      };
    }

    this.grupoChat.receptores = [] as Receptores[];
    this.messageEvent.emit(this.grupoChat);

    if (this.grupoChat.cuerpoMensaje.length > 0 || this.grupoChat.media !== null) {
      this.chatService.saveMessage(this.grupoChat).subscribe((message: any[]) => {
        this._cleanStructureMessage();
        this.ngOnChanges();
      }, error => {
          this._cleanStructureMessage();
          this.toastrService.warning(error.message, 'Error Mensaje');
      });
    } else {
    }
  }

}
