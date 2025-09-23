import {
  ActionIcon,
  Badge,
  Button,
  Card,
  Group,
  Menu,
  MultiSelect,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
  Title,
  Tooltip,
} from "@mantine/core";
import {
  IconCalendar,
  IconDotsVertical,
  IconEye,
  IconFileExcel,
  IconRefresh,
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
    status: "Đóng gói",
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
    status: "Giao hàng",
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
    status: "Hoàn tất",
  },
];

const BillManagementUserPage = () => {
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
          status === "Nhận đơn"
            ? "blue"
            : status === "Đóng gói"
            ? "orange"
            : status === "Giao hàng"
            ? "yellow"
            : status === "Hoàn tất"
            ? "green"
            : status === "Huỷ đơn"
            ? "red"
            : "gray";

        return <Badge color={color}>{status}</Badge>;
      },
    },
    {
      accessorKey: "actions",
      header: "Tuỳ chọn",
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
    navigate(PATH.BILL_MANAGEMENT_USER_DETAIL);
  };
  return (
    <Stack gap="lg">
      <Group justify="space-between">
        <Title flex={1} order={2}>
          Quản lý đơn hàng
        </Title>
        <Group>
          <Button variant="outline" radius={4} leftSection={<IconFileExcel />}>
            Xuất File
          </Button>
        </Group>
      </Group>

      <Card withBorder shadow="sm" radius={4} p="md">
        {/* Header */}
        <Group justify="space-between" align="center" mb="xs">
          <Stack gap={0}>
            <Title order={4}>Tìm kiếm đơn hàng</Title>
            <Text c="dimmed" size="sm">
              Điền từ khóa hoặc chọn lọc khoản thời gian, trạng thái
            </Text>
          </Stack>

          <Group>
            <Tooltip label="Xoá tất cả bộ lọc">
              <Button
                radius={4}
                variant="default"
                leftSection={<IconRefresh size={16} />}
                onClick={() => {}}
              >
                Làm mới
              </Button>
            </Tooltip>
            <Button radius={4} leftSection={<IconSearch size={16} />}>
              Lọc thông tin
            </Button>
          </Group>
        </Group>

        {/* Form */}
        <Stack gap="sm">
          {/* Khung tìm kiếm (keyword) */}
          <TextInput
            radius={4}
            label="Khung tìm kiếm"
            description="Ví dụ: 0RD001"
            placeholder="Nhập thông tin"
            leftSection={<IconSearch size={16} />}
          />

          <SimpleGrid cols={{ base: 1, md: 2, lg: 3 }} spacing="sm">
            <DatePickerInput
              leftSection={<IconCalendar size={18} />}
              label="Khoảng thời gian"
              description="Ví dụ: 18/5/2025 - 18/6/2025"
              placeholder="Chọn thông tin"
              radius={4}
              clearable
              locale="vi"
              type="range"
            />

            <MultiSelect
              searchable
              radius={4}
              label="Trạng thái"
              placeholder="Chọn thông tin"
              description="Ví dụ: Nhận đơn, Đóng gói, Giao hàng, Hoàn tất"
              data={[
                "Nhận đơn",
                "Đóng gói",
                "Giao hàng",
                "Hoàn tất",
                "Huỷ đơn",
              ]}
            />
          </SimpleGrid>
        </Stack>
      </Card>
      <Table columns={billColumns} data={billDataset} />
    </Stack>
  );
};
export default BillManagementUserPage;
