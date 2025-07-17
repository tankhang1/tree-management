import {
  Button,
  Stack,
  Group,
  Select,
  TextInput,
  Textarea,
  NumberInput,
  Text,
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import {
  IconCancel,
  IconInputSpark,
  IconTruckDelivery,
  IconUser,
} from "@tabler/icons-react";
import { useEffect, useMemo, useState } from "react";

// Mock Data
const pesticideTypes = [
  { value: "TYPE01", label: "Thuốc trừ sâu" },
  { value: "TYPE02", label: "Thuốc trừ bệnh" },
];

const pesticides = [
  { id: "TH001", typeId: "TYPE01", name: "SuperKiller", unit: "ml" },
  { id: "TH002", typeId: "TYPE02", name: "BioShield", unit: "g" },
];

type TAddPesticideForm = {
  onFilter: () => void;
};
const AddPesticideForm = ({ onFilter }: TAddPesticideForm) => {
  const [unit, setUnit] = useState<string>("");

  const form = useForm({
    initialValues: {
      typeId: "",
      pesticideId: "",
      quantity: 1,
      unit: "",
      type: "",
      date: new Date(),
      staffId: "",
      note: "",
    },
    validate: {
      typeId: (v) => (!v ? "Chọn loại thuốc" : null),
      pesticideId: (v) => (!v ? "Chọn thuốc" : null),
      quantity: (v) => (v <= 0 ? "Số lượng phải > 0" : null),
      type: (v) => (!v ? "Chọn loại phiếu" : null),
    },
  });

  // Lọc thuốc theo loại
  const filteredPesticides = useMemo(() => {
    return pesticides
      .filter((p) => p.typeId === form.values.typeId)
      .map((p) => ({ value: p.id, label: p.name }));
  }, [form.values.typeId]);

  // Tự động set đơn vị thuốc
  useEffect(() => {
    const selected = pesticides.find((p) => p.id === form.values.pesticideId);
    setUnit(selected?.unit || "");
    form.setFieldValue("unit", selected?.unit || "");
  }, [form.values.pesticideId]);

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
          label="Loại thuốc"
          data={pesticideTypes}
          radius={4}
          {...form.getInputProps("typeId")}
          required
        />

        <Select
          label="Thuốc"
          data={filteredPesticides}
          radius={4}
          disabled={!form.values.typeId}
          {...form.getInputProps("pesticideId")}
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
          <TextInput label="Đơn vị tính" radius={4} disabled value={unit} />
          <Select
            radius={4}
            label="Quy cách đóng gói"
            data={["Hộp", "Chai", "Lọ", "Gói"]}
          />{" "}
        </Group>
        {form.getValues().type === "xuất" && (
          <Stack gap={"xs"}>
            <Select
              label="Kho xuất hàng"
              data={["Kho A", "Kho B"]}
              radius={4}
              {...form.getInputProps("staffId")}
            />
          </Stack>
        )}
        {form.getValues().type === "nhập" && (
          <Select
            label="Kho nhập hàng"
            data={["Kho A", "Kho B"]}
            radius={4}
            {...form.getInputProps("staffId")}
          />
        )}
        {form.getValues().type === "huỷ" && (
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
          {...form.getInputProps("date")}
          locale="vi"
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
          minRows={3}
          radius={4}
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

export default AddPesticideForm;
