const cors = require("cors");


module.exports=(app)=>{
    app.use(
        cors({
          origin: "*",
          allowedHeaders: ["Content-Type", "x-auth-token"],
          methods: ["GET", "POST", "PUT", "DELETE"]
        })
      );
}