const { default: mongoose } = require("mongoose")

module.exports = {
    connect: async function(){
      try {
        //connecting to databse using mongoose package
        await mongoose.connect(process.env.MONGOOSE_CONNECTION_STRING)
        console.log("db connected");
      } catch (error) {
        console.log(error)
      }
    }
}