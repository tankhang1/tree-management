import { Stack, Tabs } from "@mantine/core";
import Employees from "./components/Employees";
import Workspace from "./components/Workspace";

const QueenFarmPage = () => {
  return (
    <Stack>
      <Tabs defaultValue="workspace">
        <Tabs.List>
          <Tabs.Tab value="workspace">Tổng quan</Tabs.Tab>
          <Tabs.Tab value="employees">Nhân viên</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="workspace" pt={"md"}>
          <Workspace />
        </Tabs.Panel>
        <Tabs.Panel value="employees" pt={"md"}>
          <Employees />
        </Tabs.Panel>
      </Tabs>
    </Stack>
  );
};
export default QueenFarmPage;
