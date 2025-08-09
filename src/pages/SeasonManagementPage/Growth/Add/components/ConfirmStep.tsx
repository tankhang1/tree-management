import {
  Stack,
  Card,
  Group,
  Text,
  Title,
  Divider,
  Accordion,
  ScrollAreaAutosize,
} from "@mantine/core";
import { IconClockHour4, IconCalendar } from "@tabler/icons-react";
import CropCards from "./CropCards";
import {
  cropOptions,
  seedOptions,
} from "../../../../AreaManagementPage/Row/Add";
import SeedCards from "./SeedCards";
import SeedDetailCards from "../../../../AreaManagementPage/Region/Add/components/SeedDetailCards";

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
    <Stack gap="xl">
      {/* Tiêu đề */}
      <Title order={3}>📋 Xác nhận thông tin mùa vụ</Title>

      {/* Thông tin mùa vụ + Chu kỳ */}
      <Group align="flex-start" gap="md" grow>
        <Card withBorder radius="md" shadow="sm" p="md" style={{ flex: 1 }}>
          <Title order={5} mb="xs">
            🗓 Thông tin mùa vụ
          </Title>
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
          </Stack>
        </Card>

        <Card withBorder radius="md" shadow="sm" p="md" style={{ flex: 1 }}>
          <Title order={5} mb="xs">
            🔄 Chu kỳ sinh trưởng
          </Title>
          <ScrollAreaAutosize mah={180}>
            <Accordion multiple variant="separated">
              {data.cycles.map((cycle, i) => (
                <Accordion.Item value={`cycle-${i}`} key={i}>
                  <Accordion.Control fw={500}>{cycle.name}</Accordion.Control>
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
          </ScrollAreaAutosize>
        </Card>
      </Group>

      {/* Thông tin cây trồng */}
      <Divider label="🌿 Thông tin cây trồng" labelPosition="center" />
      <Card withBorder radius="md" shadow="sm" p="md">
        <CropCards
          selected=""
          plants={cropOptions}
          isCheckbox={false}
          isTouchable={false}
          onSelect={() => {}}
        />
      </Card>

      {/* Thông tin giống */}
      <Divider label="🌱 Thông tin giống cây" labelPosition="center" />
      <Card withBorder radius="md" shadow="sm" p="md">
        <SeedCards
          isCheckbox={false}
          isTouchable={false}
          selected=""
          seeds={seedOptions}
          onSelect={() => {}}
        />
      </Card>
      <Divider label="🌱 Thông tin hạt giống" labelPosition="center" />

      {/* Chi tiết giống */}
      <Card withBorder radius="md" shadow="sm" p="md">
        <SeedDetailCards isTouchable={false} />
      </Card>
    </Stack>
  );
};

export default ConfirmStep;
