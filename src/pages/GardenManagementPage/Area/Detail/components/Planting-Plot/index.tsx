import {
  ActionIcon,
  Anchor,
  Button,
  Divider,
  Group,
  Select,
  Stack,
  Text,
  Tooltip,
} from "@mantine/core";
import Table from "../../../../../../components/Table";
import { type MRT_ColumnDef } from "mantine-react-table";
import { useMemo } from "react";
import {
  IconDatabaseExport,
  IconPencil,
  IconPlus,
  IconTableImport,
  IconTrash,
} from "@tabler/icons-react";
type PlantingLot = {
  name: string;
  code: string;
  area: number;
  rowCount: number;
  treeCount: number;
  map: string;
};

const rawData: PlantingLot[] = [
  {
    name: "Lô A01",
    code: "A01",
    area: 200,
    rowCount: 10,
    treeCount: 100,
    map: "Import.csv",
  },
  {
    name: "Lô A02",
    code: "A02",
    area: 200,
    rowCount: 10,
    treeCount: 60,
    map: "Import.csv",
  },
  {
    name: "Lô A03",
    code: "A03",
    area: 200,
    rowCount: 12,
    treeCount: 60,
    map: "Import.csv",
  },
  {
    name: "Lô A04",
    code: "A04",
    area: 200,
    rowCount: 12,
    treeCount: 80,
    map: "Import.csv",
  },
];
const PlantingPlot = () => {
  const handleEdit = (row: PlantingLot) => {
    console.log("Editing", row);
    // open modal or form
  };

  const handleDelete = (row: PlantingLot) => {
    console.log("Deleting", row);
    // show confirmation and delete logic
  };
  const columns = useMemo<MRT_ColumnDef<PlantingLot>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Tên lô trồng",
        Cell: ({ row }) => (
          <Stack gap={5}>
            <Text>{row.original.name}</Text>
            <Text style={{ fontSize: 12, color: "#888" }}>
              {row.original.code}
            </Text>
          </Stack>
        ),
      },
      {
        accessorKey: "area",
        header: "Diện tích (m²)",
      },
      {
        accessorKey: "rowCount",
        header: "Tổng số hàng",
      },
      {
        accessorKey: "treeCount",
        header: "Tổng số cây",
      },
      {
        accessorKey: "map",
        header: "Định vị",
        Cell: ({ cell }) => (
          <Anchor href="#" style={{ color: "green" }}>
            📎 {cell.getValue<string>()}
          </Anchor>
        ),
      },
      {
        id: "actions", // required when no accessorKey
        header: "",
        size: 80,
        enableColumnActions: false, // ✅ disables vertical dots menu
        enableColumnOrdering: false, // ✅ disables drag-reorder
        enableColumnResizing: false, // optional: disables resize handle
        enableHiding: false,
        Cell: ({ row }) => (
          <Group gap="xs">
            <Tooltip label="Chỉnh sửa">
              <ActionIcon
                variant="subtle"
                color="green"
                onClick={() => handleEdit(row.original)}
              >
                <IconPencil size={16} />
              </ActionIcon>
            </Tooltip>
            <Tooltip label="Xóa">
              <ActionIcon
                variant="subtle"
                color="red"
                onClick={() => handleDelete(row.original)}
              >
                <IconTrash size={16} />
              </ActionIcon>
            </Tooltip>
          </Group>
        ),
      },
    ],
    []
  );
  return (
    <Stack w={"100%"}>
      <Group justify="space-between">
        <Text fz={"h3"} fw={"bold"}>
          Lô trồng
        </Text>
        <Group>
          <Button variant="transparent" c={"black"} bd={"none"}>
            <Group align="center" gap={4}>
              <IconTableImport size={18} />
              <Text>Nhập file</Text>
            </Group>
          </Button>
          <Divider orientation="vertical" />
          <Button variant="transparent" c={"black"} bd={"none"}>
            <Group align="center" gap={4}>
              <IconDatabaseExport size={18} />
              <Text>Xuất file</Text>
            </Group>
          </Button>
          <Divider orientation="vertical" />
          <Button variant="transparent" bd={"none"}>
            <Group align="center" gap={4}>
              <IconPlus size={18} />
              <Text>Thêm mới</Text>
            </Group>
          </Button>
        </Group>
      </Group>
      <Group>
        <Select placeholder="Tất cả trạng thái" radius={4} data={[]} />
      </Group>
      <Table columns={columns} data={rawData} />
    </Stack>
  );
};
export default PlantingPlot;
