import {
  // Button,
  Group,
  Stack,
  Text,
  Title,
  Paper,
  Divider,
  Modal,
  Badge,
  Checkbox,
  Card,
  Tooltip,
  Button,
} from "@mantine/core";
import { DatePicker } from "@mantine/dates";
// import { useNavigate } from "react-router-dom";
// import { PATH } from "../../constants/path.constants";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
// import { IconPlus } from "@tabler/icons-react";
import dayjs from "dayjs";
import { useDisclosure } from "@mantine/hooks";
import interactionPlugin from "@fullcalendar/interaction";
import lodash from "lodash";
import { useState } from "react";
const mockJob = {
  title: "Tưới nước khu A",
  description: "Cây sầu riêng 6 tháng tuổi cần tưới nước định kỳ.",
  cropType: "Sầu riêng",
  status: "Đang diễn ra",
  timeSlot: "Sáng",
  date: new Date("2025-07-02T08:00:00"),
};
type JobEvent = {
  id: string;
  title: string;
  description: string;
  date: string;
  status: "done" | "todo" | "canceled" | "confirmed";
  sourceType: "keHoach" | "phatSinh" | "batman";
};
const allEvents: JobEvent[] = [
  {
    id: "1",
    title: "Tưới nước khu A",
    description: "Tưới nước cho cây sầu riêng 6 tháng tuổi",
    date: "2025-08-01T08:00:00",
    status: "done",
    sourceType: "keHoach",
  },
  {
    id: "2",
    title: "Phun thuốc sâu",
    description: "Dãy xoài phía Bắc",
    date: "2025-08-01T15:00:00",
    status: "todo",
    sourceType: "batman",
  },
  {
    id: "3",
    title: "Kiểm tra độ ẩm đất",
    description: "Block C",
    date: "2025-08-01T10:00:00",
    status: "done",
    sourceType: "phatSinh",
  },
  {
    id: "4",
    title: "Thu hoạch chuối lô D5",
    description: "Cây đã chín",
    date: "2025-07-02T14:30:00",
    status: "done",
    sourceType: "keHoach",
  },
  {
    id: "5",
    title: "Vệ sinh ống tưới",
    description: "Theo lịch hàng tuần",
    date: "2025-07-03T16:00:00",
    status: "canceled",
    sourceType: "keHoach",
  },
  {
    id: "6",
    title: "Bón phân định kỳ",
    description: "Sử dụng phân vi sinh",
    date: "2025-07-04T08:30:00",
    status: "confirmed",
    sourceType: "keHoach",
  },
  {
    id: "7",
    title: "Khảo sát sâu bệnh",
    description: "Gửi mẫu lên trung tâm kiểm định",
    date: "2025-07-04T13:30:00",
    status: "confirmed",
    sourceType: "batman",
  },
  {
    id: "8",
    title: "Tưới nước khu B",
    description: "Tưới nước cho cây xoài 3 tháng tuổi",
    date: "2025-08-05T08:00:00",
    status: "todo",
    sourceType: "keHoach",
  },
  {
    id: "9",
    title: "Phun thuốc trừ sâu",
    description: "Dãy chuối phía Nam",
    date: "2025-08-10T14:00:00",
    status: "confirmed",
    sourceType: "phatSinh",
  },
  {
    id: "10",
    title: "Kiểm tra hệ thống tưới",
    description: "Kiểm tra và bảo trì hệ thống tưới tự động",
    date: "2025-08-15T09:00:00",
    status: "done",
    sourceType: "keHoach",
  },
  {
    id: "11",
    title: "Thu hoạch lúa",
    description: "Lúa đã chín, cần thu hoạch ngay",
    date: "2025-08-20T06:30:00",
    status: "todo",
    sourceType: "keHoach",
  },
  {
    id: "12",
    title: "Bón phân cho cây cà phê",
    description: "Sử dụng phân hữu cơ",
    date: "2025-08-25T07:00:00",
    status: "canceled",
    sourceType: "phatSinh",
  },
  {
    id: "13",
    title: "Kiểm tra chất lượng đất",
    description: "Lấy mẫu đất để kiểm tra độ pH",
    date: "2025-09-01T09:00:00",
    status: "todo",
    sourceType: "keHoach",
  },
  {
    id: "14",
    title: "Phun thuốc diệt cỏ",
    description: "Khu vực phía Tây",
    date: "2025-09-05T15:00:00",
    status: "confirmed",
    sourceType: "phatSinh",
  },
  {
    id: "15",
    title: "Thu hoạch bưởi",
    description: "Lô B3",
    date: "2025-09-10T07:00:00",
    status: "done",
    sourceType: "keHoach",
  },
  {
    id: "16",
    title: "Vệ sinh nhà kính",
    description: "Làm sạch nhà kính để chuẩn bị trồng vụ mới",
    date: "2025-09-15T10:00:00",
    status: "canceled",
    sourceType: "keHoach",
  },
  {
    id: "17",
    title: "Tưới nước khu C",
    description: "Tưới nước cho cây ổi",
    date: "2025-09-20T08:00:00",
    status: "todo",
    sourceType: "keHoach",
  },
  {
    id: "18",
    title: "Phun thuốc bảo vệ thực vật",
    description: "Khu vực phía Nam",
    date: "2025-09-25T14:00:00",
    status: "confirmed",
    sourceType: "phatSinh",
  },
  {
    id: "19",
    title: "Kiểm tra hệ thống thoát nước",
    description: "Đảm bảo hệ thống thoát nước hoạt động tốt",
    date: "2025-09-26T09:00:00",
    status: "todo",
    sourceType: "keHoach",
  },
  {
    id: "20",
    title: "Phun thuốc trừ cỏ",
    description: "Khu vực phía Đông",
    date: "2025-09-27T14:00:00",
    status: "todo",
    sourceType: "phatSinh",
  },
  {
    id: "21",
    title: "Thu hoạch cam",
    description: "Lô C2",
    date: "2025-09-28T07:30:00",
    status: "todo",
    sourceType: "keHoach",
  },
  {
    id: "22",
    title: "Vệ sinh nhà kho",
    description: "Dọn dẹp và kiểm tra nhà kho",
    date: "2025-09-29T10:00:00",
    status: "canceled",
    sourceType: "keHoach",
  },
  {
    id: "23",
    title: "Bón phân cho cây mít",
    description: "Sử dụng phân hữu cơ",
    date: "2025-09-30T08:00:00",
    status: "canceled",
    sourceType: "phatSinh",
  },
  {
    id: "24",
    title: "Kiểm tra chất lượng nước tưới",
    description: "Lấy mẫu nước để kiểm tra",
    date: "2025-10-01T09:00:00",
    status: "todo",
    sourceType: "keHoach",
  },
  {
    id: "25",
    title: "Phun thuốc bảo vệ thực vật",
    description: "Khu vực phía Tây",
    date: "2025-10-02T15:00:00",
    status: "canceled",
    sourceType: "phatSinh",
  },
];
const sourceTypeLabels: Record<string, string> = {
  keHoach: "Kế hoạch",
  phatSinh: "Phát sinh",
  batman: "Batman", // Bạn có thể sửa lại nếu muốn dịch khác
};
// Format date to string (e.g., '2025-07-05') to group reliably
const formatDate = (date: Date | string) =>
  new Date(date).toISOString().split("T")[0];

