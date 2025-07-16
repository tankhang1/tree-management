import {
  Button,
  Group,
  Stack,
  TextInput,
  Textarea,
  Select,
} from "@mantine/core";
import { useForm } from "@mantine/form";

export type FertilizerFormValues = {
  name: string;
  type: string;
  nutrientContent: string;
  unit: string;
  manufacturer: string;
  description?: string;
};

type Props = {
  onSubmit: (data: FertilizerFormValues) => void;
};

const typeOptions = [
  { value: "Hữu cơ", label: "Hữu cơ" },
  { value: "Vô cơ", label: "Vô cơ" },
  { value: "Vi sinh", label: "Vi sinh" },
];

const unitOptions = [
  { value: "kg", label: "Kilogram (kg)" },
  { value: "bao", label: "Bao" },
  { value: "gói", label: "Gói" },
  { value: "lít", label: "Lít" },
];

const FertilizerCreateForm = ({ onSubmit }: Props) => {
  const form = useForm<FertilizerFormValues>({
    initialValues: {
      name: "",
      type: "",
      nutrientContent: "",
      unit: "",
      manufacturer: "",
      description: "",
    },
    validate: {
      name: (v) => (!v ? "Vui lòng nhập tên phân bón" : null),
      type: (v) => (!v ? "Vui lòng chọn loại phân bón" : null),
      nutrientContent: (v) =>
        !v ? "Vui lòng nhập hàm lượng dinh dưỡng" : null,
      unit: (v) => (!v ? "Vui lòng chọn đơn vị" : null),
      manufacturer: (v) => (!v ? "Vui lòng nhập nhà sản xuất" : null),
    },
  });

  return (
    <form onSubmit={form.onSubmit(onSubmit)}>
      <Stack gap="xs">
        <TextInput
          label="Tên phân bón"
          placeholder="VD: Phân NPK, Phân Urê"
          withAsterisk
          radius={4}
          {...form.getInputProps("name")}
        />

        <Select
          label="Loại phân bón"
          placeholder="Chọn loại"
          data={typeOptions}
          radius={4}
          withAsterisk
          {...form.getInputProps("type")}
        />

        <TextInput
          label="Hàm lượng dinh dưỡng"
          placeholder="VD: NPK 16-16-8, Đạm 46%"
          radius={4}
          withAsterisk
          {...form.getInputProps("nutrientContent")}
        />

        <Select
          label="Đơn vị"
          placeholder="Chọn đơn vị tính"
          data={unitOptions}
          withAsterisk
          radius={4}
          {...form.getInputProps("unit")}
        />

        <Select
          label="Nhà sản xuất"
          placeholder="VD: Công ty Phân bón Miền Nam"
          radius={4}
          withAsterisk
          {...form.getInputProps("manufacturer")}
        />

        <Textarea
          label="Ghi chú"
          placeholder="Mô tả thêm (tuỳ chọn)"
          radius={4}
          minRows={2}
          autosize
          {...form.getInputProps("description")}
        />

        <Group justify="right">
          <Button type="submit" radius={4}>
            Lưu
          </Button>
        </Group>
      </Stack>
    </form>
  );
};

export default FertilizerCreateForm;
