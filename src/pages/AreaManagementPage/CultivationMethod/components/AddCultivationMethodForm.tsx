import { Button, Group, Stack, TextInput, FileInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconUpload } from "@tabler/icons-react";
const AddCultivationMethodForm = () => {
  const form = useForm({
    initialValues: {
      id: "",
      name: "",
      document: null as File | null,
    },
  });
  return (
    <form>
      <Stack>
        <TextInput
          label="Tên phương pháp"
          placeholder="VD: Hữu cơ"
          required
          {...form.getInputProps("name")}
          radius={4}
        />
        <FileInput
          label="Tài liệu hướng dẫn (PDF)"
          placeholder="Tải lên file PDF"
          leftSection={<IconUpload size={16} />}
          accept="application/pdf"
          {...form.getInputProps("document")}
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
export default AddCultivationMethodForm;
