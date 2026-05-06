"use client";
import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Chip,
  Box,
  Tooltip,
} from "@mui/material";
import WorkIcon from "@mui/icons-material/Work";
import AssessmentIcon from "@mui/icons-material/Assessment";
import EventIcon from "@mui/icons-material/Event";
import FiberNewIcon from "@mui/icons-material/FiberNew";
import { Notification } from "../lib/api";

interface Props {
  notification: Notification;
  isNew: boolean;
  onClick: (id: string) => void;
}

const TYPE_CONFIG = {
  Placement: {
    color: "#43E97B" as const,
    bgColor: "rgba(67,233,123,0.10)",
    Icon: WorkIcon,
    chipColor: "success" as const,
  },
  Result: {
    color: "#38B2F8" as const,
    bgColor: "rgba(56,178,248,0.10)",
    Icon: AssessmentIcon,
    chipColor: "info" as const,
  },
  Event: {
    color: "#F9A826" as const,
    bgColor: "rgba(249,168,38,0.10)",
    Icon: EventIcon,
    chipColor: "warning" as const,
  },
};

function formatTimestamp(ts: string): string {
  const d = new Date(ts);
  return d.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function NotificationCard({ notification, isNew, onClick }: Props) {
  const config = TYPE_CONFIG[notification.Type] ?? TYPE_CONFIG.Event;
  const { Icon } = config;

  return (
    <Tooltip title={isNew ? "New – click to mark as read" : "Already viewed"} arrow>
      <Card
        onClick={() => onClick(notification.ID)}
        sx={{
          cursor: "pointer",
          bgcolor: "background.paper",
          borderLeft: `4px solid ${config.color}`,
          opacity: isNew ? 1 : 0.72,
          position: "relative",
          overflow: "visible",
        }}
      >
        {isNew && (
          <Box
            sx={{
              position: "absolute",
              top: -8,
              right: -8,
              bgcolor: "secondary.main",
              borderRadius: "50%",
              width: 20,
              height: 20,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <FiberNewIcon sx={{ fontSize: 12, color: "#fff" }} />
          </Box>
        )}

        <CardContent sx={{ display: "flex", alignItems: "flex-start", gap: 1.5, py: "14px !important" }}>
          {/* Icon badge */}
          <Box
            sx={{
              width: 42,
              height: 42,
              borderRadius: 2,
              bgcolor: config.bgColor,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <Icon sx={{ color: config.color, fontSize: 22 }} />
          </Box>

          {/* Content */}
          <Box sx={{ flexGrow: 1, minWidth: 0 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap", mb: 0.5 }}>
              <Chip
                label={notification.Type}
                color={config.chipColor}
                size="small"
                sx={{ height: 20, fontSize: 11 }}
              />
              {isNew && (
                <Chip
                  label="NEW"
                  size="small"
                  sx={{
                    height: 20,
                    fontSize: 10,
                    bgcolor: "rgba(255,101,132,0.18)",
                    color: "secondary.main",
                    fontWeight: 700,
                  }}
                />
              )}
            </Box>
            <Typography
              variant="body1"
              sx={{
                fontWeight: isNew ? 700 : 400,
                color: isNew ? "text.primary" : "text.secondary",
                mb: 0.25,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {notification.Message}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {formatTimestamp(notification.Timestamp)}
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Tooltip>
  );
}
