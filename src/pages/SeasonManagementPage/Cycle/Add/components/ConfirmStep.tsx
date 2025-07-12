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
    treeCategory: "Rau cải",
    duration: 45,
    stages: [
      {
        name: "Gieo hạt",
        duration: 5,
        documentType: "file",
        document: "Tài liệu gieo hạt.pdf",
      },
      {
        name: "Ra lá",
        duration: 10,
        documentType: "editor",
        document: "Giai đoạn ra lá cần đủ ánh sáng và độ ẩm",
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
            <Text fw={500}>Danh mục cây trồng:</Text>
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
