"use client";
import React, { useCallback, useEffect, useState } from "react";
import {
  Box,
  Container,
  Typography,
  Stack,
  Chip,
  Alert,
  Skeleton,
  Divider,
  ToggleButton,
  ToggleButtonGroup,
  Slider,
  Paper,
  Tooltip,
  IconButton,
  Fade,
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import RefreshIcon from "@mui/icons-material/Refresh";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { fetchNotifications, sortByPriority, Notification } from "../lib/api";
import NotificationCard from "../components/NotificationCard";

const NOTIFICATION_TYPES = ["All", "Placement", "Result", "Event"];

function getReadIds(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = localStorage.getItem("readNotificationIds");
    return new Set(raw ? JSON.parse(raw) : []);
  } catch {
    return new Set();
  }
}

function markRead(id: string) {
  const existing = getReadIds();
  existing.add(id);
  localStorage.setItem("readNotificationIds", JSON.stringify([...existing]));
}

// Type weight labels for display
const WEIGHT_LABEL: Record<string, string> = {
  Placement: "Weight 3 – Highest",
  Result: "Weight 2 – High",
  Event: "Weight 1 – Normal",
};

export default function PriorityInboxPage() {
  const [allNotifications, setAllNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [topN, setTopN] = useState<number>(10);
  const [typeFilter, setTypeFilter] = useState("All");
  const [readIds, setReadIds] = useState<Set<string>>(new Set());
  const [lastFetched, setLastFetched] = useState<Date | null>(null);

  useEffect(() => {
    setReadIds(getReadIds());
  }, []);

  const loadNotifications = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch a large batch so we can rank client-side (matches Stage 1 logic)
      const data = await fetchNotifications({ limit: 100 });
      setAllNotifications(data);
      setLastFetched(new Date());
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to fetch notifications");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  const handleMarkRead = (id: string) => {
    markRead(id);
    setReadIds((prev) => new Set([...prev, id]));
  };

  const handleTypeChange = (_: React.MouseEvent<HTMLElement>, value: string | null) => {
    if (value) setTypeFilter(value);
  };

  // Apply type filter then sort by priority, then slice to topN
  const prioritized = sortByPriority(
    typeFilter === "All"
      ? allNotifications
      : allNotifications.filter((n) => n.Type === typeFilter)
  ).slice(0, topN);

  const unreadCount = prioritized.filter((n) => !readIds.has(n.ID)).length;

  return (
    <Box sx={{ position: "relative", zIndex: 1, py: 4, minHeight: "calc(100vh - 64px)" }}>
      <Container maxWidth="lg">

        {/* ── Header ── */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}>
            <Box
              sx={{
                width: 42,
                height: 42,
                borderRadius: 2,
                background: "linear-gradient(135deg, #6C63FF 0%, #FF6584 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <StarIcon sx={{ color: "#fff", fontSize: 22 }} />
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 800 }}>
              Priority Inbox
            </Typography>
            {unreadCount > 0 && (
              <Chip
                label={`${unreadCount} unread`}
                color="secondary"
                size="small"
                sx={{ fontWeight: 700 }}
              />
            )}
            <Tooltip title="Refresh notifications" arrow>
              <IconButton
                onClick={loadNotifications}
                size="small"
                sx={{ ml: "auto", color: "text.secondary", "&:hover": { color: "primary.main" } }}
              >
                <RefreshIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
          <Typography variant="body2" color="text.secondary">
            Top{" "}
            <Box component="span" sx={{ color: "primary.light", fontWeight: 700 }}>
              {topN}
            </Box>{" "}
            notifications ranked by importance: Placement &gt; Result &gt; Event, then by recency.
          </Typography>
          {lastFetched && (
            <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 0.5 }}>
              Last updated: {lastFetched.toLocaleTimeString("en-IN")}
            </Typography>
          )}
        </Box>

        {/* ── Priority Scoring Legend ── */}
        <Paper
          elevation={0}
          sx={{
            mb: 3,
            p: 2,
            bgcolor: "rgba(108,99,255,0.08)",
            border: "1px solid rgba(108,99,255,0.18)",
            borderRadius: 3,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
            <InfoOutlinedIcon sx={{ fontSize: 16, color: "primary.light" }} />
            <Typography variant="subtitle2" color="primary.light">
              How priority is scored
            </Typography>
          </Box>
          <Stack direction="row" spacing={1.5} flexWrap="wrap" useFlexGap>
            {(["Placement", "Result", "Event"] as const).map((type) => (
              <Chip
                key={type}
                label={`${type} — ${WEIGHT_LABEL[type]}`}
                size="small"
                sx={{
                  bgcolor:
                    type === "Placement"
                      ? "rgba(67,233,123,0.12)"
                      : type === "Result"
                      ? "rgba(56,178,248,0.12)"
                      : "rgba(249,168,38,0.12)",
                  color:
                    type === "Placement"
                      ? "#43E97B"
                      : type === "Result"
                      ? "#38B2F8"
                      : "#F9A826",
                  fontWeight: 600,
                  fontSize: 12,
                }}
              />
            ))}
          </Stack>
        </Paper>

        {/* ── Controls ── */}
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={3}
          alignItems={{ md: "center" }}
          sx={{ mb: 3 }}
        >
          {/* Type filter */}
          <ToggleButtonGroup
            value={typeFilter}
            exclusive
            onChange={handleTypeChange}
            size="small"
            sx={{
              bgcolor: "rgba(255,255,255,0.04)",
              borderRadius: 2,
              "& .MuiToggleButton-root": {
                border: "none",
                px: 2,
                py: 0.75,
                fontWeight: 600,
                fontSize: 13,
                color: "text.secondary",
                "&.Mui-selected": {
                  bgcolor: "primary.main",
                  color: "#fff",
                  "&:hover": { bgcolor: "primary.dark" },
                },
              },
            }}
          >
            {NOTIFICATION_TYPES.map((t) => (
              <ToggleButton key={t} value={t}>
                {t}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>

          {/* Top N slider */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, minWidth: 260, ml: { md: "auto !important" } }}>
            <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: "nowrap" }}>
              Show top
            </Typography>
            <Slider
              value={topN}
              min={5}
              max={20}
              step={5}
              marks={[
                { value: 5, label: "5" },
                { value: 10, label: "10" },
                { value: 15, label: "15" },
                { value: 20, label: "20" },
              ]}
              onChange={(_, val) => setTopN(val as number)}
              sx={{
                color: "primary.main",
                "& .MuiSlider-mark": { bgcolor: "rgba(108,99,255,0.3)" },
                "& .MuiSlider-markLabel": { color: "text.secondary", fontSize: 11 },
              }}
            />
          </Box>
        </Stack>

        <Divider sx={{ borderColor: "rgba(255,255,255,0.06)", mb: 3 }} />

        {/* ── Content ── */}
        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
            {error}
          </Alert>
        )}

        {loading ? (
          <Stack spacing={1.5}>
            {Array.from({ length: topN }).map((_, i) => (
              <Skeleton
                key={i}
                variant="rectangular"
                height={80}
                sx={{ borderRadius: 2, bgcolor: "rgba(255,255,255,0.06)" }}
              />
            ))}
          </Stack>
        ) : prioritized.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 8 }}>
            <Typography color="text.secondary" variant="h6">
              No priority notifications found
            </Typography>
            <Typography color="text.secondary" variant="body2" sx={{ mt: 1 }}>
              Try selecting a different type or refreshing.
            </Typography>
          </Box>
        ) : (
          <Fade in={!loading}>
            <Stack spacing={1.5}>
              {prioritized.map((n, idx) => (
                <Box key={n.ID} sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
                  {/* Rank badge */}
                  <Box
                    sx={{
                      width: 28,
                      height: 28,
                      borderRadius: "50%",
                      flexShrink: 0,
                      mt: 1.5,
                      background:
                        idx === 0
                          ? "linear-gradient(135deg, #F9A826, #FF6584)"
                          : idx === 1
                          ? "linear-gradient(135deg, #9B9BC7, #6C63FF)"
                          : idx === 2
                          ? "linear-gradient(135deg, #43E97B, #38B2F8)"
                          : "rgba(255,255,255,0.08)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Typography
                      sx={{ fontSize: 11, fontWeight: 800, color: idx < 3 ? "#fff" : "text.secondary" }}
                    >
                      {idx + 1}
                    </Typography>
                  </Box>

                  <Box sx={{ flexGrow: 1 }}>
                    <NotificationCard
                      notification={n}
                      isNew={!readIds.has(n.ID)}
                      onClick={handleMarkRead}
                    />
                  </Box>
                </Box>
              ))}
            </Stack>
          </Fade>
        )}
      </Container>
    </Box>
  );
}
