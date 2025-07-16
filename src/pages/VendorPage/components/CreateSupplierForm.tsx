import {
  TextInput,
  Select,
  Textarea,
  MultiSelect,
  Button,
  Stack,
  Group,
} from "@mantine/core";
import { useForm } from "@mantine/form";

const supplyCategoryOptions = [
  "Phân bón",
  "Thuốc BVTV",
  "Vật tư nông nghiệp",
  "Máy móc",
  "Hạt giống",
  "Bao bì",
].map((label) => ({ value: label, label }));

const CreateSupplierForm = () => {
  const form = useForm({
    initialValues: {
      name: "",
      type: "doanh nghiệp",
      representative: "",
      phone: "",
      email: "",
      address: "",
      taxCode: "",
      supplyCategories: [],
      note: "",
    },

    validate: {
      name: (v) => (!v ? "Bắt buộc" : null),
      type: (v) => (!v ? "Bắt buộc" : null),
      representative: (v) => (!v ? "Bắt buộc" : null),
      phone: (v) => (!v ? "Bắt buộc" : null),
      address: (v) => (!v ? "Bắt buộc" : null),
    },
  });

  return (
    <form>
      <Stack gap="xs">
        <TextInput
          radius={4}
          label="Tên nhà cung cấp"
          required
          {...form.getInputProps("name")}
        />
        <Select
          radius={4}
          label="Loại"
          data={[
            { value: "doanh nghiệp", label: "Doanh nghiệp" },
            { value: "cá nhân", label: "Cá nhân" },
          ]}
          required
          {...form.getInputProps("type")}
        />
        <TextInput
          radius={4}
          label="Người đại diện"
          required
          {...form.getInputProps("representative")}
        />
        <TextInput
          radius={4}
          label="Số điện thoại"
          required
          {...form.getInputProps("phone")}
        />
        <TextInput radius={4} label="Email" {...form.getInputProps("email")} />
        <TextInput
          radius={4}
          label="Địa chỉ"
          required
          {...form.getInputProps("address")}
        />
        <TextInput
          radius={4}
          label="Mã số thuế"
          {...form.getInputProps("taxCode")}
        />
        <MultiSelect
          radius={4}
          label="Ngành hàng cung cấp"
          data={supplyCategoryOptions}
          placeholder="Chọn nhiều ngành hàng"
          {...form.getInputProps("supplyCategories")}
        />
        <Textarea
          radius={4}
          label="Ghi chú"
          autosize
          minRows={2}
          {...form.getInputProps("note")}
        />
        <Group justify="right" mt="md">
          <Button radius={4} type="submit">
            Tạo mới
          </Button>
        </Group>
      </Stack>
    </form>
  );
};

export default CreateSupplierForm;
