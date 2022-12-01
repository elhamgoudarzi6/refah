const Controller = require(`${config.path.controller}/Controller`);
const AdminTransform = require(`${config.path.transform}/v1/AdminTransform`);
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports = new class AuthController extends Controller {
     getToken(req, res) {
        req.checkParams('id', 'ای دی وارد شده صحیح نیست').isMongoId();
        if (this.showValidationErrors(req, res))
            return;
        if(req.body.SecretKey == config.secret){
        this.model.Admin.findById(req.params.id, (err, Admin) => {
            if (Admin) {
                return res.json({
                    token: Admin.token,
                    success: true
                })
            }
            res.json({
                data: 'یافت نشد',
                success: false }) 
            
        })
        }
        else{
            res.json({
                data: 'SecretKey not found',
                success: false
            })
        }
    }
    index(req, res) {
        this.model.Admin.find().exec((err, result) => {
            if (err) throw err;
            if (result) {
                return res.json({
                    data: result,
                    success: true
                });
            }
            res.json({
                data: 'اطلاعاتی وجود ندارد',
                success: false
            })
        });
    }
register(req, res) {
        req.checkBody('username', 'وارد کردن فیلد نام کاربری الزامیست').notEmpty();
        req.checkBody('password', 'وارد کردن فیلد رمز عبور الزامیست').notEmpty();
        if (this.showValidationErrors(req, res))
            return;
        this.model.Admin.findOne({username: req.body.username}, (err, Admin) => {
            if (err) throw err;
            if (Admin) {
                return res.json({
                    data: 'این نام کاربری قبلا ثبت شده است',
                    success: false
                });
            } else {
            let newUser = new this.model.Admin({ 
                    username: req.body.username,
                    password: req.body.password,
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    image: req.body.image,                
            });
            newUser.save(err => {
                if (err) throw err;
                let token = jwt.sign({ user_id: newUser._id }, config.secret, { expiresIn: '110h', });
                this.model.Admin.findByIdAndUpdate(newUser.id, { token: token }, (err, result) => {
                    if (err) throw err
                    this.model.Admin.findById(result.id,{ token: 1,type:1,image:1,firstName:1,lastName:1 }, (err, auth) => {
                        return res.json({ data: auth, success: true });
                    });
                });
            });
            
            }
        })
    }


    login(req , res) {
        req.checkBody('username' , 'وارد کردن فیلد نام کاربری الزامیست').notEmpty();
        req.checkBody('password' , 'وارد کردن فیلد پسورد الزامیست').notEmpty();
        if(this.showValidationErrors(req, res))
            return;
        this.model.Admin.findOne({ username : req.body.username } , (err , Admin) => {
                if(err) throw err;
            if(Admin == null)
                return res.json({
                    data : 'اطلاعات وارد شده صحیح نیست',
                    success : false
                });
            bcrypt.compare(req.body.password , Admin.password , (err , status) => {
                if(! status)
                    return res.json({
                        success : false,
                        data : 'پسورد وارد شده صحیح نمی باشد'
                    })
                 let token = jwt.sign({ user_id: Admin._id }, config.secret, { expiresIn: '110h', });
                this.model.Admin.findByIdAndUpdate(Admin.id, { token: token }, (err, result) => {
                    if (err) throw err
                    this.model.Admin.findById(result.id, (err, auth) => {
                        return res.json({ data: auth, success: true });
                    });
                });
            })
        })

    }

    updateAdmin(req, res) {
        req.checkParams('id', 'ای دی وارد شده صحیح نیست').isMongoId();
        if (this.showValidationErrors(req, res))
            return;
        this.model.Admin.findByIdAndUpdate(req.params.id, {
            username: req.body.username,
            password: bcrypt.hashSync(req.body.password, 10),
            adminName: req.body.adminName,
            image: req.body.image,
        }, (err, Admin) => {
            if (err) throw err;
            if (Admin) {
                return res.json({
                    data: ' اطلاعات ادمین با موفقیت آپدیت شد',
                    success: true
                });
            }
            res.status(404).json({
                data: 'چنین ادمینی وجود ندارد',
                success: false
            });
        });
    }

}
