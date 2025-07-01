import {
  Button,
  Card,
  Group,
  MultiSelect,
  Select,
  Stack,
  TextInput,
  Title,
  NumberInput,
  ActionIcon,
  Divider,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import {
  IconArrowLeft,
  IconCalendar,
  IconClipboardCheck,
  IconPlus,
} from "@tabler/icons-react";
import { useForm } from "@mantine/form";
import { useNavigate } from "react-router-dom";

const PlanManagementAssignAddPage = () => {
  const navigate = useNavigate();

  const form = useForm({
    initialValues: {
      name: "",
      season: "",
      growthStage: "",
      startDate: new Date(),
      endDate: new Date(),
      departments: [],
      ranks: [],
      positions: [],
      groups: [],
      employees: [],
      manager: "",
      supervisor: "",
      resources: [],
    },
  });

  return (
    <Card withBorder radius={8} shadow="sm" p="md">
      <Group mb="md">
        <Button
          variant="subtle"
          radius={4}
          leftSection={<IconArrowLeft size={18} />}
          onClick={() => navigate(-1)}
        >
          Quay lại
        </Button>
        <Title order={3}>Tạo công việc canh tác</Title>
      </Group>

      <form onSubmit={form.onSubmit((values) => console.log(values))}>
        <Stack gap="xs">
          <TextInput
            label="Tên công việc"
            placeholder="VD: Tưới nước đợt 1"
            radius={4}
            leftSection={<IconClipboardCheck size={16} />}
            {...form.getInputProps("name")}
          />

          <Group grow>
            <Select
              label="Mùa vụ"
              placeholder="Chọn mùa vụ"
              radius={4}
              data={["Mùa Xuân 2025", "Mùa Hè 2025"]}
              {...form.getInputProps("season")}
            />
            <Select
              label="Giai đoạn sinh trưởng"
              placeholder="Chọn giai đoạn theo mùa vụ"
              radius={4}
              data={["Gieo trồng", "Ra hoa", "Kết trái"]} // nên filter theo mùa vụ
              {...form.getInputProps("growthStage")}
            />
          </Group>

          <Group grow>
            <DateInput
              label="Thời gian thực hiện"
              radius={4}
              locale="vi"
              leftSection={<IconCalendar size={16} />}
              {...form.getInputProps("startDate")}
            />
            <DateInput
              label="Thời gian hoàn thành dự kiến"
              radius={4}
              locale="vi"
              leftSection={<IconCalendar size={16} />}
              {...form.getInputProps("endDate")}
            />
          </Group>

          <Divider label="Phân nhóm nhân sự" labelPosition="left" />

          <Group grow>
            <MultiSelect
              label="Phòng ban"
              data={["Chăm sóc cây", "Bảo vệ thực vật", "Thu hoạch"]}
              {...form.getInputProps("departments")}
              radius={4}
            />
            <MultiSelect
              label="Cấp bậc"
              data={["Quản lý", "Nhân viên", "Thực tập"]}
              {...form.getInputProps("ranks")}
              radius={4}
            />
          </Group>

          <Group grow>
            <MultiSelect
              label="Vị trí"
              data={["Kỹ sư nông nghiệp", "Giám sát hiện trường", "Công nhân"]}
              {...form.getInputProps("positions")}
              radius={4}
            />
            <MultiSelect
              label="Nhóm nhân sự"
              data={["Nhóm A", "Nhóm B", "Tổ 1", "Tổ 2"]}
              {...form.getInputProps("groups")}
              radius={4}
            />
          </Group>

          <MultiSelect
            label="Nhân sự cụ thể"
            placeholder="Chọn từ danh sách đã lọc"
            data={["Nguyễn Văn A", "Trần Thị B", "Lê Văn C"]}
            {...form.getInputProps("employees")}
            radius={4}
          />

          <Group grow>
            <Select
              label="Người quản lý"
              placeholder="Chọn (có thể bỏ trống)"
              radius={4}
              data={["Nguyễn Quản Lý", "Phạm Điều Hành"]}
              clearable
              {...form.getInputProps("manager")}
            />
            <Select
              label="Người kiểm định chất lượng"
              placeholder="Chọn (có thể bỏ trống)"
              radius={4}
              data={["Nguyễn Kiểm Tra", "Trần Thanh Tra"]}
              clearable
              {...form.getInputProps("supervisor")}
            />
          </Group>

          <Divider label="Tài nguyên sử dụng" labelPosition="left" />

          {/* Gợi ý: nên lặp danh sách tài nguyên đã phân bổ trong kế hoạch */}
          <Group align="flex-end">
            <Select
              label="Loại tài nguyên"
              radius={4}
              data={["Vật tư", "Thuốc BVTV", "Thiết bị"]}
              flex={1}
              required
            />
            <Select
              label="Tên tài nguyên"
              placeholder="Tên vật tư/thiết bị/thuốc"
              radius={4}
              flex={1}
              required
            />
            <NumberInput
              label="Số lượng"
              min={1}
              radius={4}
              flex={1}
              required
            />
            <Select
              label="Đơn vị"
              placeholder="kg, lít, chai..."
              radius={4}
              flex={1}
              required
            />
            <ActionIcon radius={4} w={30} h={30}>
              <IconPlus />
            </ActionIcon>
          </Group>

          <Group justify="flex-end" mt="md">
            <Button type="submit" radius={4}>
              Tạo công việc
            </Button>
          </Group>
        </Stack>
      </form>
    </Card>
  );
};

export default PlanManagementAssignAddPage;
