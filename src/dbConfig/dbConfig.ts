import mongoose from "mongoose";

export default async function connect(){
    try {
         mongoose.connect(process.env.MONGO_URL!);
         const connection = mongoose.connection;
         connection.on("connected",() => {
            console.log("mongoDB connected");
         })

         connection.on("error",(err) => {
            console.log("please make sure db is up :" + err);
            process.exit();
         })

    } catch (error) {
        console.log("something is wrong while connecting to db");
        console.log(error);
    }
}