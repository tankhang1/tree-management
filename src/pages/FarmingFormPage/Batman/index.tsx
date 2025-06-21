import {
  ActionIcon,
  Badge,
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

type BatmanTask = {
  id: string;
  name: string;
  date: string;
  location: string;
  worker: string;
  material: string;
  tool: string;
  status: "Đang thực hiện" | "Hoàn thành" | "Chưa làm";
};

const rawData: BatmanTask[] = [
  {
    id: "BM001",
    name: "Kiểm tra bón phân lô A01",
    date: "20/03/2030",
    location: "A1",
    worker: "Nguyễn Văn A",
    material: "TRU_SAU-001-SYN vượt ngưỡng",
    tool: "Chỉnh sửa hệ thống tưới nước",
    status: "Đang thực hiện",
  },
  {
    id: "BM002",
    name: "Kiểm tra bón phân lô A02",
    date: "20/03/2030",
    location: "A2",
    worker: "Nguyễn Văn A",
    material: "TRU_SAU-001-SYN vượt ngưỡng",
    tool: "Chỉnh sửa hệ thống tưới nước",
    status: "Đang thực hiện",
  },
];
const FarmingFormBatmanPage = () => {
  const handleEdit = (row: BatmanTask) => {
    console.log("Editing", row);
    // open modal or form
  };

  const handleDelete = (row: BatmanTask) => {
    console.log("Deleting", row);
    // show confirmation and delete logic
  };
  const columns = useMemo<MRT_ColumnDef<BatmanTask>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Tên phiếu giao việc BATMAN",
        Cell: ({ row }) => (
          <Stack gap={0}>
            <Text fw={500}>{row.original.name}</Text>
            <Text size="xs" c="dimmed">
              {row.original.id}
            </Text>
          </Stack>
        ),
      },
      {
        accessorKey: "date",
        header: "Ngày thực hiện",
      },
      {
        accessorKey: "location",
        header: "Vị trí",
      },
      {
        accessorKey: "worker",
        header: "Nhân công",
      },
      {
        accessorKey: "material",
        header: "Vật tư nông nghiệp",
      },
      {
        accessorKey: "tool",
        header: "Công cụ - Trang thiết bị - Cơ giới",
      },
      {
        accessorKey: "status",
        header: "Trạng thái",
        Cell: ({ row }) => {
          const status = row.original.status;
          const color =
            status === "Hoàn thành"
              ? "green"
              : status === "Đang thực hiện"
              ? "teal"
              : "gray";

          return <Badge color={color}>{status}</Badge>;
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
          Phiếu giao công việc BATMAN
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
export default FarmingFormBatmanPage;
