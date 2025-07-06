import {
  Card,
  Group,
  Stack,
  Text,
  Title,
  Box,
  Divider,
  Button,
} from "@mantine/core";
import { IconArrowLeft } from "@tabler/icons-react";
import { MapContainer, Polygon, TileLayer } from "react-leaflet";
import { useNavigate } from "react-router-dom";

const AreaManagementBlockDetailPage = () => {
  const navigate = useNavigate();

  // 🔁 Dữ liệu mô phỏng
  const block = {
    region: "RG001 - Vùng A",
    area: "KV001 - Khu vực A1",
    code: "P001",
    name: "Lô A1",
    areaSize: 1200,
    mainCrops: ["Sầu riêng", "Mãng cầu"],
    irrigation: "Tưới nhỏ giọt",
    farming: "Hữu cơ",
    contour: "Cao độ từ 50m đến 65m",
    gps: "10.7761,106.6958 10.7762,106.6959",
    rows: [
      {
        name: "Hàng 1",
        code: "H001",
        crop: "Sầu riêng",
        treeCount: 25,
        gps: "10.7760,106.6957 10.7761,106.6958",
      },
      {
        name: "Hàng 2",
        code: "H002",
        crop: "Mãng cầu",
        treeCount: 20,
        gps: "10.7761,106.6959 10.7762,106.6960",
      },
    ],
  };

  return (
    <Card withBorder shadow="md" radius={12} p="xl">
      <Group mb="md">
        <Button
          variant="subtle"
          radius={4}
          leftSection={<IconArrowLeft size={18} />}
          onClick={() => navigate(-1)}
        >
          Quay lại
        </Button>
        <Title order={3}>📄 Chi tiết Lô trồng</Title>
      </Group>

      <Stack gap="xs">
        <Text>
          <strong>Vùng trồng:</strong> {block.region}
        </Text>
        <Text>
          <strong>Khu vực:</strong> {block.area}
        </Text>
        <Text>
          <strong>Mã lô:</strong> {block.code}
        </Text>
        <Text>
          <strong>Tên lô:</strong> {block.name}
        </Text>
        <Text>
          <strong>Diện tích:</strong> {block.areaSize} m²
        </Text>
        <Text>
          <strong>Cây trồng chính:</strong> {block.mainCrops.join(", ")}
        </Text>
        <Text>
          <strong>Phương pháp tưới tiêu:</strong> {block.irrigation}
        </Text>
        <Text>
          <strong>Phương pháp canh tác:</strong> {block.farming}
        </Text>
        <Text>
          <strong>Đường bình độ:</strong> {block.contour}
        </Text>
        <Text>
          <strong>Cao độ:</strong> 60 (m)
        </Text>
        Bản đồ Leaflet với polygon
        <MapContainer
          zoom={16}
          center={[10.762622, 106.660172]}
          style={{ height: "300px", width: "100%", borderRadius: 8 }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <Polygon positions={[]} color="green" />
        </MapContainer>
      </Stack>

      <Divider my="lg" label="Danh sách hàng" labelPosition="center" />

      <Stack gap="md">
        {block.rows.map((row, index) => (
          <Box
            key={index}
            p="md"
            style={{ border: "1px solid #ccc", borderRadius: 6 }}
          >
            <Text>
              <strong>Tên hàng:</strong> {row.name}
            </Text>
            <Text>
              <strong>Mã hàng:</strong> {row.code}
            </Text>
            <Text>
              <strong>Cây trồng:</strong> {row.crop}
            </Text>
            <Text>
              <strong>Giống cây:</strong> Giống A
            </Text>
            <Text>
              <strong>Hạt giống cây:</strong> Hạt giống B
            </Text>
            <Text>
              <strong>Số cây:</strong> {row.treeCount}
            </Text>
          </Box>
        ))}
      </Stack>
    </Card>
  );
};

export default AreaManagementBlockDetailPage;
