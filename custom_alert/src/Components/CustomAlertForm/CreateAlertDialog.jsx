import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  CircularProgress,
  Box,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CreateAlertForm from "./CustomAlertForm";
import useSavedSearchById from "../../hooks/useSavedSearchByName";

export default function CreateAlertDialog({
  open,
  onClose,
  mode = "add",
  savedSearchName,
  refetch,
}) {
  const { data, loading, error } = useSavedSearchById(savedSearchName, {
    enabled: mode === "edit" && open,
  });

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
    >
      <DialogTitle className="flex justify-between items-center">
        {mode === "edit" ? "Edit Alert" : "Create Alert"}
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        {/* ⏳ Loading state for Edit */}
        {mode === "edit" && loading && (
          <Box className="flex justify-center py-10">
            <CircularProgress />
          </Box>
        )}

        {/*  Error state */}
        {mode === "edit" && error && (
          <Box className="text-red-600 text-sm">
            Failed to load alert details.
          </Box>
        )}

        {/*  Render form */}
        {(!loading || mode === "add") && (
          <CreateAlertForm
            mode={mode}
            initialData={data?.content}
            onClose={onClose}
            savedSearchName={savedSearchName}
            refetch={refetch}
          />
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} variant="outlined">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}
