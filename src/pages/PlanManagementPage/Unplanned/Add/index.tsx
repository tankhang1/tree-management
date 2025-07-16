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
  Modal,
  Radio,
  Autocomplete,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import {
  IconArrowLeft,
  IconPlus,
  IconSearch,
  IconTrash,
  IconUser,
} from "@tabler/icons-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ConfirmStep from "./components/ConfirmStep";
import { useDisclosure } from "@mantine/hooks";
const employees = [
  {
    name: "Nguyễn Văn A",
    role: "Tổ trưởng",
    department: "Ban kỹ thuật",
  },
  {
    name: "Trần Thị B",
    role: "Giám đốc",
    department: "Ban tài chính",
  },
];
const PlanManagementUnplannedAddPage = () => {
  const navigate = useNavigate();
  const [active, setActive] = useState(0);
  const [
    openedFilterEmployee,
    { open: openFilterEmployee, close: closeFilterEmployee },
  ] = useDisclosure(false);
  const [mode, setMode] = useState<"group" | "dept">("group");
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
  const options = employees.map((e) => ({
    value: e.name,
    label: `${e.name} - [${e.role}] - [${e.department}, Ban kinh doanh]`,
  }));
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
          <Stepper.Step label="Bước 3" description="Xác nhận" />
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
                label="Thời gian thực hiện dự kiến"
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

            <Stack gap={"xs"}>
              <Group>
                <Text fw={"500"} fz={15}>
                  Nhân sự
                </Text>
                <Button
                  variant="light"
                  radius={4}
                  onClick={openFilterEmployee}
                  leftSection={<IconUser size={18} />}
                >
                  Chọn nhân sự
                </Button>
              </Group>
              <Group mt="md">
                {employees.map((emp, idx) => (
                  <Card key={idx} shadow="sm" radius="md" withBorder>
                    <Group justify="space-between" align="flex-start">
                      <Stack gap={2}>
                        <Group>
                          <Title order={5}>{emp.name}</Title>
                          <ActionIcon variant="light" size={18} color={"red"}>
                            <IconTrash size={14} />
                          </ActionIcon>
                        </Group>
                        <Text size="sm" c="dimmed">
                          Nhân viên
                        </Text>
                        <Text size="sm" c="dimmed">
                          {emp.department}
                        </Text>
                      </Stack>
                    </Group>
                  </Card>
                ))}
              </Group>
            </Stack>
            <Stack gap={"xs"}>
              <Group>
                <Text fw={"500"} fz={15}>
                  Người kiểm định chất lượng
                </Text>
                <Button
                  variant="light"
                  radius={4}
                  onClick={openFilterEmployee}
                  leftSection={<IconUser size={18} />}
                >
                  Chọn người kiểm định chất lượng
                </Button>
              </Group>
              <Group mt="md">
                {employees.map((emp, idx) => (
                  <Card key={idx} shadow="sm" radius="md" withBorder>
                    <Group justify="space-between" align="flex-start">
                      <Stack gap={2}>
                        <Group>
                          <Title order={5}>{emp.name}</Title>
                          <ActionIcon variant="light" size={18} color={"red"}>
                            <IconTrash size={14} />
                          </ActionIcon>
                        </Group>
                        <Text size="sm" c="dimmed">
                          {emp.role}
                        </Text>
                        <Text size="sm" c="dimmed">
                          {emp.department}
                        </Text>
                      </Stack>
                    </Group>
                  </Card>
                ))}
              </Group>
            </Stack>
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
        {active === 2 && <ConfirmStep />}
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
      <Modal
        opened={openedFilterEmployee}
        onClose={closeFilterEmployee}
        title={<Text fw={"bold"}>Lọc nhân sự</Text>}
      >
        <Stack gap={"xs"}>
          <Radio.Group
            label="Phương thức lọc"
            value={mode}
            onChange={(val) => setMode(val as "group" | "dept")}
          >
            <Radio value="group" mb={"xs"} label="Chọn theo đội nhóm" />
            <Radio value="dept" label="Chọn theo phòng ban và vai trò" />
          </Radio.Group>

          {mode === "group" && (
            <MultiSelect
              label="Chọn đội nhóm"
              radius={4}
              data={["Nhóm Canh tác", "Nhóm Vật tư"]}
            />
          )}

          {mode === "dept" && (
            <>
              <MultiSelect
                label="Chọn phòng ban"
                radius={4}
                data={["Ban tài chính", "Ban kĩ thuật", "Ban kế hoạch"]}
              />
              <MultiSelect
                label="Chọn vai trò"
                radius={4}
                data={["Giám đốc", "Tổ trưởng", "Trưởng phòng"]}
              />
            </>
          )}
          <Autocomplete
            label="Tìm kiếm nhân sự"
            placeholder="Nhập tên hoặc chức vụ..."
            leftSection={<IconSearch size={18} />}
            radius={4}
            value="Nguyễn Văn A"
            data={options}
          />
        </Stack>

        <Group mt="md" justify="flex-end">
          <Button
            radius={4}
            variant="outline"
            color="red"
            onClick={closeFilterEmployee}
          >
            Huỷ
          </Button>
          <Button radius={4}>Xác nhận</Button>
        </Group>
      </Modal>
    </Card>
  );
};

export default PlanManagementUnplannedAddPage;
