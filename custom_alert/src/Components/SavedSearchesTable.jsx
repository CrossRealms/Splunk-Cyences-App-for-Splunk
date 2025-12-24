import React, { useMemo, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Button, Link, IconButton, Tooltip, Stack, Switch } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CreateAlertDialog from "./CustomAlertForm/CreateAlertDialog";
import DeleteAlert from "./CustomAlertForm/DeleteAlert";
import { createOrUpdateSavedSearch } from "../utils/api";
import { useToast } from "../SnackbarProvider";

export default function SavedSearchesTable({ rows, refetch }) {
  const [openAlertDialog, setOpenAlertDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedSearchName, setSelectedSearchName] = useState(null);
  const [deleteRow, setDeleteRow] = useState(null);
  const [togglingId, setTogglingId] = useState(null);
  const { showToast } = useToast();

  const handleDeleteClick = (row) => {
    setDeleteRow(row);
    setOpenDeleteDialog(true);
  };

  const handleEdit = (row) => {
    setSelectedSearchName(row.id);
    setOpenAlertDialog(true);
  };

  const handleToggleStatus = async (row) => {
    const isEnabled = row.Status === "Enabled";

    try {
      setTogglingId(row.id);

      await createOrUpdateSavedSearch(row.id, { disabled: isEnabled }, showToast);
      showToast(`Alert "${row.title}" ${isEnabled ? "disabled" : "enabled"} successfully`, "success");

      refetch(); // refresh table
    } catch (error) {
      console.error("Failed to toggle alert status", error);
      showToast("Failed to toggle alert status", "error");
    } finally {
      setTogglingId(null);
    }
  };

  const handleOpenSearch = (params) => {
    // if (!splQuery) return;

    const port = window.location.port || "8000";
    const encodedQuery = encodeURIComponent(params?.row?.search || "");

    const url = `${window.location.protocol}//${window.location.hostname}:${port}/en-US/app/cyences_app_for_splunk/search?q=${encodedQuery}`;

    window.open(url, "_blank", "noopener,noreferrer");
  };


  const columns = useMemo(
    () => [
      {
        field: "title",
        headerName: "Name",
        flex: 2,
        renderCell: (params) => (
          <div>
            <Link
              component="button"
              underline="hover"
              fontSize={14}
              onClick={(e) => {
                e.stopPropagation(); // 🚨 VERY IMPORTANT for DataGrid
                handleOpenSearch(params);
              }}
            >
              {params.value}
            </Link>

            {params?.row?.description && (
              <div className="text-xs text-gray-500">
                {params.row.description}
              </div>
            )}
          </div>
        ),
      },
      {
        flex: 1.5,
        field: "description",
        headerName: "Description",
        width: 120,
      },
      {
        field: "next_scheduled_time",
        headerName: "Next Scheduled Time",
        flex: 1.5,
        valueGetter: (value) => value || "—",
      },
      // {
      //   field: "Owner",
      //   headerName: "Owner",
      //   width: 140,
      // },
      // {
      //   field: "App",
      //   headerName: "App",
      //   width: 200,
      // },
      // {
      //   field: "Sharing",
      //   headerName: "Sharing",
      //   width: 120,
      // },
      {
        field: "Status",
        headerName: "Status",
        width: 160,
        renderCell: (params) => {
          const isEnabled = params.value === "Enabled";
          const isLoading = togglingId === params.row.id;

          return (
            <Stack direction="row" alignItems="center" spacing={1}>
              {isLoading ? (
                <CircularProgress size={16} />
              ) : (
                <Switch
                  size="small"
                  checked={isEnabled}
                  onChange={() => handleToggleStatus(params.row)}
                  color="success"
                />
              )}

              <span
                className={`text-sm ${isEnabled ? "text-green-600" : "text-red-600"
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
        width: 140,
        sortable: false,
        renderCell: (params) => (
          <Stack direction="row" spacing={0.5}>
            {/* Edit */}
            <Tooltip title="Edit Alert">
              <IconButton
                size="small"
                onClick={() => handleEdit(params.row)}
              >
                <EditIcon fontSize="small" />
              </IconButton>
            </Tooltip>

            {/* Delete */}
            <Tooltip title="Delete Alert">
              <IconButton
                size="small"
                color="error"
                onClick={() => handleDeleteClick(params.row)}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Stack>
        ),
      },

    ],
    []
  );

  return (
    <>
      <div className="h-[600px] w-full">
        <DataGrid
          rows={rows}               // 👈 keep original id
          columns={columns}
          disableRowSelectionOnClick
          pageSizeOptions={[10, 20, 50]}
          initialState={{
            pagination: { paginationModel: { pageSize: 10, page: 0 } },
          }}
          sx={{
            border: 0,
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: "#f5f6f7",
              fontWeight: 600,
            },
          }}
        />
      </div>

      {/* ✅ SINGLE dialog instance */}
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
      {
        openDeleteDialog && (
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
        )
      }
    </>
  );
}
