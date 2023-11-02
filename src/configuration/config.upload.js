import multer from "multer";

const configUpload = (nameFolder) => {
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, './src/public/images/uploads/' + nameFolder)
        },
        filename: function (req, file, cb) {
            cb(null, Date.now().toString() + '.' + file.originalname.split('.')[1]);
        }
    })

    const upload = multer({
        storage: storage,
        limit: {fileSize: 1024 * 1024 * 1024 * 5},
        fileFilter: function (req, file, cb) {
            console.log(file.mimetype)
            if (file.mimetype === "image/png" || file.mimetype === "image/jpg" || file.mimetype === "image/jpeg") {
                cb(null, true);
            } else {
                cb(null, false);
                const err = new Error();
                err.name = "ExtensionError";
                err.message = "Only .png, .jpg, jpeg format allowed";
                return cb(err);
            }
        }
    })


    return upload;
}

export default configUpload;