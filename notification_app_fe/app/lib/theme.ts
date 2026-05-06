// Shared MUI theme – dark mode with a vibrant accent palette
"use client";
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#6C63FF",      // vivid violet
      light: "#9D97FF",
      dark: "#3D35CC",
    },
    secondary: {
      main: "#FF6584",      // coral pink
    },
    background: {
      default: "#0D0D1A",
      paper: "#15152B",
    },
    success: { main: "#43E97B" },
    warning: { main: "#F9A826" },
    info: { main: "#38B2F8" },
    text: {
      primary: "#F0F0FF",
      secondary: "#9B9BC7",
    },
  },
  typography: {
    fontFamily: "'Inter', 'Roboto', sans-serif",
    h4: { fontWeight: 700 },
    h5: { fontWeight: 700 },
    h6: { fontWeight: 600 },
    subtitle2: { fontWeight: 500 },
  },
  shape: { borderRadius: 14 },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          border: "1px solid rgba(255,255,255,0.06)",
          transition: "transform 0.2s ease, box-shadow 0.2s ease",
          "&:hover": {
            transform: "translateY(-2px)",
            boxShadow: "0 8px 30px rgba(108,99,255,0.18)",
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { fontWeight: 600, borderRadius: 8 },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: { textTransform: "none", fontWeight: 600, borderRadius: 10 },
      },
    },
  },
});

export default theme;
