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
  batch: string;
  start: string;
  end: string;
  lot: string;
  task: string;
  quantity: number;
  unit: string;
  norm: string;
  material: string;
  equipment: string;
};
const rawData: Task[] = [
  {
    batch: "Đợt 1 (686)",
    start: "2024-11-24",
    end: "2024-12-05",
    lot: "A01",
    task: "Tưới nước lô A01",
    quantity: 5,
    unit: "Người",
    norm: "5 cây/lô",
    material: "Thuốc trừ sâu",
    equipment: "Bình phun thuốc, máy kéo",
  },
  {
    batch: "Đợt 1 (686)",
    start: "2024-11-24",
    end: "2024-12-05",
    lot: "A02",
    task: "Tưới nước lô A02",
    quantity: 5,
    unit: "Người",
    norm: "5 cây/lô",
    material: "Thuốc trừ sâu",
    equipment: "Bình phun thuốc, máy kéo",
  },
  {
    batch: "Đợt 2 (686)",
    start: "2024-11-24",
    end: "2024-12-05",
    lot: "B01",
    task: "Tưới nước lô B01",
    quantity: 5,
    unit: "Người",
    norm: "5 cây/lô",
    material: "Thuốc trừ sâu",
    equipment: "Bình phun thuốc, máy kéo",
  },
];
const FarmingFormByPlanPage = () => {
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
        accessorKey: "lot",
        header: "Lô trồng",
        size: 100,
      },
      {
        accessorKey: "task",
        header: "Công việc",
      },
      {
        accessorKey: "quantity",
        header: "Số lượng",
      },
      {
        accessorKey: "unit",
        header: "Đơn vị tính",
      },
      {
        accessorKey: "norm",
        header: "Định mức",
      },
      {
        accessorKey: "material",
        header: "Vật tư nông nghiệp",
      },
      {
        accessorKey: "equipment",
        header: "Công cụ - Thiết bị - Cơ giới",
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
  return (
    <Stack w={"100%"}>
      <Group justify="space-between">
        <Text fz={"h3"} fw={"bold"}>
          Phiếu công việc theo kế hoạch
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
export default FarmingFormByPlanPage;
