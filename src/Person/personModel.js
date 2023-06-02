const sequelize = require("../../settings/dbConfig");

const { DataTypes } = require("sequelize");

const Person = sequelize.define(
  "Person",
  {
    firstName: {
      type: DataTypes.STRING(40),
    },
    lastName: {
      type: DataTypes.STRING(40),
    },
    middleName: {
      type: DataTypes.STRING(40),
    },
    age: {
      type: DataTypes.VIRTUAL,
      get() {
        return new Date().getFullYear() - new Date(this.dob).getFullYear();
      },
    },
    dob: {
      type: DataTypes.DATEONLY,
    },
    gender: {
      type: DataTypes.ENUM("MALE", "FEMALE", "OTHER"),
      defaultValue: "OTHER",
    },

    // father: {
    //   type: DataTypes.INTEGER,
    //   references: {
    //     model: Person,
    //     key: "id",
    //   },
    // },
    // mother: {
    //   type: DataTypes.INTEGER,
    //   references: {
    //     key: "id",
    //     model: Person,
    //   },
    // },
  },
  {
    timestamps: true,
    freezeTableName: true,
    paranoid: true,
  }
);

Person.hasMany(Person, {
  // as:"Mother",
  foreignKey: "Mother",
  timestamps: false,
});
Person.hasMany(Person, {
  // as:"Mother",
  foreignKey: "Father",
  timestamps: false,
});

Person.sync({ alter: false, force: false }).catch((err) => {
  console.log(err);
});
module.exports = Person;
