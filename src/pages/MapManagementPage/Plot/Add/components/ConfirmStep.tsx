import {
  Stack,
  Card,
  Group,
  Text,
  Title,
  Divider,
  Badge,
  Grid,
  ThemeIcon,
  SimpleGrid,
} from "@mantine/core";
import {
  IconMapPin,
  IconPlant,
  IconRulerMeasure,
  IconTopologyStar,
  IconArrowBarToRight,
} from "@tabler/icons-react";

export function ConfirmStep({
  region,
  zone,
  block,
  area,
  contour,
  elevation,
  gps,
  rows,
}: {
  region: string;
  zone: string;
  block: string;
  area: number;
  contour: string;
  elevation: number;
  gps: { lat: number; lng: number }[];
  rows: {
    name: string;
    plantType?: string;
    seed?: string;
    quantity?: number;
  }[];
}) {
  return (
    <Stack gap="xl" mt="md">
      <Title order={2}>📋 Xác nhận tạo mới lô</Title>

      <Card withBorder radius="lg" shadow="sm" p="lg">
        <Grid gutter="xl">
          <Grid.Col span={6}>
            <Group gap="xs">
              <ThemeIcon color="green" variant="light">
                <IconMapPin size={18} />
              </ThemeIcon>
              <Text fw={500}>Vùng trồng:</Text>
              <Badge>{region}</Badge>
            </Group>
            <Group gap="xs" mt="xs">
              <ThemeIcon color="green" variant="light">
                <IconMapPin size={18} />
              </ThemeIcon>
              <Text fw={500}>Khu vực:</Text>
              <Badge variant="light">{zone}</Badge>
            </Group>
          </Grid.Col>
          <Grid.Col span={6}>
            <Group gap="xs">
              <ThemeIcon color="green" variant="light">
                <IconPlant size={18} />
              </ThemeIcon>
              <Text fw={500}>Tên lô:</Text>
              <Badge color="green">{block}</Badge>
            </Group>
            <Group gap="xs" mt="xs">
              <ThemeIcon color="green" variant="light">
                <IconRulerMeasure size={18} />
              </ThemeIcon>
              <Text fw={500}>Diện tích:</Text>
              <Text>{area.toLocaleString()} m²</Text>
            </Group>
          </Grid.Col>
          <Grid.Col span={6}>
            <Group gap="xs">
              <ThemeIcon color="cyan" variant="light">
                <IconTopologyStar size={18} />
              </ThemeIcon>
              <Text fw={500}>Đường bình độ:</Text>
              <Text>{contour || "Không có"}</Text>
            </Group>
          </Grid.Col>
          <Grid.Col span={6}>
            <Group gap="xs">
              <ThemeIcon color="indigo" variant="light">
                <IconArrowBarToRight size={18} />
              </ThemeIcon>
              <Text fw={500}>Cao độ:</Text>
              <Text>{elevation} m</Text>
            </Group>
          </Grid.Col>
        </Grid>
      </Card>

      <Divider label="🌿 Danh sách hàng (Card)" labelPosition="center" />

      <SimpleGrid cols={3} spacing="lg">
        {rows.map((row, idx) => (
          <Card key={idx} withBorder shadow="xs" radius="md" p="md">
            <Stack gap="xs">
              <Group justify="apart">
                <Text fw={600}>Hàng {idx + 1}</Text>
                <Badge color="green" variant="light">
                  {row.name}
                </Badge>
              </Group>

              {row.plantType && (
                <Group gap="xs">
                  <Text size="sm" c="dimmed">
                    Loại cây:
                  </Text>
                  <Text size="sm">{row.plantType}</Text>
                </Group>
              )}

              {row.seed && (
                <Group gap="xs">
                  <Text size="sm" c="dimmed">
                    Hạt giống:
                  </Text>
                  <Text size="sm">{row.seed}</Text>
                </Group>
              )}

              {row.quantity !== undefined && (
                <Group gap="xs">
                  <Text size="sm" c="dimmed">
                    Số lượng cây:
                  </Text>
                  <Text size="sm">{row.quantity}</Text>
                </Group>
              )}
            </Stack>
          </Card>
        ))}
      </SimpleGrid>

      <Divider label="📍 Tọa độ GPS" labelPosition="center" />

      <Card withBorder radius="md" shadow="xs" p="md">
        <Text size="sm" mb="sm" c="dimmed">
          {gps.length} điểm tọa độ
        </Text>
        <Stack gap={4}>
          {gps.map((point, idx) => (
            <Text key={idx} size="sm">
              • ({point.lat}, {point.lng})
            </Text>
          ))}
        </Stack>
      </Card>
    </Stack>
  );
}
