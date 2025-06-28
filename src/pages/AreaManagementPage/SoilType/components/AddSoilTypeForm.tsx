import { TextInput, Textarea, Button, Group, Stack } from "@mantine/core";
import { useForm } from "@mantine/form";

const AddSoilTypeForm = () => {
  const form = useForm({
    initialValues: {
      id: "",
      name: "",
      description: "",
    },
  });

  return (
    <form>
      <Stack>
        <TextInput
          label="Mã loại đất"
          placeholder="VD: CLAY"
          required
          {...form.getInputProps("id")}
          radius={4}
        />
        <TextInput
          label="Tên loại đất"
          placeholder="VD: Đất thịt"
          required
          {...form.getInputProps("name")}
          radius={4}
        />
        <Textarea
          label="Mô tả"
          placeholder="Thêm thông tin mô tả nếu cần"
          {...form.getInputProps("description")}
          radius={4}
        />
        <Group justify="flex-end" mt="md">
          <Button type="submit" radius={4}>
            Lưu
          </Button>
        </Group>
      </Stack>
    </form>
  );
};
export default AddSoilTypeForm;
