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
import Table from "../../../components/Table";
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
type Task = {
  issue: string; // e.g. "Xử lý sâu bệnh"
  start: string; // ISO date
  end: string;
  lots: string[]; // e.g. ['A01', 'A02', 'A03']
  tasks: {
    task: string;
    quantity: number;
    unit: string;
  }[];
};
const rawData: Task[] = [
  {
    issue: "Xử lý sâu bệnh",
    start: "2024-11-24",
    end: "2024-12-05",
    lots: ["A01", "A02", "A03"],
    tasks: [
      { task: "Tưới nước lô A01", quantity: 5, unit: "Người" },
      { task: "Tưới nước lô A02", quantity: 5, unit: "Người" },
      { task: "Tưới nước lô A03", quantity: 5, unit: "Người" },
    ],
  },
  {
    issue: "Xử lý sâu bệnh",
    start: "2024-11-24",
    end: "2024-12-05",
    lots: ["A01", "A02", "A03"],
    tasks: [
      { task: "Tưới nước lô A01", quantity: 15, unit: "Người" },
      { task: "Tưới nước lô A02", quantity: 45, unit: "Người" },
      { task: "Tưới nước lô A03", quantity: 25, unit: "Người" },
    ],
  },
];

const FarmingManagementUnPlannedTaskPage = () => {
  const handleEdit = (row: Task) => {
    console.log("Editing", row);
    // open modal or form
  };

  const handleDelete = (row: Task) => {
    console.log("Deleting", row);
    // show confirmation and delete logic
  };
  const columns = useMemo<MRT_ColumnDef<Task>[]>(
    () => [
      {
        accessorKey: "issue",
        header: "Công việc phát sinh",
      },
      {
        id: "time",
        header: "Thời gian",
        Cell: ({ row }) => {
          const start = row.original.start;
          const end = row.original.end;
          return (
            <Stack gap={4}>
              <Group gap={6}>
                <Box w={8} h={8} bg="orange" style={{ borderRadius: "50%" }} />
                <Text size="sm">Bắt đầu: {start}</Text>
              </Group>
              <Group gap={6}>
                <Box w={8} h={8} bg="green" style={{ borderRadius: "50%" }} />
                <Text size="sm">Kết thúc: {end}</Text>
              </Group>
            </Stack>
          );
        },
      },
      {
        id: "lots",
        header: "Lô trồng",
        Cell: ({ row }) => (
          <Stack gap={4}>
            {row.original.lots.map((lot, index) => (
              <Group key={index} gap={6}>
                <Box
                  w={8}
                  h={8}
                  style={{
                    borderRadius: "50%",
                    backgroundColor: ["#F57C00", "#43A047", "#1976D2"][
                      index % 3
                    ],
                  }}
                />
                <Text size="sm">{lot}</Text>
              </Group>
            ))}
          </Stack>
        ),
      },
      {
        id: "tasks",
        header: "Công việc",

        Cell: ({ row }) => (
          <Stack gap={8}>
            {row.original.tasks.map((t, index) => (
              <Group key={index} gap={2}>
                <Text size="sm">{index + 1}</Text>:{" "}
                <Text size="sm">{t.task}</Text> -
                <Text size="sm">{t.quantity}</Text>(
                <Text size="sm">{t.unit}</Text>)
              </Group>
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
          Phiếu công việc phát sinh
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
        <Select
          placeholder="Trạng thái"
          radius={4}
          data={["Hoàn thành", "Đang Làm", "Chưa Làm"]}
        />
      </Group>
      <Table columns={columns} data={rawData} />
    </Stack>
  );
};
export default FarmingManagementUnPlannedTaskPage;
