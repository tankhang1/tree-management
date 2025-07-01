import { TextInput, Button, Select, Stack, Group } from "@mantine/core";
import { useForm } from "@mantine/form";
const groupTreeOptions = [
  { value: "Cây ăn quả nhiệt đới", label: "Cây ăn quả nhiệt đới" },
  { value: "Cây công nghiệp", label: "Cây công nghiệp" },
  { value: "Cây lấy gỗ", label: "Cây lấy gỗ" },
  // Thêm nhóm cây khác nếu cần
];
const AddCatalogForm = () => {
  const form = useForm({
    initialValues: {
      id: "",
      name: "",
      eppo_code: "",
      icc_code: "",
      vn_name: "",
      group_tree: "",
    },

    validate: {
      id: (value) => (value ? null : "Bắt buộc"),
      name: (value) => (value ? null : "Bắt buộc"),
      vn_name: (value) => (value ? null : "Bắt buộc"),
    },
  });

  const handleSubmit = (values: typeof form.values) => {
    console.log("Submitted:", values);
    // Gọi API tạo mới ở đây nếu cần
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack gap="xs">
        <TextInput
          label="Mã loại cây"
          placeholder="VD: CT01"
          {...form.getInputProps("id")}
          radius={4}
        />
        <TextInput
          label="Tên danh mục cây"
          placeholder="VD: Durio zibethinus"
          radius={4}
          {...form.getInputProps("name")}
        />
        <TextInput
          label="Tên tiếng Việt"
          placeholder="VD: Sầu riêng"
          radius={4}
          {...form.getInputProps("vn_name")}
        />
        <TextInput
          label="Mã EPPO"
          placeholder="VD: DURZI"
          radius={4}
          {...form.getInputProps("eppo_code")}
        />
        <TextInput
          label="Mã ICC"
          placeholder="VD: DZ001"
          radius={4}
          {...form.getInputProps("icc_code")}
        />
        <Select
          label="Nhóm cây"
          placeholder="Chọn nhóm cây"
          data={groupTreeOptions}
          radius={4}
          {...form.getInputProps("group_tree")}
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
export default AddCatalogForm;
