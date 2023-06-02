const express = require("express");
const cors = require("cors");
const Person = require("./src/Person/personModel");

const axios = require("axios");

const Redis = require("redis");

const redisClient = Redis.createClient();

const DEFAULT_EXPIRATION = 3600;

require("dotenv").config();

require("./src/Person/personModel");

const app = express();

const corsOption = {
  methods: "*",
  origin: "127.0.0.1",
};

app.use(cors(corsOption));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(process.env.PORT || 8080, () => {
  console.log("server is running on ", process.env.PORT || 8080);
});

// const tr = async () => {
//   let arr = [];

//   for (var i = 0; i < 700000; i++) {
//     arr.push({
//       firstName: "MIHIGO",
//       lastName: "Yvesdd",
//       dob: new Date(),
//       gender: "MALE",
//       Mother: 1,
//       Father: 2,
//     });
//   }
//   await Person.bulkCreate(
//     arr,

//     {
//       ignoreDuplicates: true,
//     }
//   );
// };
// tr();

app.get("/", (req, res) => {
  res.send("Hello");
});

app.get("/finddAll", async (req, res) => {
  //   console.log();
  res.json(JSON.stringify(await Person.findAll({ limit: 500000 })));
});

app.get("/pictures", async (req, res) => {
  // return console.log("Hello from")
  const albumId = req.query.albumId;

  // console.log("data");
  redisClient.get("photoss", async (error, photoss) => {
    if (error) console.error(error);
    if (photoss != null) {
      return res.json(JSON.parse(photoss));
    } else {
      console.log("saving to redis");
      let { data } = await axios.get(
        "https://jsonplaceholder.typicode.com/photos"
        // , {
        //   params: { albumId },
        // }
      );
      redisClient.SETEX("photoss", DEFAULT_EXPIRATION, JSON.stringify(data));
      return res.json(data);
    }
  });

  // res.status(200).json(data);
});

app.get("/pictures/:id", async (req, res) => {
  const data = await axios.get(
    `https://jsonplaceholder.typicode.com/photos/${req.params.id}`
  );
  console.log(data);
  return res.json(data.data);
});
