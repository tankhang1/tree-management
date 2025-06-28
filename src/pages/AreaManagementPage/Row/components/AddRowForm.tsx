import {
  Button,
  Group,
  Select,
  Stack,
  Textarea,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";

const AddRowForm = () => {
  const rowForm = useForm({
    initialValues: {
      regionId: "",
      zoneId: "",
      plotId: "",
      name: "",
      code: "",
      crop: "",
      treeCount: "",
      gps: "",
    },
  });
  return (
    <form>
      <Stack gap={"xs"}>
        <Select
          label="Chọn vùng trồng"
          data={["A", "B"]}
          required
          {...rowForm.getInputProps("regionId")}
          radius={4}
        />
        <Select
          label="Chọn khu vực"
          data={["A", "B"]}
          required
          {...rowForm.getInputProps("zoneId")}
          radius={4}
        />
        <Select
          label="Chọn lô"
          data={["A", "B"]}
          required
          {...rowForm.getInputProps("plotId")}
          radius={4}
        />
        <TextInput
          label="Mã hàng"
          required
          {...rowForm.getInputProps("code")}
          radius={4}
        />

        <TextInput
          label="Tên hàng"
          required
          {...rowForm.getInputProps("name")}
          radius={4}
        />

        <Select
          label="Cây trồng"
          data={["Sầu riêng", "Xoài", "Chuối"]}
          required
          {...rowForm.getInputProps("crop")}
          radius={4}
        />
        <Textarea
          label="Toạ độ GPS (x1y1 x2y2)"
          required
          {...rowForm.getInputProps("gps")}
          radius={4}
        />
      </Stack>
      <Group mt="lg" justify="flex-end">
        <Button variant="default" radius={4}>
          Huỷ
        </Button>
        <Button type="submit" radius={4}>
          Thêm
        </Button>
      </Group>
    </form>
  );
};

export default AddRowForm;
