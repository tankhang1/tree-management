import {
  ActionIcon,
  Badge,
  Button,
  Group,
  Menu,
  Select,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import Table from "../../../components/Table";
import type { MRT_ColumnDef } from "mantine-react-table";
import {
  IconBrandMetabrainz,
  IconDotsVertical,
  IconEdit,
  IconEye,
  IconFileExcel,
  IconSandbox,
  IconTrash,
} from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { PATH } from "../../../constants/path.constants";
type AreaZone = {
  id: string;
  code: string;
  name: string;
  regionName: string;
  orgUnit: string;
  area: number; // m²
  soilType: string;
  terrain: string[];
  gps: string; // polygon: "lat,lng lat,lng lat,lng lat,lng"
  numberOfLots: number;
  province: string;
  district: string;
};

export const areaZoneData: AreaZone[] = [
  {
    id: "K001",
    code: "KV-AG01",
    name: "Cánh đồng Vàm Nao",
    regionName: "Vùng Trồng Lúa An Giang",
    orgUnit: "HTX Nông nghiệp Vàm Nao",
    area: 15000, // ~1.5 ha
    soilType: "Đất phù sa",
    terrain: ["Bằng phẳng", "Ven sông"],
    gps: "10.3862,105.4351 10.3868,105.4362 10.3857,105.4367 10.3853,105.4356",
    numberOfLots: 5,
    province: "An Giang",
    district: "TP. Long Xuyên",
  },
  {
    id: "K002",
    code: "KV-TG01",
    name: "Ruộng Mỹ Tho",
    regionName: "Vùng Trồng Lúa Tiền Giang",
    orgUnit: "Hộ Ông Trần Văn H.",
    area: 12000,
    soilType: "Đất phù sa",
    terrain: ["Bằng phẳng", "Trũng nhẹ"],
    gps: "10.3521,106.3562 10.3529,106.3569 10.3520,106.3576 10.3514,106.3568",
    numberOfLots: 4,
    province: "Tiền Giang",
    district: "TP. Mỹ Tho",
  },
  {
    id: "K003",
    code: "KV-CT01",
    name: "Vườn cây Cái Răng",
    regionName: "Vùng Cây Ăn Trái Hậu Giang – Cần Thơ",
    orgUnit: "Hộ Bà Nguyễn Thị L.",
    area: 18000,
    soilType: "Đất phù sa",
    terrain: ["Bằng phẳng", "Ven kênh"],
    gps: "10.0105,105.7498 10.0112,105.7506 10.0103,105.7513 10.0097,105.7505",
    numberOfLots: 6,
    province: "Cần Thơ",
    district: "Quận Cái Răng",
  },
  {
    id: "K004",
    code: "KV-DT01",
    name: "Đồng Sen Tháp Mười",
    regionName: "Vùng Lúa – Sen Đồng Tháp",
    orgUnit: "HTX Tháp Mười",
    area: 22000,
    soilType: "Đất phèn (đã xử lý)",
    terrain: ["Bằng phẳng", "Trũng"],
    gps: "10.5234,105.7215 10.5240,105.7226 10.5230,105.7232 10.5224,105.7221",
    numberOfLots: 7,
    province: "Đồng Tháp",
    district: "Huyện Tháp Mười",
  },
  {
    id: "K005",
    code: "KV-BT01",
    name: "Vườn Dừa Châu Thành",
    regionName: "Vùng Dừa Bến Tre",
    orgUnit: "Hộ Ông Lê Văn Q.",
    area: 9000,
    soilType: "Đất cát pha",
    terrain: ["Bằng phẳng", "Ven sông"],
    gps: "10.2221,106.3731 10.2229,106.3738 10.2221,106.3746 10.2214,106.3738",
    numberOfLots: 3,
    province: "Bến Tre",
    district: "Huyện Châu Thành",
  },
  {
    id: "K006",
    code: "KV-VL01",
    name: "Vườn Bưởi Bình Minh",
    regionName: "Vùng Cây Có Múi Vĩnh Long",
    orgUnit: "Doanh nghiệp VinaFruit",
    area: 11000,
    soilType: "Đất phù sa",
    terrain: ["Bằng phẳng"],
    gps: "10.2124,105.9726 10.2130,105.9734 10.2121,105.9740 10.2116,105.9732",
    numberOfLots: 4,
    province: "Vĩnh Long",
    district: "Thị xã Bình Minh",
  },
  {
    id: "K007",
    code: "KV-LA01",
    name: "Cánh đồng Đức Hòa",
    regionName: "Vùng Rau Màu Long An",
    orgUnit: "HTX Đức Hòa",
    area: 25000,
    soilType: "Đất thịt nhẹ",
    terrain: ["Bằng phẳng"],
    gps: "10.7918,106.4152 10.7925,106.4161 10.7917,106.4169 10.7910,106.4160",
    numberOfLots: 6,
    province: "Long An",
    district: "Huyện Đức Hòa",
  },
  {
    id: "K008",
    code: "KV-KG01",
    name: "Cánh đồng Tân Hiệp",
    regionName: "Vùng Lúa Kiên Giang",
    orgUnit: "Hộ Bà Trần Thị S.",
    area: 30000,
    soilType: "Đất phù sa ngọt",
    terrain: ["Bằng phẳng"],
    gps: "10.1035,105.1981 10.1043,105.1989 10.1036,105.1997 10.1029,105.1989",
    numberOfLots: 8,
    province: "Kiên Giang",
    district: "Huyện Tân Hiệp",
  },
];
const MapManagementRegionPage = () => {
  const navigate = useNavigate();
  const onRegionDetail = () => {
    navigate(PATH.MAP_REGION_DETAIL);
  };
  const areaZoneColumns: MRT_ColumnDef<AreaZone>[] = [
    {
      accessorKey: "code",
      header: "Mã vùng",
      Cell: ({ row }) => <Text fw={500}>{row.original.code}</Text>,
    },

    {
      accessorKey: "regionName",
      header: "Vùng",
    },
    {
      accessorKey: "orgUnit",
      header: "Doanh nghiệp / nông hộ",
    },
    {
      accessorKey: "province",
      header: "Tỉnh/Thành phố",
    },
    {
      accessorKey: "district",
      header: "Quận/Huyện",
    },
    {
      accessorKey: "area",
      header: "Diện tích (m²)",
      Cell: ({ row }) => <Text>{row.original?.area?.toLocaleString()} m²</Text>,
    },
    {
      accessorKey: "soilType",
      header: "Loại đất",
    },
    {
      accessorKey: "terrain",
      header: "Địa hình",
      Cell: ({ row }) => (
        <Group gap="xs">
          {row.original.terrain.map((item, i) => (
            <Badge key={i} size="xs" color="gray">
              {item}
            </Badge>
          ))}
        </Group>
      ),
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
    navigate(PATH.MAP_ADD_REGION);
  };
  return (
    <Stack gap="lg">
      <Group justify="space-between">
        <Title flex={1} order={2}>
          Phân bổ vùng
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
      <Group>
        <Select
          searchable
          clearable
          radius={4}
          leftSection={<IconSandbox size={18} />}
          placeholder="Chọn loại đất"
          multiple
          data={[
            "Đất thịt",
            "Đất phù sa",
            "Đất cát",
            "Đất sét",
            "Đất đỏ bazan",
            "Đất mùn",
            "Đất kiềm",
            "Đất chua",
          ]}
        />
        <Select
          searchable
          clearable
          radius={4}
          multiple
          leftSection={<IconBrandMetabrainz size={18} />}
          placeholder="Chọn địa hình"
          data={[
            "Cao",
            "Thấp",
            "Dốc",
            "Bằng phẳng",
            "Trũng",
            "Đồi núi",
            "Đồng bằng",
            "Ven sông",
          ]}
        />
        <Select
          searchable
          clearable
          radius={4}
          multiple
          placeholder="Tỉnh/Thành phố"
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
        <Select
          clearable
          radius={4}
          searchable
          placeholder="Xã/Phường"
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
      </Group>
      <Table columns={areaZoneColumns} data={areaZoneData} />
    </Stack>
  );
};
export default MapManagementRegionPage;
