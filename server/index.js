import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotnev from "dotenv";
import multer from "multer"; 
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { createPost } from "./controllers/auth.js";
import postRoutes from "./routes/posts.js"
import userRoutes from "./routes/auth.js"
import { fileURLToPath } from "url";
import authRoutes from "./routes/users.js"
import { register } from "./controllers/auth.js";
import { verifyToken } from "./middleware/auth.js";

/* configuration */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotnev.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin"}));
app.use(morgan("common"));
app.use(bodyParser.json({ limit : "30mb", extended: true  }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended:true }));
app.use(cors());
app.use("/assets", express.static(path.join(__dirname, 'public/assets')));

/* file storage */

 const storage = multer.diskStorage({
    destination: function (req, file, cb){
        cb(null, "public/assets");

    },
    filename: function (req, file, cb){
        cb(null, file.originalname);
    }
 }); 
 const upload = multer({ storage });



 /*ROUTES WITH FILES */

 app.post("auth/register", upload.single("picture"), verifyToken,  register);
 app.post("/posts", verifyToken, upload.single("picture"), createPost );




/*routes*/
app.use("/auth" , authRoutes);
app.use("/users", userRoutes);
app.use("/posts", postRoutes);

 /* mongoose setup */
const PORT = process.env.PORT || 6001
mongoose.connect(process.env.MONGO_URL,{
}).then(() => {
    app.listen(PORT, () => console.log(`Server Port: ${PORT}`));

}).catch((error) => console.log(`${error} did not connect `));

