import {
  Button,
  Group,
  Stack,
  TextInput,
  Select,
  Textarea,
  Image,
  FileInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconImageInPicture } from "@tabler/icons-react";
const AddTechnicalDocForm = () => {
  const form = useForm({
    initialValues: {
      id: "",
      name: "",
      categoryId: "",
      imageUrl: "",
      templateCode: "",
      cultivationTechniques: "",
      standards: "",
      pestSolutions: "",
    },
    validate: {
      id: (val) => (!val ? "Vui lòng nhập mã giống cây" : null),
      name: (val) => (!val ? "Vui lòng nhập tên giống cây" : null),
      categoryId: (val) => (!val ? "Vui lòng chọn danh mục cây trồng" : null),
    },
  });

  return (
    <form>
      <Stack gap={"xs"}>
        <TextInput
          label="Mã giống cây (hệ thống)"
          placeholder="VRI-001"
          {...form.getInputProps("id")}
          radius={4}
        />
        <TextInput
          label="Tên giống cây"
          placeholder="Sầu riêng Dona"
          {...form.getInputProps("name")}
          radius={4}
        />
        <Select
          label="Danh mục cây trồng"
          placeholder="Chọn danh mục"
          {...form.getInputProps("categoryId")}
          radius={4}
        />
        <TextInput
          label="Mã mẫu cây"
          placeholder="TMP-01"
          {...form.getInputProps("templateCode")}
          radius={4}
        />
        <FileInput
          label="Tải lên hình ảnh minh hoạ"
          placeholder="Chọn tệp ảnh"
          accept="image/png,image/jpeg"
          {...form.getInputProps("imageFile")}
          radius={4}
          leftSection={<IconImageInPicture />}
        />
        {form.values.imageUrl && (
          <Image
            src={form.values.imageUrl}
            height={120}
            radius="md"
            alt="preview"
          />
        )}
        <Textarea
          label="Kỹ thuật canh tác"
          autosize
          minRows={2}
          {...form.getInputProps("cultivationTechniques")}
          radius={4}
        />
        <Textarea
          label="Tiêu chuẩn, chất lượng"
          autosize
          minRows={2}
          {...form.getInputProps("standards")}
          radius={4}
        />
        <Textarea
          label="Các loại sâu bệnh và giải pháp"
          autosize
          minRows={2}
          {...form.getInputProps("pestSolutions")}
          radius={4}
        />
        <Group justify="end">
          <Button type="submit" radius={4}>
            Tạo mới
          </Button>
        </Group>
      </Stack>
    </form>
  );
};
export default AddTechnicalDocForm;
