import {
  Button,
  Group,
  Select,
  Stack,
  TextInput,
  NumberInput,
  Textarea,
  Text,
  MultiSelect,
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import {
  IconCancel,
  IconInputSpark,
  IconTruckDelivery,
  IconUser,
} from "@tabler/icons-react";

// Giả lập danh sách vật tư (VI.1) và nhân viên (XI)
const materialOptions = [
  { value: "VT001", label: "Phân NPK 16-16-8" },
  { value: "VT002", label: "Thuốc trừ sâu SuperKiller" },
  { value: "VT003", label: "Bạt phủ nilon" },
];

type TAddSupplyForm = {
  onFilter: () => void;
};

const AddSupplyForm = ({ onFilter }: TAddSupplyForm) => {
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
        <TextInput
          label="Mã phiếu"
          radius={4}
          required
          {...form.getInputProps("id")}
        />

        <Select
          searchable
          clearable
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
          {/* <Select
            label="Đơn vị tính"
            radius={4}
            required
            {...form.getInputProps("unit")}
          /> */}
          <MultiSelect
            label="Quy cách"
            radius={4}
            placeholder="Quy cách"
            data={[
              {
                value: "PKG001",
                label: "Hộp giấy nhỏ (50 cái)",
              },
              {
                value: "PKG002",
                label: "Túi nilon lớn (100 cái)",
              },
              {
                value: "PKG003",
                label: "Bao tải 25kg (25 cái)",
              },
              {
                value: "PKG004",
                label: "Bịch nhựa 1kg (10 cái)",
              },
              {
                value: "PKG005",
                label: "Thùng carton lớn (20 cái)",
              },
              {
                value: "PKG006",
                label: "Hộp nhựa 500ml (30 cái)",
              },
            ]}
          />
        </Group>
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
        {form.getValues().type === "xuất" && (
          <Select
            searchable
            clearable
            label="Kho xuất hàng"
            data={["Kho A", "Kho B"]}
            radius={4}
            {...form.getInputProps("staffId")}
          />
        )}
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

        <Group grow>
          <DatePickerInput
            label="Ngày nhập kho"
            radius={4}
            required
            locale="vi"
            {...form.getInputProps("usageDate")}
          />
          <DatePickerInput
            label="Ngày xuất kho"
            required
            radius={4}
            locale="vi"
            {...form.getInputProps("returnDate")}
          />
        </Group>

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
