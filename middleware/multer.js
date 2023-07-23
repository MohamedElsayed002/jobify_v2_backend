
import multer from "multer";

const storage = multer.diskStorage({
    destination : (req,file,cb) => {
        cb(null, 'public/upload')
    },
    filename : (req,file,cb) => {
        const fileName = file.originalname
        cb(null , fileName)
    }
})

const upload = multer({storage})


export const formatImage = (file) => {
    const fileExtension = path.extname(file.originalname).toString();
    return parser.format(fileExtension, file.buffer).content;
  };

export default upload