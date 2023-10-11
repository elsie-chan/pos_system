import multer from "multer";

const configUpload = (nameFolder) => {
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, './src/uploads/' + nameFolder)
        },
        filename: function (req, file, cb) {
            cb(null, Date.now().toString() + '.' + file.originalname.split('.')[1]);
        }
    })

    const upload = multer({
        storage: storage,
        limit: {fileSize: 1000000000},
        fileFilter: function (req, file, cb) {
            cb(null, true);
        }
    })


    return upload;
}

export default configUpload;