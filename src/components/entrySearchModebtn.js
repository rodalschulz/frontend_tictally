const EntrySearchToggleButton = ({ isSearchMode, handleClick }) => {
  return (
    <div className="inline-flex items-center">
      <button
        className={`px-1 py-0.5 text-xs ${
          isSearchMode ? "bg-gray-200 text-gray-800" : "bg-primary text-white"
        } rounded-l h-5`}
        onClick={(e) => {
          e.preventDefault(); // Prevent the default form submission behavior
          handleClick();
        }}
      >
        E
      </button>
      <button
        className={`px-1 py-0.5 text-xs ${
          isSearchMode ? "bg-primary text-white" : "bg-gray-200 text-gray-800"
        } rounded-r h-5`}
        onClick={(e) => {
          e.preventDefault(); // Prevent the default form submission behavior
          handleClick();
        }}
      >
        S
      </button>
    </div>
  );
};

export default EntrySearchToggleButton;
