import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  Divider,
  IconButton,
  Box,
} from "@mui/material";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import CloseIcon from "@mui/icons-material/Close";
import { deleteSavedSearchByName } from "../../utils/api";
import { useToast } from "../../SnackbarProvider";

export default function DeleteAlert({
  open,
  onClose,
  deleteRow,
  setDeleteRow,
  refetch,
}) {
  const { showToast } = useToast();

  const handleConfirmDelete = async () => {
    if (!deleteRow?.id) return;

    try {
      await deleteSavedSearchByName(deleteRow.id, showToast);
      showToast("Alert deleted successfully", "success");
      refetch && refetch();
      onClose();
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("Failed to delete alert", err);
      showToast("Failed to delete alert", "error");
    } finally {
      setDeleteRow(null);
    }
  };

  const handleCancel = () => {
    setDeleteRow(null);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleCancel}
      maxWidth="xs"
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
      {/* Header */}
      <DialogTitle
        sx={{
          py: 2,
          px: 2.5,
          background: "#fff",
        }}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-2">
            <WarningAmberIcon className="text-red-600" />
            <div>
              <div className="text-base font-extrabold text-slate-900">
                Delete alert
              </div>
              <div className="mt-0.5 text-sm text-slate-500">
                This action cannot be undone.
              </div>
            </div>
          </div>

          <IconButton
            onClick={handleCancel}
            size="small"
            sx={{
              borderRadius: "12px",
              border: "1px solid #e5e7eb",
              background: "#fff",
              "&:hover": { background: "#f8fafc" },
            }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </div>
      </DialogTitle>

      <Divider />

      {/* Content */}
      <DialogContent sx={{ p: 2.5, background: "#fff" }}>
        <Typography sx={{ fontSize: 13, color: "#334155" }}>
          You are about to permanently delete this alert:
        </Typography>

        <Box
          sx={{
            mt: 2,
            borderRadius: "14px",
            border: "1px solid #fecaca",
            background: "#fff1f2",
            px: 1.5,
            py: 1.25,
          }}
        >
          <Typography
            sx={{
              fontSize: 13,
              fontWeight: 900,
              color: "#991b1b",
              wordBreak: "break-word",
            }}
          >
            {deleteRow?.id || "—"}
          </Typography>
        </Box>

        <Typography sx={{ mt: 1.5, fontSize: 12, color: "#64748b" }}>
          If you’re not sure, click <b>Cancel</b>.
        </Typography>
      </DialogContent>

      {/* Actions */}
      <DialogActions
        sx={{
          px: 2.5,
          py: 2,
          background: "#fff",
          borderTop: "1px solid #e5e7eb",
          gap: 1,
        }}
      >
        <Button
          onClick={handleCancel}
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

        <Button
          color="error"
          variant="contained"
          onClick={handleConfirmDelete}
          sx={{
            borderRadius: "12px",
            textTransform: "none",
            fontWeight: 900,
            boxShadow: "none",
          }}
        >
          Delete alert
        </Button>
      </DialogActions>
    </Dialog>
  );
}