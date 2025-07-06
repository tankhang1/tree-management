import {
  Button,
  FileInput,
  Group,
  Image,
  Select,
  Stack,
  TextInput,
  Title,
  rem,
  ActionIcon,
  Paper,
  Radio,
  NumberInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import {
  IconArrowLeft,
  IconFileTypePdf,
  IconPhoto,
  IconX,
} from "@tabler/icons-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SunEditor from "suneditor-react";

const PlantManagementSeedAddPage = () => {
  const navigate = useNavigate();

  const form = useForm({
    initialValues: {
      id: "",
      name: "",
      supplier: "",
      origin: "",
      germinationRate: "",
      yield: "",
      note: "",
      technicalDoc: null as File | null,
      technicalContent: "",
      image: null as File | null,
      docType: "file", // or "editor"
    },
    validate: {
      id: (val) => (!val ? "Vui lòng nhập mã giống" : null),
      name: (val) => (!val ? "Vui lòng nhập tên giống" : null),
    },
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageChange = (file: File | null) => {
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      form.setFieldValue("image", file);
    } else {
      setImagePreview(null);
      form.setFieldValue("image", null);
    }
  };

  const handleSubmit = (values: typeof form.values) => {
    console.log("🌱 Dữ liệu hạt giống:", values);
  };

  return (
    <Paper shadow="md" radius={8} p="xl" withBorder>
      <Group mb="md">
        <Button
          variant="subtle"
          radius={4}
          leftSection={<IconArrowLeft size={18} />}
          onClick={() => navigate(-1)}
        >
          Quay lại
        </Button>
        <Title order={3}>Tạo mới hạt giống</Title>
      </Group>

      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="sm">
          <TextInput
            label="Mã giống cây (hệ thống)"
            placeholder="SR-RI6"
            {...form.getInputProps("id")}
            radius={4}
            disabled
          />

          <TextInput
            label="Tên giống"
            placeholder="Giống Ri6"
            {...form.getInputProps("name")}
            radius={4}
            required
          />

          <Select
            label="Nhà cung cấp"
            placeholder="Công ty giống cây trồng"
            data={["Green Seed Co.", "Trại giống Long An", "BioSeed Việt Nam"]}
            {...form.getInputProps("supplier")}
            radius={4}
          />

          <Select
            label="Xuất xứ (quốc gia)"
            placeholder="Việt Nam"
            data={["Việt Nam", "Thái Lan", "Malaysia", "Philippines"]}
            {...form.getInputProps("origin")}
            radius={4}
          />

          <NumberInput
            label="Tỷ lệ nảy mầm (%)"
            placeholder="85"
            min={0}
            max={100}
            radius={4}
            {...form.getInputProps("germinationRate")}
          />

          <NumberInput
            label="Năng suất (tấn/ha)"
            placeholder="25"
            min={0}
            radius={4}
            {...form.getInputProps("yield")}
          />

          {/* --- MÔ TẢ BẰNG SUNEDITOR --- */}
          <div>
            <label style={{ fontSize: 14, fontWeight: 500 }}>Mô tả</label>
            <SunEditor
              setOptions={{ height: "150px" }}
              setContents={form.values.note}
              onChange={(val) => form.setFieldValue("note", val)}
            />
          </div>

          {/* --- CHỌN HÌNH THỨC TÀI LIỆU --- */}
          <Radio.Group
            label="Tài liệu kỹ thuật"
            value={form.values.docType}
            onChange={(val) => form.setFieldValue("docType", val)}
          >
            <Group mt="xs">
              <Radio value="file" label="Tải file PDF" />
              <Radio value="editor" label="Nhập nội dung trực tiếp" />
            </Group>
          </Radio.Group>

          {form.values.docType === "file" ? (
            <FileInput
              label="Tài liệu kỹ thuật (PDF)"
              placeholder="Chọn tài liệu"
              accept="application/pdf"
              leftSection={<IconFileTypePdf size={18} />}
              radius={4}
              {...form.getInputProps("technicalDoc")}
            />
          ) : (
            <div>
              <label style={{ fontSize: 14, fontWeight: 500 }}>
                Nội dung kỹ thuật
              </label>
              <SunEditor
                setOptions={{ height: "200px" }}
                setContents={form.values.technicalContent}
                onChange={(val) => form.setFieldValue("technicalContent", val)}
              />
            </div>
          )}

          {/* --- HÌNH ẢNH + PREVIEW --- */}
          <FileInput
            label="Hình ảnh hạt giống"
            placeholder="Tải lên ảnh"
            accept="image/*"
            radius={4}
            leftSection={<IconPhoto size={18} />}
            onChange={handleImageChange}
            clearable
            value={form.values.image}
          />

          {imagePreview && (
            <Stack style={{ position: "relative", display: "inline-block" }}>
              <Image
                src={imagePreview}
                alt="Hình giống"
                h={200}
                radius="md"
                fit="contain"
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
                onClick={() => handleImageChange(null)}
              >
                <IconX size={14} />
              </ActionIcon>
            </Stack>
          )}

          <Group justify="flex-end" mt="md">
            <Button type="submit" radius={4}>
              Tạo mới
            </Button>
          </Group>
        </Stack>
      </form>
    </Paper>
  );
};

export default PlantManagementSeedAddPage;
