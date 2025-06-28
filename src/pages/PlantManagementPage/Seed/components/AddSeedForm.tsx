import {
  Button,
  Group,
  Stack,
  TextInput,
  Textarea,
  FileInput,
  Select,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconFileTypePdf } from "@tabler/icons-react";
const AddSeedForm = () => {
  const form = useForm({
    initialValues: {
      id: "",
      name: "",
      supplier: "",
      origin: "",
      germinationRate: "",
      yield: "",
      note: "",
      technicalDoc: null,
    },
    validate: {
      id: (val) => (!val ? "Vui lòng nhập mã giống" : null),
      name: (val) => (!val ? "Vui lòng nhập tên giống" : null),
    },
  });
  return (
    <form>
      <Stack gap={"xs"}>
        <TextInput
          label="Mã giống cây (hệ thống)"
          placeholder="SR-RI6"
          {...form.getInputProps("id")}
          radius={4}
          disabled
        />
        <TextInput
          label="Tên giống"
          placeholder="Giống Ri6"
          {...form.getInputProps("name")}
          radius={4}
        />
        <Select
          label="Nhà cung cấp"
          placeholder="Công ty giống cây trồng"
          {...form.getInputProps("supplier")}
          radius={4}
        />
        <Select
          label="Xuất xứ (quốc gia)"
          placeholder="Việt Nam"
          {...form.getInputProps("origin")}
          radius={4}
        />
        <TextInput
          label="Tỷ lệ nảy mầm (%)"
          placeholder="85"
          {...form.getInputProps("germinationRate")}
          radius={4}
          type="number"
        />
        <TextInput
          label="Năng suất (tấn/ha)"
          placeholder="25"
          {...form.getInputProps("yield")}
          radius={4}
          type="number"
        />
        <Textarea
          label="Mô tả"
          placeholder="Ghi chú mô tả giống..."
          {...form.getInputProps("note")}
          radius={4}
        />
        <FileInput
          label="Tài liệu kỹ thuật (PDF)"
          placeholder="Chọn tài liệu"
          accept="application/pdf"
          {...form.getInputProps("technicalDoc")}
          leftSection={<IconFileTypePdf />}
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
export default AddSeedForm;
