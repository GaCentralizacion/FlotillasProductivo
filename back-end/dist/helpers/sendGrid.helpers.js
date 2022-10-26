"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const http = __importStar(require("https"));
// const http = require('https');
// const env: string = process.env.NODE_ENV || "development";
// const conf = (config as any)[env]; // ejemplo de llamada al confg.js
// const sgMail = require('@sendgrid/mail');
// email sender function
exports.sendGridEMail = (opt, data) => {
    return new Promise((done, reject) => {
        const options = {
            method: 'POST',
            hostname: 'api.sendgrid.com',
            port: null,
            path: '/v3/mail/send',
            headers: {
                'authorization': process.env.SENDGRID_TOKEN,
                'content-type': 'application/json',
            },
        };
        const toSend = [];
        opt.emails.forEach((element) => {
            // console.log(element.email)
            toSend.push({ email: element.email });
        });
        // toSend.push({ email: "jllozada2@gmail.com" });
        const req = http.request(options, (res) => {
            const chunks = [];
            res.on('data', (chunk) => {
                chunks.push(chunk);
            });
            res.on('end', () => {
                const body = Buffer.concat(chunks);
                try {
                    done(JSON.parse(body.toString()));
                }
                catch (error) {
                    done({ errors: null });
                }
            });
        });
        req.write(JSON.stringify({
            personalizations: [{
                    to: toSend,
                    dynamic_template_data: Object.assign({}, data),
                    subject: process.env.SENDGRID_HOST_NAME,
                }],
            from: { email: process.env.SENDGRID_HOST_FROM, name: process.env.SENDGRID_HOST_NAME },
            template_id: process.env.SENDGRID_TEMPLATEID,
        }));
        req.end();
    });
};
//# sourceMappingURL=sendGrid.helpers.js.map