import { Button, Group, Stack, Tabs, Text } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import Detail from "./components/Detail";
import PlantingPlot from "./components/Planting-Plot";
import Crop from "./components/Crop";
import MapLocation from "./components/Map-Location";

const GardenManagementAreaDetailPage = () => {
  const navigate = useNavigate();
  return (
    <Stack>
      <Tabs defaultValue="detail">
        <Group w={"100%"} justify="space-between">
          <Tabs.List>
            <Tabs.Tab value="detail">Chi tiết</Tabs.Tab>
            <Tabs.Tab value="planting-plot">Lô trồng</Tabs.Tab>
            <Tabs.Tab value="crop">Trồng trọt</Tabs.Tab>
            <Tabs.Tab value="map-location">Vị trí bản đồ</Tabs.Tab>
          </Tabs.List>
          <Button onClick={() => navigate(-1)} radius={4}>
            <Text>Trở lại</Text>
          </Button>
        </Group>

        <Tabs.Panel value="detail" pt={"md"}>
          <Detail />
        </Tabs.Panel>

        <Tabs.Panel value="planting-plot" pt={"md"}>
          <PlantingPlot />
        </Tabs.Panel>

        <Tabs.Panel value="crop" pt={"md"}>
          <Crop />
        </Tabs.Panel>
        <Tabs.Panel value="map-location" pt={"md"}>
          <MapLocation />
        </Tabs.Panel>
      </Tabs>
    </Stack>
  );
};
export default GardenManagementAreaDetailPage;
