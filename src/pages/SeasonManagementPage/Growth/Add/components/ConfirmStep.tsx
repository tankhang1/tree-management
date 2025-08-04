import {
  Stack,
  Card,
  Group,
  Text,
  Title,
  Badge,
  Divider,
  Image,
  Accordion,
} from "@mantine/core";
import {
  IconClockHour4,
  IconCalendar,
  IconPlant,
  IconSeedling,
  IconLayersSubtract,
} from "@tabler/icons-react";

const ConfirmStep = () => {
  const data = {
    name: "Mùa vụ Đông Xuân",
    duration: 120,
    treeGroup: "Cây ăn quả",
    treeCategory: "Sầu riêng",
    variety: "Giống Ri6",
    seedCode: "SR-RI6",
    seedName: "Hạt giống RI6",
    seedImage:
      "https://food-map.s3.ap-southeast-1.amazonaws.com/news/2021/03/sau-rieng-ri6-3.jpg",
    seedDesc: "Giống RI6 cho năng suất cao, cơm vàng đậm, vị ngọt thơm.",
    unit: "kg/trái",
    cycles: [
      {
        name: "Chu kỳ 1",
        stages: [
          { name: "Gieo hạt", duration: 15 },
          { name: "Ra lá", duration: 25 },
        ],
      },
      {
        name: "Chu kỳ 2",
        stages: [
          { name: "Ra hoa", duration: 30 },
          { name: "Đậu trái", duration: 50 },
        ],
      },
    ],
  };

  return (
    <Stack gap="lg">
      <Title order={3}>📋 Xác nhận thông tin mùa vụ</Title>

      <Group align="flex-start" gap="md" grow>
        <Card withBorder radius="md" shadow="sm">
          <Stack gap="xs">
            <Group>
              <IconCalendar size={18} />
              <Text fw={500}>Mùa vụ:</Text>
              <Text>{data.name}</Text>
            </Group>
            <Group>
              <IconClockHour4 size={18} />
              <Text fw={500}>Thời gian dự kiến:</Text>
              <Text>{data.duration} ngày</Text>
            </Group>
            <Group>
              <IconLayersSubtract size={18} />
              <Text fw={500}>Nhóm cây trồng:</Text>
              <Text>{data.treeGroup}</Text>
            </Group>
            <Group>
              <IconPlant size={18} />
              <Text fw={500}>Danh mục cây:</Text>
              <Text>{data.treeCategory}</Text>
            </Group>
            <Group>
              <IconPlant size={18} />
              <Text fw={500}>Giống cây:</Text>
              <Text>{data.variety}</Text>
            </Group>
            <Group>
              <IconSeedling size={18} />
              <Text fw={500}>Hạt giống:</Text>
              <Text>
                {data.seedCode} - {data.seedName}
              </Text>
            </Group>
          </Stack>
        </Card>

        <Card withBorder radius="md" shadow="xs">
          <Group align="flex-start">
            <Image src={data.seedImage} width={200} h={200} fit="contain" />
            <Stack gap={4}>
              <Text fw={500}>{data.seedName}</Text>
              <Text size="sm" c="dimmed">
                {data.seedDesc}
              </Text>
              <Badge variant="outline" color="green">
                Đơn vị thu hoạch: {data.unit}
              </Badge>
            </Stack>
          </Group>
        </Card>
      </Group>

      <Divider label="🌿 Chu kỳ sinh trưởng" labelPosition="center" />

      <Accordion multiple variant="separated">
        {data.cycles.map((cycle, i) => (
          <Accordion.Item value={`cycle-${i}`} key={i}>
            <Accordion.Control>{cycle.name}</Accordion.Control>
            <Accordion.Panel>
              <Stack gap={4}>
                {cycle.stages.map((stage, j) => (
                  <Text size="sm" key={j}>
                    • {stage.name} - {stage.duration} ngày
                  </Text>
                ))}
              </Stack>
            </Accordion.Panel>
          </Accordion.Item>
        ))}
      </Accordion>
    </Stack>
  );
};

export default ConfirmStep;
