import {
  Button,
  Group,
  Stack,
  Text,
  Title,
  Badge,
  Menu,
  ActionIcon,
  Select,
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
import { useNavigate } from "react-router-dom";
import { PATH } from "../../../constants/path.constants";

type DebtPayable = {
  id: string; // Mã công nợ
  contactName: string; // Tên liên hệ
  contactPhone: string; // Số điện thoại liên hệ
  category: string; // Phân loại (Khách hàng, Đối tác, Nhà cung cấp, Ngân hàng)
  status: string; // Trạng thái (Chưa thanh toán, Đã thanh toán, Đang xử lý)
  totalDebt: number; // Tổng công nợ
  lastPaymentDate: string; // Thời gian thanh toán gần nhất (YYYY-MM-DD)
  invoices: Invoice[]; // Danh sách hóa đơn
};

type Invoice = {
  invoiceId: string; // Mã hóa đơn
  amount: number; // Số tiền
  paymentMethod: string; // Phương thức thanh toán
  transactionId: string; // Mã giao dịch
};
const debtPayableDataset: DebtPayable[] = [
  {
    id: "DEBT001",
    contactName: "Nguyễn Văn A",
    contactPhone: "0123456789",
    category: "Nhà cung cấp",
    status: "Chưa thanh toán",
    totalDebt: 5000000,
    lastPaymentDate: "2025-07-20",
    invoices: [
      {
        invoiceId: "INV001",
        amount: 2000000,
        paymentMethod: "Chuyển khoản",
        transactionId: "TXN001",
      },
      {
        invoiceId: "INV002",
        amount: 3000000,
        paymentMethod: "Tiền mặt",
        transactionId: "TXN002",
      },
    ],
  },
  {
    id: "DEBT002",
    contactName: "Công ty XYZ",
    contactPhone: "0987654321",
    category: "Ngân hàng",
    status: "Đã thanh toán",
    totalDebt: 10000000,
    lastPaymentDate: "2025-07-15",
    invoices: [
      {
        invoiceId: "INV003",
        amount: 10000000,
        paymentMethod: "Chuyển khoản",
        transactionId: "TXN003",
      },
    ],
  },
];
const DebtManagementPayablePage = () => {
  const navigate = useNavigate();
  const onAddPayable = () => {
    navigate(PATH.DEBT_PAYABLE_ADD);
  };

  const debtPayableColumns: MRT_ColumnDef<DebtPayable>[] = [
    { accessorKey: "id", header: "Mã công nợ" },
    { accessorKey: "contactName", header: "Tên liên hệ" },
    { accessorKey: "contactPhone", header: "Số điện thoại" },
    { accessorKey: "category", header: "Phân loại" },
    {
      accessorKey: "status",
      header: "Trạng thái",
      Cell: ({ cell }) => {
        const status = cell.getValue<string>();
        const color =
          status === "Đã thanh toán"
            ? "green"
            : status === "Chưa thanh toán"
            ? "red"
            : "yellow";

        return <Badge color={color}>{status}</Badge>;
      },
    },
    {
      accessorKey: "totalDebt",
      header: "Tổng công nợ",
      Cell: ({ cell }) => (
        <Text fw={500} color="blue">
          {cell.getValue<number>().toLocaleString("vi-VN")} đ
        </Text>
      ),
    },
    { accessorKey: "lastPaymentDate", header: "Thanh toán gần nhất" },
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
            <Menu.Item
              leftSection={<IconEye size={18} color="gray" />}
              onClick={onPayableDetail}
            >
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
  const onPayableDetail = () => {
    navigate(PATH.DEBT_PAYABLE_DETAIL);
  };
  return (
    <Stack gap="lg">
      <Group justify="space-between">
        <Title flex={1} order={2}>
          Quản lý công nợ phải trả
        </Title>
        <Group>
          <Button variant="outline" radius={4} leftSection={<IconFileExcel />}>
            Xuất File
          </Button>
          <Button radius={4} onClick={onAddPayable}>
            Thêm mới
          </Button>
        </Group>
      </Group>
      <Group>
        <Select
          label="Phân loại"
          placeholder="Chọn phân loại"
          data={[
            { value: "customer", label: "Khách hàng" },
            { value: "partner", label: "Đối tác" },
            { value: "supplier", label: "Nhà cung cấp" },
            { value: "bank", label: "Ngân hàng" },
          ]}
          radius={4}
        />
        <Select
          label="Trạng thái"
          placeholder="Chọn trạng thái"
          data={[
            { value: "paid", label: "Đã thanh toán" },
            { value: "unpaid", label: "Chưa thanh toán" },
            { value: "processing", label: "Đang xử lý" },
          ]}
          radius={4}
        />
      </Group>
      <Table columns={debtPayableColumns} data={debtPayableDataset} />
    </Stack>
  );
};
export default DebtManagementPayablePage;
