import { Button, Group, Select, Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";

const AddVarietyForm = () => {
  const form = useForm({
    initialValues: {
      id: "",
      name: "",
      categoryId: "",
    },
    validate: {
      id: (val) => (!val ? "Vui lòng nhập mã giống cây" : null),
      name: (val) => (!val ? "Vui lòng nhập tên giống cây" : null),
      categoryId: (val) => (!val ? "Vui lòng chọn danh mục cây trồng" : null),
    },
  });
  return (
    <form>
      <Stack gap={"xs"}>
        <TextInput
          label="Mã giống cây (hệ thống)"
          placeholder="VRI-001"
          {...form.getInputProps("id")}
          radius={4}
        />
        <TextInput
          label="Tên giống cây"
          placeholder="Sầu riêng Dona"
          {...form.getInputProps("name")}
          radius={4}
        />
        <Select
          label="Danh mục cây trồng"
          placeholder="Chọn danh mục"
          {...form.getInputProps("categoryId")}
          radius={4}
        />
        <Group justify="end">
          <Button type="submit" radius={4}>
            Tạo mới
          </Button>
        </Group>
      </Stack>
    </form>
  );
};
export default AddVarietyForm;
