import { NotificationService } from "medusa-interfaces";
import nodemailer from "nodemailer";
import Email from "email-templates";

class NodemailerService extends NotificationService {
    static identifier = "nodemailer";

    constructor({ orderService, cartService }, config) {
        super();

        this.config = {
            fromEmail: "noreply@medusajs.com",
            transport: {
                sendmail: true,
                path: "/usr/sbin/sendmail",
                newline: "unix",
            },
            emailTemplatePath: "data/emailTemplates",
            templateMap: {
                "order.placed": "orderplaced",
            },
            ...config,
        };
        this.orderService = orderService;
        this.cartService = cartService;

        this.transporter = nodemailer.createTransport(this.config.transport);
    }

    async sendNotification(eventName, eventData, attachmentGenerator) {
        let emailData = await this.retrieveData(eventName, eventData);
        if (emailData) {
            let templateName = this.getTemplateNameForEvent(eventName);
            const email = new Email({
                message: {
                    from: this.config.fromEmail,
                },
                transport: this.transporter,
                views: {
                    root: this.config.emailTemplatePath,
                },
                send: true,
            });
            const status = await email
                .send({
                    template: templateName,
                    message: {
                        to: emailData.to,
                    },
                    locals: {
                        data: emailData.data,
                    },
                })
                .then(() => "sent")
                .catch(() => "failed");
            return {
                to: emailData.to,
                status,
                data: emailData.data,
            };
        }
        return {
            status: "noDataFound",
        };
    }

    async resendNotification(notification, config, attachmentGenerator) {
        let templateName = this.getTemplateNameForEvent(notification.event_name);
        if (templateName) {
            const email = new Email({
                message: {
                    from: this.config.fromEmail,
                },
                transport: this.transporter,
                views: {
                    root: this.config.emailTemplatePath,
                },
                send: true,
            });
            const status = await email
                .send({
                    template: templateName,
                    message: {
                        to: notification.to,
                    },
                    locals: {
                        data: notification.data,
                    },
                })
                .then(() => "sent")
                .catch(() => "failed");
            return {
                to: notification.to,
                status,
                data: notification.data,
            };
        } else {
            return {
                to: notification.to,
                status: "noTemplateFound",
                data: notification.data,
            };
        }
    }

    async retrieveData(eventName, eventData) {
        let sendData;
        let registeredEvent = this.config.templateMap[eventName];
        if (!registeredEvent) {
            return false;
        } else {
            sendData = await this.orderService.retrieve(eventData.id, {
                select: ["shipping_total", "tax_total", "subtotal", "total"],
                relations: [
                    "customer",
                    "billing_address",
                    "shipping_address",
                    "discounts",
                    "discounts.rule",
                    "discounts.rule.valid_for",
                    "shipping_methods",
                    "shipping_methods.shipping_option",
                    "payments",
                    "fulfillments",
                    "fulfillments.tracking_links",
                    "returns",
                    "gift_cards",
                    "gift_card_transactions",
                    "items",
                ],
            });
            return {
                to: sendData.email,
                data: sendData,
            };
        }
    }

    getTemplateNameForEvent(eventName) {
        let templateNameForEvent = this.config.templateMap[eventName];
        if (templateNameForEvent) {
            return templateNameForEvent;
        } else {
            return false;
        }
    }
}

export default NodemailerService;
