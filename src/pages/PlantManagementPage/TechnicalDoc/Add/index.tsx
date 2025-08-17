import {
  Button,
  Group,
  Stack,
  Title,
  Text,
  Card,
  Select,
  Input,
  Radio,
} from "@mantine/core";
import { Dropzone } from "@mantine/dropzone";
import { useForm } from "@mantine/form";
import {
  IconArrowLeft,
  IconPhoto,
  IconUpload,
  IconX,
} from "@tabler/icons-react";
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
      techinicalDocType: "file", // or "editor"
      standardDocType: "file", // or "editor"
      pestDocType: "file", // or "editor"
    },
  });

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
            searchable
            clearable
            label="Mã mẫu cây"
            placeholder="TMP-01"
            radius={4}
            data={["TMP-01", "TMP-02", "TMP-03"]}
            {...form.getInputProps("templateCode")}
          />

          <Input.Wrapper label="Hình ảnh minh hoạ">
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
                    Bỏ và thả ảnh minh hoạ tại đây
                  </Text>
                  <Text size="sm" c="dimmed" inline mt={7}>
                    Đính kèm ảnh minh hoạ (tối đa 5MB)
                  </Text>
                </div>
              </Group>
            </Dropzone>
          </Input.Wrapper>

          <Radio.Group
            label="Kỹ thuật canh tác"
            value={form.getValues().techinicalDocType}
            onChange={(val) => form.setFieldValue("techinicalDocType", val)}
          >
            <Group mt="xs">
              <Radio value="file" label="Tải file PDF" />
              <Radio value="editor" label="Kỹ thuật canh tác" />
            </Group>
          </Radio.Group>

          {form.getValues().techinicalDocType === "file" ? (
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
                    Bỏ và thả nội dung kỹ thuật canh tác
                  </Text>
                  <Text size="sm" c="dimmed" inline mt={7}>
                    Đính kèm nội dung kỹ thuật canh tác (tối đa 5MB)
                  </Text>
                </div>
              </Group>
            </Dropzone>
          ) : (
            <div>
              <label style={{ fontSize: 14, fontWeight: 500 }}>
                Kỹ thuật canh tác
              </label>
              <SunEditor
                setOptions={{
                  height: "200px",
                  buttonList: [
                    ["undo", "redo"],
                    ["font", "fontSize", "formatBlock"],
                    ["paragraphStyle", "blockquote"],
                    [
                      "bold",
                      "underline",
                      "italic",
                      "strike",
                      "subscript",
                      "superscript",
                    ],
                    ["fontColor", "hiliteColor", "textStyle"],
                    ["removeFormat"],
                    "/", // Line break
                    ["outdent", "indent"],
                    ["align", "horizontalRule", "list", "lineHeight"],
                    ["table", "link", "image", "video", "audio" /** ,'math' */], // You must add the 'katex' library at options to use the 'math' plugin.
                    /** ['imageGallery'] */ // You must add the "imageGalleryUrl".
                    ["fullScreen", "showBlocks", "codeView"],
                    ["preview", "print"],
                    ["save", "template"],
                    /** ['dir', 'dir_ltr', 'dir_rtl'] */ // "dir": Toggle text direction, "dir_ltr": Right to Left, "dir_rtl": Left to Right
                  ],
                }}
              />
            </div>
          )}
          <Radio.Group
            label="Tiêu chuẩn chất lượng"
            value={form.getValues().standardDocType}
            onChange={(val) => form.setFieldValue("standardDocType", val)}
          >
            <Group mt="xs">
              <Radio value="file" label="Tải file PDF" />
              <Radio value="editor" label="Tiêu chuẩn chất lượng" />
            </Group>
          </Radio.Group>

          {form.getValues().standardDocType === "file" ? (
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
                    Bỏ và thả nội dung tiêu chuẩn chất lượng
                  </Text>
                  <Text size="sm" c="dimmed" inline mt={7}>
                    Đính kèm nội dung tiêu chuẩn chất lượng (tối đa 5MB)
                  </Text>
                </div>
              </Group>
            </Dropzone>
          ) : (
            <div>
              <label style={{ fontSize: 14, fontWeight: 500 }}>
                Tiêu chuẩn chất lượng
              </label>
              <SunEditor
                setOptions={{
                  height: "200px",
                  buttonList: [
                    ["undo", "redo"],
                    ["font", "fontSize", "formatBlock"],
                    ["paragraphStyle", "blockquote"],
                    [
                      "bold",
                      "underline",
                      "italic",
                      "strike",
                      "subscript",
                      "superscript",
                    ],
                    ["fontColor", "hiliteColor", "textStyle"],
                    ["removeFormat"],
                    "/", // Line break
                    ["outdent", "indent"],
                    ["align", "horizontalRule", "list", "lineHeight"],
                    ["table", "link", "image", "video", "audio" /** ,'math' */], // You must add the 'katex' library at options to use the 'math' plugin.
                    /** ['imageGallery'] */ // You must add the "imageGalleryUrl".
                    ["fullScreen", "showBlocks", "codeView"],
                    ["preview", "print"],
                    ["save", "template"],
                    /** ['dir', 'dir_ltr', 'dir_rtl'] */ // "dir": Toggle text direction, "dir_ltr": Right to Left, "dir_rtl": Left to Right
                  ],
                }}
              />
            </div>
          )}
          <Radio.Group
            label="Giải pháp phòng trừ sâu bệnh"
            value={form.getValues().pestDocType}
            onChange={(val) => form.setFieldValue("pestDocType", val)}
          >
            <Group mt="xs">
              <Radio value="file" label="Tải file PDF" />
              <Radio value="editor" label="Giải pháp phòng trừ sâu bệnh" />
            </Group>
          </Radio.Group>

          {form.getValues().pestDocType === "file" ? (
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
                    Bỏ và thả nội dung giải pháp phòng trừ sâu bệnh
                  </Text>
                  <Text size="sm" c="dimmed" inline mt={7}>
                    Đính kèm nội dung giải pháp phòng trừ sâu bệnh (tối đa 5MB)
                  </Text>
                </div>
              </Group>
            </Dropzone>
          ) : (
            <div>
              <label style={{ fontSize: 14, fontWeight: 500 }}>
                Giải pháp phòng trừ sâu bệnh
              </label>
              <SunEditor
                setOptions={{
                  height: "200px",
                  buttonList: [
                    ["undo", "redo"],
                    ["font", "fontSize", "formatBlock"],
                    ["paragraphStyle", "blockquote"],
                    [
                      "bold",
                      "underline",
                      "italic",
                      "strike",
                      "subscript",
                      "superscript",
                    ],
                    ["fontColor", "hiliteColor", "textStyle"],
                    ["removeFormat"],
                    "/", // Line break
                    ["outdent", "indent"],
                    ["align", "horizontalRule", "list", "lineHeight"],
                    ["table", "link", "image", "video", "audio" /** ,'math' */], // You must add the 'katex' library at options to use the 'math' plugin.
                    /** ['imageGallery'] */ // You must add the "imageGalleryUrl".
                    ["fullScreen", "showBlocks", "codeView"],
                    ["preview", "print"],
                    ["save", "template"],
                    /** ['dir', 'dir_ltr', 'dir_rtl'] */ // "dir": Toggle text direction, "dir_ltr": Right to Left, "dir_rtl": Left to Right
                  ],
                }}
              />
            </div>
          )}

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
