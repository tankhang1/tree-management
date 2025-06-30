import {
  Button,
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
} from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PATH } from "../../constants/path.constants";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import { IconPlus } from "@tabler/icons-react";
import dayjs from "dayjs";
import { useDisclosure } from "@mantine/hooks";
import interactionPlugin from "@fullcalendar/interaction";
const mockJob = {
  title: "Tưới nước khu A",
  description: "Cây sầu riêng 6 tháng tuổi cần tưới nước định kỳ.",
  cropType: "Sầu riêng",
  status: "Đang diễn ra",
  timeSlot: "Sáng",
  date: new Date("2025-07-02T08:00:00"),
};
const allEvents = [
  {
    id: "1",
    title: "Tưới nước khu A",
    description: "Tưới nước cho cây sầu riêng 6 tháng tuổi",
    date: "2025-07-01T08:00:00",
    status: "done",
    sourceType: "keHoach",
  },
  {
    id: "2",
    title: "Phun thuốc sâu",
    description: "Dãy xoài phía Bắc",
    date: "2025-07-01T15:00:00",
    status: "in_progress",
    sourceType: "keHoach",
  },
  {
    id: "3",
    title: "Kiểm tra độ ẩm đất",
    description: "Block C",
    date: "2025-07-02T10:00:00",
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
    status: "in_progress",
    sourceType: "keHoach",
  },
  {
    id: "7",
    title: "Khảo sát sâu bệnh",
    description: "Gửi mẫu lên trung tâm kiểm định",
    date: "2025-07-04T13:30:00",
    status: "done",
    sourceType: "phatSinh",
  },
];
const SchedulePage = () => {
  const [visibleTypes] = useState({
    keHoach: true,
    phatSinh: true,
  });
  const [
    openedModalDetail,
    { open: openModalDetail, close: closeModalDetail },
  ] = useDisclosure(false);
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<
    [string | null, string | null]
  >([null, null]);

  const onScheduleAddPage = () => {
    navigate(PATH.SCHEDULE_ADD);
  };

  return (
    <Stack gap="lg">
      <Group justify="space-between" px={"sm"}>
        <Title flex={1} order={2}>
          Lịch trình công việc
        </Title>
      </Group>
      <Group align="flex-start">
        <Stack flex={1}>
          <Paper w="100%" shadow="md" p={"sm"} radius={4}>
            <Stack h={390} justify="center" align="center">
              <DatePicker
                type="range"
                value={selectedDate}
                onChange={setSelectedDate}
                allowSingleDateInRange
                locale="vi"
                size="lg"
              />
            </Stack>
            <Stack>
              <Button
                onClick={onScheduleAddPage}
                variant="transparent"
                radius={4}
              >
                <Group justify="space-between" p={"md"}>
                  <Text>Thêm mới công việc</Text>
                  <IconPlus />
                </Group>
              </Button>
              <Divider label="Lọc dữ liệu" />
              <Checkbox
                label="Theo kế hoạch"
                radius={4}
                checked={visibleTypes.keHoach}
              />
              <Checkbox
                label="Phát sinh"
                radius={4}
                checked={visibleTypes.phatSinh}
              />
              <Stack gap="md">
                {["keHoach", "phatSinh"].map((type) => {
                  const label =
                    type === "keHoach" ? "Theo kế hoạch" : "Phát sinh";
                  const color = type === "keHoach" ? "#228be6" : "#ae3ec9";

                  const groupEvents = allEvents.filter(
                    (e) => e.sourceType === type
                  );
                  const canceled = groupEvents.filter(
                    (e) => e.status === "canceled"
                  );
                  const inProgress = groupEvents.filter(
                    (e) => e.status === "in_progress"
                  );
                  const done = groupEvents.filter((e) => e.status === "done");

                  return (
                    <Card
                      key={type}
                      shadow="sm"
                      radius={4}
                      withBorder
                      style={{ borderLeft: `6px solid ${color}` }}
                    >
                      <Stack gap={4}>
                        <Text fw={600}>{label}</Text>
                        <Group gap="xs">
                          <Badge color="red" variant="filled">
                            {canceled.length} Hủy
                          </Badge>
                          <Badge color="yellow" variant="filled">
                            {inProgress.length} Chưa xong
                          </Badge>
                          <Badge color="green" variant="filled">
                            {done.length} Hoàn thành
                          </Badge>
                        </Group>
                      </Stack>
                    </Card>
                  );
                })}
              </Stack>
              <Button radius={4}>
                <Text>Lọc dữ liệu</Text>
              </Button>
            </Stack>
          </Paper>
        </Stack>

        <Paper flex={3} p={"sm"} shadow="md" radius={4}>
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
              openModalDetail();
            }}
            dayMaxEvents={true}
            eventClassNames={(arg) => {
              const type = arg.event.extendedProps.sourceType;
              return type === "keHoach"
                ? ["event-kehoach"]
                : ["event-phatsinh"];
            }}
            titleFormat={(date) => {
              const month = date.date.month + 1;
              const year = date.date.year;
              return `Tháng ${month} ${year}`;
            }}
            events={allEvents}
          />
        </Paper>
      </Group>
      <Modal
        opened={openedModalDetail}
        onClose={closeModalDetail}
        title="Thông tin công việc"
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
              <Badge color="teal" variant="light">
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
                color={mockJob.status === "Hoàn thành" ? "green" : "orange"}
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
