import app from './src/app.js';
import connectDB from './src/config/db.js';
import { logger } from './src/loggers/logger.js';
import dotenv from "dotenv"
dotenv.config()
const PORT = process.env.PORT || 3000;
connectDB().then(() => {
  app.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}`);
  });

}).catch((e)=>{
  logger.error(e?.message || "Something went wrong while starting the server")
})