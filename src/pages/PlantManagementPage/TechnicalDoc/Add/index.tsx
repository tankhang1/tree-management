import {
  Button,
  FileInput,
  Group,
  Image,
  Stack,
  Title,
  Text,
  Card,
  Select,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconArrowLeft, IconPhoto } from "@tabler/icons-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SunEditor from "suneditor-react";

const PlantManagementTechnicalDocAddPage = () => {
  const navigate = useNavigate();
  const form = useForm({
    initialValues: {
      templateCode: "",
      image: null as File | null,
      cultivationTechniques: "",
      standards: "",
      pestSolutions: "",
    },
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageChange = (file: File | null) => {
    if (file) {
      const url = URL.createObjectURL(file);
      setImagePreview(url);
      form.setFieldValue("image", file);
    } else {
      setImagePreview(null);
      form.setFieldValue("image", null);
    }
  };

  const handleSubmit = (values: typeof form.values) => {
    console.log("📝 Dữ liệu kỹ thuật:", values);
  };

  return (
    <Card withBorder shadow="sm" radius={8} p="md">
      <Group mb={"md"}>
        <Button
          variant="subtle"
          radius={4}
          leftSection={<IconArrowLeft size={18} />}
          onClick={() => navigate(-1)}
        >
          Quay lại
        </Button>
        <Title order={3}>🧾 Thêm tài liệu kỹ thuật</Title>
      </Group>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="xs">
          <Select
            label="Mã mẫu cây"
            placeholder="TMP-01"
            radius={4}
            {...form.getInputProps("templateCode")}
          />

          <FileInput
            label="Hình ảnh minh hoạ"
            placeholder="Chọn ảnh minh hoạ"
            accept="image/*"
            leftSection={<IconPhoto size={18} />}
            radius={4}
            onChange={handleImageChange}
          />

          {imagePreview && (
            <Image
              src={imagePreview}
              alt="Preview"
              width={180}
              height={120}
              fit="cover"
              radius="md"
              style={{ border: "1px solid #ddd" }}
            />
          )}

          <Stack>
            <Text fz={14} fw={"500"}>
              Kỹ thuật canh tác
            </Text>
            <SunEditor
              setContents={form.values.cultivationTechniques}
              onChange={(val) =>
                form.setFieldValue("cultivationTechniques", val)
              }
              setOptions={{ height: "200px" }}
            />
          </Stack>
          <Stack>
            <Text fz={14} fw={"500"}>
              Tiêu chuẩn chất lượng
            </Text>
            <SunEditor
              setContents={form.values.cultivationTechniques}
              onChange={(val) => form.setFieldValue("standards", val)}
              setOptions={{ height: "200px" }}
            />
          </Stack>
          <Stack>
            <Text fz={14} fw={"500"}>
              Sâu bệnh & Giải pháp
            </Text>
            <SunEditor
              setContents={form.values.cultivationTechniques}
              onChange={(val) => form.setFieldValue("pestSolutions", val)}
              setOptions={{ height: "200px" }}
            />
          </Stack>

          <Group justify="flex-end" mt="md">
            <Button type="submit" radius={4}>
              Lưu
            </Button>
          </Group>
        </Stack>
      </form>
    </Card>
  );
};

export default PlantManagementTechnicalDocAddPage;
