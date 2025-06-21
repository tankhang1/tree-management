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
  IconDatabaseExport,
  IconEye,
  IconPencil,
  IconPlus,
  IconTableImport,
  IconTrash,
} from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { PATH } from "../../../constants/path.constants";

type PlantGroup = {
  id: string;
  plantType: string;
  groupName: string;
  origin: string;
  area: number;
};
const rawData: PlantGroup[] = [
  {
    id: "03-01",
    plantType: "Sầu riêng",
    groupName: "Sầu riêng Ri6",
    origin: "Việt Nam",
    area: 20000,
  },
  {
    id: "03-02",
    plantType: "Sầu riêng",
    groupName: "Sầu riêng Mon thong",
    origin: "Thái Lan",
    area: 20000,
  },
  {
    id: "03-03",
    plantType: "Sầu riêng",
    groupName: "Sầu riêng Musang King",
    origin: "Malaysia",
    area: 20000,
  },
  {
    id: "03-04",
    plantType: "Sầu riêng",
    groupName: "Sầu riêng Khổ Qua Xanh",
    origin: "Việt Nam",
    area: 20000,
  },
];

const GardenManagementTypePage = () => {
  const navigate = useNavigate();
  const handleEdit = (row: PlantGroup) => {
    console.log("Editing", row);
    // open modal or form
  };

  const handleDelete = (row: PlantGroup) => {
    console.log("Deleting", row);
    // show confirmation and delete logic
  };
  const handleDetail = (row: PlantGroup) => {
    console.log("Detail", row);
    navigate(PATH.GARDEN_MANAGEMENT_TYPE_DETAIL);
    // show confirmation and delete logic
  };
  const columns = useMemo<MRT_ColumnDef<PlantGroup>[]>(
    () => [
      {
        accessorKey: "plantType",
        header: "Tên loại cây trồng",
        Cell: ({ row }) => (
          <Stack gap={2}>
            <Text>{row.original.plantType}</Text>
            <Text style={{ fontSize: 12, color: "#888" }}>01</Text>
          </Stack>
        ),
      },
      {
        accessorKey: "groupName",
        header: "Tên nhóm cây trồng",
        Cell: ({ row }) => (
          <Stack gap={2}>
            <Text>{row.original.groupName}</Text>
            <Text style={{ fontSize: 12, color: "#888" }}>
              {row.original.id}
            </Text>
          </Stack>
        ),
      },
      {
        accessorKey: "origin",
        header: "Nguồn gốc",
        Cell: ({ row }) => <Text>{row.original.origin}</Text>,
      },
      {
        accessorKey: "area",
        header: "Diện tích (m²)",
        Cell: ({ row }) => (
          <Text>{new Intl.NumberFormat("vi").format(row.original.area)}</Text>
        ),
      },
      {
        id: "actions", // required when no accessorKey
        header: "",
        size: 100,
        enableColumnActions: false, // ✅ disables vertical dots menu
        enableColumnOrdering: false, // ✅ disables drag-reorder
        enableColumnResizing: false, // optional: disables resize handle
        enableHiding: false,
        Cell: ({ row }) => (
          <Group gap={3}>
            <Tooltip label="Chi tiết">
              <ActionIcon
                variant="subtle"
                color="gray"
                onClick={() => handleDetail(row.original)}
              >
                <IconEye size={16} />
              </ActionIcon>
            </Tooltip>
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
          Nhóm cây trồng
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
        <Select
          placeholder="Trạng thái"
          radius={4}
          data={["Hoàn thành", "Đang Làm", "Chưa Làm"]}
        />
        <Select
          placeholder="Nguồn gốc"
          radius={4}
          data={["Hoàn thành", "Đang Làm", "Chưa Làm"]}
        />
      </Group>
      <Table columns={columns} data={rawData} />
    </Stack>
  );
};
export default GardenManagementTypePage;
