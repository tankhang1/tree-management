// CẬP NHẬT: Giao diện thêm mới cây trồng
// - Bước 2: chia 2 cột: thông tin cây bên trái, hạt giống bên phải, có hình ảnh
// - Bước 4: thêm nhiều chu kỳ sinh trưởng (n chu kỳ)

import {
  Button,
  Card,
  Group,
  Stack,
  Title,
  TextInput,
  Select,
  Stepper,
  Textarea,
  MultiSelect,
  Text,
  NumberInput,
  Input,
  Radio,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import {
  IconArrowLeft,
  IconPhoto,
  IconSearch,
  IconUpload,
  IconX,
} from "@tabler/icons-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SeedCard from "./components/SeedCard";
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import ConfirmStep from "./components/ConfirmStep";
import { cropOptions } from "../../../AreaManagementPage/Block/Add";
import CropCards from "../../../AreaManagementPage/Region/Add/components/CropCards";
import SeedCards from "../../../AreaManagementPage/Region/Add/components/SeedCards";
import { seedOptions } from "../../../AreaManagementPage/Row/Add";
import SunEditor from "suneditor-react";
import Scrollable from "../../../../components/Scrollable";

const PlantManagementTreeAddPage = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [selectedSeed, setSelectedSeed] = useState<string>("");
  const form = useForm({
    initialValues: {
      id: "",
      name: "",
      type: "",
      note: "",
      seedCode: "",
      seedName: "",
      supplier: "",
      origin: "",
      germinationRate: "",
      uniformRate: "",
      yield: "",
      seedNote: "",
      seedDoc: null,
      seedImage: null as File | null,
      harvestMethod: "",
      growthCycles: [],
      techinicalDocType: "file", // 'file' or 'editor'
      standardDocType: " file", // 'file' or 'editor'
      pestDocType: "file",
    },
  });

  const handleSubmit = () => {
    console.log("🌱 Dữ liệu cây trồng:", form.values);
  };

  return (
    <Card withBorder shadow="md" radius={12} p="xl">
      <Group mb="md">
        <Button
          variant="subtle"
          radius={4}
          leftSection={<IconArrowLeft size={18} />}
          onClick={() => navigate(-1)}
        >
          Quay lại
        </Button>
        <Title order={3}>🌿 Thêm mới cây trồng</Title>
      </Group>
      <Stepper active={activeStep} onStepClick={setActiveStep} mt="xs">
        <Stepper.Step label="Bước 1" description="Thông tin cây" />
        <Stepper.Step label="Bước 2" description="Hạt giống" />
        <Stepper.Step label="Bước 3" description="Hình thức thu hoạch" />
        <Stepper.Step label="Bước 4" description="Chu kỳ sinh trưởng" />
        <Stepper.Step label="Bước 5" description="Tài liệu kĩ thuật" />
        <Stepper.Step label="Bước 6" description="Xác nhận" />
      </Stepper>

      <form onSubmit={form.onSubmit(handleSubmit)}>
        {activeStep === 0 && (
          <Group grow align="flex-start" mt="md" gap="xs">
            <Stack gap={"xs"}>
              <TextInput
                label="Mã cây"
                placeholder="Mã cây"
                required
                {...form.getInputProps("id")}
                radius={4}
              />
              <Select
                searchable
                clearable
                label="Nhóm cây trồng"
                placeholder="Chọn nhóm cây trồng"
                radius={4}
                data={[
                  "Cây ăn trái",
                  "Cây công nghiệp",
                  "Cây lương thực",
                  "Cây thuốc",
                  "Cây cảnh",
                  "Cây lấy gỗ",
                  "Cây lấy dầu",
                  "Cây lấy sợi",
                ]}
              />
              <Text fw={500} fz={15}>
                Loại cây trồng
              </Text>
              <TextInput
                placeholder="Tìm kiếm loại cây"
                radius={4}
                leftSection={<IconSearch size={18} />}
              />
              <CropCards
                isMultiple={false}
                selected=""
                plants={cropOptions}
                onSelect={() => {}}
              />
              <Text fw={500} fz={15}>
                Giống cây trồng
              </Text>
              <TextInput
                leftSection={<IconSearch size={18} />}
                radius={4}
                placeholder="Tìm kiếm giống cây trồng"
              />
              <SeedCards selected="" seeds={seedOptions} onSelect={() => {}} />
            </Stack>

            <Stack gap={"xs"}>
              <Input.Wrapper label="Ảnh cây trồng">
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

              <Textarea
                label="Mô tả"
                {...form.getInputProps("note")}
                radius={4}
              />
            </Stack>
          </Group>
        )}

        {activeStep === 1 && (
          <Stack mt={"md"}>
            <Select
              searchable
              clearable
              label="Hạt giống cây"
              placeholder="Chọn giống cây"
              radius={4}
              data={["SR-RI6", "SR-RI4", "SR-RI3", "SR-RI8", "SR-RI9"]}
            />
            <Scrollable h={450}>
              <Group wrap="nowrap" p="xs">
                <SeedCard
                  backgroundImage="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTdvY2xVFTT9V8jGe2q8pxWWF4QfNWrchFGLQ&s"
                  seedCode="DN-GV01"
                  name="Đậu nành GV01"
                  provider="Viện Nghiên cứu Cây trồng Việt Nam"
                  origin="Việt Nam"
                  germinationRate={90}
                  yield={2.5}
                  description="Giống đậu nành GV01 sinh trưởng tốt, chịu hạn khá, năng suất cao, hạt vàng sáng."
                  onSelect={(code) => setSelectedSeed(code)}
                  isActive={selectedSeed === "DN-GV01"}
                />

                <SeedCard
                  backgroundImage="https://product.hstatic.net/1000075554/product/nanh_giong_mien_phu_minh_tam_goi_450g_f01d969848a444deaf5be7426a42fa95_eeaf90f8fdd648e191f20ea60c5617ed.jpg"
                  seedCode="DN-GV02"
                  name="Đậu nành An Phú"
                  provider="Công ty Giống cây trồng Trung ương"
                  origin="Việt Nam"
                  germinationRate={88}
                  yield={2.3}
                  description="Giống đậu nành An Phú cho hạt to, giàu đạm, phù hợp canh tác đồng bằng sông Cửu Long."
                  onSelect={(code) => setSelectedSeed(code)}
                  isActive={selectedSeed === "DN-GV02"}
                />

                <SeedCard
                  backgroundImage="https://sinhhocchaua.com/wp-content/uploads/2024/08/bap-nep.jpg"
                  seedCode="BP-LVN10"
                  name="Bắp LVN10"
                  provider="Công ty Giống cây trồng Trung ương"
                  origin="Việt Nam"
                  germinationRate={92}
                  yield={9}
                  description="Giống bắp LVN10 sinh trưởng khỏe, kháng sâu bệnh tốt, năng suất ổn định."
                  onSelect={(code) => setSelectedSeed(code)}
                  isActive={selectedSeed === "BP-LVN10"}
                />
              </Group>
            </Scrollable>
          </Stack>
        )}

        {activeStep === 2 && (
          <Stack mt="md" gap="xs">
            <Select
              searchable
              clearable
              label="Đơn vị tính toán khi thu hoạch"
              placeholder="Chọn phương pháp"
              data={["Theo quả", "Kg", "Tấn", "Thùng / Sọt"]}
              required
              {...form.getInputProps("harvestMethod")}
              radius={4}
            />
          </Stack>
        )}

        {activeStep === 3 && (
          <Stack mt="md" gap="xs">
            {/**Drag and drop và theo thứ tự */}
            {form.values.growthCycles.map((cycle, index) => (
              <Card key={index} withBorder radius="md" shadow="xs" p="md">
                <Stack gap="xs">
                  <Select
                    searchable
                    clearable
                    label={"Chu kì sinh trưởng"}
                    data={["Ngắn hạn", "Trung hạn", "Dài hạn"]}
                    radius={4}
                  />
                  <MultiSelect
                    searchable
                    clearable
                    label="Giai đoạn sinh trưởng"
                    data={[
                      "Gieo trồng",
                      "Ra rễ",
                      "Phát triển thân lá",
                      "Ra hoa",
                      "Đậu quả",
                      "Thu hoạch",
                    ]}
                    onChange={(val) =>
                      form.setFieldValue(`growthCycles.${index}.stages`, val)
                    }
                    radius={4}
                  />
                  <NumberInput
                    label="Thời gian diễn ra chu kỳ ( ngày )"
                    placeholder="VD: 180 ngày"
                    radius={4}
                  />
                  <Group justify="right">
                    <Button
                      color="red"
                      variant="light"
                      radius={4}
                      onClick={() => form.removeListItem("growthCycles", index)}
                    >
                      Xoá
                    </Button>
                  </Group>
                </Stack>
              </Card>
            ))}

            <Group justify="right">
              <Button
                radius={4}
                onClick={() =>
                  form.insertListItem("growthCycles", {
                    id: crypto.randomUUID(),
                    name: "",
                    stages: [],
                    estimatedTime: "",
                  })
                }
              >
                + Thêm chu kỳ
              </Button>
            </Group>
          </Stack>
        )}
        {activeStep === 4 && (
          <Stack gap="xs" mt={"md"}>
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
                      [
                        "table",
                        "link",
                        "image",
                        "video",
                        "audio" /** ,'math' */,
                      ], // You must add the 'katex' library at options to use the 'math' plugin.
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
                      [
                        "table",
                        "link",
                        "image",
                        "video",
                        "audio" /** ,'math' */,
                      ], // You must add the 'katex' library at options to use the 'math' plugin.
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
                      Đính kèm nội dung giải pháp phòng trừ sâu bệnh (tối đa
                      5MB)
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
                      [
                        "table",
                        "link",
                        "image",
                        "video",
                        "audio" /** ,'math' */,
                      ], // You must add the 'katex' library at options to use the 'math' plugin.
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
          </Stack>
        )}
        {activeStep === 5 && <ConfirmStep />}

        <Group justify="space-between" mt="xl">
          <Button
            variant="default"
            disabled={activeStep === 0}
            onClick={() => setActiveStep((p) => p - 1)}
            radius={4}
          >
            Quay lại
          </Button>
          {activeStep < 5 ? (
            <Button onClick={() => setActiveStep((p) => p + 1)} radius={4}>
              Tiếp theo
            </Button>
          ) : (
            <Button type="submit" color="green" radius={4}>
              Lưu
            </Button>
          )}
        </Group>
      </form>
    </Card>
  );
};

export default PlantManagementTreeAddPage;
