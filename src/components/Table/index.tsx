import {
  MantineReactTable,
  useMantineReactTable,
  type MRT_ColumnDef,
} from "mantine-react-table";
import { Box } from "@mantine/core";
import {
  IconArrowDown,
  IconArrowUp,
  IconFilter,
  IconFilterOff,
  IconSearch,
  IconSortAZ,
  IconX,
} from "@tabler/icons-react";

type Props<T extends Record<string, unknown>> = {
  data: T[];
  columns: MRT_ColumnDef<T>[];
};

const Table = <T extends Record<string, unknown>>({
  data,
  columns,
}: Props<T>) => {
  const table = useMantineReactTable({
    columns,
    data,

    enableGlobalFilter: true,
    enableSorting: true,
    enableRowNumbers: true,
    enableDensityToggle: false,
    enableRowSelection: true,
    enableSelectAll: true,

    initialState: {
      showGlobalFilter: true,
      pagination: { pageIndex: 0, pageSize: 10 },
    },

    icons: {
      IconSortDescending: () => <IconArrowDown size={14} />,
      IconSortAscending: () => <IconArrowUp size={14} />,
      IconArrowsSort: () => <IconSortAZ size={14} />,
      IconSearch: () => <IconSearch size={14} />,
      IconFilter: () => <IconFilter size={14} />,
      IconFilterOff: () => <IconFilterOff size={14} />,
      IconClearAll: () => <IconX size={14} />,
    },
    mantineColumnActionsButtonProps: {
      variant: "transparent", // optional for a clean look
      color: "gray",
      styles: (theme) => ({
        root: {
          transition: "all 0.2s ease",
          border: "0px solid transparent",
          borderRadius: theme.radius.md,

          "&:hover": {
            backgroundColor: theme.colors.gray[2],
          },
        },
        icon: {
          fontSize: "14px", // default size
          "&:hover": {
            fontSize: "16px", // increase on hover
          },
        },
      }),
    },
    mantinePaperProps: {
      style: {
        border: "0.5px solid #dee2e6",
        overflow: "hidden",
        borderRadius: "4px",
      },
    },
    mantineTableContainerProps: {
      style: {
        maxHeight: "700px",
        minWidth: "100%", // ✅ Full width
        maxWidth: "100%", // ✅ Remove the fixed 1000px
        overflowY: "auto",
      },
    },
    localization: {
      search: "Tìm kiếm...",
      showHideColumns: "Ẩn/Hiện cột",
      sortByColumnAsc: "Sắp xếp tăng dần",
      sortByColumnDesc: "Sắp xếp giảm dần",
      noRecordsToDisplay: "Không có dữ liệu để hiển thị",
      clearSort: "Xóa sắp xếp",
      clearFilter: "Xóa lọc",
      filterByColumn: "Lọc theo cột",
      rowsPerPage: "Số dòng mỗi trang",
      hideAll: "Ẩn tất cả",
      hideColumn: "Ẩn cột",
      showAll: "Hiển thị tất cả",
      showHideFilters: "Hiển thị/ Ẩn lọc",
      toggleFullScreen: "Toàn màn hình",
      of: "/",
      clearSelection: "Xoá chọn",
      selectedCountOfRowCountRowsSelected: "",
    },

    mantineTableProps: {
      striped: true,
      highlightOnHover: false,
      verticalSpacing: "sm",
      horizontalSpacing: "sm",
      withColumnBorders: false,

      onSelect: () => {},
      style: {
        fontSize: "16px",
        fontFamily: "MyFont",
        backgroundColor: "#fcfcfc",
      },
    },
  });
  if (!Array.isArray(data) || !Array.isArray(columns)) {
    return null;
  }

  if (data.length === 0) {
    return (
      <Box w="100%" p="lg" style={{ textAlign: "center", color: "#888" }}>
        Không có dữ liệu để hiển thị
      </Box>
    );
  }
  return (
    <Box w={"100%"}>
      <MantineReactTable table={table} />
    </Box>
  );
};

export default Table;
