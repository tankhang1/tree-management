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
  variety: "Đậu nành DT84",
  duration: 100,
  stages: [
    {
      name: "Nảy mầm",
      duration: 7,
      conditionNote:
        "Gieo khi đất ấm 25–30°C, giữ ẩm 70–80%. Sau 3–5 ngày hạt nảy mầm đều.",
      document: "Huong-dan-nay-mam-dau-nanh.pdf",
    },
    {
      name: "Sinh trưởng sinh dưỡng",
      duration: 30,
      conditionNote:
        "Giữ đất tơi xốp, làm cỏ sớm. Bón thúc NPK lần 1 sau 10–12 ngày.",
      document: "Ky-thuat-cham-soc-dau-nanh.pdf",
    },
    {
      name: "Ra hoa",
      duration: 10,
      conditionNote:
        "Giữ ẩm ổn định, tránh ngập úng. Bổ sung Kali, phun thuốc phòng sâu bệnh.",
      document: null,
    },
    {
      name: "Tạo hạt",
      duration: 30,
      conditionNote:
        "Tiếp tục tưới đều, bón Kali và trung vi lượng. Theo dõi sâu đục quả.",
      document: "Huong-dan-tao-hat-dau-nanh.pdf",
    },
    {
      name: "Chín và thu hoạch",
      duration: 23,
      conditionNote:
        "Ngừng tưới 5–7 ngày trước thu. Thu khi 85–90% lá vàng, hạt khô đạt ẩm 12–13%.",
      document: "Huong-dan-thu-hoach-dau-nanh.pdf",
    },
  ],
};

const SeasonManagementCycleDetailPage = () => {
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
              <ThemeIcon variant="light" color="green" size="sm">
                <IconClock size={16} />
              </ThemeIcon>
              <Text fw={600}>{sampleData.duration} ngày</Text>
            </Group>
          </Stack>
        </Group>
      </Card>

      <Divider my="lg" label="Danh sách giai đoạn" labelPosition="center" />

      <Group wrap="wrap" gap="md" mb="md" align="flex-start">
        {sampleData.stages.map((stage, idx) => (
          <Paper h={130} key={idx} withBorder shadow="xs" radius={4} p="md">
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
      </Group>
    </Card>
  );
};
export default SeasonManagementCycleDetailPage;
