import {
  Button,
  Stack,
  TextInput,
  Textarea,
  Select,
  Group,
  Image,
  ActionIcon,
  rem,
  Radio,
  Text,
  Input,
  LoadingOverlay,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconUpload, IconX, IconPhoto, IconCheck } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import SunEditor from "suneditor-react";
import "suneditor/dist/css/suneditor.min.css"; // Nhớ import CSS
import {
  Dropzone,
  IMAGE_MIME_TYPE,
  PDF_MIME_TYPE,
  type FileWithPath,
} from "@mantine/dropzone";
import { notifications } from "@mantine/notifications";
import { useVarietyStore, type Variety } from "../../../zustand/varietyStore";

// Store

// Helper chuyển file sang base64 để lưu localStorage
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

type Props = {
  editId?: string | null;
  onClose: () => void;
};

const AddVarietyForm = ({ editId, onClose }: Props) => {
  const { addVariety, updateVariety, getVarietyById, isLoading } =
    useVarietyStore();

  const form = useForm({
    initialValues: {
      id: "",
      name: "",
      description: "",
      treeName: "",
      imgUrl: "",
      docType: "editor",
      docContent: "", // Lưu HTML hoặc tên file PDF
    },
    validate: {
      id: (val) => (val.trim().length === 0 ? "Mã không được để trống" : null),
      name: (val) =>
        val.trim().length === 0 ? "Tên không được để trống" : null,
      treeName: (val) => (!val ? "Vui lòng chọn loại cây" : null),
    },
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // --- LOGIC LOAD DỮ LIỆU KHI EDIT ---
  useEffect(() => {
    if (editId) {
      const data = getVarietyById(editId);
      if (data) {
        form.setValues({
          id: data.id,
          name: data.name,
          description: data.description,
          treeName: data.treeName,
          imgUrl: data.imgUrl,
          docType: data.docType || "editor",
          docContent: data.docContent || "",
        });
        setImagePreview(data.imgUrl);
      }
    } else {
      // Tự động sinh ID khi thêm mới
      form.setFieldValue("id", `VAR-${Math.floor(Math.random() * 10000)}`);
    }
  }, [editId]);

  // --- HANDLERS ---
  const handleDropImage = async (files: FileWithPath[]) => {
    const file = files[0];
    if (file) {
      const base64 = await fileToBase64(file);
      setImagePreview(base64);
      form.setFieldValue("imgUrl", base64);
    }
  };

  const handleImageClear = () => {
    form.setFieldValue("imgUrl", "");
    setImagePreview(null);
  };

  const handleDropPdf = (files: FileWithPath[]) => {
    const file = files[0];
    if (file) {
      form.setFieldValue("docContent", file.name); // Chỉ lưu tên file demo
      notifications.show({
        message: `Đã chọn file: ${file.name}`,
        color: "blue",
      });
    }
  };

  const handleSubmit = async (values: typeof form.values) => {
    const payload: Variety = {
      ...values,
      // Các trường optional mình để mặc định hoặc rỗng cho demo
      origin: "Việt Nam",
      maturityDays: 0,
      yieldKgPerTree: 0,
      season: [],
      resistance: [],
      hashtags: [],
      notes: "",
      isCertified: false,
    };

    let success = false;
    if (editId) {
      success = await updateVariety(editId, payload);
    } else {
      success = await addVariety(payload);
    }

    if (success) {
      notifications.show({
        title: "Thành công",
        message: editId ? "Cập nhật thành công" : "Tạo mới thành công",
        color: "green",
        icon: <IconCheck />,
      });
      onClose();
    }
  };

  return (
    <form
      onSubmit={form.onSubmit(handleSubmit)}
      style={{ position: "relative" }}
    >
      <LoadingOverlay visible={isLoading} />
      <Stack gap="sm">
        <TextInput
          label="Mã giống cây"
          placeholder="VD: VAR001"
          required
          radius={4}
          {...form.getInputProps("id")}
          readOnly={!!editId} // Không cho sửa ID khi edit
          variant={editId ? "filled" : "default"}
        />

        <TextInput
          label="Tên giống"
          placeholder="VD: Sầu riêng Ri6"
          radius={4}
          required
          {...form.getInputProps("name")}
        />

        <Select
          searchable
          clearable
          label="Tên cây"
          placeholder="Chọn loại cây"
          radius={4}
          required
          data={[
            "Sầu riêng",
            "Xoài",
            "Chuối",
            "Cà phê",
            "Chè",
            "Đậu nành",
            "Bắp",
          ]}
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

        <Input.Wrapper label="Ảnh giống cây">
          <Dropzone
            onDrop={handleDropImage}
            maxSize={5 * 1024 ** 2}
            accept={IMAGE_MIME_TYPE}
            multiple={false}
          >
            <Group
              justify="center"
              gap="xl"
              mih={120}
              style={{ pointerEvents: "none" }}
            >
              <Dropzone.Idle>
                <IconPhoto size={40} color="gray" />
              </Dropzone.Idle>
              <div>
                <Text size="sm" inline>
                  Kéo hoặc chọn để tải ảnh lên
                </Text>
              </div>
            </Group>
          </Dropzone>
        </Input.Wrapper>

        {imagePreview && (
          <Group justify="flex-start" mt="xs">
            <div style={{ position: "relative", display: "inline-block" }}>
              <Image
                src={imagePreview}
                radius="md"
                h={120}
                w="auto"
                fit="contain"
              />
              <ActionIcon
                variant="filled"
                color="red"
                size="sm"
                radius="xl"
                style={{ position: "absolute", top: 2, right: 2 }}
                onClick={handleImageClear}
              >
                <IconX size={14} />
              </ActionIcon>
            </div>
          </Group>
        )}

        <Radio.Group
          label="Tài liệu kỹ thuật"
          value={form.values.docType}
          onChange={(val) => form.setFieldValue("docType", val)}
        >
          <Group mt="xs">
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
                mih={80}
                style={{ pointerEvents: "none" }}
              >
                <IconUpload size={30} color="gray" />
                <Text size="sm">Tải file PDF (Max 5MB)</Text>
              </Group>
            </Dropzone>
            {form.values.docContent && (
              <Text size="xs" c="blue" mt={4}>
                File hiện tại: {form.values.docContent}
              </Text>
            )}
          </>
        ) : (
          <Stack gap={4}>
            <Text size="sm" fw={500}>
              Nội dung kỹ thuật
            </Text>
            <SunEditor
              setOptions={{
                height: "200px",
                buttonList: [["bold", "italic", "list"]],
              }}
              setContents={form.values.docContent}
              onChange={(val) => form.setFieldValue("docContent", val)}
            />
          </Stack>
        )}

        <Group justify="flex-end" mt="md">
          <Button variant="default" onClick={onClose}>
            Hủy
          </Button>
          <Button type="submit" radius={4}>
            {editId ? "Lưu thay đổi" : "Tạo giống cây"}
          </Button>
        </Group>
      </Stack>
    </form>
  );
};

export default AddVarietyForm;
