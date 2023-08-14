const express = require('express');
const router = express.Router();
const User = require('../model/userSchema')
const cookieParser = require('cookie-parser')
const csvtojson=require("csvtojson");
//const csvFilePath=require("../expenses2.csv")
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const { exchangeRates } = require('exchange-rates-api');
const { convert } = require('exchange-rates-api');
const { MongoClient } =  require("mongodb");
const { isStringObject } = require('util/types');
//const uri = process.env.DB;
//const client = new MongoClient(uri);
let name;
var oxr = require('open-exchange-rates');
fx = require('money');



//Approach2 --- Multer 
var oxr = require('open-exchange-rates');
// oxr.set({ app_id: 'YOUR_APP_ID' })

// oxr.latest(function() {
// 	// Apply exchange rates and base rate to `fx` library object:
// 	fx.rates = oxr.rates;
// 	fx.base = oxr.base;
	
// 	// money.js is ready to use:
// 	 console.log(fx(100).from('USD').to('INR')); // ~8.0424
   
// });
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    

    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    cb(null,  `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    var ext = path.extname(file.originalname);

    if (ext !== ".csv") {
      return cb(new Error("Only csvs are allowed!"));
    }

    cb(null, true);
  },
});


async function Conversion(date, current, amt) {
            //console.log(current)
            //console.log(isStringObject(current))
             const myArray = date.split("-");
            const newdate = `${myArray[2]}-${myArray[1]}-${myArray[0]}`
           
             const inr = await convert(amt, current, 'INR', newdate);
             
           return inr
        }



router.route("/upload").post(upload.single("profile"), async (req, res) => {
    const jsonArray = await csvtojson().fromFile(req.file.path)
     name = req.file.originalname;
    console.log(jsonArray[0]);
    for (let i = 0; i < jsonArray.length; i++) {
      const usethis = jsonArray[i].Date.split("-")
      const newdate = `${usethis[2]}-${usethis[1]}-${usethis[0]}`
      jsonArray[i].Date = newdate
    }
    // async function run() {
    //   const itr = await convert(100, 'USD', 'INR', '2022-08-09')
    //   return itr
    // }
    //  run().then((response) => {
    //   console.log(response)
    // });
    
    // var i = 0;
     
    //   while(i < jsonArray.length) {
    //     jsonArray[i].INR =  Conversion(jsonArray[i].Date, jsonArray[i].Currency, Number(jsonArray[i].Amount))
    //     //console.log(`i is ${jsonArray[i].INR}`)
    //     i++; 
    // }
  
  
    //console.log(`This is INR Conversion ${jsonArray[0].INR}`);
    //data = fs.createReadStream(req.file.path,'utf8');
    
    // fs.createReadStream(`./uploads/${name}`).pipe(parse({delimiter : ",",from_line : 1})).on("data", function(row){

    //     const start_array = row[0].split("-");
    //     const revDate = start_array[2] + "-" + start_array[1] + "-" + start_array[0];
    //     let elem_list = {date: revDate, description : row[1], amount : row[2], currency : row[3]};
    //     data_list.push(elem_list);
    //     // console.log(row);
    // }).on("end", function() {
    //     console.log("done");
    //     Records.insertMany(data_list);
    //     res.redirect('/options');
    // });
    User.insertMany(jsonArray).then(function() {
        console.log("Data sent and inserted");
        res.send(`Data sent `)
        // User.find().forEach(async function(doc) {
        //     const current = doc.Currency
        //     const amt = doc.Amount
        //     const date = doc.Date
        //     const myArray = date.split("-");
        //     const newdate = `${myArray[2]}-${myArray[1]}-${myArray[0]}`
        //     const inr = await convert(amt, current, 'INR', newdate);
        //     User.updateOne({$set : {"INR" : inr}})
        //     console.log("Success")
        // })
       
        // function Conversion(date, current, amt) {
        //     console.log(amt)
        //      myArray = date.split("-");
        //     const newdate = `${myArray[2]}-${myArray[1]}-${myArray[0]}`
        //     const inr =  convert(amt, current, 'INR', newdate);
        //     return inr
        // }
    //      const updatedoc =   {
    //   $set: {
    //     INR: Conversion(Date, Currency, Amount),
    //   }
    // };
      //     User.updateMany({}, 
            
      //           {
      // $set: {
      //  Arra: ["$Date", "$Currency", "$Amount"],
      //   INR: Conversion(Arra[0], Arra[1], Arra[2]),
      // }}
      //       )


        // async function run() {
        //   try {
        //   const database = client.db("test");
        //   const movies = database.collection("finaldatas");

        //   } finally {
        //     await client.close()
        //   }
        // }

        

        //res.json({success: 'success'});     
    }).catch(function (error) {
        console.log(error);
        
    }) 
    
    

    // User.insertMany(jsonArray, (error, result) => {
    //     if(error) {
    //         return res.status(500).json(error);
    //     }
    //     return res.json("Added successfully")
    // })
    
})


router.route("/edit").post(async (req, res) => {
  try {
     const date = req.body.edate
  const description = req.body.edescription
  const amount = req.body.eamount
  const currency = req.body.ecurrency

  // New data
 
  const newvalue = req.body.ndata
  const abcd = req.body.cars;
  const filter = {
      $and: [
        { Date: date },
        { Description: description }, 
        {Amount: amount},
        {Currency: currency}
      ]
    };

       
    const update = {
      $set: {[abcd] : newvalue }
    };


  const Useraccount = await User.updateOne(filter, update)
   console.log(`${Useraccount.matchedCount} document(s) matched the filter, ${Useraccount.modifiedCount} document(s) modified`);
  
  res.send(`new data ${newvalue} `)
  }
  catch(e) {
    console.log(e)
  }
  // const date = req.body.edate
  // const description = req.body.edescription
  // const amount = req.body.eamount
  // const currency = req.body.ecurrency
 // const Useraccount = await User.findOne({Date: date}, {Description: description}, {Amount: amount}, {currency: currency})
  
 
})    

router.route("/insert").post(async (req, res) => {
  try {
     const date = req.body.idate
  const description = req.body.idescription
  const amount = req.body.iamount
  const currency = req.body.icurrency

  const newDocument = {
  Date: date,
  Description: description,
  Amount: amount,
  Currency: currency

  
};

  const result = await User.insertMany(newDocument);
   console.log(`Inserted document with _id: ${result.insertedId}`);

    res.send(` Document inserted`)
  } 
  catch(e) {
    console.log(e)
  }

})

router.route("/recieve").post(async (req, res) => {
  try {
      const date1 = req.body.rsdate; // Replace with your date
      const date2 = req.body.rfdate; // Replace with your date

      //  const myArrayy = date1.split("-");
      // const ddate1 = `${myArrayy[2]}-${myArrayy[1]}-${myArrayy[0]}`
      // console.log(`start date ${ddate1}`)
      // const  mmyArrayy = date2.split("-");
      // const ddate2 = `${mmyArrayy[2]}-${mmyArrayy[1]}-${mmyArrayy[0]}`
      // console.log(`start date ${ddate2}`)
      

      const documentsBeforeOrEqual = await User.find({
         $and: [
        { Date: { $gte: date1 } },
        { Date: { $lte: date2 } }
      ]
    });
      console.log(documentsBeforeOrEqual)
      res.send(`Transactions in this range are as follows <br>
      ${documentsBeforeOrEqual}`)
  }
  catch(e) {
    console.log(e)
  }
})

router.route("/recieveamt").post(async (req, res) => {
try {
  const curr = req.body.rcurr;
  const amt1 = req.body.rsamt; 
  const amt2 = req.body.rfamt; 
console.log(`${amt1} and ${amt2}`)
 const documentsBeforeOrEqual = await User.find({
  Currency: curr,
   Amount: { $gte: amt1 },
   Amount: { $lte: amt2}
});
      console.log(documentsBeforeOrEqual)
      res.send(`Transactions in this range are as follows <br>
      ${documentsBeforeOrEqual}`)

}
catch(e) {
  console.log(e)
}
})

router.route("/delete").post(async (req, res) => {
  try {
    console.log(` amount ${req.body.mamount}`)
    const filter = {
     $and: [
        { Date: req.body.mdate },
        { Description: req.body.mdescription }, 
        {Amount: req.body.mamount},
        {Currency: req.body.mcurrency}
      ]
    }
      const result = await User.deleteOne(filter);
      console.log(`${result.deletedCount} document(s) deleted`);
      res.send(`Deleted`)

  }
  catch(e) {
    console.log(e)
  }
})

router.post('/register', async (req, res) => {
    console.log("Hello world")
    const data = req.body;
    if (!data) {
        return res.status(422).json({error: "No data sent"})
    }
    else {
    //     try {
            
    //         var i = 0;
    //         while (!data[i]) {
    //             qwerty = new User(data[i].Date, data[i].Description, data[i].Amount, data[i].Currency);
    //             await qwerty.save();
    //             i++;

    //         }
            
    //         return res.status(201).json({message: "user registered successfully"});
    //     }
    //     catch(err) {
    //         console.log(err)
    //     }
     }
})

//Approach1 --- CSVtoJson

// router.post('/add', async (req, res) => {
    
// csvtojson().fromFile(csvFilePath)
// .then((jsonObj)=>{
//     console.log(jsonObj)
    
// })
// })

module.exports = router;
