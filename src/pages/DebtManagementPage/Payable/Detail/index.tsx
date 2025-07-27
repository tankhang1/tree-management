import {
  Stack,
  Text,
  Title,
  Card,
  Group,
  Badge,
  Divider,
  Button,
} from "@mantine/core";
import type { MRT_ColumnDef } from "mantine-react-table";
import Table from "../../../../components/Table";
import { IconArrowLeft } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
type ReceivableDetail = {
  invoiceId: string; // Mã hóa đơn
  amount: number; // Số tiền
  status: string; // Trạng thái (Đã thanh toán, Chưa thanh toán, Đang xử lý)
  dueDate: string; // Ngày đến hạn (YYYY-MM-DD)
};
const DebtManagementPayableDetailPage = () => {
  const navigate = useNavigate();
  const supplierInfo = {
    name: "Công ty TNHH ABC",
    phone: "0987654321",
    email: "contact@abccompany.com",
    address: "456 Đường XYZ, Quận 2, TP.HCM",
    category: "Nhà cung cấp",
  };

  const payableDataset: ReceivableDetail[] = [
    {
      invoiceId: "PAY001",
      amount: 10000000,
      status: "Chưa thanh toán",
      dueDate: "2025-08-05",
    },
    {
      invoiceId: "PAY002",
      amount: 5000000,
      status: "Đã thanh toán",
      dueDate: "2025-07-20",
    },
    {
      invoiceId: "PAY003",
      amount: 7000000,
      status: "Đang xử lý",
      dueDate: "2025-08-15",
    },
  ];

  const payableColumns: MRT_ColumnDef<ReceivableDetail>[] = [
    { accessorKey: "invoiceId", header: "Mã hóa đơn" },
    {
      accessorKey: "amount",
      header: "Số tiền",
      Cell: ({ cell }) => (
        <Text fw={500} color="blue">
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
            ? "red"
            : "yellow";

        return <Badge color={color}>{status}</Badge>;
      },
    },
    { accessorKey: "dueDate", header: "Ngày đến hạn" },
  ];

  return (
    <Card withBorder radius="md" shadow="sm" p="lg">
      <Stack gap="lg">
        {/* Header */}
        <Group>
          <Button
            variant="subtle"
            radius={4}
            leftSection={<IconArrowLeft size={18} />}
            onClick={() => navigate(-1)}
          >
            Quay lại
          </Button>
          <Title order={3}>Chi tiết công nợ phải trả</Title>
        </Group>
        <Stack gap="lg">
          {/* Phần 1: Thông tin nhà cung cấp */}
          <Card withBorder radius={4} p="lg">
            <Title order={4} fw={500}>
              Thông tin nhà cung cấp
            </Title>
            <Divider my="sm" />
            <Stack gap="xs">
              <Group justify="space-between">
                <Text fw={500}>Tên nhà cung cấp:</Text>
                <Text>{supplierInfo.name}</Text>
              </Group>
              <Group justify="space-between">
                <Text fw={500}>Số điện thoại:</Text>
                <Text>{supplierInfo.phone}</Text>
              </Group>
              <Group justify="space-between">
                <Text fw={500}>Email:</Text>
                <Text>{supplierInfo.email}</Text>
              </Group>
              <Group justify="space-between">
                <Text fw={500}>Địa chỉ:</Text>
                <Text>{supplierInfo.address}</Text>
              </Group>
              <Group justify="space-between">
                <Text fw={500}>Phân loại:</Text>
                <Badge color="blue">{supplierInfo.category}</Badge>
              </Group>
            </Stack>
          </Card>

          {/* Phần 2: Danh sách công nợ */}
          <Card withBorder radius={4} p="lg">
            <Title order={4} fw={500}>
              Danh sách công nợ
            </Title>
            <Divider my="sm" />
            <Table columns={payableColumns} data={payableDataset} />
          </Card>
        </Stack>
      </Stack>
    </Card>
  );
};

export default DebtManagementPayableDetailPage;
