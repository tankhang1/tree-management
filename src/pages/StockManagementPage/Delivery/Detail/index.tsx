import {
  Card,
  Title,
  Text,
  Stack,
  Divider,
  Group,
  Button,
  Grid,
  Badge,
} from "@mantine/core";
import { IconArrowLeft } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";

const importedItems = [
  {
    name: "Phân NPK 16-16-8",
    group: "Phân bón",
    quantity: 100,
    unit: "bao",
    packing: "25kg/bao",
    origin: "Việt Nam",
    importDate: "2025-07-16",
    expiryDate: "2026-07-16",
    supplier: "Công ty Nông sản Xanh",
    lotCode: "NPK-20250716",
  },
  {
    name: "Phân NPK 16-16-8",
    group: "Phân bón",
    quantity: 100,
    unit: "bao",
    packing: "25kg/bao",
    origin: "Việt Nam",
    importDate: "2025-07-16",
    expiryDate: "2026-07-16",
    supplier: "Công ty Nông sản Xanh",
    lotCode: "NPK-20250716",
  },
];
export default function StockManagementDeliveryDetailPage() {
  const navigate = useNavigate();

  return (
    <Card withBorder shadow="sm" radius={4} p="lg">
      <Group mb={"md"}>
        <Button
          variant="subtle"
          radius={4}
          leftSection={<IconArrowLeft size={18} />}
          onClick={() => navigate(-1)}
        >
          Quay lại
        </Button>
        <Title order={3} mb="md">
          Chi tiết kho vận
        </Title>
      </Group>

      <Card withBorder p="md">
        <Stack>
          <Text size="sm" fw={500}>
            Tên vật tư:{" "}
            <Text span fw={400}>
              Phân NPK 16-16-8
            </Text>
          </Text>
          <Text size="sm" fw={500}>
            Nhóm vật tư:{" "}
            <Text span fw={400}>
              Phân bón
            </Text>
          </Text>
          <Text size="sm" fw={500}>
            Số lượng:{" "}
            <Text span fw={400}>
              100
            </Text>
          </Text>
          <Text size="sm" fw={500}>
            Đơn vị:{" "}
            <Text span fw={400}>
              bao
            </Text>
          </Text>
          <Text size="sm" fw={500}>
            Quy cách đóng gói:{" "}
            <Text span fw={400}>
              25kg/bao
            </Text>
          </Text>
          <Text size="sm" fw={500}>
            Xuất xứ:{" "}
            <Text span fw={400}>
              Việt Nam
            </Text>
          </Text>
          <Text size="sm" fw={500}>
            Ngày nhập:{" "}
            <Text span fw={400}>
              16/07/2025
            </Text>
          </Text>
          <Text size="sm" fw={500}>
            Hạn sử dụng:{" "}
            <Text span fw={400}>
              16/07/2026
            </Text>
          </Text>
          <Text size="sm" fw={500}>
            Nhà cung cấp:{" "}
            <Text span fw={400}>
              Công ty Nông sản Xanh
            </Text>
          </Text>
          <Text size="sm" fw={500}>
            Mã lô:{" "}
            <Text span fw={400}>
              NPK-20250716
            </Text>
          </Text>
        </Stack>
      </Card>

      <Divider label="Danh sách vật tư" labelPosition="center" my="sm" />

      <Grid gutter="sm">
        {importedItems.map((item, index) => (
          <Grid.Col span={{ base: 12, sm: 6, md: 4 }} key={index}>
            <Card shadow="sm" radius="md" withBorder>
              <Group justify="apart" mb="xs">
                <Text fw={600}>{item.name}</Text>
                <Badge variant="filled" color="blue" radius="sm">
                  {item.group}
                </Badge>
              </Group>
              <Stack gap={4}>
                <Text size="sm">🔢 Số lượng: {item.quantity}</Text>
                <Text size="sm">📦 Đơn vị: {item.unit}</Text>
                <Text size="sm">📑 Quy cách: {item.packing}</Text>
              </Stack>
            </Card>
          </Grid.Col>
        ))}
      </Grid>
    </Card>
  );
}
