const express = require("express");
const errorHandler = require("../middleware/ErrorHandler");
const { isAtLeastOneAgeGroupTrue, isAtLeastOneEducationTrue, isExactlyOneOccupationTrue, isAtLeastOneHouseTrue } = require("../validations/checks");
const Census = require("../models/case");
const router = express.Router();

router.post("/add-case", async (req, res, next) => {
  try {
    const { qabeela, aal, name_of_household_head, residential_location, age_groups, education, occupation, house } = req.body;

    if (!qabeela || !aal || !name_of_household_head || !residential_location) {
      return next(errorHandler(400, "Missing required fields: qabeela, aal, name_of_household_head, or residential_location"));
    }

    if (!isAtLeastOneAgeGroupTrue(age_groups)) {
      return next(errorHandler(400, "Invalid data: At least one age group must be true."));
    }
    if (!isAtLeastOneEducationTrue(education)) {
      return next(errorHandler(400, "Invalid data: At least one education must be true."));
    }
    if (!isExactlyOneOccupationTrue(occupation)) {
      return next(errorHandler(400, "Invalid data: At least one occupation must be true."));
    }
    if (!isAtLeastOneHouseTrue(house)) {
      return next(errorHandler(400, "Invalid data: At least one house must be true."));
    }

    // console.log(age_groups, "here are");
    // return;

    const newRecord = new Census({
      qabeela,
      aal,
      name_of_household_head,
      residential_location,
      age_groups,
      education,
      occupation,
      house,
    });

    await newRecord.save();

    res.status(201).json({ message: "Census record added successfully!" });
  } catch (error) {
    console.log(error, "here is ome");
    next(error);
  }
});

router.get("/all-records", async (req, res, next) => {
  try {
    const { page = 1, limit = 5, search = "" } = req.query;
    console.log(search, "hereis");
    const query = {
      $or: [
        { qabeela: { $regex: search, $options: "i" } },
        { aal: { $regex: search, $options: "i" } },
        { name_of_household_head: { $regex: search, $options: "i" } },
        { residential_location: { $regex: search, $options: "i" } },
      ],
    };

    const census = await Census.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await Census.countDocuments(query);

    res.json({
      census,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    });
  } catch (error) {
    next(error);
  }
});

router.get("/records-time", async (req, res, next) => {
  try {
    const submissions = await Census.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } }, // Sort by date in ascending order
    ]);

    res.json(submissions);
  } catch (error) {
    next(error);
  }
});

router.get("/records-gender", async (req, res) => {
  try {
    const genderData = await Census.aggregate([
      {
        $group: {
          _id: null,
          above_65_men: { $sum: { $cond: ["$age_groups.above_65.men", 1, 0] } },
          above_65_women: { $sum: { $cond: ["$age_groups.above_65.women", 1, 0] } },
          between_25_65_men: { $sum: { $cond: ["$age_groups.between_25_65.men", 1, 0] } },
          between_25_65_women: { $sum: { $cond: ["$age_groups.between_25_65.women", 1, 0] } },

          between_14_24_men: { $sum: { $cond: ["$age_groups. between_14_24.men", 1, 0] } },
          between_14_24_women: { $sum: { $cond: ["$age_groups. between_14_24.women", 1, 0] } },
          below_14_men: { $sum: { $cond: ["$age_groups. below_14.men", 1, 0] } },
          below_14_women: { $sum: { $cond: ["$age_groups. below_14.women", 1, 0] } },
        },
      },
    ]);

    res.json(genderData);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get("/records-edu", async (req, res) => {
  try {
    const educationData = await Census.aggregate([
      {
        $group: {
          _id: null,
          masterCount: { $sum: { $cond: ["$education.master", 1, 0] } },
          graduateCount: { $sum: { $cond: ["$education.graduate", 1, 0] } },
          higherSecondaryCount: { $sum: { $cond: ["$education.higher_secondary", 1, 0] } },
          secondaryCount: { $sum: { $cond: ["$education.secondary", 1, 0] } },
          noneCount: { $sum: { $cond: ["$education.none", 1, 0] } },
        },
      },
    ]);

    res.json(educationData);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get("/records-house", async (req, res) => {
  try {
    const houseData = await Census.aggregate([
      {
        $group: {
          _id: null,
          ownCount: { $sum: { $cond: ["$house.own", 1, 0] } },
          rentCount: { $sum: { $cond: ["$house.rent", 1, 0] } },
          livingWithRelativeCount: { $sum: { $cond: ["$house.living_with_relative", 1, 0] } },
        },
      },
    ]);

    res.json(houseData);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
