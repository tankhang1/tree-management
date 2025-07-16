import { Button, Group, Stack, TextInput, Textarea } from "@mantine/core";
import { useForm } from "@mantine/form";

type FertilizerFormValues = {
  name: string;
  nutrientContent: string;
  unit: string;
  description?: string;
};

type Props = {
  onSubmit: (data: FertilizerFormValues) => void;
};

const AddFertilizerForm = ({ onSubmit }: Props) => {
  const form = useForm<FertilizerFormValues>({
    initialValues: {
      name: "",
      nutrientContent: "",
      unit: "",
      description: "",
    },
    validate: {
      name: (value) =>
        value.trim() === "" ? "Vui lòng nhập tên phân bón" : null,
      nutrientContent: (value) =>
        value.trim() === "" ? "Vui lòng nhập hàm lượng dinh dưỡng" : null,
      unit: (value) => (value === "" ? "Vui lòng chọn đơn vị" : null),
    },
  });

  return (
    <form onSubmit={form.onSubmit(onSubmit)}>
      <Stack gap="xs">
        <TextInput
          radius={4}
          label="Tên phân bón"
          placeholder="VD: Phân NPK, Urê, Hữu cơ"
          withAsterisk
          {...form.getInputProps("name")}
        />

        <TextInput
          radius={4}
          label="Hàm lượng dinh dưỡng"
          placeholder="VD: NPK 16-16-8, Đạm 46%"
          withAsterisk
          {...form.getInputProps("nutrientContent")}
        />

        <Textarea
          radius={4}
          label="Ghi chú"
          placeholder="Thông tin mô tả thêm (tuỳ chọn)"
          autosize
          minRows={2}
          {...form.getInputProps("description")}
        />

        <Group justify="right">
          <Button radius={4}>Lưu</Button>
        </Group>
      </Stack>
    </form>
  );
};

export default AddFertilizerForm;
