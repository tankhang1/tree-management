import {
  Button,
  Group,
  NumberInput,
  Select,
  Stack,
  Textarea,
  TextInput,
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { useEffect, useState } from "react";

// Mock hạt giống (có đơn vị và loại)
const seeds = [
  { id: "HG001", name: "Sầu riêng Ri6", type: "Sầu riêng", unit: "g" },
  { id: "HG002", name: "Xoài Cát Hòa Lộc", type: "Xoài", unit: "hạt" },
  { id: "HG003", name: "Chuối Nam Mỹ", type: "Chuối", unit: "kg" },
];

const staffOptions = [
  { value: "EMP001", label: "Nguyễn Văn A" },
  { value: "EMP002", label: "Lê Thị B" },
];

const typeOptions = [
  { value: "nhập", label: "Nhập" },
  { value: "xuất", label: "Xuất" },
  { value: "huỷ", label: "Huỷ" },
];

const AddSeedForm = () => {
  const [unit, setUnit] = useState("");

  const form = useForm({
    initialValues: {
      seedId: "",
      quantity: 1,
      unit: "",
      type: "",
      date: new Date(),
      staffId: "",
      note: "",
    },
    validate: {
      seedId: (v) => (!v ? "Chọn hạt giống" : null),
      quantity: (v) => (v <= 0 ? "Số lượng phải > 0" : null),
      type: (v) => (!v ? "Chọn loại phiếu" : null),
    },
  });

  // Mapping để hiển thị đơn vị tương ứng
  useEffect(() => {
    const selected = seeds.find((s) => s.id === form.values.seedId);
    setUnit(selected?.unit || "");
    form.setFieldValue("unit", selected?.unit || "");
  }, [form.values.seedId]);

  const seedOptions = seeds.map((s) => ({
    value: s.id,
    label: `${s.name} (${s.type})`,
  }));

  return (
    <form>
      <Stack gap="xs">
        <Select
          label="Hạt giống"
          data={seedOptions}
          radius={4}
          {...form.getInputProps("seedId")}
          required
        />

        <Group grow>
          <NumberInput
            label="Số lượng"
            min={1}
            radius={4}
            hideControls
            {...form.getInputProps("quantity")}
            required
          />
          <TextInput label="Đơn vị" radius={4} disabled value={unit} />
        </Group>

        <Select
          label="Loại phiếu"
          data={typeOptions}
          radius={4}
          {...form.getInputProps("type")}
          required
        />

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
          autosize
          minRows={3}
          radius={4}
          {...form.getInputProps("note")}
        />

        <Group justify="right" mt="md">
          <Button radius={4}>Lưu</Button>
        </Group>
      </Stack>
    </form>
  );
};

export default AddSeedForm;
