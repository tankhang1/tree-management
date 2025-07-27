import {
  ActionIcon,
  Autocomplete,
  Badge,
  Button,
  Group,
  Menu,
  Select,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import {
  IconCalendar,
  IconDotsVertical,
  IconEye,
  IconFileExcel,
  IconSearch,
} from "@tabler/icons-react";
import type { MRT_ColumnDef } from "mantine-react-table";
import { useNavigate } from "react-router-dom";
import Table from "../../../components/Table";
import { PATH } from "../../../constants/path.constants";
import { DatePickerInput } from "@mantine/dates";
type Bill = {
  billId: string; // Mã hóa đơn
  orderId: string; // Mã đơn hàng
  issueDate: string; // Ngày phát hành (YYYY-MM-DD)
  totalAmount: number; // Tổng tiền
  discountAmount: number; // Số tiền giảm trừ
  payableAmount: number; // Tổng tiền thanh toán
  invoiceInfo: {
    name: string; // Tên người xuất hóa đơn
    phone: string; // Số điện thoại
    companyName: string; // Tên công ty
    taxCode: string; // Mã số thuế (MST)
  };
  status: string; // Trạng thái
};

const billDataset: Bill[] = [
  {
    billId: "BILL001",
    orderId: "ORD001",
    issueDate: "2025-07-01",
    totalAmount: 5000000,
    discountAmount: 500000,
    payableAmount: 4500000,
    invoiceInfo: {
      name: "Nguyễn Văn A",
      phone: "0123456789",
      companyName: "Công ty TNHH ABC",
      taxCode: "123456789",
    },
    status: "Đã thanh toán",
  },
  {
    billId: "BILL002",
    orderId: "ORD002",
    issueDate: "2025-07-15",
    totalAmount: 3000000,
    discountAmount: 300000,
    payableAmount: 2700000,
    invoiceInfo: {
      name: "Trần Thị B",
      phone: "0987654321",
      companyName: "Công ty TNHH XYZ",
      taxCode: "987654321",
    },
    status: "Chưa thanh toán",
  },
  {
    billId: "BILL003",
    orderId: "ORD003",
    issueDate: "2025-07-20",
    totalAmount: 7000000,
    discountAmount: 700000,
    payableAmount: 6300000,
    invoiceInfo: {
      name: "Phạm Văn C",
      phone: "0912345678",
      companyName: "Công ty TNHH DEF",
      taxCode: "456789123",
    },
    status: "Đã hủy",
  },
];

const BillManagementCompanyPage = () => {
  const navigate = useNavigate();

  const billColumns: MRT_ColumnDef<Bill>[] = [
    { accessorKey: "billId", header: "Mã hóa đơn" },
    { accessorKey: "orderId", header: "Mã đơn hàng" },
    { accessorKey: "issueDate", header: "Ngày phát hành" },
    {
      accessorKey: "totalAmount",
      header: "Tổng tiền",
      Cell: ({ cell }) => (
        <Text fw={500} color="blue">
          {cell.getValue<number>().toLocaleString("vi-VN")} đ
        </Text>
      ),
    },
    {
      accessorKey: "discountAmount",
      header: "Số tiền giảm trừ",
      Cell: ({ cell }) => (
        <Text fw={500} color="orange">
          {cell.getValue<number>().toLocaleString("vi-VN")} đ
        </Text>
      ),
    },
    {
      accessorKey: "payableAmount",
      header: "Tổng tiền thanh toán",
      Cell: ({ cell }) => (
        <Text fw={500} color="green">
          {cell.getValue<number>().toLocaleString("vi-VN")} đ
        </Text>
      ),
    },

    {
      accessorKey: "status",
      header: "Trạng thái",
      Cell: ({ cell }) => {
        const status = cell.getValue<string>();
        const color =
          status === "Đã thanh toán"
            ? "green"
            : status === "Chưa thanh toán"
            ? "yellow"
            : "red";

        return <Badge color={color}>{status}</Badge>;
      },
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
            <Menu.Item
              leftSection={<IconEye size={18} color="gray" />}
              onClick={onBillDetail}
            >
              Chi tiết
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      ),
    },
  ];
  const onBillDetail = () => {
    // Navigate to bill detail page
    navigate(PATH.BILL_MANAGEMENT_COMPANY_DETAIL);
  };
  return (
    <Stack gap="lg">
      <Group justify="space-between">
        <Title flex={1} order={2}>
          Quản lý hoá đơn doanh nghiệp
        </Title>
        <Group>
          <Button variant="outline" radius={4} leftSection={<IconFileExcel />}>
            Xuất File
          </Button>
        </Group>
      </Group>
      <Group gap="md">
        <Autocomplete
          leftSection={<IconSearch size={18} />}
          placeholder="Tìm kiếm mã hóa đơn hoặc mã đơn hàng"
          radius={4}
          data={billDataset.map((bill) => bill.billId)} // Lấy danh sách mã hóa đơn
        />

        <Select
          placeholder="Trạng thái"
          radius={4}
          data={["Đã thanh toán", "Chưa thanh toán", "Đã hủy"]} // Danh sách trạng thái
        />
        <DatePickerInput
          placeholder="Ngày bắt đầu"
          locale="vi"
          radius={4}
          leftSection={<IconCalendar size={18} />}
        />
        <DatePickerInput
          placeholder="Ngày kết thúc"
          radius={4}
          locale="vi"
          leftSection={<IconCalendar size={18} />}
        />
      </Group>
      <Table columns={billColumns} data={billDataset} />
    </Stack>
  );
};
export default BillManagementCompanyPage;
