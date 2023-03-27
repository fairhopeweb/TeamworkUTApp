import { IncomingWebhook } from "@slack/webhook";

// Set up Slack webhook
const slackWebhookUrl = process.env.SLACK_WEBHOOK_URL;
const slackWebhook = new IncomingWebhook(slackWebhookUrl);

// Set up Teamwork API credentials
const teamworkApiKey = process.env.TEAMWORK_API_KEY;

// Make API call to Teamwork API to retrieve list of unassigned tasks
async function getUnassignedTasks() {
  const response = await fetch("https://jaladesign.teamwork.com/tasks.json", {
    method: "GET",
    headers: {
      Authorization: `Basic ${btoa(`${teamworkApiKey}:`)}`,
      "Content-type": "application/json",
      qs: {
        "responsible-party-ids": "none",
      },
    },
  });

  if (!response.ok) {
    console.error(`Error: ${response.status} - ${response.statusText}`);
    throw Error("Could not get task list");
  }

  const taskList = await response.json();
  return taskList["todo-items"].filter((task) => !task["responsible-party-id"]);
}

// Make API call to Teamwork API to retrieve project name for a task
async function getProjectName(taskId) {
  const response = await fetch(
    `https://jaladesign.teamwork.com/tasks/${taskId}.json`,
    {
      method: "GET",
      headers: {
        Authorization: `Basic ${btoa(`${teamworkApiKey}:`)}`,
        "Content-type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw Error("Could not get task");
  }

  const task = await response.json();
  return task["todo-item"]["project-name"];
}

// Main function that retrieves list of unassigned tasks and sends a message to Slack
async function sendUnassignedTasksToSlack() {
  try {
    // Retrieve list of unassigned tasks
    const unassignedTasks = await getUnassignedTasks();

    // Get project name for each task
    const tasksWithProjectName = await Promise.all(
      unassignedTasks.map(async (task) => {
        const projectName = await getProjectName(task.id);
        return { ...task, projectName };
      })
    );

    const message = formatTasks(tasksWithProjectName);

    // Send message to Slack
    const result = await slackWebhook.send(message);
    console.log("Message sent to Slack");
  } catch (error) {
    console.error(error);
    throw error;
  }
}

function formatTasks(tasks) {
  // Format message
  let message = "List of unassigned tasks:\n\n";
  tasks.forEach((task) => {
    message += `• Project: ${task.projectName} - ${task.content} \n`;
  });
  return message;
}

// Call main function
export default async function handler(req, res) {
  if (req.method === "POST") {
    await sendUnassignedTasksToSlack();
    return res.status(200).json({ message: "Success" });
  } else {
    return res.status(404).json({ message: "Route not found." });
  }
}
