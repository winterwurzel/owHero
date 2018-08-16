/* eslint-disable  no-console */
// *eslint : extend airbnb

//
// exported module
//
module.exports = {
  //
  // Core Voice UI Helpers
  //
  getRandomItem(arrayOfItems) {
    // can take an array, or a dictionary
    if (Array.isArray(arrayOfItems)) {
      // the argument is an array []
      let i = 0;
      i = Math.floor(Math.random() * arrayOfItems.length);
      return (arrayOfItems[i]);
    }

    if (typeof arrayOfItems === 'object') {
      // argument is object, treat as dictionary
      const result = {};
      const key = this.getRandomItem(Object.keys(arrayOfItems));
      result[key] = arrayOfItems[key];
      return result;
    }
    // not an array or object, so just return the input
    return arrayOfItems;
  },
  getSlotValues(filledSlots) {
  const slotValues = {};

  console.log(`The filled slots: ${JSON.stringify(filledSlots)}`);
  Object.keys(filledSlots).forEach((item) => {
      const name = filledSlots[item].name;

      if (filledSlots[item] &&
        filledSlots[item].resolutions &&
        filledSlots[item].resolutions.resolutionsPerAuthority[0] &&
        filledSlots[item].resolutions.resolutionsPerAuthority[0].status &&
        filledSlots[item].resolutions.resolutionsPerAuthority[0].status.code) {
        switch (filledSlots[item].resolutions.resolutionsPerAuthority[0].status.code) {
          case 'ER_SUCCESS_MATCH':
            slotValues[name] = {
              synonym: filledSlots[item].value,
              resolved: filledSlots[item].resolutions.resolutionsPerAuthority[0].values[0].value.name,
              isValidated: true,
            };
            break;
          case 'ER_SUCCESS_NO_MATCH':
            slotValues[name] = {
              synonym: filledSlots[item].value,
              resolved: filledSlots[item].value,
              isValidated: false,
            };
            break;
          default:
            break;
        }
      } else {
        slotValues[name] = {
          synonym: filledSlots[item].value,
          resolved: filledSlots[item].value,
          isValidated: false,
        };
      }
    }, this);

    return slotValues;
  }
};
