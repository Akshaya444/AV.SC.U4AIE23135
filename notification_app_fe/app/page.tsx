"use client";
import React, { useCallback, useEffect, useState } from "react";
import {
  Box,
  Container,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
  CircularProgress,
  Alert,
  Pagination,
  Skeleton,
  Stack,
  Chip,
  Divider,
  TextField,
  InputAdornment,
} from "@mui/material";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import SearchIcon from "@mui/icons-material/Search";
import { fetchNotifications, Notification } from "./lib/api";
import NotificationCard from "./components/NotificationCard";

const NOTIFICATION_TYPES = ["All", "Placement", "Result", "Event"];
const PAGE_SIZE = 10;

// Track read IDs in localStorage so state persists across page navigation
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

export default function AllNotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState("All");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [readIds, setReadIds] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState("");

  // Load read state from localStorage on mount
  useEffect(() => {
    setReadIds(getReadIds());
  }, []);

  const loadNotifications = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchNotifications({
        page,
        limit: PAGE_SIZE,
        notification_type: typeFilter === "All" ? undefined : typeFilter,
      });
      setNotifications(data);
      // Estimate total pages: if we got a full page, there might be more
      setTotalPages(data.length === PAGE_SIZE ? page + 1 : page);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to fetch notifications");
    } finally {
      setLoading(false);
    }
  }, [page, typeFilter]);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  const handleMarkRead = (id: string) => {
    markRead(id);
    setReadIds((prev) => new Set([...prev, id]));
  };

  const handleTypeChange = (_: React.MouseEvent<HTMLElement>, value: string | null) => {
    if (value) {
      setTypeFilter(value);
      setPage(1);
    }
  };

  // Client-side search filter
  const filtered = search.trim()
    ? notifications.filter(
        (n) =>
          n.Message.toLowerCase().includes(search.toLowerCase()) ||
          n.Type.toLowerCase().includes(search.toLowerCase())
      )
    : notifications;

  const unreadCount = filtered.filter((n) => !readIds.has(n.ID)).length;

  return (
    <Box sx={{ position: "relative", zIndex: 1, py: 4, minHeight: "calc(100vh - 64px)" }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}>
            <NotificationsActiveIcon
              sx={{ fontSize: 32, color: "primary.main" }}
            />
            <Typography variant="h4" sx={{ fontWeight: 800 }}>
              All Notifications
            </Typography>
            {unreadCount > 0 && (
              <Chip
                label={`${unreadCount} new`}
                color="secondary"
                size="small"
                sx={{ fontWeight: 700 }}
              />
            )}
          </Box>
          <Typography variant="body2" color="text.secondary">
            Browse your latest campus updates — Placements, Results, and Events.
            Click a card to mark it as read.
          </Typography>
        </Box>

        {/* Controls */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          alignItems={{ sm: "center" }}
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

          {/* Search */}
          <TextField
            size="small"
            placeholder="Search notifications…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ fontSize: 18, color: "text.secondary" }} />
                  </InputAdornment>
                ),
              },
            }}
            sx={{
              ml: { sm: "auto !important" },
              minWidth: 240,
              "& .MuiOutlinedInput-root": {
                bgcolor: "rgba(255,255,255,0.04)",
                borderRadius: 2,
              },
            }}
          />
        </Stack>

        <Divider sx={{ borderColor: "rgba(255,255,255,0.06)", mb: 3 }} />

        {/* Content */}
        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
            {error}
          </Alert>
        )}

        {loading ? (
          <Stack spacing={1.5}>
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton
                key={i}
                variant="rectangular"
                height={80}
                sx={{ borderRadius: 2, bgcolor: "rgba(255,255,255,0.06)" }}
              />
            ))}
          </Stack>
        ) : filtered.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 8 }}>
            <Typography color="text.secondary" variant="h6">
              No notifications found
            </Typography>
            <Typography color="text.secondary" variant="body2" sx={{ mt: 1 }}>
              Try a different filter or check back later.
            </Typography>
          </Box>
        ) : (
          <Stack spacing={1.5}>
            {filtered.map((n) => (
              <NotificationCard
                key={n.ID}
                notification={n}
                isNew={!readIds.has(n.ID)}
                onClick={handleMarkRead}
              />
            ))}
          </Stack>
        )}

        {/* Pagination */}
        {!loading && filtered.length > 0 && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={(_, val) => setPage(val)}
              color="primary"
              shape="rounded"
              sx={{
                "& .MuiPaginationItem-root": {
                  color: "text.secondary",
                  "&.Mui-selected": { bgcolor: "primary.main", color: "#fff" },
                },
              }}
            />
          </Box>
        )}
      </Container>
    </Box>
  );
}
