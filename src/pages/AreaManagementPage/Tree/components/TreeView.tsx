import {
  Group,
  Stack,
  Text,
  ThemeIcon,
  Divider,
  Grid,
  Image,
} from "@mantine/core";
import {
  IconPlant,
  IconLeaf,
  IconSeeding,
  IconMapPin,
  IconCalendar,
  IconRulerMeasure,
  IconDroplet,
} from "@tabler/icons-react";
type TTree = {
  type: string;
  variety: string;
  img: string;
  seed: string;
  method: string;
  irrigation: string;
  plantedAt: string;
  region: string;
  area: string;
  plot: string;
  row: string;
  coords: [number, number][];
};
const TreeDetailView = ({
  tree,
}: {
  //@ts-check no check
  tree: TTree;
}) => {
  return (
    <Stack gap="xs">
      {/* Thông tin cơ bản */}
      <Group>
        <Stack>
          <Group align="flex-start">
            <ThemeIcon variant="light" color="green" size="lg" radius="xl">
              <IconPlant size={20} />
            </ThemeIcon>
            <Stack gap={0}>
              <Text size="sm" c="dimmed">
                Loại cây trồng
              </Text>
              <Text fw={500}>{tree.type}</Text>
            </Stack>
          </Group>

          <Group align="flex-start">
            <ThemeIcon variant="light" color="teal" size="lg" radius="xl">
              <IconLeaf size={20} />
            </ThemeIcon>
            <Stack gap={0}>
              <Text size="sm" c="dimmed">
                Giống cây
              </Text>
              <Text fw={500}>{tree.variety}</Text>
            </Stack>
          </Group>

          <Group align="flex-start">
            <ThemeIcon variant="light" color="lime" size="lg" radius="xl">
              <IconSeeding size={20} />
            </ThemeIcon>
            <Stack gap={0}>
              <Text size="sm" c="dimmed">
                Hạt giống
              </Text>
              <Text fw={500}>{tree.seed}</Text>
            </Stack>
          </Group>
        </Stack>
      </Group>
      <Image src={tree.img} radius={4} />
      <Divider label="Kỹ thuật" labelPosition="left" />

      {/* Phương pháp */}
      <Grid>
        <Grid.Col span={6}>
          <Group>
            <ThemeIcon variant="light" color="orange" size="md" radius="xl">
              <IconRulerMeasure size={18} />
            </ThemeIcon>
            <Stack gap={0}>
              <Text size="sm" c="dimmed">
                Phương pháp canh tác
              </Text>
              <Text fw={500}>{tree.method}</Text>
            </Stack>
          </Group>
        </Grid.Col>
        <Grid.Col span={6}>
          <Group>
            <ThemeIcon variant="light" color="blue" size="md" radius="xl">
              <IconDroplet size={18} />
            </ThemeIcon>
            <Stack gap={0}>
              <Text size="sm" c="dimmed">
                Phương pháp tưới tiêu
              </Text>
              <Text fw={500}>{tree.irrigation}</Text>
            </Stack>
          </Group>
        </Grid.Col>
        <Grid.Col span={6}>
          <Group>
            <ThemeIcon variant="light" color="gray" size="md" radius="xl">
              <IconCalendar size={18} />
            </ThemeIcon>
            <Stack gap={0}>
              <Text size="sm" c="dimmed">
                Ngày trồng
              </Text>
              <Text fw={500}>{tree.plantedAt}</Text>
            </Stack>
          </Group>
        </Grid.Col>
      </Grid>

      <Divider label="Vị trí" labelPosition="left" />

      {/* Vị trí */}
      <Grid>
        <Grid.Col span={6}>
          <Text size="sm" c="dimmed">
            Vùng
          </Text>
          <Text fw={500}>{tree.region}</Text>
        </Grid.Col>
        <Grid.Col span={6}>
          <Text size="sm" c="dimmed">
            Khu vực
          </Text>
          <Text fw={500}>{tree.area}</Text>
        </Grid.Col>
        <Grid.Col span={6}>
          <Text size="sm" c="dimmed">
            Lô
          </Text>
          <Text fw={500}>{tree.plot}</Text>
        </Grid.Col>
        <Grid.Col span={6}>
          <Text size="sm" c="dimmed">
            Hàng
          </Text>
          <Text fw={500}>{tree.row || "—"}</Text>
        </Grid.Col>
      </Grid>

      <Divider label="Tọa độ" labelPosition="left" />

      {/* GPS */}
      <Stack>
        {tree.coords?.map((coord: [number, number], i: number) => (
          <Group key={i}>
            <ThemeIcon variant="light" size="sm" color="green">
              <IconMapPin size={14} />
            </ThemeIcon>
            <Text size="sm">
              {i + 1}. Lat: {coord[0]}, Lng: {coord[1]}
            </Text>
          </Group>
        ))}
      </Stack>
    </Stack>
  );
};

export default TreeDetailView;
