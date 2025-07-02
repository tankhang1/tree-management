import {
  Button,
  Card,
  Group,
  Stack,
  Text,
  Title,
  Badge,
  Divider,
  Paper,
  Grid,
} from "@mantine/core";
import { MapContainer, TileLayer, Polygon } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import type { MRT_ColumnDef } from "mantine-react-table";
import Table from "../../../../components/Table";
import { IconArrowLeft } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
type TPlot = {
  code: string;
  name: string;
  area: number;
  mainCrops: string[];
  irrigation: string;
  farming: string;
  gps: string;
  numberOfRows: number;
};
const parseGps = (gpsString: string): [number, number][] => {
  return gpsString.split(" ").map((point) => {
    const [lat, lng] = point.split(",").map(Number);
    return [lat, lng];
  });
};

const lots: TPlot[] = [
  {
    code: "LO001",
    name: "Lô số 1",
    area: 2500,
    mainCrops: ["Sầu riêng Ri6"],
    irrigation: "Tưới nhỏ giọt",
    farming: "Hữu cơ",
    gps: "10.762622,106.660172 10.762700,106.660500",
    numberOfRows: 10,
  },
  {
    code: "LO002",
    name: "Lô số 2",
    area: 3200,
    mainCrops: ["Sầu riêng Monthong", "Sầu riêng Khác"],
    irrigation: "Tưới phun mưa",
    farming: "Canh tác truyền thống",
    gps: "10.762700,106.661000 10.762600,106.661300",
    numberOfRows: 8,
  },
];
const AreaManagementZoneDetailPage = () => {
  const navigate = useNavigate();
  const area = {
    code: "KV-A1",
    name: "Khu vực A1",
    regionRef: "Vùng Trồng A",
    orgUnit: "Hộ Ông Nguyễn Văn A",
    employee: "Nhân viên A",
    area: 10000,
    soilType: "Đất thịt",
    terrain: ["Cao", "Dốc"],
    mainCrop: "Sầu riêng",
    gps: "10.762622,106.660172 10.762700,106.661000 10.762300,106.661200 10.762100,106.660300",
    lots: [
      {
        code: "LO-001",
        name: "Lô 1",
        area: 2500,
        mainCrops: ["Sầu riêng Ri6"],
        gps: "10.762622,106.660172 10.762650,106.660900",
      },
      {
        code: "LO-002",
        name: "Lô 2",
        area: 3000,
        mainCrops: ["Sầu riêng Monthong"],
        gps: "10.762700,106.661000 10.762600,106.661500",
      },
      {
        code: "LO-003",
        name: "Lô 3",
        area: 4500,
        mainCrops: ["Sầu riêng Thái"],
        gps: "10.762300,106.661200 10.762100,106.660300",
      },
    ],
  };
  const gpsCoords = parseGps(area.gps);
  const lotColumns: MRT_ColumnDef<TPlot>[] = [
    { accessorKey: "code", header: "Mã lô" },
    { accessorKey: "name", header: "Tên lô" },
    {
      accessorKey: "area",
      header: "Diện tích (m²)",
      Cell: ({ cell }) => `${cell.getValue<number>().toLocaleString()} m²`,
    },
    {
      accessorKey: "mainCrops",
      header: "Cây trồng chính",
      Cell: ({ cell }) => cell.getValue<string[]>().join(", "),
    },
    { accessorKey: "irrigation", header: "Tưới tiêu" },
    { accessorKey: "farming", header: "Canh tác" },
    { accessorKey: "gps", header: "Tọa độ" },
    { accessorKey: "numberOfRows", header: "Số hàng" },
  ];
  return (
    <Card withBorder shadow="sm" radius={8} p="xl">
      <Group mb={"md"}>
        <Button
          variant="subtle"
          radius={4}
          leftSection={<IconArrowLeft size={18} />}
          onClick={() => navigate(-1)}
        >
          Quay lại
        </Button>
        <Title order={3}>📍 Chi tiết khu vực</Title>
      </Group>
      <Stack>
        <Grid gutter="lg">
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Paper radius="md" shadow="xs" p="md" withBorder>
              <Stack gap="sm">
                <Group justify="space-between">
                  <Text fw={600}>Mã khu vực:</Text>
                  <Text>{area.code}</Text>
                </Group>
                <Group justify="space-between">
                  <Text fw={600}>Tên khu vực:</Text>
                  <Text>{area.name}</Text>
                </Group>
                <Group justify="space-between">
                  <Text fw={600}>Thuộc vùng trồng:</Text>
                  <Text>{area.regionRef}</Text>
                </Group>
                <Group justify="space-between">
                  <Text fw={600}>Đơn vị quản lý:</Text>
                  <Text>{area.orgUnit}</Text>
                </Group>
                <Group justify="space-between">
                  <Text fw={600}>Nhân viên quản lý:</Text>
                  <Text>{area.employee}</Text>
                </Group>
                <Group justify="space-between">
                  <Text fw={600}>Diện tích:</Text>
                  <Text>{area.area.toLocaleString()} m²</Text>
                </Group>
                <Group justify="space-between">
                  <Text fw={600}>Loại đất:</Text>
                  <Text>{area.soilType}</Text>
                </Group>
                <Group align="flex-start" justify="space-between">
                  <Text fw={600}>Địa hình:</Text>
                  <Group>
                    {area.terrain?.map((t, i) => (
                      <Badge key={i} size="sm" color="gray" variant="light">
                        {t}
                      </Badge>
                    ))}
                  </Group>
                </Group>
                <Group justify="space-between">
                  <Text fw={600}>Cây trồng chính:</Text>
                  <Text>{area.mainCrop}</Text>
                </Group>
              </Stack>
            </Paper>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            <Paper radius="md" shadow="xs" p="md" withBorder>
              <Stack>
                <Text fw={600}>Toạ độ GPS:</Text>
                <Text size="sm" c="dimmed">
                  {area.gps}
                </Text>
                <MapContainer
                  center={gpsCoords[0] || [10.0, 106.0]}
                  zoom={16}
                  style={{ height: "300px", width: "100%", borderRadius: 8 }}
                >
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  <Polygon positions={gpsCoords} color="green" />
                </MapContainer>
              </Stack>
            </Paper>
          </Grid.Col>
        </Grid>

        <Divider my="md" />

        <Title order={4} mb="sm">
          📦 Danh sách lô
        </Title>
        <Table columns={lotColumns} data={lots} />

        <Group justify="flex-end" mt="md">
          <Button radius={4} color="green">
            Chỉnh sửa
          </Button>
        </Group>
      </Stack>
    </Card>
  );
};
export default AreaManagementZoneDetailPage;
