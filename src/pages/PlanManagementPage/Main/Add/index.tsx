import {
  Button,
  Card,
  Group,
  Select,
  Stack,
  Title,
  Stepper,
  NumberInput,
  MultiSelect,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useState } from "react";
import {
  IconPlant,
  IconMapPin,
  IconTool,
  IconVaccine,
  IconBox,
  IconChristmasBall,
  IconArrowLeft,
} from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";

const PlanManagementMainAddPage = () => {
  const navigate = useNavigate();
  const [active, setActive] = useState(0);

  const form = useForm({
    initialValues: {
      seasonId: "",
      startDate: null,
      endDate: null,
      zone: "",
      area: "",
      plot: "",
      row: "",
      growthStage: "",
      materials: [],
      equipment: [],
      pesticides: [],
    },
  });

  const handleAddMaterial = () => {
    form.insertListItem("materials", { item: "", quantity: 0 });
  };

  const handleAddEquipment = () => {
    form.insertListItem("equipment", { item: "", quantity: 0 });
  };

  const handleAddPesticide = () => {
    form.insertListItem("pesticides", { item: "", quantity: 0 });
  };

  const nextStep = () => setActive((current) => Math.min(current + 1, 2));
  const prevStep = () => setActive((current) => Math.max(current - 1, 0));

  return (
    <Card withBorder radius={4} p="lg">
      <Group mb={"md"}>
        <Button
          variant="subtle"
          radius={4}
          leftSection={<IconArrowLeft size={18} />}
          onClick={() => navigate(-1)}
        >
          Quay lại
        </Button>
        <Title order={3}>Tạo mới kế hoạch mùa vụ</Title>
      </Group>
      <Stepper active={active} onStepClick={setActive} mb="lg">
        <Stepper.Step label="Thông tin mùa vụ" />
        <Stepper.Step label="Chọn vùng trồng" />
        <Stepper.Step label="Phân bổ giai đoạn & vật tư" />
      </Stepper>

      <form onSubmit={form.onSubmit((values) => console.log(values))}>
        {active === 0 && (
          <Stack>
            <Select
              radius={4}
              label="Chọn mùa vụ"
              placeholder="Mùa Xuân 2025"
              data={["Mùa Xuân 2025", "Mùa Hè 2025"]}
              leftSection={<IconChristmasBall size={16} />}
              {...form.getInputProps("seasonId")}
            />
            <Select
              radius={4}
              label="Chọn chu kì sinh trưởng"
              placeholder="Chọn chu kì sinh trưởng"
              data={["Chu kì 1", "Chu kì 2"]}
            />
            <MultiSelect
              radius={4}
              label="Chọn giai đoạn sinh trưởng"
              placeholder="Chọn giai đoạn sinh trưởng"
              data={["Giai đoạn 1", "Giai đoạn 2"]}
            />
            <NumberInput
              label="Khoảng thời gian diễn ra (ngày)"
              placeholder="Khoảng thời gian diễn ra"
              radius={4}
            />
          </Stack>
        )}

        {active === 1 && (
          <Stack>
            <Select
              radius={4}
              label="Vùng trồng"
              placeholder="Vùng A"
              data={["Vùng A", "Vùng B"]}
              leftSection={<IconMapPin size={16} />}
              {...form.getInputProps("zone")}
            />
            <MultiSelect
              radius={4}
              label="Khu vực"
              placeholder="Khu vực A1"
              data={["Khu vực A1", "Khu vực B1"]}
              leftSection={<IconMapPin size={16} />}
            />
            <MultiSelect
              radius={4}
              label="Lô"
              placeholder="Lô A1-L1"
              data={["Lô A1-L1", "Lô B1-L1"]}
              leftSection={<IconMapPin size={16} />}
            />
          </Stack>
        )}

        {active === 2 && (
          <Stack>
            <Stack gap={"xs"}>
              <Select
                radius={4}
                label="Giai đoạn sinh trưởng"
                placeholder="Chọn giai đoạn"
                data={["Nảy mầm", "Sinh trưởng", "Ra hoa"]}
                leftSection={<IconPlant size={16} />}
                {...form.getInputProps("growthStage")}
              />

              <Stack pl={"md"} gap={"xs"}>
                <Title order={5}>Danh sách vật tư</Title>
                {form.values.materials.map((_, index) => (
                  <Group key={index} grow>
                    <Select
                      radius={4}
                      label="Vật tư"
                      placeholder="Phân NPK"
                      data={["Phân NPK", "Vôi bột"]}
                      leftSection={<IconBox size={16} />}
                      {...form.getInputProps(`materials.${index}.item`)}
                    />
                    <NumberInput
                      radius={4}
                      label="Số lượng"
                      placeholder="0"
                      min={0}
                      {...form.getInputProps(`materials.${index}.quantity`)}
                    />
                  </Group>
                ))}
                <Button
                  radius={4}
                  variant="light"
                  onClick={handleAddMaterial}
                  leftSection={<IconBox size={16} />}
                >
                  + Thêm vật tư
                </Button>

                <Title order={5}>Danh sách thiết bị</Title>
                {form.values.equipment.map((_, index) => (
                  <Group key={index} grow>
                    <Select
                      radius={4}
                      label="Thiết bị"
                      placeholder="Máy xịt"
                      data={["Máy xịt", "Bình tưới"]}
                      leftSection={<IconTool size={16} />}
                      {...form.getInputProps(`equipment.${index}.item`)}
                    />
                    <NumberInput
                      radius={4}
                      label="Số lượng"
                      placeholder="0"
                      min={0}
                      {...form.getInputProps(`equipment.${index}.quantity`)}
                    />
                  </Group>
                ))}
                <Button
                  radius={4}
                  variant="light"
                  onClick={handleAddEquipment}
                  leftSection={<IconTool size={16} />}
                >
                  + Thêm thiết bị
                </Button>

                <Title order={5}>Danh sách thuốc BVTV</Title>
                {form.values.pesticides.map((_, index) => (
                  <Group key={index} grow>
                    <Select
                      radius={4}
                      label="Thuốc BVTV"
                      placeholder="Confidor"
                      data={["Confidor", "Radiant"]}
                      leftSection={<IconVaccine size={16} />}
                      {...form.getInputProps(`pesticides.${index}.item`)}
                    />
                    <NumberInput
                      radius={4}
                      label="Số lượng"
                      placeholder="0"
                      min={0}
                      {...form.getInputProps(`pesticides.${index}.quantity`)}
                    />
                  </Group>
                ))}
                <Button
                  radius={4}
                  variant="light"
                  onClick={handleAddPesticide}
                  leftSection={<IconVaccine size={16} />}
                >
                  + Thêm thuốc BVTV
                </Button>
              </Stack>
            </Stack>
            <Stack gap={"xs"}>
              <Select
                radius={4}
                label="Giai đoạn sinh trưởng"
                placeholder="Chọn giai đoạn"
                data={["Nảy mầm", "Sinh trưởng", "Ra hoa"]}
                leftSection={<IconPlant size={16} />}
                {...form.getInputProps("growthStage")}
              />

              <Stack pl={"md"} gap={"xs"}>
                <Title order={5}>Danh sách vật tư</Title>
                {form.values.materials.map((_, index) => (
                  <Group key={index} grow>
                    <Select
                      radius={4}
                      label="Vật tư"
                      placeholder="Phân NPK"
                      data={["Phân NPK", "Vôi bột"]}
                      leftSection={<IconBox size={16} />}
                      {...form.getInputProps(`materials.${index}.item`)}
                    />
                    <NumberInput
                      radius={4}
                      label="Số lượng"
                      placeholder="0"
                      min={0}
                      {...form.getInputProps(`materials.${index}.quantity`)}
                    />
                  </Group>
                ))}
                <Button
                  radius={4}
                  variant="light"
                  onClick={handleAddMaterial}
                  leftSection={<IconBox size={16} />}
                >
                  + Thêm vật tư
                </Button>

                <Title order={5}>Danh sách thiết bị</Title>
                {form.values.equipment.map((_, index) => (
                  <Group key={index} grow>
                    <Select
                      radius={4}
                      label="Thiết bị"
                      placeholder="Máy xịt"
                      data={["Máy xịt", "Bình tưới"]}
                      leftSection={<IconTool size={16} />}
                      {...form.getInputProps(`equipment.${index}.item`)}
                    />
                    <NumberInput
                      radius={4}
                      label="Số lượng"
                      placeholder="0"
                      min={0}
                      {...form.getInputProps(`equipment.${index}.quantity`)}
                    />
                  </Group>
                ))}
                <Button
                  radius={4}
                  variant="light"
                  onClick={handleAddEquipment}
                  leftSection={<IconTool size={16} />}
                >
                  + Thêm thiết bị
                </Button>

                <Title order={5}>Danh sách thuốc BVTV</Title>
                {form.values.pesticides.map((_, index) => (
                  <Group key={index} grow>
                    <Select
                      radius={4}
                      label="Thuốc BVTV"
                      placeholder="Confidor"
                      data={["Confidor", "Radiant"]}
                      leftSection={<IconVaccine size={16} />}
                      {...form.getInputProps(`pesticides.${index}.item`)}
                    />
                    <NumberInput
                      radius={4}
                      label="Số lượng"
                      placeholder="0"
                      min={0}
                      {...form.getInputProps(`pesticides.${index}.quantity`)}
                    />
                  </Group>
                ))}
                <Button
                  radius={4}
                  variant="light"
                  onClick={handleAddPesticide}
                  leftSection={<IconVaccine size={16} />}
                >
                  + Thêm thuốc BVTV
                </Button>
              </Stack>
            </Stack>
          </Stack>
        )}

        <Group justify="space-between" mt="xl">
          <Button
            radius={4}
            variant="default"
            onClick={prevStep}
            disabled={active === 0}
          >
            Quay lại
          </Button>
          {active < 2 ? (
            <Button radius={4} onClick={nextStep}>
              Tiếp theo
            </Button>
          ) : (
            <Button radius={4} type="submit" color="green">
              Lưu kế hoạch
            </Button>
          )}
        </Group>
      </form>
    </Card>
  );
};

export default PlanManagementMainAddPage;
