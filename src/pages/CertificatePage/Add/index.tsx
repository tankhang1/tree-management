import {
  Group,
  Card,
  Stack,
  Title,
  TextInput,
  NumberInput,
  Textarea,
  Select,
  Radio,
  Text,
  Button,
  Input,
  Modal,
  Image,
  LoadingOverlay,
  ActionIcon,
  Box,
} from "@mantine/core";
import { useState } from "react";
import {
  IconSearch,
  IconUpload,
  IconX,
  IconPhoto,
  IconArrowLeft,
  IconCheck,
  IconTrash,
  IconFileTypePdf,
} from "@tabler/icons-react";
import {
  Dropzone,
  IMAGE_MIME_TYPE,
  type FileWithPath,
} from "@mantine/dropzone";
import SunEditor from "suneditor-react";
import "suneditor/dist/css/suneditor.min.css";
import { DateTimePicker } from "@mantine/dates";
import { useNavigate } from "react-router-dom";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";

// Components (Giả định đường dẫn đúng trong dự án của bạn)
import CropCards from "../../SeasonManagementPage/Growth/Add/components/CropCards";
import SeedCards from "../../SeasonManagementPage/Growth/Add/components/SeedCards";
import { cropOptions, seedOptions } from "../../AreaManagementPage/Row/Add";
import {
  useCertificateStore,
  type Certificate,
} from "../../zustand/certificateStore";

// Helper Base64
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

