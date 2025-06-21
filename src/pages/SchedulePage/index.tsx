import { Stack, Tabs } from "@mantine/core";
import Board from "./components/Board";

export default function SchedulePage() {
  return (
    <Stack>
      <Tabs defaultValue="board">
        <Tabs.List>
          <Tabs.Tab value="board">Bảng</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="board" pt={"md"}>
          <Board />
        </Tabs.Panel>
      </Tabs>
    </Stack>
  );
}
