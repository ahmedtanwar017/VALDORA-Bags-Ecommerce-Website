const dotenv = require("dotenv");
dotenv.config();   // <--- must be first

const express = require("express")
const app = express()

const cors = require("cors");
app.use(cors({
  origin: "http://localhost:3000", // React's port
  credentials: true
}));

const session = require("express-session");
app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, 
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    },
  })
);

const cookieParser = require("cookie-parser")
const path = require("path")
const db = require("./config/mongoose-connection.js")
const usersRouter = require("./routes/usersRouter.js")
const productsRouter = require("./routes/productsRouter.js")
const adminsRouter = require("./routes/adminsRouter")

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

app.use("/users", usersRouter)
app.use("/products", productsRouter)
app.use("/admins", adminsRouter)

app.get("/", (req, res) => {
    res.send("Working")
})

console.log("Loaded ADMIN_SECRET:", process.env.ADMIN_SECRET);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
});
