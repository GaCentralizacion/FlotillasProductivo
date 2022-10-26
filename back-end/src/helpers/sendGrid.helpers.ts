// import { default as config } from "../config";
import { json } from 'body-parser';
import * as http from 'https';
import { HostIdentidadSendGrid } from '../helpers/notification';

// const http = require('https');

// const env: string = process.env.NODE_ENV || "development";
// const conf = (config as any)[env]; // ejemplo de llamada al confg.js
// const sgMail = require('@sendgrid/mail');

// email sender function
export const sendGridEMail = (opt: any, data: any) => {
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
        const toSend: any = [];

        opt.emails.forEach((element: {email: string}) => {
            // console.log(element.email)
            toSend.push({ email: element.email});
         });
        // toSend.push({ email: "jllozada2@gmail.com" });
        const req = http.request(options, (res: any) => {
            const chunks: any[] = [];
            res.on('data', (chunk: any) => {
                chunks.push(chunk);
            });
            res.on('end', () => {
                const body: any = Buffer.concat(chunks);
                try {
                    done(JSON.parse(body.toString()));
                } catch (error) {
                    done({ errors: null });
                }
            });
        });
        req.write(JSON.stringify({
            personalizations:
                [{
                    to: toSend,
                    dynamic_template_data: {
                        ... data,
                    },
                    subject: process.env.SENDGRID_HOST_NAME,
                }],
            from: { email: process.env.SENDGRID_HOST_FROM ,  name: process.env.SENDGRID_HOST_NAME },
            template_id: process.env.SENDGRID_TEMPLATEID,
        }));
        req.end();
    });
};
