import { Stack, Tabs } from "@mantine/core";
import Forecast from "./components/Forecast";
import Quantity from "./components/Quantity";
import Output from "./components/Output";

const FarmingManagementYieldForecastPage = () => {
  return (
    <Stack>
      <Tabs defaultValue="forecast">
        <Tabs.List>
          <Tabs.Tab value="forecast">Dự báo</Tabs.Tab>
          <Tabs.Tab value="quantity">Số lượng</Tabs.Tab>
          <Tabs.Tab value="output">Sản lượng</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="forecast" pt={"md"}>
          <Forecast />
        </Tabs.Panel>

        <Tabs.Panel value="quantity" pt={"md"}>
          <Quantity />
        </Tabs.Panel>

        <Tabs.Panel value="output" pt={"md"}>
          <Output />
        </Tabs.Panel>
      </Tabs>
    </Stack>
  );
};
export default FarmingManagementYieldForecastPage;
