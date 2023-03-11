const express = require("express");
const router = express.Router();
const User = require("../models/userSchema");
const Package = require("../models/AddpackageSchema");
const Allbalancehistory = require("../models/AlladbalanceSchema");
const Allorderhistory = require("../models/AddorderSchema");
const Allrefundhistory = require("../models/Addrefund");
const Info = require("../models/addinfo");
const Orderlock = require("../models/OrderlockSchema");

// -----------------------------User Registration-------------------------------//
router.post("/register", async (req, res) => {
  const { name, email, phone, password, balance } = req.body;

  try {
    const CheckEmail = await User.findOne({ email });

    if (CheckEmail) {
      return res.status(422).send("Email Is Already Exits");
    } else {
      const users = new User({
        name,
        email,
        phone,
        password,
        balance,
      });
      await users.save();
      res.status(201).json(users);
    }
  } catch (error) {
    res.status(422).send(error);
    console.log(error);
  }
});

// //-----------------------------User Login-----------------------------//
router.post("/login", async (req, res) => {
  try {
    const { phone, pass } = req.body;

    Finduser = await User.findOne({ phone });

    if (Finduser) {
      if (Finduser.password == pass) {
        res.status(201).json(Finduser);
      } else {
        res.status(404).send("Wrong Password");
      }
    } else {
      res.status(404).send("Invalid Credientials");
    }
  } catch (error) {
    res.status(422).send("Invalid credentials");
  }
});
// /////////////////////////Change password/////////////////////////////

router.post("/changepassword", async (req, res) => {
  const { useremail, newpassword } = req.body;
  await User.updateOne(
    {
      email: useremail,
    },
    {
      $set: {
        password: newpassword,
      },
    }
  );
  res.send("hellow");
});

// //-----------------------------Add Offer Package-----------------------------//

router.post("/addpackage", async (req, res) => {
  const {
    offertitle,
    offervalidity,
    offerprice,
    regularprice,
    discountprice,
    offernote,
    packagecompany,
  } = req.body;

  try {
    const package = new Package({
      offertitle,
      offervalidity,
      offerprice,
      regularprice,
      discountprice,
      offernote,
      packagecompany,
    });
    await package.save();
    res.status(201).send("Package Added sucessfully");
  } catch (error) {
    res.status(404).send(error);
  }
});
// //-----------------------------Get All BalanceHistory-----------------------------//

router.get("/alladbalancehistory", async (req, res) => {
  const Allblhistory = await Allbalancehistory.find();

  res.status(201).json(Allblhistory);
});
// //-----------------------------Get All Orderhistory-----------------------------//

router.get("/allorderhistory", async (req, res) => {
  const Allorhistory = await Allorderhistory.find();

  res.status(201).json(Allorhistory);
});
// //-----------------------------Get All Orderhistory-----------------------------//

router.get("/allrefundhistory", async (req, res) => {
  const Allrefundhis = await Allrefundhistory.find();

  res.status(201).json(Allrefundhis);
});
// //-----------------------------Get PendingHistory-----------------------------//

router.get("/getpendingaddbalance", async (req, res) => {
  const Pendinghistory = await Allbalancehistory.find({ status: "pending" });

  res.status(201).json(Pendinghistory.length);
});
// //-----------------------------Get PendingHistoryOrder-----------------------------//

router.get("/getpendingorder", async (req, res) => {
  const Pendinghistory = await Allorderhistory.find({ status: "pending" });
  res.status(201).json(Pendinghistory.length);
});
// //-----------------------------Get PendingRefundhistory-----------------------------//

router.get("/getpendingrefund", async (req, res) => {
  const Pendinghistory = await Allrefundhistory.find({ status: "pending" });
  res.status(201).json(Pendinghistory.length);
});

// //-----------------------------Get Packages-----------------------------//

router.get("/getpackages", async (req, res) => {
  const AllPackges = await Package.find();
  res.status(201).json(AllPackges);
});
// //-----------------------------Delete Packages-----------------------------//

