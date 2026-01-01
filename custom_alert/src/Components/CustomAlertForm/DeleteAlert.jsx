import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from "@mui/material";
import { deleteSavedSearchByName } from "../../utils/api";
import { useToast } from "../../SnackbarProvider";

export default function DeleteAlert({ open, onClose, deleteRow, setDeleteRow, refetch }) {

    const { showToast } = useToast();
    const handleConfirmDelete = async () => {
        if (!deleteRow?.id) return;

        try {
            await deleteSavedSearchByName(deleteRow.id, showToast);

            showToast("Alert deleted successfully", "success");

            // Refresh table data
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
        >
            <DialogTitle>Delete Alert</DialogTitle>

            <DialogContent>
                <Typography>
                    Are you sure you want to delete{" "}
                    <strong>{deleteRow?.id}</strong>?
                </Typography>
            </DialogContent>

            <DialogActions>
                <Button onClick={() => setDeleteRow(null)}>
                    Cancel
                </Button>
                <Button
                    color="error"
                    variant="contained"
                    onClick={handleConfirmDelete}
                >
                    Delete
                </Button>
            </DialogActions>
        </Dialog>

    )
}