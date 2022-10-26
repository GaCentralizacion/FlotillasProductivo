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
const contacto_chat_model_1 = require("./contacto_chat.model");
const mensaje_chat_model_1 = require("./mensaje_chat.model");
let GrupoChat = class GrupoChat {
};
__decorate([
    typeorm_1.PrimaryColumn({ name: 'idGrupoChat', type: 'varchar', length: 50 }),
    __metadata("design:type", String)
], GrupoChat.prototype, "idGrupoChat", void 0);
__decorate([
    typeorm_1.Column({ name: 'nombreGrupo', type: 'varchar', length: 50, nullable: false }),
    __metadata("design:type", String)
], GrupoChat.prototype, "nombreGrupo", void 0);
__decorate([
    typeorm_1.Column({ name: 'idUsuarioModificacion', type: 'int', nullable: false }),
    __metadata("design:type", Number)
], GrupoChat.prototype, "idUsuarioModificacion", void 0);
__decorate([
    typeorm_1.Column({ name: 'fechaModificacion', type: 'datetime', nullable: false }),
    __metadata("design:type", Date)
], GrupoChat.prototype, "fechaModificacion", void 0);
__decorate([
    typeorm_1.ManyToMany(() => contacto_chat_model_1.ContactoChat, (contacto) => contacto.idContactoChat),
    typeorm_1.JoinTable({ name: 'RelContactoGrupoChat', joinColumn: { name: 'idGrupoChat' }, inverseJoinColumn: { name: 'idContactoChat' } }),
    __metadata("design:type", Array)
], GrupoChat.prototype, "contactos", void 0);
__decorate([
    typeorm_1.OneToMany(() => mensaje_chat_model_1.MensajeChat, (mensaje) => mensaje.grupo),
    __metadata("design:type", Array)
], GrupoChat.prototype, "mensajes", void 0);
GrupoChat = __decorate([
    typeorm_1.Entity({ name: 'GrupoChat' })
], GrupoChat);
exports.GrupoChat = GrupoChat;
//# sourceMappingURL=grupo_chat.model.js.map