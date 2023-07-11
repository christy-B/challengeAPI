import { Client } from 'node-mailjet';



export class Email {

    private client: Client;

    constructor() {
        this.client = new Client({
            apiKey: process.env.MJ_APIKEY || '',
            apiSecret: process.env.MJ_APISECRET || ''
        });
    }

    async sendMagicLink(to: string, link: string, title: string) {
        console.info('Sending magic link to: ' + to);
        const request = await this.client
            .post("send", { 'version': 'v3.1' })
            .request({
                "Messages": [
                    {
                        "From": {
                            "Email": process.env.MJ_EMAIL_FROM || '',
                            "Name": process.env.MJ_EMAIL_NAME || ''
                        },
                        "To": [
                            {
                                "Email": to,
                            }
                        ],
                        "Subject": title.toUpperCase() + " : Votre lien magique",
                        "HTMLPart": `
<p>Bonjour,</p>
<p>Cliquez sur le lien afin de vous identifier. Le lien sera valable pendant 30 minutes.</p>
<p><a href=" + ${link} + ">Connexion</a>
<p>Si le lien dessus ne fonctionne pas, copiez/collez le lien suivant dans votre navigateur :</a>
<pre>${link}</pre>
`,
                    }
                ]
            });
    }

}