router.delete("/deletepackages", async (req, res) => {
  const { offertitle } = req.body;
  await Package.deleteOne({ offertitle });
  res.status(201).send("Package Delete Successfully");
});

// //-----------------------------Add Info-----------------------------//

router.post("/addinfo", async (req, res) => {
  const {
    bkashnumber,
    rockectnumber,
    nagadnumber,
    whatsapplink,
    youtubelink,
    telegramlink,
    contactphone,
    email,
  } = req.body;

  await Info.updateOne(
    { _id: "63efbc9631d60205c0ea9bdb" },
    {
      bkashnumber,
      rockectnumber,
      nagadnumber,
      whatsapplink,
      youtubelink,
      telegramlink,
      contactphone,
      email,
    }
  );
  res.status(201).send("Info Successfully Added");
});
// //-----------------------------Get Info-----------------------------//

router.get("/getinfo", async (req, res) => {
  const GetInfo = await Info.findOne();
  res.status(201).json(GetInfo);
});

// //-----------------------------Post Add balance-----------------------------//

router.post("/postaddbalance", async (req, res) => {
  const {
    ammount,
    time,
    paymentmethod,
    paymentnumber,
    status,
    transactionid,
    email,
    userphone,
  } = req.body;

  const Allblhistory = new Allbalancehistory({
    ammount,
    time,
    paymentmethod,
    paymentnumber,
    status,
    transactionid,
    email,
    userphone,
  });
  await Allblhistory.save();

  const findUser = await User.findOne({ phone: userphone });

  await findUser.addBalancehis(
    ammount,
    time,
    paymentmethod,
    paymentnumber,
    status,
    transactionid,
    email
  );
  res.send("Successful Balance History");
  console.log("Successfully History Added");
});

/////////////////////////Buy Order//////////////////
router.post("/buyorder", async (req, res) => {
  const { offerdetail, time, number, status, email, usernumber } = req.body;

  const Allorhistory = new Allorderhistory({
    packagecompany: offerdetail.packagecompany,
    packagetitle: offerdetail.offertitle,
    offernumber: number,
    packageprice: offerdetail.offerprice,
    offernote: offerdetail.offernote,
    offervalidity: offerdetail.offervalidity,
    time,
    status,
    email,
    usernumber,
  });

  await Allorhistory.save();

  const findUser = await User.findOne({ phone: usernumber });

  await findUser.addOrderhis(
    offerdetail.packagecompany,
    offerdetail.offertitle,
    number,
    offerdetail.offerprice,
    offerdetail.offernote,
    offerdetail.offervalidity,
    time,
    status,
    email,
    usernumber
  );
  res.send("Successful Balance History");
});
// //-----------------------------Get UserData-----------------------------//

router.post("/getbalancecustomer", async (req, res) => {
  const { phone } = req.body;
  const Getuserdata = await User.findOne({ phone }, { addbalancehistory: 1 });
  res.status(201).json(Getuserdata);
});
router.post("/getordercustomer", async (req, res) => {
  const { phone } = req.body;
  const Getuserdata = await User.findOne({ phone }, { addorderhistory: 1 });
  res.status(201).json(Getuserdata);
});
/////////////////////////Get User Data////////////////////////////////
router.post("/getUserdata", async (req, res) => {
  const { phone } = req.body;
  const Getuserdata = await User.findOne({ phone });
  res.status(201).json(Getuserdata);
});

