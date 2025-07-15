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
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconArrowLeft, IconFileTypePdf } from "@tabler/icons-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SunEditor from "suneditor-react";
const MachineManagementMainAddPage = () => {
  const navigate = useNavigate();
  const [manualPreviewUrl, setManualPreviewUrl] = useState<string | null>(null);
  const [inspectionPreviewUrl, setInspectionPreviewUrl] = useState<
    string | null
  >(null);

  const [active, setActive] = useState(0);
  const form = useForm({
    initialValues: {
      id: "",
      name: "",
      type: "",
      status: "",
      price: 0,
      quantity: 1,
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
          </Stack>
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

        <Stepper.Step label="Bước 3" description="Tài liệu">
          <Stack>
            <FileInput
              label="Sổ tay hướng dẫn (PDF)"
              placeholder="Sổ tay hướng dẫn (PDF)"
              radius={4}
              accept="application/pdf"
              leftSection={<IconFileTypePdf />}
              value={form.values.manualFile}
              onChange={(file) => {
                //@ts-expect-error no check
                form.setFieldValue("manualFile", file);
                setManualPreviewUrl(file ? URL.createObjectURL(file) : null);
              }}
            />
            {manualPreviewUrl && (
              <>
                <Text size="sm">📘 Xem trước sổ tay:</Text>
                <iframe
                  src={manualPreviewUrl}
                  width="100%"
                  height="600px"
                  style={{ border: "1px solid #ccc", borderRadius: "8px" }}
                />
              </>
            )}
            <FileInput
              label="Biên bản đăng kiểm (PDF)"
              accept="application/pdf"
              placeholder="Biên bản đăng kiểm (PDF)"
              {...form.getInputProps("inspectionFile")}
              leftSection={<IconFileTypePdf />}
              radius={4}
              value={form.values.inspectionFile}
              onChange={(file) => {
                //@ts-expect-error no check
                form.setFieldValue("inspectionFile", file);
                setInspectionPreviewUrl(
                  file ? URL.createObjectURL(file) : null
                );
              }}
            />
            {inspectionPreviewUrl && (
              <>
                <Text size="sm">📄 Xem trước biên bản:</Text>
                <iframe
                  src={inspectionPreviewUrl}
                  width="100%"
                  height="600px"
                  style={{ border: "1px solid #ccc", borderRadius: "8px" }}
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
        {active > 0 && (
          <Button
            radius={4}
            variant="default"
            onClick={prevStep}
            disabled={active === 0}
          >
            Quay lại
          </Button>
        )}
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
