import {
  ActionIcon,
  Badge,
  Button,
  Card,
  Group,
  Menu,
  Stack,
  Title,
  Tooltip,
  Text,
  TextInput,
  SimpleGrid,
  Select,
  MultiSelect,
  NumberInput,
  Checkbox,
} from "@mantine/core";
import {
  IconBuilding,
  IconDotsVertical,
  IconEdit,
  IconEye,
  IconFileExcel,
  IconHome,
  IconMap,
  IconTrash,
  IconRefresh,
  IconSearch,
} from "@tabler/icons-react";
import type { MRT_ColumnDef } from "mantine-react-table";
import Table from "../../components/Table";
import { useNavigate } from "react-router-dom";
import { PATH } from "../../constants/path.constants";
import { useMemo, useState } from "react";

type FarmerEntity = {
  id: string;
  name: string;
  type: "hộ nông dân" | "doanh nghiệp" | "hợp tác xã";
  ownerName: string;
  identityNumber: string;
  phone: string;
  email?: string;
  address: string;
  province: string;
  location: { lat: number; lng: number };
  taxCode?: string;
  landCertificateNo?: string;
  note?: string;
  crops: string[];
  areaHa: number;
  certifications?: string[];
};

const farmerDataset: FarmerEntity[] = [
  {
    id: "F001",
    name: "Hộ ông Nguyễn Văn A",
    type: "hộ nông dân",
    ownerName: "Nguyễn Văn A",
    identityNumber: "012345678901",
    phone: "0912345678",
    email: "a.nongdan@example.com",
    address: "Ấp 1, xã Tân Lập, huyện Hớn Quản, Bình Phước",
    province: "Bình Phước",
    location: { lat: 11.850812, lng: 106.674836 },
    taxCode: "",
    landCertificateNo: "CN123456789",
    note: "Canh tác theo mô hình VietGAP",
    crops: ["Cây dược liệu", "Hồ tiêu"],
    areaHa: 8.5,
    certifications: ["VietGAP"],
  },
  {
    id: "F002",
    name: "HTX Nông nghiệp Bền Vững",
    type: "hợp tác xã",
    ownerName: "Trần Thị B",
    identityNumber: "123456789012",
    phone: "0938123456",
    email: "info@benvungcoop.vn",
    address: "Xã Phú Riềng, huyện Phú Riềng, Bình Phước",
    province: "Bình Phước",
    location: { lat: 11.667091, lng: 106.985761 },
    taxCode: "0401234567",
    landCertificateNo: "HTX-987654321",
    note: "Liên kết tiêu thụ với DN Nhật",
    crops: ["Cây ăn trái", "Cây có múi"],
    areaHa: 42,
    certifications: ["GlobalG.A.P"],
  },
  {
    id: "F003",
    name: "Công ty TNHH Nông sản HCM",
    type: "doanh nghiệp",
    ownerName: "Phạm Quốc C",
    identityNumber: "079123456789",
    phone: "0909123456",
    email: "contact@hcmaf.com",
    address: "KCN Hiệp Phước, H. Nhà Bè, TP. HCM",
    province: "TP.HCM",
    location: { lat: 10.607, lng: 106.743 },
    taxCode: "0312345678",
    landCertificateNo: "DN-556677",
    note: "Chuỗi cung ứng lạnh",
    crops: ["Rau màu", "Cây dược liệu"],
    areaHa: 25,
    certifications: [],
  },
];

const PROVINCES = [
  "TP.HCM",
  "Bình Dương",
  "Đồng Nai",
  "Tây Ninh",
  "Bình Phước",
];
const CROP_GROUPS = [
  "Cây dược liệu",
  "Cây ăn trái",
  "Cây có múi",
  "Rau màu",
  "Cây công nghiệp",
  "Lúa",
  "Hồ tiêu",
];

