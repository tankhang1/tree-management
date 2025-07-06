import {
  Button,
  Stack,
  TextInput,
  Textarea,
  Select,
  Group,
  FileInput,
  Image,
  ActionIcon,
  rem,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconUpload, IconFileText, IconX } from "@tabler/icons-react";
import { useState } from "react";

const AddVarietyForm = () => {
  const form = useForm({
    initialValues: {
      id: "",
      name: "",
      description: "",
      treeName: "",
      imgUrl: "",
      doc: "",
    },
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleSubmit = (values: typeof form.values) => {
    console.log("📦 Dữ liệu gửi:", values);
  };

  const handleImageClear = () => {
    form.setFieldValue("imgUrl", "");
    setImagePreview(null);
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack gap="sm">
        <TextInput
          label="Mã giống cây"
          placeholder="VD: VAR001"
          required
          radius={4}
          {...form.getInputProps("id")}
        />

        <TextInput
          label="Tên giống"
          placeholder="VD: Sầu riêng Ri6"
          radius={4}
          required
          {...form.getInputProps("name")}
        />

        <Select
          label="Tên cây"
          placeholder="Chọn loại cây"
          radius={4}
          required
          data={["Sầu riêng", "Xoài", "Chuối", "Cà phê", "Chè"]}
          {...form.getInputProps("treeName")}
        />

        <Textarea
          label="Mô tả"
          placeholder="Nhập mô tả giống cây..."
          radius={4}
          minRows={3}
          autosize
          {...form.getInputProps("description")}
        />

        <FileInput
          label="Ảnh giống cây"
          placeholder="Chọn ảnh"
          accept="image/*"
          radius={4}
          leftSection={<IconUpload size={18} />}
          onChange={(file) => {
            if (file) {
              const url = URL.createObjectURL(file);
              form.setFieldValue("imgUrl", url);
              setImagePreview(url);
            }
          }}
          clearable
          clearButtonProps={{ onClick: handleImageClear }}
        />

        {imagePreview && (
          <Group justify="left" mt="xs">
            <div style={{ position: "relative", display: "inline-block" }}>
              <Image
                src={imagePreview}
                alt="Ảnh giống cây"
                radius="md"
                height={160}
                width={220}
                fit="cover"
              />
              <ActionIcon
                variant="filled"
                color="red"
                size="sm"
                radius="xl"
                style={{
                  position: "absolute",
                  top: rem(6),
                  right: rem(6),
                  zIndex: 10,
                }}
                onClick={handleImageClear}
              >
                <IconX size={14} />
              </ActionIcon>
            </div>
          </Group>
        )}

        <FileInput
          label="Tài liệu giống cây"
          placeholder="Tài liệu PDF/DOC"
          accept=".pdf,.doc,.docx"
          radius={4}
          leftSection={<IconFileText size={18} />}
          onChange={(file) => {
            if (file) {
              form.setFieldValue("doc", file.name);
            }
          }}
        />

        <Group justify="flex-end" mt="md">
          <Button type="submit" radius={4}>
            Tạo giống cây
          </Button>
        </Group>
      </Stack>
    </form>
  );
};

export default AddVarietyForm;
