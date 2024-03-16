const mongoose = require("mongoose");
const sequenceModel = require("./seq");

const censusSchema = new mongoose.Schema({
  sr_no: Number,
  qabeela: { type: String, requried: true },
  aal: { type: String, requried: true },
  name_of_household_head: { type: String, requried: true },
  residential_location: { type: String, requried: true },
  age_groups: {
    above_65: {
      men: Boolean,
      women: Boolean,
      members: { type: Number, default: 1 },
    },
    between_25_65: {
      men: Boolean,
      women: Boolean,
      members: { type: Number, default: 1 },
    },
    between_14_24: {
      men: Boolean,
      women: Boolean,
      members: { type: Number, default: 1 },
    },
    below_14: {
      men: Boolean,
      women: Boolean,
      members: { type: Number, default: 1 },
    },
  },
  education: {
    master: { selected: { type: Boolean, default: false }, members: { type: Number, default: 0 } },
    graduate: { selected: { type: Boolean, default: false }, members: { type: Number, default: 0 } },
    higher_secondary: { selected: { type: Boolean, default: false }, members: { type: Number, default: 0 } },
    secondary: { selected: { type: Boolean, default: false }, members: { type: Number, default: 0 } },
    none: { selected: { type: Boolean, default: false }, members: { type: Number, default: 0 } },
  },
  occupation: {
    business: {
      sole_proprietorship: Boolean,
      partnership: Boolean,
      average_monthly_income: Boolean, // This might need to remain a Number if you're storing an actual income value
      family: Boolean,
    },
    employment: {
      government: Boolean,
      private: Boolean,
      daily_wager: Boolean,
      monthly_income: Boolean, // This might need to remain a Number if you're storing an actual income value
    },
    unemployed: {
      disability_or_sickness: Boolean,
      lack_of_employable_skill: Boolean,
      lack_of_capital: Boolean,
      orphan_or_widow: Boolean,
    },
  },
  house: {
    own: Boolean,
    rent: Boolean,
    living_with_relative: Boolean,
  },

  createdAt: { type: Date, default: Date.now },
});

censusSchema.pre("save", async function (next) {
  if (this.isNew) {
    const seqDoc = await sequenceModel.findByIdAndUpdate({ _id: "entityId" }, { $inc: { seq: 1 } }, { new: true, upsert: true });
    this.sr_no = seqDoc.seq;
  }
  next();
});

const Census = mongoose.model("Census", censusSchema);

module.exports = Census;
