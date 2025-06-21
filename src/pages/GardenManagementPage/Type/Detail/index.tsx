import { Button, Group, Stack, Tabs, Text } from "@mantine/core";
import Detail from "./components/Detail";
import Plant from "./components/Plant";
import Season from "./components/Season";
import { useNavigate } from "react-router-dom";

const GardenManagementTypeDetailPage = () => {
  const navigate = useNavigate();
  return (
    <Stack>
      <Tabs defaultValue="detail">
        <Group w={"100%"} justify="space-between">
          <Tabs.List>
            <Tabs.Tab value="detail">Chi tiết</Tabs.Tab>
            <Tabs.Tab value="plant">Trồng trọt</Tabs.Tab>
            <Tabs.Tab value="season">Mùa vụ</Tabs.Tab>
          </Tabs.List>
          <Button onClick={() => navigate(-1)}>
            <Text>Trở lại</Text>
          </Button>
        </Group>

        <Tabs.Panel value="detail" pt={"md"}>
          <Detail />
        </Tabs.Panel>

        <Tabs.Panel value="plant" pt={"md"}>
          <Plant />
        </Tabs.Panel>

        <Tabs.Panel value="season" pt={"md"}>
          <Season />
        </Tabs.Panel>
      </Tabs>
    </Stack>
  );
};

export default GardenManagementTypeDetailPage;
