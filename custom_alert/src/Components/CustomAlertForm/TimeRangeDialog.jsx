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
  Divider,
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

  const dateRegex =
    /^(0?[1-9]|1[0-2])\/(0?[1-9]|[12][0-9]|3[01])\/\d{2}\s(0?[1-9]|1[0-2]):[0-5][0-9]:[0-5][0-9]\.\d{3}\s(AM|PM)$/i;

  const handleTabChange = useCallback((_, value) => {
    setActive(value);
  }, []);

  const isEarliestInvalid = earliest && !dateRegex.test(earliest);
  const isLatestInvalid = latest && !dateRegex.test(latest);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      {/* HEADER */}
      <DialogTitle className="pb-2">
        <Typography variant="h6" fontWeight={600}>
          Select Time Range
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Choose a preset or define a custom time window
        </Typography>
      </DialogTitle>

      <Divider />

      {/* BODY */}
      <DialogContent className="pt-3">
        <Tabs
          value={active}
          onChange={handleTabChange}
          sx={{ mb: 3 }}
        >
          <Tab label="Presets" value="presets" />
          <Tab label="Advanced" value="advanced" />
        </Tabs>

        {/* ================= PRESETS ================= */}
        {active === "presets" && (
          <Box className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {[["Relative", presetsLeft], ["Other", presetsRight]].map(
              ([title, list]) => (
                <div key={title}>
                  <Typography
                    variant="caption"
                    className="text-gray-500"
                    fontWeight={600}
                  >
                    {title.toUpperCase()}
                  </Typography>

                  <div className="mt-2 space-y-1">
                    {list.map((item) => (
                      <button
                        key={item}
                        onClick={() => {
                          onSelect(item);
                          onClose();
                        }}
                        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-left text-sm
                          text-gray-800 hover:bg-blue-50 hover:border-blue-300
                          transition"
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
              )
            )}
          </Box>
        )}

        {/* ================= ADVANCED ================= */}
        {active === "advanced" && (
          <Box className="space-y-4 px-1">
            <Typography
              variant="body2"
              color="text.secondary"
            >
              Enter exact start and end times using the required format.
            </Typography>

            <TextField
              label="Earliest"
              fullWidth
              value={earliest}
              onChange={(e) => setEarliest(e.target.value)}
              error={isEarliestInvalid}
              helperText={
                isEarliestInvalid
                  ? "Example: 1/1/70 5:30:00.000 AM"
                  : " "
              }
            />

            <TextField
              label="Latest"
              fullWidth
              value={latest}
              onChange={(e) => setLatest(e.target.value)}
              error={isLatestInvalid}
              helperText={
                isLatestInvalid
                  ? "Example: 1/1/70 5:30:00.000 AM"
                  : " "
              }
            />

            <div className="flex justify-end pt-2">
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
                Apply Time Range
              </Button>
            </div>
          </Box>
        )}
      </DialogContent>

      {/* FOOTER */}
      <DialogActions className="px-6 pb-4">
        <Button onClick={onClose}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
}
