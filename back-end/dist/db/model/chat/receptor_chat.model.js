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
let ReceptorChat = class ReceptorChat {
};
__decorate([
    typeorm_1.PrimaryColumn({ name: 'idContactoChat', type: 'varchar', length: 50 }),
    __metadata("design:type", String)
], ReceptorChat.prototype, "idContactoChat", void 0);
__decorate([
    typeorm_1.PrimaryColumn({ name: 'idMensajeChat', type: 'varchar', length: 50 }),
    __metadata("design:type", String)
], ReceptorChat.prototype, "idMensajeChat", void 0);
__decorate([
    typeorm_1.Column({ name: 'fechaLeido', type: 'datetime' }),
    __metadata("design:type", Date)
], ReceptorChat.prototype, "fechaLeido", void 0);
__decorate([
    typeorm_1.Column({ name: 'idUsuarioModificacion', type: 'int', nullable: false }),
    __metadata("design:type", Number)
], ReceptorChat.prototype, "idUsuarioModificacion", void 0);
__decorate([
    typeorm_1.Column({ name: 'fechaModificacion', type: 'datetime', nullable: false }),
    __metadata("design:type", Date)
], ReceptorChat.prototype, "fechaModificacion", void 0);
__decorate([
    typeorm_1.ManyToOne((type) => mensaje_chat_model_1.MensajeChat, (mensaje) => mensaje.receptores),
    typeorm_1.JoinColumn({ name: 'idMensajeChat' }),
    __metadata("design:type", mensaje_chat_model_1.MensajeChat)
], ReceptorChat.prototype, "mensaje", void 0);
ReceptorChat = __decorate([
    typeorm_1.Entity({ name: 'ReceptorChat' })
], ReceptorChat);
exports.ReceptorChat = ReceptorChat;
//# sourceMappingURL=receptor_chat.model.js.map