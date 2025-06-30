import {
  Button,
  Card,
  Group,
  Stack,
  TextInput,
  Select,
  Textarea,
  Title,
} from "@mantine/core";
import { DateTimePicker } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { IconArrowLeft } from "@tabler/icons-react";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";

const ScheduleAddPage = () => {
  const navigate = useNavigate();
  const form = useForm({
    initialValues: {
      title: "",
      description: "",
      cropType: "",
      status: "",
      timeSlot: "",
      date: new Date(),
    },

    validate: {
      title: (value) => (value.length < 3 ? "Tiêu đề quá ngắn" : null),
      cropType: (value) => (!value ? "Chọn loại cây" : null),
      status: (value) => (!value ? "Chọn trạng thái" : null),
    },
  });

  const handleSubmit = (values: typeof form.values) => {
    console.log("Submitted:", {
      ...values,
      date: dayjs(values.date).format("YYYY-MM-DD HH:mm"),
    });

    // TODO: Call API or update app state
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="md">
          <Group>
            <Button
              variant="subtle"
              radius={4}
              leftSection={<IconArrowLeft size={18} />}
              onClick={() => navigate(-1)}
            >
              Quay lại
            </Button>
            <Title order={3}>Tạo công việc mới</Title>
          </Group>

          <DateTimePicker
            label="Ngày và giờ"
            value={form.values.date}
            required
            locale="vi"
            {...form.getInputProps("date")}
            radius={4}
          />

          <TextInput
            label="Tiêu đề công việc"
            placeholder="VD: Tưới nước khu A"
            radius={4}
            {...form.getInputProps("title")}
          />

          <Textarea
            label="Mô tả chi tiết"
            placeholder="Ví dụ: Cây sầu riêng 6 tháng tuổi"
            autosize
            radius={4}
            minRows={2}
            {...form.getInputProps("description")}
          />

          <Group grow>
            <Select
              label="Loại cây"
              data={["Sầu riêng", "Xoài", "Chuối"]}
              radius={4}
              placeholder="Chọn loại cây"
              {...form.getInputProps("cropType")}
            />

            <Select
              label="Thời gian"
              data={["Sáng", "Chiều", "Tối"]}
              radius={4}
              placeholder="Chọn thời gian"
              {...form.getInputProps("timeSlot")}
            />
          </Group>

          <Select
            label="Trạng thái"
            data={["Đang diễn ra", "Hoàn thành"]}
            radius={4}
            placeholder="Chọn trạng thái"
            {...form.getInputProps("status")}
          />

          <Button type="submit" color="green" fullWidth radius={4}>
            Tạo công việc
          </Button>
        </Stack>
      </form>
    </Card>
  );
};
export default ScheduleAddPage;
