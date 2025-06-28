import { Button, Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";

const AddGroupForm = () => {
  const form = useForm({
    initialValues: {
      id: "",
      name: "",
    },

    validate: {
      id: (value) => (value.length === 0 ? "Vui lòng nhập mã loại cây" : null),
      name: (value) =>
        value.length === 0 ? "Vui lòng nhập tên loại cây" : null,
    },
  });

  const handleSubmit = () => {};
  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack gap={"xs"}>
        <TextInput
          label="Mã loại cây"
          placeholder="LC001"
          {...form.getInputProps("id")}
          radius={4}
        />
        <TextInput
          label="Tên loại cây"
          placeholder="Cây ăn trái"
          {...form.getInputProps("name")}
          radius={4}
        />

        <Button type="submit" radius={4}>
          Tạo mới
        </Button>
      </Stack>
    </form>
  );
};
export default AddGroupForm;
