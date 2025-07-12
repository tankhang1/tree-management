import {
  Stack,
  Card,
  Group,
  Text,
  Title,
  Divider,
  Badge,
  Image,
} from "@mantine/core";
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
};

const ConfirmStep = ({
  area,
  zone,
  block,
  row,
  plantingDate,
  farmingMethod,
  irrigation,
  tree,
  locations,
  imageUrls,
}: ConfirmPlantingProps) => {
  return (
    <Stack gap="xl" mt={"md"}>
      <Title order={3}>Xác nhận thông tin trồng cây</Title>
      <Card withBorder radius="md" shadow="xs" p="md">
        <Group align="flex-start" justify="space-between">
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
            <Group justify="apart">
              <Text fw={500}>Phương pháp canh tác:</Text>
              <Text>{farmingMethod}</Text>
            </Group>
            <Group justify="apart">
              <Text fw={500}>Phương pháp tưới tiêu:</Text>
              <Text>{irrigation}</Text>
            </Group>
          </Stack>
          <Image
            flex={1}
            src={imageUrls[0]}
            w={300}
            h={300}
            fit="cover"
            radius="md"
          />
        </Group>
      </Card>
      <Divider label="Thông tin cây trồng" labelPosition="center" />
      <Card withBorder radius="md" shadow="xs" p="md">
        <Stack gap="xs">
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
            <Text>{locations.length}</Text>
          </Group>
        </Stack>
      </Card>
      <Divider label="Vị trí GPS từng cây" labelPosition="center" />
      {locations.length > 0 && (
        <Stack gap={"xs"}>
          <Text size="sm" c="dimmed">
            Danh sách tọa độ ({locations.length}):
          </Text>
          {locations.map((item, i) => (
            <Group key={i} gap="xs">
              <Text size="sm" w={"40%"}>
                {i + 1}. {item.lat}, {item.lng}
              </Text>
            </Group>
          ))}
        </Stack>
      )}
      Bản đồ Leaflet với polygon
      <MapContainer
        center={locations.length >= 1 ? locations[0] : [10.762622, 106.660172]}
        zoom={16}
        style={{ height: "300px", width: "100%", borderRadius: 8 }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Polygon positions={locations} color="green" />
      </MapContainer>
    </Stack>
  );
};

export default ConfirmStep;
