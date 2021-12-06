# Medusa-plugin-nodemailer

A notification service based on nodemailer

## Details

It uses the email-templates npm package and pug for rendering html emails. Documentation for this can be found here: [https://github.com/forwardemail/email-templates](https://github.com/forwardemail/email-templates)

## Available options (default configuration)

```js
{
    fromEmail: "noreply@medusajs.com",
    // this object is input directly into nodemailer.createtransport(), so anything that works there should work here
    // see: https://nodemailer.com/smtp/#1-single-connection and https://nodemailer.com/transports/
    transport: {
        sendmail: true,
        path: "/usr/sbin/sendmail",
        newline: "unix",
    },
    // an example for an office365 smtp transport:
    // {
    //     host: "smtp.office365.com",
    //     port: 587,
    //     secureConnection: false,
    //     auth: {
    //         user: process.env.EMAIL_SENDER_ADDRESS,
    //         pass: process.env.EMAIL_SENDER_PASS,
    //     },
    //     tls: {
    //         ciphers: "SSLv3",
    //     },
    //     requireTLS: true,
    // },
    // this is the path where your email templates are stored
    emailTemplatePath: "data/emailTemplates",
    // this maps the folder/template name to a medusajs event to use the right template
    // only the events that are registered here are subscribed to
    templateMap: {
        // "eventname": "templatename",
        "order.placed": "orderplaced",
    },
}
```
