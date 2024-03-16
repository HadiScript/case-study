const isAtLeastOneAgeGroupTrue = (ageGroups) => {
  let trueCount = 0;

  for (let group in ageGroups) {
    if (ageGroups[group].men || ageGroups[group].women) {
      trueCount++;
    }

    // If more than one group is true, return false immediately
    if (trueCount > 1) {
      return false;
    }
  }

  // Return true only if exactly one group is true
  return trueCount === 1;
};

const isAtLeastOneEducationTrue = (education) => {
  let trueCount = 0;
  trueCount += education.master ? 1 : 0;
  trueCount += education.graduate ? 1 : 0;
  trueCount += education.higher_secondary ? 1 : 0;
  trueCount += education.secondary ? 1 : 0;
  trueCount += education.none ? 1 : 0;

  return trueCount === 1;
};

const isExactlyOneOccupationTrue = (occupation) => {
  let trueCount = 0;

  // Count true values in 'business'
  Object.values(occupation.business).forEach((value) => {
    if (typeof value === "boolean" && value) trueCount++;
  });

  // Count true values in 'employment'
  Object.values(occupation.employment).forEach((value) => {
    if (typeof value === "boolean" && value) trueCount++;
  });

  // Count true values in 'unemployed'
  Object.values(occupation.unemployed).forEach((value) => {
    if (typeof value === "boolean" && value) trueCount++;
  });

  // Check if exactly one is true
  return trueCount === 1;
};

const isAtLeastOneHouseTrue = (house) => {
  let trueCount = 0;
  trueCount += house.living_with_relative ? 1 : 0;
  trueCount += house.rent ? 1 : 0;
  trueCount += house.own ? 1 : 0;

  return trueCount === 1;
};

module.exports = {
  isAtLeastOneAgeGroupTrue,
  isAtLeastOneEducationTrue,
  isExactlyOneOccupationTrue,
  isAtLeastOneHouseTrue,
};
