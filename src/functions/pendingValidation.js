const pendingEntryValidation = (input) => {
  if (!input.description) {
    alert("Description is required.");
    throw new Error("Description is required.");
  }

  if (input.date) {
    console.log(`Date: ${input.date}`);
    input.date = new Date(input.date);
    if (input.relevance || input.urgency) {
      input.relevance = "";
      input.urgency = "";
    }
  }

  if (input.time && !input.date) {
    alert("Time must have a date.");
    throw new Error("Time must have a date.");
  }

  if (!input.date) {
    input.relevance = "AVG";
    input.urgency = "AVG";
  }

  if (input.recurring === "true") {
    console.log(`Recurring: ${input.recurring}`);
    if (!input.date) {
      alert("Recurring tasks must have a date.");
      throw new Error("Recurring tasks must have a date.");
    }
    input.recurring = true;
    input.periodRecurrence = input.periodRecurrence || "YEARLY";
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

  if (
    input.date ||
    input.time ||
    input.relevance ||
    input.urgency ||
    input.recurring ||
    input.periodRecurrence
  ) {
    alert(
      "You can only update the description. Otherwise just make a new entry."
    );
    throw new Error("You can only update the description.");
  }

  const updatedInput = {
    ...input,
  };

  return updatedInput;
};

export default { pendingEntryValidation, pendingPatchValidation };
