import {
  Button,
  Group,
  MultiSelect,
  NumberInput,
  Select,
  Stack,
  Stepper,
  TextInput,
  Title,
  Box,
  Card,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconArrowLeft } from "@tabler/icons-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

// 🔁 Dữ liệu giả lập
const cropOptions = [
  { value: "crop1", label: "Sầu riêng Ri6" },
  { value: "crop2", label: "Xoài Cát Chu" },
];

const growthCycleOptions = [
  { value: "cycle1", label: "Chu kỳ A" },
  { value: "cycle2", label: "Chu kỳ B" },
  { value: "cycle3", label: "Chu kỳ C" },
];

const growthStageOptions = [
  { value: "stage1", label: "Gieo trồng" },
  { value: "stage2", label: "Nảy mầm" },
  { value: "stage3", label: "Phát triển thân lá" },
  { value: "stage4", label: "Ra hoa" },
  { value: "stage5", label: "Kết trái" },
  { value: "stage6", label: "Thu hoạch" },
];

type CycleStage = {
  cycleId: string;
  stageIds: string[];
};

const SeasonManagementGrowthAddPage = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [cycleStageList, setCycleStageList] = useState<CycleStage[]>([]);

  const form = useForm({
    initialValues: {
      name: "",
      estimatedDuration: 0,
      cropId: "",
    },
    validate: {
      name: (val) => (!val ? "Vui lòng nhập tên mùa vụ" : null),
      estimatedDuration: (val) => (val <= 0 ? "Thời gian phải > 0" : null),
      cropId: (val) => (!val ? "Chọn cây trồng" : null),
    },
  });

  const [currentCycle, setCurrentCycle] = useState<string | null>(null);
  const [currentStages, setCurrentStages] = useState<string[]>([]);

  const addCycleStage = () => {
    if (!currentCycle) return;
    if (currentStages.length === 0) return;

    setCycleStageList([
      ...cycleStageList,
      { cycleId: currentCycle, stageIds: currentStages },
    ]);
    setCurrentCycle(null);
    setCurrentStages([]);
  };

  const removeCycle = (index: number) => {
    setCycleStageList((prev) => prev.filter((_, i) => i !== index));
  };

  const nextStep = () => {
    if (activeStep === 0 && !form.validate().hasErrors) {
      setActiveStep(1);
    } else if (activeStep === 1) {
      if (cycleStageList.length === 0)
        return alert("Vui lòng thêm ít nhất 1 chu kỳ và giai đoạn.");
      console.log("Dữ liệu gửi đi:", {
        ...form.values,
        growthCycles: cycleStageList,
      });
    }
  };

  return (
    <Card withBorder shadow="sm" radius={4} p="lg">
      <Group mb={"md"}>
        <Button
          variant="subtle"
          radius={4}
          leftSection={<IconArrowLeft size={18} />}
          onClick={() => navigate(-1)}
        >
          Quay lại
        </Button>
        <Title order={3}>Tạo mới mùa vụ</Title>
      </Group>
      <Stepper active={activeStep} onStepClick={setActiveStep} my="md">
        <Stepper.Step label="Bước 1" description="Thông tin cơ bản" />
        <Stepper.Step label="Bước 2" description="Chu kỳ & giai đoạn" />
      </Stepper>

      <form onSubmit={form.onSubmit(nextStep)}>
        {activeStep === 0 && (
          <Stack>
            <TextInput
              label="Tên mùa vụ"
              radius={4}
              {...form.getInputProps("name")}
            />
            <NumberInput
              label="Thời gian ước tính (ngày)"
              min={1}
              radius={4}
              {...form.getInputProps("estimatedDuration")}
            />
            <Select
              label="Cây trồng"
              data={cropOptions}
              radius={4}
              {...form.getInputProps("cropId")}
            />
          </Stack>
        )}

        {activeStep === 1 && (
          <Stack>
            <Select
              label="Chu kỳ sinh trưởng"
              data={growthCycleOptions}
              value={currentCycle}
              onChange={setCurrentCycle}
              placeholder="Chọn 1 chu kỳ"
              clearable
              radius={4}
            />

            <MultiSelect
              label="Giai đoạn tương ứng"
              data={growthStageOptions}
              value={currentStages}
              onChange={setCurrentStages}
              placeholder="Chọn nhiều giai đoạn"
              radius={4}
            />

            <Group justify="flex-end">
              <Button
                variant="outline"
                onClick={addCycleStage}
                disabled={!currentCycle || currentStages.length === 0}
                radius={4}
              >
                + Thêm chu kỳ
              </Button>
            </Group>

            {cycleStageList.length > 0 && (
              <Stack mt="md">
                <Title order={5}>Các chu kỳ đã chọn:</Title>
                {cycleStageList.map((item, index) => {
                  const cycleLabel =
                    growthCycleOptions.find((c) => c.value === item.cycleId)
                      ?.label || item.cycleId;
                  const stageLabels = item.stageIds
                    .map(
                      (id) =>
                        growthStageOptions.find((s) => s.value === id)?.label ||
                        id
                    )
                    .join(", ");
                  return (
                    <Box
                      key={index}
                      p="sm"
                      style={{ border: "1px solid #ccc", borderRadius: 6 }}
                    >
                      <Group justify="space-between">
                        <div>
                          <strong>{cycleLabel}</strong>: {stageLabels}
                        </div>
                        <Button
                          variant="subtle"
                          color="red"
                          onClick={() => removeCycle(index)}
                          radius={4}
                        >
                          Xoá
                        </Button>
                      </Group>
                    </Box>
                  );
                })}
              </Stack>
            )}
          </Stack>
        )}

        <Group justify="space-between" mt="md">
          {activeStep > 0 && (
            <Button
              variant="default"
              onClick={() => setActiveStep(0)}
              radius={4}
            >
              Quay lại
            </Button>
          )}
          <Button type="submit" radius={4}>
            {activeStep === 1 ? "Tạo mới" : "Tiếp tục"}
          </Button>
        </Group>
      </form>
    </Card>
  );
};

export default SeasonManagementGrowthAddPage;
