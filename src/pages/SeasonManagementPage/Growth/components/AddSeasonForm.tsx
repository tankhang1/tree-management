import {
  Button,
  Group,
  NumberInput,
  Select,
  Stack,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";

// 🔁 Giả lập dữ liệu mẫu (nên thay bằng fetch API)
const cropOptions = [
  { value: "crop1", label: "Sầu riêng Ri6" },
  { value: "crop2", label: "Xoài Cát Chu" },
];

const growthCycleOptions = [
  { value: "cycle1", label: "Chu kỳ sinh trưởng A" },
  { value: "cycle2", label: "Chu kỳ sinh trưởng B" },
];

const growthStageOptions = [
  { value: "stage1", label: "Gieo trồng" },
  { value: "stage2", label: "Nảy mầm" },
  { value: "stage3", label: "Phát triển thân lá" },
  { value: "stage4", label: "Ra hoa" },
  { value: "stage5", label: "Kết trái" },
  { value: "stage6", label: "Thu hoạch" },
];

const AddSeasonForm = () => {
  const form = useForm({
    initialValues: {
      name: "",
      estimatedDuration: 0,
      cropId: "",
      growthCycleIds: [],
      growthStageIds: [],
    },
    validate: {
      name: (val) => (!val ? "Vui lòng nhập tên mùa vụ" : null),
      estimatedDuration: (val) =>
        val <= 0 ? "Vui lòng nhập thời gian ước tính hợp lệ" : null,
      cropId: (val) => (!val ? "Vui lòng chọn cây trồng" : null),
      growthCycleIds: (val) =>
        val.length === 0 ? "Vui lòng chọn ít nhất 1 chu kỳ" : null,
      growthStageIds: (val) =>
        val.length === 0 ? "Vui lòng chọn ít nhất 1 giai đoạn" : null,
    },
  });

  const handleSubmit = (values: typeof form.values) => {
    console.log("Dữ liệu gửi đi:", values);
    // Gọi API ở đây nếu cần
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack>
        <TextInput
          label="Tên mùa vụ"
          placeholder="Mùa vụ Hè 2025"
          {...form.getInputProps("name")}
          radius={4}
        />

        <NumberInput
          label="Thời gian ước tính (ngày)"
          placeholder="120"
          {...form.getInputProps("estimatedDuration")}
          min={1}
          radius={4}
        />

        <Select
          label="Cây trồng"
          placeholder="Chọn cây trồng"
          data={cropOptions}
          {...form.getInputProps("cropId")}
          radius={4}
        />

        <Select
          label="Chu kỳ sinh trưởng liên quan"
          placeholder="Chọn một hoặc nhiều chu kỳ"
          data={growthCycleOptions}
          multiple
          {...form.getInputProps("growthCycleIds")}
          radius={4}
        />

        <Select
          label="Giai đoạn sinh trưởng tương ứng"
          placeholder="Chọn một hoặc nhiều giai đoạn"
          data={growthStageOptions}
          multiple
          {...form.getInputProps("growthStageIds")}
          radius={4}
        />

        <Group justify="end">
          <Button type="submit" radius={4}>
            Tạo mới
          </Button>
        </Group>
      </Stack>
    </form>
  );
};

export default AddSeasonForm;
