"use client";
import React from "react";
import { AppBar, Toolbar, Typography, Button, Box, Container } from "@mui/material";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import StarIcon from "@mui/icons-material/Star";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { label: "All Notifications", href: "/", icon: <NotificationsActiveIcon fontSize="small" /> },
  { label: "Priority Inbox", href: "/priority", icon: <StarIcon fontSize="small" /> },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        bgcolor: "rgba(13,13,26,0.88)",
        backdropFilter: "blur(14px)",
        borderBottom: "1px solid rgba(255,255,255,0.07)",
      }}
    >
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ gap: 2 }}>
          {/* Logo */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mr: "auto" }}>
            <Box
              sx={{
                width: 34,
                height: 34,
                borderRadius: 2,
                bgcolor: "primary.main",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <NotificationsActiveIcon sx={{ fontSize: 18, color: "#fff" }} />
            </Box>
            <Typography
              variant="h6"
              sx={{
                background: "linear-gradient(135deg, #6C63FF 0%, #FF6584 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                fontWeight: 800,
                letterSpacing: "-0.5px",
              }}
            >
              CampusNotify
            </Typography>
          </Box>

          {/* Nav links */}
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href;
            return (
              <Link key={item.href} href={item.href} style={{ textDecoration: "none" }}>
                <Button
                  startIcon={item.icon}
                  variant={active ? "contained" : "text"}
                  color="primary"
                  sx={{
                    px: 2,
                    color: active ? "#fff" : "text.secondary",
                    bgcolor: active ? "primary.main" : "transparent",
                    "&:hover": { bgcolor: active ? "primary.dark" : "rgba(108,99,255,0.1)" },
                  }}
                >
                  {item.label}
                </Button>
              </Link>
            );
          })}
        </Toolbar>
      </Container>
    </AppBar>
  );
}
