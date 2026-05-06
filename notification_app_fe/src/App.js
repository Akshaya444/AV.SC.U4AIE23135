import React, { useEffect, useMemo, useState } from "react";
import {
  AppBar,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  CssBaseline,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Toolbar,
  Typography,
  Alert,
  CircularProgress
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import { BrowserRouter, Link, Route, Routes, useLocation } from "react-router-dom";
import axios from "axios";
import NotificationCard from "./NotificationCard";

const API_URL = "http://20.207.122.201/evaluation-service/notifications";
const DEFAULT_TOKEN = process.env.REACT_APP_NOTIFICATION_API_TOKEN || "";
const NOTIFICATION_TYPES = ["All", "Placement", "Result", "Event"];
const LIMIT_OPTIONS = [5, 10, 20];
const PRIORITY_LIMIT = 10;

function useQueryParams() {
  const location = useLocation();
  return useMemo(() => new URLSearchParams(location.search), [location.search]);
}

function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = window.localStorage.getItem(key);
      return stored ? JSON.parse(stored) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}

function TokenEntry({ token, onUpdate }) {
  const [input, setInput] = useState(token || "");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    onUpdate(input.trim());
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <Card sx={{ mb: 4, borderRadius: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Secure access required
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Paste your current Bearer access token here. The app uses this token to fetch notifications from the protected API.
        </Typography>
        <TextField
          fullWidth
          multiline
          minRows={2}
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Enter access token"
          sx={{ mb: 2 }}
        />
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems="center">
          <Button variant="contained" onClick={handleSave} disabled={!input.trim()}>
            Save token
          </Button>
          {saved && <Typography color="success.main">Token saved locally.</Typography>}
        </Stack>
      </CardContent>
    </Card>
  );
}

function NotificationsPage({ priorityOnly, apiToken }) {
  const query = useQueryParams();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [notificationType, setNotificationType] = useState(query.get("notification_type") || "All");
  const [limit, setLimit] = useState(Number(query.get("limit")) || 10);
  const [page, setPage] = useState(Number(query.get("page")) || 1);
  const [viewedIds, setViewedIds] = useLocalStorage("viewedNotifications", []);
  const [topN, setTopN] = useState(PRIORITY_LIMIT);
  const [fetchKey, setFetchKey] = useState(0);

  useEffect(() => {
    if (!apiToken) {
      setError("Access token required. Please enter it at the top of the page.");
      return;
    }

    async function fetchNotifications() {
      setLoading(true);
      setError(null);
      try {
        const params = { limit, page };
        if (notificationType !== "All") {
          params.notification_type = notificationType;
        }
        const response = await axios.get(API_URL, {
          headers: {
            Authorization: `Bearer ${apiToken}`,
            "Content-Type": "application/json"
          },
          params
        });
        setNotifications(response.data.notifications || []);
      } catch (err) {
        setError(err.response?.data?.message || err.message || "Failed to load notifications.");
      } finally {
        setLoading(false);
      }
    }

    fetchNotifications();
  }, [limit, page, notificationType, fetchKey, apiToken]);

  const unreadNotifications = useMemo(
    () => notifications.filter((item) => !viewedIds.includes(item.ID)),
    [notifications, viewedIds]
  );

  const sortedPriority = useMemo(() => {
    const weight = { Placement: 3, Result: 2, Event: 1 };
    return [...unreadNotifications]
      .sort((a, b) => {
        const diff = (weight[b.Type] || 0) - (weight[a.Type] || 0);
        if (diff !== 0) return diff;
        return new Date(b.Timestamp) - new Date(a.Timestamp);
      })
      .slice(0, topN);
  }, [unreadNotifications, topN]);

  const listToRender = priorityOnly ? sortedPriority : notifications;

  const handleMarkRead = (id) => {
    if (!viewedIds.includes(id)) {
      setViewedIds([...viewedIds, id]);
    }
  };

  return (
    <Box sx={{ py: 4 }}>
      <Stack spacing={3}>
        <Box>
          <Typography variant="h4" gutterBottom>
            {priorityOnly ? "Priority Inbox" : "All Notifications"}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {priorityOnly
              ? `Top ${topN} unread notifications prioritized by type and recency.`
              : "Fetch notifications from the protected Campus Notification API."}
          </Typography>
        </Box>

        <Stack direction={{ xs: "column", md: "row" }} spacing={2} alignItems="center">
          <FormControl sx={{ minWidth: 160 }}>
            <InputLabel>Type</InputLabel>
            <Select
              value={notificationType}
              label="Type"
              onChange={(event) => setNotificationType(event.target.value)}
            >
              {NOTIFICATION_TYPES.map((type) => (
                <MenuItem value={type} key={type}>
                  {type}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {!priorityOnly && (
            <FormControl sx={{ minWidth: 140 }}>
              <InputLabel>Limit</InputLabel>
              <Select value={limit} label="Limit" onChange={(event) => setLimit(Number(event.target.value))}>
                {LIMIT_OPTIONS.map((option) => (
                  <MenuItem value={option} key={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          {!priorityOnly && (
            <FormControl sx={{ minWidth: 140 }}>
              <InputLabel>Page</InputLabel>
              <Select value={page} label="Page" onChange={(event) => setPage(Number(event.target.value))}>
                {[1, 2, 3, 4, 5].map((pageOption) => (
                  <MenuItem value={pageOption} key={pageOption}>
                    {pageOption}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          {priorityOnly && (
            <TextField
              label="Top n"
              type="number"
              value={topN}
              onChange={(event) => setTopN(Math.max(1, Math.min(50, Number(event.target.value))))}
              sx={{ width: 120 }}
            />
          )}

          <Button
            variant="contained"
            startIcon={<RefreshIcon />}
            onClick={() => {
              setError(null);
              setFetchKey((prev) => prev + 1);
            }}
          >
            Refresh
          </Button>
        </Stack>

        {error && <Alert severity="error">{error}</Alert>}

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
            <CircularProgress />
          </Box>
        ) : listToRender.length === 0 ? (
          <Alert severity="info">No notifications available for the selected filter.</Alert>
        ) : (
          listToRender.map((notification) => (
            <NotificationCard
              key={notification.ID}
              notification={notification}
              viewed={viewedIds.includes(notification.ID)}
              onMarkRead={handleMarkRead}
            />
          ))
        )}
      </Stack>
    </Box>
  );
}

function MainLayout({ apiToken, setApiToken }) {
  const location = useLocation();
  const path = location.pathname;

  return (
    <Container maxWidth="lg">
      <AppBar position="static" color="inherit" elevation={1} sx={{ mb: 4 }}>
        <Toolbar sx={{ justifyContent: "space-between", flexWrap: "wrap" }}>
          <Typography variant="h6" component="div" sx={{ fontWeight: 700 }}>
            Campus Notifications
          </Typography>
          <Stack direction="row" spacing={1}>
            <Button component={Link} to="/" color={path === "/" ? "primary" : "inherit"}>
              All Notifications
            </Button>
            <Button
              component={Link}
              to="/priority"
              color={path === "/priority" ? "primary" : "inherit"}
            >
              Priority Inbox
            </Button>
          </Stack>
        </Toolbar>
      </AppBar>

      <TokenEntry token={apiToken} onUpdate={setApiToken} />

      {apiToken ? (
        <Routes>
          <Route path="/" element={<NotificationsPage priorityOnly={false} apiToken={apiToken} />} />
          <Route path="/priority" element={<NotificationsPage priorityOnly={true} apiToken={apiToken} />} />
        </Routes>
      ) : (
        <Card sx={{ mb: 4, borderRadius: 3 }}>
          <CardContent>
            <Typography variant="body1" color="text.secondary">
              Enter the access token above to load notifications. This application stores the token locally so you can continue working without having to paste it again.
            </Typography>
          </CardContent>
        </Card>
      )}
    </Container>
  );
}

export default function App() {
  const [apiToken, setApiToken] = useLocalStorage("notificationApiToken", DEFAULT_TOKEN);

  return (
    <BrowserRouter>
      <CssBaseline />
      <MainLayout apiToken={apiToken} setApiToken={setApiToken} />
    </BrowserRouter>
  );
}
