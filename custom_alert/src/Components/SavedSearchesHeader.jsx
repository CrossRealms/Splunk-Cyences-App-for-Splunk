import React, { useState } from "react";
import { Button, TextField } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import CreateAlertDialog from "./CustomAlertForm/CreateAlertDialog";

export default function SavedSearchesHeader({ filter, onFilterChange, refetch }) {
  const [openAlertDialog, setOpenAlertDialog] = useState(false);

  return (
    <>
      {/* Header Container */}
      <div className="mb-6 rounded-xl border border-gray-200 bg-white px-4 py-4 shadow-sm sm:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Title Section */}
          <div>
            <h1 className="text-lg font-semibold text-gray-900 sm:text-xl">
              Cyences Alerts
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage alert configurations
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              size="small"
              onClick={() => setOpenAlertDialog(true)}
              className="!rounded-lg"
            >
              New Alert
            </Button>
          </div>
        </div>

        {/* Divider */}
        <div className="my-4 h-px bg-gray-100" />

        {/* Filter Bar */}
        <div className="flex justify-end">
          <TextField
            size="small"
            placeholder="Search alerts…"
            value={filter}
            onChange={(e) => onFilterChange(e.target.value)}
            InputProps={{
              startAdornment: (
                <SearchIcon className="mr-2 text-gray-400" fontSize="small" />
              ),
            }}
            sx={{
              width: { xs: "100%", sm: 260 },
              backgroundColor: "#fff",
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
    </>
  );
}
