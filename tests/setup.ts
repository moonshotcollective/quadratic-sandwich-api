import "mongoose"; 
import mongoose from "mongoose";
import { before } from "mocha";

const dbconnect = () => {
    mongoose.connect(process.env.MONGO_URI ? process.env.MONGO_URI : ''); 
    return mongoose.connection;
}
let setup = () => {
    before((done)=>{              // runs before the first test case
           // connection to the data base
           dbconnect()
                .once('open', ()=>done())
                .on('error',(error) => done(error))
    })
    beforeEach((done)=>{          // runs before each test case
        const collectionName = 'citizens';
        mongoose.connection.db.listCollections({name: "citizens"})
            .next((error,collection)=>{                 //deleting the collection before each
                if(collection){                         //test case to avoid duplicated key error
                    mongoose.connection.db.dropCollection('citizens')    
                    .then(() => done())                                       
                    .catch((err) => done(err))
                }
                else{
                    done(error)
                }
            })
    })

    after((done)=>{                       // runs after the last test case
        mongoose.disconnect()
                .then(()=>done())
                .catch((err)=>done(err))
    })
}