import {
  Button,
  Group,
  Stepper,
  Select,
  Stack,
  Card,
  Title,
  Text,
  Box,
  Badge,
  Divider,
  Accordion,
  Autocomplete,
  Modal,
  SimpleGrid,
  Checkbox,
  TextInput,
  Radio,
  MultiSelect,
  Image,
  Textarea,
  SegmentedControl,
  Tooltip,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import {
  IconArrowLeft,
  IconCalendar,
  IconCertificate,
  IconSearch,
  IconShieldCheck,
  IconUser,
} from "@tabler/icons-react";
import { memo, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import RegionCardSelector from "./components/RegionCards";
import CropCards from "./components/CropCards";
import SeedCards from "./components/SeedCards";
import LotCard from "./components/LotCard";
import { useDisclosure } from "@mantine/hooks";
import { EmployeeCardList } from "../../../HRManagementPage/Team/Add/components/EmployeeCardList";
import { areaOptions, cropOptions, seedOptions } from "../../Row/Add";
import Scrollable from "../../../../components/Scrollable";
import CertificateCardList from "./components/CertificateCards";
import { useRegionStore, type AreaInfo } from "../../../zustand/regionStore";
import { usePlotStore } from "../../../zustand/plotStore";
import { useDepartmentStore } from "../../../zustand/departmentStore";
import { usePositionStore } from "../../../zustand/positionStore";
import { useSeedStore } from "../../../zustand/seedStore";
import { useCropGroupStore } from "../../../zustand/cropGroupStore";
import { useTreeStore } from "../../../zustand/treeStore";
export interface AreaOption {
  code: string;
  name: string;
  zone: string;
  orgUnit: string;
  employee: string;
  area: string;
  soilType: string;
  terrain: string[]; // VD: ["Cao", "Dốc"]
}
export interface SeedOption {
  code: string;
  cropName: string;
  seedName: string;
  description: string;
  image: string; // URL hoặc base64 string
}
export interface LotOption {
  code: string;
  name: string;
  zone: string;
  area: string;
  treeType: string;
  treeCount: number;
  areaSize: string;
  soilType: string;
  status: "Đang canh tác" | "Tạm ngưng" | "Chưa sử dụng";
}
export interface RegionOption {
  code: string;
  name: string;
  area: string;
  soilType: string;
  terrain: string[];
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

type TLotOption = {
  code: string;
  name: string;
  area: string;
  description: string;
};

type AreaType = {
  code: string;
  name: string;
  area: string;
  soilType: string;
  terrain: string[];
};

type CropInfo = {
  cropGroup: string;
  cropCode: string;
  seedCode: string;
  cropName: string;
  cultivar: string;
  seedName: string;
  image: string;
};

type PlotType = {
  id: string;
  areaCode: string;
  name: string;
  employee: string;
  cultivationMethod: string;
  crops: CropInfo[];
};
const lotOptions: TLotOption[] = [
  {
    code: "LO-A1",
    name: "Lô A1",
    area: "1.500 m²",
    description: "Địa hình dốc nhẹ, từ 48m đến 56m",
  },
  {
    code: "LO-B1",
    name: "Lô B1",
    area: "2.000 m²",
    description: "Địa hình dốc nhẹ, từ 48m đến 56m",
  },
  {
    code: "LO-C1",
    name: "Lô C1",
    area: "2.000 m²",
    description: "Địa hình dốc nhẹ, từ 48m đến 56m",
  },
  {
    code: "LO-D1",
    name: "Lô D1",
    area: "2.000 m²",
    description: "Địa hình dốc nhẹ, từ 48m đến 56m",
  },
];

export function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <Group gap={8} wrap="nowrap">
      <Text size="sm" c="dimmed" style={{ minWidth: 150 }}>
        {label}:
      </Text>
      <Text size="sm">{value}</Text>
    </Group>
  );
}
const AreaManagementAddRegionPage = () => {
  const navigate = useNavigate();
  const { regions } = useRegionStore();
  const { plots } = usePlotStore();
  const { departments } = useDepartmentStore();
  const { positions } = usePositionStore();
  const { seeds } = useSeedStore();
  const { trees } = useTreeStore();
  const areaZoneData = useMemo<AreaInfo[]>(() => {
    if (!regions || regions.length === 0) return [];

    return regions.flatMap((regionEntity) => {
      const { areas } = regionEntity;

      return areas;
    });
  }, [regions]);
  const [
    openedFilterEmployee,
    { open: openFilterEmployee, close: closeFilterEmployee },
  ] = useDisclosure(false);
  const [selectedLot, setSelectedLot] = useState<string[]>([]);
  const [mode, setMode] = useState<"group" | "dept">("group");
  const [type, setType] = useState<"region" | "area" | "plot">("region");
  const [active, setActive] = useState(0);
  const [opened, setOpened] = useState(false);
  const [selectedLots, setSelectedLots] = useState<string[]>([]);
  const [openedFilterTree, setOpenedFilterTree] = useState(false);
  const [openedFilterMultiple, setOpenedFilterMultiple] = useState(false);
  const toggleLot = (code: string) => {
    setSelectedLots((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]
    );
  };
  const toggleSelectedLot = (code: string) => {
    setSelectedLot((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]
    );
  };
  const form = useForm<{
    region: {
      codeSystem: string;
      employee: string;
      areaSize?: string;
      soilType?: string;
      terrain?: string[];
      note?: string;
    };
    areas: AreaType[];
    plots: PlotType[];
  }>({
    initialValues: {
      region: {
        codeSystem: "VT-002",
        employee: "Nguyễn Văn A",
        areaSize: "48.000 m²",
        soilType: "Đất phù sa",
        terrain: ["Bằng phẳng", "Thoai thoải"],
        note: "Vùng trồng đậu nành và bắp cần duy trì độ ẩm ổn định và luân canh hợp lý để tăng năng suất.",
      },
      areas: [
        {
          code: "KV-BAC",
          name: "Khu vực phía Bắc",
          area: "10.000 m²",
          soilType: "Đất đỏ bazan",
          terrain: ["Cao", "Thoai thoải"],
        },
        {
          code: "KV-NAM",
          name: "Khu vực phía Nam",
          area: "12.000 m²",
          soilType: "Đất phù sa",
          terrain: ["Bằng phẳng", "Trũng nhẹ"],
        },
        {
          code: "KV-TAY",
          name: "Khu vực phía Tây",
          area: "14.000 m²",
          soilType: "Đất thịt nhẹ",
          terrain: ["Bằng phẳng"],
        },
        {
          code: "KV-DONG",
          name: "Khu vực phía Đông",
          area: "12.000 m²",
          soilType: "Đất cát pha",
          terrain: ["Thoai thoải", "Gần mương nước"],
        },
      ],
      plots: [
        // ===== KHU BẮC =====
        {
          id: "plot-001",
          areaCode: "KV-BAC",
          name: "Lô A1",
          employee: "Nguyễn Văn A",
          cultivationMethod: "Luân canh – hữu cơ",
          crops: [
            {
              cropGroup: "Ngũ cốc – Hạt lấy dầu",
              cropCode: "DN001",
              cropName: "Cây đậu nành",
              cultivar: "Đậu nành DT84",
              seedCode: "HatDN-A1",
              seedName: "Hạt giống đậu nành DT84",
              image:
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSh3WrdDlyDlvU4zUrcW5l7GXeoJutE8IoHww&s",
            },
            {
              cropGroup: "Ngũ cốc",
              cropCode: "BP001",
              cropName: "Cây bắp",
              cultivar: "Bắp LVN10",
              seedCode: "HatBP-A1",
              seedName: "Hạt giống bắp LVN10 lai F1",
              image:
                "https://product.hstatic.net/200000563169/product/lvn10_b2491c53014949379e9e70e735a92544_master.jpg",
            },
          ],
        },
        {
          id: "plot-002",
          areaCode: "KV-BAC",
          name: "Lô A2",
          employee: "Nguyễn Văn A",
          cultivationMethod: "Canh tác tự nhiên",
          crops: [
            {
              cropGroup: "Ngũ cốc",
              cropCode: "BP002",
              cropName: "Cây bắp",
              cultivar: "Bắp nếp lai HN68",
              seedCode: "HatBP-A2",
              seedName: "Hạt giống bắp nếp lai HN68",
              image:
                "https://storage.vinaseed.com.vn/Data/2020/03/14/1-banner-nhom-san-pham-ngo-637198043406552298.jpg",
            },
          ],
        },

        // ===== KHU NAM =====
        {
          id: "plot-003",
          areaCode: "KV-NAM",
          name: "Lô B1",
          employee: "Trần Thị B",
          cultivationMethod: "Tưới nhỏ giọt",
          crops: [
            {
              cropGroup: "Ngũ cốc – Hạt lấy dầu",
              cropCode: "DN002",
              cropName: "Cây đậu nành",
              cultivar: "Đậu nành HL01",
              seedCode: "HatDN-B1",
              seedName: "Hạt giống đậu nành HL01 cải tiến",
              image:
                "https://hd1.hotdeal.vn/images/24-01-2015/%C4%90%E1%BA%ACU%20N%C3%80NH/124559-BODY-1.jpg",
            },
          ],
        },
        {
          id: "plot-004",
          areaCode: "KV-NAM",
          name: "Lô B2",
          employee: "Trần Thị B",
          cultivationMethod: "Tưới phun mưa",
          crops: [
            {
              cropGroup: "Ngũ cốc",
              cropCode: "BP003",
              cropName: "Cây bắp",
              cultivar: "Bắp vàng VN886",
              seedCode: "HatBP-B2",
              seedName: "Hạt giống bắp vàng lai VN886",
              image:
                "https://product.hstatic.net/200000475537/product/bap_vang_1_438727adac414fb887b15a3a82db1415_f08201f8be0f4e97ad524cddb19042fb_1024x1024.png",
            },
          ],
        },

        // ===== KHU TÂY =====
        {
          id: "plot-005",
          areaCode: "KV-TAY",
          name: "Lô C1",
          employee: "Phạm Văn C",
          cultivationMethod: "Hữu cơ – luân canh 2 vụ",
          crops: [
            {
              cropGroup: "Ngũ cốc – Hạt lấy dầu",
              cropCode: "DN003",
              cropName: "Cây đậu nành",
              cultivar: "Đậu nành ĐX11",
              seedCode: "HatDN-C1",
              seedName: "Hạt giống đậu nành ĐX11 vụ Hè Thu",
              image:
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTxNvmzOr65QezHLAx9jp82a_wLJNjCzSuexA&s",
            },
            {
              cropGroup: "Ngũ cốc",
              cropCode: "BP004",
              cropName: "Cây bắp",
              cultivar: "Bắp lai DK9955",
              seedCode: "HatBP-C1",
              seedName: "Hạt giống bắp DK9955 năng suất cao",
              image:
                "https://t.ex-cdn.com/nongnghiepmoitruong.vn/560w/files/f1/Image/2014/2/16/15-08-07-dscn1629152652894.jpg",
            },
          ],
        },
        {
          id: "plot-006",
          areaCode: "KV-TAY",
          name: "Lô C2",
          employee: "Phạm Văn C",
          cultivationMethod: "Canh tác tự nhiên",
          crops: [
            {
              cropGroup: "Ngũ cốc",
              cropCode: "BP005",
              cropName: "Cây bắp",
              cultivar: "Bắp nếp trắng 999",
              seedCode: "HatBP-C2",
              seedName: "Hạt giống bắp nếp trắng 999",
              image:
                "https://product.hstatic.net/200000563169/product/thanh_nu_5_9a04245344804a80af49220416f57b7e_grande.jpg",
            },
          ],
        },

        // ===== KHU ĐÔNG =====
        {
          id: "plot-007",
          areaCode: "KV-DONG",
          name: "Lô D1",
          employee: "Nguyễn Thị D",
          cultivationMethod: "Tưới phun mưa",
          crops: [
            {
              cropGroup: "Ngũ cốc – Hạt lấy dầu",
              cropCode: "DN004",
              cropName: "Cây đậu nành",
              cultivar: "Đậu nành HL02",
              seedCode: "HatDN-D1",
              seedName: "Hạt giống đậu nành HL02 năng suất cao",
              image:
                "https://file.hstatic.net/1000034685/file/dau-nanh-gia-si_74da865e5ac14b7a8970b5107fcd422b.jpg",
            },
          ],
        },
        {
          id: "plot-008",
          areaCode: "KV-DONG",
          name: "Lô D2",
          employee: "Nguyễn Thị D",
          cultivationMethod: "Hữu cơ",
          crops: [
            {
              cropGroup: "Ngũ cốc",
              cropCode: "BP006",
              cropName: "Cây bắp",
              cultivar: "Bắp nếp tím HN33",
              seedCode: "HatBP-D2",
              seedName: "Hạt giống bắp nếp tím HN33",
              image:
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQkXjX4HV_DebL-YvX8OhdWdGQRAZNT4ZK1Dw&s",
            },
          ],
        },
      ],
    },
  });

  const nextStep = () => {
    setActive((current) => (current < 3 ? current + 1 : current));
  };

  const prevStep = () =>
    setActive((current) => (current > 0 ? current - 1 : current));

  const handleSubmit = () => {
    console.log("✅ Full form data:", form.values);
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
        <Title order={3}>Thêm mới vùng trồng theo từng bước</Title>
      </Group>

      <Stepper active={active} onStepClick={setActive} allowNextStepsSelect>
        <Stepper.Step label="Bước 1" description="Vùng trồng" />
        <Stepper.Step label="Bước 2" description="Cây trồng" />
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
              Thêm vùng trồng mới thành công!
            </Text>
            <Text fz={"md"} ta="center" c="dimmed">
              Vùng trồng mới đã được thêm thành công. Vui lòng kiểm tra lại
              thông tin để đảm bảo tính chính xác.
            </Text>

            <Button size="md" mt="md" radius={4} onClick={() => navigate(-1)}>
              Xác nhận
            </Button>
          </Stack>
        </Stepper.Completed>
      </Stepper>

      <form onSubmit={form.onSubmit(handleSubmit)}>
        {active === 0 && (
          <Stack mt="md">
            <Stack gap={"xs"}>
              <SegmentedControl
                data={[
                  { label: "Thiết lập theo vùng", value: "region" },
                  { label: "Thiết lập theo khu vực", value: "area" },
                  { label: "Thiết lập theo lô", value: "plot" },
                ]}
                value={type}
                onChange={(value) =>
                  setType(value as "region" | "area" | "plot")
                }
                radius={4}
              />
              <TextInput
                radius={4}
                label="Khu vực canh tác"
                placeholder="Nhập khu vực canh tác"
              />
              <CertificateCardList />
              <Autocomplete
                label="Vùng trồng"
                placeholder="Tìm kiếm vùng trồng"
                leftSection={<IconSearch size={18} />}
                radius={4}
              />
              <RegionCardSelector
                regions={regions}
                selected={form.values.region.codeSystem}
                onSelect={(code) =>
                  form.setFieldValue("region.codeSystem", code)
                }
              />
            </Stack>
            {type !== "region" && (
              <Stack gap={"xs"}>
                <Autocomplete
                  label="Khu vực trồng"
                  placeholder="Tìm kiếm khu vực"
                  leftSection={<IconSearch size={18} />}
                  radius={4}
                />
                <RegionCardSelector
                  isMultiSelect
                  regions={
                    areaZoneData.map((item) => ({
                      region: {
                        name: item.name,
                        area: item.area,
                        soilType: item.soilType,
                        terrain: item.terrain,
                        companyIds: [],
                      },
                      id: item.code,
                    })) as any[]
                  }
                  selected={""}
                  onSelect={() => {
                    setOpened(!opened);
                  }}
                />
              </Stack>
            )}
            {type === "plot" && (
              <Stack gap={"xs"}>
                <Text fw={500} fz={15}>
                  Lô trồng
                </Text>
                <Card withBorder>
                  <Stack>
                    <Text fw={"bold"}>Khu vực phía Bắc</Text>
                    <Stack>
                      <Group>
                        {plots.map((lot) => (
                          <LotCard
                            key={lot.plot.code}
                            lotCode={lot.plot.code}
                            lotName={lot.plot.name}
                            area={lot.plot.area}
                            elevationInfo={lot.plot.elevation.toString()}
                            selected={selectedLot.includes(lot.plot.code)}
                            onToggle={() => {
                              toggleSelectedLot(lot.plot.code);
                            }}
                            closable={false}
                            isCheckbox={true}
                          />
                        ))}
                      </Group>
                    </Stack>
                  </Stack>
                </Card>
              </Stack>
            )}
            {/* <NumberInput
              label="Diện tích vùng trồng (m²)"
              placeholder="Nhập diện tích"
              radius={4}
            /> */}
            <Group>
              <Text fw={"500"} fz={15}>
                Nhân viên quản lý
              </Text>
              <Button
                variant="light"
                radius={4}
                onClick={openFilterEmployee}
                leftSection={<IconUser size={18} />}
              >
                Nhân viên quản lý
              </Button>
            </Group>
            <EmployeeCardList
              isDelete={true}
              isTouchable={false}
              isMultiple={false}
            />
            <Textarea
              label="Ghi chú"
              placeholder="Ghi chú về vùng trồng"
              radius={4}
            />
          </Stack>
        )}
        {active === 1 && (
          <Stack mt={"md"}>
            <SegmentedControl
              data={[
                { label: "Thiết lập theo vùng", value: "region" },
                { label: "Thiết lập theo khu vực", value: "area" },
                { label: "Thiết lập theo lô", value: "plot" },
              ]}
              value={type}
              onChange={(value) => setType(value as "region" | "area" | "plot")}
              radius={4}
            />
          </Stack>
        )}
        {active === 2 && (
          <Stack mt={"md"}>
            <SegmentedControl
              data={[
                { label: "Thiết lập theo vùng", value: "region" },
                { label: "Thiết lập theo khu vực", value: "area" },
                { label: "Thiết lập theo lô", value: "plot" },
              ]}
              value={type}
              onChange={(value) => setType(value as "region" | "area" | "plot")}
              radius={4}
            />
          </Stack>
        )}
        {active === 1 && type === "plot" && (
          <Stack mt="md" gap="md">
            <Card withBorder radius={4} shadow="sm" p="md">
              <Stack>
                <Text fw={"bold"} fz={"h4"}>
                  Khu vực Nam Trung Bộ
                </Text>
                <Divider />
                <Accordion variant="contained" radius={4}>
                  <Accordion.Item value="A01">
                    <Accordion.Control>Lô A01</Accordion.Control>
                    <Accordion.Panel>
                      <Stack gap="xs" mt="sm">
                        <Select
                          searchable
                          clearable
                          label="Phương pháp canh tác"
                          data={["Xen canh", "Truyền thống", "Công nghệ cao"]}
                          radius={4}
                          value="Truyền thống"
                        />
                        <Select
                          searchable
                          clearable
                          label="Phương pháp tưới tiêu"
                          data={["Tưới nhỏ giọt", "Tưới phun mưa", "Tưới tràn"]}
                          radius={4}
                        />
                        <Group>
                          <Text fw={500} fz={14}>
                            Giống cây trồng
                          </Text>
                          <Button
                            radius={4}
                            variant="outline"
                            onClick={() => setOpenedFilterTree(true)}
                          >
                            Thêm mới
                          </Button>
                        </Group>
                        <SeedCards
                          isDelete
                          selected=""
                          seeds={seeds}
                          onSelect={() => {}}
                          isTouchable={false}
                        />
                      </Stack>
                    </Accordion.Panel>
                  </Accordion.Item>
                  <Accordion.Item value="A02">
                    <Accordion.Control>Lô A02</Accordion.Control>
                    <Accordion.Panel>
                      <Stack gap="xs">
                        {/* Phương pháp canh tác */}
                        <Select
                          searchable
                          clearable
                          label="Phương pháp canh tác"
                          data={["Xen canh", "Truyền thống", "Công nghệ cao"]}
                          radius={4}
                          value={"Xen canh"}
                        />
                        <Group>
                          <Text fw={"500"} fz={15}>
                            Danh sách cây trồng
                          </Text>
                          <Button radius={4}>Thêm mới</Button>
                        </Group>
                        <Card>
                          <Stack>
                            <Select
                              searchable
                              clearable
                              label="Nhóm cây trồng"
                              data={["Cây ăn trái", "Cây lương thực"]}
                              radius={4}
                            />
                            <Select
                              searchable
                              clearable
                              label="Phương pháp tưới tiêu"
                              data={[
                                "Tưới nhỏ giọt",
                                "Tưới phun mưa",
                                "Tưới tràn",
                              ]}
                              radius={4}
                            />

                            <Group>
                              <Text fw={"500"} fz={14}>
                                Giống cây trồng
                              </Text>
                              <Button
                                radius={4}
                                variant="outline"
                                onClick={() => {
                                  setOpenedFilterTree(true);
                                  setOpenedFilterMultiple(true);
                                }}
                              >
                                Thêm mới
                              </Button>
                            </Group>
                            <SeedCards
                              selected=""
                              isDelete
                              seeds={seeds}
                              onSelect={() => {}}
                              isTouchable={false}
                            />
                            {/* Danh sách cây trồng */}

                            {/* <TextInput
                              label="Hạt giống"
                              leftSection={<IconSearch size={18} />}
                              radius={4}
                              placeholder="Tìm kiếm hạt giống"
                            />
                            <SeedDetailCards isMultiple={true} /> */}
                          </Stack>
                        </Card>
                      </Stack>
                    </Accordion.Panel>
                  </Accordion.Item>
                </Accordion>
              </Stack>
            </Card>
          </Stack>
        )}
        {active === 1 && type === "area" && (
          <Stack mt={"md"}>
            <Accordion
              variant="contained"
              multiple
              defaultValue={["ntb", "dbscl"]}
            >
              <Accordion.Item key="ntb" value="ntb">
                <Accordion.Control bg={"white"}>
                  <Text fw={"bold"} fz={"h4"}>
                    Khu vực Nam Trung Bộ
                  </Text>
                </Accordion.Control>
                <Accordion.Panel>
                  <Stack gap="xs" mt="sm">
                    <Select
                      searchable
                      clearable
                      label="Phương pháp canh tác"
                      data={["Xen canh", "Truyền thống", "Công nghệ cao"]}
                      radius={4}
                      value="Truyền thống"
                    />
                    <Select
                      searchable
                      clearable
                      label="Phương pháp tưới tiêu"
                      data={["Tưới nhỏ giọt", "Tưới phun mưa", "Tưới tràn"]}
                      radius={4}
                    />
                    <Group>
                      <Text fw={500} fz={14}>
                        Giống cây trồng
                      </Text>
                      <Button
                        radius={4}
                        variant="outline"
                        onClick={() => setOpenedFilterTree(true)}
                      >
                        Thêm mới
                      </Button>
                    </Group>
                    <SeedCards
                      isDelete
                      selected=""
                      seeds={seeds}
                      onSelect={() => {}}
                      isTouchable={false}
                    />
                    {/* <TextInput
                      label="Hạt giống"
                      leftSection={<IconSearch size={18} />}
                      radius={4}
                      placeholder="Tìm kiếm hạt giống"
                    />
                    <SeedDetailCards /> */}
                  </Stack>
                </Accordion.Panel>
              </Accordion.Item>

              <Accordion.Item key="dbscl" value="dbscl">
                <Accordion.Control bg={"white"}>
                  <Text fw={"bold"} fz={"h4"}>
                    Khu vực Đồng Bằng Sông Cửu Long
                  </Text>
                </Accordion.Control>
                <Accordion.Panel>
                  <Stack gap="xs" mt="sm">
                    <Select
                      searchable
                      clearable
                      label="Phương pháp canh tác"
                      data={["Xen canh", "Truyền thống", "Công nghệ cao"]}
                      radius={4}
                      value="Truyền thống"
                    />
                    <Select
                      searchable
                      clearable
                      label="Phương pháp tưới tiêu"
                      data={["Tưới nhỏ giọt", "Tưới phun mưa", "Tưới tràn"]}
                      radius={4}
                    />
                    <Group>
                      <Text fw={500} fz={14}>
                        Giống cây trồng
                      </Text>
                      <Button
                        radius={4}
                        variant="outline"
                        onClick={() => setOpenedFilterTree(true)}
                      >
                        Thêm mới
                      </Button>
                    </Group>
                    <SeedCards
                      selected=""
                      seeds={seeds}
                      onSelect={() => {}}
                      isDelete
                      isTouchable={false}
                    />
                    {/* <TextInput
                      label="Hạt giống"
                      leftSection={<IconSearch size={18} />}
                      radius={4}
                      placeholder="Tìm kiếm hạt giống"
                    />
                    <SeedDetailCards /> */}
                  </Stack>
                </Accordion.Panel>
              </Accordion.Item>
            </Accordion>
          </Stack>
        )}
        {active === 1 && type === "region" && (
          <Stack mt="md" gap="md">
            <Card withBorder radius={4} shadow="sm" p="md">
              <Stack gap="xs">
                {/* Phương pháp canh tác */}
                <Select
                  searchable
                  clearable
                  label="Phương pháp canh tác"
                  data={["Xen canh", "Truyền thống", "Công nghệ cao"]}
                  radius={4}
                  value={"Truyền thống"}
                />
                <Select
                  searchable
                  clearable
                  label="Phương pháp tưới tiêu"
                  data={["Tưới nhỏ giọt", "Tưới phun mưa", "Tưới tràn"]}
                  radius={4}
                />
                <Group>
                  <Text fw={"500"} fz={14}>
                    Giống cây trồng
                  </Text>
                  <Button
                    radius={4}
                    variant="outline"
                    onClick={() => setOpenedFilterTree(true)}
                  >
                    Thêm mới
                  </Button>
                </Group>
                <SeedCards
                  selected=""
                  seeds={seeds}
                  onSelect={() => {}}
                  isDelete
                  isTouchable={false}
                />

                {/* Danh sách cây trồng */}
                {/* 
                <TextInput
                  label="Hạt giống"
                  leftSection={<IconSearch size={18} />}
                  radius={4}
                  placeholder="Tìm kiếm hạt giống"
                />
                <SeedDetailCards /> */}
              </Stack>
            </Card>
          </Stack>
        )}
        {active === 2 && (
          <Stack mt="md" gap="lg">
            <Group grow align="flex-start">
              <Card withBorder radius={4} shadow="sm" p="md" h={300}>
                <Title order={5} mb="xs">
                  📌 Thông tin vùng trồng
                </Title>
                <Stack gap="xs">
                  {/* Thông tin nhân viên */}
                  <Text size="sm">
                    <strong>Nhân viên quản lý:</strong> Nguyễn Văn A
                  </Text>
                  <Text size="sm">
                    <strong>Danh sách nhân viên tham gia:</strong> Nguyễn Văn A,
                    Trần Thị B, Lê Văn C
                  </Text>

                  {/* Thông tin vùng */}
                  <Text size="sm">
                    <strong>Mã vùng:</strong> VT-001
                  </Text>
                  <Text size="sm">
                    <strong>Diện tích:</strong> 50.000 m²
                  </Text>
                  <Text size="sm">
                    <strong>Loại đất:</strong> Đất đỏ bazan
                  </Text>
                  <Text size="sm">
                    <strong>Địa hình:</strong> Cao, Thoai thoải
                  </Text>
                  <Text size="sm">
                    <strong>Ghi chú:</strong> Vùng trồng này cần chú ý về hệ
                    thống tưới tiêu và phân bón.
                  </Text>
                </Stack>
              </Card>
              <Card withBorder radius={4} shadow="sm" p="md" h={300}>
                <Title order={5} mb="xs">
                  🏅 Giấy chứng nhận
                </Title>

                <Group align="flex-start" gap="lg" wrap="nowrap">
                  {/* Ảnh chứng nhận + dấu mộc */}
                  <Tooltip label="Dấu chứng nhận VietGAP" withArrow>
                    <Image
                      w={"40%"}
                      src="https://sutech.vn/wp-content/uploads/2021/09/logo-vietgap-chan-nuoi.jpg"
                      alt="Dấu chứng nhận"
                      radius="xl"
                      style={{}}
                    />
                  </Tooltip>

                  {/* Nội dung chi tiết */}
                  <Stack gap="xs" style={{ flex: 1 }}>
                    <Group justify="space-between">
                      <Group gap={8}>
                        <IconCertificate size={18} />
                        <Title order={5} lh={1.2}>
                          Chứng nhận VietGAP
                        </Title>
                      </Group>
                      <Badge
                        color="teal"
                        variant="light"
                        leftSection={<IconShieldCheck size={14} />}
                      >
                        Hiệu lực 3 năm
                      </Badge>
                    </Group>

                    <Group gap="xs" wrap="wrap">
                      <Badge variant="light">GCN-VG-2025-001</Badge>
                      <Badge variant="outline">Tổ chức VietGAP</Badge>
                      <Badge
                        variant="outline"
                        leftSection={<IconCalendar size={14} />}
                      >
                        Cấp ngày 08/01/2025
                      </Badge>
                    </Group>

                    <Divider my={4} />

                    <Stack gap={4}>
                      <InfoRow
                        label="Tên chứng nhận"
                        value="Chứng nhận VietGAP"
                      />
                      <InfoRow label="Mã số" value="GCN-VG-2025-001" />
                      <InfoRow label="Tổ chức cấp" value="Tổ chức VietGAP" />
                      <InfoRow label="Ngày cấp" value="08/01/2025" />
                      <InfoRow label="Thời hạn hiệu lực" value="3 năm" />
                      <Text size="sm" c="dimmed">
                        <strong>Định nghĩa:</strong> VietGAP là tiêu chuẩn sản
                        xuất nông nghiệp tốt.
                      </Text>
                    </Stack>
                  </Stack>
                </Group>
              </Card>
            </Group>
            <Card withBorder radius={4} shadow="sm" p="md">
              <Title order={5} mb="xs">
                👨‍💼 Nhân viên quản lý
              </Title>
              <EmployeeCardList
                isDelete={false}
                isMultiple={false}
                isTouchable={false}
              />
            </Card>
            {type === "region" && (
              <Card withBorder radius={4} shadow="sm" p="md">
                <Stack gap={"xs"}>
                  <Title order={5} mb="xs">
                    🌱 Danh sách cây trồng
                  </Title>
                  <Scrollable h={170}>
                    <Group wrap="nowrap" gap="xs" align="flex-start">
                      {areaOptions.map((area) => {
                        const plotsInArea = form.values.plots.filter(
                          (plot) => plot.areaCode === area.code
                        );
                        return plotsInArea.map((plot) => (
                          <Group wrap="nowrap" gap="xs">
                            {plot.crops.map((crop, i) => (
                              <Card
                                w={400}
                                h={170}
                                key={i}
                                withBorder
                                radius="sm"
                                shadow="xs"
                                p={0}
                              >
                                <Group align="flex-start">
                                  <Image
                                    src={crop.image}
                                    alt={crop.cropName}
                                    w={"40%"}
                                    h={170}
                                    fit="cover"
                                  />
                                  <Stack flex={1} gap="xs" p={"xs"}>
                                    <Group justify="space-between">
                                      <Title order={5}>{crop.cultivar}</Title>
                                      <Group gap={"xs"}>
                                        <Badge color="gray" variant="light">
                                          {crop.cropCode}
                                        </Badge>
                                      </Group>
                                    </Group>

                                    <Text size="sm" c="dimmed">
                                      Cây trồng: {crop.cropName}
                                    </Text>
                                    <Text size="sm" c="dimmed">
                                      Mã cây trồng: {crop.seedCode}
                                    </Text>
                                  </Stack>
                                </Group>
                              </Card>
                            ))}
                          </Group>
                        ));
                      })}
                    </Group>
                  </Scrollable>
                </Stack>
              </Card>
            )}
            {type !== "region" && (
              <Card withBorder radius={4} shadow="sm" p="md">
                <Title order={5} mb="xs">
                  🌱 Thông tin các lô cây trồng theo khu vực
                </Title>
                <Stack gap="md">
                  {areaOptions.map((area) => {
                    const plotsInArea = form.values.plots.filter(
                      (plot) => plot.areaCode === area.code
                    );
                    if (plotsInArea.length === 0) return null;

                    return (
                      <Box key={area.code}>
                        <Card
                          withBorder
                          radius="sm"
                          shadow="xs"
                          p="sm"
                          mb="xs"
                          bg="gray.0"
                        >
                          <Group justify="space-between" align="flex-start">
                            <Box>
                              <Title order={6}>
                                📦 Khu vực: {area.name} (Mã: {area.code})
                              </Title>
                              <Text size="sm">
                                <strong>Diện tích:</strong> {area.area}
                              </Text>
                              <Text size="sm">
                                <strong>Loại đất:</strong> {area.soilType}
                              </Text>
                              <Text size="sm">
                                <strong>Địa hình:</strong>{" "}
                                {area.terrain.join(", ")}
                              </Text>
                            </Box>
                            <Badge variant="light" color="green" size="lg">
                              {plotsInArea.length} lô cây
                            </Badge>
                          </Group>
                        </Card>

                        {type === "plot" && (
                          <Scrollable h={400}>
                            <Group wrap="nowrap" gap="md" align="flex-start">
                              {plotsInArea.map((plot) => (
                                <Card
                                  key={plot.id}
                                  withBorder
                                  radius="sm"
                                  shadow="xs"
                                  p="sm"
                                  w={450}
                                  style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "space-between",
                                  }}
                                >
                                  <Group justify="space-between">
                                    <Box>
                                      <Text fw={600}>{plot.name}</Text>
                                      <Badge
                                        color="gray"
                                        variant="light"
                                        mt={4}
                                      >
                                        Mã khu vực: {plot.areaCode}
                                      </Badge>
                                    </Box>
                                    <Text size="sm" c="dimmed">
                                      {plot.cultivationMethod}
                                    </Text>
                                  </Group>

                                  <Box
                                    mt="xs"
                                    style={{
                                      flexGrow: 1,
                                      height: 350, // hoặc bất kỳ chiều cao phù hợp
                                      overflowY: "auto",
                                    }}
                                  >
                                    {plot.crops.length > 0 ? (
                                      <SimpleGrid cols={1} spacing="sm">
                                        {plot.crops.map((crop, i) => (
                                          <Card
                                            key={i}
                                            withBorder
                                            radius="sm"
                                            shadow="xs"
                                            w={"100%"}
                                            p={0}
                                          >
                                            <Group align="flex-start">
                                              <Image
                                                src={crop.image}
                                                alt={crop.cropName}
                                                w={"40%"}
                                                h={150}
                                                fit="cover"
                                              />
                                              <Stack flex={1} gap="xs" p={"xs"}>
                                                <Group justify="space-between">
                                                  <Title order={5}>
                                                    {crop.cultivar}
                                                  </Title>
                                                  <Group gap={"xs"}>
                                                    <Badge
                                                      color="gray"
                                                      variant="light"
                                                    >
                                                      {crop.cropCode}
                                                    </Badge>
                                                  </Group>
                                                </Group>

                                                <Text size="sm" c="dimmed">
                                                  Cây trồng: {crop.cropName}
                                                </Text>
                                                <Text size="sm" c="dimmed">
                                                  Mã cây trồng: {crop.seedCode}
                                                </Text>
                                              </Stack>
                                            </Group>
                                          </Card>
                                        ))}
                                      </SimpleGrid>
                                    ) : (
                                      <Text size="sm" c="dimmed">
                                        Chưa có cây trồng nào được thêm vào lô
                                        này.
                                      </Text>
                                    )}
                                  </Box>
                                </Card>
                              ))}
                            </Group>
                          </Scrollable>
                        )}
                        {type === "area" && (
                          <Scrollable h={170}>
                            <Group wrap="nowrap" gap="xs" align="flex-start">
                              {plotsInArea.map((plot) => (
                                <Group wrap="nowrap" gap="xs">
                                  {plot.crops.map((crop, i) => (
                                    <Card
                                      w={420}
                                      h={170}
                                      key={i}
                                      withBorder
                                      radius="sm"
                                      shadow="xs"
                                      p={0}
                                    >
                                      <Group align="flex-start">
                                        <Image
                                          src={crop.image}
                                          alt={crop.cropName}
                                          w={"40%"}
                                          h={170}
                                          fit="cover"
                                        />
                                        <Stack flex={1} gap="xs" p={"xs"}>
                                          <Group justify="space-between">
                                            <Title order={5}>
                                              {crop.cultivar}
                                            </Title>
                                            <Group gap={"xs"}>
                                              <Badge
                                                color="gray"
                                                variant="light"
                                              >
                                                {crop.cropCode}
                                              </Badge>
                                            </Group>
                                          </Group>

                                          <Text size="sm" c="dimmed">
                                            Cây trồng: {crop.cropName}
                                          </Text>
                                          <Text size="sm" c="dimmed">
                                            Mã cây trồng: {crop.seedCode}
                                          </Text>
                                        </Stack>
                                      </Group>
                                    </Card>
                                  ))}
                                </Group>
                              ))}
                            </Group>
                          </Scrollable>
                        )}
                      </Box>
                    );
                  })}
                </Stack>
              </Card>
            )}
          </Stack>
        )}
        {active < 3 && (
          <Group mt="xl" justify="space-between">
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
                Tiếp theo
              </Button>
            ) : (
              <Button radius={4} onClick={nextStep} color="green">
                Lưu
              </Button>
            )}
          </Group>
        )}
      </form>
      <Modal
        opened={opened}
        onClose={() => setOpened(!opened)}
        title={
          <Text fw={"500"} fz={16}>
            Danh sách lô
          </Text>
        }
      >
        <Stack>
          <Group>
            <Checkbox label="Tất cả" radius={4} onChange={() => {}} />
          </Group>
          <SimpleGrid cols={2} spacing="md">
            {lotOptions.map((lot) => (
              <LotCard
                key={lot.code}
                lotCode={lot.code}
                lotName={lot.name}
                area={lot.area}
                isCheckbox={true}
                elevationInfo={lot.description}
                selected={selectedLots.includes(lot.code)}
                onToggle={() => toggleLot(lot.code)}
              />
            ))}
          </SimpleGrid>
          <Group justify="flex-end">
            <Button radius={4}>Xác nhận</Button>
          </Group>
        </Stack>
      </Modal>
      <Modal
        opened={openedFilterEmployee}
        onClose={closeFilterEmployee}
        size={"lg"}
        title={<Text fw={"bold"}>Lọc nhân sự</Text>}
      >
        <Stack gap={"xs"}>
          <Radio.Group
            label="Phương thức lọc"
            value={mode}
            onChange={(val) => setMode(val as "group" | "dept")}
          >
            <Radio value="group" mb={"xs"} label="Đội nhóm" />
            <Radio value="dept" label="Phòng ban và vai trò" />
          </Radio.Group>

          {mode === "group" && (
            <MultiSelect
              label="Đội nhóm"
              radius={4}
              data={["Nhóm Canh tác", "Nhóm Vật tư"]}
            />
          )}

          {mode === "dept" && (
            <>
              <MultiSelect
                label="Phòng ban"
                radius={4}
                data={departments.map((item) => item.name)}
              />
              <MultiSelect
                label="Vai trò"
                radius={4}
                data={positions.map((item) => item.name)}
              />
            </>
          )}
          <TextInput
            label="Tìm kiếm nhân viên"
            placeholder="Thành viên từ nhân sự"
            leftSection={<IconSearch size={16} />}
            {...form.getInputProps("members")}
            radius={4}
          />
          <EmployeeCardList onChange={(ids) => {}} />
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
      <Modal
        opened={openedFilterTree}
        onClose={() => {
          setOpenedFilterTree(!openedFilterTree);
          setOpenedFilterMultiple(false);
        }}
        title={
          <Text fw={"500"} fz={16}>
            Tìm kiếm giống cây trồng
          </Text>
        }
        size="xl"
      >
        <Stack gap={"xs"}>
          <Select
            searchable
            clearable
            label="Nhóm cây trồng"
            data={[
              "Cây ăn trái",
              "Cây lương thực",
              "Cây công nghiệp",
              "Cây thuốc",
            ]}
            radius={4}
          />
          <TextInput
            label="Loại cây trồng"
            leftSection={<IconSearch size={18} />}
            radius={4}
            placeholder="Tìm kiếm loại cây trồng"
          />
          <CropCards
            isMultiple={openedFilterMultiple}
            selected=""
            plants={trees}
            onSelect={() => {}}
          />

          <TextInput
            label="Giống cây trồng"
            leftSection={<IconSearch size={18} />}
            radius={4}
            placeholder="Tìm kiếm giống cây trồng"
          />
          <SeedCards
            selected=""
            seeds={seeds}
            onSelect={() => {}}
            isMultiple={openedFilterMultiple}
          />
          <Group justify="flex-end" mt="md">
            <Button
              radius={4}
              onClick={() => {
                setOpenedFilterTree(false);
                setOpenedFilterMultiple(false);
              }}
            >
              Xác nhận
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Card>
  );
};

export default memo(AreaManagementAddRegionPage);
