const multer  = require('multer')
const mkdirp  = require('mkdirp');
const randomstring  = require('randomstring');
const ImageStorage = multer.diskStorage({
    destination : (req , file , cb) => {
        let year = new Date().getFullYear();
        let month = new Date().getMonth() + 1;
        let day = new Date().getDay();
       // let dir = `./public/uploads/images/${year}/${month}/${day}`;
        let dir = `./public/uploads/images`;
        mkdirp(dir , err => cb(err , dir))

    },
    filename: (req , file , cb) => {
        cb(null, randomstring.generate({charset:'abacus',length:7}) +  '-' + file.originalname )
    }
});
const util = require("util");
const imageFilter = (req , file , cb) => {
    if(file.mimetype === "image/png" || file.mimetype === "image/jpeg" ||file.mimetype === "image/jpg" || file.mimetype === "image/gif" || file.mimetype==="application/octet-stream") {
        cb(null , true)
    } else {
        cb(null , false)
    }
}

const uploadImage = multer({
    storage : ImageStorage,
    limits : {
        fileSize : 1024 * 1024 * 5
    },
    fileFilter : imageFilter
});


///////video
const VideoStorage = multer.diskStorage({
    destination : (req , file , cb) => {
        let dir = `./public/uploads/videos`;
        mkdirp(dir , err => cb(err , dir))
    },
    filename: (req , file , cb) => {
        cb(null, randomstring.generate({charset:'daspaz',length:7}) +  '-' + file.originalname )
    }
});

const videoFilter = (req , file , cb) => {
    if(file.mimetype === "video/mp4" || file.mimetype === "video/ogg") {
        cb(null , true)
    } else {
        cb(null , false)
    }
}

const uploadVideo = multer({
    storage : VideoStorage,
    limits : {
        fileSize : 1024 * 1024 * 10
    },
    fileFilter : videoFilter
});
var storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, path.join(`${__dirname}/public`));
    },
    filename: (req, file, callback) => {
        const match = ["image/png", "image/jpeg"];

        if (match.indexOf(file.mimetype) === -1) {
            var message = `${file.originalname} is invalid. Only accept png/jpeg.`;
            return callback(message, null);
        }

        var filename = `${Date.now()}-bezkoder-${file.originalname}`;
        callback(null, filename);
    }
});

var uploadFiles = multer({ storage: ImageStorage }).array("files", 5);
var uploadFilesMiddleware = util.promisify(uploadFiles);
module.exports = {
    uploadImage ,uploadVideo,uploadFiles
}
