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
    code: "VAR01",
    cropName: "Sầu riêng",
    seedName: "Sầu riêng Ri6",
    description:
      "Giống sầu riêng phổ biến, cơm vàng, hạt lép, thơm ngọt, xuất xứ từ miền Tây Việt Nam.",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRnHUglZObxyUZw-KJWpVaUyTND-GZ5QXeSbQ&s",
  },
  {
    code: "VAR02",
    cropName: "Sầu riêng",
    seedName: "Sầu riêng Monthong",
    description:
      "Giống Thái Lan, múi to, cơm dày, mùi nhẹ, dễ trồng và bảo quản.",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQg8Ss-pG3fczRDZC-w8-99pc6AO4LfMZQuvg&s",
  },
  {
    code: "VAR03",
    cropName: "Xoài",
    seedName: "Xoài Cát Chu",
    description: "Xoài ngọt đậm, đặc sản Cao Lãnh – Đồng Tháp.",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSuoV_tndgYNlaWSUYaE9RlbIYvYBmPBY0u_w&s",
  },
  {
    code: "VAR04",
    cropName: "Xoài",
    seedName: "Xoài Tượng",
    description:
      "Xoài to trái, chắc thịt, phù hợp trồng đại trà ở vùng nhiệt đới.",
    image:
      "https://hoangphatfruit.com/vnt_upload/product/10_2022/xoai_tuong_1_1.jpg",
  },
  {
    code: "VAR05",
    cropName: "Chuối",
    seedName: "Chuối già Nam Mỹ",
    description: "Chuối xuất khẩu, năng suất cao, chịu bệnh tốt.",
    image:
      "https://product.hstatic.net/200000668417/product/z5552895105691_b5fa2080b2859fa7895d436706ce354d_19d9a2f94dc94c01b1f84a29e10b7cdb.jpg",
  },
  {
    code: "SD001",
    cropName: "Lúa",
    seedName: "OM5451",
    description: "Giống lúa ngắn ngày, năng suất cao, chịu mặn và hạn tốt.",
    image:
      "https://hoinongdankhanhhoa.org.vn/media/news/tin-tuc-su-kien/2018/9/28-9/luaOM5451.jpg",
  },
  {
    code: "SD002",
    cropName: "Ngô",
    seedName: "LVN10",
    description: "Giống ngô lai, phát triển mạnh, thích hợp khí hậu ôn hòa.",
    image:
      "https://storage.ssc.com.vn/Data/2021/05/18/lvn10-3-637569497051796680.jpg?w=620&h=350",
  },
  {
    code: "SD003",
    cropName: "Khoai lang",
    seedName: "KL01",
    description:
      "Giống khoai lang ruột vàng, vị ngọt, thời gian sinh trưởng 4 tháng.",
    image:
      "https://bizweb.dktcdn.net/100/421/709/products/khoai-lang-3.jpg?v=1697035245340",
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
    code: "TREE001",
    name: "Sầu riêng",
    seed: "Sầu riêng Ri6",
    harvestMethod: "Thu hoạch thủ công",
    growthCycle: "Chu kỳ dài (5-7 năm)",
    note: "Yêu cầu đất thịt và thoát nước tốt",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSKDJVMzZZFE3P3yLWKzhe0zz66QGfkD_q1VQ&s",
  },
  {
    code: "TREE002",
    name: "Xoài",
    seed: "Xoài cát",
    harvestMethod: "Thu hoạch bằng sào",
    growthCycle: "Chu kỳ trung bình (3-5 năm)",
    image:
      "https://pyloagri.com/wp-content/uploads/2021/10/xoai-cat-hoa-loc-3.jpg",
  },
  {
    code: "TREE003",
    name: "Chuối",
    seed: "Chuối xiêm",
    harvestMethod: "Thu hoạch cuống",
    growthCycle: "Chu kỳ ngắn (9-12 tháng)",
    image:
      "https://cdn.nhathuoclongchau.com.vn/unsafe/800x0/https://cms-prod.s3-sgn09.fptcloud.com/chuoi_xiem_co_tac_dung_gi_voi_suc_khoe_va_lam_dep_1_38e5fddc82.jpg",
  },
  {
    code: "CR001",
    name: "Lúa",
    seed: "OM5451",
    harvestMethod: "Gặt bằng máy",
    growthCycle: "90 ngày",
    note: "Chịu hạn tốt, năng suất cao",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTiuizNChlPfX34c3XWnxQUGtgqDWTChUshMg&s",
  },
  {
    code: "CR002",
    name: "Ngô",
    seed: "LVN10",
    harvestMethod: "Thu thủ công",
    growthCycle: "100 ngày",
    note: "Phù hợp vùng trung du",
    image: "https://sinhhocchaua.com/wp-content/uploads/2024/08/bap-nep.jpg",
  },
  {
    code: "CR003",
    name: "Khoai lang",
    seed: "KL01",
    harvestMethod: "Đào tay",
    growthCycle: "120 ngày",
    note: "Đất cát pha là tốt nhất",
    image:
      "https://media-cdn-v2.laodong.vn/storage/newsportal/2023/9/3/1237041/Khoai-Lang.JPG?w=800&h=496&crop=auto&scale=both",
  },
  {
    code: "CR004",
    name: "Cà chua",
    seed: "CT888",
    harvestMethod: "Hái từng trái",
    growthCycle: "75 ngày",
    note: "Cần chăm sóc kỹ sâu bệnh",
    image:
      "https://cdnphoto.dantri.com.vn/VNkA3P1sbkHX9Ydf4foCcgFGuow=/thumb_w/1020/2022/07/04/172020103452pm-1656913209719.jpeg",
  },
  {
    code: "CR005",
    name: "Dưa hấu",
    seed: "DH999",
    harvestMethod: "Hái bằng tay",
    growthCycle: "85 ngày",
    note: "Trồng vào mùa khô, tưới đủ nước",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRX8sq-Snfk44ptgfu4E7Pkf4vGfBOg56YMPg&s",
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