// //////////////////////////////////Add Add balance Money/////////////////
router.post("/addmoney", async (req, res) => {
  const { email, ammount, status, currentbalance, transactionid } = req.body;

  const Totalbalance = +ammount + +currentbalance;

  try {
    if (status == "successful") {
      await User.updateOne(
        { email, "addbalancehistory.transactionid": transactionid },
        {
          $set: {
            "addbalancehistory.$.status": status,
            balance: Totalbalance,
          },
        }
      );
      await Allbalancehistory.findOneAndUpdate(
        { transactionid },
        {
          $set: {
            status: status,
          },
        }
      );

      res.status(201).send("Add money Successfully");
    } else {
      await User.updateOne(
        { email, "addbalancehistory.transactionid": transactionid },
        {
          $set: {
            "addbalancehistory.$.status": status,
          },
        }
      );
      await Allbalancehistory.findOneAndUpdate(
        { transactionid },
        {
          $set: {
            status,
          },
        }
      );
    }

    res.status(201).send("Add money Successfully");
  } catch (error) {
    console.log(error);
  }
});

router.post("/acceptorder", async (req, res) => {
  const { email, time, status, ammount, currentbalance } = req.body;
  const Totalbalancemain = +currentbalance - +ammount;

  try {
    if (status == "successful") {
      await User.updateOne(
        { email, "addorderhistory.time": time },
        {
          $set: {
            "addorderhistory.$.status": status,
            balance: Totalbalancemain,
          },
        }
      );
      await Allorderhistory.findOneAndUpdate(
        { time },
        {
          $set: {
            status,
          },
        }
      );
      res.status(201).send("Order Done Successfully");
    } else {
      await User.updateOne(
        { email, "addorderhistory.time": time },
        {
          $set: {
            "addorderhistory.$.status": status,
          },
        }
      );
      await Allorderhistory.findOneAndUpdate(
        { time },
        {
          $set: {
            status,
          },
        }
      );
      res.status(201).send("Order Failed");
    }
  } catch (error) {
    console.log(error);
  }
});

router.post("/postrefund", async (req, res) => {
  const {
    ammount,
    time,
    paymentmethod,
    paymentnumber,
    status,
    email,
    usernumber,
  } = req.body;

  const Allrefundhis = new Allrefundhistory({
    ammount,
    time,
    paymentmethod,
    paymentnumber,
    status,
    email,
    usernumber,
  });
  await Allrefundhis.save();

  res.send("Successful Balance History");
});

router.post("/addrefund", async (req, res) => {
  const { email, ammount, status, currentbalance, time } = req.body;
  const Totalbalancemain = +currentbalance - +ammount;

  try {
    if (status == "successful") {
      await User.findOneAndUpdate(
        { email },
        {
          $set: {
            balance: Totalbalancemain,
          },
        }
      );
      await Allrefundhistory.findOneAndUpdate(
        { time },
        {
          $set: {
            status,
          },
        }
      );
      res.status(201).send("Refund Done Successfully");
    } else {
      await Allrefundhistory.findOneAndUpdate(
        { time },
        {
          $set: {
            status,
          },
        }
      );
      res.status(201).send("Refund Done Successfully");
    }
  } catch (error) {
    console.log(error);
  }
});
// ////////////////////Order Lock //////////////////////////////
router.post("/orderlock", async (req, res) => {
  const { lockstatus, locknote } = req.body;
  await Orderlock.updateOne(
    { _id: "63f1dec2ffefca0fb08b56b0" },
    {
      lockstatus,
      locknote,
    }
  );

  res.status(201).send("Order Lock Successfully");
});
router.get("/getorderlock", async (req, res) => {
  const Getorderlcok = await Orderlock.findOne();
  res.status(201).json(Getorderlcok);
});

router.post("/manualaddbalance", async (req, res) => {
  const { email, ammount } = req.body;
  await User.findOneAndUpdate(
    { email },
    {
      $set: {
        balance: ammount,
      },
    }
  );
  res.status(201).send("Successfully added");
});

router.get("/getalluser", async (req, res) => {
  const Alluserdata = await User.find();
  res.status(201).json(Alluserdata);
});

router.post("/searchuser", async (req, res) => {
  const { phone } = req.body;
  let response = await User.find({ phone });

  res.status(201).send(response);
});

module.exports = router;
