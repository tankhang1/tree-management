import { Button, Group, Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";

const AddPesticideCategoryForm = () => {
  const form = useForm({
    initialValues: {
      id: "",
      name: "",
    },
    validate: {
      id: (val) => (!val ? "Vui lòng nhập mã loại thuốc" : null),
      name: (val) => (!val ? "Vui lòng nhập tên loại thuốc" : null),
    },
  });
  return (
    <form>
      <Stack gap="xs">
        <TextInput
          label="Mã loại thuốc"
          radius={4}
          {...form.getInputProps("id")}
          required
        />
        <TextInput
          label="Tên loại thuốc"
          radius={4}
          {...form.getInputProps("name")}
          required
        />
        <Group justify="right" mt="md">
          <Button radius={4}>Lưu</Button>
        </Group>
      </Stack>
    </form>
  );
};

export default AddPesticideCategoryForm;
