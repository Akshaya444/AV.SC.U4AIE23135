# System Design

## Stage 1

### Objective
Build a notification prioritization algorithm that identifies the top unread notifications based on importance and recency.

### Approach
- Use the provided Notification API endpoint: `http://20.207.122.201/evaluation-service/notifications`
- Do not store notifications in a database or hard-code them.
- Implement a frontend-driven priority algorithm that selects the top `n` notifications.
- Prioritization rules:
  - Placement notifications have highest weight.
  - Result notifications have medium weight.
  - Event notifications have lowest weight.
  - Within the same type, newer notifications are prioritized first.
- Maintain top unread notifications by tracking viewed notification IDs in local storage.

### Priority Algorithm
1. Query the API with supported parameters: `limit`, `page`, `notification_type`.
2. Filter notifications by unread status in the frontend.
3. Sort by type weight: `Placement > Result > Event`.
4. For equal weights, sort by descending timestamp.
5. Return the top `n` notifications for the Priority Inbox.

### Result
This design ensures the most important unread notifications remain visible and the system continues to support new notifications without server-side state.

## Stage 2

### Objective
Develop a responsive React frontend application that displays all notifications and a separate priority inbox page.

### Implementation Details
- Built as a React application in `notification_app_fe/`.
- Uses React Router for two pages:
  - `All Notifications`
  - `Priority Inbox`
- Uses Material UI for styling and layout.
- Supports type filtering, page selection, and list limit controls.
- Uses API query parameters:
  - `limit`
  - `page`
  - `notification_type`
- Distinguishes new vs viewed notifications using frontend state and `localStorage`.
- Displays a clear `New` or `Viewed` badge for every notification.
- The Priority Inbox page shows the top unread notifications by weight and recency.

### Notes
- The application is designed to run on `http://localhost:3000`.
- The frontend uses a protected API token to access notifications securely.
- The system is intentionally front-end centric for viewed-state management, satisfying the requirement to distinguish new and already viewed notifications through the user interface.
