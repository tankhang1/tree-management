import { Button, Group, Stack, TextInput, LoadingOverlay } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useEffect } from "react";
import { notifications } from "@mantine/notifications";
import {
  usePesticideTypeStore,
  type PesticideType,
} from "../../../zustand/pesticideTypeStore";

type Props = {
  editId?: string | null;
  onClose: () => void;
};

const AddPesticideCategoryForm = ({ editId, onClose }: Props) => {
  const { addType, updateType, getTypeById, isLoading } =
    usePesticideTypeStore();

  const form = useForm<PesticideType>({
    initialValues: {
      id: "",
      name: "",
    },
    validate: {
      id: (value) =>
        value.trim().length === 0 ? "Vui lòng nhập mã loại thuốc" : null,
      name: (value) =>
        value.trim().length === 0 ? "Vui lòng nhập tên loại thuốc" : null,
    },
  });

  // Load Data on Edit
  useEffect(() => {
    if (editId) {
      const data = getTypeById(editId);
      if (data) {
        form.setValues({
          id: data.id,
          name: data.name,
        });
      }
    }
  }, [editId]);

  const handleSubmit = async (values: PesticideType) => {
    let success = false;

    if (editId) {
      success = await updateType(editId, values);
    } else {
      success = await addType(values);
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
        <TextInput
          label="Mã loại thuốc"
          radius={4}
          {...form.getInputProps("id")}
          readOnly={!!editId}
          disabled={!!editId}
          withAsterisk
          placeholder="VD: TYPE01"
        />
        <TextInput
          label="Tên loại thuốc"
          radius={4}
          {...form.getInputProps("name")}
          withAsterisk
          placeholder="VD: Thuốc trừ sâu"
        />
        <Group justify="flex-end" mt="md">
          <Button variant="default" onClick={onClose} radius={4}>
            Hủy
          </Button>
          <Button type="submit" radius={4} color="green">
            {editId ? "Lưu thay đổi" : "Lưu"}
          </Button>
        </Group>
      </Stack>
    </form>
  );
};

export default AddPesticideCategoryForm;
