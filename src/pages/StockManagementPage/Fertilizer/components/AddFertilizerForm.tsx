import {
  Button,
  Group,
  Select,
  Stack,
  Textarea,
  NumberInput,
  Text,
  Card,
  Divider,
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import {
  IconCancel,
  IconInputSpark,
  IconTruckDelivery,
  IconUser,
  IconPlus,
} from "@tabler/icons-react";
import { useState } from "react";

const fertilizerOptions = [
  { value: "PB001", label: "Phân NPK 16-16-8" },
  { value: "PB002", label: "Phân Ure" },
  { value: "PB003", label: "Phân Kali" },
];

export default function AddFertilizerWithItemsForm() {
  const [items, setItems] = useState([
    { id: "1", productId: "", quantity: 0, unit: "kg", note: "" },
  ]);

  const form = useForm({
    initialValues: {
      machineId: "",
      type: "",
      quantity: 1,
      date: new Date(),
      staffId: "",
      note: "",
    },
  });

  const addItem = () => {
    setItems((prev) => [
      ...prev,
      {
        id: `${prev.length + 1}`,
        productId: "",
        quantity: 0,
        unit: "kg",
        note: "",
      },
    ]);
  };

  const updateItem = (index, key, value) => {
    const updated = [...items];
    updated[index][key] = value;
    setItems(updated);
  };

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
            radius={4}
            variant="outline"
            onClick={() => form.setFieldValue("type", "nhập")}
            leftSection={<IconInputSpark />}
          >
            Nhập
          </Button>
          <Button
            radius={4}
            color="red"
            variant="outline"
            onClick={() => form.setFieldValue("type", "huỷ")}
            leftSection={<IconCancel />}
          >
            Huỷ
          </Button>
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
          locale="vi"
          {...form.getInputProps("date")}
          required
        />

        <Group>
          <Text fw={500} fz={15}>
            Nhân viên thực hiện
          </Text>
          <Button
            variant="light"
            radius={4}
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

        <Divider label="Danh sách phân bón" labelPosition="center" my="sm" />

        {items.map((item, index) => (
          <Card key={item.id} withBorder radius={4} p="md" shadow="xs">
            <Group grow>
              <Select
                label="Phân bón"
                data={fertilizerOptions}
                radius={4}
                value={item.productId}
                onChange={(val) => updateItem(index, "productId", val)}
              />
              <NumberInput
                label="Số lượng"
                radius={4}
                value={item.quantity}
                onChange={(val) => updateItem(index, "quantity", val)}
              />
            </Group>
            <Group grow mt="sm">
              <Select
                label="Đơn vị"
                data={["kg", "bao", "lít"]}
                radius={4}
                value={item.unit}
                onChange={(val) => updateItem(index, "unit", val)}
              />
              <Select
                label="Quy cách đống gói"
                data={["Thùng", "Bao"]}
                radius={4}
                value={item.unit}
                onChange={(val) => updateItem(index, "unit", val)}
              />
            </Group>
            <Textarea
              label="Ghi chú"
              radius={4}
              autosize
              minRows={2}
              value={item.note}
              onChange={(e) => updateItem(index, "note", e.currentTarget.value)}
              mt="sm"
            />
          </Card>
        ))}

        <Button
          leftSection={<IconPlus />}
          onClick={addItem}
          radius={4}
          variant="light"
        >
          Thêm dòng phân bón
        </Button>

        <Group justify="right" mt="md">
          <Button type="submit" radius={4} color="green">
            Lưu phiếu
          </Button>
        </Group>
      </Stack>
    </form>
  );
}
