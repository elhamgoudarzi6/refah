const Controller = require(`${config.path.controller}/Controller`);
const bcrypt = require('bcrypt');
var mongoose = require('mongoose');
objectId = require('mongoose').Types.ObjectId;
  global.result=[];
module.exports = new class EmployeeController extends Controller {
	index(req, res) {
        this.model.Employee.find().exec((err, Employee) => {
            if (err) throw err;
            if (Employee) {
                return res.json({
                    data: Employee,
                    success: true
                });
            }
            res.json({
                data: 'اطلاعاتی وجود ندارد',
                success: false
            })
        });
    }
	
	
    allEmployeeok(req, res) {
        this.model.Employee.find({personalCode: req.body.personalCode}).populate('request').exec((err, Employee) => {
            if (err) throw err;
            if (Employee) {
                console.log(Employee[0]['request'][0]['loanID'])
                this.model.Loan.findOne({_id: Employee[0]['request'][0]['loanID']}).exec((err, Loan) => {
                    if (err) throw err;
                    if (Loan) {
                        return res.json({
                            data: Employee,
                            data_loan: Loan,
                            success: true
                        });
                    }
                })
            }
            // res.json({
            //     data: 'اطلاعاتی وجود ندارد',
            //     success: false
            // })
        });
    }


    allRequestEmployee1(req, res) {
       									//global.result=[];
										

        this.model.Request.find({}).exec((err, Request) => {
            if (err) throw err;
            if (Request) {
			
				//console.log(Request.length)
            
                     for (let i = 0; i < Request.length; i++) {
                    this.model.Employee.findOne({personalCode:Request[i]['personalCode']}).populate('request').exec((err, Employee) => {
                        if (err) throw err;
                        if (Employee) {
							
                            this.model.Loan.findOne({_id: Employee.request[0]['loanID']}).exec((err, Loan) => {
                                if (err) throw err;
                                if (Loan) {
                                    global.result.push({"Employee":Employee,"Loan": Loan})
									
                                }
                            })
                        }

                    });
                }
			
                res.json({
                    data: result,
                    success: true
                })
								

            }
    })

    }


    allRequestEmployee(req,res){
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
            "$project" : {
                "employees.firstName" : "$employees.firstName", 
                "employees.lastName" : "$employees.lastName", 
                "employees.acountNum" : "$employees.acountNum", 
                "employees.phoneNumber" : "$employees.phoneNumber", 
                "employees.nationalCode" : "$employees.nationalCode", 
				"employees.titleLoan" : "$loans.title", 
				"employees.personalCode" : "$requests.personalCode",  
				"employees.typeEmployee" : "$employees.typeEmployee",  
				"employees.mobile" : "$employees.mobile", 
               "employees.result" : "$requests.result",  
             
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
})
	}
	
	
	showMrsRequest(req,res) {
		
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
        })

    }
	
	
    store(req, res) {
 req.checkBody('personalCode', 'وارد کردن فیلد کد پرسنلی تسهیلات الزامیست').notEmpty();
        req.checkBody('nationalCode', 'وارد کردن فیلد کد ملی الزامیست').notEmpty();
        req.checkBody('firstName', 'وارد کردن فیلد نام الزامیست').notEmpty();
        req.checkBody('lastName', 'وارد کردن فیلد نام خانوادگی الزامیست').notEmpty();
        req.checkBody('typeEmployee', 'وارد کردن فیلد نوع استخدام الزامیست').notEmpty();
        this.model.Employee({
            password: req.body.nationalCode,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            fatherName: req.body.fatherName,
            nationalCode: req.body.nationalCode,
            typeEmployee:req.body.typeEmployee,
            personalCode: req.body.personalCode,
            acountNum:req.body.acountNum,
            gender: req.body.gender,
            image: req.body.image,
            address:req.body.address,
            phoneNumber:req.body.phoneNumber,
        }).save(err => {
            if (err) {throw err;}

        })
        return res.json({
            data: 'با موفقیت ثبت  شد',
            success: true
        });

    }


    update(req, res) {
        req.checkParams('id', 'ای دی وارد شده صحیح نیست').isMongoId();
        if (this.showValidationErrors(req, res))
            return;
        this.model.Employee.findByIdAndUpdate(req.params.id, {
            password: req.body.nationalCode,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            fatherName: req.body.fatherName,
            nationalCode: req.body.nationalCode,
            typeEmployee:req.body.typeEmployee,
            personalCode: req.body.personalCode,
            acountNum:req.body.acountNum,
            gender: req.body.gender,
            image: req.body.image,
            address:req.body.address,
            phoneNumber:req.body.phoneNumber,
        }, (err, Employee) => {
            if (err) throw err;
            if (Employee) {
                return res.json({
                    data: '  با موفقیت آپدیت شد',
                    success: true
                });
            }
            res.status(404).json({
                data: 'چنین کارمندی وجود ندارد',
                success: false
            });
        });
    }




}
