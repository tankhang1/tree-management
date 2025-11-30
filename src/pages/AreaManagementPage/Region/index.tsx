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
import { useMemo, useState } from "react";
import { useRegionStore } from "../../zustand/regionStore";
import { useAreaSetupStore } from "../../zustand/areaSetupStore";
import { usePlotStore } from "../../zustand/plotStore";
type AreaZone = {
  id: string;
  code: string;
  name: string;
  regionName: string;
  areaName?: string;
  plotName?: string;
  employee: string;
  area: number;
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

const terrains = ["Cao", "Thấp", "Dốc", "Bằng phẳng", "Trũng"];

const AreaManagementRegionPage = () => {
  const navigate = useNavigate();

  const { regions } = useRegionStore();
  const { plots } = usePlotStore();
  const { setups } = useAreaSetupStore();

  const [keyword, setKeyword] = useState<string>("");
  const [selectedMainCrops, setSelectedMainCrops] = useState<string[]>([]);
  const [selectedSoilTypes, setSelectedSoilTypes] = useState<string[]>([]);
  const [selectedTerrains, setSelectedTerrains] = useState<string[]>([]);
  const [selectedProvinces, setSelectedProvinces] = useState<string[]>([]);
  const [selectedDistricts, setSelectedDistricts] = useState<string[]>([]);

  const areaZoneData: AreaZone[] = useMemo(() => {
    return setups.map((setup) => {
      const region =
        regions.find((r) => r.id === setup.regionId) ??
        regions.find((r) => r.region.codeSystem === setup.regionId);

      const selectedAreas = region
        ? region.areas.filter((a) => setup.areaCodes.includes(a.code))
        : [];

      const selectedPlots = plots.filter((p) =>
        setup.plotCodes.includes(p.plot.code)
      );

      let areaName: string | undefined;
      let plotName: string | undefined;
      let areaValue = 0;
      let soilType = "";
      let terrain: string[] = [];
      let mainCrop = "";

      if (setup.type === "region" && region) {
        areaValue = Number(region.region.area) || 0;
        soilType = region.region.soilType;
        terrain = region.region.terrain;
        if (region.areas.length === 1) {
          mainCrop = region.areas[0].mainCrop;
        } else if (region.areas.length > 1) {
          const crops = Array.from(
            new Set(region.areas.map((a) => a.mainCrop))
          );
          mainCrop = crops.length === 1 ? crops[0] : "Đa cây trồng";
        }
      }

      if (setup.type === "area" && selectedAreas.length) {
        areaName = selectedAreas.map((a) => a.name).join(", ");
        areaValue = selectedAreas.reduce(
          (sum, a) => sum + (Number(a.area) || 0),
          0
        );
        const soilSet = new Set(selectedAreas.map((a) => a.soilType));
        soilType = Array.from(soilSet).join(", ");
        terrain = Array.from(new Set(selectedAreas.flatMap((a) => a.terrain)));
        const crops = Array.from(new Set(selectedAreas.map((a) => a.mainCrop)));
        mainCrop = crops.length === 1 ? crops[0] : "Đa cây trồng";
      }

      if (setup.type === "plot" && selectedPlots.length) {
        plotName = selectedPlots.map((p) => p.plot.name).join(", ");
        areaValue = selectedPlots.reduce(
          (sum, p) => sum + (Number(p.plot.area) || 0),
          0
        );

        const areaCodesInPlots = new Set(
          selectedPlots.map((p) => p.plot.areaCode)
        );
        const areasOfPlots =
          region?.areas.filter((a) => areaCodesInPlots.has(a.code)) ?? [];

        if (areasOfPlots.length) {
          if (!soilType) {
            const soilSet = new Set(areasOfPlots.map((a) => a.soilType));
            soilType = Array.from(soilSet).join(", ");
          }
          if (!terrain.length) {
            terrain = Array.from(
              new Set(areasOfPlots.flatMap((a) => a.terrain))
            );
          }
          const crops = Array.from(
            new Set(areasOfPlots.map((a) => a.mainCrop))
          );
          mainCrop = crops.length === 1 ? crops[0] : "Đa cây trồng";
        }
      }

      if (!soilType && region) soilType = region.region.soilType;
      if (!terrain.length && region) terrain = region.region.terrain;
      if (!mainCrop) mainCrop = "Chưa thiết lập";
      const tree = mainCrop;

      const province = region?.region.province ?? "";
      const district = region?.region.ward ?? "";

      return {
        id: setup.id,
        code: setup.id,
        name: setup.name,
        regionName: region?.region.name ?? "",
        areaName,
        plotName,
        employee:
          setup.managerIds.length > 0
            ? setup.managerIds.join(", ")
            : "Chưa phân công",
        area: areaValue,
        soilType,
        terrain,
        mainCrop,
        gps: region?.region.gps ?? "",
        numberOfLots: setup.plotCodes.length,
        cultivationZone: setup.name,
        tree,
        province,
        district,
      };
    });
  }, [setups, regions, plots]);

  const provinceOptions = useMemo(
    () =>
      Array.from(new Set(areaZoneData.map((item) => item.province))).filter(
        Boolean
      ),
    [areaZoneData]
  );

  const districtOptions = useMemo(
    () =>
      Array.from(new Set(areaZoneData.map((item) => item.district))).filter(
        Boolean
      ),
    [areaZoneData]
  );

  const mainCropOptions = useMemo(
    () =>
      Array.from(new Set(areaZoneData.map((item) => item.tree))).filter(
        Boolean
      ),
    [areaZoneData]
  );

  const soilTypeOptions = useMemo(
    () =>
      Array.from(
        new Set(
          areaZoneData
            .flatMap((item) => item.soilType.split(","))
            .map((s) => s.trim())
        )
      ).filter(Boolean),
    [areaZoneData]
  );

  const filteredData = useMemo(() => {
    const q = keyword.trim().toLowerCase();

    return areaZoneData.filter((item) => {
      if (q) {
        const target = (
          item.code +
          " " +
          item.name +
          " " +
          item.regionName +
          " " +
          (item.areaName ?? "") +
          " " +
          (item.plotName ?? "") +
          " " +
          item.employee +
          " " +
          item.tree +
          " " +
          item.province +
          " " +
          item.district
        ).toLowerCase();

        if (!target.includes(q)) return false;
      }

      if (
        selectedMainCrops.length > 0 &&
        !selectedMainCrops.includes(item.tree)
      )
        return false;

      if (
        selectedSoilTypes.length > 0 &&
        !selectedSoilTypes.some((s) => item.soilType.includes(s))
      )
        return false;

      if (selectedTerrains.length > 0) {
        const hasTerrain = item.terrain.some((t) =>
          selectedTerrains.includes(t)
        );
        if (!hasTerrain) return false;
      }

      if (
        selectedProvinces.length > 0 &&
        !selectedProvinces.includes(item.province)
      )
        return false;

      if (
        selectedDistricts.length > 0 &&
        !selectedDistricts.includes(item.district)
      )
        return false;

      return true;
    });
  }, [
    keyword,
    areaZoneData,
    selectedMainCrops,
    selectedSoilTypes,
    selectedTerrains,
    selectedProvinces,
    selectedDistricts,
  ]);

  const onRegionDetail = () => {
    navigate(PATH.AREA_REGION_DETAIL);
  };

  const onAddRegion = () => {
    navigate(PATH.AREA_ADD_REGION);
  };

  const onClearAll = () => {
    setKeyword("");
    setSelectedMainCrops([]);
    setSelectedSoilTypes([]);
    setSelectedTerrains([]);
    setSelectedProvinces([]);
    setSelectedDistricts([]);
  };

  const areaZoneColumns: MRT_ColumnDef<AreaZone>[] = [
    { accessorKey: "cultivationZone", header: "Khu vực canh tác" },
    { accessorKey: "province", header: "Tỉnh/Thành phố" },
    { accessorKey: "district", header: "Phường/Xã" },
    { accessorKey: "regionName", header: "Vùng" },
    { accessorKey: "areaName", header: "Khu vực" },
    { accessorKey: "plotName", header: "Lô" },
    {
      accessorKey: "area",
      header: "Diện tích canh tác (m²)",
      Cell: ({ row }) => <Text>{row.original.area.toLocaleString()} m²</Text>,
    },
    { accessorKey: "tree", header: "Cây trồng" },
    { accessorKey: "employee", header: "Người quản lý" },
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

        <Stack gap="sm">
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
              data={mainCropOptions}
              value={selectedMainCrops}
              onChange={setSelectedMainCrops}
            />
            <MultiSelect
              searchable
              clearable
              radius={4}
              leftSection={<IconSandbox size={18} />}
              label="Loại đất"
              description="Ví dụ: Đất phù sa, Đất mặn, Đất cát"
              placeholder="Chọn thông tin"
              data={soilTypeOptions}
              value={selectedSoilTypes}
              onChange={setSelectedSoilTypes}
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
              value={selectedTerrains}
              onChange={setSelectedTerrains}
            />
            <MultiSelect
              searchable
              clearable
              radius={4}
              multiple
              label="Tỉnh/Thành phố"
              description="Ví dụ: An Giang, Đồng Nai, Đắk Lắk"
              placeholder="Chọn thông tin"
              data={provinceOptions}
              value={selectedProvinces}
              onChange={setSelectedProvinces}
            />
            <MultiSelect
              label="Phường/Xã"
              description="Ví dụ: Phường Bến Nghé, Xã Bình Mỹ"
              clearable
              radius={4}
              searchable
              placeholder="Chọn thông tin"
              data={districtOptions}
              value={selectedDistricts}
              onChange={setSelectedDistricts}
            />
          </SimpleGrid>

          {(keyword ||
            selectedMainCrops.length ||
            selectedSoilTypes.length ||
            selectedTerrains.length ||
            selectedProvinces.length ||
            selectedDistricts.length) && (
            <Group gap={8} mt="xs">
              {keyword && (
                <Badge
                  variant="light"
                  rightSection={<CloseButton onClick={() => setKeyword("")} />}
                >
                  Từ khoá: {keyword}
                </Badge>
              )}

              {selectedMainCrops.map((c) => (
                <Badge
                  key={c}
                  variant="light"
                  rightSection={
                    <CloseButton
                      onClick={() =>
                        setSelectedMainCrops((prev) =>
                          prev.filter((item) => item !== c)
                        )
                      }
                    />
                  }
                >
                  Cây trồng: {c}
                </Badge>
              ))}

              {selectedSoilTypes.map((s) => (
                <Badge
                  key={s}
                  variant="light"
                  rightSection={
                    <CloseButton
                      onClick={() =>
                        setSelectedSoilTypes((prev) =>
                          prev.filter((item) => item !== s)
                        )
                      }
                    />
                  }
                >
                  Loại đất: {s}
                </Badge>
              ))}

              {selectedTerrains.map((t) => (
                <Badge
                  key={t}
                  variant="light"
                  rightSection={
                    <CloseButton
                      onClick={() =>
                        setSelectedTerrains((prev) =>
                          prev.filter((item) => item !== t)
                        )
                      }
                    />
                  }
                >
                  Địa hình: {t}
                </Badge>
              ))}

              {selectedProvinces.map((p) => (
                <Badge
                  key={p}
                  variant="light"
                  rightSection={
                    <CloseButton
                      onClick={() =>
                        setSelectedProvinces((prev) =>
                          prev.filter((item) => item !== p)
                        )
                      }
                    />
                  }
                >
                  Tỉnh: {p}
                </Badge>
              ))}

              {selectedDistricts.map((d) => (
                <Badge
                  key={d}
                  variant="light"
                  rightSection={
                    <CloseButton
                      onClick={() =>
                        setSelectedDistricts((prev) =>
                          prev.filter((item) => item !== d)
                        )
                      }
                    />
                  }
                >
                  Huyện/Xã: {d}
                </Badge>
              ))}

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

      <Table columns={areaZoneColumns} data={filteredData} />
    </Stack>
  );
};

export default AreaManagementRegionPage;
