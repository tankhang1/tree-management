import {
  Button,
  Group,
  Select,
  Stack,
  Textarea,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";

const AddTreeForm = () => {
  const form = useForm({
    initialValues: {
      rowId: "",
      zoneId: "",
      blockId: "",
      plotId: "",
      treeId: "",
      plantedAt: "",
      gps: "",
    },
  });
  return (
    <form>
      <Stack gap={"xs"}>
        <Select
          label="Mã vùng"
          placeholder="Chọn vùng"
          required
          {...form.getInputProps("plotId")}
          radius={4}
        />
        <Select
          label="Mã khu vực"
          placeholder="Chọn khu vực"
          required
          {...form.getInputProps("zoneId")}
          radius={4}
        />
        <Select
          placeholder="Chọn lô"
          label="Mã lô"
          required
          {...form.getInputProps("blockId")}
          radius={4}
        />
        <Select
          placeholder="Chọn hàng"
          label="Mã hàng"
          required
          {...form.getInputProps("rowId")}
          radius={4}
        />
        <Select
          placeholder="Chọn cây trồng"
          label="Mã cây"
          required
          {...form.getInputProps("treeId")}
          radius={4}
        />

        <TextInput
          label="Ngày trồng"
          type="date"
          required
          {...form.getInputProps("plantedAt")}
          radius={4}
        />
        <Textarea
          label="Toạ độ GPS"
          required
          placeholder="VD: 10.77,106.69"
          {...form.getInputProps("gps")}
          radius={4}
        />
      </Stack>
      <Group mt="lg" justify="flex-end">
        <Button variant="default" radius={4}>
          Huỷ
        </Button>
        <Button type="submit" radius={4}>
          Thêm cây
        </Button>
      </Group>
    </form>
  );
};
export default AddTreeForm;
