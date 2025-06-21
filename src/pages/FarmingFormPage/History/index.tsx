import {
  ActionIcon,
  Avatar,
  Button,
  Divider,
  Group,
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
  IconStar,
  IconTableImport,
  IconTrash,
} from "@tabler/icons-react";
import { DatePickerInput } from "@mantine/dates";
import { useNavigate } from "react-router-dom";
import { PATH } from "../../../constants/path.constants";

type Task = {
  code: string;
  title: string;
  batch: string;
  end: string;
  task: string;
  workers: Array<{ name: string; avatarUrl?: string; label: string }>;
  material: string;
  equipment: string;
};
const rawData: Task[] = [
  {
    code: "PV001",
    title: "Phiếu giao việc 01",
    batch: "Đợt 1 (686)",
    end: "24/02/2025",
    task: "Bón phân",
    workers: [
      { name: "Nguyễn Văn A", avatarUrl: "/avatar.jpg", label: "K" },
      { name: "Lê Thị B", label: "R" },
      { name: "Others", label: "+2" },
    ],
    material: "Phân bón, thuốc trừ sâu",
    equipment: "Xẻng, máy cày",
  },
  {
    code: "PV002",
    title: "Phiếu giao việc 02",
    batch: "Đợt 2 (686)",
    end: "24/02/2025",
    task: "Phun thuốc",
    workers: [
      { name: "Nguyễn Văn A", avatarUrl: "/avatar.jpg", label: "K" },
      { name: "Lê Thị B", label: "R" },
      { name: "Others", label: "+2" },
    ],
    material: "Phân bón, thuốc trừ sâu",
    equipment: "Xẻng, máy cày",
  },
];

const FarmingFormHistoryPage = () => {
  const navigate = useNavigate();
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
        accessorKey: "title",
        header: "Phiếu giao việc",
        Cell: ({ row }) => (
          <Stack gap={0}>
            <Text fw={600}>{row.original.title}</Text>
            <Text size="xs" c="dimmed">
              {row.original.code}
            </Text>
          </Stack>
        ),
      },
      {
        accessorKey: "batch",
        header: "Đợt trồng",
      },
      {
        accessorKey: "end",
        header: "Ngày hoàn thành",
      },
      {
        accessorKey: "task",
        header: "Công việc",
      },
      {
        accessorKey: "workers",
        header: "Nhân công",
        Cell: ({ row }) => (
          <Avatar.Group spacing="sm">
            {row.original.workers.map((w, index) => (
              <Tooltip key={index} label={w.name}>
                {w.avatarUrl ? (
                  <Avatar
                    src={w.avatarUrl}
                    alt={w.name}
                    size="md"
                    radius="xl"
                  />
                ) : (
                  <Avatar
                    size="md"
                    radius="xl"
                    color={
                      index === row.original.workers.length - 1
                        ? "orange.2"
                        : "gray.2"
                    }
                  >
                    {w.label}
                  </Avatar>
                )}
              </Tooltip>
            ))}
          </Avatar.Group>
        ),
      },
      {
        accessorKey: "material",
        header: "Vật tư nông nghiệp",
      },
      {
        accessorKey: "equipment",
        header: "Công cụ - Trang thiết bị - Cơ giới",
        size: 300,
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
  const onNavEmployeeEvaluation = () => {
    navigate(PATH.FARMING_FORM_EMPLOYEE_EVALUATION);
  };

  return (
    <Stack w={"100%"}>
      <Group justify="space-between">
        <Text fz={"h3"} fw={"bold"}>
          Nhật ký canh tác
        </Text>
        <Group>
          <Button variant="transparent" c={"black"} bd={"none"}>
            <Group align="center" gap={4} onClick={onNavEmployeeEvaluation}>
              <IconStar size={18} />
              <Text>Đánh giá nhân viên</Text>
            </Group>
          </Button>
          <Divider orientation="vertical" />
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
      </Group>
      <Table columns={columns} data={rawData} />
    </Stack>
  );
};
export default FarmingFormHistoryPage;
