import React from "react";
import {
  Box,
  Card,
  CardContent,
  Chip,
  Stack,
  Typography,
  Button
} from "@mui/material";

const typeColor = {
  Placement: "primary",
  Result: "success",
  Event: "warning"
};

export default function NotificationCard({ notification, viewed, onMarkRead }) {
  const { ID, Type, Message, Timestamp } = notification;
  return (
    <Card elevation={1} sx={{ mb: 2, borderRadius: 3 }}>
      <CardContent>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={1}>
          <Box>
            <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
              <Chip label={Type} color={typeColor[Type] || "default"} size="small" />
              <Chip
                label={viewed ? "Viewed" : "New"}
                color={viewed ? "default" : "secondary"}
                size="small"
              />
            </Stack>
            <Typography variant="h6" sx={{ mt: 1, textTransform: "capitalize" }}>
              {Message}
            </Typography>
          </Box>
          <Button size="small" onClick={() => onMarkRead(ID)}>
            Mark as read
          </Button>
        </Stack>

        <Stack direction="row" justifyContent="space-between" sx={{ mt: 2 }}>
          <Typography variant="body2" color="text.secondary">
            {new Date(Timestamp).toLocaleString()}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            ID: {ID.slice(0, 8)}...
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );
}