// Step 1: Group by formatted date first
const groupedByDate = lodash.groupBy(allEvents, (event) =>
  formatDate(event.date)
);

type TStatus = "done" | "todo" | "canceled" | "confirmed";
type TSource = "keHoach" | "phatSinh" | "batman";
// Step 2: For each date group, further group by sourceType
const result = Object.entries(groupedByDate).flatMap(([date, eventsByDate]) => {
  const groupedByType = lodash.groupBy(eventsByDate, "sourceType");

  return Object.entries(groupedByType).map(([type, events]) => ({
    date, // formatted date
    sourceType: type,
    title: `${sourceTypeLabels[type] || type} (${events.length})`,
    value: events.length,
  }));
});
const SchedulePage = () => {
  const [type, setType] = useState<TStatus>("done");
  const [option, setOption] = useState<TSource>("batman");
  const [
    openedModalDetail,
    { open: openModalDetail, close: closeModalDetail },
  ] = useDisclosure(false);
  const [openedModalList, { open: openModalList, close: closeModalList }] =
    useDisclosure(false);
  // const navigate = useNavigate();

  // const onScheduleAddPage = () => {
  //   navigate(PATH.SCHEDULE_ADD);
  // };

  return (
    <Stack gap="lg">
      <Group justify="space-between" px={"sm"}>
        <Title flex={1} order={2}>
          Lịch biểu công việc
        </Title>
      </Group>
      <Group align="flex-start" gap="lg">
        <Stack flex={1}>
          <Paper w="100%" shadow="md" p={"sm"} radius={4}>
            <Stack h={390} justify="center" align="center">
              <DatePicker
                type="default"
                value={new Date()}
                locale="vi"
                size="lg"
              />
            </Stack>
            <Stack>
              {/* <Button
                onClick={onScheduleAddPage}
                variant="transparent"
                radius={4}
              >
                <Group justify="space-between" p={"md"}>
                  <Text>Thêm mới công việc</Text>
                  <IconPlus />
                </Group>
              </Button> */}
              <Divider label="Công việc trong tháng" />

              <Stack gap="md">
                {["keHoach", "phatSinh", "batman"].map((type) => {
                  const label =
                    type === "keHoach"
                      ? "Kế hoạch"
                      : type === "phatSinh"
                      ? "Phát sinh"
                      : "BATMAN";
                  const color =
                    type === "keHoach"
                      ? "#228be6"
                      : type === "phatSinh"
                      ? "#ae3ec9"
                      : "#544332";

                  const groupEvents = allEvents.filter(
                    (e) => e.sourceType === type
                  );
                  const canceled = groupEvents.filter(
                    (e) => e.status === "canceled"
                  );

                  const todo = groupEvents.filter((e) => e.status === "todo");
                  const confirmed = groupEvents.filter(
                    (e) => e.status === "confirmed"
                  );
                  const done = groupEvents.filter((e) => e.status === "done");

                  return (
                    <Card
                      key={type}
                      shadow="sm"
                      radius={4}
                      withBorder
                      onClick={openModalList}
                      style={{ borderLeft: `6px solid ${color}` }}
                    >
                      <Group align="center">
                        <Stack gap={4} flex={1}>
                          {/**Nếu không có thì không hiển thị */}
                          <Text fw={600}>{label}</Text>
                          <Group gap="xs">
                            <Badge color="green" variant="filled">
                              {confirmed.length} Đã xác thực
                            </Badge>
                            <Badge color="yellow" variant="filled">
                              {done.length} Hoàn thành
                            </Badge>
                            <Badge color="gray" variant="filled">
                              {todo.length} Chờ thực thi
                            </Badge>

                            <Badge color="red" variant="filled">
                              {canceled.length} Hủy
                            </Badge>
                          </Group>
                        </Stack>
                        <Tooltip label="Hiển thị lịch">
                          <Checkbox
                          onChange={() => {}}
                            onClick={(e) => {
                              e.stopPropagation();
                            }}
                          />
                        </Tooltip>
                      </Group>
                    </Card>
                  );
                })}
              </Stack>
            </Stack>
          </Paper>
        </Stack>

        <Paper flex={4} p={"sm"} shadow="md" radius={4}>
          <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            locale={"vi"}
            selectable={true}
            editable={true}
            buttonText={{
              today: "Hôm nay",
              month: "Tháng",
              week: "Tuần",
              day: "Ngày",
              list: "Danh sách",
            }}
            moreLinkText={(n) => `+${n} xem thêm`}
            eventClick={() => {
              openModalList();
            }}
            dayMaxEvents={true}
            eventClassNames={(arg) => {
              const type = arg.event.extendedProps.sourceType;
              return type === "keHoach"
                ? ["event-kehoach"]
                : type === "phatSinh"
                ? ["event-phatsinh"]
                : ["event-batman"];
            }}
            titleFormat={(date) => {
              const month = date.date.month + 1;
              const year = date.date.year;
              return `Tháng ${month} ${year}`;
            }}
            displayEventTime={false}
            events={result}
            eventContent={(arg) => {
              const { event } = arg;
              const sourceType = event.extendedProps.sourceType;
              const color =
                sourceType === "keHoach"
                  ? "#228be6"
                  : sourceType === "phatSinh"
                  ? "#ae3ec9"
                  : "#544332";
              const label =
                sourceType === "keHoach"
                  ? "Kế hoạch"
                  : sourceType === "phatSinh"
                  ? "Phát sinh"
                  : "BATMAN";

              return (
                <Card
                  w={"100%"}
                  radius={4}
                  py={"xs"}
                  onClick={() => {
                    setOption(sourceType);
                    openModalList();
                  }}
                  style={{ borderLeft: `6px solid ${color}` }}
                >
                  <Group align="center" gap={4}>
                    {/**Nếu không có thì không hiển thị */}
                    <Text fw={600} fz={"xs"}>
                      {label}
                    </Text>
                    <Group gap={1}>
                      <Badge
                        color="green"
                        radius={100}
                        size="xs"
                        variant="filled"
                      >
                        1
                      </Badge>
                      <Badge
                        color="yellow"
                        radius={100}
                        size="xs"
                        variant="filled"
                      >
                        2
                      </Badge>
                      <Badge
                        color="red"
                        radius={100}
                        size="xs"
                        variant="filled"
                      >
                        2
                      </Badge>
                    </Group>
                  </Group>
                </Card>
              );
            }}
          />
        </Paper>
      </Group>

      <Modal
        opened={openedModalList}
        onClose={closeModalList}
        title={<Text fw={"bold"}>Danh sách công việc</Text>}
      >
        <Stack>
          <Group gap={4}>
            {["confirmed", "done", "todo", "canceled"].map((item, index) => (
              <Button
                onClick={() => setType(item as TStatus)}
                key={index}
                variant={type === item ? "filled" : "outline"}
                color={
                  item === "confirmed"
                    ? "green"
                    : item === "done"
                    ? "yellow"
                    : item === "todo"
                    ? "gray"
                    : "red"
                }
                size="xs"
                radius={100}
              >
                {item === "confirmed"
                  ? "Đã xác thực"
                  : item === "done"
                  ? "Hoàn thành"
                  : item === "todo"
                  ? "Chờ thực thi"
                  : "Huỷ"}
              </Button>
            ))}
          </Group>
          {allEvents
            .filter((event) => event.sourceType === option)
            .filter((event) => event.status === type)
            .map((job) => (
              <Card
                key={job.id}
                shadow="sm"
                radius="md"
                withBorder
                onClick={openModalDetail}
              >
                <Stack gap={4}>
                  <Group justify="space-between">
                    <Text fw={600}>{job.title}</Text>
                    <Badge
                      color={
                        job.status === "confirmed"
                          ? "green"
                          : job.status === "done"
                          ? "yellow"
                          : job.status === "todo"
                          ? "gray"
                          : "red"
                      }
                    >
                      {job.status === "done"
                        ? "Hoàn thành"
                        : job.status === "canceled"
                        ? "Hủy"
                        : "Chưa xong"}
                    </Badge>
                  </Group>
                  <Text size="sm" c="dimmed">
                    {job.description}
                  </Text>
                  <Text size="sm">
                    Thời gian: {dayjs(job.date).format("HH:mm")}
                  </Text>
                  <Badge
                    color={job.sourceType === "keHoach" ? "blue" : "violet"}
                    variant="light"
                  >
                    {job.sourceType === "keHoach" ? "Kế hoạch" : "Phát sinh"}
                  </Badge>
                </Stack>
              </Card>
            ))}
        </Stack>
      </Modal>
      <Modal
        opened={openedModalDetail}
        onClose={closeModalDetail}
        title={<Text fw={"bold"}>Thông tin công việc</Text>}
      >
        <Stack>
          <Text size="sm" c="dimmed">
            Tiêu đề
          </Text>
          <Text fw={600} fz="lg">
            {mockJob.title}
          </Text>

          <Text size="sm" c="dimmed">
            Ngày và giờ
          </Text>
          <Text>{dayjs(mockJob.date).format("DD/MM/YYYY HH:mm")}</Text>

          <Text size="sm" c="dimmed">
            Mô tả
          </Text>
          <Text>{mockJob.description}</Text>

          <Group grow mt="sm">
            <Stack gap={4}>
              <Text size="sm" c="dimmed">
                Loại cây
              </Text>
              <Badge color="green" variant="light">
                {mockJob.cropType}
              </Badge>
            </Stack>

            <Stack gap={4}>
              <Text size="sm" c="dimmed">
                Thời gian
              </Text>
              <Badge color="cyan" variant="light">
                {mockJob.timeSlot}
              </Badge>
            </Stack>

            <Stack gap={4}>
              <Text size="sm" c="dimmed">
                Trạng thái
              </Text>
              <Badge
                color={
                  mockJob.status === "Đã xác thực"
                    ? "green"
                    : mockJob.status === "Hoàn thành"
                    ? "yellow"
                    : mockJob.status === "Chờ thực thi"
                    ? "gray"
                    : "red"
                }
                variant="light"
              >
                {mockJob.status}
              </Badge>
            </Stack>
          </Group>
        </Stack>
      </Modal>
    </Stack>
  );
};

export default SchedulePage;
