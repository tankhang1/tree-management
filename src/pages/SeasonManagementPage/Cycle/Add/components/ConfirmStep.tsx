import {
  Card,
  Group,
  Stack,
  Text,
  Title,
  Divider,
  Accordion,
} from "@mantine/core";
import { IconClockHour4 } from "@tabler/icons-react";

const ConfirmStep = () => {
  const data = {
    treeGroup: "Cây ngắn ngày",
    treeCategory: "Đậu nành",
    duration: 100, // trung bình 90–110 ngày
    stages: [
      {
        name: "Nảy mầm",
        duration: 7,
        documentType: "editor",
        document:
          "Gieo hạt khi nhiệt độ đất 25–30°C, giữ ẩm 70–80%. Sau 3–5 ngày hạt nảy mầm, đảm bảo đất tơi xốp và không đọng nước.",
      },
      {
        name: "Sinh trưởng sinh dưỡng",
        duration: 30,
        documentType: "editor",
        document:
          "Cây phát triển thân lá mạnh, cần ánh sáng đầy đủ. Làm cỏ và bón thúc NPK đợt 1 sau 10–12 ngày, duy trì ẩm độ 70%.",
      },
      {
        name: "Ra hoa",
        duration: 10,
        documentType: "editor",
        document:
          "Giữ ẩm ổn định, tránh ngập úng. Bón bổ sung Lân và Kali để tăng tỉ lệ đậu hoa. Phun phòng sâu cuốn lá, rỉ sắt.",
      },
      {
        name: "Tạo hạt",
        duration: 30,
        documentType: "editor",
        document:
          "Tiếp tục tưới đều, tránh thiếu nước. Giai đoạn này cần nhiều Kali và vi lượng. Theo dõi sâu đục quả.",
      },
      {
        name: "Chín và thu hoạch",
        duration: 23,
        documentType: "file",
        document: "Hướng_dẫn_thu_hoạch_đậu_nành.pdf",
      },
    ],
  };

  return (
    <Stack mb={"md"}>
      <Title order={3}>Xác nhận chu kỳ sinh trưởng</Title>

      <Card withBorder>
        <Stack>
          <Group>
            <Text fw={500}>Nhóm cây trồng:</Text>
            <Text>{data.treeGroup}</Text>
          </Group>
          <Group>
            <Text fw={500}>Loại cây trồng:</Text>
            <Text>{data.treeCategory}</Text>
          </Group>
          <Group>
            <Text fw={500}>Thời gian diễn ra chu kỳ:</Text>
            <Text>{data.duration} ngày</Text>
          </Group>
        </Stack>
      </Card>

      <Divider label="Danh sách giai đoạn" labelPosition="center" my="md" />

      <Accordion multiple variant="separated">
        {data.stages.map((stage, idx) => (
          <Accordion.Item value={`stage-${idx}`} key={idx}>
            <Accordion.Control>
              <Group>
                <IconClockHour4 size={16} />
                <Text fw={600}>
                  {stage.name} ({stage.duration} ngày)
                </Text>
              </Group>
            </Accordion.Control>
            <Accordion.Panel>
              <Stack>
                <Text fw={500}>Tài liệu kỹ thuật:</Text>
                {stage.documentType === "file" ? (
                  <Text size="sm">📎 {stage.document}</Text>
                ) : (
                  <Text size="sm">📝 {stage.document}</Text>
                )}
              </Stack>
            </Accordion.Panel>
          </Accordion.Item>
        ))}
      </Accordion>
    </Stack>
  );
};

export default ConfirmStep;
