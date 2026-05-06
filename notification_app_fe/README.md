# Notification App Frontend

A responsive React frontend for the Campus Notification platform.

## Run locally

```bash
cd notification_app_fe
npm install
npm start
```

The app uses `http://localhost:3000` by default.

## Notes

- Uses Material UI for styling only.
- Fetches notifications from the protected API.
- Supports filtering by notification type.
- Displays all notifications and a separate priority inbox.
- Marks viewed notifications locally using `localStorage`.
- Uses API query parameters: `limit`, `page`, and `notification_type`.
