import {
  Button,
  Group,
  Image,
  Select,
  Stack,
  TextInput,
  Title,
  ActionIcon,
  Paper,
  Radio,
  NumberInput,
  Input,
  Text,
  LoadingOverlay,
} from "@mantine/core";
import {
  Dropzone,
  IMAGE_MIME_TYPE,
  PDF_MIME_TYPE,
  type FileWithPath,
} from "@mantine/dropzone";
import { useForm, isNotEmpty } from "@mantine/form";
import { Notifications, notifications } from "@mantine/notifications";
import {
  IconArrowLeft,
  IconCheck,
  IconPhoto,
  IconUpload,
  IconX,
} from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SunEditor from "suneditor-react";
import "suneditor/dist/css/suneditor.min.css";

// Import your store and types
import { VendorList } from "../../../../components/VendorList";
import { useSeedStore, type SeedFormValues } from "../../../zustand/seedStore";

const PlantManagementSeedAddPage = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Detect ID from URL
  const isEditMode = !!id;

  // Store Hooks
  const { createSeed, updateSeed, getSeedById, isLoading } = useSeedStore();

  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const form = useForm<SeedFormValues>({
    initialValues: {
      id: "",
      name: "",
      supplier: "",
      origin: "",
      germinationRate: 0,
      uniformity: 0,
      yield: "",
      note: "",
      technicalDocFile: null,
      technicalContent: "",
      imageFile: null,
      docType: "file",
    },
    validate: {
      name: isNotEmpty("Tên giống không được để trống"),
      origin: isNotEmpty("Vui lòng chọn xuất xứ"),
    },
  });

  // --- 1. Load Data for Edit Mode ---
  useEffect(() => {
    if (isEditMode && id) {
      const seed = getSeedById(id);
      if (seed) {
        form.setValues({
          id: seed.id,
          name: seed.name,
          supplier: seed.supplier,
          origin: seed.origin,
          germinationRate: seed.germinationRate,
          uniformity: seed.uniformity,
          yield: seed.yield,
          note: seed.note,
          docType: seed.docType,
          technicalContent: seed.technicalContent,
          imageFile: null, // Reset file inputs
          technicalDocFile: null,
        });
        setImagePreview(seed.imgUrl);
      }
    } else {
      // Auto-generate ID for new entries
      form.setFieldValue("id", `SR-${Math.floor(Math.random() * 9999)}`);
    }
  }, [id, isEditMode]);

  // --- 2. Dropzone Handlers ---
  const handleDropImage = (files: FileWithPath[]) => {
    const file = files[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      form.setFieldValue("imageFile", file);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    form.setFieldValue("imageFile", null);
  };

  const handleDropPdf = (files: FileWithPath[]) => {
    const file = files[0];
    if (file) {
      form.setFieldValue("technicalDocFile", file);
      notifications.show({
        title: "Đã chọn file",
        message: file.name,
        color: "blue",
      });
    }
  };

  // --- 3. Submit Handler ---
  const handleSubmit = async () => {
    const values = form.getValues();
    const formData = new FormData();

    // Append simple fields
    formData.append("id", values.id);
    formData.append("name", values.name);
    formData.append("supplier", values.supplier);
    formData.append("origin", values.origin);
    formData.append("germinationRate", String(values.germinationRate));
    formData.append("yield", values.yield);
    formData.append("note", values.note);
    formData.append("docType", values.docType);
    formData.append("uniformity", values.uniformity.toString());
    // Append Logic for Files
    if (values.imageFile) {
      formData.append("imageFile", values.imageFile);
    }

    if (values.docType === "file" && values.technicalDocFile) {
      formData.append("technicalDocFile", "");
    } else {
      formData.append("technicalContent", values.technicalContent);
    }
    console.log("form data", form.getValues());
    let success = false;
    if (isEditMode && id) {
      success = await updateSeed(id, formData);
    } else {
      success = await createSeed(formData);
    }
    if (success) {
      notifications.show({
        title: isEditMode ? "Cập nhật thành công" : "Tạo mới thành công",
        message: values.name,
        color: "green",
        icon: <IconCheck />,
      });
      navigate(-1);
      // Go back
    } else {
      notifications.show({
        title: "Lỗi",
        message: "Vui lòng thử lại",
        color: "red",
        icon: <IconX />,
      });
    }
  };

  return (
    <Paper shadow="md" radius={8} p="xl" withBorder pos="relative">
      <LoadingOverlay
        visible={isLoading}
        zIndex={100}
        overlayProps={{ radius: "sm", blur: 2 }}
      />

      <Group mb="md">
        <Button
          variant="subtle"
          radius={4}
          leftSection={<IconArrowLeft size={18} />}
          onClick={() => navigate(-1)}
        >
          Quay lại
        </Button>
        <Title order={3}>
          {isEditMode ? "Cập nhật hạt giống" : "Tạo mới hạt giống"}
        </Title>
      </Group>

      <form>
        <Group grow align="flex-start">
          <Stack gap="xs" flex={1}>
            <TextInput
              label="Mã giống cây"
              {...form.getInputProps("id")}
              radius={4}
              readOnly
              variant="filled"
            />

            <TextInput
              label="Tên giống"
              withAsterisk
              placeholder="Giống Ri6"
              {...form.getInputProps("name")}
              radius={4}
            />

            {/* Ensure VendorList passes 'value' and 'onChange' internally or use wrapping */}
            <VendorList
              // Assuming VendorList accepts these props to control it via Mantine Form
              // value={form.values.supplier}

              {...form.getInputProps("supplier")}
            />

            <Select
              searchable
              clearable
              label="Xuất xứ"
              placeholder="Chọn quốc gia"
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
              label="Độ đồng đều (%)"
              placeholder="85"
              min={0}
              max={100}
              radius={4}
              {...form.getInputProps("uniformity")}
            />
            {/* Changed to TextInput because type is String now */}
            <TextInput
              label="Năng suất"
              placeholder="25 tấn/ha"
              radius={4}
              {...form.getInputProps("yield")}
            />
          </Stack>

          <Stack flex={1} gap={"xs"}>
            {/* --- HÌNH ẢNH + PREVIEW --- */}
            <Input.Wrapper label="Hình ảnh hạt giống">
              <Dropzone
                onDrop={handleDropImage}
                maxSize={5 * 1024 ** 2}
                accept={IMAGE_MIME_TYPE}
                multiple={false}
              >
                <Group
                  justify="center"
                  gap="xl"
                  mih={180}
                  style={{ pointerEvents: "none" }}
                >
                  <Dropzone.Accept>
                    <IconUpload size={52} color="var(--mantine-color-blue-6)" />
                  </Dropzone.Accept>
                  <Dropzone.Reject>
                    <IconX size={52} color="var(--mantine-color-red-6)" />
                  </Dropzone.Reject>
                  <Dropzone.Idle>
                    <IconPhoto size={52} color="var(--mantine-color-dimmed)" />
                  </Dropzone.Idle>
                  <div>
                    <Text size="lg" inline>
                      Kéo thả ảnh tại đây
                    </Text>
                    <Text size="sm" c="dimmed" mt={7}>
                      Tối đa 5MB
                    </Text>
                  </div>
                </Group>
              </Dropzone>
            </Input.Wrapper>

            {imagePreview && (
              <Stack align="center" pos="relative">
                <Image
                  src={imagePreview}
                  h={200}
                  radius="md"
                  fit="contain"
                  bg="gray.1"
                />
                <ActionIcon
                  variant="filled"
                  color="red"
                  radius="xl"
                  style={{ position: "absolute", top: 5, right: 5 }}
                  onClick={handleRemoveImage}
                >
                  <IconX size={14} />
                </ActionIcon>
              </Stack>
            )}

            {/* --- MÔ TẢ --- */}
            <div>
              <label style={{ fontSize: 14, fontWeight: 500 }}>Mô tả</label>
              <SunEditor
                setOptions={{
                  height: "150px",
                  buttonList: [["bold", "italic", "list"]],
                }}
                setContents={form.values.note}
                onChange={(val) => form.setFieldValue("note", val)}
              />
            </div>

            {/* --- TÀI LIỆU --- */}
            <Radio.Group
              label="Tài liệu kỹ thuật"
              {...form.getInputProps("docType")}
            >
              <Group mt="xs" mb="xs">
                <Radio value="file" label="Tải file PDF" />
                <Radio value="editor" label="Soạn thảo trực tiếp" />
              </Group>
            </Radio.Group>

            {form.values.docType === "file" ? (
              <>
                <Dropzone
                  onDrop={handleDropPdf}
                  maxSize={5 * 1024 ** 2}
                  accept={PDF_MIME_TYPE}
                  multiple={false}
                >
                  <Group
                    justify="center"
                    mih={100}
                    style={{ pointerEvents: "none" }}
                  >
                    <IconUpload size={40} color="gray" />
                    <Text size="sm">Kéo thả file PDF (Max 5MB)</Text>
                  </Group>
                </Dropzone>
                {/* Show existing doc name if available */}
                {form.values.technicalDocFile ? (
                  <Text size="sm" c="blue" mt={5}>
                    File mới: {form.values.technicalDocFile.name}
                  </Text>
                ) : // Logic to show old file name if in Edit mode could go here
                null}
              </>
            ) : (
              <div>
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
          <Button variant="default" onClick={() => navigate(-1)} mr={10}>
            Hủy
          </Button>
          <Button onClick={handleSubmit} loading={isLoading}>
            {isEditMode ? "Lưu thay đổi" : "Tạo mới"}
          </Button>
        </Group>
      </form>
    </Paper>
  );
};

export default PlantManagementSeedAddPage;
