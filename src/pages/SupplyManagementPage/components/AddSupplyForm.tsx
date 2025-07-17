import { Button, Group, ScrollArea, Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { VendorList } from "../../../components/VendorList";

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
      <Stack gap="xs" w={"100%"}>
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
        <VendorList />
        <Group justify="right" mt="md">
          <Button radius={4}>Lưu</Button>
        </Group>
      </Stack>
    </form>
  );
};

export default AddSupplyForm;
