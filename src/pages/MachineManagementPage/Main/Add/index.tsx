import {
  Button,
  Group,
  Stepper,
  TextInput,
  Select,
  NumberInput,
  FileInput,
  Stack,
  Text,
  Card,
  Title,
  Radio,
  Input,
  Image,
  MultiSelect,
} from "@mantine/core";
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { useForm } from "@mantine/form";
import {
  IconArrowLeft,
  IconFileTypePdf,
  IconPhoto,
  IconUpload,
  IconX,
} from "@tabler/icons-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SunEditor from "suneditor-react";
import { SelectableSupplierCards } from "../../../SupplyManagementPage/Add/components/SelectableSupplierCards";
const MachineManagementMainAddPage = () => {
  const navigate = useNavigate();
  const [manualPreviewUrl, setManualPreviewUrl] = useState<string | null>(null);
  const [inspectionPreviewUrl, setInspectionPreviewUrl] = useState<
    string | null
  >(null);

  const [active, setActive] = useState(0);
  const form = useForm({
    initialValues: {
      id: "M001",
      name: "Máy cày Kubota L5018",
      type: "Máy kéo",
      status: "Hoạt động",
      price: 195000000,
      quantity: 2,
      specs: "",
      fileType: "0",
      manualFile: null,
      inspectionFile: null,
    },
    validate: {
      id: (val) => (!val ? "Vui lòng nhập mã máy" : null),
      name: (val) => (!val ? "Vui lòng nhập tên máy" : null),
      price: (val) => (val <= 0 ? "Giá phải lớn hơn 0" : null),
    },
  });

  const nextStep = () =>
    setActive((current) => (current < 3 ? current + 1 : current));
  const prevStep = () =>
    setActive((current) => (current > 0 ? current - 1 : current));

  const handleSubmit = (values: typeof form.values) => {
    console.log("🛠️ Submitting Machine:", values);
  };

  return (
    <Card shadow="sm" p="lg" radius={4}>
      <Group mb={"md"}>
        <Button
          variant="subtle"
          radius={4}
          leftSection={<IconArrowLeft size={18} />}
          onClick={() => navigate(-1)}
        >
          Quay lại
        </Button>
        <Title order={3}>Thêm mới máy móc</Title>
      </Group>
      <Stepper active={active} onStepClick={setActive}>
        <Stepper.Step label="Bước 1" description="Thông tin">
          <Group grow align="flex-start">
            <Stack gap={"xs"}>
              <TextInput
                label="Mã máy"
                radius={4}
                disabled
                {...form.getInputProps("id")}
                required
              />
              <TextInput
                label="Tên máy móc"
                {...form.getInputProps("name")}
                required
                radius={4}
              />
              <Select
                label="Loại xe"
                data={["Xe tải", "Xe múc", "Máy móc khác", "Xe cày"]}
                {...form.getInputProps("type")}
                radius={4}
                required
              />
              <Select
                label="Tình trạng"
                data={["Đang vận hành", "Đang bảo trì", "Đang trống"]}
                {...form.getInputProps("status")}
                radius={4}
                required
              />
              <Group grow>
                <NumberInput
                  label="Giá"
                  {...form.getInputProps("price")}
                  min={0}
                  hideControls
                  radius={4}
                  thousandSeparator
                />
                <NumberInput
                  label="Số lượng"
                  {...form.getInputProps("quantity")}
                  radius={4}
                  min={1}
                />
              </Group>
              <MultiSelect
                label="Tài sản thuộc nhóm"
                data={["Sử dụng thường xuyên", "Sử dụng mùa hè"]}
                radius={4}
              />
            </Stack>
            <Input.Wrapper label="Ảnh máy móc">
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
                      Bỏ và thả ảnh máy móc tại đây
                    </Text>
                    <Text size="sm" c="dimmed" inline mt={7}>
                      Đính kèm ảnh máy móc (tối đa 5MB)
                    </Text>
                  </div>
                </Group>
              </Dropzone>
            </Input.Wrapper>
          </Group>
        </Stepper.Step>
        <Stepper.Step label="Bước 2" description="Tài liệu kỹ thuật">
          <TextInput
            label="Nhà cung cấp"
            radius={4}
            placeholder="Chọn nhà cung cấp"
            {...form.getInputProps("suppliers")}
          />
          <SelectableSupplierCards isCheckbox={true} />
          <Select label="Đơn vị tính" placeholder="Đơn vị tính" radius={4} />
        </Stepper.Step>

        <Stepper.Step label="Bước 2" description="Chi tiết">
          <Stack gap={"xs"}>
            <Radio.Group
              label="Tài liệu kỹ thuật"
              onChange={(val) => form.setFieldValue(`fileType`, val)}
            >
              <Group mt="xs">
                <Radio value="0" label="Tải file PDF" />
                <Radio value="1" label="Nhập nội dung trực tiếp" />
              </Group>
            </Radio.Group>

            {form.getValues().fileType === "0" ? (
              <FileInput
                label="Tài liệu kỹ thuật (PDF)"
                placeholder="Chọn tài liệu"
                accept="application/pdf"
                leftSection={<IconFileTypePdf size={18} />}
                radius={4}
                {...form.getInputProps("technicalDoc")}
              />
            ) : (
              <Stack>
                <Text style={{ fontSize: 14, fontWeight: 500 }}>
                  Nội dung kỹ thuật
                </Text>
                <SunEditor setOptions={{ height: "200px" }} />
              </Stack>
            )}
          </Stack>
        </Stepper.Step>

        <Stepper.Step label="Bước 3" description="Xác nhận thông tin">
          <Stack>
            <Title order={5}>📄 Thông tin tổng quan</Title>
            <Group grow align="flex-start">
              <Card withBorder radius={4} p="md" style={{ flex: 1 }}>
                <Stack gap={"xs"}>
                  <Text>
                    <b>Mã máy:</b> {form.values.id}
                  </Text>
                  <Text>
                    <b>Tên máy:</b> {form.values.name}
                  </Text>
                  <Text>
                    <b>Loại:</b> {form.values.type}
                  </Text>
                  <Text>
                    <b>Tình trạng:</b> {form.values.status}
                  </Text>
                  <Text>
                    <b>Giá:</b> {form.values.price.toLocaleString()} VNĐ
                  </Text>
                  <Text>
                    <b>Số lượng:</b> {form.values.quantity}
                  </Text>
                </Stack>
              </Card>
              <Stack>
                <Image
                  src="https://goldmax.com.vn/wp-content/uploads/2022/06/398-Cabin-3-600x400.jpg"
                  h={300}
                  fit="contain"
                />
              </Stack>
            </Group>

            <Title order={5} mt="md">
              📘 Tài liệu kỹ thuật
            </Title>
            <Text>
              <b>Loại tài liệu:</b>{" "}
              {form.values.fileType === "0"
                ? "Tải file PDF"
                : "Nội dung trực tiếp"}
            </Text>
            {form.values.fileType === "0" && form.values?.technicalDoc ? (
              <Stack gap={"xs"}>
                <Text>📄 Tệp đã tải lên:</Text>
                <iframe
                  src={URL.createObjectURL(form.values?.technicalDoc || "")}
                  width="100%"
                  height="400px"
                  style={{ border: "1px solid #ccc", borderRadius: 8 }}
                />
              </Stack>
            ) : (
              <Text>
                ✍️ Nội dung kỹ thuật đã nhập (không hiển thị preview ở bước
                này).
              </Text>
            )}

            {form.values.manualFile && (
              <>
                <Title order={5} mt="md">
                  📕 Sổ tay hướng dẫn
                </Title>
                <iframe
                  src={
                    manualPreviewUrl ||
                    URL.createObjectURL(form.values.manualFile)
                  }
                  width="100%"
                  height="400px"
                  style={{ border: "1px solid #ccc", borderRadius: 8 }}
                />
              </>
            )}

            {form.values.inspectionFile && (
              <>
                <Title order={5} mt="md">
                  📑 Biên bản đăng kiểm
                </Title>
                <iframe
                  src={
                    inspectionPreviewUrl ||
                    URL.createObjectURL(form.values.inspectionFile)
                  }
                  width="100%"
                  height="400px"
                  style={{ border: "1px solid #ccc", borderRadius: 8 }}
                />
              </>
            )}
          </Stack>
        </Stepper.Step>

        <Stepper.Completed>
          <Text>✅ Kiểm tra lại thông tin trước khi lưu.</Text>
          <Button onClick={() => handleSubmit(form.values)} mt="md" fullWidth>
            🚀 Tạo máy móc
          </Button>
        </Stepper.Completed>
      </Stepper>

      <Group mt="xl" justify="space-between">
        <Button
          radius={4}
          variant="default"
          onClick={prevStep}
          disabled={active === 0}
        >
          Quay lại
        </Button>

        {active < 3 && (
          <Button radius={4} onClick={nextStep}>
            Tiếp theo
          </Button>
        )}
      </Group>
    </Card>
  );
};

export default MachineManagementMainAddPage;