const CompanyPage = () => {
  const navigate = useNavigate();
  const [rows, setRows] = useState<FarmerEntity[]>(farmerDataset);

  const [keyword, setKeyword] = useState("");
  const [types, setTypes] = useState<Array<FarmerEntity["type"]>>([]);
  const [provinces, setProvinces] = useState<string[]>([]);
  const [crops, setCrops] = useState<string[]>([]);
  const [minArea, setMinArea] = useState<number | "">(0);
  const [maxArea, setMaxArea] = useState<number | "">("");
  const [hasCert, setHasCert] = useState(false);

  const onAddCompany = () => navigate(PATH.COMPANY_ADD);
  const onCompanyDetail = () => navigate(PATH.COMPANY_DETAIL);

  const farmerColumns: MRT_ColumnDef<FarmerEntity>[] = [
    { accessorKey: "name", header: "Tên đơn vị" },
    { accessorKey: "type", header: "Loại hình" },
    { accessorKey: "ownerName", header: "Chủ sở hữu" },
    { accessorKey: "identityNumber", header: "CCCD/CMND" },
    { accessorKey: "phone", header: "Số điện thoại" },
    { accessorKey: "email", header: "Email" },
    { accessorKey: "address", header: "Địa chỉ" },
    { accessorKey: "taxCode", header: "Mã số thuế" },
    {
      accessorKey: "actions",
      header: "Tuỳ chọn",
      enableColumnActions: false,
      size: 10,
      Cell: () => (
        <Menu shadow="md">
          <Menu.Target>
            <ActionIcon variant="transparent" c="gray">
              <IconDotsVertical />
            </ActionIcon>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item
              onClick={onCompanyDetail}
              leftSection={<IconEye size={18} color="gray" />}
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

  const appliedCount = useMemo(
    () =>
      [
        keyword,
        types.length,
        provinces.length,
        crops.length,
        minArea || minArea === 0 ? 1 : 0,
        maxArea ? 1 : 0,
        hasCert ? 1 : 0,
      ].filter(Boolean).length,
    [keyword, types, provinces, crops, minArea, maxArea, hasCert]
  );

  const resetFilters = () => {
    setKeyword("");
    setTypes([]);
    setProvinces([]);
    setCrops([]);
    setMinArea(0);
    setMaxArea("");
    setHasCert(false);
    setRows(farmerDataset);
  };

  const applyFilters = () => {
    const kw = keyword.trim().toLowerCase();
    const filtered = farmerDataset.filter((r) => {
      const okKw =
        !kw ||
        r.name.toLowerCase().includes(kw) ||
        r.id.toLowerCase().includes(kw) ||
        r.ownerName.toLowerCase().includes(kw) ||
        r.address.toLowerCase().includes(kw) ||
        (r.taxCode || "").toLowerCase().includes(kw);
      const okType = !types.length || types.includes(r.type);
      const okProvince = !provinces.length || provinces.includes(r.province);
      const okCrop = !crops.length || r.crops.some((c) => crops.includes(c));
      const okArea =
        (minArea === "" || r.areaHa >= Number(minArea)) &&
        (maxArea === "" || r.areaHa <= Number(maxArea));
      const okCert =
        !hasCert || (r.certifications && r.certifications.length > 0);
      return okKw && okType && okProvince && okCrop && okArea && okCert;
    });
    setRows(filtered);
  };

  return (
    <Stack gap="lg">
      <Group justify="space-between">
        <Title flex={1} order={2}>
          Quản lý doanh nghiệp / nông hộ
        </Title>
        <Group>
          <Button variant="outline" radius={4} leftSection={<IconFileExcel />}>
            Xuất File
          </Button>
          <Button radius={4} onClick={onAddCompany}>
            Thêm mới
          </Button>
        </Group>
      </Group>

      <Card withBorder shadow="sm" radius={4} p="md">
        <Group justify="space-between" align="center" mb="xs">
          <Stack gap={0}>
            <Title order={4}>Tìm kiếm doanh nghiệp / nông hộ</Title>
            <Text c="dimmed" size="sm">
              Nhập từ khoá (VD: &quot;Nông hộ 1&quot;) hoặc áp dụng bộ lọc (VD:
              &quot;HCM&quot;, &quot;Cây dược liệu&quot;).
            </Text>
          </Stack>
          <Group>
            <Tooltip label="Xoá tất cả bộ lọc">
              <Button
                radius={4}
                variant="default"
                leftSection={<IconRefresh size={16} />}
                onClick={resetFilters}
              >
                Làm mới
              </Button>
            </Tooltip>
            <Button
              radius={4}
              leftSection={<IconSearch size={16} />}
              onClick={applyFilters}
            >
              Tìm kiếm
            </Button>
          </Group>
        </Group>

        <Stack gap="sm">
          <TextInput
            radius={4}
            label="Từ khoá"
            description='Ví dụ: "FARM001", "Hồ tiêu", "Phú Riềng"...'
            placeholder="Nhập tên, mã, chủ sở hữu, địa chỉ..."
            leftSection={<IconSearch size={16} />}
            value={keyword}
            onChange={(e) => setKeyword(e.currentTarget.value)}
          />

          <SimpleGrid cols={{ base: 1, md: 2, lg: 3 }} spacing="sm">
            <MultiSelect
              radius={4}
              label="Tỉnh/Thành"
              placeholder="Chọn"
              data={PROVINCES}
              searchable
              clearable
              value={provinces}
              onChange={setProvinces}
            />
            <MultiSelect
              radius={4}
              label="Nhóm cây trồng"
              placeholder="Chọn"
              data={CROP_GROUPS}
              searchable
              clearable
              value={crops}
              onChange={setCrops}
            />
            <MultiSelect
              radius={4}
              label="Loại hình"
              placeholder="Chọn"
              data={[
                { value: "doanh nghiệp", label: "Doanh nghiệp" },
                { value: "hộ nông dân", label: "Hộ nông dân" },
                { value: "hợp tác xã", label: "Hợp tác xã" },
              ]}
              searchable
              clearable
              value={types as any}
              onChange={(v) => setTypes(v as any)}
            />
            <Group gap="xs" align="end">
              <NumberInput
                radius={4}
                label="Diện tích tối thiểu (ha)"
                value={minArea}
                min={0}
                step={0.5}
              />
              <NumberInput
                radius={4}
                label="Diện tích tối đa (ha)"
                value={maxArea}
                min={0}
                step={0.5}
              />
            </Group>
            <Checkbox
              mt={28}
              radius={4}
              label="Có chứng nhận"
              checked={hasCert}
              onChange={(e) => setHasCert(e.currentTarget.checked)}
            />
          </SimpleGrid>
        </Stack>
      </Card>

      <Table columns={farmerColumns} data={rows} />
    </Stack>
  );
};

export default CompanyPage;
