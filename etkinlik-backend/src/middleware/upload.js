import multer from "multer";

// Sadece resim dosyalarına izin ver
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;

    const extName = allowedTypes.test(file.originalname.split(".").pop().toLowerCase());
    const mimeType = allowedTypes.test(file.mimetype);

    if (extName && mimeType) {
        cb(null, true);
    } else {
        cb(new Error("Sadece resim dosyaları yüklenebilir!"));
    }
};

const upload = multer({
    storage: multer.memoryStorage(),
    fileFilter
});

export default upload;