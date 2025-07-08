import {
  Badge,
  Button,
  Card,
  Divider,
  Group,
  List,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import {
  IconBox,
  IconTool,
  IconVaccine,
  IconArrowLeft,
} from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";

// 🔸 Dữ liệu mẫu cho trang chi tiết
const mockPlan = {
  seasonName: "Mùa Xuân 2025",
  startDate: "01/01/2025",
  endDate: "30/04/2025",
  zone: "Vùng Trồng Tây Nguyên",
  area: "Khu vực Buôn Hồ",
  plot: "Lô A1-01",
  cycles: [
    {
      stages: [
        {
          stageName: "Nảy mầm",
          materials: [{ item: "Phân NPK", quantity: 10 }],
          equipment: [{ item: "Bình tưới", quantity: 2 }],
          pesticides: [{ item: "Confidor", quantity: 3 }],
        },
        {
          stageName: "Ra hoa",
          materials: [{ item: "Vôi bột", quantity: 5 }],
          equipment: [{ item: "Máy xịt", quantity: 1 }],
          pesticides: [{ item: "Radiant", quantity: 2 }],
        },
      ],
    },
  ],
};

const PlanManagementMainDetailPage = () => {
  const plan = mockPlan; // hoặc gọi API để lấy theo id
  const navigate = useNavigate();
  return (
    <Card withBorder radius="md" p="lg">
      <Stack gap="md">
        {/* Tiêu đề */}
        <Group mb={"md"}>
          <Button
            variant="subtle"
            radius={4}
            leftSection={<IconArrowLeft size={18} />}
            onClick={() => navigate(-1)}
          >
            Quay lại
          </Button>
          <Title order={3}>Chi tiết kế hoạch mùa vụ</Title>
        </Group>
        {/* Thông tin mùa vụ */}
        <Title order={4}>Thông tin kế hoạch</Title>
        <Group>
          <Text>
            <strong>Mùa vụ:</strong> {plan.seasonName}
          </Text>
        </Group>

        <Divider label="Địa điểm canh tác" labelPosition="center" my="md" />

        <Card withBorder radius="md" shadow="xs" p="md">
          <Stack gap="md">
            {/* VÙNG TRỒNG */}
            <Stack gap={4}>
              <Group gap="xs">
                <Title order={5} mb={0}>
                  Vùng trồng
                </Title>
                <Badge color="blue" variant="light">
                  VT-001
                </Badge>
              </Group>
              <Text size="sm">
                <strong>Tên:</strong> Vùng Trồng Tây Nguyên
              </Text>
              <Group gap="xl">
                <Text size="sm">
                  <strong>Diện tích:</strong> 50.000 m²
                </Text>
                <Text size="sm">
                  <strong>Loại đất:</strong> Đất đỏ bazan
                </Text>
                <Text size="sm">
                  <strong>Địa hình:</strong> Cao, Thoai thoải
                </Text>
              </Group>
            </Stack>

            <Divider label="Khu vực" labelPosition="left" />

            {/* KHU VỰC */}
            <Stack gap={4}>
              <Group gap="xs">
                <Title order={5} mb={0}>
                  Khu vực
                </Title>
                <Badge color="green" variant="light">
                  KV-TN1
                </Badge>
              </Group>
              <Text size="sm">
                <strong>Tên:</strong> Khu vực Buôn Hồ
              </Text>
              <Group gap="xl">
                <Text size="sm">
                  <strong>Đơn vị quản lý:</strong> HTX Cà phê Buôn Ma Thuột
                </Text>
                <Text size="sm">
                  <strong>Người quản lý:</strong> Nguyễn Văn Tài
                </Text>
                <Text size="sm">
                  <strong>Diện tích:</strong> 15.000 m²
                </Text>
              </Group>
            </Stack>

            <Divider label="Lô" labelPosition="left" />

            {/* LÔ */}
            <Stack gap={4}>
              <Group gap="xs">
                <Title order={5} mb={0}>
                  Lô
                </Title>
                <Badge color="teal" variant="light">
                  LO-A1-01
                </Badge>
              </Group>
              <Text size="sm">
                <strong>Tên:</strong> Lô A1-01
              </Text>
              <Group gap="xl">
                <Text size="sm">
                  <strong>Loại cây:</strong> Sầu riêng Monthong
                </Text>
                <Text size="sm">
                  <strong>Số lượng cây:</strong> 120
                </Text>
                <Text size="sm">
                  <strong>Diện tích:</strong> 3.000 m²
                </Text>
                <Text size="sm">
                  <strong>Trạng thái:</strong>{" "}
                  <Badge color="green">Đang canh tác</Badge>
                </Text>
              </Group>
            </Stack>
          </Stack>
        </Card>

        <Divider label="Thông tin mùa vụ" labelPosition="center" />

        {/* Danh sách chu kỳ */}
        {plan.cycles.map((cycle, cycleIndex) => (
          <Card withBorder key={cycleIndex} radius="md" shadow="sm" p="md">
            <Stack gap="xs">
              <Title order={5}>Chu kỳ {cycleIndex + 1}</Title>

              <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="md">
                {cycle.stages.map((stage, stageIndex) => (
                  <Card
                    key={stageIndex}
                    withBorder
                    radius="md"
                    shadow="xs"
                    p="sm"
                  >
                    <Stack gap="xs">
                      <Group justify="space-between">
                        <Title order={6}>{stage.stageName}</Title>
                        <Text size="sm" c="dimmed">
                          30 ngày
                        </Text>
                      </Group>
                      <Badge variant="light">Vật tư</Badge>
                      <List spacing={4} size="sm" icon={<IconBox size={14} />}>
                        {stage.materials.map((mat, i) => (
                          <List.Item key={i}>
                            {mat.item} - {mat.quantity}
                          </List.Item>
                        ))}
                      </List>

                      <Badge variant="light">Thiết bị</Badge>
                      <List spacing={4} size="sm" icon={<IconTool size={14} />}>
                        {stage.equipment.map((eq, i) => (
                          <List.Item key={i}>
                            {eq.item} - {eq.quantity}
                          </List.Item>
                        ))}
                      </List>

                      <Badge variant="light">Thuốc BVTV</Badge>
                      <List
                        spacing={4}
                        size="sm"
                        icon={<IconVaccine size={14} />}
                      >
                        {stage.pesticides.map((ps, i) => (
                          <List.Item key={i}>
                            {ps.item} - {ps.quantity}
                          </List.Item>
                        ))}
                      </List>
                    </Stack>
                  </Card>
                ))}
              </SimpleGrid>
            </Stack>
          </Card>
        ))}
      </Stack>
    </Card>
  );
};

export default PlanManagementMainDetailPage;
