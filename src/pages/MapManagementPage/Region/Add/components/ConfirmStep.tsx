import {
  Badge,
  Card,
  Divider,
  Grid,
  Group,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import {
  IconMapPin,
  IconBuildingFactory,
  IconRulerMeasure,
} from "@tabler/icons-react";
import { MapContainer, Polygon, TileLayer } from "react-leaflet";

export function ConfirmStep({
  code,
  govCode,
  name,
  farmer,
  size,
  soilType,
  terrain,
  note,
  zones,
}: {
  code?: string;
  govCode?: string;
  name: string;
  farmer: string;
  size: number;
  soilType: string;
  terrain: string;
  note?: string;
  gps: { lat: number; lng: number }[];
  zones: {
    name: string;
    area: string;
    soilType: string;
    terrain: string;
  }[];
}) {
  return (
    <Stack gap="xl">
      <Title order={2} mt={"md"}>
        🔍 Xác nhận vùng trồng
      </Title>

      <Card withBorder radius="md" shadow="sm" p="md">
        <Grid>
          {code && (
            <Grid.Col span={6}>
              <Group gap="xs">
                <Text fw={500}>Mã vùng (HT):</Text>
                <Badge color="gray">{code}</Badge>
              </Group>
            </Grid.Col>
          )}
          {govCode && (
            <Grid.Col span={6}>
              <Group gap="xs">
                <Text fw={500}>Mã vùng (QG):</Text>
                <Badge color="gray">{govCode}</Badge>
              </Group>
            </Grid.Col>
          )}
          <Grid.Col span={6}>
            <Group gap="xs">
              <IconMapPin size={18} />
              <Text fw={500}>Tên vùng trồng:</Text>
              <Badge color="green">{name}</Badge>
            </Group>
          </Grid.Col>

          <Grid.Col span={6}>
            <Group gap="xs">
              <IconBuildingFactory size={18} />
              <Text fw={500}>Tổ chức / Nông hộ:</Text>
              <Text>{farmer}</Text>
            </Group>
          </Grid.Col>
          <Grid.Col span={6}>
            <Group gap="xs">
              <IconMapPin size={18} />
              <Text fw={500}>Tỉnh/Thành phố:</Text>
              <Badge color="green">Tỉnh Đắk Lắk</Badge>
            </Group>
          </Grid.Col>
          <Grid.Col span={6}>
            <Group gap="xs">
              <IconRulerMeasure size={18} />
              <Text fw={500}>Diện tích:</Text>
              <Text>{size.toLocaleString()} m²</Text>
            </Group>
          </Grid.Col>

          <Grid.Col span={6}>
            <Group gap="xs">
              <IconMapPin size={18} />
              <Text fw={500}>Phường/Xã:</Text>
              <Badge color="green">Xã Krông Pắk</Badge>
            </Group>
          </Grid.Col>
          <Grid.Col span={6}>
            <Group gap="xs">
              <Text fw={500}>Loại đất:</Text>
              <Text>{soilType}</Text>
            </Group>
          </Grid.Col>
          <Grid.Col span={6}>
            <Group gap="xs">
              <Text fw={500}>Địa hình:</Text>
              <Text>{terrain}</Text>
            </Group>
          </Grid.Col>
          {note && (
            <Grid.Col span={12}>
              <Group gap="xs">
                <Text fw={500}>Ghi chú:</Text>
                <Text>{note}</Text>
              </Group>
            </Grid.Col>
          )}
        </Grid>
      </Card>

      <Divider label="📍 Danh sách tọa độ GPS" labelPosition="center" />

      <MapContainer
        center={[10.762622, 106.660172]}
        zoom={16}
        style={{ height: "300px", width: "100%", borderRadius: 8 }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Polygon positions={[]} color="green" />
      </MapContainer>

      <Divider label="📦 Danh sách khu vực" labelPosition="center" />

      <Group align="flex-start">
        {zones.map((z, idx) => (
          <Card key={idx} withBorder radius="md" shadow="xs" p="md">
            <Stack gap="xs">
              <Group justify="apart">
                <Text fw={600}>
                  Khu vực {idx + 1}: {z.name}
                </Text>
                <Badge variant="light">{z.area} m²</Badge>
              </Group>
              <Group>
                <Text c="dimmed" size="sm">
                  Loại đất:
                </Text>
                <Text size="sm">{z.soilType}</Text>
              </Group>
              <Group>
                <Text c="dimmed" size="sm">
                  Địa hình:
                </Text>
                <Text size="sm">{z.terrain}</Text>
              </Group>
            </Stack>
          </Card>
        ))}
      </Group>
    </Stack>
  );
}
