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
  Divider,
  Badge,
} from "@mantine/core";
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { useForm } from "@mantine/form";
import {
  IconArrowLeft,
  IconFileTypePdf,
  IconPhoto,
  IconPlus,
  IconUpload,
  IconX,
} from "@tabler/icons-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SunEditor from "suneditor-react";
import { SelectableSupplierCards } from "../../../SupplyManagementPage/Add/components/SelectableSupplierCards";
const s = {
  id: "sup-1",
  name: "Công ty TNHH Nông Nghiệp Xanh",
  type: "Doanh nghiệp",
  representative: "Nguyễn Văn A",
  phone: "0912345678",
  email: "contact@nongnghiepxanh.vn",
  address: "123 Đường Lê Lợi, Quận 1, TP.HCM",
  taxCode: "0312345678",
  sectors: ["Phân bón", "Thuốc BVTV"],
  note: "Đối tác lâu năm",
};
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
          <Stack gap={"xs"}>
            <Radio.Group
              label="Tài liệu kỹ thuật"
              onChange={(val) => form.setFieldValue(`fileType`, val)}
            >
              <Group mt="xs">
                <Radio value="0" label="Tải file PDF" />
                <Radio value="1" label="Tài liệu kỹ thuật" />
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
                  Tài liệu kỹ thuật
                </Text>
                <SunEditor setOptions={{ height: "200px" }} />
              </Stack>
            )}
          </Stack>
        </Stepper.Step>

        <Stepper.Step label="Bước 3" description="Nhà cung cấp">
          <Stack gap={"xs"}>
            <Card withBorder radius={4} p="md">
              <Stack gap={"xs"}>
                <TextInput
                  label="Nhà cung cấp"
                  radius={4}
                  placeholder="Chọn nhà cung cấp"
                  {...form.getInputProps("suppliers")}
                />
                <SelectableSupplierCards isCheckbox={false} />
                <Group grow>
                  <NumberInput
                    label="Đơn giá"
                    placeholder="Giá tiền"
                    radius={4}
                  />
                  <NumberInput
                    label="Số lượng"
                    placeholder="Số lượng"
                    radius={4}
                  />
                  <Select label="Đơn vị" placeholder="Đơn vị" radius={4} />
                </Group>
              </Stack>
            </Card>
            <Button
              radius={4}
              variant="outline"
              leftSection={<IconPlus size={18} />}
            >
              Thêm mới
            </Button>
          </Stack>
        </Stepper.Step>

        <Stepper.Step label="Bước 4" description="Xác nhận thông tin">
          <Stack>
            <Title order={5}>📄 Thông tin tổng quan</Title>
            <Group grow align="flex-start">
              <Card h={300} withBorder radius={4} p="md" style={{ flex: 1 }}>
                <Stack gap={"xs"}>
                  <Title order={4}>Thông tin cơ bản</Title>
                  <Text>
                    <b>Mã máy:</b> {form.values.id}
                  </Text>
                  <Text>
                    <b>Tên máy:</b> {form.values.name}
                  </Text>
                  <Text>
                    <b>Loại:</b> {form.values.type}
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
            <Divider label="Nhà cung cấp" />
            <Group>
              <Card key={s.id} withBorder radius="md" p="md">
                <Group justify="space-between" mb="xs">
                  <Text fw={600}>{s.name}</Text>
                </Group>
                <Stack gap={2}>
                  <Text size="sm">
                    <strong>Loại:</strong> {s.type}
                  </Text>
                  <Text size="sm">
                    <strong>Người đại diện:</strong> {s.representative}
                  </Text>
                  <Text size="sm">
                    <strong>SĐT:</strong> {s.phone}
                  </Text>
                  <Text size="sm">
                    <strong>Đơn giá:</strong> 122.000.000 VNĐ
                  </Text>
                  <Text size="sm">
                    <strong>Số lượng:</strong> 12
                  </Text>
                  <Text size="sm">
                    <strong>Đơn vị:</strong> chiếc
                  </Text>
                  {s.email && (
                    <Text size="sm">
                      <strong>Email:</strong> {s.email}
                    </Text>
                  )}

                  {s.note && (
                    <Text size="sm" c="dimmed">
                      💬 {s.note}
                    </Text>
                  )}
                </Stack>
              </Card>
              <Card key={s.id} withBorder radius="md" p="md">
                <Group justify="space-between" mb="xs">
                  <Text fw={600}>{s.name}</Text>
                </Group>
                <Stack gap={2}>
                  <Text size="sm">
                    <strong>Loại:</strong> {s.type}
                  </Text>
                  <Text size="sm">
                    <strong>Người đại diện:</strong> {s.representative}
                  </Text>
                  <Text size="sm">
                    <strong>SĐT:</strong> {s.phone}
                  </Text>
                  <Text size="sm">
                    <strong>Đơn giá:</strong> 122.000.000 VNĐ
                  </Text>
                  <Text size="sm">
                    <strong>Số lượng:</strong> 12
                  </Text>
                  <Text size="sm">
                    <strong>Đơn vị:</strong> chiếc
                  </Text>
                  {s.email && (
                    <Text size="sm">
                      <strong>Email:</strong> {s.email}
                    </Text>
                  )}

                  {s.note && (
                    <Text size="sm" c="dimmed">
                      💬 {s.note}
                    </Text>
                  )}
                </Stack>
              </Card>
            </Group>
            <Divider label="Tài liệu kỹ thuật" />
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
