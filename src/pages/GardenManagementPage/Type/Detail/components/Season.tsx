import {
  ActionIcon,
  Button,
  Divider,
  Group,
  Select,
  Stack,
  Text,
  Tooltip,
} from "@mantine/core";
import Table from "../../../../../components/Table";
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
type TSeason = {
  season: string; // Tên mùa vụ, ví dụ: "Mùa vụ 01"
  code: string; // Mã mùa vụ, ví dụ: "MV01"
  start: string; // Ngày bắt đầu
  end: string; // Ngày kết thúc
  stages: string[]; // Các giai đoạn sinh trưởng
};
const rawData: TSeason[] = [
  {
    season: "Mùa vụ 01",
    code: "MV01",
    start: "10/03/2025",
    end: "10/03/2026",
    stages: ["Ra hoa và thụ phấn", "Thu hoạch", "Phục hồi sau thu hoạch"],
  },
  {
    season: "Mùa vụ 02",
    code: "MV02",
    start: "10/03/2025",
    end: "10/03/2026",
    stages: ["Ra hoa và thụ phấn", "Thu hoạch", "Phục hồi sau thu hoạch"],
  },
  {
    season: "Mùa vụ 03",
    code: "MV03",
    start: "10/03/2025",
    end: "10/03/2026",
    stages: ["Ra hoa và thụ phấn", "Thu hoạch", "Phục hồi sau thu hoạch"],
  },
  {
    season: "Mùa vụ 04",
    code: "MV04",
    start: "10/03/2025",
    end: "10/03/2026",
    stages: [
      "Ra hoa và thụ phấn",
      "Thu hoạch",
      "GBD7 - Phục hồi sau thu hoạch",
    ],
  },
];
const Season = () => {
  const handleEdit = (row: TSeason) => {
    console.log("Editing", row);
    // open modal or form
  };

  const handleDelete = (row: TSeason) => {
    console.log("Deleting", row);
    // show confirmation and delete logic
  };
  const columns = useMemo<MRT_ColumnDef<TSeason>[]>(
    () => [
      {
        accessorKey: "season",
        header: "Mùa vụ",
        Cell: ({ row }) => (
          <Stack>
            <Text>{row.original.season}</Text>
            <Text style={{ fontSize: 12, color: "#888" }}>
              {row.original.code}
            </Text>
          </Stack>
        ),
      },
      {
        accessorKey: "start",
        header: "Thời gian bắt đầu",
      },
      {
        accessorKey: "end",
        header: "Thời gian kết thúc",
      },
      {
        accessorKey: "stages",
        header: "Giai đoạn sinh trưởng",
        Cell: ({ cell }) => (
          <Stack>
            {(cell.getValue() as string[]).map((stage, idx) => (
              <Text key={idx} style={{ fontSize: 13 }}>{`${
                idx + 1
              }. ${stage}`}</Text>
            ))}
          </Stack>
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
          Danh sách mùa vụ
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
          w={"auto"}
          radius={4}
          locale="vi"
          type="range"
          leftSection={<IconCalendar size={18} />}
        />
        <Select placeholder="Trạng thái" radius={4} data={["Vụ 1", "Vụ 2"]} />
        <Select
          placeholder="Tên nhóm cây trồng"
          radius={4}
          data={["Lô 1", "Lô 2"]}
        />
      </Group>
      <Table columns={columns} data={rawData} />
    </Stack>
  );
};
export default Season;
