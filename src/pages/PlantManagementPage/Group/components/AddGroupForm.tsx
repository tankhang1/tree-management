import {
  Button,
  Stack,
  Textarea,
  TextInput,
  LoadingOverlay,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useEffect } from "react";
import { notifications } from "@mantine/notifications";
import { useCropGroupStore } from "../../../zustand/cropGroupStore";

type Props = {
  editId?: string | null;
  onClose: () => void;
};

const AddGroupForm = ({ editId, onClose }: Props) => {
  const { addGroup, updateGroup, getGroupById, isLoading } =
    useCropGroupStore();

  const form = useForm({
    initialValues: {
      id: "",
      name: "",
      note: "",
    },
    validate: {
      id: (value) =>
        value.trim().length === 0 ? "Vui lòng nhập mã loại cây" : null,
      name: (value) =>
        value.trim().length === 0 ? "Vui lòng nhập tên loại cây" : null,
    },
  });

  // Load dữ liệu khi ở chế độ Edit
  useEffect(() => {
    if (editId) {
      const data = getGroupById(editId);
      if (data) {
        form.setValues({
          id: data.id,
          name: data.name,
          note: data.note,
        });
      }
    }
  }, [editId]);

  const handleSubmit = async (values: typeof form.values) => {
    let success = false;

    if (editId) {
      // Logic Sửa
      success = await updateGroup(editId, values);
    } else {
      // Logic Thêm mới
      success = await addGroup(values);
    }

    if (success) {
      notifications.show({
        title: "Thành công",
        message: editId ? "Đã cập nhật nhóm cây" : "Đã tạo mới nhóm cây",
        color: "green",
      });
      onClose();
    } else {
      notifications.show({
        title: "Thất bại",
        message: editId
          ? "Có lỗi xảy ra"
          : "Mã loại cây đã tồn tại hoặc có lỗi",
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
      <Stack gap={"xs"}>
        <TextInput
          label="Mã loại cây"
          placeholder="LC001"
          {...form.getInputProps("id")}
          radius={4}
          readOnly={!!editId} // Không cho sửa ID khi đang edit
          variant={editId ? "filled" : "default"}
          withAsterisk
        />
        <TextInput
          label="Tên loại cây"
          placeholder="Cây ăn trái"
          {...form.getInputProps("name")}
          radius={4}
          withAsterisk
        />
        <Textarea
          label="Ghi chú"
          placeholder="Nhập ghi chú..."
          {...form.getInputProps("note")}
          radius={4}
          minRows={3}
        />
        <Button type="submit" radius={4}>
          {editId ? "Lưu thay đổi" : "Tạo mới"}
        </Button>
      </Stack>
    </form>
  );
};
export default AddGroupForm;
