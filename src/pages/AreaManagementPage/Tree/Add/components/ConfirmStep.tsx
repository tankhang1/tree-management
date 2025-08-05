import { Stack, Card, Group, Text, Title, Divider, Badge } from "@mantine/core";
import { MapContainer, Polygon, TileLayer } from "react-leaflet";

type GPS = { lat: number; lng: number };

type TreeInfo = {
  type: string;
  variety: string;
  seed: string;
};

type ConfirmPlantingProps = {
  area: string;
  zone: string;
  block: string;
  row?: string;
  plantingDate?: string;
  farmingMethod: string;
  irrigation: string;
  tree: TreeInfo;
  locations: GPS[];
  imageUrls: string[];
  type: number;
};
export const treeDataList = [
  {
    type: "Sầu riêng",
    variety: "Ri6",
    seed: "Hạt giống F1",
    locations: [
      [10.762622, 106.660172],
      [10.7628, 106.6603],
      [10.76295, 106.66005],
      [10.76272, 106.6599],
    ],
  },
  {
    type: "Xoài",
    variety: "Cát Chu",
    seed: "Hạt giống lai",
    locations: [
      [10.7635, 106.661],
      [10.7637, 106.6612],
      [10.7638, 106.6609],
      [10.7636, 106.6607],
    ],
  },
  {
    type: "Chôm chôm",
    variety: "Java",
    seed: "Hạt giống sạch",
    locations: [
      [10.761, 106.662],
      [10.7612, 106.6622],
      [10.7613, 106.6619],
      [10.7611, 106.6617],
    ],
  },
];

const ConfirmStep = ({
  area,
  zone,
  block,
  row,
  plantingDate,
}: ConfirmPlantingProps) => {
  return (
    <Stack gap="xl" mt={"md"}>
      <Title order={3}>Xác nhận thông tin trồng cây</Title>
      <Card withBorder radius="md" shadow="xs" p="md">
        <Group grow align="flex-start" justify="space-between">
          <Group align="flex-start" grow>
            <Stack gap="xs" flex={1}>
              <Group justify="apart">
                <Text fw={500}>Vùng trồng:</Text>
                <Badge>{area}</Badge>
              </Group>
              <Group justify="apart">
                <Text fw={500}>Khu vực:</Text>
                <Badge>{zone}</Badge>
              </Group>
              <Group justify="apart">
                <Text fw={500}>Lô:</Text>
                <Badge>{block}</Badge>
              </Group>
              {row && (
                <Group justify="apart">
                  <Text fw={500}>Hàng:</Text>
                  <Badge>{row}</Badge>
                </Group>
              )}
              {plantingDate && (
                <Group justify="apart">
                  <Text fw={500}>Ngày trồng:</Text>
                  <Text>{plantingDate}</Text>
                </Group>
              )}
            </Stack>
          </Group>
        </Group>
      </Card>
      <Divider label="Danh sách cây trồng" labelPosition="center" />

      <Group wrap="wrap" align="flex-start" gap="md" p="xs">
        {treeDataList.map((tree, index) => (
          <Card key={index} miw={400} h={400} withBorder shadow="sm" radius={4}>
            <Group gap="xs" align="flex-start">
              <Stack gap="xs" style={{ flex: 1 }}>
                <Group justify="apart">
                  <Text fw={500}>Loại cây trồng:</Text>
                  <Text>{tree.type}</Text>
                </Group>
                <Group justify="apart">
                  <Text fw={500}>Giống cây:</Text>
                  <Text>{tree.variety}</Text>
                </Group>
                <Group justify="apart">
                  <Text fw={500}>Hạt giống:</Text>
                  <Text>{tree.seed}</Text>
                </Group>
                <Group justify="apart">
                  <Text fw={500}>Số lượng cây:</Text>
                  <Text>{tree.locations.length}</Text>
                </Group>
              </Stack>
              <MapContainer
                //@ts-expect-error no check
                center={
                  tree.locations.length >= 1
                    ? tree.locations[0]
                    : [10.762622, 106.660172]
                }
                zoom={16}
                style={{ height: "230px", width: "100%", borderRadius: 8 }}
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Polygon
                  //@ts-expect-error no check
                  positions={tree?.locations || []}
                  color="green"
                />
              </MapContainer>
            </Group>
          </Card>
        ))}
      </Group>
    </Stack>
  );
};

export default ConfirmStep;
