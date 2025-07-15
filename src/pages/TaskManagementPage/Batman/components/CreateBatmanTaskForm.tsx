import {
  Button,
  Group,
  Select,
  Stack,
  TextInput,
  Textarea,
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { useForm } from "@mantine/form";

const CreateBatmanTaskForm = () => {
  const form = useForm({
    initialValues: {
      employee: "",
      taskName: "",
      startDate: null,
      endDate: null,
      status: "",
      reviewer: "",
      note: "",
    },

    validate: {},
  });

  return (
    <form onSubmit={form.onSubmit((values) => console.log(values))}>
      <Stack gap="xs">
        <Select
          label="Nhân viên"
          placeholder="Chọn nhân viên"
          data={["Nguyễn Văn A", "Trần Thị B", "Nguyễn Văn C"]}
          {...form.getInputProps("employee")}
          radius={4}
        />

        <TextInput
          label="Tên công việc"
          placeholder="Phun thuốc trừ sâu đợt 1"
          {...form.getInputProps("taskName")}
          radius={4}
        />

        <Group grow>
          <DatePickerInput
            label="Ngày bắt đầu"
            placeholder="Chọn ngày"
            valueFormat="YYYY-MM-DD"
            {...form.getInputProps("startDate")}
            radius={4}
          />
          <DatePickerInput
            label="Ngày kết thúc"
            placeholder="Chọn ngày"
            valueFormat="YYYY-MM-DD"
            {...form.getInputProps("endDate")}
            radius={4}
          />
        </Group>

        <Select
          label="Trạng thái"
          placeholder="Chọn trạng thái"
          data={["Chưa bắt đầu", "Đang thực hiện", "Đã hoàn thành"]}
          {...form.getInputProps("status")}
          radius={4}
        />

        <Select
          label="Người kiểm duyệt"
          placeholder="Chọn người kiểm duyệt"
          data={["Lê Quang D", "Ngô Thanh T", "Phạm Minh H"]}
          {...form.getInputProps("reviewer")}
          radius={4}
        />

        <Textarea
          label="Ghi chú (tuỳ chọn)"
          placeholder="Nhập ghi chú nếu có"
          autosize
          minRows={2}
          {...form.getInputProps("note")}
          radius={4}
        />

        <Group justify="right" mt="md">
          <Button radius={4} variant="default">
            Hủy
          </Button>
          <Button radius={4}>Tạo mới</Button>
        </Group>
      </Stack>
    </form>
  );
};

export default CreateBatmanTaskForm;
