import {
  Button,
  Card,
  Group,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import SunEditor from "suneditor-react";
import { useForm } from "@mantine/form";
import { IconArrowLeft } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";

const AreaManagementCultivationMethodAddPage = () => {
  const navigate = useNavigate();
  const form = useForm({
    initialValues: {
      name: "",
      description: "",
    },
  });

  return (
    <Card withBorder shadow="sm" radius={4} p="lg">
      <Group mb={"md"}>
        <Button
          variant="subtle"
          radius={4}
          leftSection={<IconArrowLeft size={18} />}
          onClick={() => navigate(-1)}
        >
          Quay lại
        </Button>
        <Title order={3}>Thêm mới phương pháp canh tác</Title>
      </Group>
      <Stack>
        <TextInput
          label="Tên phương pháp"
          placeholder="VD: Hữu cơ"
          required
          {...form.getInputProps("name")}
          radius={4}
        />
        <Stack gap={"xs"}>
          <Text fz={"sm"} fw={500}>
            Nội dung chi tiết
          </Text>
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
            onChange={(content) => form.setFieldValue("description", content)}
          />
        </Stack>
      </Stack>
      <Group mt={"xs"} justify="flex-end">
        <Button radius={4}>Lưu</Button>
      </Group>
    </Card>
  );
};
export default AreaManagementCultivationMethodAddPage;
