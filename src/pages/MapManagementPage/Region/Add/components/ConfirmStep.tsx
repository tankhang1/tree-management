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
import { useMemo } from "react";

// Định nghĩa kiểu dữ liệu cho tọa độ Leaflet
type LeafletLatLng = [number, number];

export function ConfirmStep({
  code,
  govCode,
  name,
  farmer,
  size,
  soilType,
  terrain,
  note,
  gps = [], // Default value để tránh lỗi undefined
  zones,
  province,
  ward,
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
  province: string;
  ward: string;
}) {
  // 1. Logic chuyển đổi dữ liệu GPS cho bản đồ
  const mapData = useMemo(() => {
    // Chuyển đổi {lat, lng} -> [lat, lng]
    const polygonPositions: LeafletLatLng[] = gps.map((p) => [p.lat, p.lng]);

    // Xác định tâm bản đồ (lấy điểm đầu tiên hoặc mặc định HCM)
    const center: LeafletLatLng =
      polygonPositions.length > 0
        ? polygonPositions[0]
        : [10.762622, 106.660172];

    return { polygonPositions, center };
  }, [gps]);

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
              <Badge color="green" size="lg">
                {name}
              </Badge>
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
              <Badge color="blue" variant="light">
                {province}
              </Badge>
            </Group>
          </Grid.Col>
          <Grid.Col span={6}>
            <Group gap="xs">
              <IconRulerMeasure size={18} />
              <Text fw={500}>Diện tích:</Text>
              <Text fw={700}>{Number(size).toLocaleString()} m²</Text>
            </Group>
          </Grid.Col>

          <Grid.Col span={6}>
            <Group gap="xs">
              <IconMapPin size={18} />
              <Text fw={500}>Phường/Xã:</Text>
              <Text>{ward}</Text>
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
              <Group gap="xs" align="flex-start">
                <Text fw={500}>Ghi chú:</Text>
                <Text c="dimmed" fs="italic">
                  {note}
                </Text>
              </Group>
            </Grid.Col>
          )}
        </Grid>
      </Card>

      <Divider label="📍 Bản đồ vùng trồng" labelPosition="center" />

      {/* Map Container */}
      <MapContainer
        center={mapData.center}
        zoom={15}
        style={{ height: "300px", width: "100%", borderRadius: 8 }}
        scrollWheelZoom={false} // Tắt zoom chuột để tránh cuộn trang bị lag
      >
        <TileLayer
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          attribution="Tiles &copy; Esri"
        />
        {/* Render Polygon nếu có tọa độ */}
        {mapData.polygonPositions.length > 0 && (
          <Polygon positions={mapData.polygonPositions} color="green" />
        )}
      </MapContainer>

      <Divider
        label={`📦 Danh sách khu vực (${zones.length})`}
        labelPosition="center"
      />

      <Group align="flex-start">
        {zones.length === 0 && (
          <Text c="dimmed" size="sm" w="100%" ta="center">
            Chưa có khu vực nào được tạo.
          </Text>
        )}
        {zones.map((z, idx) => (
          <Card key={idx} withBorder radius="md" shadow="xs" p="md" miw={250}>
            <Stack gap="xs">
              <Group justify="space-between">
                <Text fw={700} c="blue">
                  {z.name}
                </Text>
                <Badge variant="outline" color="dark">
                  {Number(z.area).toLocaleString()} m²
                </Badge>
              </Group>
              <Divider />
              <Group justify="space-between">
                <Text c="dimmed" size="xs">
                  Loại đất:
                </Text>
                <Text size="xs" fw={500}>
                  {z.soilType}
                </Text>
              </Group>
              <Group justify="space-between">
                <Text c="dimmed" size="xs">
                  Địa hình:
                </Text>
                <Text size="xs" fw={500}>
                  {z.terrain}
                </Text>
              </Group>
            </Stack>
          </Card>
        ))}
      </Group>
    </Stack>
  );
}
