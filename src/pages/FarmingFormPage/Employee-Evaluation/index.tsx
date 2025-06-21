import {
  ActionIcon,
  Autocomplete,
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
  IconArrowLeft,
  IconCalendar,
  IconDatabaseExport,
  IconPencil,
  IconPlus,
  IconSearch,
  IconTableImport,
  IconTrash,
} from "@tabler/icons-react";
import { DatePickerInput } from "@mantine/dates";
import { useNavigate } from "react-router-dom";

type Evaluation = {
  id: string;
  period: string;
  employeeName: string;
  department: string;
  performance: number;
  attitude: number;
  compliance: number;
  createdAt: string;
  note?: string;
};
const rawData: Evaluation[] = [
  {
    id: "DG001",
    period: "Tháng 4",
    employeeName: "Nguyễn Văn A",
    department: "Phòng ban A",
    performance: 3,
    attitude: 4,
    compliance: 1,
    createdAt: "24/11/2024",
    note: "Không tuân thủ quy định",
  },
  // thêm các dòng khác...
];

const FarmingFormEmployeeEvaluationPage = () => {
  const navigate = useNavigate();
  const handleEdit = (row: Evaluation) => {
    console.log("Editing", row);
    // open modal or form
  };

  const handleDelete = (row: Evaluation) => {
    console.log("Deleting", row);
    // show confirmation and delete logic
  };
  const columns = useMemo<MRT_ColumnDef<Evaluation>[]>(
    () => [
      {
        accessorKey: "period",
        header: "Đánh giá",
        Cell: ({ row }) => (
          <Stack gap={0}>
            <Text>{row.original.period}</Text>
            <Text size="xs" c="dimmed">
              {row.original.id}
            </Text>
          </Stack>
        ),
      },
      {
        accessorKey: "employeeName",
        header: "Nhân viên",
        Cell: ({ row }) => (
          <Text c="green" fw={500} style={{ cursor: "pointer" }}>
            {row.original.employeeName}
          </Text>
        ),
      },
      {
        accessorKey: "department",
        header: "Phòng ban",
      },
      {
        accessorKey: "performance",
        header: "Hiệu suất công việc",
      },
      {
        accessorKey: "attitude",
        header: "Thái độ làm việc",
      },
      {
        accessorKey: "compliance",
        header: "Tuân thủ quy định",
      },
      {
        accessorKey: "createdAt",
        header: "Ngày tạo",
      },
      {
        accessorKey: "note",
        header: "Ghi chú",
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
        <Group>
          <ActionIcon
            variant="subtle"
            color="black"
            onClick={() => {
              navigate(-1);
            }}
          >
            <IconArrowLeft />
          </ActionIcon>
          <Text fz={"h3"} fw={"bold"}>
            Đánh giá chất lượng
          </Text>
        </Group>
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
          clearable
          leftSection={<IconCalendar size={18} />}
        />
        <Select placeholder="Phòng ban" radius={4} data={["A", "B"]} />
        <Autocomplete
          placeholder="Nhân viên"
          radius={4}
          data={["A", "B"]}
          clearable
          leftSection={<IconSearch size={18} />}
        />
        <Select
          placeholder="Tất cả trạng thái"
          radius={4}
          data={["Tạm", "Tốt"]}
        />
      </Group>
      <Table columns={columns} data={rawData} />
    </Stack>
  );
};
export default FarmingFormEmployeeEvaluationPage;
