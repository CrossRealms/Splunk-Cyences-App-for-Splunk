import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  Divider,
} from "@mui/material";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
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
      console.error("Failed to delete alert", err);
      showToast("Failed to delete alert", "error");
    } finally {
      setDeleteRow(null);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
    >
      {/* Title */}
      <DialogTitle className="flex items-center gap-2">
        <WarningAmberIcon className="text-red-600" />
        <span className="font-semibold">Delete Alert</span>
      </DialogTitle>

      <Divider />

      {/* Content */}
      <DialogContent className="pt-4">
        <Typography className="text-sm text-gray-700">
          You are about to permanently delete the alert:
        </Typography>

        <div className="mt-3 rounded-lg border border-red-100 bg-red-50 px-3 py-2">
          <Typography className="text-sm font-medium text-red-700">
            {deleteRow?.id}
          </Typography>
        </div>

        <Typography className="mt-3 text-xs text-gray-500">
          This action cannot be undone.
        </Typography>
      </DialogContent>

      {/* Actions */}
      <DialogActions className="px-6 pb-4">
        <Button
          onClick={() => {
            setDeleteRow(null);
            onClose();
          }}
        >
          Cancel
        </Button>

        <Button
          color="error"
          variant="contained"
          onClick={handleConfirmDelete}
        >
          Delete Alert
        </Button>
      </DialogActions>
    </Dialog>
  );
}
