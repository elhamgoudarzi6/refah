const Controller = require(`${config.path.controller}/Controller`);
objectId = require('mongoose').Types.ObjectId;

module.exports = new class LoanController extends Controller {

	 updateBranch(req,res){
        for (let i = 0; i < req.body.length; i++) {
            this.model.Request.findOneAndUpdate({personalCode:req.body[i]['personalCode']},{branch:req.body[i]['branch']}).exec((err, Request) => {
                if (err) throw err;
            })
        }
        return res.json({
            data: 'اطلاعات با موفقیت بروز رسانی شد',
            success: true
        });
    }
	 updateDateBank(req,res){
        for (let i = 0; i < req.body.length; i++) {
            this.model.Request.findOneAndUpdate({personalCode:req.body[i]['personalCode']},{date:req.body[i]['date']}).exec((err, Request) => {
                if (err) throw err;
            })
        }
        return res.json({
            data: 'اطلاعات با موفقیت بروز رسانی شد',
            success: true
        });
    }

	listRequestMrs(req,res){
        this.model.Employee.aggregate(
            [
                {
                    "$project" : {
                        "_id" : "_id",
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
                    "$match" : {
                        "employees.mrsHousehold" : true,
                        "requests.loanID" :objectId('5f0f010dbb476710f4d29f3b')
                    }
                }
            ]

        ).exec((err, xx) => {
            if (err) throw err;
            if (xx) {
                return res.json({
                    data: xx,
                    success: true
                });
            }
            res.json({
                data: 'اطلاعاتی وجود ندارد',
                success: false
            })
        })
    }

	listWinMrs(req,res){
        this.model.Employee.aggregate(
            [
                {
                    "$project" : {
                        "_id" : "_id",
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
                    "$match" : {
                        "employees.mrsHousehold" : true,
                        "requests.result" : true,
                        "requests.loanID" :objectId('5f0f010dbb476710f4d29f3b')
                    }
                }
            ]

        ).exec((err, xx) => {
            if (err) throw err;
            if (xx) {
                return res.json({
                    data: xx,
                    success: true
                });
            }
            res.json({
                data: 'اطلاعاتی وجود ندارد',
                success: false
            })
        })
    }

	listWinByLoanID(req,res){
    this.model.Employee.aggregate(
        [
            {
                "$project" : {
                    "_id" : "_id",
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
                "$match" : {
                    "requests.result" : true,
                    "requests.loanID" :objectId(req.body.loanID)
                }
            }
        ]

    ).exec((err, xx) => {
        if (err) throw err;
        if (xx) {
            return res.json({
                data: xx,
                success: true
            });
        }
             res.json({
                data: 'اطلاعاتی وجود ندارد',
                success: false
            })
    })
}



	listWin(req,res){
    this.model.Employee.aggregate(
        [
            {
                "$project" : {
                    "_id" : "_id",
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
                "$match" : {
                    "requests.result" : true,
                    "requests.loanID" :objectId(req.params.id)
                }
            }
        ]

    ).exec((err, xx) => {
        if (err) throw err;
        if (xx) {
            return res.json({
                data: xx,
                success: true
            });
        }
             res.json({
                data: 'اطلاعاتی وجود ندارد',
                success: false
            })
    })
}

	RandomWin(req,res){
        this.model.Request.findRandom({loanID:req.body.loanID,result:false}, {}, {limit: req.body.number}, function(err, results) {
            if (err) throw err;
            if (results) {
            // let add=[{personalCode:"10025651"},{personalCode:"38452511"},{personalCode:"38096854"},{personalCode:"38425698"},
            //     {personalCode:"38112361"},{personalCode:"94982514"},{personalCode:"38454231"},{personalCode:"39254751"},
            //     {personalCode:"10025361"},{personalCode:"38074147"},{personalCode:"94002565"},{personalCode:"38036225"},
            //     {personalCode:"95626532"},{personalCode:"38474421"},{personalCode:"38025652"}];
            //     let add=[{personalCode:"88608860"}];
            //     let win = [...results, ...add];
				 res.json({
                    data:results,
                    success: true
                })
            }
        });
    }

	   setFinalWin(req, res) {
	        this.model.Lottery.findOne({}, (err, Lottery) => {
                    if (err) throw err;
                   if (Lottery._doc.lock === true) {
                   return res.json({
                          data: 'امکان قرعه کشی مجدد نمی باشد یکبار انجام داده اید',
                          success: false
                                });
                            }
        else{
        for (let i = 0; i < req.body.length; i++) {
            this.model.Request.findOneAndUpdate({personalCode: req.body[i]['personalCode']},
                {result: true,}, (err, Request) => {
                    if (err) throw err;
                    if (Request) {
                      // console.log(i)
                    }
                });
        }
        this.model.Lottery.findByIdAndUpdate("60ed45f94284a07676609096", {
            lock:true
        }, (err, Lottery) => {
            if (err) throw err;
            if (Lottery) {
              return res.json({
              data: 'نتایج قرعه کشی با موفقیت ثبت نهایی و قفل شد',
              success: true
              });
            }
        });
     
        }
	        })
}

    index(req, res) {
        req.checkParams('id', 'ای دی وارد شده صحیح نیست').isMongoId();
        this.model.Request.find().exec((err, Request) => {
            if (err) throw err;
            if (Request) {
                return res.json({
                    data: Request,
                    success: true
                });
            }
            res.json({
                data: 'اطلاعاتی وجود ندارد',
                success: false
            })
        });
    }
    
    
    index2(req, res) {
       this.model.Employee.aggregate(
               [
        {
            "$project" : {
         
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
                "employees.acountNum" : "$employees.acountNum",
                "employees.phoneNumber" : "$employees.phoneNumber",
                "employees.nationalCode" : "$employees.nationalCode",
                "loans.title" : "$loans.title",
                "requests.loanID" : "$requests.loanID",
                "requests.personalCode" : "$requests.personalCode",
                "requests.result" : "$requests.result",
              
            }
        }
    ],
    {
        "allowDiskUse" : true
    }
).exec((err, xx) => {
        if (err) throw err;
        if (xx) {
            return res.json({
                data: xx,
                success: true
            });
        }
             res.json({
                data: 'اطلاعاتی وجود ندارد',
                success: false
            })
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
                this.model.Loan.findOne(Request.loanID, (err, Loan) => {
                    if (err) throw err;
                    if (Loan) {
                        return res.json({
                            data: Loan,
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

        store(req, res) {
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
                            data: 'شما قبلا تسهیلات مرابحه گرفته اید در حال حاضر امکان درخواست تسهیلات مرابحه جدید را ندارید',
                            success: false
                        });
                    }
                    else {
                        this.model.Request.findOne({personalCode: req.body.personalCode}, (err, Request) => {
                            if (err) throw err;
                            if (Request) {
                                return res.json({
                                    data: 'شما قبلا درخواست تسهیلات داده اید فقط امکان ثبت درخواست برای یک تسهیلات وجود دارد در صورتی که می خواهید نوع تسهیلات دیگری درخواست کنید ابتدا باید درخواست قبلی را حذف نمایید',
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
                                        data: 'درخواست تسهیلات با موفقیت ثبت  شد نتیجه در خواست شما پس از پایان مهلت درخواست و انجام قرعه کشی اعلام خواهد شد',
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
                            data: 'شما قبلا درخواست تسهیلات داده اید فقط امکان ثبت درخواست برای یک تسهیلات وجود دارد در صورتی که می خواهید نوع تسهیلات دیگری درخواست کنید ابتدا باید درخواست قبلی را حذف نمایید',
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
                                data: 'درخواست تسهیلات با موفقیت ثبت  شد نتیجه در خواست شما پس از پایان مهلت درخواست و انجام قرعه کشی اعلام خواهد شد',
                                success: true
                            });
                        })
                    }
                })
            }
        })
            }


    update(req, res) {
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
        this.model.Request.findOneAndRemove(req.params.id, (err, Request) => {
            if (err) throw err;
            if (Request) {
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
 test(req,res){

  this.model.Employee.aggregate(
    [
        {
            "$project" : {
                "_id" : NumberInt(0),
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
                "employees.acountNum" : "$employees.acountNum",
                "employees.phoneNumber" : "$employees.phoneNumber",
                "employees.nationalCode" : "$employees.nationalCode",
                "loans.title" : "$loans.title",
                "requests.loanID" : "$requests.loanID",
                "requests.personalCode" : "$requests.personalCode",
                "requests.result" : "$requests.result",
                "_id" : NumberInt(0)
            }
        }
    ],
    {
        "allowDiskUse" : true
    }
)
.exec((err,result)=>{
	 if (err) throw err;
            if (result) {
				 return res.json({
                    data:result ,
                    success: true
                });
			}
})
 }

  //leasing

  listWinrequestLeasing(req, res) {
    this.model.Employee.aggregate(
      [
        {
          "$project" : {
            "_id" : "_id",
            "employees" : "$$ROOT"
          }
        },
        {
          "$lookup" : {
            "localField" : "employees.personalCode",
            "from" : "request_leasings",
            "foreignField" : "personalCode",
            "as" : "request_leasings"
          }
        },
        {
          "$unwind" : {
            "path" : "$request_leasings",
            "preserveNullAndEmptyArrays" : false
          }
        },
        {
          "$project" : {
            "employees.firstName" : "$employees.firstName",
            "employees.lastName" : "$employees.lastName",
            "employees.nationalCode" : "$employees.nationalCode",
            "employees.stockAmount" : "$employees.stockAmount",
            "employees.personalCode" : "$request_leasings.personalCode",
            "employees.result" : "$request_leasings.result",
            "_id" : "_id"
          }
        },
        {
          "$match" : {
            "employees.result" :true,
          }
        },
        { $sort : { "employees.stockAmount" :-1 } }
      ]).exec((err, xx) => {
      if (err) throw err;
      if (xx.length>=1) {
        return res.json({
          data: xx,
          success: true
        });
      }
      res.json({
        data: 'اطلاعاتی وجود ندارد',
        success: false
      })
    })

  }

  showAllRequestLeasing(req, res) {
    this.model.Employee.aggregate(
      [
        {
          "$project" : {
            "_id" : "_id",
            "employees" : "$$ROOT"
          }
        },
        {
          "$lookup" : {
            "localField" : "employees.personalCode",
            "from" : "request_leasings",
            "foreignField" : "personalCode",
            "as" : "request_leasings"
          }
        },
        {
          "$unwind" : {
            "path" : "$request_leasings",
            "preserveNullAndEmptyArrays" : false
          }
        },
        {
          "$project" : {
            "employees.firstName" : "$employees.firstName",
            "employees.lastName" : "$employees.lastName",
            "employees.nationalCode" : "$employees.nationalCode",
            "employees.stockAmount" : "$employees.stockAmount",
            "employees.personalCode" : "$request_leasings.personalCode",
            "employees.result" : "$request_leasings.result",
            "_id" : "_id"
          }
        },
        { $sort : { "employees.stockAmount" :-1 } }
      ]).exec((err, xx) => {
      if (err) throw err;
      if (xx.length>=1) {
        return res.json({
          data: xx,
          success: true
        });
      }
      res.json({
        data: 'اطلاعاتی وجود ندارد',
        success: false
      })
    })
  }

  countRequestLeasing(req, res){
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

}
