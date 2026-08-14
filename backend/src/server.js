import app from "./app.js";
import connectDB from "./config/db.js";

const PORT = 3000;

const startServer = async () => {
    await connectDB();
    app.listen(PORT, () => {
        console.log(`Server is running on PORT ${PORT}`)
    })
}

startServer();
