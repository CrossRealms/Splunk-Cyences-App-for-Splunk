import React, { useCallback, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Tabs,
  Tab,
  TextField,
  Typography,
  Box,
} from "@mui/material";

const presetsLeft = [
  "Today",
  "Week to date",
  "Business week to date",
  "Month to date",
  "Year to date",
  "Yesterday",
  "Previous week",
  "Previous business week",
  "Previous month",
  "Previous year",
];

const presetsRight = [
  "Last 15 minutes",
  "Last 60 minutes",
  "Last 4 hours",
  "Last 24 hours",
  "Last 7 days",
  "Last 30 days",
  "All time",
];

export default function TimeRangeDialog({ open, onClose, onSelect }) {
  const [active, setActive] = useState("presets");
  const [earliest, setEarliest] = useState("");
  const [latest, setLatest] = useState("");

  // M/D/YY H:mm:ss.SSS AM/PM
  const dateRegex =
    /^(0?[1-9]|1[0-2])\/(0?[1-9]|[12][0-9]|3[01])\/\d{2}\s(0?[1-9]|1[0-2]):[0-5][0-9]:[0-5][0-9]\.\d{3}\s(AM|PM)$/i;

  const handleTabChange = useCallback((_, value) => {
    setActive(value);
  }, []);

  const isEarliestInvalid = earliest && !dateRegex.test(earliest);
  const isLatestInvalid = latest && !dateRegex.test(latest);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
    >
      {/* HEADER */}
      <DialogTitle>Select Time Range</DialogTitle>

      {/* BODY */}
      <DialogContent dividers>
        <Tabs
          value={active}
          onChange={handleTabChange}
          sx={{ mb: 2 }}
        >
          <Tab label="Presets" value="presets" />
          <Tab label="Advanced" value="advanced" />
        </Tabs>

        {/* ================= PRESETS ================= */}
        {active === "presets" && (
          <Box className="grid grid-cols-2 gap-10 p-4 pt-2">
            <div>
              <Typography
                variant="caption"
                sx={{ fontWeight: 600, color: "text.secondary" }}
              >
                RELATIVE
              </Typography>

              <div className="flex flex-col gap-1 mt-2">
                {presetsLeft.map((item) => (
                  <button
                    key={item}
                    onClick={() => {
                      onSelect(item);
                      onClose();
                    }}
                    className="text-blue-600 text-sm text-left hover:underline"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Typography
                variant="caption"
                sx={{ fontWeight: 600, color: "text.secondary" }}
              >
                OTHER
              </Typography>

              <div className="flex flex-col gap-1 mt-2">
                {presetsRight.map((item) => (
                  <button
                    key={item}
                    onClick={() => {
                      onSelect(item);
                      onClose();
                    }}
                    className="text-blue-600 text-sm text-left hover:underline"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          </Box>
        )}

        {/* ================= ADVANCED ================= */}
        {active === "advanced" && (
          <Box className="p-5">
            <Box mb={3}>
              <TextField
                label="Earliest"
                fullWidth
                value={earliest}
                onChange={(e) => setEarliest(e.target.value)}
                error={isEarliestInvalid}
                helperText={
                  isEarliestInvalid
                    ? "Date must be like: 1/1/70 5:30:00.000 AM"
                    : ""
                }
              />
            </Box>

            <Box>
              <TextField
                label="Latest"
                fullWidth
                value={latest}
                onChange={(e) => setLatest(e.target.value)}
                error={isLatestInvalid}
                helperText={
                  isLatestInvalid
                    ? "Date must be like: 1/1/70 5:30:00.000 AM"
                    : ""
                }
              />
            </Box>

            <Box className="mt-6 flex justify-end">
              <Button
                variant="contained"
                disabled={
                  !earliest ||
                  !latest ||
                  isEarliestInvalid ||
                  isLatestInvalid
                }
                onClick={() => {
                  const finalValue = `${earliest} - ${latest}`;
                  onSelect(finalValue);
                  onClose();
                }}
              >
                Apply
              </Button>
            </Box>
          </Box>
        )}
      </DialogContent>

      {/* FOOTER */}
      <DialogActions>
        <Button variant="outlined" onClick={onClose}>
          Back
        </Button>
      </DialogActions>
    </Dialog>
  );
}
