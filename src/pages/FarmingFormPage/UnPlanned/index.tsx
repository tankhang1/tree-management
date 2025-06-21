import {
  ActionIcon,
  Avatar,
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

type UnplannedTask = {
  id: string;
  title: string;
  reason: string;
  batch: string;
  lots: Array<{ name: string; color: string }>;
  date: string;
  task: string;
  workers: Array<{ name: string; avatarUrl?: string; label: string }>;
};
const rawData: UnplannedTask[] = [
  {
    id: "PV001",
    title: "Phiếu giao việc 01",
    reason: "Sâu bệnh hại",
    batch: "Đợt 1 (686)",
    lots: [
      { name: "A01", color: "orange" },
      { name: "A02", color: "green" },
    ],
    date: "24/02/2025",
    task: "Bón phân, cắt cỏ",
    workers: [
      { name: "Nguyễn Văn A", avatarUrl: "/ava.jpg", label: "K" },
      { name: "Lê Văn B", label: "R" },
    ],
  },
  {
    id: "PV002",
    title: "Phiếu giao việc 02",
    reason: "Sâu bệnh hại",
    batch: "Đợt 3 (686)",
    lots: [
      { name: "A01", color: "orange" },
      { name: "A02", color: "green" },
    ],
    date: "24/02/2025",
    task: "Bón phân, cắt cỏ",
    workers: [
      { name: "Nguyễn Văn A", avatarUrl: "/ava.jpg", label: "K" },
      { name: "Lê Văn B", label: "R" },
    ],
  },
];

const FarmingFormUnPlannedPage = () => {
  const handleEdit = (row: UnplannedTask) => {
    console.log("Editing", row);
    // open modal or form
  };

  const handleDelete = (row: UnplannedTask) => {
    console.log("Deleting", row);
    // show confirmation and delete logic
  };
  const columns = useMemo<MRT_ColumnDef<UnplannedTask>[]>(
    () => [
      {
        accessorKey: "title",
        header: "Phiếu giao việc",
        Cell: ({ row }) => (
          <Stack gap={0}>
            <Text fw={600}>{row.original.title}</Text>
            <Text size="xs" c="dimmed">
              {row.original.id}
            </Text>
          </Stack>
        ),
      },
      {
        accessorKey: "reason",
        header: "Phát sinh",
      },
      {
        accessorKey: "batch",
        header: "Đợt trồng",
      },
      {
        accessorKey: "lots",
        header: "Lô trồng",
        Cell: ({ row }) => (
          <Stack gap={8}>
            {row.original.lots.map((lot, i) => (
              <Group key={i} gap={4}>
                <Box
                  w={8}
                  h={8}
                  bg={lot.color}
                  style={{
                    borderRadius: "50%",
                  }}
                />
                <Text size="sm">{lot.name}</Text>
              </Group>
            ))}
          </Stack>
        ),
      },
      {
        accessorKey: "date",
        header: "Ngày thực hiện",
      },
      {
        accessorKey: "task",
        header: "Công việc",
      },
      {
        accessorKey: "workers",
        header: "Nhân công",
        Cell: ({ row }) => {
          const visible = row.original.workers.slice(0, 3);
          const hidden = row.original.workers.length - 3;

          return (
            <Avatar.Group spacing="sm">
              {visible.map((w, i) => (
                <Tooltip key={i} label={w.name}>
                  <Avatar src={w.avatarUrl} size="md" radius="xl">
                    {w.label}
                  </Avatar>
                </Tooltip>
              ))}
              {hidden > 0 && (
                <Avatar size="md" radius="xl" color="orange.2">
                  +{hidden}
                </Avatar>
              )}
            </Avatar.Group>
          );
        },
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
          w={"auto"}
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
export default FarmingFormUnPlannedPage;
