import {
  Stepper,
  Group,
  Button,
  TextInput,
  NumberInput,
  Textarea,
  Select,
  FileInput,
  Stack,
  Image,
  Radio,
  Text,
  Title,
  Card,
  SegmentedControl,
  Input,
} from "@mantine/core";
import { useState } from "react";
import {
  IconFileUpload,
  IconUpload,
  IconX,
  IconPhoto,
  IconArrowLeft,
  IconSearch,
} from "@tabler/icons-react";
import { Dropzone } from "@mantine/dropzone";
import SunEditor from "suneditor-react";
import { useNavigate } from "react-router-dom";
import { cropOptions } from "../../AreaManagementPage/Row/Add";
import CropCards from "../../SeasonManagementPage/Growth/Add/components/CropCards";

const CertificateAddPage = () => {
  const navigate = useNavigate();
  const [active, setActive] = useState(0);
  const [logo, setLogo] = useState<File | null>(null);
  const [fileType, setFileType] = useState<"file" | "editor">("file");

  const nextStep = () => setActive((cur) => (cur < 3 ? cur + 1 : cur));
  const prevStep = () => setActive((cur) => (cur > 0 ? cur - 1 : cur));

  return (
    <Card withBorder shadow="sm" radius={4} p="lg">
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
      <Stack>
        <Stepper active={active} onStepClick={setActive}>
          {/* Step 1: Tổ chức chứng nhận */}
          <Stepper.Step label="Bước 1" description="Tổ chức chứng nhận">
            <Stack gap={"xs"}>
              <FileInput
                radius={4}
                label="Logo chứng nhận"
                leftSection={<IconFileUpload size={18} />}
                placeholder="Chọn file logo..."
                value={logo}
                clearable
                onChange={setLogo}
              />
              {logo && (
                <Image
                  src={URL.createObjectURL(logo)}
                  alt="Logo preview"
                  w={100}
                  radius={4}
                />
              )}
              <TextInput
                label="Tên tổ chức cấp"
                placeholder="Ví dụ: Tổ chức VietGAP"
                defaultValue="Tổ chức VietGAP"
                required
                radius={4}
              />
              <TextInput
                label="Mã số chứng nhận"
                placeholder="Số hiệu, ký hiệu..."
                defaultValue="GCN-VG-2025-001"
                radius={4}
              />
              <TextInput
                label="Tên chứng nhận"
                placeholder="Ví dụ: VietGAP"
                defaultValue="Chứng nhận VietGAP"
                required
                radius={4}
              />
              <TextInput
                label="Thời gian cấp"
                placeholder="dd/mm/yyyy"
                defaultValue="01/08/2025"
                radius={4}
              />
              <NumberInput
                label="Thời gian hiệu lực (năm)"
                placeholder="Ví dụ: 3"
                defaultValue={3}
                min={1}
                radius={4}
              />
            </Stack>
          </Stepper.Step>

          {/* Step 2: Thông tin chứng nhận */}
          <Stepper.Step label="Bước 2" description="Thông tin chứng nhận">
            <Stack gap={"xs"}>
              <Textarea
                label="Định nghĩa"
                placeholder="Nhập định nghĩa..."
                defaultValue="VietGAP là tiêu chuẩn sản xuất nông nghiệp tốt..."
                minRows={3}
                radius={4}
              />

              <Input.Wrapper label="Phạm vi áp dụng">
                <Group w={"100%"}>
                  <SegmentedControl
                    radius={4}
                    data={[
                      { value: "trong-trot", label: "Trồng trọt" },
                      { value: "chan-nuoi", label: "Chăn nuôi" },
                    ]}
                    value="trong-trot"
                  />
                </Group>
              </Input.Wrapper>

              {/* Nếu Trồng trọt */}
              <Stack gap={"xs"}>
                <Select
                  label="Nhóm cây trồng"
                  data={[
                    "Cây ăn trái",
                    "Cây lương thực",
                    "Cây công nghiệp",
                    "Cây thuốc",
                  ]}
                  radius={4}
                />
                <TextInput
                  label="Cây trồng"
                  leftSection={<IconSearch size={18} />}
                  radius={4}
                  placeholder="Tìm kiếm cây trồng"
                />
                <CropCards
                  selected=""
                  plants={cropOptions}
                  onSelect={() => {}}
                />
              </Stack>

              {/* Nếu Chăn nuôi */}
            </Stack>
          </Stepper.Step>

          {/* Step 3: Tiêu chí yêu cầu */}
          <Stepper.Step label="Bước 3" description="Tiêu chí yêu cầu">
            <Stack gap={"xs"}>
              <Radio.Group
                label="Nội dung giấy chứng nhận"
                value={fileType}
                onChange={(val) => setFileType(val as "file" | "editor")}
              >
                <Group mt="xs">
                  <Radio value="file" label="Tải file PDF" />
                  <Radio value="editor" label="Nội dung giấy chứng nhận" />
                </Group>
              </Radio.Group>

              {fileType === "file" ? (
                <Dropzone
                  onDrop={(files) => console.log("accepted files", files)}
                  onReject={(files) => console.log("rejected files", files)}
                  maxSize={5 * 1024 ** 2}
                  radius={4}
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
                        Bỏ và thả nội dung giấy chứng nhận tại đây
                      </Text>
                      <Text size="sm" c="dimmed" inline mt={7}>
                        Đính kèm nội dung giấy chứng nhận (tối đa 5MB)
                      </Text>
                    </div>
                  </Group>
                </Dropzone>
              ) : (
                <div>
                  <label style={{ fontSize: 14, fontWeight: 500 }}>
                    Nội dung giấy chứng nhận
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
          </Stepper.Step>

          <Stepper.Completed>
            <Stack align="center" justify="center" mt="xl">
              <Image
                src={
                  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQjPNbBpZeXnXfTuA6AWek-Kj8NYEVbYdG6ayi5bIWarDuryXDrILdKMTd597quLD0PBKM&usqp=CAU"
                }
                w={200}
                fit="cover"
              />
              <Text fz={"h2"} ta="center">
                Thêm giấy chứng nhận mới thành công!
              </Text>
              <Text fz={"md"} ta="center" c="dimmed">
                Bạn có thể xem lại thông tin chứng nhận trong danh sách quản lý
                chứng nhận.
              </Text>

              <Button size="md" mt="md" radius={4} onClick={() => navigate(-1)}>
                Xác nhận
              </Button>
            </Stack>
          </Stepper.Completed>
        </Stepper>
        {active !== 3 && (
          <Group justify="space-between" mt="md">
            <Button radius={4} variant="default" onClick={prevStep}>
              Quay lại
            </Button>

            <Button radius={4} onClick={nextStep}>
              {active === 2 ? "Hoàn thành" : "Tiếp tục"}
            </Button>
          </Group>
        )}
      </Stack>
    </Card>
  );
};

export default CertificateAddPage;
