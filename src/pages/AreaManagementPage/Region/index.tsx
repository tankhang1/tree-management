import {
  ActionIcon,
  Badge,
  Button,
  Card,
  CloseButton,
  Group,
  Menu,
  MultiSelect,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
  Title,
  Tooltip,
} from "@mantine/core";
import Table from "../../../components/Table";
import type { MRT_ColumnDef } from "mantine-react-table";
import {
  IconBrandMetabrainz,
  IconDotsVertical,
  IconEdit,
  IconEye,
  IconFileExcel,
  IconRefresh,
  IconSandbox,
  IconSearch,
  IconTrash,
  IconTree,
  IconX,
} from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { PATH } from "../../../constants/path.constants";
import { useState } from "react";
type AreaZone = {
  id: string;
  code: string;
  name: string;
  regionName: string;
  areaName?: string;
  plotName?: string;
  employee: string;
  area: number; // diện tích (m²)
  soilType: string;
  terrain: string[];
  mainCrop: string;
  gps: string;
  numberOfLots: number;
  cultivationZone: string;
  tree: string;
  province: string;
  district: string;
};
const areaZoneData: AreaZone[] = [
  {
    id: "V001",
    code: "V-AG1",
    name: "Khu đậu nành Vàm Nao",
    regionName: "Vùng Đậu Nành An Giang",
    employee: "Nguyễn Văn A",
    area: 10000,
    tree: "Đậu nành",
    province: "An Giang",
    district: "TP. Long Xuyên",
    soilType: "Đất phù sa",
    terrain: ["Bằng phẳng", "Ven sông"],
    mainCrop: "Đậu nành",
    gps: "10.3862,105.4351 10.3868,105.4362 10.3857,105.4367 10.3853,105.4356",
    numberOfLots: 5,
    cultivationZone: "Khu canh tác ĐBSCL",
  },
  {
    id: "V006",
    code: "V-VL2",
    name: "Bắp Bình Minh",
    areaName: "Cánh đồng C2",
    regionName: "Vùng Bắp Vĩnh Long",
    employee: "Hoàng Thị F",
    area: 7000,
    soilType: "Đất phù sa",
    tree: "Bắp (Ngô)",
    terrain: ["Trũng"],
    mainCrop: "Bắp (Ngô)",
    gps: "10.2124,105.9726 10.2130,105.9734 10.2121,105.9740 10.2116,105.9732",
    numberOfLots: 3,
    cultivationZone: "Khu canh tác ĐBSCL",
    province: "Vĩnh Long",
    district: "Thị xã Bình Minh",
  },
  {
    id: "V002",
    code: "V-TG2",
    name: "Khu bắp Mỹ Tho",
    regionName: "Vùng Bắp Tiền Giang",
    employee: "Trần Thị B",
    area: 8500,
    tree: "Bắp (Ngô)",
    soilType: "Đất phù sa",
    terrain: ["Bằng phẳng", "Trũng"],
    mainCrop: "Bắp (Ngô)",
    gps: "10.3521,106.3562 10.3529,106.3569 10.3520,106.3576 10.3514,106.3568",
    numberOfLots: 3,
    cultivationZone: "Khu canh tác ĐBSCL",
    province: "Tiền Giang",
    district: "TP. Mỹ Tho",
  },
  {
    id: "V003",
    code: "V-LA1",
    name: "Đậu nành Đức Hòa",
    regionName: "Vùng Đậu Nành Long An",
    employee: "Lê Văn C",
    area: 6000,
    soilType: "Đất thịt",
    terrain: ["Bằng phẳng"],
    mainCrop: "Đậu nành",
    gps: "10.7918,106.4152 10.7925,106.4161 10.7917,106.4169 10.7910,106.4160",
    numberOfLots: 4,
    cultivationZone: "Khu canh tác Đông Nam Bộ",
    tree: "Đậu nành",
    province: "Long An",
    district: "Huyện Đức Hòa",
  },
  {
    id: "V004",
    code: "V-DT3",
    name: "Bắp Tháp Mười",
    regionName: "Vùng Bắp Đồng Tháp",
    employee: "Phạm Thị D",
    area: 12000,
    soilType: "Đất đỏ bazan",
    terrain: ["Cao", "Bằng phẳng"],
    mainCrop: "Bắp (Ngô)",
    gps: "10.5234,105.7215 10.5240,105.7226 10.5230,105.7232 10.5224,105.7221",
    numberOfLots: 6,
    cultivationZone: "Khu canh tác ĐBSCL",
    tree: "Bắp (Ngô)",
    province: "Đồng Tháp",
    district: "Huyện Tháp Mười",
  },
  {
    id: "V005",
    code: "V-KG1",
    name: "Đậu nành Tân Hiệp",
    regionName: "Vùng Đậu Nành Kiên Giang",
    employee: "Nguyễn Văn E",
    area: 9500,
    soilType: "Đất thịt",
    terrain: ["Thấp", "Trũng"],
    mainCrop: "Đậu nành",
    gps: "10.1035,105.1981 10.1043,105.1989 10.1036,105.1997 10.1029,105.1989",
    numberOfLots: 4,
    cultivationZone: "Khu canh tác ĐBSCL",
    tree: "Đậu nành",
    province: "Kiên Giang",
    district: "Huyện Tân Hiệp",
  },

  {
    id: "V007",
    code: "V-GL1",
    areaName: "Khu Ia Grai",
    plotName: "Lô G61, Lô G62",
    name: "Đậu nành Tây Nguyên",
    regionName: "Vùng Đậu Nành Gia Lai",
    employee: "Vũ Văn G",
    area: 11000,
    tree: "Đậu nành",
    soilType: "Đất đỏ bazan",
    terrain: ["Cao", "Dốc"],
    mainCrop: "Đậu nành",
    gps: "13.9918,107.9792 13.9926,107.9801 13.9917,107.9809 13.9910,107.9800",
    numberOfLots: 5,
    cultivationZone: "Khu canh tác Tây Nguyên",
    province: "Gia Lai",
    district: "Huyện Ia Grai",
  },
  {
    id: "V008",
    code: "V-NA1",
    name: "Bắp Quỳnh Lưu",
    regionName: "Vùng Bắp Nghệ An",
    employee: "Trần Văn H",
    area: 8000,
    tree: "Bắp (Ngô)",
    soilType: "Đất cát",
    terrain: ["Bằng phẳng"],
    mainCrop: "Bắp (Ngô)",
    gps: "19.2752,105.6213 19.2761,105.6221 19.2753,105.6228 19.2746,105.6219",
    numberOfLots: 4,
    cultivationZone: "Khu canh tác Bắc Trung Bộ",
    province: "Nghệ An",
    district: "Huyện Quỳnh Lưu",
  },
];
const mainCrops = ["Sầu riêng", "Xoài", "Chuối", "Cà phê", "Mít", "Bưởi"];
const soilTypes = [
  "Đất thịt",
  "Đất phù sa",
  "Đất cát",
  "Đất sét",
  "Đất đỏ bazan",
];
const terrains = ["Cao", "Thấp", "Dốc", "Bằng phẳng", "Trũng"];
const AreaManagementRegionPage = () => {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState<string>("");
  const onRegionDetail = () => {
    navigate(PATH.AREA_REGION_DETAIL);
  };
  const onClearAll = () => {
    setKeyword("");
  };
  const areaZoneColumns: MRT_ColumnDef<AreaZone>[] = [
    {
      accessorKey: "cultivationZone",
      header: "Khu vực canh tác",
    },
    {
      accessorKey: "province",
      header: "Tỉnh/Thành phố",
    },
    {
      accessorKey: "district",
      header: "Phường/Xã",
    },
    {
      accessorKey: "regionName",
      header: "Vùng",
    },
    {
      accessorKey: "areaName",
      header: "Khu vực",
    },
    {
      accessorKey: "plotName",
      header: "Lô",
    },
    {
      accessorKey: "area",
      header: "Diện tích canh tác (m²)",
      Cell: ({ row }) => <Text>{row.original.area.toLocaleString()} m²</Text>,
    },
    {
      accessorKey: "tree",
      header: "Cây trồng",
    },
    {
      accessorKey: "employee",
      header: "Người quản lý",
    },

    {
      accessorKey: "actions",
      header: "Tuỳ chọn",
      enableColumnActions: false,
      size: 10,
      Cell: () => (
        <Menu shadow="md">
          <Menu.Target>
            <ActionIcon variant="transparent" c={"gray"}>
              <IconDotsVertical />
            </ActionIcon>
          </Menu.Target>

          <Menu.Dropdown>
            <Menu.Item
              leftSection={<IconEye size={18} color="gray" />}
              onClick={onRegionDetail}
            >
              Chi tiết
            </Menu.Item>
            <Menu.Item leftSection={<IconEdit size={18} color="green" />}>
              Chỉnh sửa
            </Menu.Item>
            <Menu.Item leftSection={<IconTrash size={18} />} color="red">
              Xoá
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      ),
    },
  ];
  const onAddRegion = () => {
    navigate(PATH.AREA_ADD_REGION);
  };
  return (
    <Stack gap="lg">
      <Group justify="space-between">
        <Title flex={1} order={2}>
          Khu vực canh tác
        </Title>
        <Group>
          <Button variant="outline" radius={4} leftSection={<IconFileExcel />}>
            Xuất File
          </Button>
          <Button radius={4} onClick={onAddRegion}>
            Thêm mới
          </Button>
        </Group>
      </Group>

      <Card withBorder shadow="sm" radius={4} p="md">
        {/* Header */}
        <Group justify="space-between" align="center" mb="xs">
          <Stack gap={0}>
            <Title order={4}>Tìm kiếm khu vực canh tác</Title>
            <Text c="dimmed" size="sm">
              Điền từ khóa hoặc chọn lọc cây trồng chính, loại đất, địa hình,
              tỉnh/thành phố, phường/xã
            </Text>
          </Stack>

          <Group>
            <Tooltip label="Xoá tất cả bộ lọc">
              <Button
                radius={4}
                variant="default"
                leftSection={<IconRefresh size={16} />}
                onClick={onClearAll}
              >
                Làm mới
              </Button>
            </Tooltip>
            <Button radius={4} leftSection={<IconSearch size={16} />}>
              Lọc thông tin
            </Button>
          </Group>
        </Group>

        {/* Form */}
        <Stack gap="sm">
          {/* Khung tìm kiếm (keyword) */}
          <TextInput
            radius={4}
            label="Khung tìm kiếm"
            description="Ví dụ: KV-AG01, Vùng Trồng Đậu Nành, HTX Vàm Nao, An Giang…"
            placeholder="Nhập thông tin"
            leftSection={<IconSearch size={16} />}
            value={keyword}
            onChange={(e) => setKeyword(e.currentTarget.value)}
          />

          <SimpleGrid cols={{ base: 1, md: 2, lg: 3 }} spacing="sm">
            <MultiSelect
              searchable
              clearable
              radius={4}
              leftSection={<IconTree size={18} />}
              label="Cây trồng chính"
              description="Ví dụ: Đậu nành, bắp"
              placeholder="Chọn thông tin"
              data={mainCrops}
            />
            <MultiSelect
              searchable
              clearable
              radius={4}
              leftSection={<IconSandbox size={18} />}
              label="Loại đất"
              description="Ví dụ: Đất phù sa, Đất mặn, Đất cát"
              placeholder="Chọn thông tin"
              multiple
              data={soilTypes}
            />
            <MultiSelect
              searchable
              clearable
              radius={4}
              multiple
              leftSection={<IconBrandMetabrainz size={18} />}
              label="Địa hình"
              description="Ví dụ: Đồi núi, Đồng bằng, Ven biển"
              placeholder="Chọn thông tin"
              data={terrains}
            />
            <MultiSelect
              searchable
              clearable
              radius={4}
              multiple
              label="Tỉnh/Thành phố"
              description="Ví dụ: An Giang, Đồng Nai, Đắk Lắk"
              placeholder="Chọn thông tin"
              data={[
                "Hà Nội",
                "TP. Hồ Chí Minh",
                "Đà Nẵng",
                "Cần Thơ",
                "Hải Phòng",
                "Nha Trang",
                "Bình Dương",
                "Đồng Nai",
                "Bà Rịa - Vũng Tàu",
                "Quảng Ninh",
                "Thanh Hóa",
                "Nghệ An",
                "Huế",
                "Quảng Nam",
                "Quảng Ngãi",
                "Bắc Ninh",
                "Bắc Giang",
                "Lâm Đồng",
                "Tiền Giang",
                "Long An",
                "Vĩnh Long",
                "Sóc Trăng",
                "Kiên Giang",
                "Cà Mau",
                "Bình Thuận",
                "Phú Yên",
                "Khánh Hòa",
                "Tây Ninh",
                "Trà Vinh",
                "Bến Tre",
                "Hậu Giang",
                "Đắk Lắk",
                "Đắk Nông",
                "Gia Lai",
                "Kon Tum",
                "Hà Tĩnh",
                "Quảng Bình",
                "Quảng Trị",
                "Thái Bình",
                "Nam Định",
                "Ninh Bình",
                "Hòa Bình",
                "Sơn La",
                "Lai Châu",
                "Điện Biên",
                "Lào Cai",
                "Yên Bái",
                "Tuyên Quang",
                "Phú Thọ",
                "Vĩnh Phúc",
                "Hà Nam",
                "Hưng Yên",
                "Hải Dương",
                "Thái Nguyên",
                "Bắc Kạn",
                "Cao Bằng",
                "Lạng Sơn",
              ]}
            />
            <MultiSelect
              label="Phường/Xã"
              description="Ví dụ: Phường Bến Nghé, Xã Bình Mỹ"
              clearable
              radius={4}
              searchable
              placeholder="Chọn thông tin"
              data={[
                "Phường Bến Nghé",
                "Phường Bến Thành",
                "Phường Nguyễn Thái Bình",
                "Phường Phạm Ngũ Lão",
                "Phường Tân Định",
                "Phường Đa Kao",
                "Phường 1 (Quận 3)",
                "Phường 2 (Quận 3)",
                "Phường 3 (Quận 3)",
                "Phường 4 (Quận 3)",
                "Phường 5 (Quận 3)",
                "Phường 6 (Quận 3)",
                "Phường 7 (Quận 3)",
                "Phường 8 (Quận 3)",
                "Phường 9 (Quận 3)",
                "Phường 10 (Quận 3)",
                "Phường 11 (Quận 3)",
                "Phường 12 (Quận 3)",
                "Xã Tân Phú Trung",
                "Xã Bình Mỹ",
                "Xã Thới Tam Thôn",
                "Xã Trung An",
                "Xã Phước Vĩnh An",
                "Xã Phước Hiệp",
                "Xã Phước Thạnh",
                "Xã An Nhơn Tây",
                "Xã Nhuận Đức",
                "Xã Phạm Văn Cội",
                "Xã Phú Hòa Đông",
                "Xã Phú Mỹ Hưng",
                "Xã Phước Lộc",
                "Xã Long Thới",
                "Xã Nhơn Đức",
                "Xã Phước Kiển",
                "Xã Bình Hưng",
                "Xã Đa Phước",
                "Xã Tân Kiên",
                "Xã Tân Nhựt",
                "Xã Lê Minh Xuân",
                "Xã Vĩnh Lộc A",
                "Xã Vĩnh Lộc B",
                "Xã Phạm Văn Hai",
                "Xã Quy Đức",
                "Xã Hưng Long",
                "Xã Bình Chánh",
                "Xã An Phú Tây",
                "Xã Tân Quý Tây",
                "Xã Tân Túc",
                "Xã Bình Lợi",
                "Xã Bình Thắng",
                "Xã Bình An",
                "Xã Bình Chuẩn",
                "Xã Bình Hòa",
                "Xã Bình Nhâm",
                "Xã Bình Phước",
                "Xã Bình Sơn",
                "Xã Bình Tân",
                "Xã Bình Thạnh",
                "Xã Bình Thuận",
                "Xã Bình Trị",
                "Xã Bình Xuyên",
                "Xã Bình Yên",
                "Xã Bình Định",
                "Xã Bình Dương",
                "Xã Bình Phú",
                "Xã Bình Quới",
                "Xã Bình Thới",
                "Xã Bình Thành",
                "Xã Bình Tiến",
                "Xã Bình Trưng",
              ]}
            />
          </SimpleGrid>

          {/* Tóm tắt filter bằng chips (UI) */}
          {keyword && (
            <Group gap={8}>
              {keyword && (
                <Badge
                  variant="light"
                  rightSection={<CloseButton onClick={() => setKeyword("")} />}
                >
                  Từ khoá: {keyword}
                </Badge>
              )}

              <ActionIcon
                variant="subtle"
                onClick={onClearAll}
                title="Xoá tất cả"
              >
                <IconX size={16} />
              </ActionIcon>
            </Group>
          )}
        </Stack>
      </Card>
      <Table columns={areaZoneColumns} data={areaZoneData} />
    </Stack>
  );
};
export default AreaManagementRegionPage;
