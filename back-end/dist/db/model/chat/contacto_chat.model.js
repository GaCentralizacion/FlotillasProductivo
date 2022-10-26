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
const rel_contacto_grupo_chat_model_1 = require("./rel_contacto_grupo_chat.model");
let ContactoChat = class ContactoChat {
};
__decorate([
    typeorm_1.PrimaryColumn({ name: 'idContactoChat', type: 'varchar', length: 50 }),
    __metadata("design:type", String)
], ContactoChat.prototype, "idContactoChat", void 0);
__decorate([
    typeorm_1.Column({ name: 'idUsuario', type: 'int', nullable: false }),
    __metadata("design:type", Number)
], ContactoChat.prototype, "idUsuario", void 0);
__decorate([
    typeorm_1.Column({ name: 'nombreCompleto', type: 'varchar', length: 450, nullable: false }),
    __metadata("design:type", String)
], ContactoChat.prototype, "nombreCompleto", void 0);
__decorate([
    typeorm_1.Column({ name: 'telefono', type: 'varchar', length: 15 }),
    __metadata("design:type", String)
], ContactoChat.prototype, "telefono", void 0);
__decorate([
    typeorm_1.Column({ name: 'correo', type: 'varchar', length: 50, nullable: false, default: null }),
    __metadata("design:type", String)
], ContactoChat.prototype, "correo", void 0);
__decorate([
    typeorm_1.Column({ name: 'idUsuarioModificacion', type: 'int', nullable: false }),
    __metadata("design:type", Number)
], ContactoChat.prototype, "idUsuarioModificacion", void 0);
__decorate([
    typeorm_1.Column({ name: 'fechaModificacion', type: 'datetime', nullable: false }),
    __metadata("design:type", Date)
], ContactoChat.prototype, "fechaModificacion", void 0);
__decorate([
    typeorm_1.ManyToOne((type) => rel_contacto_grupo_chat_model_1.RelContactoGrupoChat, (contactoGrupo) => contactoGrupo.contacto),
    typeorm_1.JoinColumn({ name: 'idContactoChat' }),
    __metadata("design:type", rel_contacto_grupo_chat_model_1.RelContactoGrupoChat)
], ContactoChat.prototype, "contactoGrupo", void 0);
ContactoChat = __decorate([
    typeorm_1.Entity({ name: 'ContactoChat' })
], ContactoChat);
exports.ContactoChat = ContactoChat;
//# sourceMappingURL=contacto_chat.model.js.map