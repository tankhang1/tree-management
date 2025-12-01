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
  // --- TUẦN 1: Gieo trồng & Chăm sóc cây con (Dec 01 - Dec 07) ---
  {
    id: "c1",
    title: "Gieo hạt ngô vụ Đông Xuân",
    description: "Gieo giống LVN10, đất tơi xốp, giữ ẩm tốt",
    date: "2025-12-01T07:00:00",
    status: "done",
    sourceType: "keHoach",
  },
  {
    id: "c2",
    title: "Tưới nước lần 1 cho ngô",
    description: "Giữ ẩm giai đoạn nảy mầm, tưới nhẹ buổi sáng",
    date: "2025-12-02T07:30:00",
    status: "done",
    sourceType: "keHoach",
  },
  {
    id: "s1",
    title: "Gieo hạt đậu nành",
    description: "Gieo giống ĐT84, mật độ 40x15 cm, 2 hạt/hốc",
    date: "2025-12-03T07:00:00",
    status: "done",
    sourceType: "keHoach",
  },
  {
    id: "s2",
    title: "Tưới nước giữ ẩm đậu nành",
    description: "Tưới nhẹ mỗi sáng, tránh đọng nước",
    date: "2025-12-04T07:30:00",
    status: "done",
    sourceType: "keHoach",
  },
  {
    id: "c3",
    title: "Làm cỏ và xới đất đợt 1 (Ngô)",
    description: "Làm sạch cỏ, xới tơi đất quanh gốc",
    date: "2025-12-06T08:00:00",
    status: "confirmed",
    sourceType: "keHoach",
  },
  {
    id: "s3",
    title: "Làm cỏ và vun gốc lần 1 (Đậu)",
    description: "Làm sạch cỏ, xới nhẹ quanh gốc",
    date: "2025-12-07T08:00:00",
    status: "confirmed",
    sourceType: "keHoach",
  },

  // --- TUẦN 2: Bón thúc & Phòng trừ sâu bệnh (Dec 08 - Dec 14) ---
  {
    id: "c4",
    title: "Bón thúc lần 1 cho ngô",
    description: "Sử dụng phân NPK 16-16-8 với liều lượng 200kg/ha",
    date: "2025-12-08T09:00:00",
    status: "todo",
    sourceType: "keHoach",
  },
  {
    id: "s4",
    title: "Bón thúc lần 1 cho đậu nành",
    description: "Dùng phân NPK 12-12-17 liều 150 kg/ha",
    date: "2025-12-09T09:00:00",
    status: "todo",
    sourceType: "keHoach",
  },
  {
    id: "c5",
    title: "Phun thuốc trừ sâu đục thân",
    description: "Sử dụng thuốc sinh học gốc Emamectin, phun lúc chiều mát",
    date: "2025-12-10T15:30:00",
    status: "todo",
    sourceType: "phatSinh",
  },
  {
    id: "c6",
    title: "Kiểm tra độ ẩm đất khu A",
    description: "Đảm bảo độ ẩm 70-80% trong giai đoạn cây con",
    date: "2025-12-11T09:30:00",
    status: "todo",
    sourceType: "keHoach",
  },
  {
    id: "s5",
    title: "Kiểm tra rệp hại đậu nành",
    description: "Phun thuốc sinh học nếu mật độ >10 con/lá",
    date: "2025-12-12T15:00:00",
    status: "todo",
    sourceType: "phatSinh",
  },
  {
    id: "s6",
    title: "Tưới nước giai đoạn ra hoa",
    description: "Giữ ẩm thường xuyên, tránh khô hạn",
    date: "2025-12-13T07:00:00",
    status: "todo",
    sourceType: "keHoach",
  },
  {
    id: "c7",
    title: "Bón thúc lần 2 cho ngô",
    description: "Tăng kali để hình thành bắp",
    date: "2025-12-14T08:00:00",
    status: "todo",
    sourceType: "keHoach",
  },

  // --- TUẦN 3: Giai đoạn phát triển mạnh (Dec 15 - Dec 21) ---
  {
    id: "c8",
    title: "Tưới nước giai đoạn trổ cờ",
    description: "Cung cấp nước đều đặn, tránh ngập úng",
    date: "2025-12-15T07:00:00",
    status: "todo",
    sourceType: "keHoach",
  },
  {
    id: "c9",
    title: "Kiểm tra sâu keo mùa thu",
    description: "Quan sát mặt dưới lá, phun nếu phát hiện sâu non",
    date: "2025-12-16T08:30:00",
    status: "todo",
    sourceType: "phatSinh",
  },
  {
    id: "s7",
    title: "Bón thúc lần 2 cho đậu nành",
    description: "Bổ sung 40% N + 60% K",
    date: "2025-12-16T14:00:00",
    status: "todo",
    sourceType: "keHoach",
  },
  {
    id: "s8",
    title: "Phun thuốc phòng bệnh rỉ sắt",
    description: "Phun Mancozeb 0.2%, tránh mưa ngay sau phun",
    date: "2025-12-17T07:30:00",
    status: "todo",
    sourceType: "phatSinh",
  },
  {
    id: "c10",
    title: "Ghi nhận tình trạng sinh trưởng",
    description: "Đánh giá chiều cao, mật độ, tình hình phát triển lá",
    date: "2025-12-18T10:00:00",
    status: "confirmed",
    sourceType: "keHoach",
  },
  {
    id: "s9",
    title: "Kiểm tra sinh trưởng và nụ hoa",
    description: "Đánh giá tỷ lệ ra hoa và số nụ trung bình",
    date: "2025-12-18T14:30:00",
    status: "confirmed",
    sourceType: "keHoach",
  },
  {
    id: "c11",
    title: "Phun thuốc phòng bệnh khô vằn",
    description: "Dùng Carbendazim 0.1%, phun sáng sớm",
    date: "2025-12-19T07:30:00",
    status: "todo",
    sourceType: "phatSinh",
  },
  {
    id: "s10",
    title: "Phun thuốc trừ sâu xanh đục quả",
    description: "Dùng chế phẩm gốc Neem, phun vào buổi sáng",
    date: "2025-12-20T08:00:00",
    status: "todo",
    sourceType: "phatSinh",
  },
  {
    id: "c12",
    title: "Tưới nước giai đoạn phun râu",
    description: "Giữ ẩm giúp thụ phấn tốt và bắp phát triển đều",
    date: "2025-12-21T06:45:00",
    status: "todo",
    sourceType: "keHoach",
  },

  // --- TUẦN 4: Chuẩn bị thu hoạch & Thu hoạch (Dec 22 - Dec 31) ---
  {
    id: "s11",
    title: "Tưới nước giai đoạn đậu quả",
    description: "Giữ ẩm 70%, tránh tưới vào buổi trưa nắng gắt",
    date: "2025-12-22T07:00:00",
    status: "todo",
    sourceType: "keHoach",
  },
  {
    id: "s12",
    title: "Kiểm tra độ chín quả đậu nành",
    description: "Ghi nhận số quả chín vàng đạt ≥80%",
    date: "2025-12-24T08:30:00",
    status: "confirmed",
    sourceType: "keHoach",
  },
  {
    id: "c13",
    title: "Kiểm tra đồng ruộng trước thu hoạch",
    description: "Đánh giá độ khô lá bi và độ cứng hạt",
    date: "2025-12-25T08:00:00",
    status: "confirmed",
    sourceType: "keHoach",
  },
  {
    id: "c14",
    title: "Thu hoạch ngô",
    description: "Cắt bắp, phơi khô 3 ngày, tách hạt và bảo quản",
    date: "2025-12-26T06:30:00",
    status: "todo",
    sourceType: "keHoach",
  },
  {
    id: "s13",
    title: "Thu hoạch đậu nành",
    description: "Cắt toàn cây, phơi khô 3–4 ngày, tách hạt",
    date: "2025-12-26T07:30:00",
    status: "todo",
    sourceType: "keHoach",
  },
  {
    id: "c15",
    title: "Dọn ruộng sau thu hoạch ngô",
    description: "Thu gom rơm rạ, vệ sinh, chuẩn bị đất vụ sau",
    date: "2025-12-27T09:00:00",
    status: "todo",
    sourceType: "keHoach",
  },
  {
    id: "s14",
    title: "Phơi và sàng lọc hạt đậu nành",
    description: "Giảm ẩm độ xuống 13%, loại bỏ hạt lép",
    date: "2025-12-28T09:00:00",
    status: "todo",
    sourceType: "batman",
  },
  {
    id: "s15",
    title: "Làm đất chuẩn bị vụ mới",
    description: "Cày phơi ải 10 ngày, xử lý vôi bột 50kg/ha",
    date: "2025-12-29T08:00:00",
    status: "todo",
    sourceType: "keHoach",
  },

  // --- NGÀY CAO ĐIỂM CUỐI THÁNG (Dec 30) ---
  {
    id: "m31",
    title: "Thu hoạch ngô (Đợt cuối)",
    description: "Cắt bắp, phơi 3 ngày",
    date: "2025-12-30T06:00:00",
    status: "todo",
    sourceType: "keHoach",
  },
  {
    id: "m32",
    title: "Thu hoạch đậu nành (Khu B)",
    description: "Cắt cây, tách hạt",
    date: "2025-12-30T07:00:00",
    status: "confirmed",
    sourceType: "keHoach",
  },
  {
    id: "m33",
    title: "Gặt lúa ruộng 2",
    description: "Máy gặt dàn 2.2m",
    date: "2025-12-30T08:30:00",
    status: "todo",
    sourceType: "phatSinh",
  },
  {
    id: "m34",
    title: "Thu hoạch xoài tuyển",
    description: "Loại 1 – đóng thùng",
    date: "2025-12-30T13:30:00",
    status: "todo",
    sourceType: "batman",
  },
  {
    id: "m35",
    title: "Đóng gói chuối xuất kho",
    description: "Xốp, tem, pallet",
    date: "2025-12-30T15:00:00",
    status: "confirmed",
    sourceType: "keHoach",
  },
  {
    id: "m36",
    title: "Vệ sinh nhà kho tổng kết tháng",
    description: "Khử khuẩn, sắp xếp",
    date: "2025-12-31T16:30:00",
    status: "todo",
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
