class OrderSubscriber {
    constructor({ notificationService }, options) {
        const templateMap = options.templateMap || {
            "order.placed": "orderplaced",
        };
        for (let [key] of Object.entries(templateMap)) {
            notificationService.subscribe(key, "nodemailer");
        }
    }
}

export default OrderSubscriber;
