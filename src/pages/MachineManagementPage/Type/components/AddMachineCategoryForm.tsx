import { Button, Group, Stack, TextInput, LoadingOverlay } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useEffect } from "react";
import { notifications } from "@mantine/notifications";
import {
  useMachineCategoryStore,
  type MachineCategory,
} from "../../../zustand/machineCategoryStore";

type Props = {
  editId?: string | null;
  onClose: () => void;
};

const AddMachineCategoryForm = ({ editId, onClose }: Props) => {
  const { addMachine, updateMachine, getMachineById, isLoading } =
    useMachineCategoryStore();

  const form = useForm<MachineCategory>({
    initialValues: {
      id: "",
      name: "",
    },
    validate: {
      id: (value) =>
        value.trim().length === 0 ? "Vui lòng nhập mã máy móc" : null,
      name: (value) =>
        value.trim().length === 0 ? "Vui lòng nhập tên máy móc" : null,
    },
  });

  // Load dữ liệu khi Sửa
  useEffect(() => {
    if (editId) {
      const data = getMachineById(editId);
      if (data) {
        form.setValues({
          id: data.id,
          name: data.name,
        });
      }
    }
  }, [editId]);

  const handleSubmit = async (values: MachineCategory) => {
    let success = false;

    if (editId) {
      success = await updateMachine(editId, values);
    } else {
      success = await addMachine(values);
    }

    if (success) {
      notifications.show({
        title: "Thành công",
        message: editId ? "Đã cập nhật loại máy" : "Đã thêm loại máy mới",
        color: "green",
      });
      onClose();
    } else {
      notifications.show({
        title: "Thất bại",
        message: "Mã loại máy đã tồn tại hoặc có lỗi xảy ra",
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
      <Stack>
        <TextInput
          label="Mã loại máy móc"
          placeholder="Ví dụ: MCH01"
          radius={4}
          {...form.getInputProps("id")}
          readOnly={!!editId} // Không cho sửa ID khi đang edit
          disabled={!!editId}
          withAsterisk
        />
        <TextInput
          label="Tên loại máy móc"
          radius={4}
          placeholder="Ví dụ: Máy cày"
          {...form.getInputProps("name")}
          withAsterisk
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

export default AddMachineCategoryForm;
