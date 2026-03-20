import React, { useCallback, useMemo, useState } from "react";
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

function PresetButton({ label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-left text-sm
                 text-slate-800 hover:bg-slate-50 hover:border-slate-300
                 active:scale-[0.99] transition"
      style={{
        outline: "none",
      }}
    >
      {label}
    </button>
  );
}

export default function TimeRangeDialog({ open, onClose, onSelect }) {
  const [active, setActive] = useState("presets");
  const [earliest, setEarliest] = useState("");
  const [latest, setLatest] = useState("");

  const dateRegex = useMemo(
    () =>
      /^(0?[1-9]|1[0-2])\/(0?[1-9]|[12][0-9]|3[01])\/\d{2}\s(0?[1-9]|1[0-2]):[0-5][0-9]:[0-5][0-9]\.\d{3}\s(AM|PM)$/i,
    []
  );

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
      PaperProps={{
        sx: {
          mt: "80px",
          alignSelf: "flex-start",
          borderRadius: "16px",
          border: "1px solid #e5e7eb",
          boxShadow: "0 18px 45px rgba(0,0,0,0.18)",
          overflow: "hidden",
        },
      }}
    >
      {/* HEADER */}
      <DialogTitle
        sx={{
          py: 2,
          px: 2.5,
          background: "#fff",
        }}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <Typography variant="h6" sx={{ fontWeight: 800, color: "#0f172a" }}>
              Select time range
            </Typography>
            <Typography variant="body2" sx={{ color: "#64748b", mt: 0.25 }}>
              Choose a preset or define a custom time window.
            </Typography>
          </div>

          <Button
            onClick={onClose}
            variant="outlined"
            size="small"
            sx={{
              borderRadius: "12px",
              textTransform: "none",
              fontWeight: 700,
              borderColor: "#e5e7eb",
              color: "#0f172a",
              background: "#fff",
              "&:hover": { background: "#f8fafc", borderColor: "#e2e8f0" },
            }}
          >
            Close
          </Button>
        </div>
      </DialogTitle>

      <Divider />

      {/* BODY */}
      <DialogContent
        sx={{
          p: 2.5,
          background: "#fff",
        }}
      >
        <Tabs
          value={active}
          onChange={handleTabChange}
          sx={{
            mb: 2,
            minHeight: 40,
            "& .MuiTab-root": {
              minHeight: 40,
              textTransform: "none",
              fontWeight: 800,
              borderRadius: "12px",
              px: 2,
            },
            "& .MuiTabs-indicator": { display: "none" },
            "& .MuiTab-root.Mui-selected": {
              background: "#0f172a",
              color: "#fff",
            },
            "& .MuiTab-root:not(.Mui-selected)": {
              background: "#f8fafc",
              color: "#0f172a",
              border: "1px solid #e5e7eb",
            },
          }}
        >
          <Tab label="Presets" value="presets" />
          <Tab label="Advanced" value="advanced" />
        </Tabs>

        {/* ================= PRESETS ================= */}
        {active === "presets" && (
          <Box className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {[
              ["Relative", presetsLeft],
              ["Other", presetsRight],
            ].map(([title, list]) => (
              <div key={title} className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                <div className="px-1 pb-2">
                  <Typography
                    variant="caption"
                    sx={{ fontWeight: 900, color: "#64748b", letterSpacing: 0.8 }}
                  >
                    {String(title).toUpperCase()}
                  </Typography>
                </div>

                <div className="space-y-2">
                  {list.map((item) => (
                    <PresetButton
                      key={item}
                      label={item}
                      onClick={() => {
                        onSelect(item);
                        onClose();
                      }}
                    />
                  ))}
                </div>
              </div>
            ))}
          </Box>
        )}

        {/* ================= ADVANCED ================= */}
        {active === "advanced" && (
          <Box className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <Typography variant="body2" sx={{ color: "#64748b", mb: 2 }}>
              Enter exact start and end times using the required format.
            </Typography>

            <div className="grid grid-cols-1 gap-12 sm:grid-cols-2">
              <TextField
                label="Earliest"
                fullWidth
                value={earliest}
                onChange={(e) => setEarliest(e.target.value)}
                error={isEarliestInvalid}
                helperText={
                  isEarliestInvalid ? "Example: 1/1/70 5:30:00.000 AM" : " "
                }
                size="small"
                sx={{
                  "& .MuiOutlinedInput-root": { borderRadius: "12px", background: "#fff" },
                }}
              />

              <TextField
                label="Latest"
                fullWidth
                value={latest}
                onChange={(e) => setLatest(e.target.value)}
                error={isLatestInvalid}
                helperText={
                  isLatestInvalid ? "Example: 1/1/70 5:30:00.000 AM" : " "
                }
                size="small"
                sx={{
                  "& .MuiOutlinedInput-root": { borderRadius: "12px", background: "#fff" },
                }}
              />
            </div>

            <div className="flex justify-end pt-2">
              <Button
                variant="contained"
                disabled={!earliest || !latest || isEarliestInvalid || isLatestInvalid}
                onClick={() => {
                  const finalValue = `${earliest} - ${latest}`;
                  onSelect(finalValue);
                  onClose();
                }}
                sx={{
                  borderRadius: "12px",
                  textTransform: "none",
                  fontWeight: 900,
                  px: 2,
                }}
              >
                Apply time range
              </Button>
            </div>
          </Box>
        )}
      </DialogContent>

      {/* FOOTER */}
      <DialogActions
        sx={{
          px: 2.5,
          py: 2,
          background: "#fff",
          borderTop: "1px solid #e5e7eb",
        }}
      >
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{
            borderRadius: "12px",
            textTransform: "none",
            fontWeight: 800,
            borderColor: "#e5e7eb",
            color: "#0f172a",
            "&:hover": { background: "#f8fafc", borderColor: "#e2e8f0" },
          }}
        >
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}