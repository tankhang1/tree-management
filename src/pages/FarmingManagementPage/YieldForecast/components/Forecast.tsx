import {
  ActionIcon,
  Box,
  Button,
  Divider,
  Group,
  Select,
  Stack,
  Text,
  Tooltip,
} from "@mantine/core";
import Table from "../../../../components/Table";
import { type MRT_ColumnDef } from "mantine-react-table";
import { useMemo } from "react";
import {
  IconCalendar,
  IconDatabaseExport,
  IconPencil,
  IconPlus,
  IconTableImport,
  IconTrash,
} from "@tabler/icons-react";
import { DatePickerInput } from "@mantine/dates";
type Forecast = {
  id: string;
  title: string;
  areaList: string[];
  plantingDate: string;
  harvestingDate: string;
  yield: number;
};

const rawData: Forecast[] = [
  {
    id: "DB01",
    title: "Dự báo sản lượng mùa vụ 01",
    areaList: ["Khu vực A", "Khu vực B", "Khu vực C"],
    plantingDate: "24/11/2025",
    harvestingDate: "13/05/2025",
    yield: 100,
  },
  {
    id: "DB02",
    title: "Dự báo sản lượng mùa vụ 02",
    areaList: ["Khu vực A", "Khu vực B", "Khu vực C"],
    plantingDate: "24/11/2025",
    harvestingDate: "13/05/2025",
    yield: 100,
  },
];
const Forecast = () => {
  const handleEdit = (row: Forecast) => {
    console.log("Editing", row);
    // open modal or form
  };

  const handleDelete = (row: Forecast) => {
    console.log("Deleting", row);
    // show confirmation and delete logic
  };
  const columns = useMemo<MRT_ColumnDef<Forecast>[]>(
    () => [
      {
        accessorKey: "title",
        header: "Dự báo sản lượng",
        Cell: ({ row }) => (
          <Stack gap={0}>
            <Text fw={500}>{row.original.title}</Text>
            <Text size="xs" c="dimmed">
              {row.original.id}
            </Text>
          </Stack>
        ),
      },
      {
        accessorKey: "areaList",
        header: "Khu vực trồng",
        Cell: ({ row }) => (
          <Stack gap={4}>
            {row.original.areaList.map((area, i) => (
              <Group key={i} gap={6}>
                <Box
                  w={8}
                  h={8}
                  style={{
                    borderRadius: "50%",
                    backgroundColor: ["#FB8C00", "#43A047", "#1E88E5"][i % 3],
                  }}
                />
                <Text size="sm">{area}</Text>
              </Group>
            ))}
          </Stack>
        ),
      },
      {
        accessorKey: "plantingDate",
        header: "Ngày trồng",
      },
      {
        accessorKey: "harvestingDate",
        header: "Ngày thu hoạch",
      },
      {
        accessorKey: "yield",
        header: "Tổng dự báo sản lượng",
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
          Dự báo sản lượng
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
        <DatePickerInput
          placeholder="Ngày bắt đầu - Ngày kết thúc"
          w={300}
          radius={4}
          locale="vi"
          type="range"
          leftSection={<IconCalendar size={18} />}
        />
        <Select placeholder="Mùa vụ" radius={4} data={["Vụ 1", "Vụ 2"]} />
        <Select placeholder="Lô trồng" radius={4} data={["Lô 1", "Lô 2"]} />
      </Group>
      <Table columns={columns} data={rawData} />
    </Stack>
  );
};
export default Forecast;
