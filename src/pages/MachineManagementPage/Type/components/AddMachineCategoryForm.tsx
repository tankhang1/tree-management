import { Button, Group, Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";

type FormValues = {
  id: string;
  name: string;
};

const AddMachineCategoryForm = () => {
  const form = useForm<FormValues>({
    initialValues: {
      id: "",
      name: "",
    },
    validate: {
      id: (value) =>
        value.trim().length === 0 ? "Vui lòng nhập mã máy móc" : null,
      name: (value) =>
        value.trim().length === 0 ? "Vui lòng nhập tên máy móc" : null,
    },
  });

  const handleSubmit = (values: FormValues) => {
    console.log("Dữ liệu máy móc:", values);
    form.reset();
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack>
        <TextInput
          label="Mã loại máy móc"
          placeholder="Ví dụ: MCH01"
          radius={4}
          {...form.getInputProps("id")}
        />
        <TextInput
          label="Tên loại máy móc"
          radius={4}
          placeholder="Ví dụ: Máy cày"
          {...form.getInputProps("name")}
        />
        <Group justify="flex-end" mt="md">
          <Button radius={4}>Lưu</Button>
        </Group>
      </Stack>
    </form>
  );
};

export default AddMachineCategoryForm;
