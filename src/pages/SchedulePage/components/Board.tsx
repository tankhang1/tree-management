import {
  Box,
  Button,
  Card,
  Group,
  Stack,
  Text,
  Title,
  Badge,
  ScrollArea,
  ActionIcon,
  SimpleGrid,
  useMantineTheme,
  Divider,
  Menu,
  Avatar,
  HoverCard,
  Tooltip,
  Progress,
} from "@mantine/core";
import {
  IconArrowAutofitRight,
  IconCalendarStats,
  IconClock,
  IconDatabaseExport,
  IconExchange,
  IconPencil,
  IconPlus,
  IconSquareRoundedPlus,
  IconTableImport,
  IconX,
} from "@tabler/icons-react";
import { useState } from "react";

const statusColors: Record<string, string> = {
  "Kế hoạch": "blue",
  "Phát sinh": "orange",
  BATMAN: "teal",
};
type Worker = {
  name: string;
  label: string;
};

type SubTask = {
  id: string;
  name: string;
  progress: number;
  total: number;
  note: string;
  workers: Worker[];
};

type Task = {
  id: string;
  title: string;
  type: string;
  status: string;
  date: string;
  batch: string;
  area: string;
  subTasks: SubTask[];
};

const initialTasks: Task[] = [
  {
    id: "PGV2025-001",
    title: "Tưới nước lô A01",
    type: "Kế hoạch",
    status: "Đang thực hiện",
    date: "6:00 22/03/2025",
    batch: "Đợt 1 (686)",
    area: "A01",
    subTasks: [
      {
        id: "001",
        name: "Bón phân",
        progress: 40,
        total: 100,
        note: "Dừng xử lý ở cây A1-02-04",
        workers: [
          { name: "Nguyễn Văn A", label: "A" },
          { name: "Nguyễn Văn B", label: "B" },
          { name: "Nguyễn Văn C", label: "C" },
        ],
      },
      {
        id: "002",
        name: "Phun thuốc",
        progress: 60,
        total: 100,
        note: "Đang xử lý dở lô A01",
        workers: [
          { name: "Nguyễn Văn D", label: "D" },
          { name: "Nguyễn Văn E", label: "E" },
        ],
      },
    ],
  },
  {
    id: "PGV2025-002",
    title: "Phun thuốc trừ sâu lô B01",
    type: "Phát sinh",
    status: "Hoàn thành",
    date: "6:00 15/03/2025",
    batch: "Đợt 2 (579)",
    area: "B01",
    subTasks: [
      {
        id: "001",
        name: "Phun thuốc",
        progress: 100,
        total: 100,
        note: "Đã hoàn thành đúng hạn",
        workers: [
          { name: "Nguyễn Văn H", label: "H" },
          { name: "Nguyễn Văn I", label: "I" },
        ],
      },
    ],
  },
  {
    id: "PGV2025-003",
    title: "Cắt cỏ lô C03",
    type: "BATMAN",
    status: "Chưa làm",
    date: "28/03/2025",
    batch: "Đợt 1 (802)",
    area: "C03",
    subTasks: [
      {
        id: "001",
        name: "Cắt cỏ",
        progress: 0,
        total: 100,
        note: "Chưa bắt đầu",
        workers: [],
      },
    ],
  },
];

