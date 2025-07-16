import {
  Button,
  Group,
  Select,
  Stack,
  Textarea,
  NumberInput,
  Badge,
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import {
  IconCancel,
  IconInputSpark,
  IconTruckDelivery,
} from "@tabler/icons-react";

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
        <Group>
          <Button
            radius={4}
            variant="outline"
            onClick={() => form.setFieldValue("type", "xuất")}
            leftSection={<IconTruckDelivery />}
          >
            Xuất
          </Button>
          <Button
            onClick={() => form.setFieldValue("type", "nhập")}
            radius={4}
            variant="outline"
            leftSection={<IconInputSpark />}
          >
            Nhập
          </Button>
          <Button
            radius={4}
            onClick={() => form.setFieldValue("type", "huỷ")}
            color="red"
            variant="outline"
            leftSection={<IconCancel />}
          >
            Huỷ
          </Button>
        </Group>
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
        </Group>

        {form.getValues().type !== "xuất" && (
          <Select
            label="Kho xuất hàng"
            data={["Kho A", "Kho B"]}
            radius={4}
            {...form.getInputProps("staffId")}
          />
        )}
        {form.getValues().type !== "nhập" && (
          <Select
            label="Kho nhập hàng"
            data={["Kho A", "Kho B"]}
            radius={4}
            {...form.getInputProps("staffId")}
          />
        )}
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
