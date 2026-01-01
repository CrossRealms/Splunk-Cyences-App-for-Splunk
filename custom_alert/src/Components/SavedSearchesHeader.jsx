import React, { useState } from 'react';
import { Button, TextField } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CreateAlertDialog from './CustomAlertForm/CreateAlertDialog';

export default function SavedSearchesHeader({ filter, onFilterChange, refetch }) {
    const [openAlertDialog, setOpenAlertDialog] = useState(false);

  return (
    <div className="mb-6 space-y-4">
      {/* Title + Actions */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h1 className="text-xl font-semibold">
            Custom Alerts
          </h1>
          {/* <p className="text-sm text-gray-500">
            Searches, reports, and alerts are saved searches created from pivot or the search page.
          </p> */}
        </div>

        <div className="flex gap-2">
          {/* <Button
            variant="outlined"
            startIcon={<AddIcon />}
            size="small"
          >
            New Report
          </Button> */}
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            size="small"
            onClick={() => setOpenAlertDialog(true)}
          >
            New Alert
          </Button>
        </div>
      </div>

      {/* Filter bar */}
      <div className="flex justify-end">
        <TextField
          size="small"
          placeholder="filter"
          value={filter}
          onChange={(e) => onFilterChange(e.target.value)}
          sx={{ width: 240 }}
        />
      </div>
      {/* Dialog */}
      <CreateAlertDialog
        open={openAlertDialog}
        onClose={() => setOpenAlertDialog(false)}
        mode="add"
        refetch={refetch}
      />
    </div>
  );
}
