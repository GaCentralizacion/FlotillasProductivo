"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const mensaje_chat_model_1 = require("./mensaje_chat.model");
let MediaChat = class MediaChat {
};
__decorate([
    typeorm_1.PrimaryColumn({ name: 'idMediaChat', type: 'varchar', length: 50 }),
    __metadata("design:type", String)
], MediaChat.prototype, "idMediaChat", void 0);
__decorate([
    typeorm_1.Column({ name: 'nombre', type: 'varchar', length: 100, nullable: false }),
    __metadata("design:type", String)
], MediaChat.prototype, "nombre", void 0);
__decorate([
    typeorm_1.Column({ name: 'mediaPath', type: 'varchar', length: 250, nullable: false }),
    __metadata("design:type", String)
], MediaChat.prototype, "mediaPath", void 0);
__decorate([
    typeorm_1.Column({ name: 'idContactoChat', type: 'varchar', length: 50, nullable: false }),
    __metadata("design:type", String)
], MediaChat.prototype, "idContactoChat", void 0);
__decorate([
    typeorm_1.Column({ name: 'tipoMedio', type: 'varchar', length: 50, nullable: false }),
    __metadata("design:type", String)
], MediaChat.prototype, "tipoMedio", void 0);
__decorate([
    typeorm_1.Column({ name: 'idUsuarioModificacion', type: 'int', nullable: false }),
    __metadata("design:type", Number)
], MediaChat.prototype, "idUsuarioModificacion", void 0);
__decorate([
    typeorm_1.Column({ name: 'fechaModificacion', type: 'datetime', nullable: false }),
    __metadata("design:type", Date)
], MediaChat.prototype, "fechaModificacion", void 0);
__decorate([
    typeorm_1.OneToOne(() => mensaje_chat_model_1.MensajeChat, (mensaje) => mensaje.idMediaChat),
    typeorm_1.JoinColumn({ name: 'idMediaChat' }),
    __metadata("design:type", mensaje_chat_model_1.MensajeChat)
], MediaChat.prototype, "mensaje", void 0);
MediaChat = __decorate([
    typeorm_1.Entity({ name: 'MediaChat' })
], MediaChat);
exports.MediaChat = MediaChat;
//# sourceMappingURL=media_chat.model.js.map