import {
  Card,
  Group,
  Stack,
  Text,
  Title,
  Divider,
  Accordion,
  Badge,
  Box,
} from "@mantine/core";
import { IconClockHour4, IconFileText, IconLeaf } from "@tabler/icons-react";

// Định nghĩa props nhận dữ liệu từ form cha
interface ConfirmStepProps {
  data: {
    varietyId: string;
    varietyLabel?: string; // Tên hiển thị của giống
    duration: number;
    stages: {
      name: string;
      duration: number;
      conditionNote?: string;
      documentType: string;
      documentContent: string;
    }[];
  };
}

const ConfirmStep = ({ data }: ConfirmStepProps) => {
  return (
    <Stack mb={"md"}>
      <Title order={4} c="blue">
        Xác nhận chu kỳ sinh trưởng
      </Title>

      <Card withBorder radius="md" p="md">
        <Stack gap="xs">
          <Group justify="space-between">
            <Text c="dimmed" size="sm">
              Giống cây trồng:
            </Text>
            <Group gap="xs">
              <IconLeaf size={16} color="green" />
              <Text fw={500}>{data.varietyLabel || data.varietyId}</Text>
            </Group>
          </Group>
          <Divider variant="dashed" />
          <Group justify="space-between">
            <Text c="dimmed" size="sm">
              Tổng thời gian:
            </Text>
            <Badge size="lg" color="blue">
              {data.duration} ngày
            </Badge>
          </Group>
          <Group justify="space-between">
            <Text c="dimmed" size="sm">
              Số giai đoạn:
            </Text>
            <Text fw={500}>{data.stages.length} giai đoạn</Text>
          </Group>
        </Stack>
      </Card>

      <Divider label="Chi tiết các giai đoạn" labelPosition="center" my="sm" />

      <Accordion multiple variant="contained" radius="md">
        {data.stages.map((stage, idx) => (
          <Accordion.Item value={`stage-${idx}`} key={idx}>
            <Accordion.Control
              icon={<IconClockHour4 size={20} color="orange" />}
            >
              <Group justify="space-between" mr="md">
                <Text fw={600}>{stage.name}</Text>
                <Badge variant="light" color="gray">
                  {stage.duration} ngày
                </Badge>
              </Group>
            </Accordion.Control>
            <Accordion.Panel>
              <Stack gap="xs">
                <Text size="sm" fw={500}>
                  Tài liệu kỹ thuật (
                  {stage.documentType === "file" ? "PDF" : "Soạn thảo"}):
                </Text>
                {stage.documentType === "file" ? (
                  <Group gap="xs">
                    <IconFileText size={16} />
                    <Text
                      size="sm"
                      c="blue"
                      td="underline"
                      style={{ cursor: "pointer" }}
                    >
                      {stage.documentContent
                        ? "Đã đính kèm file"
                        : "Chưa có file"}
                    </Text>
                  </Group>
                ) : (
                  <Box
                    p="xs"
                    bg="gray.0"
                    style={{ borderRadius: 4 }}
                    dangerouslySetInnerHTML={{
                      __html: stage.documentContent || "Chưa có nội dung",
                    }}
                  />
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
