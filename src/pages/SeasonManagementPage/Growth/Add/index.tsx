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
  Modal,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconArrowLeft, IconSearch } from "@tabler/icons-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CropCards from "./components/CropCards";
import SeedCards from "./components/SeedCards";
import ConfirmStep from "./components/ConfirmStep";
import { cropOptions, seedOptions } from "../../../AreaManagementPage/Row/Add";
import SeedDetailCards from "../../../AreaManagementPage/Region/Add/components/SeedDetailCards";

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

export const plantGroups = [
  { value: "fruit", label: "Cây ăn trái" },
  { value: "timber", label: "Cây gỗ" },
  { value: "vegetable", label: "Rau củ" },
  { value: "industrial", label: "Cây công nghiệp" },
  { value: "ornamental", label: "Cây cảnh" },
];
const SeasonManagementGrowthAddPage = () => {
  const navigate = useNavigate();
  const [type, setType] = useState<"crop" | "seed" | "seed-detail">("crop");
  const [activeStep, setActiveStep] = useState(0);
  const [cycleStageList, setCycleStageList] = useState<CycleStage[]>([]);
  const [openedFilter, setOpenedFilter] = useState(false);
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
            <Group align="center">
              <Text fz={14} fw={"500"}>
                Cây trồng
              </Text>
              <Button
                variant="outline"
                radius={4}
                onClick={() => {
                  setOpenedFilter(true);
                  setType("crop");
                }}
              >
                Thêm mới
              </Button>
            </Group>
            <CropCards
              selected=""
              plants={cropOptions}
              isCheckbox={false}
              isTouchable={false}
              onSelect={() => {}}
              isDelete={true}
            />
            <Group align="center">
              <Text fz={14} fw={"500"}>
                Giống cây trồng
              </Text>

              <Button
                variant="outline"
                radius={4}
                onClick={() => {
                  setOpenedFilter(true);
                  setType("seed");
                }}
              >
                Thêm mới
              </Button>
            </Group>
            <SeedCards
              isCheckbox={false}
              isTouchable={false}
              selected=""
              seeds={seedOptions}
              onSelect={() => {}}
              isDelete
            />

            <Group align="center">
              <Text fz={14} fw={"500"}>
                Hạt giống
              </Text>
              <Button
                variant="outline"
                radius={4}
                onClick={() => {
                  setOpenedFilter(true);
                  setType("seed-detail");
                }}
              >
                Thêm mới
              </Button>
            </Group>
            <SeedDetailCards isTouchable={false} isDelete={true} />
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
      <Modal
        opened={openedFilter}
        onClose={() => setOpenedFilter(false)}
        title="Tìm kiếm cây trồng"
        size="lg"
      >
        <Stack gap={"xs"}>
          <Select
            label="Nhóm cây"
            placeholder="Chọn nhóm cây"
            data={plantGroups}
            radius={4}
          />

          <TextInput
            label="Cây trồng"
            leftSection={<IconSearch size={18} />}
            placeholder="Tìm kiếm loại cây trồng"
            radius={4}
          />
          <CropCards selected="" plants={cropOptions} onSelect={() => {}} />
          {(type === "seed" || type === "seed-detail") && (
            <Stack gap={"xs"}>
              <TextInput
                label="Giống cây trồng"
                leftSection={<IconSearch size={18} />}
                placeholder="Tìm kiếm giống cây trồng"
                radius={4}
                flex={1}
              />

              <SeedCards selected="" seeds={seedOptions} onSelect={() => {}} />
            </Stack>
          )}

          {type === "seed-detail" && (
            <Stack gap={"xs"}>
              <TextInput
                label="Hạt giống"
                leftSection={<IconSearch size={18} />}
                placeholder="Tìm kiếm hạt giống"
                radius={4}
                flex={1}
              />

              <SeedDetailCards isMultiple />
            </Stack>
          )}
          <Group justify="flex-end">
            <Button radius={4} onClick={() => setOpenedFilter(false)}>
              Xác nhận
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Card>
  );
};

export default SeasonManagementGrowthAddPage;
