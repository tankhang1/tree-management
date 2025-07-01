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
import {
  IconDotsVertical,
  IconEye,
  IconFileExcel,
  IconTrash,
} from "@tabler/icons-react";
import type { MRT_ColumnDef } from "mantine-react-table";
import Table from "../../../components/Table";
import { useDisclosure } from "@mantine/hooks";
import AddSupplyForm from "./components/AddSupplyForm";

type MaterialUsageType = "nhập" | "xuất" | "huỷ";
type MaterialUsage = {
  id: string; // Mã phiếu
  materialId: string; // Mã vật tư (VI.1)
  quantity: number; // Số lượng
  unit: string; // Đơn vị tính
  staffId: string; // Mã nhân viên (XI)
  usageDate: string; // Ngày sử dụng
  returnDate?: string; // Ngày trả (nếu có)
  type: MaterialUsageType; // Loại (nhập / xuất / huỷ)
  note?: string; // Ghi chú
};
const materialUsages: MaterialUsage[] = [
  {
    id: "MU001",
    materialId: "VT001",
    quantity: 50,
    unit: "kg",
    staffId: "EMP001",
    usageDate: "2024-06-20",
    returnDate: "2024-06-25",
    type: "xuất",
    note: "Dùng bón lô số 2",
  },
  {
    id: "MU002",
    materialId: "VT002",
    quantity: 100,
    unit: "lit",
    staffId: "EMP002",
    usageDate: "2024-06-18",
    type: "nhập",
    note: "Nhập kho từ nhà cung cấp Tân Phú",
  },
  {
    id: "MU003",
    materialId: "VT003",
    quantity: 10,
    unit: "cuộn",
    staffId: "EMP003",
    usageDate: "2024-06-19",
    type: "huỷ",
    note: "Bạt hỏng, không sử dụng được",
  },
];
const StockManagementSupplyPage = () => {
  const [
    openedStockSupply,
    { open: openStockSupply, close: closeStockSupply },
  ] = useDisclosure(false);
  const materialUsageColumns: MRT_ColumnDef<MaterialUsage>[] = [
    { accessorKey: "id", header: "Mã phiếu" },
    { accessorKey: "materialId", header: "Mã vật tư" },
    { accessorKey: "quantity", header: "Số lượng" },
    { accessorKey: "unit", header: "Đơn vị" },
    { accessorKey: "staffId", header: "Nhân viên" },
    {
      accessorKey: "usageDate",
      header: "Ngày sử dụng",
      Cell: ({ cell }) =>
        new Date(cell.getValue<string>()).toLocaleDateString("vi-VN"),
    },
    {
      accessorKey: "returnDate",
      header: "Ngày trả",
      Cell: ({ cell }) =>
        cell.getValue()
          ? new Date(cell.getValue<string>()).toLocaleDateString("vi-VN")
          : "-",
    },
    {
      accessorKey: "type",
      header: "Loại",
      Cell: ({ cell }) => {
        const type = cell.getValue<MaterialUsageType>();
        const color =
          type === "nhập" ? "green" : type === "xuất" ? "blue" : "red";
        return <Badge color={color}>{type.toUpperCase()}</Badge>;
      },
    },
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
          Quản lý phiếu xuất nhập vật tư
        </Title>
        <Group>
          <Button variant="outline" radius={4} leftSection={<IconFileExcel />}>
            Xuất File
          </Button>
          <Button radius={4} onClick={openStockSupply}>
            Thêm mới
          </Button>
        </Group>
      </Group>

      <Table columns={materialUsageColumns} data={materialUsages} />
      <Modal
        opened={openedStockSupply}
        onClose={closeStockSupply}
        title={<Text fw="bold">Thêm mới phiếu xuất/nhập vật tư</Text>}
      >
        <AddSupplyForm />
      </Modal>
    </Stack>
  );
};

export default StockManagementSupplyPage;
