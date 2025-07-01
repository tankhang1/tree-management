import {
  Button,
  Group,
  Stack,
  TextInput,
  Textarea,
  Select,
  NumberInput,
} from "@mantine/core";
import { DateTimePicker } from "@mantine/dates";
import { useForm } from "@mantine/form";

// Giả lập danh sách mã máy và nhân viên
const machineOptions = [
  { value: "MC001", label: "Xe tải Hino 5 tấn" },
  { value: "MC002", label: "Máy cày Kubota" },
];

const staffOptions = [
  { value: "EMP001", label: "Nguyễn Văn A" },
  { value: "EMP003", label: "Lê Thị B" },
];

const AddMaintenanceForm = () => {
  const form = useForm({
    initialValues: {
      id: "",
      machineId: "",
      startTime: new Date(),
      endTime: new Date(),
      staffId: "",
      reason: "",
      cost: 0,
      description: "",
    },

    validate: {
      id: (val) => (!val ? "Vui lòng nhập mã bảo trì" : null),
      machineId: (val) => (!val ? "Vui lòng chọn máy" : null),
      staffId: (val) => (!val ? "Chọn nhân viên thực hiện" : null),
      reason: (val) => (!val ? "Vui lòng nhập lý do" : null),
      cost: (val) => (val < 0 ? "Chi phí không hợp lệ" : null),
    },
  });

  const handleSubmit = (values: typeof form.values) => {
    console.log("📋 Thêm mới bảo trì:", values);
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack gap="xs">
        <TextInput
          label="Mã bảo trì"
          radius={4}
          {...form.getInputProps("id")}
          required
        />

        <Select
          label="Máy móc"
          placeholder="Chọn máy"
          data={machineOptions}
          {...form.getInputProps("machineId")}
          required
          radius={4}
        />

        <Group grow>
          <DateTimePicker
            label="Thời gian bắt đầu"
            {...form.getInputProps("startTime")}
            locale="vi"
            radius={4}
          />
          <DateTimePicker
            label="Thời gian kết thúc"
            {...form.getInputProps("endTime")}
            locale="vi"
            radius={4}
          />
        </Group>

        <Select
          label="Nhân viên thực hiện"
          placeholder="Chọn nhân viên"
          data={staffOptions}
          {...form.getInputProps("staffId")}
          required
          radius={4}
        />

        <TextInput
          label="Lý do bảo trì"
          placeholder="Ví dụ: Thay nhớt, kiểm tra động cơ"
          {...form.getInputProps("reason")}
          required
          radius={4}
        />

        <NumberInput
          label="Chi phí bảo trì (VND)"
          min={0}
          thousandSeparator
          hideControls
          {...form.getInputProps("cost")}
          radius={4}
        />

        <Textarea
          label="Nội dung bảo trì"
          autosize
          minRows={3}
          {...form.getInputProps("description")}
          radius={4}
        />

        <Group
          mt="md"
          justify="flex-end
        "
        >
          <Button type="submit" radius={4}>
            Lưu
          </Button>
        </Group>
      </Stack>
    </form>
  );
};

export default AddMaintenanceForm;
