// Stepper-based form UI for assigning work by growth cycle & stage
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
  Divider,
  Stepper,
  Grid,
  Modal,
  Text,
  Radio,
  ActionIcon,
  ScrollArea,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import {
  IconArrowLeft,
  IconCalendar,
  IconClipboardCheck,
  IconPlus,
  IconSearch,
  IconTrash,
  IconUser,
} from "@tabler/icons-react";
import { useForm } from "@mantine/form";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import PlanDetail from "./components/PlanDetail";
import ConfirmStep from "./components/ConfirmStep";
import { useDisclosure } from "@mantine/hooks";
import { EmployeeCardList } from "../../../HRManagementPage/Team/Add/components/EmployeeCardList";
import { DepartmentCardList } from "../../../HRManagementPage/Team/Add/components/DepartmentCardList";

const CYCLES = ["Chu kỳ 1", "Chu kỳ 2"];
const STAGES = ["Gieo trồng", "Ra hoa", "Kết trái"];
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
const PlanManagementAssignAddPage = () => {
  const [
    openedFilterEmployee,
    { open: openFilterEmployee, close: closeFilterEmployee },
  ] = useDisclosure(false);
  const [mode, setMode] = useState<"group" | "dept">("group");
  const navigate = useNavigate();
  const [active, setActive] = useState(0);

  const [formDataByStage, setFormDataByStage] = useState(
    CYCLES.flatMap((cycle) =>
      STAGES.map((stage) => ({
        cycle,
        stage,
        leader: "",
        members: [],
        resources: [{ type: "", amount: 0, unit: "" }],
      }))
    )
  );

  const form = useForm({
    initialValues: {
      name: "",
      season: "",
      plan: "",
      growthCycle: "",
      growthStage: "",
      startDate: new Date(),
      endDate: new Date(),
      manager: "",
      supervisor: "",
    },
  });

  const nextStep = () => setActive((current) => Math.min(current + 1, 2));
  const prevStep = () => setActive((current) => Math.max(current - 1, 0));

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

      <Grid>
        <Grid.Col span={form.getValues().plan !== "" ? 8 : 12}>
          <form onSubmit={form.onSubmit((values) => console.log(values))}>
            <Stepper active={active} onStepClick={setActive} mb="xl">
              <Stepper.Step label="Bước 1" description="Thông tin chung" />
              <Stepper.Step
                label="Bước 2"
                description="Phân công theo giai đoạn"
              />
              <Stepper.Step label="Bước 3" description="Xác nhận" />
            </Stepper>

            {active === 0 && (
              <Stack gap="xs">
                <Group align="flex-end">
                  <TextInput
                    label="Tên công việc"
                    placeholder="VD: Tưới nước đợt 1"
                    radius={4}
                    leftSection={<IconClipboardCheck size={16} />}
                    {...form.getInputProps("name")}
                    flex={1}
                  />
                </Group>

                <Group grow>
                  {/**Tự fill theo kế hoạch */}
                  <Select
                    label="Mùa vụ"
                    placeholder="Chọn mùa vụ"
                    radius={4}
                    data={["Mùa Xuân 2025", "Mùa Hè 2025"]}
                    {...form.getInputProps("season")}
                  />
                  <Select
                    flex={1}
                    label="Kế hoạch"
                    placeholder="Chọn kế hoạch (popup filter)"
                    radius={4}
                    value={"KH-XUAN-01"}
                    data={["KH-XUAN-01", "KH-HE-02"]}
                    {...form.getInputProps("plan")}
                  />
                </Group>

                <Group grow>
                  <DateInput
                    label="Thời gian thực hiện dự kiến"
                    radius={4}
                    locale="vi"
                    leftSection={<IconCalendar size={16} />}
                    {...form.getInputProps("startDate")}
                  />
                  <DateInput
                    label="Hoàn thành dự kiến"
                    radius={4}
                    locale="vi"
                    leftSection={<IconCalendar size={16} />}
                    {...form.getInputProps("endDate")}
                  />
                </Group>

                <Group grow>
                  <Stack gap={"xs"}>
                    <Group>
                      <Text fw={"500"} fz={15}>
                        Người quản lý
                      </Text>
                      <Button
                        variant="light"
                        radius={4}
                        onClick={openFilterEmployee}
                        leftSection={<IconUser size={18} />}
                      >
                        Chọn quản lý
                      </Button>
                    </Group>
                    <Group mt="md">
                      {employees.map((emp, idx) => (
                        <Card
                          pos={"relative"}
                          key={idx}
                          shadow="sm"
                          radius="md"
                          withBorder
                        >
                          <Group justify="space-between" align="flex-start">
                            <Stack gap={2}>
                              <Group>
                                <Title order={5}>{emp.name}</Title>
                                <ActionIcon
                                  variant="light"
                                  size={18}
                                  color={"red"}
                                >
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
                                <ActionIcon
                                  variant="light"
                                  size={18}
                                  color={"red"}
                                >
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
                </Group>
              </Stack>
            )}

            {active === 1 && (
              <Stack>
                {formDataByStage.map((stageData, stageIdx) => (
                  <Card
                    key={`${stageData.cycle}-${stageData.stage}`}
                    withBorder
                    mb="md"
                    radius={4}
                  >
                    <Title order={4}>
                      {stageData.cycle} – {stageData.stage}
                    </Title>

                    <Stack>
                      <Stack gap={"xs"}>
                        <Group>
                          <Text fw={"500"} fz={15}>
                            Trưởng nhóm
                          </Text>
                          <Button
                            variant="light"
                            radius={4}
                            onClick={openFilterEmployee}
                            leftSection={<IconUser size={18} />}
                          >
                            Chọn trưởng nhóm
                          </Button>
                        </Group>
                        <Group mt="md">
                          {employees.map((emp, idx) => (
                            <Card key={idx} shadow="sm" radius="md" withBorder>
                              <Group justify="space-between" align="flex-start">
                                <Stack gap={2}>
                                  <Group>
                                    <Title order={5}>{emp.name}</Title>
                                    <ActionIcon
                                      variant="light"
                                      size={18}
                                      color={"red"}
                                    >
                                      <IconTrash size={14} />
                                    </ActionIcon>
                                  </Group>
                                  <Text size="sm" c="dimmed">
                                    Trưởng nhóm
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
                            Nhân viên tham gia
                          </Text>
                          <Button
                            variant="light"
                            radius={4}
                            onClick={openFilterEmployee}
                            leftSection={<IconUser size={18} />}
                          >
                            Chọn nhân viên tham gia
                          </Button>
                        </Group>
                        <Group mt="md">
                          {employees.map((emp, idx) => (
                            <Card key={idx} shadow="sm" radius="md" withBorder>
                              <Group justify="space-between" align="flex-start">
                                <Stack gap={2}>
                                  <Group>
                                    <Title order={5}>{emp.name}</Title>
                                    <ActionIcon
                                      variant="light"
                                      size={18}
                                      color={"red"}
                                    >
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
                    </Stack>

                    <Divider
                      label="Tài sản cho giai đoạn này"
                      labelPosition="left"
                      mt="md"
                    />

                    {stageData.resources.map((res, i) => (
                      <Group key={i} gap="xs" mt="xs">
                        <Select
                          data={["Phân bón", "Thuốc BVTV", "Thiết bị"]}
                          placeholder="Loại tài sản"
                          radius={4}
                          value={res.type}
                          onChange={(val) => {
                            const newStages = [...formDataByStage];
                            newStages[stageIdx].resources[i].type = val || "";
                            setFormDataByStage(newStages);
                          }}
                          w={160}
                        />
                        <NumberInput
                          placeholder="Số lượng"
                          min={1}
                          radius={4}
                          value={res.amount}
                          onChange={(val) => {
                            const newStages = [...formDataByStage];
                            newStages[stageIdx].resources[i].amount = +val;
                            setFormDataByStage(newStages);
                          }}
                          w={100}
                        />
                        <Select
                          placeholder="Đơn vị"
                          data={["kg", "lít", "chai"]}
                          radius={4}
                          value={res.unit}
                          onChange={(val) => {
                            const newStages = [...formDataByStage];
                            newStages[stageIdx].resources[i].unit = val || "";
                            setFormDataByStage(newStages);
                          }}
                          w={100}
                        />
                      </Group>
                    ))}

                    <Button
                      variant="light"
                      leftSection={<IconPlus size={16} />}
                      radius={4}
                      mt="xs"
                      onClick={() => {
                        const newStages = [...formDataByStage];
                        newStages[stageIdx].resources.push({
                          type: "",
                          amount: 0,
                          unit: "",
                        });
                        setFormDataByStage(newStages);
                      }}
                    >
                      Thêm tài sản
                    </Button>
                  </Card>
                ))}
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
        </Grid.Col>
        {form.getValues().plan !== "" && (
          <Grid.Col span={4}>
            <PlanDetail />
          </Grid.Col>
        )}
      </Grid>
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
              <TextInput
                label="Phòng ban"
                placeholder="Tìm kiếm phòng ban liên quan"
                {...form.getInputProps("departments")}
                leftSection={<IconSearch size={16} />}
                radius={4}
              />
              <DepartmentCardList />
              <MultiSelect
                label="Chọn vai trò"
                radius={4}
                data={["Giám đốc", "Tổ trưởng", "Trưởng phòng"]}
              />
            </>
          )}
          <TextInput
            label="Tìm kiếm nhân viên"
            placeholder="Chọn thành viên từ nhân sự"
            leftSection={<IconSearch size={16} />}
            radius={4}
          />
          <EmployeeCardList />
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

export default PlanManagementAssignAddPage;
