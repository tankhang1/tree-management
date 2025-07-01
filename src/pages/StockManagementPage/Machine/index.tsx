import {
  ActionIcon,
  Badge,
  Button,
  Group,
  Menu,
  Modal,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconDotsVertical,
  IconEdit,
  IconEye,
  IconFileExcel,
  IconTrash,
} from "@tabler/icons-react";
import type { MRT_ColumnDef } from "mantine-react-table";
import Table from "../../../components/Table";
import AddMachineForm from "./components/AddMachineForm";
type MachineTransactionType = "nhập" | "xuất" | "huỷ";
type MachineTransaction = {
  id: string; // Mã phiếu giao dịch
  machineId: string; // Mã máy (liên kết IV.1)
  type: MachineTransactionType; // Loại phiếu: nhập/xuất/hủy
  quantity: number; // Số lượng
  date: string; // Ngày giao dịch
  staffId: string; // Nhân viên thực hiện (XI)
  note?: string; // Ghi chú
};
const machineTransactions: MachineTransaction[] = [
  {
    id: "MTX001",
    machineId: "MC001",
    type: "nhập",
    quantity: 2,
    date: "2024-06-01",
    staffId: "EMP001",
    note: "Nhập mới từ nhà cung cấp",
  },
  {
    id: "MTX002",
    machineId: "MC002",
    type: "xuất",
    quantity: 1,
    date: "2024-06-05",
    staffId: "EMP002",
    note: "Xuất cho dự án thu hoạch vùng A",
  },
  {
    id: "MTX003",
    machineId: "MC003",
    type: "huỷ",
    quantity: 1,
    date: "2024-06-08",
    staffId: "EMP003",
    note: "Hỏng nặng, không thể sửa",
  },
];

const StockManagementMachinePage = () => {
  const [
    openedStockMachine,
    { open: openStockMachine, close: closeStockMachine },
  ] = useDisclosure(false);
  const machineTransactionColumns: MRT_ColumnDef<MachineTransaction>[] = [
    { accessorKey: "id", header: "Mã phiếu" },
    { accessorKey: "machineId", header: "Mã máy" },
    {
      accessorKey: "type",
      header: "Loại",
      Cell: ({ cell }) => {
        const type = cell.getValue<MachineTransactionType>();
        const color =
          type === "nhập" ? "green" : type === "xuất" ? "blue" : "red";
        return <Badge color={color}>{type.toUpperCase()}</Badge>;
      },
    },
    { accessorKey: "quantity", header: "Số lượng" },
    {
      accessorKey: "date",
      header: "Ngày giao dịch",
      Cell: ({ cell }) =>
        new Date(cell.getValue<string>()).toLocaleDateString("vi-VN"),
    },
    { accessorKey: "staffId", header: "Nhân viên" },
    { accessorKey: "note", header: "Ghi chú" },
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
          Quản lý xuất nhập máy móc
        </Title>
        <Group>
          <Button variant="outline" radius={4} leftSection={<IconFileExcel />}>
            Xuất File
          </Button>
          <Button radius={4} onClick={openStockMachine}>
            Thêm mới
          </Button>
        </Group>
      </Group>

      <Table columns={machineTransactionColumns} data={machineTransactions} />
      <Modal
        opened={openedStockMachine}
        onClose={closeStockMachine}
        title={<Text fw="bold">Thêm mới phiếu xuất/nhập máy móc</Text>}
      >
        <AddMachineForm />
      </Modal>
    </Stack>
  );
};

export default StockManagementMachinePage;
