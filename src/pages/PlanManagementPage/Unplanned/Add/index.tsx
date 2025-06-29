import {
  Button,
  Card,
  Divider,
  Group,
  Select,
  Stack,
  TextInput,
  Title,
  MultiSelect,
  NumberInput,
  ActionIcon,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { IconArrowLeft, IconPlus } from "@tabler/icons-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const PlanManagementUnplannedAddPage = () => {
  const navigate = useNavigate();
  const form = useForm({
    initialValues: {
      name: "",
      assignDate: new Date(),
      startDate: new Date(),
      endDate: new Date(),
      departments: [],
      employees: [],
      creator: "Nguyễn Quản Lý",
      supervisor: "",
      seasonPlan: "",
      resources: [],
    },
  });

  const [newResource, setNewResource] = useState({
    type: "Vật tư",
    name: "",
    quantity: 1,
    unit: "",
  });

  return (
    <Card withBorder shadow="sm" radius={8} p="xl">
      <Group mb={"md"}>
        <Button
          variant="subtle"
          radius={4}
          leftSection={<IconArrowLeft size={18} />}
          onClick={() => navigate(-1)}
        >
          Quay lại
        </Button>
        <Title order={3}>Tạo phiếu giao việc phát sinh</Title>
      </Group>
      <form onSubmit={form.onSubmit((values) => console.log(values))}>
        <Stack>
          <TextInput
            label="Tên phiếu giao việc"
            placeholder="Ví dụ: Phun thuốc sâu vụ hè"
            radius={4}
            {...form.getInputProps("name")}
          />

          <Group grow>
            <DateInput
              label="Thời gian giao việc"
              placeholder="Chọn ngày"
              radius={4}
              locale="vi"
              {...form.getInputProps("assignDate")}
            />
            <DateInput
              label="Bắt đầu công việc"
              placeholder="Chọn ngày"
              radius={4}
              locale="vi"
              {...form.getInputProps("startDate")}
            />
            <DateInput
              label="Kết thúc công việc"
              locale="vi"
              placeholder="Chọn ngày"
              radius={4}
              {...form.getInputProps("endDate")}
            />
          </Group>

          <MultiSelect
            label="Phòng ban"
            placeholder="Chọn nhiều phòng ban"
            radius={4}
            data={["Chăm sóc cây", "Phòng BVTV", "Vận hành"]}
            {...form.getInputProps("departments")}
          />

          <MultiSelect
            label="Nhân sự"
            placeholder="Chọn nhân sự từ phòng ban"
            radius={4}
            data={["Nguyễn Văn A", "Trần Thị B"]}
            {...form.getInputProps("employees")}
          />

          <Select
            label="Người giám sát"
            placeholder="Chọn người giám sát"
            radius={4}
            {...form.getInputProps("supervisor")}
          />

          <Divider label="Tài nguyên sử dụng" labelPosition="left" my="sm" />

          <Group align="flex-end">
            <Select
              label="Loại tài nguyên"
              radius={4}
              data={["Vật tư", "Thuốc BVTV", "Thiết bị"]}
              value={newResource.type}
              onChange={(value) =>
                setNewResource({ ...newResource, type: value || "" })
              }
              flex={1}
            />
            <TextInput
              label="Tên"
              placeholder="Tên tài nguyên"
              radius={4}
              value={newResource.name}
              onChange={(e) =>
                setNewResource({ ...newResource, name: e.currentTarget.value })
              }
              flex={1}
            />
            <NumberInput
              label="Số lượng"
              min={1}
              radius={4}
              flex={1}
              value={newResource.quantity}
            />
            <TextInput
              label="Đơn vị tính"
              placeholder="Ví dụ: Lít, Kg"
              radius={4}
              value={newResource.unit}
              onChange={(e) =>
                setNewResource({ ...newResource, unit: e.currentTarget.value })
              }
              flex={1}
            />
            <ActionIcon radius={4} w={30} h={30}>
              <IconPlus />
            </ActionIcon>
          </Group>

          <Button type="submit" radius={4} mt="md">
            Tạo phiếu giao việc
          </Button>
        </Stack>
      </form>
    </Card>
  );
};

export default PlanManagementUnplannedAddPage;
