import {
  Card,
  Text,
  Title,
  Stack,
  Badge,
  Divider,
  Box,
  Grid,
  Group,
  Button,
} from "@mantine/core";
import type { MRT_ColumnDef } from "mantine-react-table";
import Table from "../../../../components/Table";
import { IconArrowLeft } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
type MaintenanceRecord = {
  id: string;
  date: string;
  description: string;
  performedBy: string;
};

const maintenanceRecords: MaintenanceRecord[] = [
  {
    id: "MT001",
    date: "2023-02-10",
    description: "Thay nhớt định kỳ",
    performedBy: "Nguyễn Văn B",
  },
  {
    id: "MT004",
    date: "2023-08-15",
    description: "Bảo trì hộp số",
    performedBy: "Công ty TNHH Kỹ Thuật A",
  },
  {
    id: "MT008",
    date: "2024-03-28",
    description: "Thay lọc dầu",
    performedBy: "Trần Văn C",
  },
  {
    id: "MT002",
    date: "2022-12-05",
    description: "Kiểm tra động cơ",
    performedBy: "Lê Thị D",
  },
  {
    id: "MT009",
    date: "2023-11-01",
    description: "Sơn lại vỏ xe",
    performedBy: "Garage 79",
  },
];

const machine = {
  id: "MC001",
  name: "Xe tải Hino 5 tấn",
  type: "Xe tải",
  status: "Đang vận hành",
  specs: "<ul><li>Động cơ diesel</li><li>Tải trọng 5 tấn</li></ul>",
  price: 780000000,
  quantity: 2,
  manualFile: "https://pdfobject.com/pdf/sample.pdf",
  inspectionFile: "https://pdfobject.com/pdf/sample.pdf",
};
const MachineManagementMainDetailPage = () => {
  const navigate = useNavigate();
  const {
    id,
    name,
    type,
    status,
    specs,
    price,
    quantity,
    manualFile,
    inspectionFile,
  } = machine;

  const maintenanceColumns: MRT_ColumnDef<MaintenanceRecord>[] = [
    { accessorKey: "id", header: "Mã bảo trì" },
    {
      accessorKey: "date",
      header: "Ngày bảo trì",
      Cell: ({ row }) =>
        new Date(row.original.date).toLocaleDateString("vi-VN"),
    },
    { accessorKey: "description", header: "Nội dung" },
    { accessorKey: "performedBy", header: "Thực hiện bởi" },
  ];

  const formatCurrency = (value: number) =>
    value.toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });

  const statusColor =
    status === "Đang vận hành"
      ? "green"
      : status === "Đang bảo trì"
      ? "orange"
      : "gray";

  return (
    <Card radius="md" shadow="sm" p="lg" withBorder>
      <Stack gap="lg">
        <Group mb={"md"}>
          <Button
            variant="subtle"
            radius={4}
            leftSection={<IconArrowLeft size={18} />}
            onClick={() => navigate(-1)}
          >
            Quay lại
          </Button>
          <Title order={3}>🛠️ Thông tin máy móc</Title>
        </Group>
        {/* Thông tin chung */}
        <Grid>
          <Grid.Col span={6}>
            <Text size="sm" color="dimmed">
              Mã máy:
            </Text>
            <Text fw={500}>{id}</Text>
          </Grid.Col>
          <Grid.Col span={6}>
            <Text size="sm" color="dimmed">
              Tên máy:
            </Text>
            <Text fw={500}>{name}</Text>
          </Grid.Col>

          <Grid.Col span={6}>
            <Text size="sm" color="dimmed">
              Loại xe:
            </Text>
            <Text fw={500}>{type}</Text>
          </Grid.Col>
          <Grid.Col span={6}>
            <Text size="sm" color="dimmed">
              Trạng thái:
            </Text>
            <Badge color={statusColor}>{status}</Badge>
          </Grid.Col>

          <Grid.Col span={6}>
            <Text size="sm" color="dimmed">
              Giá:
            </Text>
            <Text fw={500}>{formatCurrency(price)}</Text>
          </Grid.Col>
          <Grid.Col span={6}>
            <Text size="sm" color="dimmed">
              Số lượng:
            </Text>
            <Text fw={500}>{quantity}</Text>
          </Grid.Col>
        </Grid>

        {/* Thông số kỹ thuật */}
        <Divider label="📑 Thông số kỹ thuật" labelPosition="center" />
        <Box
          style={{
            border: "1px solid #ddd",
            borderRadius: 4,
            padding: 12,
            backgroundColor: "#fafafa",
            fontSize: 14,
          }}
          dangerouslySetInnerHTML={{ __html: specs }}
        />

        {/* Tài liệu PDF */}
        {manualFile && (
          <>
            <Divider label="📘 Sổ tay hướng dẫn" labelPosition="center" />
            <iframe
              src={manualFile}
              height="400px"
              width="100%"
              style={{ border: "1px solid #ccc", borderRadius: "8px" }}
              title="manual-pdf"
            />
          </>
        )}
        {inspectionFile && (
          <>
            <Divider label="📄 Biên bản đăng kiểm" labelPosition="center" />
            <iframe
              src={inspectionFile}
              height="400px"
              width="100%"
              style={{ border: "1px solid #ccc", borderRadius: "8px" }}
              title="inspection-pdf"
            />
          </>
        )}

        {/* Lịch sử bảo trì */}
        <Divider label="🛠️ Lịch sử bảo trì" labelPosition="center" />
        <Table columns={maintenanceColumns} data={maintenanceRecords} />
      </Stack>
    </Card>
  );
};

export default MachineManagementMainDetailPage;
