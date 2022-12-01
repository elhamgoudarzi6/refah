// Model
const Admin= require(`${config.path.model}/admin`);
const Employee = require(`${config.path.model}/employee`);
const Loan = require(`${config.path.model}/loan`);
const Request = require(`${config.path.model}/request`);
const Request_Leasing = require(`${config.path.model}/request_leasing`);
const Lottery = require(`${config.path.model}/lottery`);
const Notification = require(`${config.path.model}/notification`);
const Deadline = require(`${config.path.model}/deadline`);

module.exports = class Controller {
    constructor() {
        this.model = { Admin,Employee,Loan,Request,Request_Leasing,Lottery,Notification,Deadline}
    }
    showValidationErrors(req, res, callback) {
        let errors = req.validationErrors();
        if (errors) {
            res.status(422).json({
                message: errors.map(error => {
                    return {
                        'field': error.param,
                        'message': error.msg
                    }
                }),
                success: false
            });
            return true;
        }
        return false
    }

    escapeAndTrim(req, items) {
        items.split(' ').forEach(item => {
            req.sanitize(item).escape();
            req.sanitize(item).trim();
        });
    }
}
