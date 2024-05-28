const multer = require('multer');
const path = require('path');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        let destinationFolder;
        if (file.fieldname === 'profileImage') {
            destinationFolder = path.join(__dirname, '../public/profiles');
        } 
        else if (file.fieldname === 'documents') {
            destinationFolder = path.join(__dirname, '../public/documents');
        } else if (file.fieldname ==='thumbnail'){
            destinationFolder = path.join(__dirname, '../public/products');
        }
        cb(null, destinationFolder);
    },
    filename: function (req, file, cb) {
        let fileName = file.originalname;
        let userId = req.params.uid;
        const timestamp = Date.now();
        if (file.fieldname === 'profileImage') {
            fileName = `${userId}_imgperfil_${timestamp}_${fileName}`;
        } else if (file.fieldname === 'documents') {
            fileName = `${userId}_doc_${timestamp}_${fileName}`;
        }
        else if (file.fieldname === 'thumbnail') {
            fileName = `imgproduct_${timestamp}_${fileName}`;
        }
        cb(null, fileName);
    }
});
const upload = multer({ storage: storage });
module.exports = upload;

