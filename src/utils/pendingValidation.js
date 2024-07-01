const pendingEntryValidation = (input) => {
  if (!input.description || !input.category) {
    alert("Description and Category are required.");
    throw new Error("Description and Category are required.");
  }

  if (input.date) {
    console.log(`Date: ${input.date}`);
    input.date = new Date(input.date);
    if (input.relevUrgen) {
      input.relevUrgen = "";
    }
  }

  if (input.time && !input.date) {
    alert("Time must have a date.");
    throw new Error("Time must have a date.");
  }

  if (!input.date && !input.relevUrgen) {
    input.relevUrgen = "AVG | AVG";
  }

  if (input.periodRecurrence) {
    if (!input.date) {
      alert("Recurring tasks must have a date.");
      throw new Error("Recurring tasks must have a date.");
    }
  }

  const updatedInput = {
    ...input,
  };

  return updatedInput;
};

const pendingPatchValidation = (input) => {
  for (const key in input) {
    if (input[key] === null || input[key] === undefined || input[key] === "") {
      delete input[key];
    }
  }

  if (input.date || input.time || input.periodRecurrence) {
    alert(
      "You can only update the description, category or relev/urgen. Otherwise just make a new entry."
    );
    throw new Error("You can only update the description or category.");
  }

  if (Object.keys(input).length === 0) {
    input = { state: true };
  }

  const updatedInput = {
    ...input,
  };

  return updatedInput;
};

export default { pendingEntryValidation, pendingPatchValidation };
