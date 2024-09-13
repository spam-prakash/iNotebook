require('dotenv').config();
const mongoose=require('mongoose')
const mongoURI=process.env.MONGOURI
// console.log(mongoURI)

const connectToMongo = async () => {
    try {
        await mongoose.connect(mongoURI);
        console.log("Connected to Mongoose Successfully");
    } catch (error) {
        console.error("Failed to connect to Mongoose:", error);
    }
};

// mongoose.connect(mongoURI).then(()=>{
//     console.log("Connected")
// }).catch((err)=>{console.log("Error Occured ",err)})

module.exports=connectToMongo;