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
  FileInput,
  MultiSelect,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconArrowLeft, IconFileTypePdf } from "@tabler/icons-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const PlantManagementTreeAddPage = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);

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
      yield: "",
      seedNote: "",
      seedDoc: null,
      harvestMethod: "",
      growthCycle: "",
      growthStages: [],
      growthTime: "",
      growthNote: "",
    },
  });

  const handleSubmit = () => {
    console.log("🌱 Dữ liệu cây trồng:", form.values);
  };

  return (
    <Card withBorder shadow="md" radius={12} p="xl">
      <Group mb={"md"}>
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
        <Stepper.Step label="Thông tin cây" />
        <Stepper.Step label="Hạt giống" />
        <Stepper.Step label="Hình thức thu hoạch" />
        <Stepper.Step label="Chu kỳ sinh trưởng" />
      </Stepper>

      <form onSubmit={form.onSubmit(handleSubmit)}>
        {activeStep === 0 && (
          <Stack mt="md" gap={"xs"}>
            <TextInput
              label="Mã cây"
              placeholder="Mã cây"
              required
              {...form.getInputProps("id")}
              radius={4}
            />
            <TextInput
              label="Tên cây"
              placeholder="Tên cây trồng"
              required
              {...form.getInputProps("name")}
              radius={4}
            />
            <Select
              label="Loại cây"
              placeholder="Chọn loại cây"
              data={["Cây ăn trái", "Cây công nghiệp", "Cây rau màu", "Khác"]}
              required
              {...form.getInputProps("type")}
              radius={4}
            />
            <Textarea
              label="Mô tả"
              {...form.getInputProps("note")}
              radius={4}
            />
          </Stack>
        )}

        {activeStep === 1 && (
          <Stack mt="md" gap={"xs"}>
            <TextInput
              label="Mã giống cây (hệ thống)"
              placeholder="Mã giống cây (hệ thống)"
              required
              disabled
              {...form.getInputProps("seedCode")}
              radius={4}
            />
            <TextInput
              label="Tên giống"
              placeholder="Tên giống"
              required
              {...form.getInputProps("seedName")}
              radius={4}
            />
            <Select
              label="Nhà cung cấp"
              placeholder="Nhà cung cấp"
              {...form.getInputProps("supplier")}
              radius={4}
            />
            <Select
              label="Xuất xứ (quốc gia)"
              placeholder="Xuất xứ (quốc gia)"
              {...form.getInputProps("origin")}
              radius={4}
            />
            <TextInput
              label="Tỷ lệ nảy mầm (%)"
              radius={4}
              placeholder="VD: 30"
              type="number"
              min={0}
              {...form.getInputProps("germinationRate")}
            />
            <TextInput
              label="Năng suất (tấn/ha)"
              {...form.getInputProps("yield")}
              radius={4}
              placeholder="VD: 30"
              type="number"
            />
            <Textarea
              label="Mô tả"
              {...form.getInputProps("seedNote")}
              radius={4}
            />
            <FileInput
              label="Tài liệu kỹ thuật (PDF)"
              accept="application/pdf"
              {...form.getInputProps("seedDoc")}
              radius={4}
              leftSection={<IconFileTypePdf />}
            />
          </Stack>
        )}

        {activeStep === 2 && (
          <Stack mt="md" gap={"xs"}>
            <Select
              label="Hình thức thu hoạch"
              placeholder="Chọn phương pháp"
              data={["Theo quả", "Kg", "Tấn", "Thùng / Sọt"]}
              required
              {...form.getInputProps("harvestMethod")}
              radius={4}
            />
          </Stack>
        )}

        {activeStep === 3 && (
          <Stack mt="md" gap={"xs"}>
            <Select
              label="Chu kỳ sinh trưởng"
              placeholder="Chọn chu kỳ"
              data={[
                "Chu kỳ ngắn (9-12 tháng)",
                "Chu kỳ trung bình (3-5 năm)",
                "Chu kỳ dài (5-7 năm)",
              ]}
              required
              {...form.getInputProps("growthCycle")}
              radius={4}
            />
            <MultiSelect
              label="Giai đoạn sinh trưởng"
              placeholder="Chọn các giai đoạn"
              data={[
                "Gieo trồng",
                "Ra rễ",
                "Phát triển thân lá",
                "Ra hoa",
                "Đậu quả",
                "Thu hoạch",
              ]}
              {...form.getInputProps("growthStages")}
              radius={4}
            />
            <TextInput
              label="Thời gian (ngày)"
              placeholder="VD: 180 ngày"
              {...form.getInputProps("growthTime")}
              radius={4}
            />
            <Textarea
              label="Điều kiện đặc thù"
              placeholder="Mô tả các điều kiện môi trường, phân bón, nước..."
              {...form.getInputProps("growthNote")}
              radius={4}
            />
          </Stack>
        )}

        <Group justify="space-between" mt="xl">
          <Button
            variant="default"
            disabled={activeStep === 0}
            onClick={() => setActiveStep((prev) => prev - 1)}
            radius={4}
          >
            Quay lại
          </Button>
          {activeStep < 3 ? (
            <Button
              onClick={() => setActiveStep((prev) => prev + 1)}
              radius={4}
            >
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
