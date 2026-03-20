import React, { useMemo, useState } from "react";
import { DataGrid, GridOverlay } from "@mui/x-data-grid";
import {
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
      <div className="flex h-full flex-col items-center justify-center text-slate-500">
        <div className="text-sm font-semibold text-slate-700">No alerts found</div>
        <div className="mt-1 text-xs text-slate-500">Create a new alert to get started</div>
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
      await createOrUpdateSavedSearch(row.id, { disabled: isEnabled }, showToast);
      showToast(
        `Alert "${row.title}" ${isEnabled ? "disabled" : "enabled"} successfully`,
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
              style={{color: 'black'}}
              fontWeight={600}
              onClick={(e) => {
                e.stopPropagation();
                handleOpenSearch(params);
              }}
            >
              {params.value}
            </Link>

            {params?.row?.description && (
              <div className="mt-0.5 line-clamp-2 text-xs text-slate-500">
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
        width: 190,
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
                  onChange={() => handleToggleStatus(params.row)}
                  color="success"
                />
              )}

              <span
                className={[
                  "rounded-full px-2 py-0.5 text-xs font-semibold",
                  isEnabled
                    ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
                    : "bg-rose-50 text-rose-700 ring-1 ring-rose-200",
                ].join(" ")}
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
        width: 130,
        sortable: false,
        align: "right",
        headerAlign: "right",
        renderCell: (params) => (
          <Stack direction="row" spacing={0.5}>
            <Tooltip title="Edit alert">
              <IconButton size="small" onClick={() => handleEdit(params.row)}>
                <EditIcon style={{color: 'black'}} fontSize="small" />
              </IconButton>
            </Tooltip>

            <Tooltip title="Delete alert">
              <IconButton
                size="small"
                color="error"
                disabled={params?.row?.severity !== 6}
                onClick={() => handleDeleteClick(params.row)}
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
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* Modern Table Card */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm animate-[fadeUp_.22s_ease-out_both]">
        {/* Card header */}
        <div className="flex flex-col gap-2 border-b border-slate-200 bg-slate-50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <div className="text-sm font-extrabold text-slate-900">Alerts</div>
            <div className="mt-0.5 text-xs text-slate-500">
              Click an alert name to open the search. Use the toggle to enable/disable.
            </div>
          </div>

          <span className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700">
            {rows?.length ?? 0} alert{(rows?.length ?? 0) === 1 ? "" : "s"}
          </span>
        </div>

        {/* Grid area (fixed height, internal scroll only) */}
        <div className="h-[600px] w-full">
          <DataGrid
            rows={rows}
            columns={columns}
            disableRowSelectionOnClick
            pageSizeOptions={[10, 20, 50]}
            slots={{ noRowsOverlay: EmptyState }}
            initialState={{
              pagination: { paginationModel: { pageSize: 10, page: 0 } },
            }}
            sx={{
              border: 0,
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: "#ffffff",
                fontWeight: 700,
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
              "& .MuiDataGrid-footerContainer": {
                borderTop: "1px solid #e5e7eb",
                background: "#fff",
              },
            }}
          />
        </div>
      </div>

      {/* Dialogs (unchanged) */}
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