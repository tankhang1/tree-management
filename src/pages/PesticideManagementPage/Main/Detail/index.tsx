import {
  Badge,
  Box,
  Button,
  Card,
  Divider,
  Group,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { IconArrowLeft } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
type Pesticide = {
  id: string;
  name: string;
  typeId: string;
  unit: string;
  info: string;
  ingredients: string;
  usage: string;
};

const typeMap: Record<string, string> = {
  TYPE01: "Thuốc trừ sâu",
  TYPE02: "Thuốc trừ bệnh",
  TYPE03: "Phân bón lá",
};

const pesticide: Pesticide = {
  id: "TH001",
  name: "Thuốc trừ sâu SuperKiller",
  typeId: "TYPE01",
  unit: "ml",
  info: "Diệt trừ sâu cuốn lá, rầy nâu hiệu quả cao",
  ingredients: "Chlorpyrifos Ethyl 500g/l + Cypermethrin 50g/l",
  usage:
    "Pha 25ml cho bình 16L, phun đều mặt lá vào sáng sớm. Lặp lại mỗi 7 ngày khi có dịch hại.",
};
const PesticideManagementMainDetailPage = () => {
  const navigate = useNavigate();
  return (
    <Card withBorder radius="md" shadow="sm" p="lg" maw={800} mx="auto">
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
          <Title order={3}>🌿 {pesticide.name}</Title>
        </Group>
        {/* Thông tin chung */}
        <Divider label="📄 Thông tin chung" labelPosition="left" />
        <Group>
          <Text color="dimmed" w={120}>
            Mã thuốc:
          </Text>
          <Text fw={500}>{pesticide.id}</Text>
        </Group>

        <Group>
          <Text color="dimmed" w={120}>
            Loại thuốc:
          </Text>
          <Badge color="green" radius={4}>
            {typeMap[pesticide.typeId] || pesticide.typeId}
          </Badge>
        </Group>

        <Group>
          <Text color="dimmed" w={120}>
            Đơn vị tính:
          </Text>
          <Badge color="gray" radius={4}>
            {pesticide.unit}
          </Badge>
        </Group>

        {/* Thông tin thuốc */}
        <Divider label="🧪 Thông tin thuốc" labelPosition="left" />
        <Box
          p="sm"
          style={{ backgroundColor: "#f8f9fa", borderRadius: 8, fontSize: 14 }}
          dangerouslySetInnerHTML={{ __html: pesticide.info }}
        />

        {/* Thành phần công thức */}
        <Divider label="🧬 Thành phần công thức" labelPosition="left" />
        <Box
          p="sm"
          style={{ backgroundColor: "#f8f9fa", borderRadius: 4, fontSize: 14 }}
          dangerouslySetInnerHTML={{ __html: pesticide.ingredients }}
        />

        {/* Hướng dẫn sử dụng */}
        <Divider label="📋 Hướng dẫn sử dụng" labelPosition="left" />
        <Box
          p="sm"
          style={{ backgroundColor: "#f8f9fa", borderRadius: 4, fontSize: 14 }}
          dangerouslySetInnerHTML={{ __html: pesticide.usage }}
        />
      </Stack>
    </Card>
  );
};

export default PesticideManagementMainDetailPage;
