import { Button, Group, Modal, Stack, Text, Title } from "@mantine/core";
import { IconFileExcel } from "@tabler/icons-react";
import type { MRT_ColumnDef } from "mantine-react-table";
import Table from "../../../components/Table";
import { useDisclosure } from "@mantine/hooks";
import AddMaintenanceForm from "./components/AddMaintenanceForm";
type MaintenanceDetail = {
  id: string;
  machineId: string; // liên kết máy móc IV.1
  startTime: string; // thời gian bảo trì
  endTime: string; // thời gian kết thúc
  staffId: string; // liên kết nhân viên (XI)
  reason: string; // lý do
  cost: number; // chi phí
  description: string; // nội dung bảo trì
};
const maintenanceDetails: MaintenanceDetail[] = [
  {
    id: "MD001",
    machineId: "MC001",
    startTime: "2024-06-01T08:00:00",
    endTime: "2024-06-01T10:30:00",
    staffId: "EMP001",
    reason: "Thay nhớt định kỳ",
    cost: 500_000,
    description: "Thay nhớt động cơ, kiểm tra lọc dầu, tổng vệ sinh máy.",
  },
  {
    id: "MD002",
    machineId: "MC002",
    startTime: "2024-06-03T13:00:00",
    endTime: "2024-06-03T15:45:00",
    staffId: "EMP003",
    reason: "Bảo trì hộp số",
    cost: 2_000_000,
    description: "Tháo và làm sạch hộp số, bôi trơn lại, thay bạc đạn.",
  },
];
const MachineManagementMaintenanceHistoryPage = () => {
  const [
    openedAddMaintenanceMachine,
    { open: openAddMaintenanceMachine, close: closeAddMaintenanceMachine },
  ] = useDisclosure(false);
  const maintenanceDetailColumns: MRT_ColumnDef<MaintenanceDetail>[] = [
    {
      accessorKey: "id",
      header: "Mã bảo trì",
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
      accessorKey: "staffId",
      header: "Nhân viên",
    },
    {
      accessorKey: "reason",
      header: "Lý do",
    },
    {
      accessorKey: "cost",
      header: "Chi phí",
      Cell: ({ cell }) =>
        cell.getValue<number>().toLocaleString("vi-VN", {
          style: "currency",
          currency: "VND",
        }),
    },
    {
      accessorKey: "description",
      header: "Nội dung",
    },
  ];
  return (
    <Stack gap="lg">
      <Group justify="space-between">
        <Title flex={1} order={2}>
          Lịch sử bảo trì
        </Title>
        <Group>
          <Button variant="outline" radius={4} leftSection={<IconFileExcel />}>
            Xuất File
          </Button>
          <Button radius={4} onClick={openAddMaintenanceMachine}>
            Thêm mới
          </Button>
        </Group>
      </Group>

      <Table columns={maintenanceDetailColumns} data={maintenanceDetails} />
      <Modal
        opened={openedAddMaintenanceMachine}
        onClose={closeAddMaintenanceMachine}
        title={<Text fw={"bold"}>Tạo phiếu bảo trì</Text>}
      >
        <AddMaintenanceForm />
      </Modal>
    </Stack>
  );
};
export default MachineManagementMaintenanceHistoryPage;
