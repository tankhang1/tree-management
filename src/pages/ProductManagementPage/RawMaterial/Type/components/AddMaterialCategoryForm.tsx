// components/AddMaterialCategoryForm.tsx
import { Button, Group, Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";

type FormValues = {
  id: string;
  name: string;
};

const AddMaterialCategoryForm = () => {
  const form = useForm<FormValues>({
    initialValues: {
      id: "",
      name: "",
    },
    validate: {
      id: (value) =>
        value.trim().length === 0 ? "Vui lòng nhập mã nguyên vật liệu" : null,
      name: (value) =>
        value.trim().length === 0 ? "Vui lòng nhập tên nguyên vật liệu" : null,
    },
  });

  const handleSubmit = (values: FormValues) => {
    console.log("Dữ liệu đã nhập:", values);
    // TODO: Gửi dữ liệu lên API hoặc cập nhật danh sách bên ngoài
    form.reset();
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack>
        <TextInput
          label="Mã loại nguyên vật liệu"
          radius={4}
          placeholder="Nhập mã ví dụ: MAT01"
          {...form.getInputProps("id")}
        />
        <TextInput
          label="Tên danh mục nguyên vật liệu"
          radius={4}
          placeholder="Nhập tên ví dụ: Phân bón"
          {...form.getInputProps("name")}
        />

        <Group justify="flex-end" mt="md">
          <Button radius={4}>Lưu</Button>
        </Group>
      </Stack>
    </form>
  );
};

export default AddMaterialCategoryForm;
