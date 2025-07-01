import {
  Button,
  Group,
  Stack,
  TextInput,
  Textarea,
  Select,
} from "@mantine/core";
import { DateTimePicker } from "@mantine/dates";
import { useForm } from "@mantine/form";

const AddEquipmentUsageForm = () => {
  const form = useForm({
    initialValues: {
      id: "",
      machineId: "",
      startTime: new Date(),
      endTime: new Date(),
      usedBy: "",
      purpose: "",
      location: "",
    },

    validate: {
      id: (val) => (!val ? "Vui lòng nhập mã sử dụng" : null),
      machineId: (val) => (!val ? "Chọn mã máy" : null),
      usedBy: (val) => (!val ? "Vui lòng nhập người sử dụng" : null),
      purpose: (val) => (!val ? "Vui lòng nhập mục đích" : null),
    },
  });

  const handleSubmit = (values: typeof form.values) => {
    console.log("📦 Thêm mới lịch sử sử dụng:", values);
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack gap="md">
        <TextInput
          label="Mã sử dụng"
          {...form.getInputProps("id")}
          required
          radius={4}
        />

        <Select
          label="Mã máy"
          placeholder="Chọn mã máy"
          data={["MC001", "MC002", "MC003"]}
          radius={4}
          {...form.getInputProps("machineId")}
          required
        />

        <Group grow>
          <DateTimePicker
            label="Thời gian bắt đầu"
            radius={4}
            {...form.getInputProps("startTime")}
            locale="vi"
          />
          <DateTimePicker
            label="Thời gian kết thúc"
            radius={4}
            {...form.getInputProps("endTime")}
            locale="vi"
          />
        </Group>

        <Select
          label="Người sử dụng"
          placeholder="Họ và tên"
          radius={4}
          {...form.getInputProps("usedBy")}
          required
        />

        <TextInput
          label="Vị trí sử dụng"
          placeholder="Vị trí thực tế"
          radius={4}
          {...form.getInputProps("location")}
        />

        <Textarea
          label="Mục đích sử dụng"
          autosize
          radius={4}
          minRows={3}
          {...form.getInputProps("purpose")}
          required
        />

        <Group mt="md" justify="flex-end">
          <Button type="submit" radius={4}>
            Thêm mới
          </Button>
        </Group>
      </Stack>
    </form>
  );
};

export default AddEquipmentUsageForm;
