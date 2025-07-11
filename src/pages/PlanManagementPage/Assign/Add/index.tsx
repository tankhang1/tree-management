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
import { useState } from "react";

const CYCLES = ["Chu kỳ 1", "Chu kỳ 2"];
const STAGES = ["Gieo trồng", "Ra hoa", "Kết trái"];

const PlanManagementAssignAddPage = () => {
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

      <form onSubmit={form.onSubmit((values) => console.log(values))}>
        <Stepper active={active} onStepClick={setActive} mb="xl">
          <Stepper.Step label="Bước 1" description="Thông tin chung" />
          <Stepper.Step label="Bước 2" description="Phân công theo giai đoạn" />
          <Stepper.Completed>Hoàn tất</Stepper.Completed>
        </Stepper>

        {active === 0 && (
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
                label="Kế hoạch"
                placeholder="Chọn kế hoạch (popup filter)"
                radius={4}
                data={["KH-XUAN-01", "KH-HE-02"]}
                {...form.getInputProps("plan")}
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
                label="Hoàn thành dự kiến"
                radius={4}
                locale="vi"
                leftSection={<IconCalendar size={16} />}
                {...form.getInputProps("endDate")}
              />
            </Group>

            <Group grow>
              <Select
                label="Người quản lý"
                radius={4}
                data={["Nguyễn Quản Lý", "Phạm Điều Hành"]}
                clearable
                {...form.getInputProps("manager")}
              />
              <Select
                label="Người kiểm định chất lượng"
                radius={4}
                data={["Nguyễn Kiểm Tra", "Trần Thanh Tra"]}
                clearable
                {...form.getInputProps("supervisor")}
              />
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

                <Select
                  label="Trưởng nhóm"
                  placeholder="Chọn trưởng nhóm"
                  data={["Nguyễn Văn A", "Trần Thị B", "Lê Văn C"]}
                  radius={4}
                  value={stageData.leader}
                  onChange={(val) => {
                    const newStages = [...formDataByStage];
                    newStages[stageIdx].leader = val || "";
                    setFormDataByStage(newStages);
                  }}
                />

                <MultiSelect
                  label="Nhân viên tham gia"
                  placeholder="Chọn nhân sự"
                  data={["Nguyễn Văn A", "Trần Thị B", "Lê Văn C"]}
                  radius={4}
                  value={stageData.members}
                  onChange={(val) => {
                    const newStages = [...formDataByStage];
                    //@ts-expect-error no check
                    newStages[stageIdx].members = val;
                    setFormDataByStage(newStages);
                  }}
                />

                <Divider
                  label="Tài nguyên cho giai đoạn này"
                  labelPosition="left"
                  mt="md"
                />

                {stageData.resources.map((res, i) => (
                  <Group key={i} gap="xs" mt="xs">
                    <Select
                      data={["Phân bón", "Thuốc BVTV", "Thiết bị"]}
                      placeholder="Loại tài nguyên"
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
                  Thêm tài nguyên
                </Button>
              </Card>
            ))}
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

export default PlanManagementAssignAddPage;
