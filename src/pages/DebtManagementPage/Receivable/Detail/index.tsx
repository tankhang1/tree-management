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
const DebtManagementReceivableDetailPage = () => {
  const navigate = useNavigate();
  const customerInfo = {
    name: "Nguyễn Văn A",
    phone: "0123456789",
    email: "nguyenvana@example.com",
    address: "123 Đường ABC, Quận 1, TP.HCM",
    category: "Khách hàng",
  };

  const receivableDataset: ReceivableDetail[] = [
    {
      invoiceId: "INV001",
      amount: 2000000,
      status: "Chưa thanh toán",
      dueDate: "2025-08-01",
    },
    {
      invoiceId: "INV002",
      amount: 3000000,
      status: "Đã thanh toán",
      dueDate: "2025-07-15",
    },
    {
      invoiceId: "INV003",
      amount: 5000000,
      status: "Đang xử lý",
      dueDate: "2025-08-10",
    },
  ];
  const receivableColumns: MRT_ColumnDef<ReceivableDetail>[] = [
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
        <Title order={3}></Title>
        <Group>
          <Button
            variant="subtle"
            radius={4}
            leftSection={<IconArrowLeft size={18} />}
            onClick={() => navigate(-1)}
          >
            Quay lại
          </Button>
          <Title order={3}>Chi tiết công nợ phải thu</Title>
        </Group>
        <Stack gap="lg">
          {/* Phần 1: Thông tin khách hàng */}
          <Card withBorder radius={4} p="lg">
            <Title order={4} fw={500}>
              Thông tin khách hàng
            </Title>
            <Divider my="sm" />
            <Stack gap="xs">
              <Group justify="space-between">
                <Text fw={500}>Tên khách hàng:</Text>
                <Text>{customerInfo.name}</Text>
              </Group>
              <Group justify="space-between">
                <Text fw={500}>Số điện thoại:</Text>
                <Text>{customerInfo.phone}</Text>
              </Group>
              <Group justify="space-between">
                <Text fw={500}>Email:</Text>
                <Text>{customerInfo.email}</Text>
              </Group>
              <Group justify="space-between">
                <Text fw={500}>Địa chỉ:</Text>
                <Text>{customerInfo.address}</Text>
              </Group>
              <Group justify="space-between">
                <Text fw={500}>Phân loại:</Text>
                <Badge color="blue">{customerInfo.category}</Badge>
              </Group>
            </Stack>
          </Card>

          {/* Phần 2: Danh sách công nợ */}
          <Card withBorder radius={4} p="lg">
            <Title order={4} fw={500}>
              Danh sách công nợ
            </Title>
            <Divider my="sm" />
            <Table columns={receivableColumns} data={receivableDataset} />
          </Card>
        </Stack>
      </Stack>
    </Card>
  );
};

export default DebtManagementReceivableDetailPage;
