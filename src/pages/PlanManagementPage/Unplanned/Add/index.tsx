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
  Stepper,
  Text,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { IconArrowLeft, IconPlus } from "@tabler/icons-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const PlanManagementUnplannedAddPage = () => {
  const navigate = useNavigate();
  const [active, setActive] = useState(0);

  const form = useForm({
    initialValues: {
      name: "",
      startDate: new Date(),
      endDate: new Date(),
      season: "",
      cycle: "",
      stage: "",
      departments: [],
      employees: [],
      creator: "Nguyễn Quản Lý",
      supervisor: "",
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
    //@ts-expect-error no check
    form.setFieldValue("resources", [...form.values.resources, newResource]);
    setNewResource({ type: "Vật tư", name: "", quantity: 1, unit: "" });
  };

  const nextStep = () => setActive((current) => Math.min(current + 1, 2));
  const prevStep = () => setActive((current) => Math.max(current - 1, 0));

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
        <Stepper active={active} onStepClick={setActive} mb="xl">
          <Stepper.Step label="Bước 1" description="Thông tin chung" />
          <Stepper.Step label="Bước 2" description="Tài nguyên" />
          <Stepper.Completed>Hoàn tất</Stepper.Completed>
        </Stepper>

        {active === 0 && (
          <Stack gap={"xs"}>
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

            <Select
              label="Mùa vụ"
              placeholder="Chọn mùa vụ cụ thể"
              data={["Mùa Xuân 2025", "Mùa Hè 2025"]}
              required
              radius={4}
              {...form.getInputProps("season")}
            />

            <Select
              label="Chu kỳ sinh trưởng"
              placeholder="Chọn chu kỳ"
              data={["Chu kỳ 1", "Chu kỳ 2"]}
              required
              radius={4}
              {...form.getInputProps("cycle")}
            />

            <Select
              label="Giai đoạn sinh trưởng"
              placeholder="Chọn giai đoạn"
              data={["Gieo trồng", "Ra hoa", "Kết trái"]}
              required
              radius={4}
              {...form.getInputProps("stage")}
            />

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
          </Stack>
        )}

        {active === 1 && (
          <Stack>
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
              <TextInput
                label="Tên"
                placeholder="Tên tài nguyên"
                radius={4}
                value={newResource.name}
                onChange={(e) =>
                  setNewResource({
                    ...newResource,
                    name: e.currentTarget.value,
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
                  setNewResource({
                    ...newResource,
                    unit: e.currentTarget.value,
                  })
                }
                flex={1}
              />
              <ActionIcon radius={4} w={30} h={30} onClick={handleAddResource}>
                <IconPlus />
              </ActionIcon>
            </Group>

            {form.values.resources.length > 0 && (
              <Stack gap="xs">
                {form.values.resources.map((r, i) => (
                  <Group key={i} justify="space-between" pl="md">
                    <Text>{r.type}</Text>
                    <Text>{r.name}</Text>
                    <Text>
                      {r.quantity} {r.unit || ""}
                    </Text>
                  </Group>
                ))}
              </Stack>
            )}
          </Stack>
        )}

        <Group justify="space-between" mt="lg">
          <Button
            radius={4}
            onClick={prevStep}
            disabled={active === 0}
            variant="default"
          >
            Quay lại
          </Button>
          {active < 2 ? (
            <Button radius={4} onClick={nextStep}>
              Tiếp tục
            </Button>
          ) : (
            <Button radius={4} type="submit" color="green">
              Tạo công việc
            </Button>
          )}
        </Group>
      </form>
    </Card>
  );
};

export default PlanManagementUnplannedAddPage;
