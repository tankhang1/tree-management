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
  IconMapPin,
  IconRefresh,
  IconSandbox,
  IconSearch,
  IconTrash,
  IconX,
} from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { PATH } from "../../../constants/path.constants";
import { useMemo, useState } from "react";
import { useRegionStore, type RegionEntity } from "../../zustand/regionStore";
import { useCompanyStore } from "../../zustand/companyStore";

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

type FilterState = {
  keyword: string;
  soilTypes: string[];
  terrains: string[];
  provinces: string[];
  wards: string[];
};

const MapManagementRegionPage = () => {
  const { regions } = useRegionStore();
  const { companies } = useCompanyStore();
  const navigate = useNavigate();

  // UI input state
  const [keyword, setKeyword] = useState("");
  const [soilTypes, setSoilTypes] = useState<string[]>([]);
  const [terrains, setTerrains] = useState<string[]>([]);
  const [provinces, setProvinces] = useState<string[]>([]);
  const [wards, setWards] = useState<string[]>([]);

  // Applied filters (thực sự dùng để lọc bảng)
  const [appliedFilters, setAppliedFilters] = useState<FilterState>({
    keyword: "",
    soilTypes: [],
    terrains: [],
    provinces: [],
    wards: [],
  });

  const clearAll = () => {
    setKeyword("");
    setSoilTypes([]);
    setTerrains([]);
    setProvinces([]);
    setWards([]);

    setAppliedFilters({
      keyword: "",
      soilTypes: [],
      terrains: [],
      provinces: [],
      wards: [],
    });
  };

  const handleApplyFilters = () => {
    setAppliedFilters({
      keyword,
      soilTypes,
      terrains,
      provinces,
      wards,
    });
  };

  const onRegionDetail = () => {
    navigate(PATH.MAP_REGION_DETAIL);
  };

  const onAddRegion = () => {
    navigate(PATH.MAP_ADD_REGION);
  };

  const areaZoneColumns: MRT_ColumnDef<RegionEntity>[] = [
    {
      accessorKey: "code",
      header: "Mã vùng",
      Cell: ({ row }) => <Text fw={500}>{row.original.id}</Text>,
    },
    {
      accessorKey: "regionName",
      header: "Vùng",
      Cell: ({ row }) => <Text fw={500}>{row.original.region.name}</Text>,
    },
    {
      accessorKey: "orgUnit",
      header: "Doanh nghiệp / nông hộ",
      Cell: ({ row }) => {
        const companyNames = companies
          .filter((company) =>
            row.original.region.companyIds.includes(company.id.toString())
          )
          .map((item) => item.name);
        return (
          <Stack>
            {companyNames.map((item) => (
              <Text fw={500}>- {item}</Text>
            ))}
          </Stack>
        );
      },
    },
    {
      accessorKey: "province",
      header: "Tỉnh/Thành phố",
      Cell: ({ row }) => <Text>{row.original?.region.province}</Text>,
    },
    {
      accessorKey: "district",
      header: "Phường/Xã",
      Cell: ({ row }) => <Text>{row.original?.region.ward}</Text>,
    },
    {
      accessorKey: "address",
      header: "Địa chỉ",
      Cell: ({ row }) => <Text>{row.original?.region.address}</Text>,
    },
    {
      accessorKey: "area",
      header: "Diện tích (m²)",
      Cell: ({ row }) => (
        <Text>{row.original?.region.area?.toLocaleString()} m²</Text>
      ),
    },
    {
      accessorKey: "soilType",
      header: "Loại đất",
      Cell: ({ row }) => <Text>{row.original?.region.soilType}</Text>,
    },
    {
      accessorKey: "terrain",
      header: "Địa hình",
      Cell: ({ row }) => (
        <Group gap="xs">
          {row.original.region.terrain.map((item, i) => (
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
            <ActionIcon variant="transparent" c="gray">
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

  // Dữ liệu sau khi áp filter
  const filteredAreaZones = useMemo(() => {
    const {
      keyword: kw,
      soilTypes: fSoil,
      terrains: fTerrain,
      provinces: fProv,
      wards: fWards,
    } = appliedFilters;

    const kwLower = kw.trim().toLowerCase();

    return regions.filter((item) => {
      // Keyword: check code, name, regionName, orgUnit, province, district, soilType, terrain
      if (kwLower) {
        const inKeyword =
          item.region.name.toLowerCase().includes(kwLower) ||
          item.region.note.toLowerCase().includes(kwLower) ||
          item.region.area.toLowerCase().includes(kwLower);

        if (!inKeyword) return false;
      }

      // Loại đất
      if (fSoil.length > 0 && !fSoil.includes(item.region.soilType)) {
        return false;
      }

      // Địa hình (chỉ cần giao nhau)
      if (
        fTerrain.length > 0 &&
        item.region.terrain.every((t) => !fTerrain.includes(t))
      ) {
        return false;
      }

      // Tỉnh/Thành
      if (fProv.length > 0 && !fProv.includes(item.region.province)) {
        return false;
      }

      // Phường/Xã (district)
      if (fWards.length > 0 && !fWards.includes(item.region.ward)) {
        return false;
      }

      return true;
    });
  }, [appliedFilters]);

  const hasAppliedFilters =
    !!appliedFilters.keyword ||
    appliedFilters.soilTypes.length > 0 ||
    appliedFilters.terrains.length > 0 ||
    appliedFilters.provinces.length > 0 ||
    appliedFilters.wards.length > 0;
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

      <Card withBorder shadow="sm" radius={4} p="md">
        {/* Header */}
        <Group justify="space-between" align="center" mb="xs">
          <Stack gap={0}>
            <Title order={4}>Tìm kiếm vùng</Title>
            <Text c="dimmed" size="sm">
              Điền từ khoá hoặc chọn lọc theo Loại đất, Địa hình, Tỉnh/Thành,
              Phường/Xã
            </Text>
          </Stack>

          <Group>
            <Tooltip label="Xoá tất cả bộ lọc">
              <Button
                radius={4}
                variant="default"
                leftSection={<IconRefresh size={16} />}
                onClick={clearAll}
              >
                Làm mới
              </Button>
            </Tooltip>
            <Button
              radius={4}
              leftSection={<IconSearch size={16} />}
              onClick={handleApplyFilters}
            >
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
            description="Ví dụ: KV-AG01, Vùng trồng đậu nành, HTX Vàm Nao, An Giang…"
            placeholder="Nhập thông tin"
            leftSection={<IconSearch size={16} />}
            value={keyword}
            onChange={(e) => setKeyword(e.currentTarget.value)}
          />

          <SimpleGrid cols={{ base: 1, md: 2, lg: 4 }} spacing="sm">
            <MultiSelect
              radius={4}
              searchable
              clearable
              label="Loại đất"
              description="Ví dụ: Đất phù sa, Đất đỏ bazan"
              leftSection={<IconSandbox size={18} />}
              placeholder="Chọn thông tin"
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
              value={soilTypes}
              onChange={setSoilTypes}
              maxDropdownHeight={220}
            />

            <MultiSelect
              searchable
              clearable
              radius={4}
              label="Địa hình"
              description="Ví dụ: Bằng phẳng, Dốc, Ven sông"
              leftSection={<IconBrandMetabrainz size={18} />}
              placeholder="Chọn thông tin"
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
              value={terrains}
              onChange={setTerrains}
              maxDropdownHeight={220}
            />

            <MultiSelect
              searchable
              clearable
              radius={4}
              label="Tỉnh/Thành phố"
              description="Ví dụ: An Giang, Lâm Đồng, TP. Hồ Chí Minh"
              leftSection={<IconMapPin size={18} />}
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
              value={provinces}
              onChange={setProvinces}
              maxDropdownHeight={240}
            />

            <MultiSelect
              searchable
              clearable
              radius={4}
              label="Phường/Xã"
              description="Ví dụ: Phường Bến Nghé, Xã Phú Mỹ Hưng"
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
              ]}
              value={wards}
              onChange={setWards}
              maxDropdownHeight={240}
            />
          </SimpleGrid>

          {/* Tóm tắt filter bằng chips (applied) */}
          {hasAppliedFilters && (
            <Group gap={8}>
              {appliedFilters.keyword && (
                <Badge
                  variant="light"
                  rightSection={
                    <CloseButton
                      onClick={() =>
                        setAppliedFilters((prev) => ({
                          ...prev,
                          keyword: "",
                        }))
                      }
                    />
                  }
                >
                  Từ khoá: {appliedFilters.keyword}
                </Badge>
              )}
              {appliedFilters.soilTypes.length > 0 && (
                <Badge
                  variant="light"
                  rightSection={
                    <CloseButton
                      onClick={() =>
                        setAppliedFilters((prev) => ({
                          ...prev,
                          soilTypes: [],
                        }))
                      }
                    />
                  }
                >
                  Loại đất: {appliedFilters.soilTypes.join(", ")}
                </Badge>
              )}
              {appliedFilters.terrains.length > 0 && (
                <Badge
                  variant="light"
                  rightSection={
                    <CloseButton
                      onClick={() =>
                        setAppliedFilters((prev) => ({
                          ...prev,
                          terrains: [],
                        }))
                      }
                    />
                  }
                >
                  Địa hình: {appliedFilters.terrains.join(", ")}
                </Badge>
              )}
              {appliedFilters.provinces.length > 0 && (
                <Badge
                  variant="light"
                  rightSection={
                    <CloseButton
                      onClick={() =>
                        setAppliedFilters((prev) => ({
                          ...prev,
                          provinces: [],
                        }))
                      }
                    />
                  }
                >
                  Tỉnh/TP: {appliedFilters.provinces.join(", ")}
                </Badge>
              )}
              {appliedFilters.wards.length > 0 && (
                <Badge
                  variant="light"
                  rightSection={
                    <CloseButton
                      onClick={() =>
                        setAppliedFilters((prev) => ({
                          ...prev,
                          wards: [],
                        }))
                      }
                    />
                  }
                >
                  Phường/Xã: {appliedFilters.wards.join(", ")}
                </Badge>
              )}
              <ActionIcon
                variant="subtle"
                onClick={clearAll}
                title="Xoá tất cả"
              >
                <IconX size={16} />
              </ActionIcon>
            </Group>
          )}
        </Stack>
      </Card>

      <Table columns={areaZoneColumns} data={filteredAreaZones} />
    </Stack>
  );
};

export default MapManagementRegionPage;
