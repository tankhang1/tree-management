import {
  ActionIcon,
  Button,
  Group,
  Menu,
  Modal,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import {
  IconDotsVertical,
  IconEdit,
  IconEye,
  IconFileExcel,
  IconTrash,
} from "@tabler/icons-react";
import type { MRT_ColumnDef } from "mantine-react-table";
import Table from "../../../components/Table";
import { useDisclosure } from "@mantine/hooks";
import AddMaterialUsageForm from "./components/AddMaterialUsageForm";

type MaterialUsageRecord = {
  id: string;
  materialId: string;
  startTime: string; // ISO string
  endTime: string;
  usedBy: string;
  purpose: string;
  location: string;
};

const usageRecords: MaterialUsageRecord[] = [
  {
    id: "MATUSE001",
    materialId: "MAT001",
    startTime: "2024-06-01T08:00:00",
    endTime: "2024-06-01T09:30:00",
    usedBy: "Nguyễn Văn Thắng",
    purpose: "Phun phân bón lá cho lô 1",
    location: "Vùng trồng A1",
  },
  {
    id: "MATUSE002",
    materialId: "MAT002",
    startTime: "2024-06-05T10:00:00",
    endTime: "2024-06-05T11:00:00",
    usedBy: "Lê Thị Mai",
    purpose: "Rải phân NPK",
    location: "Vùng trồng B2",
  },
  {
    id: "MATUSE003",
    materialId: "MAT003",
    startTime: "2024-06-10T14:00:00",
    endTime: "2024-06-10T15:00:00",
    usedBy: "Phạm Văn Duy",
    purpose: "Bón lót trước khi gieo",
    location: "Khu đất số 5",
  },
];

const SupplyManagementUsageHistoryPage = () => {
  const [
    openedAddMaterialUsage,
    { open: openAddMaterialUsage, close: closeAddMaterialUsage },
  ] = useDisclosure(false);

  const usageColumns: MRT_ColumnDef<MaterialUsageRecord>[] = [
    {
      accessorKey: "id",
      header: "Mã sử dụng",
    },
    {
      accessorKey: "materialId",
      header: "Mã vật tư",
    },
    {
      accessorKey: "startTime",
      header: "Bắt đầu",
      Cell: ({ cell }) =>
        new Date(cell.getValue<string>()).toLocaleString("vi-VN"),
    },
    {
      accessorKey: "endTime",
      header: "Kết thúc",
      Cell: ({ cell }) =>
        new Date(cell.getValue<string>()).toLocaleString("vi-VN"),
    },
    {
      accessorKey: "usedBy",
      header: "Người sử dụng",
    },
    {
      accessorKey: "location",
      header: "Vị trí",
    },
    {
      accessorKey: "purpose",
      header: "Mục đích sử dụng",
    },
    {
      accessorKey: "actions",
      header: "",
      enableColumnActions: false,
      size: 10,
      Cell: () => (
        <Menu shadow="md">
          <Menu.Target>
            <ActionIcon variant="transparent" c={"gray"}>
              <IconDotsVertical />
            </ActionIcon>
          </Menu.Target>

          <Menu.Dropdown>
            <Menu.Item leftSection={<IconEye size={18} color="gray" />}>
              Chi tiết
            </Menu.Item>
            <Menu.Item leftSection={<IconEdit size={18} color="green" />}>
              Chỉnh sửa
            </Menu.Item>
            <Menu.Item leftSection={<IconTrash size={18} />} color="red">
              Xoá
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      ),
    },
  ];

  return (
    <Stack gap="lg">
      <Group justify="space-between">
        <Title flex={1} order={2}>
          Lịch sử sử dụng vật tư
        </Title>
        <Group>
          <Button variant="outline" radius={4} leftSection={<IconFileExcel />}>
            Xuất File
          </Button>
          <Button radius={4} onClick={openAddMaterialUsage}>
            Thêm mới
          </Button>
        </Group>
      </Group>

      <Table columns={usageColumns} data={usageRecords} />
      <Modal
        opened={openedAddMaterialUsage}
        onClose={closeAddMaterialUsage}
        title={<Text fw={"bold"}>Tạo phiếu sử dụng vật tư</Text>}
      >
        <AddMaterialUsageForm />
      </Modal>
    </Stack>
  );
};

export default SupplyManagementUsageHistoryPage;
