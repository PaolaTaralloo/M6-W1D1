//Import necessari 
import {v2 as cloudinary} from 'cloudinary'
import "dot.env/config.js" //importo dotenv per utilizzare le variabili d'ambiente
import multer from 'multer'
import {CloudinaryStorage} from 'multer-storage-cloudinary'


//Configurazione di Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, //nome del cloud
    api_key: process.env.CLOUDINARY_API_KEY, //chiave api
    api_secret: process.env.CLOUDINARY_API_SECRET //segreto api
})


//Middleware di filtro per accettare solo file di tipo immagine
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg'|| file.mimetype === 'image/jpeg') {//controllo se il file è un'immagine
        cb(null, true) //se è un'immagine lo accetto
    } else {
        cb(null, false) //se non è un'immagine lo rifiuto
        return cb(new Error('Only .png, .jpg and .jpeg format allowed!')) //restituisco un errore
    }
}


//Utilizzo di Multer con Cloudinary
const authorStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'avatars', // Cartella in cui verranno salvate le immagini
       public_id: (req, file) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9) // Genera un suffisso unico per evitare conflitti di nomi
            return uniqueSuffix + '-' + file.originalname // Restituisce il suffisso unico
        },
    }
})

const postStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'covers', // Cartella in cui verranno salvate le immagini
       public_id: (req, file) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9) // Genera un suffisso unico per evitare conflitti di nomi
            return uniqueSuffix + '-' + file.originalname // Restituisce il suffisso unico
        },
    }
})

const uploadAuthors = multer({ storage: authorStorage, fileFilter: fileFilter }) //creo un'istanza di multer con la configurazione di storage
const uploadPosts = multer({ storage: postStorage, fileFilter: fileFilter }) //creo un'istanza di multer con la configurazione di storage

export const uploadAvatar = uploadAuthors.single('avatar') //creo un middleware per il caricamento dell'avatar
export const uploadCover = uploadPosts.single('cover') //creo un middleware per il caricamento della cover