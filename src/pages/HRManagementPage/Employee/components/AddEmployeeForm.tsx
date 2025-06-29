import {
  Button,
  Group,
  Stack,
  TextInput,
  Select,
  FileInput,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { IconUser, IconCalendar, IconCamera } from "@tabler/icons-react";

const AddEmployeeForm = () => {
  const form = useForm({
    initialValues: {
      id: "",
      username: "",
      fullName: "",
      birthDate: "",
      avatar: null,
      role: "",
      level: "",
      department: "",
      status: "active",
      manager: "",
    },
  });

  return (
    <Stack gap="xs">
      <Group grow>
        <TextInput
          label="Mã nhân sự"
          placeholder="VD: EMP001"
          radius={4}
          withAsterisk
          {...form.getInputProps("id")}
        />
        <TextInput
          label="Tên đăng nhập"
          placeholder="VD: nguyenvana"
          radius={4}
          withAsterisk
          {...form.getInputProps("username")}
        />
      </Group>

      <TextInput
        label="Họ tên"
        placeholder="VD: Nguyễn Văn A"
        radius={4}
        withAsterisk
        leftSection={<IconUser size={16} />}
        {...form.getInputProps("fullName")}
      />

      <DateInput
        label="Ngày sinh"
        placeholder="Chọn ngày sinh"
        radius={4}
        leftSection={<IconCalendar size={16} />}
        {...form.getInputProps("birthDate")}
      />

      <FileInput
        label="Ảnh đại diện"
        placeholder="Tải lên hình ảnh"
        accept="image/*"
        leftSection={<IconCamera size={16} />}
        radius={4}
        {...form.getInputProps("avatar")}
      />

      <Group grow>
        <Select
          label="Vai trò"
          placeholder="Chọn vai trò"
          data={[
            "Kỹ sư canh tác",
            "Giám sát hiện trường",
            "Kế toán",
            "Quản lý",
          ]}
          radius={4}
          withAsterisk
          {...form.getInputProps("role")}
        />
        <Select
          label="Cấp bậc"
          placeholder="Chọn cấp bậc"
          data={["Trưởng nhóm", "Nhân viên", "Thực tập"]}
          radius={4}
          withAsterisk
          {...form.getInputProps("level")}
        />
      </Group>

      <Group grow>
        <Select
          label="Phòng ban"
          placeholder="Chọn phòng ban"
          data={["Phòng Nông Nghiệp", "Phòng Kỹ Thuật", "Phòng Kế Toán"]}
          radius={4}
          withAsterisk
          {...form.getInputProps("department")}
        />
        <Select
          label="Người quản lý"
          placeholder="Tên người quản lý"
          radius={4}
          {...form.getInputProps("manager")}
        />
      </Group>
      <Select
        label="Trạng thái"
        placeholder="Trạng thái"
        data={[
          { value: "active", label: "Đang hoạt động" },
          { value: "probation", label: "Thử việc" },
          { value: "inactive", label: "Tạm dừng" },
        ]}
        radius={4}
        {...form.getInputProps("status")}
      />
      <Group justify="flex-end" mt="md">
        <Button radius={4} variant="light" color="gray">
          Huỷ
        </Button>
        <Button radius={4} variant="filled" color="teal">
          Tạo nhân sự
        </Button>
      </Group>
    </Stack>
  );
};

export default AddEmployeeForm;
