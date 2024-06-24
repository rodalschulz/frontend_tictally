import React from "react";
import Select from "react-select";

const options = [
  { value: "GENERAL", label: "GENERAL" },
  { value: "WORK", label: "WORK" },
  { value: "LEARN", label: "LEARN" },
  { value: "BUILD", label: "BUILD" },
  { value: "CORE", label: "CORE" },
  { value: "RECOVERY", label: "RECOVERY" },
];

const tailwindStyles = {
  bgSecondary: "rgb(38, 70, 83)",
  bgPrimary: "rgb(74, 170, 188)",
  bgPrimaryHover: "rgb(74, 194, 188)",
  textPrimary: "rgb(0, 0, 0)",
};

const customStyles = {
  control: (provided) => ({
    ...provided,
    backgroundColor: tailwindStyles.bgSecondary,
    borderColor: tailwindStyles.bgSecondary,
    boxShadow: "none",
    "&:hover": {
      borderColor: tailwindStyles.bgSecondary,
    },
    fontSize: "0.875rem",
    height: 30,
    minHeight: 30,
  }),
  dropdownIndicator: (provided) => ({
    ...provided,
    paddingTop: 0,
    paddingBottom: 3,
  }),
  clearIndicator: (provided) => ({
    ...provided,
    paddingTop: 0,
    paddingBottom: 3,
  }),
  multiValue: (provided) => ({
    ...provided,
    backgroundColor: tailwindStyles.bgPrimary,
    color: "white",
  }),
  multiValueLabel: (provided) => ({
    ...provided,
    color: "white",
    fontSize: "0.875rem",
  }),
  multiValueRemove: (provided) => ({
    ...provided,
    color: "white",
    "&:hover": {
      backgroundColor: tailwindStyles.bgPrimaryHover,
      color: "white",
    },
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected
      ? tailwindStyles.bgPrimary
      : state.isFocused
      ? tailwindStyles.bgPrimaryHover
      : "white",
    color: state.isSelected ? "white" : tailwindStyles.textPrimary,
    fontSize: "0.875rem",
    "&:hover": {
      backgroundColor: tailwindStyles.bgPrimaryHover,
      color: "white",
    },
  }),
  menu: (provided) => ({
    ...provided,
    fontSize: "0.875rem",
  }),
  placeholder: (provided) => ({
    ...provided,
    color: "lightgray",
    paddingBottom: 4,
  }),
};

const CategDropdown = ({ selectedCategories, setSelectedCategories }) => {
  const handleChange = (selectedOptions) => {
    const selectedValues = selectedOptions.map((option) => option.value);
    setSelectedCategories(selectedValues);
  };

  return (
    <Select
      options={options}
      isMulti
      value={options.filter((option) =>
        selectedCategories.includes(option.value)
      )}
      onChange={handleChange}
      closeMenuOnSelect={false}
      hideSelectedOptions={false}
      controlShouldRenderValue={false}
      styles={customStyles}
      placeholder="Categories"
    />
  );
};

export default CategDropdown;
