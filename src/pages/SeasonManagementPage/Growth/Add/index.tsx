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
  Card,
  ScrollAreaAutosize,
  Input,
  Accordion,
  Text,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconArrowLeft } from "@tabler/icons-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SeedCard from "./components/SeedCard";

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
    validate: {},
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
          <Stack gap={"xs"}>
            <TextInput
              label="Tên mùa vụ"
              radius={4}
              {...form.getInputProps("name")}
            />
            <NumberInput
              label="Thời gian diễn ra mùa vụ (ngày)"
              min={1}
              radius={4}
              {...form.getInputProps("estimatedDuration")}
            />
            <Select label="Nhóm cây" radius={4} />
            <Select label="Danh mục cây" radius={4} />
            <Stack>
              <Select
                label="Giống cây"
                placeholder="Chọn giống cây"
                radius={4}
              />
              <Input.Wrapper label="Chọn hạt giống cây">
                <ScrollAreaAutosize>
                  <Group wrap="nowrap">
                    <SeedCard
                      backgroundImage="https://food-map.s3.ap-southeast-1.amazonaws.com/news/2021/03/sau-rieng-ri6-3.jpg"
                      seedCode="SR-RI6"
                      name="Hạt giống RI6"
                      provider="Công ty giống cây trồng"
                      origin="Việt Nam"
                      germinationRate={85}
                      yield={25}
                      description="Giống RI6 cho năng suất cao, cơm vàng đậm, vị ngọt thơm"
                    />
                    <SeedCard
                      backgroundImage="https://food-map.s3.ap-southeast-1.amazonaws.com/news/2021/03/sau-rieng-ri6-3.jpg"
                      seedCode="SR-RI4"
                      name="Hạt giống RI4"
                      provider="Công ty giống cây trồng"
                      origin="Việt Nam"
                      germinationRate={85}
                      yield={25}
                      description="Giống RI6 cho năng suất cao, cơm vàng đậm, vị ngọt thơm"
                    />

                    <SeedCard
                      backgroundImage="https://food-map.s3.ap-southeast-1.amazonaws.com/news/2021/03/sau-rieng-ri6-3.jpg"
                      seedCode="SR-RI3"
                      name="Hạt giống RI3"
                      provider="Công ty giống cây trồng"
                      origin="Việt Nam"
                      germinationRate={85}
                      yield={25}
                      description="Giống RI6 cho năng suất cao, cơm vàng đậm, vị ngọt thơm"
                    />
                    <SeedCard
                      backgroundImage="https://food-map.s3.ap-southeast-1.amazonaws.com/news/2021/03/sau-rieng-ri6-3.jpg"
                      seedCode="SR-RI3"
                      name="Hạt giống RI3"
                      provider="Công ty giống cây trồng"
                      origin="Việt Nam"
                      germinationRate={85}
                      yield={25}
                      description="Giống RI6 cho năng suất cao, cơm vàng đậm, vị ngọt thơm"
                    />
                    <SeedCard
                      backgroundImage="https://food-map.s3.ap-southeast-1.amazonaws.com/news/2021/03/sau-rieng-ri6-3.jpg"
                      seedCode="SR-RI3"
                      name="Hạt giống RI3"
                      provider="Công ty giống cây trồng"
                      origin="Việt Nam"
                      germinationRate={85}
                      yield={25}
                      description="Giống RI6 cho năng suất cao, cơm vàng đậm, vị ngọt thơm"
                    />
                  </Group>
                </ScrollAreaAutosize>
              </Input.Wrapper>
            </Stack>
          </Stack>
        )}

        {activeStep === 1 && (
          <Stack>
            {/**Dạng drag & drop và trình bày như cột thư mục */}
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
                <Title order={5}>🌿 Chu kỳ sinh trưởng đã chọn:</Title>
                <Accordion multiple variant="separated">
                  {cycleStageList.map((item, index) => {
                    const cycleLabel =
                      growthCycleOptions.find((c) => c.value === item.cycleId)
                        ?.label || item.cycleId;
                    const stageLabels = item.stageIds.map(
                      (id) =>
                        growthStageOptions.find((s) => s.value === id)?.label ||
                        id
                    );

                    return (
                      <Accordion.Item key={index} value={`cycle-${index}`}>
                        <Accordion.Control>
                          <Group justify="space-between" w="100%">
                            <Text fw={500}>{cycleLabel}</Text>
                            <Button
                              size="xs"
                              color="red"
                              variant="light"
                              radius="xl"
                              onClick={(e) => {
                                e.stopPropagation(); // tránh trigger toggle accordion
                                removeCycle(index);
                              }}
                            >
                              Xoá
                            </Button>
                          </Group>
                        </Accordion.Control>
                        <Accordion.Panel>
                          <Stack gap={4}>
                            {stageLabels.map((stage, i) => (
                              <Text key={i} size="sm">
                                • {stage}
                              </Text>
                            ))}
                          </Stack>
                        </Accordion.Panel>
                      </Accordion.Item>
                    );
                  })}
                </Accordion>
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
