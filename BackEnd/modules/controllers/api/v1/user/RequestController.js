const Controller = require(`${config.path.controller}/Controller`);
module.exports = new class LoanController extends Controller {
    showLock(req, res) {
        this.model.Lottery.findOne().exec((err, Lottery) => {
            if (err) throw err;
            if (Lottery) {
                return res.json({
                    data: Lottery._doc.lock,
                    introduction:Lottery._doc.introduction,
                    success: true
                });
            }
            res.json({
                data: 'اطلاعاتی وجود ندارد',
                success: false
            })
        });
    }
    
    storeNotification(req, res) {
      this.model.Notification({text: req.body.text}).save(err => {
        if (err) throw err;
        return res.json({
           data: 'ثبت شد',
           success: true
        });
      })
}

   showDeadline(req, res) {
        this.model.Deadline.findOne().exec((err, Deadline) => {
            if (err) throw err;
            if (Deadline) {
                return res.json({
                    data: Deadline._doc.lock,
                    success: true
                });
            }
            res.json({
                data: 'اطلاعاتی وجود ندارد',
                success: false
            })
        });
    }
   storeDeadline(req, res) {
      this.model.Deadline({lock: req.body.lock}).save(err => {
        if (err) throw err;
        return res.json({
           data: 'ثبت شد',
           success: true
        });
      })
}
    
    showNotification(req, res) {
        this.model.Notification.find().exec((err, Notification) => {
            if (err) throw err;
            if (Notification) {
                return res.json({
                    data:Notification,
                    success: true
                });
            }
            res.json({
                data: 'اطلاعاتی وجود ندارد',
                success: false
            })
        });
    }
    
 showResult(req, res) {
        this.model.Request.findOne({personalCode: req.body.personalCode}).exec((err, Request) => {
            if (err) throw err;
            if (Request) {
                        return res.json({
                            data: Request,
                            success: true
                        })
                    }

             else {
                res.json({
                    data: 'درخواستی وجود ندارد',
                    success: false
                })
            }
        });
    }

	 showResultAndDate(req, res) {
        this.model.Employee.aggregate(
            [
                {
                    "$project" : {
                        "_id" :"_id",
                        "employees" : "$$ROOT"
                    }
                },
                {
                    "$lookup" : {
                        "localField" : "employees.personalCode",
                        "from" : "requests",
                        "foreignField" : "personalCode",
                        "as" : "requests"
                    }
                },
                {
                    "$unwind" : {
                        "path" : "$requests",
                        "preserveNullAndEmptyArrays" : false
                    }
                },
                {
                    "$lookup" : {
                        "localField" : "requests.loanID",
                        "from" : "loans",
                        "foreignField" : "_id",
                        "as" : "loans"
                    }
                },
                {
                    "$unwind" : {
                        "path" : "$loans",
                        "preserveNullAndEmptyArrays" : false
                    }
                },
                {
                    "$project" : {
                        "employees.firstName" : "$employees.firstName",
                        "employees.lastName" : "$employees.lastName",
                        "employees.nationalCode" : "$employees.nationalCode",
                        "employees.title" : "$loans.title",
                        "employees.loanID" : "$requests.loanID",
						"employees.amount" : "$loans.amount",
                        "employees.personalCode" : "$requests.personalCode",
                        "employees.result" : "$requests.result",
                        "employees.date" : "$requests.date",
                        "_id" :"_id"
                    }
                },
                {
                    "$match" : {
                        "employees.result" :true,
                        "employees.personalCode":req.body.personalCode
                    }
                },
            ]
        ).exec((err, xx) => {
            if (err) throw err;
            if (xx) {
                return res.json({
                    data: xx,
                    success: true
                });
            }
        })
    }

    countRequest(req, res){
        this.model.Request.find({loanID:req.params.id}).count(function (err, count) {
            if (err) throw err;
            if (count) {
                return res.json({
                    count: count,
                    success: true
                });
            }
            res.json({
                count: 0,
                success: false
            })
        })
    }

    showRequest(req, res) {
        this.model.Request.findOne({personalCode: req.body.personalCode}).exec((err, Request) => {
            if (err) throw err;
            if (Request) {
                this.model.Loan.findById( Request.loanID, (err, Loan) => {
                    if (err) throw err;
                    if (Loan) {

                        return res.json({
                            data: Loan,
                            requestID:Request._id,
                            success: true
                        })
                    }
                })
            } else {
                res.json({
                    data: 'درخواستی وجود ندارد',
                    success: false
                })
            }
        });
    }

    single(req, res) {
        req.checkParams('id', 'ای دی وارد شده صحیح نیست').isMongoId();
        if (this.showValidationErrors(req, res))
            return;
        this.model.Request.findById(req.params.id, (err, Request) => {
            if (Request) {
                return res.json({
                    data: Request,
                    success: true
                })
            }
            res.json({
                data: 'داده ای یافت نشد',
                success: false
            })
        })
    }




       /* store(req, res) {
                req.checkBody('personalCode', 'وارد کردن فیلد کد پرسنلی تسهیلات الزامیست').notEmpty();
                req.checkBody('loanID', 'وارد کردن فیلد کد تسهیلات الزامیست').notEmpty();
                req.checkBody('employee_id', 'وارد کردن فیلد آی دی کارمند الزامیست').notEmpty();
                if (this.showValidationErrors(req, res))
                    return;
                this.model.Employee.findOne({personalCode: req.body.personalCode}, (err, Employee) => {
                    if (err) throw err;
                 
                   if (Employee._doc.morabehe === true) {
                   return res.json({
                          data: 'همکار گرامی شما قبلا از این سرفصل تسهیلات استفاده نموده اید و مجاز به ثبت نام نمی باشید',
                          success: false
                                });
                            }
                    else{
                                  this.model.Request.findOne({personalCode: req.body.personalCode}, (err, Request) => {
                                    if (err) throw err;
                                    if (Request) {
                                        return res.json({
                                         data: ' همکار گرامی درخواست تسهیلات شما ثبت شده است جهت مشاهده از منو سمت راست به بخش مدیریت وام و قرعه کشی مراجعه کنید ',
                                            success: false
                                        });
                                    } else {
                                        this.model.Request({
                                            personalCode: req.body.personalCode,
                                            loanID: req.body.loanID,
                                            employee_id: req.body.employee_id,
                                        }).save(err => {
                                            if (err) {
                                                throw err;
                                            }
                                            return res.json({
                                                  data: 'درخواست تسهیلات با موفقیت ثبت  شد نتیجه در خواست شما پس از پایان مهلت درخواست و انجام قرعه کشی اعلام خواهد شد، جهت مشاهده در خواست  خود از منو سمت راست به بخش مدیریت وام و قرعه کشی مراجعه کنید',
                                                success: true
                                            });
                                        })
                                    }
                                })
                    }
                })
            }
            */
            
            
  store(req, res) {
        req.checkBody('personalCode', 'وارد کردن فیلد کد پرسنلی تسهیلات الزامیست').notEmpty();
        req.checkBody('loanID', 'وارد کردن فیلد کد تسهیلات الزامیست').notEmpty();
        req.checkBody('employee_id', 'وارد کردن فیلد آی دی کارمند الزامیست').notEmpty();
        if (this.showValidationErrors(req, res))
            return;
        this.model.Request.findOne({ personalCode: req.body.personalCode }, (err, Request) => {
            if (err) throw err;
            if (Request) {
                return res.json({
                    data: ' همکار گرامی درخواست تسهیلات شما ثبت شده است جهت مشاهده از منو سمت راست به بخش درخواست ها و نتایج قرعه کشی  مراجعه کنید ',
                    success: false
                });
            } else {
                this.model.Deadline.findOne({}, (err, Deadline) => {
                    if (err) throw err;
                    if (Deadline._doc.lock === true) {
                        return res.json({
                            data: 'همکار گرامی مهلت ثبت نام تمام شده است',
                            success: false
                        });

                    }
                    else {
                        this.model.Employee.findOne({ personalCode: req.body.personalCode }, (err, Employee) => {
                            if (err) throw err;
                            if (Employee._doc.loanPrevious === true) {
                                return res.json({
                                    data: 'همکار گرامی شما قبلا از این سرفصل تسهیلات استفاده نموده اید و مجاز به ثبت نام نمی باشید',
                                    success: false
                                });
                            }else{
                                this.model.Request({
                                    personalCode: req.body.personalCode,
                                    loanID: req.body.loanID,
                                    employee_id: req.body.employee_id,
                                }).save(err => {
                                    if (err) {
                                        throw err;
                                    }
                                    return res.json({
                                        data: 'درخواست تسهیلات با موفقیت ثبت  شد نتیجه در خواست شما پس از پایان مهلت درخواست و انجام قرعه کشی اعلام خواهد شد، جهت مشاهده در خواست  خود از منو سمت راست به بخش درخواست ها و نتایج قرعه کشی مراجعه کنید',
                                        success: true
                                    });
                                })
                            }
                        });
                       
                        }
                })
            }
        })

    }         
                    



      /*    store1(req, res) {
        req.checkBody('personalCode', 'وارد کردن فیلد کد پرسنلی تسهیلات الزامیست').notEmpty();
        req.checkBody('loanID', 'وارد کردن فیلد کد تسهیلات الزامیست').notEmpty();
        req.checkBody('employee_id', 'وارد کردن فیلد آی دی کارمند الزامیست').notEmpty();
        if (this.showValidationErrors(req, res))
            return;
        this.model.Employee.findOne({personalCode: req.body.personalCode}, (err, Employee) => {
            if (err) throw err;
            if (Employee.typeEmployee === 'بازنشسته') {
                return res.json({
                    data: 'این تسهیلات مخصوص شاغلین میباشد به افراد بازنشسته تعلق نمی گیرد',
                    success: false
                });
            }
           else if (Employee.loanPrevious === true) {
                this.model.Loan.findOne({_id: req.body.loanID}, (err, Loan) => {
                    if (err) throw err;
                    if (Loan.morabehe === true) {
                        return res.json({
                  data: 'همکار گرامی شما قبلا از این سرفصل تسهیلات استفاده نموده اید و مجاز به ثبت نام نمی باشید',
                            success: false
                        });
                    }
                    else {
                        this.model.Request.findOne({personalCode: req.body.personalCode}, (err, Request) => {
                            if (err) throw err;
                            if (Request) {
                                return res.json({
                                 data: ' همکار گرامی درخواست تسهیلات شما ثبت شده است جهت مشاهده از منو سمت راست به بخش مدیریت وام و قرعه کشی مراجعه کنید ',
                                    success: false
                                });
                            } else {
                                this.model.Request({
                                    personalCode: req.body.personalCode,
                                    loanID: req.body.loanID,
                                    employee_id: req.body.employee_id,
                                }).save(err => {
                                    if (err) {
                                        throw err;
                                    }
                                    return res.json({
                                          data: 'درخواست تسهیلات با موفقیت ثبت  شد نتیجه در خواست شما پس از پایان مهلت درخواست و انجام قرعه کشی اعلام خواهد شد، جهت مشاهده در خواست  خود از منو سمت راست به بخش مدیریت وام و قرعه کشی مراجعه کنید',
                                        success: true
                                    });
                                })
                            }
                        })
                    }
                })
           }
           else {
                this.model.Request.findOne({personalCode: req.body.personalCode}, (err, Request) => {
                    if (err) throw err;
                    if (Request) {
                        return res.json({
                                 data: ' همکار گرامی درخواست تسهیلات شما ثبت شده است جهت مشاهده از منو سمت راست به بخش مدیریت وام و قرعه کشی مراجعه کنید ',
                            success: false
                        });
                    } else {
                        this.model.Request({
                            personalCode: req.body.personalCode,
                            loanID: req.body.loanID,
                            employee_id: req.body.employee_id,
                        }).save(err => {
                            if (err) {
                                throw err;
                            }
                            return res.json({
                                          data: 'درخواست تسهیلات با موفقیت ثبت  شد نتیجه در خواست شما پس از پایان مهلت درخواست و انجام قرعه کشی اعلام خواهد شد، جهت مشاهده در خواست  خود از منو سمت راست به بخش مدیریت وام و قرعه کشی مراجعه کنید',
                                success: true
                            });
                        })
                    }
                })
            }
        })
            }
*/
            
        
  countrequestLeasing(req, res){
    this.model.Request_Leasing.find().count(function (err, count) {
      if (err) throw err;
      if (count) {
        return res.json({
          count: count,
          success: true
        });
      }
      res.json({
        count: 0,
        success: false
      })
    })
  }

  requestLeasing(req, res) {
    req.checkBody('personalCode', 'وارد کردن فیلد کد پرسنلی الزامیست').notEmpty();
    req.checkBody('employee_id', 'وارد کردن فیلد آی دی کارمند الزامیست').notEmpty();
    if (this.showValidationErrors(req, res))
      return;
    this.model.Employee.findOne({personalCode: req.body.personalCode}, (err, Employee) => {
      if (err) throw err;
      if (Employee.LeasingStock === false) {
        return res.json({
          data: 'این تسهیلات به شما تعلق نمی گیرد برای ثبت درخواست خدمات لیزینگ باید حتما عضو صندوق لیزینگ فرهنگیان باشید',
          success: false
        });
      }

      else if (Employee.LeasingStock === true) {
            this.model.Request_Leasing.findOne({personalCode: req.body.personalCode}, (err, requestLeasing) => {
              if (err) throw err;
              if (requestLeasing) {
                return res.json({
                  data: 'درخواست تسهیلات لیزینگ شما قبلا ثبت شده است',
                  success: false
                });
              } else {
                this.model.Request_Leasing({
                  personalCode: req.body.personalCode,
                  employee_id: req.body.employee_id,
                }).save(err => {
                  if (err) {
                    throw err;
                  }
                  return res.json({
                    data: 'درخواست تسهیلات لیرینگ با موفقیت ثبت  شد نتیجه در خواست شما بعد از پایان مهلت ثبت درخواست متعاقبا اعلام خواهد شد',
                    success: true
                  });
                })
              }
            })
      }
    })
  }

  showrequestLeasing(req, res) {
    req.checkBody('personalCode', 'وارد کردن فیلد کد پرسنلی الزامیست').notEmpty();
    this.model.Request_Leasing.findOne({personalCode: req.body.personalCode}).exec((err, Leasingrequest) => {
      if (err) throw err;
      if (Leasingrequest) {
        res.json({
          data: 'درخواست تسهیلات و خدمات لیزینگ شما با موفقیت ثبت شده است نتیجه درخواست بعد از اتمام زمان ثبت درخواست متعاقبا اعلام خواهد شد.',
          success: true
        })
      } else {
        res.json({
          data: 'درخواستی وجود ندارد',
          success: false
        })
      }
    });
  }

    update(req, res) {
		console.log(req.body);
        req.checkParams('id', 'ای دی وارد شده صحیح نیست').isMongoId();
        if (this.showValidationErrors(req, res))
            return;
        this.model.Request.findByIdAndUpdate(req.params.id, {
            personalCode: req.body.personalCode,
            loanID: req.body.loanID,
        }, (err, Request) => {
            if (err) throw err;
            if (Request) {
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
        this.model.Request.findByIdAndRemove(req.params.id, (err, Request) => {
            if (err) throw err;
            if (Request) {
                return res.json({
                    data: ' با موفقیت حذف شد',
                    success: true
                });
            }
            res.status(404).json({
                data: 'وجود ندارد',
                success: false
            });
        });
    }
}
