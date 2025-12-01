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
        attributionControl={false}
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
          <Select
            searchable
            clearable
            label="Vùng"
            placeholder="Vùng"
            radius={4}
            data={[
              { value: "north", label: "Miền Bắc" },
              { value: "central", label: "Miền Trung" },
              { value: "south", label: "Miền Nam" },
            ]}
          />
          <Select
            label="Khu vực"
            placeholder="Khu vực"
            radius={4}
            searchable
            clearable
            data={[
              { value: "area1", label: "Khu vực 1" },
              { value: "area2", label: "Khu vực 2" },
              { value: "area3", label: "Khu vực 3" },
            ]}
          />
          <Select
            label="Lô"
            placeholder="Lô"
            radius={4}
            searchable
            clearable
            data={[
              { value: "lot1", label: "Lô 1" },
              { value: "lot2", label: "Lô 2" },
              { value: "lot3", label: "Lô 3" },
            ]}
          />
          <Select
            label="Hàng"
            placeholder="Hàng"
            radius={4}
            searchable
            clearable
            data={[
              { value: "row1", label: "Hàng 1" },
              { value: "row2", label: "Hàng 2" },
              { value: "row3", label: "Hàng 3" },
            ]}
          />
          <Select
            label="Cây"
            placeholder="Cây"
            radius={4}
            searchable
            clearable
            data={[
              { value: "plant1", label: "Cây 1" },
              { value: "plant2", label: "Cây 2" },
              { value: "plant3", label: "Cây 3" },
            ]}
          />
          <Button radius={4} leftSection={<IconSearch size={18} />}>
            Tìm kiếm
          </Button>
        </Stack>
      </Paper>
    </Stack>
  );
};
export default AreaManagementMapPage;