export default function CertificateAddPageGroup() {
  const navigate = useNavigate();

  // 1. Kết nối Store
  const { addCertificate, isLoading } = useCertificateStore();

  const [openedFilter, setOpenedFilter] = useState(false);
  // const [treeType, setTreeType] = useState("crop"); // Dùng nếu mở comment phần chọn cây

  // 2. Form Setup
  const form = useForm({
    initialValues: {
      id: "GCN-" + Math.floor(Math.random() * 10000),
      orgName: "",
      orgLogo: "", // Base64 string
      certCode: "",
      certName: "",
      issueDate: new Date(),
      validYears: 3,
      definition: "",
      contentType: "file", // "file" | "editor"
      content: "", // Base64 PDF hoặc HTML string
      targets: [] as string[], // ID cây trồng/giống
    },
    validate: {
      orgName: (v) => (!v ? "Vui lòng chọn tổ chức" : null),
      certCode: (v) => (!v ? "Vui lòng nhập mã số" : null),
      certName: (v) => (!v ? "Vui lòng nhập tên chứng nhận" : null),
    },
  });

  // --- HANDLERS ---

  // Upload Logo (Ảnh)
  const handleDropLogo = async (files: FileWithPath[]) => {
    const file = files[0];
    if (file) {
      try {
        const base64 = URL.createObjectURL(file);
        form.setFieldValue("orgLogo", base64);
      } catch (error) {
        console.error(error);
        notifications.show({ message: "Lỗi khi tải ảnh", color: "red" });
      }
    }
  };

  // Xóa Logo
  const handleRemoveLogo = () => {
    form.setFieldValue("orgLogo", "");
  };

  // Upload PDF Chứng nhận
  const handleDropContentFile = async (files: FileWithPath[]) => {
    const file = files[0];
    if (file) {
      try {
        const base64 = URL.createObjectURL(file);
        form.setFieldValue("content", base64);
        notifications.show({
          message: `Đã tải file: ${file.name}`,
          color: "blue",
        });
      } catch (error) {
        console.error(error);
        notifications.show({ message: "Lỗi khi tải file", color: "red" });
      }
    }
  };

  // Xóa PDF
  const handleRemoveContentFile = () => {
    form.setFieldValue("content", "");
  };

  // Submit
  const handleFinish = async () => {
    const validation = form.validate();
    if (validation.hasErrors) return;

    const payload: Omit<Certificate, "createdAt"> = {
      id: form.values.id,
      orgName: form.values.orgName,
      orgLogo: form.values.orgLogo,
      certCode: form.values.certCode,
      certName: form.values.certName,
      // Ensure issueDate is treated as a Date object before calling toISOString()
      issueDate: new Date(form.values.issueDate).toISOString(),
      validYears: form.values.validYears,
      definition: form.values.definition,
      contentType: form.values.contentType as "file" | "editor",
      content: form.values.content,
      targets: form.values.targets,
    };

    const success = await addCertificate(payload);
    if (success) {
      notifications.show({
        title: "Thành công",
        message: "Đã thêm chứng nhận mới",
        color: "green",
        icon: <IconCheck />,
      });
      navigate(-1);
    }
  };

  return (
    <Card withBorder shadow="sm" radius={4} p="lg" pos="relative">
      <LoadingOverlay visible={isLoading} />
      <Group mb="md">
        <Button
          variant="subtle"
          radius={4}
          leftSection={<IconArrowLeft size={18} />}
          onClick={() => navigate(-1)}
        >
          Quay lại
        </Button>
        <Title order={3}>Thêm mới chứng nhận / chứng chỉ</Title>
      </Group>

      <Stack gap="xs">
        {/* Group chứa các Card */}
        <Group grow align="flex-start" wrap="wrap" gap="lg">
          <Stack gap="xs">
            {/* Card: Tổ chức chứng nhận */}
            <Card withBorder shadow="sm" radius={4} flex={1}>
              <Title order={5} mb="md">
                🏢 Tổ chức chứng nhận
              </Title>
              <Stack gap="sm">
                <Input.Wrapper label="Dấu mộc chứng nhận">
                  <Dropzone
                    onDrop={handleDropLogo}
                    maxSize={5 * 1024 ** 2}
                    radius={4}
                    accept={IMAGE_MIME_TYPE}
                    multiple={false}
                  >
                    <Group
                      justify="center"
                      gap="xl"
                      mih={150}
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
                        <Text size="lg" ta="center">
                          Kéo & thả dấu mộc
                        </Text>
                        <Text size="sm" c="dimmed" ta="center">
                          Tối đa 5MB
                        </Text>
                      </div>
                    </Group>
                  </Dropzone>
                  {form.values.orgLogo && (
                    <Box
                      mt={20}
                      style={{
                        position: "relative",
                        display: "inline-block",
                        width: "fit-content",
                        margin: "0 auto",
                      }}
                    >
                      <Image
                        src={form.values.orgLogo}
                        w={150}
                        h={150}
                        fit="contain"
                        radius="md"
                        style={{ border: "1px solid #eee" }}
                      />
                      <ActionIcon
                        color="red"
                        variant="filled"
                        radius="xl"
                        size="sm"
                        style={{
                          position: "absolute",
                          top: -8,
                          right: -8,
                          zIndex: 10,
                        }}
                        onClick={handleRemoveLogo}
                      >
                        <IconX size={14} />
                      </ActionIcon>
                    </Box>
                  )}
                </Input.Wrapper>
                <Select
                  searchable
                  clearable
                  label="Tên tổ chức cấp"
                  placeholder="Chọn tổ chức"
                  required
                  radius={4}
                  data={[
                    "Tổ chức VietGAP",
                    "Tổ chức Organic Vietnam",
                    "Tổ chức GlobalGAP",
                  ]}
                  {...form.getInputProps("orgName")}
                />
              </Stack>
            </Card>
          </Stack>

          {/* Card: Tiêu chí yêu cầu (Nội dung) */}
          <Card withBorder shadow="sm" radius={4}>
            <Title order={5} mb="md">
              📌 Tiêu chí yêu cầu
            </Title>
            <Stack gap="sm">
              <Radio.Group
                label="Nội dung giấy chứng nhận"
                value={form.values.contentType}
                onChange={(val) => form.setFieldValue("contentType", val)}
              >
                <Group mt="xs">
                  <Radio value="file" label="Tải file PDF" />
                  <Radio value="editor" label="Nhập nội dung" />
                </Group>
              </Radio.Group>

              {form.values.contentType === "file" ? (
                <Stack>
                  <Dropzone
                    onDrop={handleDropContentFile}
                    maxSize={5 * 1024 ** 2}
                    radius={4}
                    h={100}
                    accept={["application/pdf"]}
                    multiple={false}
                  >
                    <Group
                      justify="center"
                      align="center"
                      gap="xl"
                      h="100%"
                      style={{ pointerEvents: "none" }}
                    >
                      <Dropzone.Idle>
                        <IconFileTypePdf
                          size={52}
                          color="var(--mantine-color-dimmed)"
                          stroke={1.5}
                        />
                      </Dropzone.Idle>
                      <Stack gap={0} align="center">
                        <Text size="lg" ta="center">
                          Kéo & thả file PDF
                        </Text>
                        <Text size="sm" c="dimmed">
                          Tối đa 5MB
                        </Text>
                      </Stack>
                    </Group>
                  </Dropzone>
                  {form.values.content && (
                    <Box pos="relative" h={275}>
                      <iframe
                        src={form.values.content}
                        width="100%"
                        height="100%"
                        style={{ border: "1px solid #eee", borderRadius: 4 }}
                        title="PDF Preview"
                      />
                      <ActionIcon
                        color="red"
                        variant="filled"
                        radius="xl"
                        size="md"
                        style={{
                          position: "absolute",
                          top: 10,
                          right: 10,
                          zIndex: 10,
                        }}
                        onClick={handleRemoveContentFile}
                      >
                        <IconTrash size={18} />
                      </ActionIcon>
                    </Box>
                  )}
                </Stack>
              ) : (
                <SunEditor
                  height="180px"
                  setContents={form.values.content}
                  onChange={(content) => form.setFieldValue("content", content)}
                  setOptions={{
                    buttonList: [
                      ["undo", "redo"],
                      ["bold", "italic", "underline"],
                      ["list", "align", "link"],
                      ["table", "codeView"],
                    ],
                  }}
                />
              )}
            </Stack>
          </Card>
        </Group>

        {/* Card: Thông tin chi tiết */}
        <Card withBorder shadow="sm" radius={4} flex={1}>
          <Title order={5} mb="md">
            📄 Thông tin chứng nhận
          </Title>
          <Stack gap="sm">
            <Group grow>
              <TextInput
                label="Mã số chứng nhận"
                withAsterisk
                radius={4}
                {...form.getInputProps("certCode")}
              />
              <TextInput
                label="Tên chứng nhận"
                withAsterisk
                radius={4}
                {...form.getInputProps("certName")}
              />
            </Group>
            <Group grow>
              <DateTimePicker
                radius={4}
                label="Thời gian cấp"
                value={form.values.issueDate}
                onChange={(val) =>
                  //@ts-expect-error no check
                  form.setFieldValue("issueDate", val || new Date())
                }
              />
              <NumberInput
                label="Thời gian hiệu lực (năm)"
                min={1}
                radius={4}
                {...form.getInputProps("validYears")}
              />
            </Group>
            <Textarea
              label="Định nghĩa"
              minRows={3}
              radius={4}
              {...form.getInputProps("definition")}
            />
          </Stack>
        </Card>

        <Group justify="flex-end" mt="md">
          <Button radius={4} onClick={handleFinish} loading={isLoading}>
            Hoàn thành
          </Button>
        </Group>
      </Stack>

      {/* Modal Filter (Giữ nguyên logic UI, chỉ thêm mock action) */}
      <Modal
        title={"Tìm kiếm cây trồng"}
        opened={openedFilter}
        onClose={() => setOpenedFilter(false)}
        size={"lg"}
      >
        <Stack gap={"xs"}>
          <Select
            searchable
            clearable
            label="Nhóm cây trồng"
            radius={4}
            data={[
              "Cây ăn trái",
              "Cây lương thực",
              "Cây công nghiệp",
              "Cây thuốc",
            ]}
          />

          <Stack gap={"xs"}>
            <TextInput
              label="Cây trồng"
              leftSection={<IconSearch size={18} />}
              placeholder="Tìm kiếm cây trồng"
              radius={4}
            />
            <SeedCards selected="" seeds={seedOptions} onSelect={() => {}} />

            <TextInput
              label="Giống cây trồng"
              leftSection={<IconSearch size={18} />}
              placeholder="Tìm kiếm giống cây trồng"
              radius={4}
            />
            <CropCards selected="" plants={cropOptions} onSelect={() => {}} />
          </Stack>

          <Group justify="flex-end">
            <Button
              radius={4}
              onClick={() => {
                // Logic giả định: thêm item vào form.values.targets
                setOpenedFilter(false);
              }}
            >
              Xác nhận
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Card>
  );
}
