import {
  Autocomplete,
  Button,
  Card,
  Divider,
  Group,
  Radio,
  ScrollAreaAutosize,
  Select,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import SunEditor from "suneditor-react";
import { useForm } from "@mantine/form";
import {
  IconArrowLeft,
  IconPhoto,
  IconSearch,
  IconUpload,
  IconX,
} from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import PlantCategoryCard from "./components/PlantCategoryCard";
import { useState } from "react";
import { Dropzone } from "@mantine/dropzone";
type TPlant = {
  code: string;
  scientificName: string;
  vietnameseName: string;
  eppoCode: string;
  iccCode: string;
  group: string;
};
const plants = [
  {
    code: "CT01",
    scientificName: "Durio zibethinus",
    vietnameseName: "Sầu riêng",
    eppoCode: "DURZI",
    iccCode: "DZ001",
    group: "Cây ăn quả nhiệt đới",
  },
  {
    code: "CT02",
    scientificName: "Mangifera indica",
    vietnameseName: "Xoài",
    eppoCode: "MANIN",
    iccCode: "MI002",
    group: "Cây ăn quả nhiệt đới",
  },
  {
    code: "CT03",
    scientificName: "Musa acuminata",
    vietnameseName: "Chuối",
    eppoCode: "MUSA",
    iccCode: "MA003",
    group: "Cây ăn quả nhiệt đới",
  },
];
const AreaManagementCultivationMethodAddPage = () => {
  const [selectedIds, setSelectedIds] = useState<TPlant[]>([]);
  const navigate = useNavigate();
  const form = useForm({
    initialValues: {
      name: "",
      description: "",
      docType: "file",
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
          <Radio.Group
            label="Nội dung chi tiết"
            value={form.getValues().docType}
            onChange={(val) => form.setFieldValue("docType", val)}
          >
            <Group mt="xs">
              <Radio value="file" label="Tải file PDF" />
              <Radio value="editor" label="Nội dung chi tiết" />
            </Group>
          </Radio.Group>

          {form.getValues().docType === "file" ? (
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
                    Bỏ và thả nội dung chi tiết vào đây
                  </Text>
                  <Text size="sm" c="dimmed" inline mt={7}>
                    Đính kèm nội dung chi tiết (tối đa 5MB)
                  </Text>
                </div>
              </Group>
            </Dropzone>
          ) : (
            <div>
              <label style={{ fontSize: 14, fontWeight: 500 }}>
                Nội dung chi tiết
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
          <Divider label="Loại cây trồng áp dụng" />
          <Group align="flex-start">
            <Stack flex={2}>
              <Group align="flex-end">
                <Select
                  searchable
                  clearable
                  label="Nhóm cây trồng"
                  placeholder="Nhóm cây trồng"
                  radius={4}
                  flex={1}
                  data={[
                    { value: "fruit", label: "Cây ăn trái" },
                    { value: "vegetable", label: "Cây rau" },
                    { value: "herb", label: "Cây thuốc" },
                  ]}
                />
                <Button radius={4}>Thêm mới</Button>
              </Group>
              <Autocomplete
                radius={4}
                leftSection={<IconSearch size={18} />}
                placeholder="Tìm kiếm cây trồng"
              />
              <Group>
                {plants.map((plant) => (
                  <PlantCategoryCard
                    {...plant}
                    isActive={
                      selectedIds.findIndex(
                        (item) => item.code === plant.code
                      ) > -1
                    }
                    onPress={() => {
                      const isDuplicate =
                        selectedIds.findIndex(
                          (item) => item.code === plant.code
                        ) > -1;
                      if (isDuplicate) {
                        const newIds = selectedIds.filter(
                          (item) => item.code !== plant.code
                        );
                        setSelectedIds([...newIds]);
                      } else {
                        setSelectedIds([...selectedIds, plant]);
                      }
                    }}
                  />
                ))}
              </Group>
            </Stack>
            <Card flex={1}>
              <Stack>
                <Text fw={"bold"}>
                  Thông tin cây trồng đã chọn ({selectedIds.length})
                </Text>
                <ScrollAreaAutosize mah={300}>
                  <Stack>
                    {selectedIds.map((plant) => (
                      <PlantCategoryCard {...plant} isShorted={true} />
                    ))}
                  </Stack>
                </ScrollAreaAutosize>
              </Stack>
            </Card>
          </Group>
        </Stack>
      </Stack>
      <Group mt={"xs"} justify="flex-end">
        <Button radius={4}>Lưu</Button>
      </Group>
    </Card>
  );
};
export default AreaManagementCultivationMethodAddPage;
