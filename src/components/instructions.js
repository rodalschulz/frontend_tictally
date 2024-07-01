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
    <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-50">
      <div className="bg-cyan-500 rounded-lg px-5 py-4 text-white w-[50%] min-w-[300px] max-w-[800px] bg-opacity-80 pointer-events-auto">
        {" "}
        <h1 className="mb-2 font-bold text-center text-lg">
          Welcome to your configuration page!
        </h1>
        <p>
          Here you can set 3 things: core limits, subcategories, and
          subcategory-tracking to establish a 10,000 hour challenge.
        </p>
        <br />
        <p>
          ♦ Core Limits: Determine Core subcategory limits to correctly
          calculate your Core daily total. Example: if you set a limit of 7
          hours for SLEEP, but you input 8 hours of sleep in a day, only 7 hours
          will count towards your total Core time and the rest will be
          classified as WASTE.
        </p>
        <p>
          ♦ Subcategories: Create your custom subcategories for each category.
        </p>
        <p>
          ♦ Tracking: Set already used subcategories to track your progress in
          the 10,000 hour challenge. You'll be able to visualize your progress
          on the Dashboard.
        </p>
      </div>
    </div>
  );

  const dashboardInstructions = (
    <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-50">
      <div className="bg-cyan-500 rounded-lg px-5 py-4 text-white w-[50%] min-w-[300px] max-w-[800px] bg-opacity-80 pointer-events-auto">
        <h1 className="mb-2 font-bold text-center text-lg">
          Welcome to your Dashboard!
        </h1>
        <p>
          Here you can see a visual representation of your activity data: a
          stacked bar chart, data cards/tables, and progress bars.
        </p>
        <br />
        <p>
          ♦ The stacked bar chart shows your daily activity data for the last 6
          months
        </p>
        <p>
          ♦ The data cards/tables show your trailing 7 and 30 days. You can
          click on the cards to show a detailed table
        </p>
        <p>
          ♦ If you have set subcategory-tracking goals on your config page, the
          progress will be shown below
        </p>
      </div>
    </div>
  );

  const pendingTasksInstructions = (
    <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-50">
      <div className="bg-cyan-500 rounded-lg px-5 py-4 text-white w-[50%] min-w-[300px] max-w-[800px] bg-opacity-80 pointer-events-auto">
        <h1 className="mb-2 font-bold text-center text-lg">
          Welcome to Pending Tasks!
        </h1>
        <br />
        <p>We categorize your tasks into 5 categories:</p>
        <br />
        <ul>- Ad-hoc tasks are tasks that don't have a scheduled date</ul>
        <ul>- Upcoming tasks are scheduled tasks from the next 14 days</ul>
        <ul>
          - Recent tasks are tasks that have been completed recently or that
          have expired
        </ul>
        <ul>
          - Far-Off tasks are tasks that are scheduled for more than 14 days in
          the future, with a maximum of 365 days
        </ul>
        <ul>- Recurring tasks are tasks that repeat each period</ul>
        <br />
        <p>
          After selecting a task, you can click the check button to mark a task
          as 'done'.
        </p>
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
