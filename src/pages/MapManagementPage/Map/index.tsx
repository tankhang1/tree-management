import {
  Box,
  Button,
  Group,
  MultiSelect,
  Paper,
  Select,
  SimpleGrid,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from "@mantine/core";
import {
  IconChevronLeft,
  IconMap2,
  IconMapPin,
  IconQrcode,
  IconRotateClockwise2,
  IconSearch,
  IconSparkles,
  IconTree,
} from "@tabler/icons-react";
import { useState } from "react";
import MapBox from "../../AreaManagementPage/Region/Detail/components/Map";

const companyOptions = [
  {
    label:
      "Hộ ông Nguyễn Văn A - Nguyễn Văn A - Ấp 1, xã Tân Lập, huyện Hớn Quản, Bình Phước",
    value: "company1",
  },
  {
    label:
      "HTX Nông nghiệp Bền Vững - Trần Thị B - Xã Phú Riềng, huyện Phú Riềng, Bình Phước",
    value: "company2",
  },
];

const plantVarietyOptions = [
  {
    label: "Sầu riêng - Ri6",
    value: "saurieng-ri6",
  },
  {
    label: "Xoài - Cát Chu",
    value: "xoai-catchu",
  },
  {
    label: "Cà phê - Robusta",
    value: "caphe-robusta",
  },
];

export type MapFilters = {
  company: string | null;
  variety: string | null;
  codes: string[];
  regions: string[];
  areas: string[];
  plots: string[];
};

const initialFilters: MapFilters = {
  company: null,
  variety: null,
  codes: [],
  regions: [],
  areas: [],
  plots: [],
};

const MapManagementMapPage = () => {
  const [openDrawer, setOpenDrawer] = useState(false);

  const [filters, setFilters] = useState<MapFilters>(initialFilters);
  const [appliedFilters, setAppliedFilters] =
    useState<MapFilters>(initialFilters);

  const handleClearFilters = () => {
    setFilters(initialFilters);
    setAppliedFilters(initialFilters);
  };

  const handleApplyFilters = () => {
    setAppliedFilters(filters);
    setOpenDrawer(false);
  };

  return (
    <Stack pos={"relative"}>
      <MapBox h={810} area plot zone zoom={17} />

      <Group pos={"absolute"} bottom={10} style={{ zIndex: 9999 }} pl={"lg"}>
        <Group gap={4}>
          <Box w={10} h={10} style={{ borderRadius: 100 }} bg="red" />
          <Text c={"white"}>Musang King Durian</Text>
        </Group>
        <Group gap={4}>
          <Box w={10} h={10} style={{ borderRadius: 100 }} bg="blue" />
          <Text c={"white"}>Monthong Durian (Dona)</Text>
        </Group>
      </Group>

      <Paper
        withBorder
        radius={4}
        shadow="lg"
        pos="absolute"
        top={24}
        p="lg"
        w={420}
        right={24}
        style={{
          zIndex: 9999,
          background: "linear-gradient(135deg, #f8fafc 0%, #e6f4ec 100%)",
          border: "1px solid #e0e0e0",
          boxShadow: "0 4px 24px 0 rgba(76,175,80,0.08)",
        }}
      >
        {openDrawer ? (
          <Stack gap="sm">
            <Group gap={8}>
              <ThemeIcon variant="light" color="teal" radius="xl">
                <IconMap2 size={18} />
              </ThemeIcon>
              <Title order={5} fw={600}>
                Thông tin tìm kiếm
              </Title>
            </Group>

            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="sm">
              <Select
                radius={4}
                searchable
                clearable
                label="Doanh nghiệp / nông hộ"
                data={companyOptions}
                value={filters.company}
                onChange={(value) =>
                  setFilters((prev) => ({ ...prev, company: value }))
                }
                styles={{ dropdown: { zIndex: 99999 } }}
              />
              <Select
                radius={4}
                searchable
                clearable
                label="Giống cây trồng"
                data={plantVarietyOptions}
                value={filters.variety}
                onChange={(value) =>
                  setFilters((prev) => ({ ...prev, variety: value }))
                }
                styles={{ dropdown: { zIndex: 99999 } }}
              />
            </SimpleGrid>

            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="sm">
              <MultiSelect
                radius={4}
                data={["V01", "V02", "V03"]}
                label="Mã định danh"
                searchable
                clearable
                leftSection={<IconSearch size={16} />}
                value={filters.codes}
                onChange={(value) =>
                  setFilters((prev) => ({ ...prev, codes: value }))
                }
                styles={{ dropdown: { zIndex: 99999 } }}
              />

              <MultiSelect
                label="Vùng trồng"
                clearable
                placeholder="Tìm kiếm vùng trồng"
                radius={4}
                searchable
                leftSection={<IconSearch size={16} />}
                data={["Vùng Trồng Tây Nguyên", "Vùng Trồng Miền Tây"]}
                value={filters.regions}
                onChange={(value) =>
                  setFilters((prev) => ({ ...prev, regions: value }))
                }
                styles={{ dropdown: { zIndex: 99999 } }}
              />

              <MultiSelect
                label="Khu vực"
                clearable
                placeholder="Tìm theo địa danh"
                radius={4}
                searchable
                leftSection={<IconSearch size={16} />}
                data={[
                  "Khu vực phía Bắc",
                  "Khu vực phía Nam",
                  "Khu vực phía Tây",
                ]}
                value={filters.areas}
                onChange={(value) =>
                  setFilters((prev) => ({ ...prev, areas: value }))
                }
                styles={{ dropdown: { zIndex: 99999 } }}
              />

              <MultiSelect
                placeholder="Tìm kiếm lô"
                label="Lô"
                radius={4}
                searchable
                leftSection={<IconSearch size={16} />}
                data={["Lô A1", "Lô B2", "Lô C3"]}
                value={filters.plots}
                onChange={(value) =>
                  setFilters((prev) => ({ ...prev, plots: value }))
                }
                styles={{ dropdown: { zIndex: 99999 } }}
              />
            </SimpleGrid>

            <Group justify="space-between" mt="md">
              <Button
                variant="light"
                radius={4}
                onClick={handleClearFilters}
                leftSection={<IconRotateClockwise2 size={16} />}
              >
                Xoá bộ lọc
              </Button>
              <Button
                radius={4}
                leftSection={<IconSparkles size={16} />}
                onClick={handleApplyFilters}
              >
                Lọc dữ liệu
              </Button>
            </Group>
          </Stack>
        ) : (
          <Stack gap="md">
            <Group gap={10}>
              <Stack bg="brand.5" p={8} style={{ borderRadius: 12 }}>
                <IconMapPin size={24} color="white" />
              </Stack>
              <Text fw={700} size="lg" c="brand.7">
                Thông tin vị trí
              </Text>
            </Group>

            <Stack gap={8}>
              <Group gap={8}>
                <IconChevronLeft size={18} color="#388E3C" />
                <Text size="sm" c="gray.6" fw={500} style={{ minWidth: 140 }}>
                  Doanh nghiệp / Nông hộ:
                </Text>
                <Text size="sm" fw={600} c="brand.7">
                  {appliedFilters.company
                    ? companyOptions.find(
                        (c) => c.value === appliedFilters.company
                      )?.label
                    : "Chưa chọn"}
                </Text>
              </Group>

              <Group gap={8}>
                <IconTree size={18} color="#388E3C" />
                <Text size="sm" c="gray.6" fw={500} style={{ minWidth: 140 }}>
                  Giống cây trồng:
                </Text>
                <Text size="sm" fw={600} c="brand.7">
                  {appliedFilters.variety
                    ? plantVarietyOptions.find(
                        (p) => p.value === appliedFilters.variety
                      )?.label
                    : "Chưa chọn"}
                </Text>
              </Group>

              <Group gap={8}>
                <IconQrcode size={18} color="#388E3C" />
                <Text size="sm" c="gray.6" fw={500} style={{ minWidth: 140 }}>
                  Mã địa chính:
                </Text>
                <Text size="sm" fw={600} c="brand.7">
                  {appliedFilters.codes.length > 0
                    ? appliedFilters.codes.join(", ")
                    : "Tất cả"}
                </Text>
              </Group>

              <Group gap={8}>
                <IconMapPin size={18} color="#388E3C" />
                <Text size="sm" c="gray.6" fw={500} style={{ minWidth: 140 }}>
                  Vùng:
                </Text>
                <Text size="sm" fw={600} c="brand.7">
                  {appliedFilters.regions.length > 0
                    ? appliedFilters.regions.join(", ")
                    : "Tất cả"}
                </Text>
              </Group>

              <Group gap={8}>
                <IconMapPin size={18} color="#388E3C" />
                <Text size="sm" c="gray.6" fw={500} style={{ minWidth: 140 }}>
                  Khu vực:
                </Text>
                <Text size="sm" fw={600} c="brand.7">
                  {appliedFilters.areas.length > 0
                    ? appliedFilters.areas.join(", ")
                    : "Tất cả"}
                </Text>
              </Group>

              <Group gap={8}>
                <IconMapPin size={18} color="#388E3C" />
                <Text size="sm" c="gray.6" fw={500} style={{ minWidth: 140 }}>
                  Lô:
                </Text>
                <Text size="sm" fw={600} c="brand.7">
                  {appliedFilters.plots.length > 0
                    ? appliedFilters.plots.join(", ")
                    : "Tất cả"}
                </Text>
              </Group>
            </Stack>

            <Group grow mt="md">
              <Button
                radius={4}
                variant="outline"
                color="brand"
                onClick={() => setOpenDrawer(true)}
                leftSection={<IconSearch size={16} />}
              >
                Tìm kiếm
              </Button>
              <Button
                radius={4}
                color="brand"
                onClick={() => setOpenDrawer(true)}
              >
                Lọc
              </Button>
            </Group>
          </Stack>
        )}
      </Paper>
    </Stack>
  );
};

export default MapManagementMapPage;
