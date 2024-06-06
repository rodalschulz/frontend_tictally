const Instructions = ({ pageName }) => {
  const tallyInstructions = (
    <div className="bg-primary rounded-lg px-5 py-4 text-white mt-14 ml-5 w-[50%] min-w-[350px] max-w-[1000px] max-h-[60%] absolute bg-opacity-85 overflow-y-scroll">
      <h1 className="mb-2 font-bold text-center text-lg">WELCOME!</h1>
      <p>
        This is your personal Tally page. It's where you make inputs of your
        daily activities. Use the form above to add new entries. You can also
        search for entries by using the search mode or modify existing ones by
        selecting them and then entering new data.
      </p>
      <br />
      <p>
        For new entries, you MUST enter a category. If date or start time are
        not defined, they will automatically be set to current date and time. If
        you are in search mode, the total time of the search results will be
        displayed in the TIME column. You can create your own custom
        subcategories by visiting the Categories Configuration page.
      </p>
      <br />
      <p>
        You can navigate to different pages by using the vertical navigation bar
        on the left. From top to bottom:
      </p>
      <br />
      <ul>
        - <strong>Dashboard</strong>: A visual representation of your activity
        data
      </ul>
      <ul>
        - <strong>My Tally</strong>: You are currently on it
      </ul>
      <ul>
        - <strong>Configuration</strong>: Create your own custom subcategories
        and core limits
      </ul>
      <ul>
        - <strong>Question Mark</strong>: Make these guides pop up. Click again
        to close
      </ul>
      <ul>
        - <strong>Logout</strong>: Self explanatory. You will be redirected to
        the home page
      </ul>
    </div>
  );

  const configInstructions = (
    <div className="bg-primary rounded-lg px-5 py-4 text-white mt-20 ml-10 w-[50%] min-w-[300px] max-w-[800px] absolute bg-opacity-90">
      <h1 className="mb-2 font-bold text-center text-lg">
        Welcome to your configuration page!
      </h1>
      <p>
        Here you can create your own custom subcategories and core limits. Your
        subcategories will be saved and will be reflected in your Tally. You can
        also modify your core subcategory limits here. They will help determine
        the total time spent in CORE activities; as an example, if you set a
        core limit of 7 hours for SLEEP, but you input 8 hours of sleep, only 7
        of those will be counted towards your total core time and the rest will
        be classified as WASTE.
      </p>
    </div>
  );

  const dashboardInstructions = (
    <div className="bg-primary rounded-lg px-5 py-4 text-white mt-20 ml-10 w-[50%] min-w-[300px] max-w-[800px] absolute bg-opacity-95">
      <h1 className="mb-2 font-bold text-center text-lg">
        Welcome to your Dashboard!
      </h1>
      <p>
        Here you can see a visual representation of your activity data. The
        stacked bar chart will show the last 6 months of data. You can also
        click the data cards to see a more in depth table view of your activity
        data.
      </p>
    </div>
  );

  const pendingTasksInstructions = (
    <div className="bg-primary rounded-lg px-5 py-4 text-white mt-20 ml-10 w-[50%] min-w-[300px] max-w-[800px] absolute bg-opacity-95">
      <h1 className="mb-2 font-bold text-center text-lg">
        Welcome to Pending Tasks!
      </h1>
      <p>
        We categorize your tasks into 4 categories. Ad-hoc tasks are tasks that
        don't have a scheduled date. Upcoming tasks are scheduled tasks from the
        next 14 days. Recent tasks are tasks that have been completed recently
        or that have expired. Far-Off tasks are tasks that are scheduled for
        more than 14 days in the future, with a maximum of 365 days.
      </p>
      <br />
      <p>You can click the check button to mark a task as completed.</p>
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
