import {
  Badge,
  Button,
  Card,
  Divider,
  Group,
  Paper,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from "@mantine/core";
import { IconArrowLeft, IconClock, IconFileText } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
const sampleData = {
  variety: "Sầu riêng Dona",
  duration: 100,
  stages: [
    {
      name: "Nảy mầm",
      duration: 10,
      conditionNote: "Đảm bảo độ ẩm trên 70%",
      document: "Huong-dan-nay-mam.pdf",
    },
    {
      name: "Sinh trưởng",
      duration: 30,
      conditionNote: "Tưới mỗi ngày, đủ ánh sáng",
      document: "Ky-thuat-sinh-truong.pdf",
    },
    {
      name: "Ra hoa",
      duration: 20,
      conditionNote: "Phun phân bón lá định kỳ",
      document: null,
    },
  ],
};
const SeasonManagementCycleDetailPage = () => {
  const navigate = useNavigate();
  return (
    <Stack>
      <Group mb={"md"}>
        <Button
          variant="subtle"
          radius={4}
          leftSection={<IconArrowLeft size={18} />}
          onClick={() => navigate(-1)}
        >
          Quay lại
        </Button>
        <Title order={3}>🌱 Chi tiết chu kỳ sinh trưởng</Title>
      </Group>
      <Card withBorder radius={4} shadow="sm" p="lg">
        <Group justify="space-between">
          <Stack gap={4}>
            <Text size="sm" c="dimmed">
              Giống cây
            </Text>
            <Text fw={600} fz="lg">
              {sampleData.variety}
            </Text>
          </Stack>
          <Stack gap={4} align="end">
            <Text size="sm" c="dimmed">
              Tổng thời gian
            </Text>
            <Group gap={4}>
              <ThemeIcon variant="light" color="teal" size="sm">
                <IconClock size={16} />
              </ThemeIcon>
              <Text fw={600}>{sampleData.duration} ngày</Text>
            </Group>
          </Stack>
        </Group>
      </Card>

      <Divider my="lg" label="Danh sách giai đoạn" labelPosition="center" />

      <Stack>
        {sampleData.stages.map((stage, idx) => (
          <Paper key={idx} withBorder shadow="xs" radius={4} p="md">
            <Group justify="space-between" mb={4}>
              <Text fw={600}>
                Giai đoạn {idx + 1}: {stage.name}
              </Text>
              <Badge color="green" leftSection={<IconClock size={12} />}>
                {stage.duration} ngày
              </Badge>
            </Group>
            <Text size="sm" c="dimmed" mb={6}>
              {stage.conditionNote}
            </Text>
            {stage.document && (
              <Group>
                <ThemeIcon variant="light" color="blue" size="sm">
                  <IconFileText size={16} />
                </ThemeIcon>
                <Button
                  variant="subtle"
                  size="xs"
                  component="a"
                  href={`/${stage.document}`}
                  target="_blank"
                  px={0}
                >
                  {stage.document}
                </Button>
              </Group>
            )}
          </Paper>
        ))}
      </Stack>
    </Stack>
  );
};
export default SeasonManagementCycleDetailPage;
