import { Button, Group, Stack, TextInput, Select, Text } from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { useForm } from "@mantine/form";
import {
  IconUser,
  IconCalendar,
  IconUpload,
  IconX,
  IconPhoto,
} from "@tabler/icons-react";

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

      <Dropzone
        onDrop={(files) => console.log("accepted files", files)}
        onReject={(files) => console.log("rejected files", files)}
        maxSize={5 * 1024 ** 2}
        accept={IMAGE_MIME_TYPE}
      >
        <Group
          justify="center"
          gap="xl"
          mih={220}
          style={{ pointerEvents: "none" }}
        >
          <Dropzone.Accept>
            <IconUpload
              size={52}
              color="var(--mantine-color-blue-6)"
              stroke={1.5}
            />
          </Dropzone.Accept>
          <Dropzone.Reject>
            <IconX size={52} color="var(--mantine-color-red-6)" stroke={1.5} />
          </Dropzone.Reject>
          <Dropzone.Idle>
            <IconPhoto
              size={52}
              color="var(--mantine-color-dimmed)"
              stroke={1.5}
            />
          </Dropzone.Idle>

          <div>
            <Text size="xl" inline>
              Bỏ và thả ảnh đại diện tại đây
            </Text>
            <Text size="sm" c="dimmed" inline mt={7}>
              Đính kèm ảnh đại diện (tối đa 5MB)
            </Text>
          </div>
        </Group>
      </Dropzone>

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
        <Button radius={4} variant="filled" color="green">
          Tạo nhân sự
        </Button>
      </Group>
    </Stack>
  );
};

export default AddEmployeeForm;
