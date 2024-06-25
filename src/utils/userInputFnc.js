const handleInputChange = (event, input, setInput) => {
  const { name, value } = event.target;
  setInput({
    ...input,
    [name]: value,
  });
};

export default handleInputChange;
