import {
  Badge,
  Box,
  Button,
  Card,
  Divider,
  Group,
  Modal,
  Paper,
  ScrollAreaAutosize,
  Select,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconSearch } from "@tabler/icons-react";
import dayjs from "dayjs";
import { groupBy, sumBy } from "lodash";
import { useMemo } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import { useNavigate } from "react-router-dom";
import { PATH } from "../../../constants/path.constants";
const COLOR_MAP: Record<string, string> = {
  "Sầu riêng": "#4dabf7",
  Xoài: "#82ca9d",
  Chuối: "#f59f00",
};
const harvestData = Array.from({ length: 30 }).map((_, i) => {
  const trees = ["Sầu riêng", "Xoài", "Chuối"];
  const regions = ["Vùng A", "Vùng B", "Vùng C"];
  const areas = ["Khu A1", "Khu B1", "Khu C1"];
  const plots = ["Lô 1", "Lô 2", "Lô 3", "Lô 4"];
  const rows = ["Hàng 1", "Hàng 2", "Hàng 3"];
  const units = ["Kg", "Thùng"];
  return {
    tree: trees[i % 3],
    quantityPerDay: Math.floor(Math.random() * 300 + 50),
    quantityRemaining: Math.floor(Math.random() * 100),
    unit: units[i % 2],
    region: regions[i % 3],
    area: areas[i % 3],
    plot: plots[i % 4],
    row: rows[i % 3],
    date: dayjs()
      .subtract(i % 7, "day")
      .format("YYYY-MM-DD"),
  };
});
const HarvestManagementQueryMapPage = () => {
  const navigate = useNavigate();
  const [
    openedSearchReport,
    { open: openSearchReport, close: closeSearchReport },
  ] = useDisclosure(false);
  const overviewByTree = useMemo(() => {
    return Object.entries(groupBy(harvestData, "tree")).map(
      ([tree, items]) => ({
        tree,
        totalHarvested: sumBy(items, "quantityPerDay"),
        totalRemaining: sumBy(items, "quantityRemaining"),
        unit: items[0].unit,
      })
    );
  }, []);
  const onReport = () => {
    closeSearchReport();
    navigate(PATH.HARVEST_REPORT);
  };
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
          <Title order={4}>Truy vấn báo cáo thu hoạch</Title>
          <Select
            label="Chọn vùng"
            placeholder="Chọn vùng"
            radius={4}
            clearable
          />
          <Select
            label="Chọn khu vực"
            placeholder="Chọn khu vực"
            radius={4}
            clearable
          />
          <Select label="Chọn lô" placeholder="Chọn lô" radius={4} clearable />
          <Select
            label="Chọn hàng"
            placeholder="Chọn hàng"
            radius={4}
            clearable
          />

          <Button
            radius={4}
            leftSection={<IconSearch size={18} />}
            onClick={openSearchReport}
          >
            Tìm kiếm
          </Button>
        </Stack>
        <Modal
          opened={openedSearchReport}
          onClose={closeSearchReport}
          styles={{
            overlay: { zIndex: 99999 },
            inner: { zIndex: 99999 },
          }}
          title={<Text fw={"bold"}>Báo cáo tổng quan</Text>}
        >
          <Stack>
            <ScrollAreaAutosize mah={400}>
              <Stack gap={"xs"}>
                {overviewByTree.map((item, idx) => (
                  <Stack key={idx}>
                    <Card withBorder shadow="sm" radius={8} p="md">
                      <Group justify="space-between" mb="xs">
                        <Text fw={600}>{item.tree}</Text>
                        <Badge color={COLOR_MAP[item.tree]} variant="light">
                          {item.unit}
                        </Badge>
                      </Group>
                      <Divider />
                      <Stack gap={4} mt="xs">
                        <Text size="sm" c="dimmed">
                          Tổng thu hoạch
                        </Text>
                        <Text fw={700} size="lg" c="blue">
                          {item.totalHarvested.toLocaleString()}
                        </Text>
                        <Text size="sm" c="dimmed">
                          Còn lại
                        </Text>
                        <Text fw={700} size="lg" c="orange">
                          {item.totalRemaining.toLocaleString()}
                        </Text>
                      </Stack>
                    </Card>
                  </Stack>
                ))}
              </Stack>
            </ScrollAreaAutosize>
            <Button radius={4} w={"100%"} onClick={onReport}>
              Báo cáo chi tiết
            </Button>
          </Stack>
        </Modal>
      </Paper>
    </Stack>
  );
};

export default HarvestManagementQueryMapPage;
