import {
  Button,
  Group,
  NumberInput,
  Select,
  Stack,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";

const AddSeasonForm = () => {
  const form = useForm({
    initialValues: {
      name: "",
      estimatedDuration: 0,
      cropId: "",
      growthCycleId: "",
    },
    validate: {
      name: (val) => (!val ? "Vui lòng nhập tên mùa vụ" : null),
      estimatedDuration: (val) =>
        val <= 0 ? "Vui lòng nhập thời gian ước tính hợp lệ" : null,
      cropId: (val) => (!val ? "Vui lòng chọn cây trồng" : null),
      growthCycleId: (val) =>
        !val ? "Vui lòng chọn chu kỳ sinh trưởng" : null,
    },
  });
  return (
    <form>
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
          {...form.getInputProps("cropId")}
          radius={4}
        />

        <Select
          label="Chu kỳ sinh trưởng"
          placeholder="Chọn chu kỳ"
          {...form.getInputProps("growthCycleId")}
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
