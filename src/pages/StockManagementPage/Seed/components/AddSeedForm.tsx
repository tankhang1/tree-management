import {
  Button,
  Group,
  NumberInput,
  Select,
  Stack,
  Text,
  Textarea,
  TextInput,
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import {
  IconCancel,
  IconInputSpark,
  IconTruckDelivery,
  IconUser,
} from "@tabler/icons-react";
import { useEffect, useState } from "react";

// Mock hạt giống (có đơn vị và loại)
const seeds = [
  { id: "HG001", name: "Sầu riêng Ri6", type: "Sầu riêng", unit: "g" },
  { id: "HG002", name: "Xoài Cát Hòa Lộc", type: "Xoài", unit: "hạt" },
  { id: "HG003", name: "Chuối Nam Mỹ", type: "Chuối", unit: "kg" },
];

type TAddSeedForm = {
  onFilter: () => void;
};

const AddSeedForm = ({ onFilter }: TAddSeedForm) => {
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
          <Select
            radius={4}
            label="Quy cách đóng gói"
            data={["Hộp", "Chai", "Lọ", "Gói"]}
          />
        </Group>
        {form.getValues().type === "huỷ" && (
          <Select
            label="Kho xuất hàng"
            data={["Kho A", "Kho B"]}
            radius={4}
            {...form.getInputProps("staffId")}
          />
        )}
        {form.getValues().type === "nhập" && (
          <Select
            label="Kho nhập hàng"
            data={["Kho A", "Kho B"]}
            radius={4}
            {...form.getInputProps("staffId")}
          />
        )}
        {form.getValues().type === "xuất" && (
          <Select
            label="Kho xuất hàng"
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
        <Group>
          <Text fw={"500"} fz={15}>
            Nhân viên thực hiện
          </Text>
          <Button
            variant="light"
            radius={4}
            onClick={onFilter}
            leftSection={<IconUser size={18} />}
          >
            Chọn người thực hiện
          </Button>
        </Group>

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
