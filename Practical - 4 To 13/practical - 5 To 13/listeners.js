import taskEvents from "./events.js";

// Register task-created background notification listener
taskEvents.on("task-created", (task, user) => {
  const receivedAt = new Date().toISOString();
  const assignedUser = user?.email || user?.id || task.userId || "admin@example.com";

  console.log(
    `[Notification Listener] Task "${task.title}" event received at ${receivedAt} (Assigned User: ${assignedUser})`
  );

  // Simulate non-blocking asynchronous background notification task (e.g., email / push notification)
  setTimeout(() => {
    const completedAt = new Date().toISOString();
    console.log(
      `[Notification Background Worker] Finished dispatching email/push for "${task.title}" at ${completedAt}`
    );
  }, 1500);
});

export default taskEvents;
