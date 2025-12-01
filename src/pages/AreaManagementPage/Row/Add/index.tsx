import {
  Button,
  Card,
  Group,
  Stack,
  Title,
  Select,
  TextInput,
  Stepper,
  Text,
  NumberInput,
  Accordion,
  Modal,
  Badge,
  Divider,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import {
  IconArrowLeft,
  IconPlus,
  IconSearch,
  IconTree,
} from "@tabler/icons-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SeedCards from "./components/SeedCards";
import CropCards from "./components/CropCards";
import AreaCards from "./components/AreaCards";
import RegionCardSelector from "./components/RegionCards";
import PlotCardSelector from "./components/PlotCards";
import { useDisclosure } from "@mantine/hooks";
import { MapContainer, Polygon, TileLayer } from "react-leaflet";
import Table from "../../../../components/Table";
import type { MRT_ColumnDef } from "mantine-react-table";
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
  area: string;
  crop: string;
  irrigation: string;
  farming: string;
  slope: string;
  rows: number;
}
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
export interface RegionOption {
  code: string;
  name: string;
  area: string;
  soilType: string;
  terrain: string[];
}
export const seedOptions: SeedOption[] = [
  {
    code: "DN001",
    cropName: "Đậu nành",
    seedName: "Đậu nành DT84",
    description:
      "Giống đậu nành ngắn ngày, sinh trưởng tốt ở vùng đồng bằng, năng suất cao và hạt to, được trồng phổ biến tại miền Tây.",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSh3WrdDlyDlvU4zUrcW5l7GXeoJutE8IoHww&s",
  },
  {
    code: "DN002",
    cropName: "Đậu nành",
    seedName: "Đậu nành HL01",
    description:
      "Giống đậu nành cải tiến, chịu hạn và sâu bệnh tốt, thích hợp canh tác hữu cơ và luân canh với lúa hoặc bắp.",
    image: "https://hikifood.com/wp-content/uploads/2020/10/11326-ĐAU-NANH.jpg",
  },
  {
    code: "DN003",
    cropName: "Đậu nành",
    seedName: "Đậu nành ĐX11",
    description:
      "Giống đậu nành cho năng suất cao, hạt sáng, cây thấp, thích hợp trồng ở vùng đất đỏ bazan và phù sa cao.",
    image:
      "https://i.ex-cdn.com/nongnghiepmoitruong.vn/files/f1/Image/2009/7/5/05072009145217.jpg",
  },
  {
    code: "DN004",
    cropName: "Đậu nành",
    seedName: "Đậu nành HL02",
    description:
      "Giống đậu nành mới có khả năng chịu úng nhẹ, sinh trưởng mạnh, phù hợp cho vùng ĐBSCL và Đông Nam Bộ.",
    image:
      "https://file.hstatic.net/1000034685/file/dau-nanh-do-tuong-gia-si_0be915c343df452787241ff3f65904ef.jpg",
  },

  // ======== BẮP (NGÔ) ========
  {
    code: "BP001",
    cropName: "Bắp (Ngô)",
    seedName: "Bắp LVN10",
    description:
      "Giống bắp lai F1 nổi tiếng, năng suất cao, thời gian sinh trưởng ngắn, thích hợp với hầu hết vùng khí hậu Việt Nam.",
    image:
      "https://product.hstatic.net/200000563169/product/lvn10_b2491c53014949379e9e70e735a92544_master.jpg",
  },
  {
    code: "BP002",
    cropName: "Bắp (Ngô)",
    seedName: "Bắp nếp HN68",
    description:
      "Giống bắp nếp dẻo, thơm, hạt trắng sữa, phù hợp cho canh tác thương phẩm và chế biến thực phẩm tươi.",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRwmUQWrm6Rd5AAS4uzd-p02hKBomylOkpiUw&s",
  },
  {
    code: "BP003",
    cropName: "Bắp (Ngô)",
    seedName: "Bắp vàng VN886",
    description:
      "Giống bắp vàng năng suất cao, chịu hạn tốt, phù hợp trồng ở vùng đất đỏ và phù sa trung bình.",
    image:
      "https://product.hstatic.net/200000475537/product/bap_vang_1_438727adac414fb887b15a3a82db1415_f08201f8be0f4e97ad524cddb19042fb_1024x1024.png",
  },
  {
    code: "BP004",
    cropName: "Bắp (Ngô)",
    seedName: "Bắp lai DK9955",
    description:
      "Giống bắp lai cao sản của Dekalb, chịu sâu bệnh tốt, bắp dài, hạt vàng đậm, thích hợp cơ giới hóa thu hoạch.",
    image:
      "https://t.ex-cdn.com/nongnghiepmoitruong.vn/560w/files/f1/Image/2014/2/16/15-08-07-dscn1629152652894.jpg",
  },
  {
    code: "BP005",
    cropName: "Bắp (Ngô)",
    seedName: "Bắp nếp trắng 999",
    description:
      "Giống bắp nếp trắng cao cấp, hạt trắng ngà, dẻo và thơm, phù hợp canh tác ngắn ngày vùng đồng bằng.",
    image:
      "https://storage.ssc.com.vn/Data/2024/11/01/diamond999-4-638660646992924648.jpg?w=620&h=350",
  },
  {
    code: "BP006",
    cropName: "Bắp (Ngô)",
    seedName: "Bắp nếp tím HN33",
    description:
      "Giống bắp nếp tím lạ mắt, hạt dẻo ngọt, giàu anthocyanin, được trồng nhiều ở miền Tây và vùng cao.",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQkXjX4HV_DebL-YvX8OhdWdGQRAZNT4ZK1Dw&s",
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
export const cropOptions: CropOption[] = [
  {
    code: "SOY001",
    name: "Đậu nành",
    seed: "Đậu nành DT84",
    harvestMethod: "Thu hoạch hạt",
    growthCycle: "Chu kỳ ngắn (85–110 ngày)",
    note: "Ưa đất tơi xốp, pH 5.5–6.5, thoát nước tốt",
    image:
      "https://lh6.googleusercontent.com/proxy/MkmLTr7RaC47H6aLuMX0yGGlXhtKf77bRQ0sEwVhPiHI01aj7WPJYpuBWIbN422tMgVbH5Z67gqzUj9h-LmQpjem8pVrKg",
  },
  {
    code: "SOY002",
    name: "Đậu nành",
    seed: "Đậu nành ĐX11",
    harvestMethod: "Thu hoạch hạt bằng máy hoặc tay",
    growthCycle: "Chu kỳ trung bình (90–100 ngày)",
    note: "Thích hợp vùng Đông Nam Bộ, cần đủ ẩm khi ra hoa",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTxNvmzOr65QezHLAx9jp82a_wLJNjCzSuexA&s",
  },
  {
    code: "CORN001",
    name: "Bắp",
    seed: "Bắp LVN10",
    harvestMethod: "Thu hoạch bắp khô",
    growthCycle: "Chu kỳ trung bình (95–120 ngày)",
    note: "Ưa sáng, cần đất tơi xốp và nhiều dinh dưỡng",
    image:
      "https://storage.ssc.com.vn/Data/2021/05/18/lvn10-3-637569497051796680.jpg?w=620&h=350",
  },
  {
    code: "CORN002",
    name: "Bắp",
    seed: "Bắp NK66",
    harvestMethod: "Thu hoạch bắp tươi hoặc khô",
    growthCycle: "Chu kỳ trung bình (100–115 ngày)",
    note: "Phù hợp vùng Duyên hải Nam Trung Bộ, năng suất cao",
    image: "https://static.tuoitre.vn/tto/i/s626/2015/03/24/AgwPWLuq.jpg",
  },
  {
    code: "SOY003",
    name: "Đậu nành",
    seed: "Đậu nành HL07-12",
    harvestMethod: "Thu hoạch theo lứa",
    growthCycle: "Chu kỳ trung bình (95 ngày)",
    note: "Chống đổ tốt, thích hợp vụ Đông Xuân",
    image: "https://camnangcaytrong.com/Uploads/News/cay-dau-tuong-av.jpg",
  },
  {
    code: "CORN003",
    name: "Bắp",
    seed: "Bắp HN88",
    harvestMethod: "Thu hoạch thủ công",
    growthCycle: "Chu kỳ ngắn (90–100 ngày)",
    note: "Giống lai F1, chịu hạn, phù hợp đất đỏ bazan",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQdJVGm-sJJtIaAWAKr9iSf1cR2w7C-iJZqUw&s",
  },
  {
    code: "SOY004",
    name: "Đậu nành",
    seed: "Đậu nành HL89",
    harvestMethod: "Thu hoạch máy liên hợp",
    growthCycle: "Chu kỳ trung bình (100–105 ngày)",
    note: "Năng suất cao, chống chịu sâu bệnh tốt",
    image: "https://harc-ias.vn/upload/products/Kha_nang_dau_trai_2.jpg",
  },
  {
    code: "CORN004",
    name: "Bắp",
    seed: "Bắp GS9",
    harvestMethod: "Thu hoạch cơ giới",
    growthCycle: "Chu kỳ dài (110–125 ngày)",
    note: "Thích hợp cho vùng Tây Nguyên, năng suất ổn định",
    image:
      "https://t.ex-cdn.com/nongnghiepmoitruong.vn/560w/files/f1/2016/5/19/09-52-33_giong-lu-li-gs9-cho-nng-sut-co-tren-nen-dt-nuoi-tom-o-dbscl-du-gp-thoi-tiet-khc-nghiet-l-hn-v-xm-nhp-mn-1.jpg",
  },
];

export const areaOptions: AreaOption[] = [
  {
    code: "KV-BAC",
    name: "Khu vực phía Bắc",
    zone: "Vùng trồng sầu riêng Đồng Nai",
    orgUnit: "Hộ nông dân Nguyễn Văn A",
    employee: "Nhân viên A",
    area: "4.500 m²",
    soilType: "Đất thịt",
    terrain: ["Cao"],
  },
  {
    code: "KV-NAM",
    name: "Khu vực phía Nam",
    zone: "Vùng trồng sầu riêng Đồng Nai",
    orgUnit: "Hộ nông dân Nguyễn Văn A",
    employee: "Nhân viên A",
    area: "5.500 m²",
    soilType: "Đất thịt",
    terrain: ["Dốc"],
  },
  {
    code: "KV-TAY",
    name: "Khu vực phía Tây",
    zone: "Vùng trồng sầu riêng Tây Nguyên",
    orgUnit: "Hợp tác xã Tây Nguyên",
    employee: "Nhân viên B",
    area: "6.000 m²",
    soilType: "Đất đỏ bazan",
    terrain: ["Thoai thoải"],
  },
  {
    code: "KV-DONG",
    name: "Khu vực phía Đông",
    zone: "Vùng trồng sầu riêng Miền Đông",
    orgUnit: "Hộ nông dân Trần Văn C",
    employee: "Nhân viên C",
    area: "7.200 m²",
    soilType: "Đất cát pha",
    terrain: ["Bằng phẳng"],
  },
  {
    code: "KV-MIEN-TAY",
    name: "Khu vực Miền Tây",
    zone: "Vùng trồng sầu riêng Đồng Tháp",
    orgUnit: "Hợp tác xã Đồng Tháp",
    employee: "Nhân viên D",
    area: "8.000 m²",
    soilType: "Đất phù sa",
    terrain: ["Thấp", "Trũng"],
  },
  {
    code: "KV-TRUNG",
    name: "Khu vực miền Trung",
    zone: "Vùng trồng sầu riêng Bình Định",
    orgUnit: "Hộ nông dân Lê Văn E",
    employee: "Nhân viên E",
    area: "5.800 m²",
    soilType: "Đất pha cát",
    terrain: ["Dốc nhẹ"],
  },
  {
    code: "KV-CAO-NGUYEN",
    name: "Khu vực Cao Nguyên",
    zone: "Vùng trồng sầu riêng Lâm Đồng",
    orgUnit: "Hợp tác xã Lâm Đồng",
    employee: "Nhân viên F",
    area: "10.000 m²",
    soilType: "Đất đỏ bazan",
    terrain: ["Cao", "Thoai thoải"],
  },
  {
    code: "KV-DAI-NAM",
    name: "Khu vực Đại Nam",
    zone: "Vùng trồng sầu riêng Bình Dương",
    orgUnit: "Hộ nông dân Nguyễn Văn G",
    employee: "Nhân viên G",
    area: "4.800 m²",
    soilType: "Đất thịt pha sét",
    terrain: ["Bằng phẳng"],
  },
  {
    code: "KV-SONG-HONG",
    name: "Khu vực Đồng Bằng Sông Hồng",
    zone: "Vùng trồng sầu riêng Hà Nam",
    orgUnit: "Hợp tác xã Hà Nam",
    employee: "Nhân viên H",
    area: "6.500 m²",
    soilType: "Đất phù sa",
    terrain: ["Thấp"],
  },
  {
    code: "KV-SONG-CUU-LONG",
    name: "Khu vực Đồng Bằng Sông Cửu Long",
    zone: "Vùng trồng sầu riêng Cần Thơ",
    orgUnit: "Hợp tác xã Cần Thơ",
    employee: "Nhân viên I",
    area: "9.000 m²",
    soilType: "Đất phù sa",
    terrain: ["Thấp", "Trũng"],
  },
];
const confirmDataset = {
  areaName: "Vùng ĐBSCL",
  zoneName: "Khu A",
  blockName: "Lô 01",
  farming: "Xen canh",
  plantGroup: "Rau ăn lá",
  plant: "Cải ngọt",
  seed: "Cải ngọt F1",
  seedName: "F1 - SweetGreen",
  irrigation: "Tưới nhỏ giọt",
  blocks: [
    {
      blockName: "Lô 01",
      rows: [
        {
          name: "Hàng 1",
          seed: "Cải ngọt F1",
          crop: "Cải ngọt",
          quantity: 100,
        },
        {
          name: "Hàng 2",
          seed: "Cải ngọt F1",
          crop: "Cải ngọt",
          quantity: 120,
        },
      ],
    },
    {
      blockName: "Lô 02",
      rows: [
        {
          name: "Hàng 1",
          seed: "Cải ngọt F2",
          crop: "Cải ngọt",
          quantity: 90,
        },
      ],
    },
  ],
};
const regionOptions: RegionOption[] = [
  {
    code: "VT-001",
    name: "Vùng Trồng Tây Nguyên",
    area: "50.000 m²",
    soilType: "Đất đỏ bazan",
    terrain: ["Cao", "Thoai thoải"],
  },
  {
    code: "VT-002",
    name: "Vùng Trồng Miền Tây",
    area: "65.000 m²",
    soilType: "Đất phù sa",
    terrain: ["Thấp", "Trũng"],
  },
];
export const plotOptions: LotOption[] = [
  {
    code: "LO-A1",
    name: "Lô A1",
    area: "1.500 m²",
    crop: "Sầu riêng",
    irrigation: "Tưới nhỏ giọt",
    farming: "Hữu cơ",
    slope: "Dốc nhẹ (48–56m)",
    rows: 8,
  },
  {
    code: "LO-B2",
    name: "Lô B2",
    area: "2.200 m²",
    crop: "Mãng cầu",
    irrigation: "Tưới phun mưa",
    farming: "Truyền thống",
    slope: "Dốc trung bình (50–60m)",
    rows: 10,
  },
  {
    code: "LO-C3",
    name: "Lô C3",
    area: "1.800 m²",
    crop: "Xoài",
    irrigation: "Tưới nhỏ giọt",
    farming: "Hữu cơ",
    slope: "Đồi thoải",
    rows: 12,
  },
  {
    code: "LO-D4",
    name: "Lô D4",
    area: "2.500 m²",
    crop: "Sầu riêng, Xoài",
    irrigation: "Tưới phun mưa",
    farming: "Truyền thống",
    slope: "Bằng phẳng",
    rows: 16,
  },
  {
    code: "LO-E5",
    name: "Lô E5",
    area: "1.200 m²",
    crop: "Chuối",
    irrigation: "Tưới nhỏ giọt",
    farming: "Canh tác tự nhiên",
    slope: "Dốc nhẹ",
    rows: 6,
  },
];
type TRow = {
  name: string;
  seed: string;
  crop: string;
  quantity: number;
};
const AreaManagementRowAddPage = () => {
  const navigate = useNavigate();
  const [openedTreeMap, { open: openTreeMap, close: closeTreeMap }] =
    useDisclosure(false);
  const [activeStep, setActiveStep] = useState(0);

  const form = useForm({
    initialValues: {
      regionId: "",
      areaId: "",
      code: "",
      name: "",
      area: "",
      mainCrops: [],
      irrigation: "",
      farming: "",
      gps: "",
      rows: [
        {
          name: "",
          code: "",
          crop: "",
          treeCount: "",
          gps: "",
        },
      ],
    },
  });
  const handleSubmit = () => {
    console.log("✅ Dữ liệu lô & hàng:", form.values);
  };
  const rowColumns: MRT_ColumnDef<TRow>[] = [
    {
      accessorKey: "name",
      header: "Tên hàng",
    },
    {
      accessorKey: "seed",
      header: "Giống cây",
    },
    {
      accessorKey: "crop",
      header: "Cây trồng",
    },
    {
      accessorKey: "quantity",
      header: "Số lượng cây",
      Cell: ({ row }) => row.original.quantity.toLocaleString(),
    },
  ];
  const addRow = () => {
    form.insertListItem("rows", {
      name: "",
      code: "",
      crop: "",
      treeCount: "",
      gps: "",
    });
  };

  return (
    <Card withBorder shadow="md" radius={12} p="xl">
      <Group mb={"md"}>
        <Button
          variant="subtle"
          radius={4}
          leftSection={<IconArrowLeft size={18} />}
          onClick={() => navigate(-1)}
        >
          Quay lại
        </Button>
        <Title order={3}>📋 Tạo mới Hàng</Title>
      </Group>

      <Stepper
        active={activeStep}
        onStepClick={setActiveStep}
        allowNextStepsSelect={false}
      >
        <Stepper.Step label="Bước 1" description="Vùng trồng & Khu vực & Lô" />
        <Stepper.Step label="Bước 2" description="Tạo hàng" />
        <Stepper.Step label="Bước 3" description="Xác nhận" />
      </Stepper>

      <form onSubmit={form.onSubmit(handleSubmit)}>
        {activeStep === 0 && (
          <Stack mt="md">
            <Stack gap={"xs"}>
              <Text fw={500} fz={15}>
                Vùng Trồng
              </Text>
              <TextInput
                placeholder="Tìm kiếm vùng trồng"
                radius={4}
                leftSection={<IconSearch size={18} />}
              />
              <RegionCardSelector
                regions={regionOptions}
                selected={"12"}
                onSelect={() => {}}
              />
            </Stack>
            <Stack gap={"xs"}>
              <Text fw={500} fz={15}>
                Khu vực
              </Text>
              <TextInput
                placeholder="Tìm kiếm khu vực"
                radius={4}
                leftSection={<IconSearch size={18} />}
              />
              <AreaCards
                areas={areaOptions}
                selected={""}
                onSelect={() => {}}
              />
            </Stack>
            <Stack gap={"xs"}>
              <Text fw={500} fz={15}>
                Lô
              </Text>
              <TextInput
                placeholder="Tìm kiếm lô"
                radius={4}
                leftSection={<IconSearch size={18} />}
              />
              <PlotCardSelector
                lots={plotOptions}
                selected={""}
                onSelect={() => {}}
              />
            </Stack>
          </Stack>
        )}

        {activeStep === 1 && (
          <Stack mt="md">
            <Card>
              <Text fw={"500"}>Lô A01</Text>
              <Accordion>
                {form.values.rows.map((row, index) => (
                  <Accordion.Item key={index} value={`${index}`}>
                    <Accordion.Control>{`Hàng A01-${
                      index + 1
                    }`}</Accordion.Control>
                    <Accordion.Panel>
                      <Stack gap={"xs"}>
                        <TextInput
                          label="Tên hàng"
                          radius={4}
                          {...form.getInputProps(`rows.${index}.name`)}
                        />
                        {/**Cây trồng filter trước */}
                        <Stack gap={"xs"}>
                          <Text fw={500} fz={15}>
                            Giống cây trồng
                          </Text>
                          <TextInput
                            placeholder="Tìm kiếm giống cây trồng"
                            radius={4}
                            leftSection={<IconSearch size={18} />}
                          />
                          <SeedCards
                            selected=""
                            seeds={seedOptions}
                            onSelect={() => {}}
                          />
                          <Text fw={500} fz={15}>
                            Cây trồng
                          </Text>
                          <TextInput
                            placeholder="Tìm kiếm cây trồng"
                            radius={4}
                            leftSection={<IconSearch size={18} />}
                          />
                          <CropCards
                            selected="1"
                            plants={cropOptions}
                            onSelect={() => {}}
                          />
                        </Stack>

                        {form.getValues().farming === "Xen canh" && (
                          <Select
                            searchable
                            clearable
                            radius={4}
                            label="Hạt giống cây"
                            data={["Giống A", "Giống B"]}
                          />
                        )}
                        <NumberInput radius={4} label="Số lượng cây" />
                        <Button
                          w={"100%"}
                          radius={4}
                          variant="outline"
                          mt="md"
                          onClick={openTreeMap}
                          leftSection={<IconTree size={18} />}
                        >
                          Tạo cây
                        </Button>
                      </Stack>
                    </Accordion.Panel>
                  </Accordion.Item>
                ))}
                <Button
                  w={"100%"}
                  radius={4}
                  variant="light"
                  mt="md"
                  onClick={addRow}
                >
                  + Thêm hàng
                </Button>
              </Accordion>
            </Card>
            <Card>
              <Text fw={"500"}>Lô A02</Text>
              <Accordion>
                {form.values.rows.map((row, index) => (
                  <Accordion.Item key={index} value={`${index}`}>
                    <Accordion.Control>{`Hàng A02-${
                      index + 1
                    }`}</Accordion.Control>
                    <Accordion.Panel>
                      <Stack gap={"xs"}>
                        <TextInput
                          label="Tên hàng"
                          radius={4}
                          {...form.getInputProps(`rows.${index}.name`)}
                        />
                        {/**Cây trồng filter trước */}
                        <Stack gap={"xs"}>
                          <Text fw={500} fz={15}>
                            Giống cây trồng
                          </Text>
                          <TextInput
                            placeholder="Tìm kiếm giống cây trồng"
                            radius={4}
                            leftSection={<IconSearch size={18} />}
                          />
                          <SeedCards
                            selected=""
                            seeds={seedOptions}
                            onSelect={() => {}}
                          />
                          <Text fw={500} fz={15}>
                            Cây trồng
                          </Text>
                          <TextInput
                            placeholder="Tìm kiếm cây trồng"
                            radius={4}
                            leftSection={<IconSearch size={18} />}
                          />
                          <CropCards
                            selected="1"
                            plants={cropOptions}
                            onSelect={() => {}}
                          />
                        </Stack>

                        {form.getValues().farming === "Xen canh" && (
                          <Select
                            searchable
                            clearable
                            radius={4}
                            label="Hạt giống cây"
                            data={["Giống A", "Giống B"]}
                          />
                        )}
                        <NumberInput radius={4} label="Số lượng cây" />
                        <Button
                          w={"100%"}
                          radius={4}
                          variant="outline"
                          mt="md"
                          leftSection={<IconTree size={18} />}
                        >
                          Tạo cây
                        </Button>
                      </Stack>
                    </Accordion.Panel>
                  </Accordion.Item>
                ))}
                <Button
                  w={"100%"}
                  radius={4}
                  variant="light"
                  mt="md"
                  onClick={addRow}
                >
                  + Thêm hàng
                </Button>
              </Accordion>
            </Card>
          </Stack>
        )}
        {activeStep === 2 && (
          <Stack gap="xl" mt={"md"}>
            <Card withBorder shadow="sm" radius="md" p="md">
              <Stack gap="xs">
                <Group justify="apart">
                  <Text size="sm" fw={500}>
                    Vùng trồng:
                  </Text>
                  <Badge color="green">{confirmDataset.areaName}</Badge>
                </Group>
                <Group justify="apart">
                  <Text size="sm" fw={500}>
                    Khu vực:
                  </Text>
                  <Badge color="green">{confirmDataset.zoneName}</Badge>
                </Group>
                <Group justify="apart">
                  <Text size="sm" fw={500}>
                    Lô:
                  </Text>
                  <Badge color="green">{confirmDataset.blockName}</Badge>
                </Group>
                <Group justify="apart">
                  <Text size="sm" fw={500}>
                    Phương pháp canh tác:
                  </Text>
                  <Text>{confirmDataset.farming}</Text>
                </Group>
                <Group justify="apart">
                  <Text size="sm" fw={500}>
                    Nhóm cây:
                  </Text>
                  <Text>{confirmDataset.plantGroup}</Text>
                </Group>
                <Group justify="apart">
                  <Text size="sm" fw={500}>
                    Loại cây:
                  </Text>
                  <Text>{confirmDataset.plant}</Text>
                </Group>
                <Group justify="apart">
                  <Text size="sm" fw={500}>
                    Giống cây:
                  </Text>
                  <Text>{confirmDataset.seed}</Text>
                </Group>
                <Group justify="apart">
                  <Text size="sm" fw={500}>
                    Hạt giống cây:
                  </Text>
                  <Text>{confirmDataset.seedName}</Text>
                </Group>
                <Group justify="apart">
                  <Text size="sm" fw={500}>
                    Phương pháp tưới tiêu:
                  </Text>
                  <Text>{confirmDataset.irrigation}</Text>
                </Group>
              </Stack>
            </Card>

            <Divider label="Danh sách hàng" labelPosition="center" />

            {confirmDataset.blocks?.map((block, blockIndex) => (
              <Card key={blockIndex} withBorder radius="md" shadow="xs" p="md">
                <Stack gap="xs">
                  <Group justify="apart" mb="xs">
                    <Text fw={600}>Lô: {block.blockName}</Text>
                    <Badge color="blue">{block.rows.length} hàng</Badge>
                  </Group>

                  <Table columns={rowColumns} data={block.rows} />
                </Stack>
              </Card>
            ))}
          </Stack>
        )}
        <Group justify="space-between" mt="xl">
          <Button
            variant="default"
            radius={4}
            disabled={activeStep === 0}
            onClick={() => setActiveStep((prev) => prev - 1)}
          >
            Quay lại
          </Button>
          {activeStep < 3 ? (
            <Button
              radius={4}
              onClick={() => setActiveStep((prev) => prev + 1)}
            >
              Tiếp theo
            </Button>
          ) : (
            <Button radius={4} color="green">
              Lưu
            </Button>
          )}
        </Group>
      </form>
      <Modal
        opened={openedTreeMap}
        onClose={closeTreeMap}
        title={<Text fw={500}>Thêm mới cây trồng</Text>}
      >
        <Stack mt="md" gap={"xs"}>
          <Group align="flex-end">
            <TextInput
              label="Latitude"
              placeholder="10.762622"
              radius={4}
              flex={1}
            />
            <TextInput
              label="Longitude"
              placeholder="106.660172"
              radius={4}
              flex={1}
            />
            <Button radius={4} leftSection={<IconPlus size={16} />}>
              Thêm
            </Button>
          </Group>
          Bản đồ Leaflet với polygon
          <MapContainer
            center={[10.762622, 106.660172]}
            zoom={16}
            style={{ height: "300px", width: "100%", borderRadius: 8 }}
            attributionControl={false}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Polygon positions={[]} color="green" />
          </MapContainer>
        </Stack>
      </Modal>
    </Card>
  );
};

export default AreaManagementRowAddPage;
