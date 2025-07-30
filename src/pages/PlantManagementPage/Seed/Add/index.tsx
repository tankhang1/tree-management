import {
  Button,
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
  Input,
  Text,
} from "@mantine/core";
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { useForm } from "@mantine/form";
import {
  IconArrowLeft,
  IconPhoto,
  IconUpload,
  IconX,
} from "@tabler/icons-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SunEditor from "suneditor-react";
import { VendorList } from "../../../../components/VendorList";

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
        <Group grow align="flex-start">
          <Stack gap="xs" flex={1}>
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

            <VendorList />

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
          </Stack>

          <Stack flex={1} gap={"xs"}>
            {/* --- HÌNH ẢNH + PREVIEW --- */}
            <Input.Wrapper label="Hình ảnh hạt giống">
              <Dropzone
                onDrop={(files) => console.log("accepted files", files)}
                onReject={(files) => console.log("rejected files", files)}
                maxSize={5 * 1024 ** 2}
                accept={IMAGE_MIME_TYPE}
              >
                <Group
                  justify="center"
                  gap="xl"
                  mih={220}
                  style={{ pointerEvents: "none" }}
                >
                  <Dropzone.Accept>
                    <IconUpload
                      size={52}
                      color="var(--mantine-color-blue-6)"
                      stroke={1.5}
                    />
                  </Dropzone.Accept>
                  <Dropzone.Reject>
                    <IconX
                      size={52}
                      color="var(--mantine-color-red-6)"
                      stroke={1.5}
                    />
                  </Dropzone.Reject>
                  <Dropzone.Idle>
                    <IconPhoto
                      size={52}
                      color="var(--mantine-color-dimmed)"
                      stroke={1.5}
                    />
                  </Dropzone.Idle>

                  <div>
                    <Text size="xl" inline>
                      Kéo hoặc chọn để tải ảnh lên
                    </Text>
                    <Text size="sm" c="dimmed" inline mt={7}>
                      Giới hạn kích thước ảnh khoản 5MB
                    </Text>
                  </div>
                </Group>
              </Dropzone>
            </Input.Wrapper>
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
                <Radio value="editor" label="Tài liệu kỹ thuật" />
              </Group>
            </Radio.Group>

            {form.values.docType === "file" ? (
              <Dropzone
                onDrop={(files) => console.log("accepted files", files)}
                onReject={(files) => console.log("rejected files", files)}
                maxSize={5 * 1024 ** 2}
                accept={["application/pdf"]}
              >
                <Group
                  justify="center"
                  gap="xl"
                  mih={220}
                  style={{ pointerEvents: "none" }}
                >
                  <Dropzone.Accept>
                    <IconUpload
                      size={52}
                      color="var(--mantine-color-blue-6)"
                      stroke={1.5}
                    />
                  </Dropzone.Accept>
                  <Dropzone.Reject>
                    <IconX
                      size={52}
                      color="var(--mantine-color-red-6)"
                      stroke={1.5}
                    />
                  </Dropzone.Reject>
                  <Dropzone.Idle>
                    <IconPhoto
                      size={52}
                      color="var(--mantine-color-dimmed)"
                      stroke={1.5}
                    />
                  </Dropzone.Idle>

                  <div>
                    <Text size="xl" inline>
                      Bỏ và thả tài liệu kỹ thuật tại đây
                    </Text>
                    <Text size="sm" c="dimmed" inline mt={7}>
                      Đính kèm tài liệu (tối đa 5MB)
                    </Text>
                  </div>
                </Group>
              </Dropzone>
            ) : (
              <div>
                <label style={{ fontSize: 14, fontWeight: 500 }}>
                  Nội dung kỹ thuật
                </label>
                <SunEditor
                  setOptions={{ height: "200px" }}
                  setContents={form.values.technicalContent}
                  onChange={(val) =>
                    form.setFieldValue("technicalContent", val)
                  }
                />
              </div>
            )}
          </Stack>
        </Group>
        <Group justify="flex-end" mt="md">
          <Button type="submit" radius={4}>
            Tạo mới
          </Button>
        </Group>
      </form>
    </Paper>
  );
};

export default PlantManagementSeedAddPage;
