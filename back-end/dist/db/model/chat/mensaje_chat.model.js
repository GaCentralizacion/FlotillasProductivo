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
const notificacion_1 = require("../notificacion");
const grupo_chat_model_1 = require("./grupo_chat.model");
const media_chat_model_1 = require("./media_chat.model");
const receptor_chat_model_1 = require("./receptor_chat.model");
let MensajeChat = class MensajeChat {
};
__decorate([
    typeorm_1.PrimaryColumn({ name: 'idMensajeChat', type: 'varchar', length: 50 }),
    __metadata("design:type", String)
], MensajeChat.prototype, "idMensajeChat", void 0);
__decorate([
    typeorm_1.Column({ name: 'cuerpoMensaje', type: 'varchar', length: 512, nullable: false }),
    __metadata("design:type", String)
], MensajeChat.prototype, "cuerpoMensaje", void 0);
__decorate([
    typeorm_1.Column({ name: 'idGrupoChat', type: 'varchar', length: 50 }),
    __metadata("design:type", String)
], MensajeChat.prototype, "idGrupoChat", void 0);
__decorate([
    typeorm_1.Column({ name: 'idContactoChat', type: 'varchar', length: 50 }),
    __metadata("design:type", String)
], MensajeChat.prototype, "idContactoChat", void 0);
__decorate([
    typeorm_1.Column({ name: 'idMediaChat', type: 'varchar', length: 50 }),
    __metadata("design:type", String)
], MensajeChat.prototype, "idMediaChat", void 0);
__decorate([
    typeorm_1.Column({ name: 'fechaCreacion', type: 'datetime', nullable: false }),
    __metadata("design:type", Date)
], MensajeChat.prototype, "fechaCreacion", void 0);
__decorate([
    typeorm_1.Column({ name: 'idUsuarioModificacion', type: 'int', nullable: false }),
    __metadata("design:type", Number)
], MensajeChat.prototype, "idUsuarioModificacion", void 0);
__decorate([
    typeorm_1.Column({ name: 'fechaModificacion', type: 'datetime', nullable: false }),
    __metadata("design:type", Date)
], MensajeChat.prototype, "fechaModificacion", void 0);
__decorate([
    typeorm_1.ManyToOne((type) => grupo_chat_model_1.GrupoChat, (grupo) => grupo.mensajes),
    typeorm_1.JoinColumn({ name: 'idGrupoChat' }),
    __metadata("design:type", grupo_chat_model_1.GrupoChat)
], MensajeChat.prototype, "grupo", void 0);
__decorate([
    typeorm_1.OneToOne(() => media_chat_model_1.MediaChat, (media) => media.idMediaChat),
    typeorm_1.JoinColumn({ name: 'idMediaChat' }),
    __metadata("design:type", media_chat_model_1.MediaChat)
], MensajeChat.prototype, "media", void 0);
__decorate([
    typeorm_1.OneToMany(() => receptor_chat_model_1.ReceptorChat, (receptor) => receptor.mensaje),
    typeorm_1.JoinColumn({ name: 'idMensajeChat' }),
    __metadata("design:type", receptor_chat_model_1.ReceptorChat)
], MensajeChat.prototype, "receptores", void 0);
__decorate([
    typeorm_1.OneToOne((type) => notificacion_1.Notificacion, (notificacion) => notificacion.mensaje),
    typeorm_1.JoinColumn({ name: 'idMensajeChat' }),
    __metadata("design:type", notificacion_1.Notificacion)
], MensajeChat.prototype, "notificacion", void 0);
MensajeChat = __decorate([
    typeorm_1.Entity({ name: 'MensajeChat' })
], MensajeChat);
exports.MensajeChat = MensajeChat;
//# sourceMappingURL=mensaje_chat.model.js.map