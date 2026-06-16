const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

let totalOrders = 0;

/* Customer Order */
app.post("/order",(req,res)=>{

  totalOrders++;

  res.json({
    message:"Order Added"
  });

});

/* Admin Total Orders */
app.get("/total-orders",(req,res)=>{

  res.json({
    totalOrders
  });

});

app.listen(3000,()=>{

  console.log("Server Running");

});