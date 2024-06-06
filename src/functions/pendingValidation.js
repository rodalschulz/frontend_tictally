const pendingEntryValidation = (input) => {
  if (input.date) {
    input.date = new Date(input.date);
  }
  // if (!input.date && !input.time) {
  //   input.relevance = "NORMAL";
  //   input.urgency = "NORMAL";
  // }

  // if (input.recurring === "true") {
  //   if (!input.date) {
  //     alert("Recurring tasks must have a date.");
  //     throw new Error("Recurring tasks must have a date.");
  //   }
  //   input.recurring = input.recurring === "true";
  //   input.periodRecurrence = input.periodRecurrence || "YEARLY";
  // }

  const updatedInput = {
    ...input,
  };

  return updatedInput;
};

export default { pendingEntryValidation };
