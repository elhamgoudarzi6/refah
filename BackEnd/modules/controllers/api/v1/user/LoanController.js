const Controller = require(`${config.path.controller}/Controller`);
 global.array=[];
 let x=
module.exports = new class LoanController extends Controller {

    index(req, res) {
			
        req.checkParams('id', 'ای دی وارد شده صحیح نیست').isMongoId();
        this.model.Loan.find().exec((err, Loan) => {
            if (err) throw err;
            if (Loan) {
				for(var i=0;i<Loan.length;i++){
					 global.array[i]=new Array();
				 this.model.Request.find({loanID:Loan[i]['_doc']._id}).count(function (err, count) {
					  if (err) throw err;
					
					if(count)
					 global.array.push({count: count});
					  })
				}
          
				
            return res.json({
                    data: Loan,
					count:global.array,
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
}