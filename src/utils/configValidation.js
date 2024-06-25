const cleanAndValidateCoreLimits = (limits) => {
  const cleanedLimits = {};
  for (const [key, value] of Object.entries(limits)) {
    const numberValue = Number(value);
    if (!isNaN(numberValue)) {
      cleanedLimits[key] = numberValue;
    } else {
      cleanedLimits[key] = 0;
    }
  }
  return cleanedLimits;
};

export default { cleanAndValidateCoreLimits };
