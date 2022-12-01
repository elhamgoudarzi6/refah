const Transform = require('./../Transform');
const jwt = require('jsonwebtoken');
module.exports = class EmployeeTransform extends Transform {
    transform(item , createToken = false) {
        this.createToken = createToken;
        return {
            'id':item.id,
            'mobile' : item.mobile,
            'password' : item.password,
			'nationalCode':item.nationalCode,
			'personalCode':item.personalCode,
            'firstName':item.firstName,
            'lastName':item.lastName,
            'fatherName':item.fatherName,
            'gender':item.gender,
            'address':item.address,
            'acountNum':item.acountNum,
			'image':item.image,
           'phoneNumber':item.phoneNumber,
            'typeEmployee':item.typeEmployee,
            'loanPrevious':item.loanPrevious,
            'mrsHousehold':item.mrsHousehold,
            ...this.withToken(item)
        }
    }
    withToken(item) {
        if(item.token)
            return { token : item.token}
        if(this.createToken) {
            let token = jwt.sign({ user_id : item._id } , config.secret , {
                expiresIn :  '110h',
            });
            return { token }
        }
        return {};
    }
}
