import { Box, Button, Card, Group, Stack, Text, Title } from "@mantine/core";
import { IconArrowLeft } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
const season = {
  name: "Mùa vụ Hè 2025",
  estimatedDuration: 120,
  cropLabel: "Sầu riêng Ri6",
  growthCycles: [
    {
      id: "cycle1",
      cycleLabel: "Chu kỳ A",
      stageLabels: ["Gieo trồng", "Nảy mầm", "Ra hoa"],
    },
    {
      id: "cycle2",
      cycleLabel: "Chu kỳ B",
      stageLabels: ["Phát triển thân lá", "Kết trái"],
    },
  ],
};

const SeasonManagementGrowthDetailPage = () => {
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
        <Title order={3}>🌱 Chi tiết mùa vụ</Title>
      </Group>
      <Stack gap="md">
        <Title order={3}>Chi tiết mùa vụ</Title>

        <Stack gap="xs">
          <Text>
            <strong>Mùa vụ:</strong> {season.name}
          </Text>
          <Text>
            <strong>Thời gian ước tính:</strong> {season.estimatedDuration} ngày
          </Text>
          <Text>
            <strong>Cây trồng:</strong> {season.cropLabel}
          </Text>
        </Stack>

        <Title order={5} mt="md">
          Chu kỳ sinh trưởng
        </Title>
        {season.growthCycles.map((cycle) => (
          <Box
            key={cycle.id}
            p="sm"
            style={{ border: "1px solid #ccc", borderRadius: 6 }}
          >
            <Text>
              <strong>{cycle.cycleLabel}</strong>
            </Text>
            <Text size="sm" c="dimmed">
              Giai đoạn: {cycle.stageLabels.join(", ")}
            </Text>
          </Box>
        ))}
      </Stack>
    </Card>
  );
};
export default SeasonManagementGrowthDetailPage;
