const Controller = require(`${config.path.controller}/Controller`);
module.exports = new class LoanController extends Controller {
    index(req, res) {
        req.checkParams('id', 'ای دی وارد شده صحیح نیست').isMongoId();
        this.model.Loan.find().exec((err, Loan) => {
            if (err) throw err;
            if (Loan) {
                return res.json({
                    data: Loan,
                    success: true
                });
            }
            res.json({
                data: 'اطلاعاتی وجود ندارد',
                success: false
            })
        });
    }

    single(req, res) {
        req.checkParams('id', 'ای دی وارد شده صحیح نیست').isMongoId();
        if (this.showValidationErrors(req, res))
            return;
        this.model.Loan.findById(req.params.id, (err, Loan) => {
            if (Loan) {
                return res.json({
                    data: Loan,
                    success: true
                })
            }
            res.json({
                data: 'داده ای یافت نشد',
                success: false
            })
        })
    }

    store(req, res) {
        req.checkBody('title', 'وارد کردن فیلد عنوان تسهیلات الزامیست').notEmpty();
        req.checkBody('amount', 'وارد کردن فیلد مبلغ تسهیلات الزامیست').notEmpty();
        req.checkBody('number', 'وارد کردن فیلد تعداد اقساط تسهیلات الزامیست').notEmpty();
        req.checkBody('ceilingNum', 'وارد کردن فیلد سقف تسهیلات الزامیست').notEmpty();
        req.checkBody('condition', 'وارد کردن فیلد شرط تسهیلات الزامیست').notEmpty();
        req.checkBody('percent', 'وارد کردن فیلد درصد سود تسهیلات الزامیست').notEmpty();

        if (this.showValidationErrors(req, res))
            return;
        this.model.Loan.findOne({title: req.body.title}, (err, Loan) => {
            if (err) throw err;
            if (Loan) {
                return res.json({
                    data: 'این تسهیلات قبلا ثبت شده است',
                    success: false
                });
            } else {
                this.model.Loan({
                    title: req.body.title,
                    amount: req.body.amount,
                    number: req.body.number,
                    ceilingNum: req.body.ceilingNum,
                    condition: req.body.condition,
                    percent: req.body.percent,
                }).save(err => {
                    if (err) {
                        throw err;
                    }
                    return res.json({
                        data: 'تسهیلات با موفقیت ثبت  شد',
                        success: true
                    });
                })
            }
        })
    }
    
    



    storeLottery(req, res) {
        if (this.showValidationErrors(req, res))
            return;
            let newLottery = new this.model.Lottery({
             lock: true,

            })
            newLottery.save(err => {
            if (err) throw err;
            return res.json({
                data: 'ثبت شد',
                success: true
            });
        })
    }

    update(req, res) {
        req.checkParams('id', 'ای دی وارد شده صحیح نیست').isMongoId();
        if (this.showValidationErrors(req, res))
            return;
        this.model.Loan.findByIdAndUpdate(req.params.id, {
            title: req.body.title,
            amount: req.body.amount,
            number: req.body.number,
            ceilingNum: req.body.ceilingNum,
            branch: req.body.branch,
            condition: req.body.condition,
            percent: req.body.percent,
            morabehe:req.body.morabehe,
            leasing:req.body.leasing,
        }, (err, Loan) => {
            if (err) throw err;
            if (Loan) {
                return res.json({
                    data: ' تسهیلات با موفقیت آپدیت شد',
                    success: true
                });
            }
            res.status(404).json({
                data: 'چنین تسهیلاتی وجود ندارد',
                success: false
            });
        });
    }

    destroy(req, res) {
        req.checkParams('id', 'ای دی وارد شده صحیح نیست').isMongoId();
        if (this.showValidationErrors(req, res))
            return;
        this.model.Loan.findByIdAndRemove(req.params.id, (err, Loan) => {
            if (err) throw err;
            if (Loan) {
                return res.json({
                    data: 'تسهیلات با موفقیت حذف شد',
                    success: true
                });
            }
            res.status(404).json({
                data: 'چنین تسهیلات ای وجود ندارد',
                success: false
            });
        });
    }
}
