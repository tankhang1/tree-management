import {
  Button,
  Group,
  Stack,
  TextInput,
  Textarea,
  LoadingOverlay,
  Select,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useEffect } from "react";
import { notifications } from "@mantine/notifications";
import {
  useFertilizerTypeStore,
  type FertilizerType,
} from "../../../zustand/fertilizerTypeStore";

type Props = {
  editId?: string | null;
  onClose: () => void;
};

// Danh sách đơn vị tính phổ biến
const UNIT_OPTIONS = [
  "kg",
  "bao",
  "lít",
  "chai",
  "gói",
  "can",
  "tấn",
  "tạ",
  "viên",
];

const AddFertilizerForm = ({ editId, onClose }: Props) => {
  const { addType, updateType, getTypeById, isLoading } =
    useFertilizerTypeStore();

  const form = useForm({
    initialValues: {
      id: "",
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
      unit: (value) => (!value ? "Vui lòng chọn đơn vị tính" : null),
    },
  });

  // Load dữ liệu khi sửa
  useEffect(() => {
    if (editId) {
      const data = getTypeById(editId);
      if (data) {
        form.setValues({
          id: data.id,
          name: data.name,
          nutrientContent: data.nutrientContent,
          unit: data.unit,
          description: data.description || "",
        });
      }
    }
  }, [editId]);

  const handleSubmit = async (values: typeof form.values) => {
    let success = false;

    // Cast về kiểu FertilizerType
    const payload = values as FertilizerType;

    if (editId) {
      success = await updateType(editId, payload);
    } else {
      success = await addType(payload);
    }

    if (success) {
      notifications.show({
        title: "Thành công",
        message: editId ? "Cập nhật thành công" : "Thêm mới thành công",
        color: "green",
      });
      onClose();
    } else {
      notifications.show({
        title: "Lỗi",
        message: "Có lỗi xảy ra",
        color: "red",
      });
    }
  };

  return (
    <form
      onSubmit={form.onSubmit(handleSubmit)}
      style={{ position: "relative" }}
    >
      <LoadingOverlay visible={isLoading} />
      <Stack gap="xs">
        {/* Field ID ẩn hoặc ReadOnly nếu muốn hiển thị */}
        {editId && (
          <TextInput
            label="Mã loại"
            value={form.values.id}
            disabled
            radius={4}
          />
        )}

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

        {/* Đã thay thế TextInput bằng Select */}
        <Select
          radius={4}
          label="Đơn vị tính"
          placeholder="Chọn đơn vị (kg, bao, lít...)"
          data={UNIT_OPTIONS}
          searchable
          clearable
          withAsterisk
          {...form.getInputProps("unit")}
        />

        <Textarea
          radius={4}
          label="Ghi chú"
          placeholder="Thông tin mô tả thêm (tuỳ chọn)"
          autosize
          minRows={2}
          {...form.getInputProps("description")}
        />

        <Group justify="flex-end" mt="md">
          <Button variant="default" onClick={onClose} radius={4}>
            Hủy
          </Button>
          <Button type="submit" radius={4} color="green">
            {editId ? "Lưu thay đổi" : "Tạo mới"}
          </Button>
        </Group>
      </Stack>
    </form>
  );
};

export default AddFertilizerForm;
