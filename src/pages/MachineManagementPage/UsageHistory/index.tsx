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
import AddEquipmentUsageForm from "./components/AddEquipmentUsageForm";
type EquipmentUsageRecord = {
  id: string;
  machineId: string;
  startTime: string; // ISO format: "2024-06-01T08:00:00"
  endTime: string; // ISO format
  usedBy: string;
  purpose: string;
  location: string;
};
const usageRecords: EquipmentUsageRecord[] = [
  {
    id: "USE001",
    machineId: "MC001",
    startTime: "2024-06-01T08:00:00",
    endTime: "2024-06-01T11:30:00",
    usedBy: "Nguyễn Văn Tâm",
    purpose: "Vận chuyển nguyên liệu từ kho A đến xưởng B",
    location: "Khu vực sản xuất 1",
  },
  {
    id: "USE002",
    machineId: "MC001",
    startTime: "2024-06-03T14:00:00",
    endTime: "2024-06-03T17:00:00",
    usedBy: "Trần Thị Hồng",
    purpose: "Chạy thử máy sau bảo trì",
    location: "Xưởng kiểm tra kỹ thuật",
  },
  {
    id: "USE003",
    machineId: "MC002",
    startTime: "2024-06-10T07:45:00",
    endTime: "2024-06-10T10:15:00",
    usedBy: "Lê Văn Khoa",
    purpose: "Cày đất chuẩn bị trồng",
    location: "Vùng trồng số 3",
  },
];
const MachineManagementUsageHistoryPage = () => {
  const [
    openedAddUsageMachine,
    { open: openAddUsageMachine, close: closeAddUsageMachine },
  ] = useDisclosure(false);
  const usageColumns: MRT_ColumnDef<EquipmentUsageRecord>[] = [
    {
      accessorKey: "id",
      header: "Mã sử dụng",
    },
    {
      accessorKey: "machineId",
      header: "Mã máy",
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
          Lịch sử sử dụng
        </Title>
        <Group>
          <Button variant="outline" radius={4} leftSection={<IconFileExcel />}>
            Xuất File
          </Button>
          <Button radius={4} onClick={openAddUsageMachine}>
            Thêm mới
          </Button>
        </Group>
      </Group>

      <Table columns={usageColumns} data={usageRecords} />
      <Modal
        opened={openedAddUsageMachine}
        onClose={closeAddUsageMachine}
        title={<Text fw={"bold"}>Tạo phiếu sử dụng</Text>}
      >
        <AddEquipmentUsageForm />
      </Modal>
    </Stack>
  );
};
export default MachineManagementUsageHistoryPage;
