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
  Accordion,
  Text,
  Image,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconArrowLeft, IconSearch } from "@tabler/icons-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SeedCard from "./components/SeedCard";
import CropCards from "./components/CropCards";
import SeedCards from "./components/SeedCards";
import ConfirmStep from "./components/ConfirmStep";
import Scrollable from "../../../../components/Scrollable";
import { cropOptions, seedOptions } from "../../../AreaManagementPage/Row/Add";

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
export interface SeedOption {
  code: string;
  cropName: string;
  seedName: string;
  description: string;
  image: string; // URL hoặc base64 string
}
export interface CropOption {
  code: string;
  name: string;
  seed: string;
  harvestMethod: string;
  growthCycle: string;
  note?: string;
  image: string; // URL or base64
}

const SeasonManagementGrowthAddPage = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [cycleStageList, setCycleStageList] = useState<CycleStage[]>([]);
  const [selectedSeeds, setSelectedSeeds] = useState<string[]>([]);

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
        <Stepper.Step label="Bước 3" description="Xác nhận" />
        <Stepper.Completed>
          <Stack align="center" justify="center" mt="xl">
            <Image
              src={
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQjPNbBpZeXnXfTuA6AWek-Kj8NYEVbYdG6ayi5bIWarDuryXDrILdKMTd597quLD0PBKM&usqp=CAU"
              }
              w={200}
              fit="cover"
            />
            <Text fz={"h2"} ta="center">
              Thêm mới mùa vụ thành công
            </Text>
            <Text fz={"md"} ta="center" c="dimmed">
              Thêm mới mùa vụ thành công, bạn có thể xem lại trong danh sách mùa
              vụ hoặc tiếp tục thêm mới mùa vụ khác.
              <br />
              Hoặc bạn có thể quay lại trang quản lý mùa vụ để xem danh sách các
              mùa vụ.
            </Text>

            <Button size="md" mt="md" radius={4} onClick={() => navigate(-1)}>
              Xác nhận
            </Button>
          </Stack>
        </Stepper.Completed>
      </Stepper>

      <form onSubmit={form.onSubmit(nextStep)}>
        {activeStep === 0 && (
          <Stack gap={"xs"}>
            <TextInput
              label="Mùa vụ"
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
            <Text fw={500} fz={15}>
              Loại cây trồng (chọn nhiều)
            </Text>
            <TextInput
              leftSection={<IconSearch size={18} />}
              placeholder="Tìm kiếm loại cây trồng"
              radius={4}
            />
            <CropCards selected="" plants={cropOptions} onSelect={() => {}} />
            <Text fw={500} fz={15}>
              Giống cây trồng (chọn nhiều)
            </Text>
            <TextInput
              leftSection={<IconSearch size={18} />}
              placeholder="Tìm kiếm giống cây trồng"
              radius={4}
            />
            <SeedCards selected="" seeds={seedOptions} onSelect={() => {}} />
            <Text fw={500} fz={15}>
              Hạt giống (chọn nhiều)
            </Text>
            <TextInput
              leftSection={<IconSearch size={18} />}
              placeholder="Tìm kiếm hạt giống"
              radius={4}
            />
            <Scrollable h={450}>
              <Group wrap="nowrap" align="flex-start" p={"xs"}>
                <SeedCard
                  backgroundImage="https://food-map.s3.ap-southeast-1.amazonaws.com/news/2021/03/sau-rieng-ri6-3.jpg"
                  seedCode="SR-RI6"
                  name="Hạt giống RI6"
                  provider="Công ty giống cây trồng"
                  origin="Việt Nam"
                  germinationRate={85}
                  yield={25}
                  description="Giống RI6 cho năng suất cao, cơm vàng đậm, vị ngọt thơm"
                  onClick={() => {
                    setSelectedSeeds((prev) =>
                      prev.includes("SR-RI6")
                        ? prev.filter((s) => s !== "SR-RI6")
                        : [...prev, "SR-RI6"]
                    );
                  }}
                  isActive={selectedSeeds.includes("SR-RI6")}
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
                  onClick={() => {
                    setSelectedSeeds((prev) =>
                      prev.includes("SR-RI2")
                        ? prev.filter((s) => s !== "SR-RI2")
                        : [...prev, "SR-RI2"]
                    );
                  }}
                  isActive={selectedSeeds.includes("SR-RI2")}
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
                  onClick={() => {
                    setSelectedSeeds((prev) =>
                      prev.includes("SR-RI3")
                        ? prev.filter((s) => s !== "SR-RI3")
                        : [...prev, "SR-RI3"]
                    );
                  }}
                  isActive={selectedSeeds.includes("SR-RI3")}
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
                  onClick={() => {
                    setSelectedSeeds((prev) =>
                      prev.includes("SR-RI4")
                        ? prev.filter((s) => s !== "SR-RI4")
                        : [...prev, "SR-RI4"]
                    );
                  }}
                  isActive={selectedSeeds.includes("SR-RI4")}
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
                  onClick={() => {
                    setSelectedSeeds((prev) =>
                      prev.includes("SR-RI5")
                        ? prev.filter((s) => s !== "SR-RI5")
                        : [...prev, "SR-RI5"]
                    );
                  }}
                  isActive={selectedSeeds.includes("SR-RI5")}
                />
              </Group>
            </Scrollable>
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
                          <Group justify="space-between" w="100%" pr={"lg"}>
                            <Text fw={500}>{cycleLabel}</Text>
                            <Button color="red" variant="light" radius={4}>
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
        {activeStep === 2 && <ConfirmStep />}
        {activeStep < 3 && (
          <Group justify="space-between" mt="md">
            <Button
              variant="default"
              onClick={() => setActiveStep(0)}
              radius={4}
            >
              Quay lại
            </Button>

            <Button onClick={() => setActiveStep(activeStep + 1)} radius={4}>
              {activeStep === 2 ? "Hoàn thành" : "Tiếp tục"}
            </Button>
          </Group>
        )}
      </form>
    </Card>
  );
};

export default SeasonManagementGrowthAddPage;
