const Sequelize = require("sequelize");

require("dotenv").config();

const sequelize = new Sequelize(
  "redistesting","root", "",
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT || "mysql",
  }
);

try {
  sequelize.authenticate();
  console.log("db successfull connected");
} catch (err) {
  console.error(err);
}

module.exports = sequelize;
