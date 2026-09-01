import app from "./app.js";
import connectDB from "./config/db.js";

const PORT = 3000;

const startServer = async () => {
    await connectDB();
    const server = app.listen(PORT, () => {
        console.log(`Server is running on PORT ${PORT}`)
    });

    server.timeout = 1200000;
}

startServer();
