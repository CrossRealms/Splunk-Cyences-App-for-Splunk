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

  const title = mode === "edit" ? "Edit Alert" : "Create Alert";
  const subtitle =
    mode === "edit"
      ? "Update alert configuration and save changes."
      : "Create a new alert configuration.";

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      PaperProps={{
        sx: {
          mt: "72px",
          alignSelf: "flex-start",
          borderRadius: "16px",
          border: "1px solid #e5e7eb",
          boxShadow: "0 18px 45px rgba(0,0,0,0.18)",
          overflow: "hidden",
          maxHeight: "calc(100vh - 120px)",
          display: "flex",
          flexDirection: "column",
        },
      }}
    >
      {/* Header (sticky) */}
      <DialogTitle
        sx={{
          px: 2,
          py: 1.5,
          borderBottom: "1px solid #e5e7eb",
          background: "#fff",
          position: "sticky",
          top: 0,
          zIndex: 2,
        }}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="text-base sm:text-lg font-extrabold text-slate-900">
              {title}
            </div>
            <div className="mt-0.5 text-xs text-slate-500">{subtitle}</div>
          </div>

          <IconButton onClick={onClose} size="small" aria-label="Close">
            <CloseIcon />
          </IconButton>
        </div>
      </DialogTitle>

      {/* Content (scrolls) */}
      <DialogContent
        dividers
        sx={{
          p: 2,
          overflowY: "auto",
          background: "#fff",
        }}
      >
        {/* Loading state for Edit */}
        {mode === "edit" && loading && (
          <Box
            sx={{
              border: "1px dashed #e5e7eb",
              borderRadius: "14px",
              background: "#fafafa",
              px: 2,
              py: 4,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 1.5,
            }}
          >
            <CircularProgress size={22} />
            <span className="text-sm text-slate-600 font-semibold">
              Loading alert details…
            </span>
          </Box>
        )}

        {/* Error state */}
        {mode === "edit" && error && (
          <Box
            sx={{
              border: "1px solid #fecaca",
              borderRadius: "14px",
              background: "#fff1f2",
              px: 2,
              py: 1.5,
              color: "#991b1b",
              fontSize: "0.875rem",
              fontWeight: 600,
            }}
          >
            Failed to load alert details.
          </Box>
        )}

        {/* Render form */}
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

      {/* Footer (sticky) */}
      {/* <DialogActions
        sx={{
          px: 2,
          py: 1.25,
          borderTop: "1px solid #e5e7eb",
          background: "#fff",
          position: "sticky",
          bottom: 0,
          zIndex: 2,
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <div className="text-xs text-slate-500">
          {mode === "edit" ? `Editing: ${savedSearchName || "—"}` : " "}
        </div>

        <Button onClick={onClose} variant="outlined" sx={{ borderRadius: "12px" }}>
          Cancel
        </Button>
      </DialogActions> */}
    </Dialog>
  );
}