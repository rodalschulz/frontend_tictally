const Instructions = ({ pageName }) => {
  const tallyInstructions = (
    <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-50 mt-12">
      <div className="bg-cyan-500 rounded-lg px-5 py-4 text-white w-[50%] min-w-[300px] max-w-[800px] bg-opacity-80 pointer-events-auto">
        <h1 className="mb-2 font-bold text-center text-lg">WELCOME!</h1>
        <p className="text-center">
          This is your personal Tally page, where you track your daily
          activities!
        </p>
        <p className="text-center">
          Hover the mouse over the form's titles to see a brief guide on how to
          make successful entries.
        </p>
        <br />
        <p className="text-center text-xs">
          *Click sidebar's "?" symbol to open/hide this guide, after making your
          first entry*
        </p>
        <p className="text-center mt-1 text-xs">
          *Navigate the entry form easily with TAB, SHIFT+TAB, and SPACE for
          dropdowns*
        </p>
        <p className="text-center mt-1 text-xs">
          *CTRL+Click and SHIFT+Click to select more than 1 row*
        </p>
      </div>
    </div>
  );

  const configInstructions = (
    <div className="fixed inset-0 flex items-center justify-center pointer-events-none">
      <div className="bg-cyan-500 rounded-lg px-5 py-4 text-white w-[50%] min-w-[300px] max-w-[800px] bg-opacity-80 pointer-events-auto">
        {" "}
        <h1 className="mb-2 font-bold text-center text-lg">
          Welcome to your configuration page!
        </h1>
        <p>
          Here you can create your own custom subcategories and core limits.
          Your subcategories will be saved and will be reflected in your Tally.
          You can also modify your core subcategory limits here. They will help
          determine the total time spent in CORE activities; as an example, if
          you set a core limit of 7 hours for SLEEP, but you input 8 hours of
          sleep, only 7 of those will be counted towards your total core time
          and the rest will be classified as WASTE.
        </p>
      </div>
    </div>
  );

  const dashboardInstructions = (
    <div className="fixed inset-0 flex items-center justify-center pointer-events-none">
      <div className="bg-cyan-500 rounded-lg px-5 py-4 text-white w-[50%] min-w-[300px] max-w-[800px] bg-opacity-80 pointer-events-auto">
        <h1 className="mb-2 font-bold text-center text-lg">
          Welcome to your Dashboard!
        </h1>
        <p>
          Here you can see a visual representation of your activity data. The
          stacked bar chart will show the last 6 months of data. You can also
          click the data cards to see a more in depth table view of your
          activity data.
        </p>
        <br />
        <p>
          If you have set subcategory goals on your config page, the progress
          will be shown below.
        </p>
      </div>
    </div>
  );

  const pendingTasksInstructions = (
    <div className="fixed inset-0 flex items-center justify-center pointer-events-none">
      <div className="bg-cyan-500 rounded-lg px-5 py-4 text-white w-[50%] min-w-[300px] max-w-[800px] bg-opacity-80 pointer-events-auto">
        <h1 className="mb-2 font-bold text-center text-lg">
          Welcome to Pending Tasks!
        </h1>
        <p>
          We categorize your tasks into 4 categories. Ad-hoc tasks are tasks
          that don't have a scheduled date. Upcoming tasks are scheduled tasks
          from the next 14 days. Recent tasks are tasks that have been completed
          recently or that have expired. Far-Off tasks are tasks that are
          scheduled for more than 14 days in the future, with a maximum of 365
          days.
        </p>
        <br />
        <p>You can click the check button to mark a task as completed.</p>
      </div>
    </div>
  );

  if (pageName === "tally") {
    return tallyInstructions;
  } else if (pageName === "config") {
    return configInstructions;
  } else if (pageName === "dashboard") {
    return dashboardInstructions;
  } else if (pageName === "pendingTasks") {
    return pendingTasksInstructions;
  }
};

export default Instructions;
