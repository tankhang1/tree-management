import {
  Box,
  Button,
  Group,
  Paper,
  Select,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import { MapContainer, TileLayer } from "react-leaflet";

const AreaManagementMapPage = () => {
  return (
    <Stack pos={"relative"}>
      <MapContainer
        preferCanvas
        center={[11.553203605968022, 107.12999664743181]}
        maxZoom={20}
        zoom={18}
        zoomSnap={1}
        minZoom={17}
        style={{ height: "90dvh", width: "83dvw", borderRadius: 4 }}
      >
        <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" />
      </MapContainer>
      <Group pos={"absolute"} bottom={10} style={{ zIndex: 9999 }} pl={"lg"}>
        <Group gap={4}>
          <Box w={10} h={10} style={{ borderRadius: 100 }} bg="red" />
          <Text c={"white"}>Musang King Durian</Text>
        </Group>
        <Group gap={4}>
          <Box w={10} h={10} style={{ borderRadius: 100 }} bg="blue" />
          <Text c={"white"}>Monthong Durian (Dona)</Text>
        </Group>
      </Group>
      <Paper
        radius={4}
        pos={"absolute"}
        top={10}
        right={10}
        style={{ zIndex: 9999 }}
        p={"sm"}
      >
        <Stack w={300}>
          <Title order={4}>Tìm kiếm cây trồng</Title>
          <Select label="Vùng" placeholder="Vùng" radius={4} clearable />
          <Select label="Khu vực" placeholder="Khu vực" radius={4} clearable />
          <Select label="Lô" placeholder="Lô" radius={4} clearable />
          <Select label="Hàng" placeholder="Hàng" radius={4} clearable />
          <Select label="Cây" placeholder="Cây" radius={4} clearable />
          <Button radius={4} leftSection={<IconSearch size={18} />}>
            Tìm kiếm
          </Button>
        </Stack>
      </Paper>
    </Stack>
  );
};
export default AreaManagementMapPage;
