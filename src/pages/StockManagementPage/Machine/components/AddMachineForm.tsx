import {
  Button,
  Group,
  Select,
  Stack,
  Textarea,
  NumberInput,
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { useForm } from "@mantine/form";

// Mock danh sách máy móc và nhân viên
const machineOptions = [
  { value: "MC001", label: "Xe tải Hino 5 tấn" },
  { value: "MC002", label: "Máy cày Kubota" },
  { value: "MC003", label: "Xe múc Komatsu PC200" },
];

const staffOptions = [
  { value: "EMP001", label: "Nguyễn Văn A" },
  { value: "EMP002", label: "Trần Thị B" },
];

const transactionTypes = [
  { value: "nhập", label: "Nhập" },
  { value: "xuất", label: "Xuất" },
  { value: "huỷ", label: "Huỷ" },
];
const AddMachineForm = () => {
  const form = useForm({
    initialValues: {
      machineId: "",
      type: "",
      quantity: 1,
      date: new Date(),
      staffId: "",
      note: "",
    },
    validate: {
      machineId: (v) => (!v ? "Chọn máy" : null),
      type: (v) => (!v ? "Chọn loại phiếu" : null),
      quantity: (v) => (v <= 0 ? "Số lượng phải > 0" : null),
    },
  });

  return (
    <form>
      <Stack gap="xs">
        <Select
          label="Máy móc"
          placeholder="Chọn máy"
          data={machineOptions}
          radius={4}
          {...form.getInputProps("machineId")}
          required
        />

        <Group grow>
          <NumberInput
            label="Số lượng"
            min={1}
            hideControls
            radius={4}
            {...form.getInputProps("quantity")}
            required
          />
          <Select
            label="Loại phiếu"
            data={transactionTypes}
            radius={4}
            {...form.getInputProps("type")}
            required
          />
        </Group>

        <DatePickerInput
          label="Ngày thực hiện"
          radius={4}
          locale="vi"
          {...form.getInputProps("date")}
          required
        />

        <Select
          label="Nhân viên thực hiện"
          data={staffOptions}
          radius={4}
          {...form.getInputProps("staffId")}
        />

        <Textarea
          label="Ghi chú"
          placeholder="Ghi chú thêm nếu có..."
          radius={4}
          autosize
          minRows={3}
          {...form.getInputProps("note")}
        />

        <Group justify="right" mt="md">
          <Button type="submit" radius={4}>
            Lưu
          </Button>
        </Group>
      </Stack>
    </form>
  );
};
export default AddMachineForm;
