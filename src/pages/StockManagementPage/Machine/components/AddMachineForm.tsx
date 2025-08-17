import {
  Button,
  Group,
  Select,
  Stack,
  Textarea,
  NumberInput,
  Text,
} from "@mantine/core";
import { DatePickerInput, DateTimePicker } from "@mantine/dates";
import { useForm } from "@mantine/form";
import {
  IconCalendar,
  IconCancel,
  IconInputSpark,
  IconTruckDelivery,
  IconUser,
} from "@tabler/icons-react";

// Mock danh sách máy móc và nhân viên
const machineOptions = [
  { value: "MC001", label: "Xe tải Hino 5 tấn" },
  { value: "MC002", label: "Máy cày Kubota" },
  { value: "MC003", label: "Xe múc Komatsu PC200" },
];

type TAddMachineForm = {
  onFilter: () => void;
};
const AddMachineForm = ({ onFilter }: TAddMachineForm) => {
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
          searchable
          clearable
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

        {form.getValues().type === "xuất" && (
          <Stack gap={"xs"}>
            <Select
              searchable
              clearable
              label="Kho xuất hàng"
              data={["Kho A", "Kho B"]}
              radius={4}
              {...form.getInputProps("staffId")}
            />
            <DateTimePicker
              leftSection={<IconCalendar size={18} />}
              radius={4}
              locale="vi"
              label="Thời gian dự kiến"
            />
          </Stack>
        )}
        {form.getValues().type === "nhập" && (
          <Select
            searchable
            clearable
            label="Kho nhập hàng"
            data={["Kho A", "Kho B"]}
            radius={4}
            {...form.getInputProps("staffId")}
          />
        )}
        {form.getValues().type === "huỷ" && (
          <Select
            searchable
            clearable
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
