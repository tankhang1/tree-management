import { Button, Group, Select, Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";

const AddSupplyForm = () => {
  const form = useForm({
    initialValues: {
      id: "",
      name: "",
      supplier: "",
    },
    validate: {
      id: (val) => (!val ? "Vui lòng nhập mã vật tư" : null),
      name: (val) => (!val ? "Vui lòng nhập tên vật tư" : null),
      supplier: (val) => (!val ? "Vui lòng nhập nhà cung cấp" : null),
    },
  });
  return (
    <form>
      <Stack gap="xs">
        <TextInput
          label="Mã vật tư"
          radius={4}
          {...form.getInputProps("id")}
          required
        />
        <TextInput
          label="Tên vật tư"
          radius={4}
          {...form.getInputProps("name")}
          required
        />
        <Select
          label="Chọn nhà cung cấp"
          radius={4}
          {...form.getInputProps("supplier")}
          required
        />
        <Group justify="right" mt="md">
          <Button radius={4}>Lưu</Button>
        </Group>
      </Stack>
    </form>
  );
};

export default AddSupplyForm;
