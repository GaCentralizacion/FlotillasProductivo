const{ WebClient } = require('@slack/web-api');

// An access token (from your Slack app or custom integration - xoxp, xoxb)
const token = 'xoxp-740638239782-789936180529-898872124358-7e795759fbacf8d3e552b3ffb547fb19'; //process.env.SLACK_TOKEN;

const web = new WebClient(token);

// This argument can be a channel ID, a DM ID, a MPDM ID, or a group ID
const conversationId = 'CSESL58F8';

exports.success = function (req, res, data, status) {
const data_ = '```'+JSON.stringify(data, null, 2)+'```';
const att = `[{"fallback": "Validación Flotillas BISM.",
                "color": "#36a64f",
                "pretext": "Consulta exitosa","author_name": "BISM Bot",
                "text": "_stack_ \n ${details_}",
                    "fields": [{
                    "title": "Request URL",
                    "value": '${req.url}',
                    "short": "true"
                },{
                    "title": "Request Method",
                    "value": "${req.method}",
                    "short": "false"
                },{
                    "title": "Status Code",
                    "value": "${status}",
                    "short": "false"

                }]
            }]`;
    
    res.status(status || 200).json(data);
    (async () => {
        // See: https://api.slack.com/methods/chat.postMessage
        const res = await web.chat.postMessage({ channel: conversationId, text: 'OK', attachments: att });
        // `res` contains information about the posted message
        console.log('Message sent: ', res.ts);
      })();
}

exports.error = function (req, res, message, status, details) {
    let errorC = '';
    switch (status) {
        case 500:
           errorC = 'INTERNAL SERVER ERROR'; 
            break;
    
        default:
           errorC = 'INTERNAL SERVER ERROR';
            break;
    }
    const message_ = JSON.stringify(message, null, 2);
    const details_ ='```'+details+'```';
    const att = `[{"fallback": "Error en flotillas BISM.",
                    "color": "#ff0000",
                    "pretext": "Error Flotillas","author_name": "BISM Bot",
                    "text": "_stack_ \n ${details_}",
                    "fields": [{
                        "title": "Request URL",
                        "value": '${req.url}',
                        "short": "true"
                    },{
                        "title": "Request Method",
                        "value": "${req.method}",
                        "short": "false"
                    },{
                        "title": "Status Code",
                        "value": "${status}",
                        "short": "false"
    
                    }]
                }]`;    console.error('[response error] ' + details);
    res.status(status || 500).send({ 
        error: message,
        body: '',
    });
    (async () => {
        // See: https://api.slack.com/methods/chat.postMessage
        const res = await web.chat.postMessage({ channel: conversationId, text: '_flotllas BISM_' , attachments: att });
        // `res` contains information about the posted message
        console.log('Message sent: ', res.ts);
      })();
}