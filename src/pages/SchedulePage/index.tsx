import {
  Button,
  Card,
  Group,
  Select,
  Stack,
  Text,
  Title,
  Avatar,
  ScrollAreaAutosize,
  Paper,
} from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import dayjs from "dayjs";
import { useMemo, useState } from "react";
import lodash from "lodash";
import { useNavigate } from "react-router-dom";
import { PATH } from "../../constants/path.constants";
const events = [
  {
    time: new Date(),
    title: "Tưới nước khu A",
    description: "Cây sầu riêng 6 tháng tuổi",
    color: "#d0bfff",
    avatars: [
      "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-1.png",
      "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-2.png",
    ],
  },
  {
    time: new Date(),
    title: "Phun thuốc sâu",
    description: "Dãy xoài phía Bắc",
    color: "#b197fc",
    avatars: [
      "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-3.png",
      "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-4.png",
      "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-5.png",
    ],
  },
  {
    time: new Date(),
    title: "Kiểm tra độ ẩm",
    description: "Block C, cảm biến soil moisture",
    color: "#74c0fc",
    avatars: [
      "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-6.png",
    ],
  },
  {
    time: new Date(),
    title: "Thu hoạch chuối",
    description: "Lô D5",
    color: "#63e6be",
    avatars: [
      "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-7.png",
      "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-8.png",
    ],
  },
  {
    time: new Date(),
    title: "Đánh giá sâu bệnh",
    description: "Chuyên gia kiểm tra",
    color: "#ffa94d",
    avatars: [
      "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-9.png",
      "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-10.png",
      "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-11.png",
    ],
  },
  {
    time: new Date(),
    title: "Thu hoạch chuối",
    description: "Lô D5",
    color: "#63e6be",
    avatars: [
      "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-7.png",
      "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-8.png",
    ],
  },
  {
    time: new Date(),
    title: "Đánh giá sâu bệnh",
    description: "Chuyên gia kiểm tra",
    color: "#ffa94d",
    avatars: [
      "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-9.png",
      "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-10.png",
      "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-11.png",
    ],
  },
  {
    time: new Date(),
    title: "Thu hoạch chuối",
    description: "Lô D5",
    color: "#63e6be",
    avatars: [
      "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-7.png",
      "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-8.png",
    ],
  },
  {
    time: new Date(),
    title: "Đánh giá sâu bệnh",
    description: "Chuyên gia kiểm tra",
    color: "#ffa94d",
    avatars: [
      "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-9.png",
      "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-10.png",
      "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-11.png",
    ],
  },
];
const SchedulePage = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<
    [string | null, string | null]
  >([null, null]);

  const filters = (
    <Group flex={1}>
      <Select
        radius={4}
        label="Loại cây"
        data={["Sầu riêng", "Xoài", "Chuối"]}
      />
      <Select radius={4} label="Thời gian" data={["Sáng", "Chiều", "Tối"]} />
      <Select
        radius={4}
        label="Trạng thái"
        data={["Đang diễn ra", "Hoàn thành"]}
      />
    </Group>
  );

  const groupEvent = useMemo(
    () =>
      lodash.groupBy(events, (item) => dayjs(item.time).format("DD/MM/YYYY")),
    [events]
  );
  const onScheduleAddPage = () => {
    navigate(PATH.SCHEDULE_ADD);
  };
  return (
    <Stack gap="lg">
      <Group justify="space-between" px={"sm"}>
        <Title flex={1} order={2}>
          Lịch trình công việc
        </Title>
        <Group align="flex-end" justify="space-between">
          {filters}
          <Button radius={4} onClick={onScheduleAddPage}>
            Thêm mới
          </Button>
        </Group>
      </Group>
      <Group align="flex-start">
        <Stack flex={1}>
          <Paper>
            <Stack h={390} justify="center" align="center">
              <DatePicker
                type="range"
                value={selectedDate}
                onChange={setSelectedDate}
                allowSingleDateInRange
                size="lg"
              />
            </Stack>
          </Paper>
          <Paper w="100%" shadow="md" p={"sm"} radius={4}>
            <Stack>
              <Group w={"100%"}>
                <Text fw={"bold"} fz={"h4"}>
                  Lịch trình công việc sắp tới
                </Text>
              </Group>
              <ScrollAreaAutosize w="100%" mah={460}>
                <Stack>
                  {events.map((event, idx) => (
                    <Card
                      key={idx}
                      shadow="sm"
                      radius="md"
                      style={{ backgroundColor: event.color }}
                    >
                      <Group justify="space-between">
                        <Text fw={500}>
                          {dayjs(event.time).format("HH:mm")}
                        </Text>
                        <Text size="xs">{selectedDate[0]}</Text>
                      </Group>
                      <Text mt="xs" fw={700}>
                        {event.title}
                      </Text>
                      <Text size="sm" c="white">
                        {event.description}
                      </Text>
                      <Avatar.Group mt="sm">
                        {event.avatars?.map((src, i) => (
                          <Avatar key={i} src={src} size="sm" radius="xl" />
                        ))}
                      </Avatar.Group>
                    </Card>
                  ))}
                </Stack>
              </ScrollAreaAutosize>
            </Stack>
          </Paper>
        </Stack>

        <Paper flex={1} p={"sm"} shadow="md" radius={4}>
          <Stack>
            <Group
              justify="space-between"
              bg={"green"}
              p={"sm"}
              style={{ borderRadius: 4 }}
            >
              <Button radius={4} leftSection={<IconChevronLeft size={16} />}>
                Hôm qua
              </Button>
              <Text fw={"bold"} c={"white"}>
                {dayjs(new Date()).format("DD/MM/YYYY")}
              </Text>
              <Button radius={4} rightSection={<IconChevronRight size={16} />}>
                Ngày mai
              </Button>
            </Group>
            <ScrollAreaAutosize mah={835}>
              <Stack>
                {Object.keys(groupEvent).map((item) => (
                  <Group align="flex-start">
                    <Text>{item}</Text>
                    <Stack flex={1}>
                      {events.map((event, idx) => (
                        <Card
                          key={idx}
                          shadow="sm"
                          radius="md"
                          style={{ backgroundColor: event.color }}
                        >
                          <Group justify="space-between">
                            <Text fw={500}>
                              {dayjs(event.time).format("HH:mm")}
                            </Text>
                            <Text size="xs">{selectedDate[0]}</Text>
                          </Group>
                          <Text mt="xs" fw={700}>
                            {event.title}
                          </Text>
                          <Text size="sm" c="white">
                            {event.description}
                          </Text>
                          <Avatar.Group mt="sm">
                            {event.avatars?.map((src, i) => (
                              <Avatar key={i} src={src} size="sm" radius="xl" />
                            ))}
                          </Avatar.Group>
                        </Card>
                      ))}
                    </Stack>
                  </Group>
                ))}
              </Stack>
            </ScrollAreaAutosize>
          </Stack>
        </Paper>
      </Group>
    </Stack>
  );
};

export default SchedulePage;
