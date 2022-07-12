import * as dotenv from 'dotenv';
const env = dotenv.config();
if (env.error) {
    dotenv.config({ path: '.env' });
}
import ContractEventService from './src/api/v1/services/contractEvents.service';
import MongoConnection from './src/api/v1/config/db.config';

import app from './src/api/v1/app';

const host = process.env.HOST || 'localhost';
const port = process.env.PORT || '62562';
let dbConn: MongoConnection;
app.listen(port, () => {
    console.log({
        level: 'info',
        message: `🌏 Express server started on http://${host}:${port}`,
    });

    // Establish the Contract Services
    new ContractEventService();

    // Establish the DB connection
    dbConn = new MongoConnection(
        process.env.MONGO_URI ? process.env.MONGO_URI : '', // FIXME: Add fallback URI
    );
    dbConn.connect(() => {});
}).on('error', (err: any): void => {
    if (err.code === 'EADDRINUSE') {
        console.log({
            level: 'error',
            message: 'Server startup error: address already in use',
            error: err,
        });
    } else {
        console.log(err);
    }
});

// Close the Mongoose connection, when receiving SIGINT
process.on('SIGINT', (): void => {
    console.info('\nGracefully shutting down');
    dbConn.close((err: any) => {
        if (err) {
            console.log({
                level: 'error',
                message: 'Error shutting closing mongo connection',
                error: err,
            });
        }
        process.exit(0);
    });
});
// // Establish the image storage engine
// const storage = new GridFsStorage({
//     url: process.env.MONGO_URI ? process.env.MONGO_URI : '',
//     file: (req, file) => {
//         return new Promise((resolve, reject) => {
//             randomBytes(16, (err, buf) => {
//                 if (err) {
//                     return reject(err);
//                 }
//                 const filename = `${buf.toString('hex')}${path.extname(
//                     file.originalname,
//                 )}`;
//                 const fileinfo = {
//                     filename: filename,
//                     bucketName: 'imageUploads',
//                 };
//                 resolve(fileinfo);
//             });
//         });
//     },
// });
// const upload = multer({ storage });
