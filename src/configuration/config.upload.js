import multer from "multer";

const configUpload = () => {
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, './src/uploads/')
        },
        filename: function (req, file, cb) {
            cb(null, Date.now() + '-' + file.originalname)
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