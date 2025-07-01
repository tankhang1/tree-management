import {
  TextInput,
  Textarea,
  Button,
  Select,
  Stack,
  Group,
} from "@mantine/core";
import { useForm } from "@mantine/form";

const treeNameOptions = [
  { value: "Sầu riêng", label: "Sầu riêng" },
  { value: "Xoài", label: "Xoài" },
  { value: "Chuối", label: "Chuối" },
  { value: "Cà phê", label: "Cà phê" },
  { value: "Mít", label: "Mít" },
];

const areaOptions = [
  { value: "A01", label: "Khu A01" },
  { value: "A02", label: "Khu A02" },
  { value: "A03", label: "Khu A03" },
];

const zoneOptions = [
  { value: "Z01", label: "Vùng Z01" },
  { value: "Z02", label: "Vùng Z02" },
  { value: "Z03", label: "Vùng Z03" },
  { value: "Z04", label: "Vùng Z04" },
];

const plotOptions = [
  { value: "P01", label: "Lô P01" },
  { value: "P02", label: "Lô P02" },
  { value: "P04", label: "Lô P04" },
  { value: "P05", label: "Lô P05" },
  { value: "P07", label: "Lô P07" },
];

const AddVarietyForm = () => {
  const form = useForm({
    initialValues: {
      id: "",
      name: "",
      description: "",
      treeName: "",
      areaId: "",
      zoneId: "",
      plotId: "",
    },

    validate: {
      id: (value) => (value ? null : "Bắt buộc"),
      name: (value) => (value ? null : "Bắt buộc"),
      treeName: (value) => (value ? null : "Chọn tên cây"),
    },
  });

  const handleSubmit = (values: typeof form.values) => {
    console.log("Đã submit:", values);
    // Gọi API thêm giống cây tại đây
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack gap="xs">
        <TextInput
          label="Mã giống"
          placeholder="VD: CV001"
          {...form.getInputProps("id")}
          radius={4}
        />
        <TextInput
          label="Tên giống"
          placeholder="VD: Sầu riêng Ri6"
          {...form.getInputProps("name")}
          radius={4}
        />
        <Textarea
          label="Mô tả"
          placeholder="Mô tả ngắn về giống cây"
          {...form.getInputProps("description")}
          radius={4}
        />

        <Select
          label="Tên cây"
          placeholder="Chọn tên cây"
          data={treeNameOptions}
          {...form.getInputProps("treeName")}
          radius={4}
        />
        <Select
          label="Khu vực (area)"
          placeholder="Chọn khu"
          data={areaOptions}
          {...form.getInputProps("areaId")}
          radius={4}
        />
        <Select
          label="Vùng (zone)"
          placeholder="Chọn vùng"
          data={zoneOptions}
          {...form.getInputProps("zoneId")}
          radius={4}
        />
        <Select
          label="Lô (plot)"
          placeholder="Chọn lô"
          data={plotOptions}
          {...form.getInputProps("plotId")}
          radius={4}
        />

        <Group justify="right">
          <Button type="submit" radius={4}>
            Lưu
          </Button>
        </Group>
      </Stack>
    </form>
  );
};
export default AddVarietyForm;
