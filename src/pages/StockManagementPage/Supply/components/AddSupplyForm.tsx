import {
  Button,
  Group,
  Select,
  Stack,
  TextInput,
  NumberInput,
  Textarea,
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { useForm } from "@mantine/form";

// Giả lập danh sách vật tư (VI.1) và nhân viên (XI)
const materialOptions = [
  { value: "VT001", label: "Phân NPK 16-16-8" },
  { value: "VT002", label: "Thuốc trừ sâu SuperKiller" },
  { value: "VT003", label: "Bạt phủ nilon" },
];

const staffOptions = [
  { value: "EMP001", label: "Nguyễn Văn A" },
  { value: "EMP002", label: "Trần Thị B" },
];

const typeOptions = [
  { value: "nhập", label: "Nhập" },
  { value: "xuất", label: "Xuất" },
  { value: "huỷ", label: "Huỷ" },
];

const AddSupplyForm = () => {
  const form = useForm({
    initialValues: {
      id: "",
      materialId: "",
      quantity: 1,
      unit: "",
      staffId: "",
      usageDate: new Date(),
      returnDate: null,
      type: "",
      note: "",
    },
    validate: {
      id: (val) => (!val ? "Vui lòng nhập mã phiếu" : null),
      materialId: (val) => (!val ? "Vui lòng chọn vật tư" : null),
      quantity: (val) => (val <= 0 ? "Số lượng phải lớn hơn 0" : null),
      unit: (val) => (!val ? "Vui lòng nhập đơn vị" : null),
      type: (val) => (!val ? "Chọn loại phiếu" : null),
    },
  });

  return (
    <form>
      <Stack gap="xs">
        <TextInput
          label="Mã phiếu"
          radius={4}
          required
          {...form.getInputProps("id")}
        />

        <Select
          label="Vật tư"
          data={materialOptions}
          radius={4}
          required
          {...form.getInputProps("materialId")}
        />

        <Group grow>
          <NumberInput
            label="Số lượng"
            min={1}
            hideControls
            radius={4}
            required
            {...form.getInputProps("quantity")}
          />
          <Select
            label="Đơn vị tính"
            radius={4}
            required
            {...form.getInputProps("unit")}
          />
        </Group>

        <Select
          label="Nhân viên thực hiện"
          data={staffOptions}
          radius={4}
          {...form.getInputProps("staffId")}
        />

        <Group grow>
          <DatePickerInput
            label="Ngày sử dụng"
            radius={4}
            required
            locale="vi"
            {...form.getInputProps("usageDate")}
          />
          <DatePickerInput
            label="Ngày trả (nếu có)"
            radius={4}
            locale="vi"
            {...form.getInputProps("returnDate")}
          />
        </Group>

        <Select
          label="Loại phiếu"
          data={typeOptions}
          radius={4}
          required
          {...form.getInputProps("type")}
        />

        <Textarea
          label="Ghi chú"
          autosize
          minRows={2}
          radius={4}
          {...form.getInputProps("note")}
        />

        <Group mt="md" justify="right">
          <Button type="submit" radius={4}>
            Tạo phiếu
          </Button>
        </Group>
      </Stack>
    </form>
  );
};

export default AddSupplyForm;
