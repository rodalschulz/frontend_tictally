const pendingEntryValidation = (input) => {
  if (input.date) {
    input.date = new Date(input.date);
  }
  if (!input.date && !input.time) {
    input.relevance = "NORMAL";
    input.urgency = "NORMAL";
  }

  if (input.time && !input.date) {
    alert("Time must have a date.");
    throw new Error("Time must have a date.");
  }

  if (input.recurring === "true") {
    if (!input.date) {
      alert("Recurring tasks must have a date.");
      throw new Error("Recurring tasks must have a date.");
    }
    input.recurring = input.recurring === "true";
    input.periodRecurrence = input.periodRecurrence || "YEARLY";
  }

  const updatedInput = {
    ...input,
  };

  return updatedInput;
};

const pendingPatchValidation = (input) => {
  const updatedInput = { ...input };

  for (const key in updatedInput) {
    if (
      updatedInput[key] === null ||
      updatedInput[key] === undefined ||
      updatedInput[key] === ""
    ) {
      delete updatedInput[key];
    }
  }

  if (updatedInput.date) {
    updatedInput.date = new Date(updatedInput.date);
  }

  return updatedInput;
};

export default { pendingEntryValidation, pendingPatchValidation };