export default function SchedulePage() {
  const [tasks] = useState(initialTasks);

  const theme = useMantineTheme();

  //   const deleteTask = (id: number) => {
  //     console.log(id);
  //   };

  const statuses = ["Chưa làm", "Đang thực hiện", "Hoàn thành"];
  const getWorkerNameSet = (tasks: SubTask[]): string[] => {
    const names = new Set<string>();

    tasks.forEach((sub) => {
      sub.workers.forEach((worker) => {
        names.add(worker.name);
      });
    });
    return [...names];
  };
  const groupByStatus = (status: string) =>
    tasks.filter((task) => task.status === status);

  return (
    <Box p="md">
      <Group mb="md" justify="space-between">
        <Title order={3}>Lịch trình</Title>
        <Group>
          <Button variant="transparent" c={"black"} bd={"none"}>
            <Group align="center" gap={4}>
              <IconTableImport size={18} />
              <Text>Nhập file</Text>
            </Group>
          </Button>
          <Divider orientation="vertical" />
          <Button variant="transparent" c={"black"} bd={"none"}>
            <Group align="center" gap={4}>
              <IconDatabaseExport size={18} />
              <Text>Xuất file</Text>
            </Group>
          </Button>
          <Divider orientation="vertical" />
          <Button variant="transparent" bd={"none"}>
            <Group align="center" gap={4}>
              <IconPlus size={18} />
              <Text>Thêm mới</Text>
            </Group>
          </Button>
        </Group>
      </Group>

      <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="md">
        {statuses.map((status) => (
          <Box
            key={status}
            bg={{
              base: theme.colors.gray[0],
              md:
                status === "Chưa làm"
                  ? theme.colors.gray[1]
                  : status === "Đang thực hiện"
                  ? theme.colors.blue[0]
                  : theme.colors.green[0],
            }}
            p="sm"
            style={{ borderRadius: 12 }}
          >
            <Group justify="space-between" mb="xs">
              <Text fw={600} size="lg">
                {status}
              </Text>
              <Badge color="gray">{groupByStatus(status).length}</Badge>
            </Group>

            <ScrollArea h={420} type="auto" scrollbarSize={6} offsetScrollbars>
              <Stack gap="sm">
                {groupByStatus(status).map((task) => (
                  <HoverCard withArrow shadow="md" position={"bottom"}>
                    <HoverCard.Target>
                      <Card
                        withBorder
                        radius="md"
                        key={task.id}
                        shadow="xs"
                        p="md"
                        style={{ background: "white" }}
                      >
                        <Stack gap={6}>
                          <Group justify="space-between" align="center">
                            <Text fw={600} size="sm">
                              {task.title}
                            </Text>
                            <Group>
                              <Badge color={statusColors[task.type]}>
                                {task.type}
                              </Badge>
                            </Group>
                          </Group>

                          <Group justify="space-between" align="flex-end">
                            <Stack>
                              <Avatar.Group>
                                {getWorkerNameSet(task.subTasks).map((name) => (
                                  <HoverCard shadow="md">
                                    <HoverCard.Target>
                                      <Avatar
                                        name={name.slice(-2)}
                                        size={"md"}
                                      />
                                    </HoverCard.Target>
                                    <HoverCard.Dropdown>
                                      <Text size="sm">{name}</Text>
                                    </HoverCard.Dropdown>
                                  </HoverCard>
                                ))}
                              </Avatar.Group>
                              <Group gap={4}>
                                <IconClock
                                  color="gray"
                                  fontSize={18}
                                  stroke={1}
                                />
                                <Text c="gray">{task.date}</Text>
                              </Group>
                            </Stack>
                          </Group>
                        </Stack>
                      </Card>
                    </HoverCard.Target>
                    <HoverCard.Dropdown>
                      <Stack w={400}>
                        <Group justify="space-between" align="flex-start">
                          <Text fw={600}>{task.title}</Text>
                          <Group gap="xs">
                            <ActionIcon variant="subtle" color="blue">
                              <IconPencil size={16} />
                            </ActionIcon>
                            <Menu position="bottom-end" shadow="md" width={160}>
                              <Menu.Target>
                                <ActionIcon variant="transparent" color="gray">
                                  <IconExchange size={16} />
                                </ActionIcon>
                              </Menu.Target>
                              <Menu.Dropdown>
                                {[
                                  "Chưa làm",
                                  "Đang thực hiện",
                                  "Hoàn thành",
                                ].map((status) => (
                                  <Menu.Item
                                    key={status}
                                    onClick={() => {}}
                                    disabled={task.status === status}
                                    leftSection={
                                      <IconArrowAutofitRight size={14} />
                                    }
                                  >
                                    {status}
                                  </Menu.Item>
                                ))}
                              </Menu.Dropdown>
                            </Menu>
                            <ActionIcon
                              variant="subtle"
                              color="red"
                              onClick={() => {}}
                            >
                              <IconX size={16} />
                            </ActionIcon>
                          </Group>
                        </Group>
                        <Divider />
                        <Group gap={6}>
                          <Badge color="blue" variant="light">
                            {task.type}
                          </Badge>
                          <Badge color="gray" variant="light">
                            {task.status}
                          </Badge>
                        </Group>

                        <Group justify="space-between">
                          <Stack gap={0}>
                            <Text size="xs" c="dimmed">
                              Mã phiếu giao việc
                            </Text>
                            <Text size="sm" fw={600}>
                              {task.id}
                            </Text>
                          </Stack>
                          <Stack gap={0}>
                            <Text size="xs" c="dimmed">
                              Ngày thực hiện
                            </Text>
                            <Text size="sm" fw={600}>
                              {task.date}
                            </Text>
                          </Stack>
                        </Group>

                        <Group justify="space-between">
                          <Stack gap={0}>
                            <Text size="xs" c="dimmed">
                              Đợt trồng
                            </Text>
                            <Text size="sm" fw={600}>
                              {task.batch}
                            </Text>
                          </Stack>
                          <Stack gap={0}>
                            <Text size="xs" c="dimmed">
                              Lô trồng
                            </Text>
                            <Text size="sm" fw={600}>
                              {task.area}
                            </Text>
                          </Stack>
                        </Group>

                        <Divider
                          labelPosition="center"
                          label={
                            <Group gap={6}>
                              <IconCalendarStats size={16} />
                              Công việc ({task.subTasks.length})
                            </Group>
                          }
                        />

                        <ScrollArea h={200}>
                          <Stack gap="xs">
                            {task.subTasks?.map(
                              (job: SubTask, index: number) => (
                                <Box
                                  key={`${job.id}-${index}`}
                                  p="sm"
                                  style={{
                                    border: "1px solid #eee",
                                    borderRadius: 8,
                                  }}
                                >
                                  <Group justify="space-between">
                                    <Text fw={500}>
                                      {job.id} - {job.name}
                                    </Text>
                                    <Avatar.Group>
                                      {job.workers.map(
                                        (w: Worker, i: number) => (
                                          <Tooltip key={i} label={w.name}>
                                            <Avatar
                                              size="sm"
                                              radius="xl"
                                              color="orange"
                                            >
                                              {w.label}
                                            </Avatar>
                                          </Tooltip>
                                        )
                                      )}
                                    </Avatar.Group>
                                  </Group>
                                  <Group
                                    justify="space-between"
                                    mt={4}
                                    align="center"
                                  >
                                    <Text size="xs" c="dimmed">
                                      Tiến độ:
                                    </Text>
                                    <Text size="xs" c="green" fw={500}>
                                      {job.progress}/{job.total} cây
                                    </Text>
                                  </Group>
                                  <Progress
                                    value={(job.progress / job.total) * 100}
                                    color="green"
                                    mt={2}
                                  />
                                  <Text size="xs" mt={4} c="dimmed">
                                    Vị trí dừng lại: {job.note}
                                  </Text>
                                </Box>
                              )
                            )}
                          </Stack>
                        </ScrollArea>

                        <Group justify="center" mt="sm">
                          <ActionIcon
                            color="green"
                            variant="light"
                            radius={100}
                            size={40}
                          >
                            <IconSquareRoundedPlus size={20} />
                          </ActionIcon>
                        </Group>
                      </Stack>
                    </HoverCard.Dropdown>
                  </HoverCard>
                ))}
              </Stack>
              <Button
                variant="light"
                fullWidth
                mt="sm"
                leftSection={<IconPlus size={14} />}
              >
                Thêm
              </Button>
            </ScrollArea>
          </Box>
        ))}
      </SimpleGrid>
    </Box>
  );
}
