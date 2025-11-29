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
import { useSeasonStore, type CycleStage } from "../../../zustand/seasonStore";

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

export interface SeedOption {
  code: string;
  cropName: string;
  seedName: string;
  description: string;
  image: string;
}

export interface CropOption {
  code: string;
  name: string;
  seed: string;
  harvestMethod: string;
  growthCycle: string;
  note?: string;
  image: string;
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
  const { addSeason } = useSeasonStore();

  const [type, setType] = useState<"crop" | "seed" | "seed-detail">("crop");
  const [activeStep, setActiveStep] = useState(0);
  const [cycleStageList, setCycleStageList] = useState<CycleStage[]>([]);
  const [openedFilter, setOpenedFilter] = useState(false);

  const [selectedCropCode, setSelectedCropCode] = useState<string>("");
  const [selectedSeedCode, setSelectedSeedCode] = useState<string>("");
  const [selectedSeedDetails, setSelectedSeedDetails] = useState<any[]>([]);

  const form = useForm({
    initialValues: {
      name: "",
      estimatedDuration: 0,
      cropId: "",
    },
    validate: {
      name: (value) =>
        value.trim().length === 0 ? "Tên mùa vụ không được để trống" : null,
      estimatedDuration: (value) =>
        value <= 0 ? "Thời gian phải lớn hơn 0" : null,
    },
  });

  const [currentCycle, setCurrentCycle] = useState<string | null>(null);
  const [currentStages, setCurrentStages] = useState<string[]>([]);

  const addCycleStage = () => {
    if (!currentCycle || currentStages.length === 0) return;

    setCycleStageList((prev) => [
      ...prev,
      { cycleId: currentCycle, stageIds: currentStages },
    ]);
    setCurrentCycle(null);
    setCurrentStages([]);
  };

  const removeCycleStage = (index: number) => {
    setCycleStageList((prev) => prev.filter((_, i) => i !== index));
  };

  const nextStep = () => {
    if (activeStep === 0) {
      const validation = form.validate();
      if (validation.hasErrors) return;
      setActiveStep(1);
      return;
    }

    if (activeStep === 1) {
      if (cycleStageList.length === 0) {
        alert("Vui lòng thêm ít nhất 1 chu kỳ và giai đoạn.");
        return;
      }
      setActiveStep(2);
      return;
    }

    if (activeStep === 2) {
      const selectedCrop = cropOptions.find((c) => c.code === selectedCropCode);
      const selectedSeed = seedOptions.find((s) => s.code === selectedSeedCode);

      const payload = {
        name: form.values.name,
        estimatedDuration: form.values.estimatedDuration,
        cropId: selectedCropCode || "",
        selectedCrop,
        selectedSeed,
        selectedSeedDetails,
        growthCycles: cycleStageList,
      };

      addSeason(payload as any);
      setActiveStep(3);
      return;
    }
  };

  return (
    <Card withBorder shadow="sm" radius={4} p="lg">
      <Group mb="md">
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
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQjPNbBpZeXnXfTuA6AWek-Kj8NYEVbYdG6ayi5bIWarDuryXDrILdKMTd597quLD0PBKM&usqp=CAU"
              w={200}
              fit="cover"
            />
            <Text fz="h2" ta="center">
              Thêm mới mùa vụ thành công
            </Text>
            <Text fz="md" ta="center" c="dimmed">
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
          <Stack gap="xs">
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
              <Text fz={14} fw={500}>
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
                Tìm kiếm
              </Button>
            </Group>
            <CropCards
              selected={selectedCropCode}
              plants={cropOptions}
              isCheckbox={false}
              isTouchable
              isDelete={false}
              onSelect={setSelectedCropCode}
            />

            <Group align="center">
              <Text fz={14} fw={500}>
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
                Tìm kiếm
              </Button>
            </Group>
            <SeedCards
              isCheckbox={false}
              isTouchable
              selected={selectedSeedCode}
              seeds={seedOptions}
              onSelect={setSelectedSeedCode}
              isDelete={false}
            />

            <Group align="center">
              <Text fz={14} fw={500}>
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
                Tìm kiếm
              </Button>
            </Group>
            <SeedDetailCards isTouchable={true} isDelete />
          </Stack>
        )}

        {activeStep === 1 && (
          <Stack>
            <Select
              searchable
              clearable
              label="Chu kỳ sinh trưởng"
              data={growthCycleOptions}
              value={currentCycle}
              onChange={setCurrentCycle}
              placeholder="Chọn 1 chu kỳ"
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
                          <Group justify="space-between" w="100%" pr="lg">
                            <Text fw={500}>{cycleLabel}</Text>
                            <Button
                              color="red"
                              variant="light"
                              radius={4}
                              onClick={(e) => {
                                e.stopPropagation();
                                removeCycleStage(index);
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

        {activeStep === 2 && <ConfirmStep />}

        {activeStep < 3 && (
          <Group justify="space-between" mt="md">
            <Button
              variant="default"
              onClick={() => setActiveStep((prev) => (prev > 0 ? prev - 1 : 0))}
              radius={4}
            >
              Quay lại
            </Button>

            <Button type="submit" radius={4}>
              {activeStep === 2 ? "Hoàn thành" : "Tiếp tục"}
            </Button>
          </Group>
        )}
      </form>

      <Modal
        opened={openedFilter}
        onClose={() => setOpenedFilter(false)}
        title={
          type === "crop"
            ? "Tìm kiếm cây trồng"
            : type === "seed"
            ? "Tìm kiếm giống cây trồng"
            : "Tìm kiếm hạt giống"
        }
        size="lg"
      >
        <Stack gap="xs">
          <Select
            searchable
            clearable
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
          <CropCards
            selected={selectedCropCode}
            plants={cropOptions}
            onSelect={setSelectedCropCode}
          />

          {(type === "seed" || type === "seed-detail") && (
            <Stack gap="xs">
              <TextInput
                label="Giống cây trồng"
                leftSection={<IconSearch size={18} />}
                placeholder="Tìm kiếm giống cây trồng"
                radius={4}
                flex={1}
              />

              <SeedCards
                selected={selectedSeedCode}
                seeds={seedOptions}
                onSelect={setSelectedSeedCode}
              />
            </Stack>
          )}

          {type === "seed-detail" && (
            <Stack gap="xs">
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
