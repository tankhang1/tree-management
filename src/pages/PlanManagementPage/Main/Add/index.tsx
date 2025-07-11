import {
  Button,
  Card,
  Group,
  Select,
  Stack,
  Title,
  Stepper,
  MultiSelect,
  Text,
  ScrollArea,
  TextInput,
  SimpleGrid,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useState } from "react";
import {
  IconMapPin,
  IconChristmasBall,
  IconArrowLeft,
} from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { type ZoneCardProps } from "./components/ZoneCard";
import ZoneCard from "./components/ZoneCard";
import type { AreaCardProps } from "./components/AreaCard";
import AreaCard from "./components/AreaCard";
import type { LotCardProps } from "./components/LotCard";
import LotCard from "./components/LotCard";
import GrowthStageCard from "./components/GrowthStageCard";
const zoneCards: ZoneCardProps[] = [
  {
    code: "VT-001",
    name: "Vùng Trồng Tây Nguyên",
    zone: "Tây Nguyên",
    organization: "HTX Cà phê Buôn Ma Thuột",
    manager: "Nguyễn Thị Hạnh",
    area: "50.000 m²",
    soilType: "Đất đỏ bazan",
    terrain: ["Cao", "Thoai thoải"],
  },
  {
    code: "VT-002",
    name: "Vùng Trồng Miền Tây",
    zone: "Miền Tây",
    organization: "Hợp tác xã Nông nghiệp Cần Thơ",
    manager: "Trần Văn Bình",
    area: "65.000 m²",
    soilType: "Đất phù sa",
    terrain: ["Thấp", "Ngập nước"],
  },
  {
    code: "VT-003",
    name: "Vùng Trồng Đông Nam Bộ",
    zone: "Đông Nam Bộ",
    organization: "Công ty CP Nông Sản Đồng Nai",
    manager: "Lê Văn Trường",
    area: "80.000 m²",
    soilType: "Đất thịt pha cát",
    terrain: ["Bằng phẳng"],
  },
];
const areaCards: AreaCardProps[] = [
  {
    code: "KV-TN1",
    name: "Khu vực Buôn Hồ",
    zone: "Vùng Trồng Tây Nguyên",
    organization: "HTX Cà phê Buôn Ma Thuột",
    manager: "Nguyễn Văn Tài",
    area: "15.000 m²",
    soilType: "Đất đỏ",
    terrain: ["Cao"],
  },
  {
    code: "KV-MT3",
    name: "Khu vực Thốt Nốt",
    zone: "Vùng Trồng Miền Tây",
    organization: "Hợp tác xã Nông nghiệp Cần Thơ",
    manager: "Phạm Thị Hoa",
    area: "20.000 m²",
    soilType: "Đất phù sa ngập mặn",
    terrain: ["Thấp", "Ngập"],
  },
  {
    code: "KV-DN2",
    name: "Khu vực Biên Hòa",
    zone: "Vùng Trồng Đông Nam Bộ",
    organization: "Công ty CP Nông Sản Đồng Nai",
    manager: "Hoàng Văn Đức",
    area: "18.000 m²",
    soilType: "Đất cát pha",
    terrain: ["Bằng phẳng", "Dốc nhẹ"],
  },
];
const lotCards: LotCardProps[] = [
  {
    code: "LO-A1-01",
    name: "Lô A1-01",
    areaCode: "KV-A1",
    zone: "Vùng Trồng A",
    treeType: "Sầu riêng Monthong",
    treeCount: 120,
    areaSize: "3.000 m²",
    status: "Đang canh tác",
    soilType: "Đất thịt",
  },
  {
    code: "LO-B2-02",
    name: "Lô B2-02",
    areaCode: "KV-B2",
    zone: "Vùng Trồng B",
    treeType: "Xoài cát Hòa Lộc",
    treeCount: 80,
    areaSize: "2.500 m²",
    status: "Tạm ngưng",
    soilType: "Đất phù sa",
  },
  {
    code: "LO-C1-03",
    name: "Lô C1-03",
    areaCode: "KV-C1",
    zone: "Vùng Trồng C",
    treeType: "Chôm chôm Java",
    treeCount: 100,
    areaSize: "2.800 m²",
    status: "Đang canh tác",
    soilType: "Đất cát",
  },
];

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
        <Stepper.Step label="Bước 1" description="Thông tin mùa vụ" />
        <Stepper.Step label="Bước 2" description="Chọn vùng trồng" />
        <Stepper.Step label="Bước 3" description="Phân bổ giai đoạn & vật tư" />
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
            <Stack>
              <Text fw={"500"} fz={14}>
                Danh sách chu kì sinh trưởng
              </Text>

              <Group align="flex-start">
                <Card withBorder w={300} h={200}>
                  <Stack>
                    <Select
                      radius={4}
                      searchable
                      disabled
                      label="Tên chu kì sinh trưởng"
                      placeholder="Tên chu kì sinh trưởng"
                      data={["Chu kì 1", "Chu kì 2"]}
                    />
                    <MultiSelect
                      radius={4}
                      label="Danh sách giai đoạn sinh trưởng"
                      placeholder="Chọn giai đoạn sinh trưởng"
                      data={["Giai đoạn 1", "Giai đoạn 2"]}
                    />
                  </Stack>
                </Card>
                <Card withBorder w={300} h={200}>
                  <Stack>
                    <Select
                      radius={4}
                      searchable
                      disabled
                      label="Tên chu kì sinh trưởng"
                      placeholder="Tên chu kì sinh trưởng"
                      data={["Chu kì 1", "Chu kì 2"]}
                    />
                    <MultiSelect
                      radius={4}
                      label="Danh sách giai đoạn sinh trưởng"
                      placeholder="Chọn giai đoạn sinh trưởng"
                      data={["Giai đoạn 1", "Giai đoạn 2"]}
                    />
                  </Stack>
                </Card>
              </Group>
            </Stack>
          </Stack>
        )}

        {active === 1 && (
          <Stack>
            <TextInput
              radius={4}
              label="Tìm kiếm vùng trồng"
              placeholder="Tìm kiếm vùng trồng"
              leftSection={<IconMapPin size={16} />}
              {...form.getInputProps("zone")}
            />
            <ScrollArea>
              <Group gap="md">
                {zoneCards.map((area, index) => (
                  <ZoneCard key={area.code} {...area} isActive={index === 0} />
                ))}
              </Group>
            </ScrollArea>
            <TextInput
              radius={4}
              label="Tìm kiếm khu vực"
              placeholder="Tìm kiếm khu vực"
              leftSection={<IconMapPin size={16} />}
              {...form.getInputProps("area")}
            />
            <ScrollArea>
              <Group gap="md">
                {areaCards.map((area, index) => (
                  <AreaCard key={area.code} {...area} isActive={index === 0} />
                ))}
              </Group>
            </ScrollArea>
            <TextInput
              radius={4}
              label="Tìm kiếm lô"
              placeholder="Tìm kiếm lô"
              leftSection={<IconMapPin size={16} />}
              {...form.getInputProps("plot")}
            />
            <ScrollArea>
              <Group gap="md">
                {lotCards.map((area) => (
                  <LotCard key={area.code} {...area} />
                ))}
              </Group>
            </ScrollArea>
          </Stack>
        )}

        {active === 2 && (
          <Stack>
            {/* <Stack gap={"xs"}>
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
            </Stack> */}
            <Card withBorder radius={4} shadow="sm" p="md">
              <Stack>
                <Text fw={"bold"}>Chu kì 1</Text>

                <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="md">
                  <GrowthStageCard
                    stageName="Giai đoạn Nảy mầm"
                    materials={[]}
                    equipment={[]}
                    pesticides={[]}
                    onAddMaterial={() =>
                      form.insertListItem("stages.0.materials", {
                        item: "",
                        quantity: 0,
                      })
                    }
                    onAddEquipment={() =>
                      form.insertListItem("stages.0.equipment", {
                        item: "",
                        quantity: 0,
                      })
                    }
                    onAddPesticide={() =>
                      form.insertListItem("stages.0.pesticides", {
                        item: "",
                        quantity: 0,
                      })
                    }
                    onChangeMaterial={(i, key, val) =>
                      form.setFieldValue(`stages.0.materials.${i}.${key}`, val)
                    }
                    onChangeEquipment={(i, key, val) =>
                      form.setFieldValue(`stages.0.equipment.${i}.${key}`, val)
                    }
                    onChangePesticide={(i, key, val) =>
                      form.setFieldValue(`stages.0.pesticides.${i}.${key}`, val)
                    }
                  />
                  <GrowthStageCard
                    stageName="Giai đoạn sinh trưởng"
                    materials={[]}
                    equipment={[]}
                    pesticides={[]}
                    onAddMaterial={() =>
                      form.insertListItem("stages.0.materials", {
                        item: "",
                        quantity: 0,
                      })
                    }
                    onAddEquipment={() =>
                      form.insertListItem("stages.0.equipment", {
                        item: "",
                        quantity: 0,
                      })
                    }
                    onAddPesticide={() =>
                      form.insertListItem("stages.0.pesticides", {
                        item: "",
                        quantity: 0,
                      })
                    }
                    onChangeMaterial={(i, key, val) =>
                      form.setFieldValue(`stages.0.materials.${i}.${key}`, val)
                    }
                    onChangeEquipment={(i, key, val) =>
                      form.setFieldValue(`stages.0.equipment.${i}.${key}`, val)
                    }
                    onChangePesticide={(i, key, val) =>
                      form.setFieldValue(`stages.0.pesticides.${i}.${key}`, val)
                    }
                  />
                  <GrowthStageCard
                    stageName="Giai đoạn sinh trưởng"
                    materials={[]}
                    equipment={[]}
                    pesticides={[]}
                    onAddMaterial={() =>
                      form.insertListItem("stages.0.materials", {
                        item: "",
                        quantity: 0,
                      })
                    }
                    onAddEquipment={() =>
                      form.insertListItem("stages.0.equipment", {
                        item: "",
                        quantity: 0,
                      })
                    }
                    onAddPesticide={() =>
                      form.insertListItem("stages.0.pesticides", {
                        item: "",
                        quantity: 0,
                      })
                    }
                    onChangeMaterial={(i, key, val) =>
                      form.setFieldValue(`stages.0.materials.${i}.${key}`, val)
                    }
                    onChangeEquipment={(i, key, val) =>
                      form.setFieldValue(`stages.0.equipment.${i}.${key}`, val)
                    }
                    onChangePesticide={(i, key, val) =>
                      form.setFieldValue(`stages.0.pesticides.${i}.${key}`, val)
                    }
                  />
                  <GrowthStageCard
                    stageName="Giai đoạn sinh trưởng"
                    materials={[]}
                    equipment={[]}
                    pesticides={[]}
                    onAddMaterial={() =>
                      form.insertListItem("stages.0.materials", {
                        item: "",
                        quantity: 0,
                      })
                    }
                    onAddEquipment={() =>
                      form.insertListItem("stages.0.equipment", {
                        item: "",
                        quantity: 0,
                      })
                    }
                    onAddPesticide={() =>
                      form.insertListItem("stages.0.pesticides", {
                        item: "",
                        quantity: 0,
                      })
                    }
                    onChangeMaterial={(i, key, val) =>
                      form.setFieldValue(`stages.0.materials.${i}.${key}`, val)
                    }
                    onChangeEquipment={(i, key, val) =>
                      form.setFieldValue(`stages.0.equipment.${i}.${key}`, val)
                    }
                    onChangePesticide={(i, key, val) =>
                      form.setFieldValue(`stages.0.pesticides.${i}.${key}`, val)
                    }
                  />
                </SimpleGrid>
              </Stack>
            </Card>
            <Card withBorder radius={4} shadow="sm" p="md">
              <Stack>
                <Text fw={"bold"}>Chu kì 2</Text>

                <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="md">
                  <GrowthStageCard
                    stageName="Giai đoạn Nảy mầm"
                    materials={[]}
                    equipment={[]}
                    pesticides={[]}
                    onAddMaterial={() =>
                      form.insertListItem("stages.0.materials", {
                        item: "",
                        quantity: 0,
                      })
                    }
                    onAddEquipment={() =>
                      form.insertListItem("stages.0.equipment", {
                        item: "",
                        quantity: 0,
                      })
                    }
                    onAddPesticide={() =>
                      form.insertListItem("stages.0.pesticides", {
                        item: "",
                        quantity: 0,
                      })
                    }
                    onChangeMaterial={(i, key, val) =>
                      form.setFieldValue(`stages.0.materials.${i}.${key}`, val)
                    }
                    onChangeEquipment={(i, key, val) =>
                      form.setFieldValue(`stages.0.equipment.${i}.${key}`, val)
                    }
                    onChangePesticide={(i, key, val) =>
                      form.setFieldValue(`stages.0.pesticides.${i}.${key}`, val)
                    }
                  />
                  <GrowthStageCard
                    stageName="Giai đoạn sinh trưởng"
                    materials={[]}
                    equipment={[]}
                    pesticides={[]}
                    onAddMaterial={() =>
                      form.insertListItem("stages.0.materials", {
                        item: "",
                        quantity: 0,
                      })
                    }
                    onAddEquipment={() =>
                      form.insertListItem("stages.0.equipment", {
                        item: "",
                        quantity: 0,
                      })
                    }
                    onAddPesticide={() =>
                      form.insertListItem("stages.0.pesticides", {
                        item: "",
                        quantity: 0,
                      })
                    }
                    onChangeMaterial={(i, key, val) =>
                      form.setFieldValue(`stages.0.materials.${i}.${key}`, val)
                    }
                    onChangeEquipment={(i, key, val) =>
                      form.setFieldValue(`stages.0.equipment.${i}.${key}`, val)
                    }
                    onChangePesticide={(i, key, val) =>
                      form.setFieldValue(`stages.0.pesticides.${i}.${key}`, val)
                    }
                  />
                  <GrowthStageCard
                    stageName="Giai đoạn sinh trưởng"
                    materials={[]}
                    equipment={[]}
                    pesticides={[]}
                    onAddMaterial={() =>
                      form.insertListItem("stages.0.materials", {
                        item: "",
                        quantity: 0,
                      })
                    }
                    onAddEquipment={() =>
                      form.insertListItem("stages.0.equipment", {
                        item: "",
                        quantity: 0,
                      })
                    }
                    onAddPesticide={() =>
                      form.insertListItem("stages.0.pesticides", {
                        item: "",
                        quantity: 0,
                      })
                    }
                    onChangeMaterial={(i, key, val) =>
                      form.setFieldValue(`stages.0.materials.${i}.${key}`, val)
                    }
                    onChangeEquipment={(i, key, val) =>
                      form.setFieldValue(`stages.0.equipment.${i}.${key}`, val)
                    }
                    onChangePesticide={(i, key, val) =>
                      form.setFieldValue(`stages.0.pesticides.${i}.${key}`, val)
                    }
                  />
                  <GrowthStageCard
                    stageName="Giai đoạn sinh trưởng"
                    materials={[]}
                    equipment={[]}
                    pesticides={[]}
                    onAddMaterial={() =>
                      form.insertListItem("stages.0.materials", {
                        item: "",
                        quantity: 0,
                      })
                    }
                    onAddEquipment={() =>
                      form.insertListItem("stages.0.equipment", {
                        item: "",
                        quantity: 0,
                      })
                    }
                    onAddPesticide={() =>
                      form.insertListItem("stages.0.pesticides", {
                        item: "",
                        quantity: 0,
                      })
                    }
                    onChangeMaterial={(i, key, val) =>
                      form.setFieldValue(`stages.0.materials.${i}.${key}`, val)
                    }
                    onChangeEquipment={(i, key, val) =>
                      form.setFieldValue(`stages.0.equipment.${i}.${key}`, val)
                    }
                    onChangePesticide={(i, key, val) =>
                      form.setFieldValue(`stages.0.pesticides.${i}.${key}`, val)
                    }
                  />
                </SimpleGrid>
              </Stack>
            </Card>
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
