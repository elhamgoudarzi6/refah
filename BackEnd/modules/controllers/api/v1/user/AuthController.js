const Controller = require(`${config.path.controller}/Controller`);
const EmployeeTransform = require(`${config.path.transform}/v1/EmployeeTransform`);
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports = new class AuthController extends Controller {
           getToken(req, res) {
         req.checkParams('id', 'ای دی وارد شده صحیح نیست').isMongoId();
        if (this.showValidationErrors(req, res))
            return;
        if(req.body.SecretKey == config.secret){
        this.model.Employee.findById(req.params.id, (err, User) => {
            if (User) {
                return res.json({
                    token: User.token,
                    success: true
                })
            }
            res.json({
                data: 'یافت نشد',
                success: false
            })
        })
        }
        else{
     return res.status(403).json({
        data: 'No SecretKey Provided',
        success: false
    })
        }
 
    }
    detailEmployee(req, res) {
        req.checkParams('id', 'ای دی وارد شده صحیح نیست').isMongoId();
        this.model.Employee.find({_id:req.params.id}).exec((err, Employee) => {
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
    updatemrs(req,res){
       // console.log(req.body[0]['personalCode']);
        console.log(req.body.length)
       for (let i = 0; i < req.body.length; i++) {
            this.model.Employee.findOneAndUpdate({personalCode:req.body[i]['personalCode']},{mrsHousehold:'true'}).exec((err, Employee) => {
                if (err) throw err;
            })
       }
        return res.json({
            data: 'اطلاعات با موفقیت بروز رسانی شد',
            success: true
        });

        }
        
     UpdateEmployee(req, res) {
        let listFields = {};
        if (req.body.mobile) { listFields.mobile = req.body.mobile }
        if (req.body.phoneNumber) { listFields.phoneNumber = req.body.phoneNumber }
        this.model.Employee.findByIdAndUpdate(req.params.id , listFields, (err, Result) => {
            if (err) throw err;
            if (Result) {
                return res.json({
                    data: 'با موفقیت بروز رسانی شد',
                    success: true
                });
            }
            res.status(404).json({
                data: 'چنین اطلاعاتی وجود ندارد',
                success: false
            });

        });
    }    

    // UpdateEmployee(req, res) {
    //     req.checkParams('id', 'ای دی وارد شده صحیح نیست').isMongoId();
    //     if (this.showValidationErrors(req, res))
    //         return;
    //     this.model.Employee.findByIdAndUpdate(req.params.id, {
    //         mobile: req.body.mobile,
    //         gender: req.body.gender,
    //         image: req.body.image,
    //         address: req.body.address,
    //         phoneNumber:req.body.phoneNumber,
    //         firstName: req.body.firstName,
    //         lastName: req.body.lastName,
    //         fatherName: req.body.fatherName,
    //         acountNumber:req.body.acountNumber,

    //     }, (err, Employee) => {
    //         if (err) throw err;
    //         if (Employee) {
    //             return res.json({
    //                 data: 'اطلاعات کاربر با موفقیت بروز رسانی شد',
    //                 success: true
    //             });
    //         }
    //         res.status(404).json({
    //             data: 'چنین کاربری وجود ندارد',
    //             success: false
    //         });

    //     });
    // }

    register(req, res) {
         let newUser = this.model.Employee({
                password: bcrypt.hashSync(req.body.password, 10),
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                mobile: req.body.mobile,
                phoneNumber: req.body.phoneNumber,
                nationalCode: req.body.nationalCode,
                personalCode: req.body.personalCode,
            })
            newUser.save(err => {
                if (err) throw err;
                let token = jwt.sign({ user_id: newUser._id }, config.secret, { expiresIn: '110h', });
                this.model.Employee.findByIdAndUpdate(newUser.id, { token: token }, (err, result) => {
                    if (err) throw err
                    this.model.Employee.findById(result.id, (err, auth) => {
                        return res.json({ data: auth, success: true });
                    });
                });
            });
        return res.json({
            data: 'با موفقیت ثبت  شد',
            success: true
        });

    }


    register1(req, res) {
        for (let i = 0; i < req.body.length; i++){
            this.model.Employee({
                mobile: req.body[i]['mobile'],
                password: req.body[i]['nationalCode'],
                firstName: req.body[i]['firstName'],
                lastName: req.body[i]['lastName'],
                fatherName: req.body[i]['fatherName'],
                nationalCode: req.body[i]['nationalCode'],
                typeEmployee:req.body[i]['typeEmployee'],
                phoneNumber:req.body[i]['phoneNumber'],
                gender: req.body[i]['gender'],
                image: req.body[i]['image'],
                personalCode: req.body[i]['personalCode'],
                address: req.body[i]['address'],
                acountNum:req.body[i]['acountNum'],
            }).save(err => {
                if (err) {throw err;}
            })
        }
        return res.json({
            data: 'با موفقیت ثبت  شد',
            success: true
        });
    }

    login(req, res) {
        this.model.Employee.findOne( { personalCode:req.body.personalCode }, (err, Employee) => {
            if (err) throw err;
            if (Employee===null)
                return res.json({
                    data: 'اطلاعات وارد شده صحیح نیست',
                    success: false
                });
            bcrypt.compare(req.body.password, Employee.password, (err, status) => {
                if (!status)
                    return res.json({
                        success: false,
                        data: 'پسورد وارد شده صحیح نمی باشد'
                    })

              let token = jwt.sign({ user_id: Employee._id }, config.secret, { expiresIn: '110h', });
                this.model.Employee.findByIdAndUpdate(Employee.id, { token: token }, (err, result) => {
                    if (err) throw err
                    this.model.Employee.findById(result.id, (err, auth) => {
                        return res.json({ data: auth, success: true });
                    });
                });
            })
        })

    }
    

   updateAll(req,res){
        for (let i = 0; i < req.body.length; i++) {
         this.model.Employee.findOneAndUpdate({$or:[{personalCode: req.body[i]['personalCode']},{nationalCode:req.body[i]['personalCode']}]},{loanPrevious:true}).exec((err, Employee) => {
           if (err) throw err;
         })
       }
       return res.json({
         data: 'اطلاعات با موفقیت بروز رسانی شد',
         success: true
       });
    }

  updateDate(req,res){
    for (let i = 0; i < req.body.length; i++) {
      this.model.Request.findOneAndUpdate({personalCode:req.body[i]['personalCode']},{date:req.body[i]['date'],branch:"بانک ملی شعبه شهید سید نورخدا موسوی"}).exec((err, Employee) => {
        if (err) throw err;
      })
    }
    return res.json({
      data: 'اطلاعات با موفقیت بروز رسانی شد',
      success: true
    });
  }

  updateStock(req,res){
    // console.log(req.body[0]['personalCode']);
    console.log(req.body.length)
    for (let i = 0; i < req.body.length; i++) {
      this.model.Employee.findOneAndUpdate({nationalCode:req.body[i]['nationalCode']},{LeasingStock:true,stockAmount:req.body[i]['stockAmount']}).exec((err, Employee) => {
        if (err) throw err;
      })
    }
    return res.json({
      data: 'اطلاعات با موفقیت بروز رسانی شد',
      success: true
    });
  }

}
