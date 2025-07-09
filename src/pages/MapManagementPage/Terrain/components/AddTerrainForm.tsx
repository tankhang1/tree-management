import { TextInput, Textarea, Button, Group, Stack } from "@mantine/core";
import { useForm } from "@mantine/form";

const AddTerrainForm = () => {
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
          label="Mã địa hình"
          placeholder="VD: HIGH"
          required
          {...form.getInputProps("id")}
          radius={4}
        />
        <TextInput
          label="Tên địa hình"
          placeholder="VD: Cao, Dốc, Bằng phẳng..."
          required
          {...form.getInputProps("name")}
          radius={4}
        />
        <Textarea
          label="Mô tả"
          placeholder="Thêm mô tả chi tiết nếu cần"
          {...form.getInputProps("description")}
          radius={4}
        />
      </Stack>
      <Group justify="flex-end" mt="md">
        <Button type="submit" radius={4}>
          Lưu
        </Button>
      </Group>
    </form>
  );
};
export default AddTerrainForm;
