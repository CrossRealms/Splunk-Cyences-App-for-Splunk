import React, { useMemo, useState } from "react";
import {
  DataGrid,
  GridOverlay,
} from "@mui/x-data-grid";
import {
  Button,
  Link,
  IconButton,
  Tooltip,
  Stack,
  Switch,
  CircularProgress,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CreateAlertDialog from "./CustomAlertForm/CreateAlertDialog";
import DeleteAlert from "./CustomAlertForm/DeleteAlert";
import { createOrUpdateSavedSearch } from "../utils/api";
import { useToast } from "../SnackbarProvider";

/* ---------- Empty State ---------- */
function EmptyState() {
  return (
    <GridOverlay>
      <div className="flex h-full flex-col items-center justify-center text-gray-500">
        <div className="text-sm font-medium">No alerts found</div>
        <div className="text-xs mt-1">
          Create a new alert to get started
        </div>
      </div>
    </GridOverlay>
  );
}

export default function SavedSearchesTable({ rows, refetch }) {
  const [openAlertDialog, setOpenAlertDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedSearchName, setSelectedSearchName] = useState(null);
  const [deleteRow, setDeleteRow] = useState(null);
  const [togglingId, setTogglingId] = useState(null);
  const { showToast } = useToast();

  const handleEdit = (row) => {
    setSelectedSearchName(row.id);
    setOpenAlertDialog(true);
  };

  const handleDeleteClick = (row) => {
    setDeleteRow(row);
    setOpenDeleteDialog(true);
  };

  const handleToggleStatus = async (row) => {
    const isEnabled = row.Status === "Enabled";

    try {
      setTogglingId(row.id);
      await createOrUpdateSavedSearch(
        row.id,
        { disabled: isEnabled },
        showToast
      );
      showToast(
        `Alert "${row.title}" ${
          isEnabled ? "disabled" : "enabled"
        } successfully`,
        "success"
      );
      refetch();
    } catch {
      showToast("Failed to toggle alert status", "error");
    } finally {
      setTogglingId(null);
    }
  };

  const handleOpenSearch = (params) => {
    const port = window.location.port || "8000";
    const encodedQuery = encodeURIComponent(params?.row?.search || "");
    const url = `${window.location.protocol}//${window.location.hostname}:${port}/en-US/app/cyences_app_for_splunk/search?q=${encodedQuery}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const columns = useMemo(
    () => [
      {
        field: "title",
        headerName: "Alert Name",
        flex: 2.2,
        renderCell: (params) => (
          <div className="leading-tight">
            <Link
              component="button"
              underline="hover"
              fontSize={14}
              fontWeight={500}
              onClick={(e) => {
                e.stopPropagation();
                handleOpenSearch(params);
              }}
            >
              {params.value}
            </Link>

            {params?.row?.description && (
              <div className="mt-0.5 text-xs text-gray-500 line-clamp-2">
                {params.row.description}
              </div>
            )}
          </div>
        ),
      },
      {
        field: "next_scheduled_time",
        headerName: "Next Scheduled Time",
        flex: 1.4,
        valueGetter: (value) => value || "—",
      }, 
      {
        field: "Status",
        headerName: "Status",
        width: 170,
        renderCell: (params) => {
          const isEnabled = params.value === "Enabled";
          const isLoading = togglingId === params.row.id;

          return (
            <Stack direction="row" alignItems="center" spacing={1}>
              {isLoading ? (
                <CircularProgress size={14} />
              ) : (
                <Switch
                  size="small"
                  checked={isEnabled}
                  onChange={() =>
                    handleToggleStatus(params.row)
                  }
                  color="success"
                />
              )}

              <span
                className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                  isEnabled
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {isEnabled ? "Enabled" : "Disabled"}
              </span>
            </Stack>
          );
        },
      },
      {
        field: "actions",
        headerName: "Actions",
        width: 120,
        sortable: false,
        align: "right",
        headerAlign: "right",
        renderCell: (params) => (
          <Stack direction="row" spacing={0.5}>
            <Tooltip title="Edit alert">
              <IconButton
                size="small"
                onClick={() => handleEdit(params.row)}
              >
                <EditIcon fontSize="small" />
              </IconButton>
            </Tooltip>

            <Tooltip title="Delete alert">
              <IconButton
                size="small"
                color="error"
                onClick={() =>
                  handleDeleteClick(params.row)
                }
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Stack>
        ),
      },
    ],
    [togglingId]
  );

  return (
    <>
      {/* Table Card */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="h-[600px] w-full">
          <DataGrid
            rows={rows}
            columns={columns}
            disableRowSelectionOnClick
            pageSizeOptions={[10, 20, 50]}
            slots={{ noRowsOverlay: EmptyState }}
            initialState={{
              pagination: {
                paginationModel: { pageSize: 10, page: 0 },
              },
            }}
            sx={{
              border: 0,
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: "#f8fafc",
                fontWeight: 600,
                borderBottom: "1px solid #e5e7eb",
              },
              "& .MuiDataGrid-row": {
                borderBottom: "1px solid #f1f5f9",
              },
              "& .MuiDataGrid-row:hover": {
                backgroundColor: "#f9fafb",
              },
              "& .MuiDataGrid-cell": {
                outline: "none !important",
              },
            }}
          />
        </div>
      </div>

      {/* Dialogs */}
      {openAlertDialog && (
        <CreateAlertDialog
          open={openAlertDialog}
          onClose={() => {
            setOpenAlertDialog(false);
            setSelectedSearchName(null);
          }}
          mode="edit"
          savedSearchName={selectedSearchName}
          refetch={refetch}
        />
      )}

      {openDeleteDialog && (
        <DeleteAlert
          open={openDeleteDialog}
          onClose={() => {
            setOpenDeleteDialog(false);
            setDeleteRow(null);
          }}
          deleteRow={deleteRow}
          setDeleteRow={setDeleteRow}
          refetch={refetch}
        />
      )}
    </>
  );
}
