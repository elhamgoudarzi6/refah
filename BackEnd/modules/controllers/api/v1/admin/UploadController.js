const Controller = require(`${config.path.controller}/Controller`);
const imageToBase64 = require('image-to-base64');
module.exports = new class UploadController extends Controller {
    convertBit=() => {
        imageToBase64() // you can also to use url
            .then(
                (response) => {
                    console.log(response)
                    return response
                }
            )
            .catch(
                (error) => {
                    console.log(error); //Exepection error....
                }
            )
    }


    uploadImage(req, res) {
        if(req.file) {
            let url=`${config.host}${config.port}/` + req.file.path.replace(/\\/g , '/');
            res.json({
                message : 'تصویر با موفقیت آپلود شد',
               imagePath : `${config.host}${config.port}/` + req.file.path.replace(/\\/g , '/'),
                data :req.file,
                success : true,
            })
        } else {
            res.json({
                message : 'تصویر آپلود نشد',
                success : false
            })
        }
    }

    uploadVideo(req, res) {
        if(req.file) {
            res.json({
                message : 'ویدیو با موفقیت آپلود شد',
                videoPath : `${config.host}${config.port}/` + req.file.path.replace(/\\/g , '/'),
                data :req.file,
                success : true,
            })
        } else {
            res.json({
                message : 'ویدیو آپلود نشد',
                success : false
            })
        }
    }
}