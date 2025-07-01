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
type Resource = {
  type: string;
  name: string;
  quantity: number;
  unit: string;
};

type FormValues = {
  name: string;
  startDate: Date;
  endDate: Date;
  departments: string[];
  employees: string[];
  creator: string;
  supervisor?: string;
  seasonPlan?: string;
  resources: Resource[];
};
const PlanManagementUnplannedAddPage = () => {
  const navigate = useNavigate();
  const form = useForm<FormValues>({
    initialValues: {
      name: "",
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

  const handleAddResource = () => {
    if (!newResource.name || newResource.quantity <= 0) return;

    form.setFieldValue("resources", [...form.values.resources, newResource]);
    setNewResource({ type: "Vật tư", name: "", quantity: 1, unit: "" });
  };

  return (
    <Card withBorder shadow="sm" radius={8} p="xl">
      <Group mb="md">
        <Button
          variant="subtle"
          radius={4}
          leftSection={<IconArrowLeft size={18} />}
          onClick={() => navigate(-1)}
        >
          Quay lại
        </Button>
        <Title order={3}>Tạo công việc phát sinh</Title>
      </Group>

      <form onSubmit={form.onSubmit((values) => console.log(values))}>
        <Stack>
          <TextInput
            label="Tên công việc"
            placeholder="Ví dụ: Phun thuốc sâu vụ hè"
            radius={4}
            required
            {...form.getInputProps("name")}
          />

          <Group grow>
            <DateInput
              label="Thời gian thực hiện"
              placeholder="Chọn ngày"
              radius={4}
              locale="vi"
              {...form.getInputProps("startDate")}
            />
            <DateInput
              label="Thời gian hoàn thành dự kiến"
              placeholder="Chọn ngày"
              radius={4}
              locale="vi"
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
            label="Người kiểm định chất lượng"
            placeholder="Chọn người kiểm định (không bắt buộc)"
            radius={4}
            data={["Phạm Văn B", "Lê Kiểm Tra"]}
            clearable
            {...form.getInputProps("supervisor")}
          />

          <Select
            label="Kế hoạch mùa vụ (không bắt buộc)"
            placeholder="Chọn mùa vụ nếu có"
            radius={4}
            data={["Mùa Xuân 2025", "Mùa Hè 2025"]}
            clearable
            {...form.getInputProps("seasonPlan")}
          />

          <Divider
            label="Tài nguyên sử dụng (tùy chọn)"
            labelPosition="left"
            my="sm"
          />

          <Group align="flex-end">
            <Select
              label="Loại tài nguyên"
              radius={4}
              data={["Vật tư", "Thuốc BVTV", "Thiết bị"]}
              value={newResource.type}
              onChange={(value) =>
                setNewResource({ ...newResource, type: value || "Vật tư" })
              }
              flex={1}
            />
            <Select
              searchable
              label="Tên"
              placeholder="Tên tài nguyên"
              radius={4}
              value={newResource.name}
              onChange={(e) =>
                setNewResource({
                  ...newResource,
                  //@ts-expect-error no check
                  name: e?.currentTarget?.value || "",
                })
              }
              flex={1}
            />
            <NumberInput
              label="Số lượng"
              min={1}
              radius={4}
              flex={1}
              value={newResource.quantity}
              onChange={(value) =>
                setNewResource({ ...newResource, quantity: +value || 1 })
              }
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
            <ActionIcon radius={4} w={30} h={30} onClick={handleAddResource}>
              <IconPlus />
            </ActionIcon>
          </Group>

          {/* Hiển thị danh sách tài nguyên đã thêm */}
          {form.values.resources.length > 0 && (
            <Stack gap="xs">
              {form.values.resources.map((r, i) => (
                <Group key={i} justify="space-between" pl="md">
                  <TextInput value={r.type} readOnly w="20%" />
                  <TextInput value={r.name} readOnly w="30%" />
                  <TextInput
                    value={`${r.quantity} ${r.unit || ""}`}
                    readOnly
                    w="30%"
                  />
                </Group>
              ))}
            </Stack>
          )}

          <Button type="submit" radius={4} mt="md">
            Tạo công việc
          </Button>
        </Stack>
      </form>
    </Card>
  );
};

export default PlanManagementUnplannedAddPage;
