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
  TextInput,
  SimpleGrid,
  Image,
  SegmentedControl,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useState } from "react";
import {
  IconMapPin,
  IconChristmasBall,
  IconArrowLeft,
  IconSearch,
} from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { type ZoneCardProps } from "./components/ZoneCard";
import ZoneCard from "./components/ZoneCard";
import type { AreaCardProps } from "./components/AreaCard";
import AreaCard from "./components/AreaCard";
import type { LotCardProps } from "./components/LotCard";
import LotCard from "./components/LotCard";
import GrowthStageCard from "./components/GrowthStageCard";
import ConfirmStep from "./components/ConfirmStep";
import Scrollable from "../../../../components/Scrollable";
import SeedDetailCards from "../../../AreaManagementPage/Region/Add/components/SeedDetailCards";
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
  {
    code: "VT-004",
    name: "Vùng Trồng Trung Du Bắc Bộ",
    zone: "Bắc Bộ",
    organization: "HTX Nông nghiệp Thái Nguyên",
    manager: "Phạm Thị Lan",
    area: "45.000 m²",
    soilType: "Đất đồi",
    terrain: ["Đồi thấp", "Dốc nhẹ"],
  },
  {
    code: "VT-005",
    name: "Vùng Trồng Bắc Trung Bộ",
    zone: "Bắc Trung Bộ",
    organization: "Công ty TNHH Nông nghiệp Thanh Hóa",
    manager: "Ngô Văn Minh",
    area: "70.000 m²",
    soilType: "Đất cát pha",
    terrain: ["Bằng phẳng", "Ven biển"],
  },
  {
    code: "VT-006",
    name: "Vùng Trồng Tây Bắc",
    zone: "Tây Bắc",
    organization: "HTX Nông sản Sơn La",
    manager: "Lò Văn Dũng",
    area: "55.000 m²",
    soilType: "Đất feralit",
    terrain: ["Đồi núi", "Cao"],
  },
  {
    code: "VT-007",
    name: "Vùng Trồng Duyên Hải Nam Trung Bộ",
    zone: "Nam Trung Bộ",
    organization: "Công ty TNHH Hải Nông",
    manager: "Trịnh Thị Nga",
    area: "62.000 m²",
    soilType: "Đất cát ven biển",
    terrain: ["Khô hạn", "Thoai thoải"],
  },
  {
    code: "VT-008",
    name: "Vùng Trồng Đồng Bằng Bắc Bộ",
    zone: "Bắc Bộ",
    organization: "HTX Lúa Gạo Hưng Yên",
    manager: "Nguyễn Văn Thắng",
    area: "90.000 m²",
    soilType: "Đất phù sa cổ",
    terrain: ["Thấp", "Bằng phẳng"],
  },
  {
    code: "VT-009",
    name: "Vùng Trồng Cao Nguyên Lâm Đồng",
    zone: "Tây Nguyên",
    organization: "HTX Rau Củ Quả Đà Lạt",
    manager: "Trần Thị Kim Ngân",
    area: "48.000 m²",
    soilType: "Đất đỏ bazan",
    terrain: ["Cao", "Mát mẻ"],
  },
  {
    code: "VT-010",
    name: "Vùng Trồng Phú Quốc",
    zone: "Đảo",
    organization: "Công ty TNHH Tiêu Phú Quốc",
    manager: "Đào Văn Cường",
    area: "30.000 m²",
    soilType: "Đất bazan pha cát",
    terrain: ["Gò đồi", "Ven biển"],
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
  {
    code: "KV-BB1",
    name: "Khu vực Lương Tài",
    zone: "Vùng Trồng Đồng Bằng Bắc Bộ",
    organization: "HTX Lúa Gạo Hưng Yên",
    manager: "Lê Thị Mai",
    area: "22.000 m²",
    soilType: "Đất phù sa cổ",
    terrain: ["Bằng phẳng"],
  },
  {
    code: "KV-TB2",
    name: "Khu vực Mai Sơn",
    zone: "Vùng Trồng Tây Bắc",
    organization: "HTX Nông sản Sơn La",
    manager: "Lò Văn Minh",
    area: "25.000 m²",
    soilType: "Đất feralit",
    terrain: ["Đồi núi", "Cao"],
  },
  {
    code: "KV-LD3",
    name: "Khu vực Cầu Đất",
    zone: "Vùng Trồng Tây Nguyên",
    organization: "HTX Rau Củ Quả Đà Lạt",
    manager: "Trần Thị Ngọc",
    area: "17.000 m²",
    soilType: "Đất đỏ bazan",
    terrain: ["Cao", "Thoai thoải"],
  },
  {
    code: "KV-NT5",
    name: "Khu vực Ninh Hòa",
    zone: "Vùng Trồng Duyên Hải Nam Trung Bộ",
    organization: "Công ty TNHH Hải Nông",
    manager: "Nguyễn Văn Hậu",
    area: "14.000 m²",
    soilType: "Đất cát ven biển",
    terrain: ["Khô", "Bằng phẳng"],
  },
  {
    code: "KV-BTB1",
    name: "Khu vực Quảng Xương",
    zone: "Vùng Trồng Bắc Trung Bộ",
    organization: "Công ty TNHH Nông nghiệp Thanh Hóa",
    manager: "Ngô Văn Đạt",
    area: "19.000 m²",
    soilType: "Đất cát pha",
    terrain: ["Ven biển", "Thoai thoải"],
  },
  {
    code: "KV-PQ2",
    name: "Khu vực Dương Đông",
    zone: "Vùng Trồng Phú Quốc",
    organization: "Công ty TNHH Tiêu Phú Quốc",
    manager: "Trần Văn Giang",
    area: "10.000 m²",
    soilType: "Đất bazan pha cát",
    terrain: ["Gò đồi", "Ẩm"],
  },
  {
    code: "KV-BB3",
    name: "Khu vực Văn Giang",
    zone: "Vùng Trồng Đồng Bằng Bắc Bộ",
    organization: "HTX Lúa Gạo Hưng Yên",
    manager: "Nguyễn Thị Hồng",
    area: "21.500 m²",
    soilType: "Đất thịt nhẹ",
    terrain: ["Bằng phẳng", "Dễ thoát nước"],
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
  {
    code: "LO-D3-04",
    name: "Lô D3-04",
    areaCode: "KV-D3",
    zone: "Vùng Trồng Tây Nguyên",
    treeType: "Cà phê Robusta",
    treeCount: 200,
    areaSize: "4.000 m²",
    status: "Đang canh tác",
    soilType: "Đất đỏ bazan",
  },
  {
    code: "LO-E2-05",
    name: "Lô E2-05",
    areaCode: "KV-E2",
    zone: "Vùng Trồng Miền Tây",
    treeType: "Dừa xiêm",
    treeCount: 150,
    areaSize: "3.200 m²",
    status: "Đang canh tác",
    soilType: "Đất phù sa ngập mặn",
  },
  {
    code: "LO-F1-06",
    name: "Lô F1-06",
    areaCode: "KV-F1",
    zone: "Vùng Trồng Đông Nam Bộ",
    treeType: "Mít Thái",
    treeCount: 90,
    areaSize: "2.600 m²",
    status: "Tạm ngưng",
    soilType: "Đất cát pha",
  },
  {
    code: "LO-G2-07",
    name: "Lô G2-07",
    areaCode: "KV-G2",
    zone: "Vùng Trồng Bắc Trung Bộ",
    treeType: "Thanh long ruột đỏ",
    treeCount: 130,
    areaSize: "2.900 m²",
    status: "Đang canh tác",
    soilType: "Đất pha cát",
  },
  {
    code: "LO-H4-08",
    name: "Lô H4-08",
    areaCode: "KV-H4",
    zone: "Vùng Trồng Tây Bắc",
    treeType: "Mận hậu",
    treeCount: 110,
    areaSize: "3.100 m²",
    status: "Ngừng canh tác",
    soilType: "Đất feralit",
  },
  {
    code: "LO-I5-09",
    name: "Lô I5-09",
    areaCode: "KV-I5",
    zone: "Vùng Trồng Đồng Bằng Bắc Bộ",
    treeType: "Lúa OM5451",
    treeCount: 5000, // lúa tính theo bụi/cụm
    areaSize: "5.000 m²",
    status: "Đang canh tác",
    soilType: "Đất phù sa cổ",
  },
  {
    code: "LO-J3-10",
    name: "Lô J3-10",
    areaCode: "KV-J3",
    zone: "Vùng Trồng Duyên Hải Nam Trung Bộ",
    treeType: "Nho xanh",
    treeCount: 180,
    areaSize: "3.300 m²",
    status: "Đang canh tác",
    soilType: "Đất cát ven biển",
  },
];

export interface CropOption {
  code: string;
  name: string;
  seed: string;
  harvestMethod: string;
  growthCycle: string;
  note?: string;
  image: string; // URL or base64
}

const PlanManagementMainAddPage = () => {
  const navigate = useNavigate();
  const [active, setActive] = useState(0);
  const [type, setType] = useState<"region" | "area" | "plot">("region");
  const [selectedZone, setSelectedZone] = useState<string>("");
  const form = useForm({
    initialValues: {
      seasonId: "",
      startDate: null,
      name: "",
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

  const nextStep = () => setActive((current) => Math.min(current + 1, 5));
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
        <Stepper.Step label="Bước 2" description="Thông tin canh tác" />
        <Stepper.Step label="Bước 3" description="Phân bổ giai đoạn & vật tư" />
        <Stepper.Step label="Bước 4" description="Xác nhận" />
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
              Thêm mới kế hoạch mùa vụ thành công
            </Text>
            <Text fz={"md"} ta="center" c="dimmed">
              Kế hoạch mùa vụ của bạn đã được tạo thành công. Bạn có thể xem lại
              thông tin chi tiết trong danh sách kế hoạch mùa vụ.
            </Text>

            <Button size="md" mt="md" radius={4} onClick={() => navigate(-1)}>
              Xác nhận
            </Button>
          </Stack>
        </Stepper.Completed>
      </Stepper>

      <form onSubmit={form.onSubmit((values) => console.log(values))}>
        {active === 0 && (
          <Stack>
            <TextInput
              radius={4}
              label="Kế hoạch"
              placeholder="Nhập tên kế hoạch"
              {...form.getInputProps("name")}
            />
            <Select
              searchable
              clearable
              radius={4}
              label="Mùa vụ"
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
                      searchable
                      clearable
                      radius={4}
                      searchable
                      disabled
                      label="Tên chu kì sinh trưởng"
                      placeholder="Tên chu kì sinh trưởng"
                      data={["Chu kì 1", "Chu kì 2"]}
                    />
                    <MultiSelect
                      searchable
                      clearable
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
                      clearable
                      disabled
                      label="Tên chu kì sinh trưởng"
                      placeholder="Tên chu kì sinh trưởng"
                      data={["Chu kì 1", "Chu kì 2"]}
                    />
                    <MultiSelect
                      radius={4}
                      searchable
                      clearable
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
          <Stack gap={"xs"}>
            <SegmentedControl
              value={type}
              radius={4}
              onChange={(value) => setType(value as "region" | "area" | "plot")}
              data={[
                { label: "Vùng trồng", value: "region" },
                { label: "Khu vực", value: "area" },
                { label: "Lô", value: "plot" },
              ]}
            />
            <TextInput
              radius={4}
              label="Vùng trồng"
              placeholder="Tìm kiếm vùng trồng"
              leftSection={<IconMapPin size={16} />}
              {...form.getInputProps("zone")}
            />
            <Scrollable h={250}>
              <Group gap="md" wrap="nowrap" align="flex-start">
                {zoneCards.map((area) => (
                  <ZoneCard
                    key={area.code}
                    {...area}
                    isActive={selectedZone === area.code}
                    onClick={() => {
                      setSelectedZone(area.code);
                      form.setFieldValue("zone", area.code);
                    }}
                  />
                ))}
              </Group>
            </Scrollable>
            {(type === "area" || type === "plot") && (
              <Stack gap={"xs"}>
                <TextInput
                  radius={4}
                  label="Khu vực"
                  placeholder="Tìm kiếm khu vực"
                  leftSection={<IconMapPin size={16} />}
                  {...form.getInputProps("area")}
                />
                <Scrollable h={250}>
                  <Group wrap="nowrap" gap="md" align="flex-start">
                    {areaCards.map((area) => (
                      <AreaCard
                        key={area.code}
                        {...area}
                        isActive={selectedZone === area.code}
                        onClick={() => {
                          form.setFieldValue("area", area.code);
                          setSelectedZone(area.code);
                        }}
                      />
                    ))}
                  </Group>
                </Scrollable>
              </Stack>
            )}
            {type === "plot" && (
              <Stack gap={"xs"}>
                <TextInput
                  radius={4}
                  label="Lô"
                  placeholder="Tìm kiếm lô"
                  leftSection={<IconMapPin size={16} />}
                  {...form.getInputProps("plot")}
                />
                <Scrollable h={250}>
                  <Group wrap="nowrap" gap="md" p={"xs"}>
                    {lotCards.map((area) => (
                      <LotCard
                        key={area.code}
                        isActive={form.values.plot === area.code}
                        {...area}
                        onClick={() => form.setFieldValue("plot", area.code)}
                      />
                    ))}
                  </Group>
                </Scrollable>
              </Stack>
            )}
            <TextInput
              label="Giống cây trồng"
              leftSection={<IconSearch size={18} />}
              radius={4}
              placeholder="Tìm kiếm giống cây trồng"
            />
            <SeedDetailCards isMultiple />
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
        {active === 3 && <ConfirmStep />}
        {active < 4 && (
          <Group justify="space-between" mt="xl">
            <Button
              radius={4}
              variant="default"
              onClick={prevStep}
              disabled={active === 0}
            >
              Quay lại
            </Button>
            {active < 3 ? (
              <Button radius={4} onClick={nextStep}>
                Tiếp theo
              </Button>
            ) : (
              <Button radius={4} onClick={nextStep} type="submit" color="green">
                Hoàn thành
              </Button>
            )}
          </Group>
        )}
      </form>
    </Card>
  );
};

export default PlanManagementMainAddPage;
