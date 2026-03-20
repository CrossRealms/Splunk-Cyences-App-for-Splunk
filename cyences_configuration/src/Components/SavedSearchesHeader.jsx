import React, { useState } from "react";
import { Button, TextField, InputAdornment } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import CreateAlertDialog from "./CustomAlertForm/CreateAlertDialog";

export default function SavedSearchesHeader({ filter, onFilterChange, refetch }) {
  const [openAlertDialog, setOpenAlertDialog] = useState(false);

  return (
    <>
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden animate-[fadeUp_.22s_ease-out_both]">
        {/* Top row */}
        <div className="px-4 py-3 sm:px-5 border-b border-slate-200 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <div className="text-base sm:text-lg font-extrabold text-slate-900">
              Cyences Alerts
            </div>
            <div className="mt-1 text-xs sm:text-sm text-slate-500">
              Manage alert configurations
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700">
              {filter?.trim() ? "Filtered" : "All alerts"}
            </span>

            <Button
              variant="contained"
              startIcon={<AddIcon />}
              size="small"
              onClick={() => setOpenAlertDialog(true)}
              sx={{
                backgroundColor: "black",
                borderRadius: "12px",
                textTransform: "none",
                fontWeight: 700,
                boxShadow: "none",
              }}
            >
              New Alert
            </Button>
          </div>
        </div>

        {/* Filter row */}
        <div className="px-3 py-3 sm:px-5 flex justify-end">
          <TextField
            size="small"
            placeholder="Search alerts…"
            value={filter}
            onChange={(e) => onFilterChange(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" className="text-slate-400" />
                </InputAdornment>
              ),
            }}
            sx={{
              width: { xs: "100%", sm: 320 },
              backgroundColor: "#fff",
              "& .MuiOutlinedInput-root": { borderRadius: "12px" },
            }}
          />
        </div>
      </div>

      {/* Dialog */}
      <CreateAlertDialog
        open={openAlertDialog}
        onClose={() => setOpenAlertDialog(false)}
        mode="add"
        refetch={refetch}
      />

      {/* tiny keyframes (safe even if tailwind config doesn’t include it) */}
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
}