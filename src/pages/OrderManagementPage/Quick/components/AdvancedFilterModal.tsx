// AdvancedFilterModal.tsx
import {
  ActionIcon,
  Badge,
  Button,
  Chip,
  Divider,
  Group,
  Indicator,
  Kbd,
  Modal,
  MultiSelect,
  NumberInput,
  Paper,
  Pill,
  PillsInput,
  ScrollArea,
  SegmentedControl,
  SimpleGrid,
  Stack,
  Text,
  ThemeIcon,
  Title,
  Tooltip,
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { useDisclosure } from "@mantine/hooks";
import {
  IconAdjustments,
  IconArrowDown,
  IconArrowUp,
  IconCalendar,
  IconFilter,
  IconRefresh,
  IconX,
} from "@tabler/icons-react";
import { useEffect, useMemo, useState } from "react";

export type AdvancedFilters = {
  certifications: string[];
  categories: string[];
  areas: string[];
  priceMin?: number | null;
  priceMax?: number | null;
  dateRange?: [Date | null, Date | null];
  sortBy?: "priceAsc" | "priceDesc" | "category" | "date" | null;
};

type Props = {
  opened: boolean;
  onClose: () => void;
  onApply: (filters: AdvancedFilters) => void;
  initial?: Partial<AdvancedFilters>;
  certificationOptions: string[];
  categoryOptions: string[];
  areaOptions: string[];
};

const currency = (v?: number | null) =>
  typeof v === "number" && !Number.isNaN(v) ? v.toLocaleString("vi-VN") : "";

export default function AdvancedFilterModal({
  opened,
  onClose,
  onApply,
  initial,
  certificationOptions,
  categoryOptions,
  areaOptions,
}: Props) {
  const [certifications, setCertifications] = useState<string[]>(
    initial?.certifications ?? []
  );
  const [categories, setCategories] = useState<string[]>(
    initial?.categories ?? []
  );
  const [areas, setAreas] = useState<string[]>(initial?.areas ?? []);
  const [priceMin, setPriceMin] = useState<number | null>(
    initial?.priceMin ?? null
  );
  const [priceMax, setPriceMax] = useState<number | null>(
    initial?.priceMax ?? null
  );
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>(
    initial?.dateRange ?? [null, null]
  );
  const [sortBy, setSortBy] = useState<AdvancedFilters["sortBy"]>(
    initial?.sortBy ?? "date"
  );
  const [openedPresets, { toggle: togglePresets }] = useDisclosure(false);

  useEffect(() => {
    if (!opened) return;
    setCertifications(initial?.certifications ?? []);
    setCategories(initial?.categories ?? []);
    setAreas(initial?.areas ?? []);
    setPriceMin(initial?.priceMin ?? null);
    setPriceMax(initial?.priceMax ?? null);
    setDateRange(initial?.dateRange ?? [null, null]);
    setSortBy(initial?.sortBy ?? "date");
  }, [opened]); // reset when open

  const activeCount = useMemo(() => {
    let n = 0;
    if (certifications.length) n++;
    if (categories.length) n++;
    if (areas.length) n++;
    if (priceMin != null || priceMax != null) n++;
    if (dateRange?.[0] || dateRange?.[1]) n++;
    if (sortBy) n++;
    return n;
  }, [
    certifications,
    categories,
    areas,
    priceMin,
    priceMax,
    dateRange,
    sortBy,
  ]);

  const hasPriceError =
    priceMin != null &&
    priceMax != null &&
    priceMin >= 0 &&
    priceMax >= 0 &&
    priceMin > priceMax;

  const resetAll = () => {
    setCertifications([]);
    setCategories([]);
    setAreas([]);
    setPriceMin(null);
    setPriceMax(null);
    setDateRange([null, null]);
    setSortBy("date");
  };

  const apply = () => {
    if (hasPriceError) return;
    onApply({
      certifications,
      categories,
      areas,
      priceMin,
      priceMax,
      dateRange,
      sortBy: sortBy ?? "date",
    });
    onClose();
  };

  const pills = [
    ...certifications.map((v) => ({
      label: v,
      group: "Chứng nhận",
      onClear: () => setCertifications((s) => s.filter((x) => x !== v)),
    })),
    ...categories.map((v) => ({
      label: v,
      group: "Danh mục",
      onClear: () => setCategories((s) => s.filter((x) => x !== v)),
    })),
    ...areas.map((v) => ({
      label: v,
      group: "Khu vực",
      onClear: () => setAreas((s) => s.filter((x) => x !== v)),
    })),
    ...(priceMin != null || priceMax != null
      ? [
          {
            label: `Giá ${currency(priceMin) || "0"} – ${
              currency(priceMax) || "∞"
            } VNĐ`,
            group: "Giá",
            onClear: () => {
              setPriceMin(null);
              setPriceMax(null);
            },
          },
        ]
      : []),
    ...(dateRange?.[0] || dateRange?.[1]
      ? [
          {
            label: `Ngày ${
              dateRange?.[0]?.toLocaleDateString("vi-VN") || "…"
            } – ${dateRange?.[1]?.toLocaleDateString("vi-VN") || "…"} `,
            group: "Ngày",
            onClear: () => setDateRange([null, null]),
          },
        ]
      : []),
    ...(sortBy
      ? [
          {
            label:
              sortBy === "priceAsc"
                ? "Giá ↑"
                : sortBy === "priceDesc"
                ? "Giá ↓"
                : sortBy === "category"
                ? "Danh mục"
                : "Ngày đăng",
            group: "Sắp xếp",
            onClear: () => setSortBy("date"),
          },
        ]
      : []),
  ];

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      size="xl"
      radius="lg"
      centered
      withCloseButton={false}
      overlayProps={{ opacity: 0.15, blur: 6 }}
      padding="lg"
      title={
        <Group gap="xs">
          <ThemeIcon
            variant="gradient"
            gradient={{ from: "green", to: "teal" }}
            radius="xl"
          >
            <IconAdjustments size={18} />
          </ThemeIcon>
          <Title order={4}>Bộ lọc nâng cao</Title>
          {activeCount > 0 && (
            <Indicator inline label={activeCount} size={18} color="teal">
              <div />
            </Indicator>
          )}
        </Group>
      }
    >
      <Stack gap="md">
        <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="sm">
          <MultiSelect
            label="Chứng nhận"
            placeholder="VietGAP, GlobalGAP, Organic…"
            data={certificationOptions}
            searchable
            value={certifications}
            onChange={setCertifications}
            radius="md"
            clearable
            nothingFoundMessage="Không có kết quả"
          />
          <MultiSelect
            label="Danh mục"
            placeholder="Trái cây sấy, Cà phê, Gia vị…"
            data={categoryOptions}
            searchable
            value={categories}
            onChange={setCategories}
            radius="md"
            clearable
          />
          <MultiSelect
            label="Khu vực"
            placeholder="Chọn thành phố / tỉnh"
            data={areaOptions}
            searchable
            value={areas}
            onChange={setAreas}
            radius="md"
            clearable
          />
        </SimpleGrid>

        <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="sm">
          <Group grow align="end">
            <NumberInput
              label="Giá từ (VNĐ)"
              placeholder="10.000"
              onChange={(v) => setPriceMin(typeof v === "number" ? v : null)}
              min={0}
              radius="md"
            />
            <NumberInput
              label="Đến (VNĐ)"
              placeholder="500.000"
              onChange={(v) => setPriceMax(typeof v === "number" ? v : null)}
              min={0}
              radius="md"
              error={
                hasPriceError
                  ? "Giá từ phải nhỏ hơn hoặc bằng giá đến"
                  : undefined
              }
            />
          </Group>

          <DatePickerInput
            type="range"
            label="Khoảng ngày đăng"
            placeholder="Chọn khoảng ngày"
            value={dateRange}
            leftSection={<IconCalendar size={16} />}
            radius="md"
            clearable
          />
        </SimpleGrid>

        <Group align="center" justify="space-between">
          <Group>
            <Text fw={500}>Sắp xếp</Text>
            <SegmentedControl
              value={sortBy ?? "date"}
              onChange={(v) => setSortBy(v as AdvancedFilters["sortBy"])}
              data={[
                {
                  label: (
                    <Group gap={6}>
                      <IconArrowUp size={14} />
                      Giá
                    </Group>
                  ),
                  value: "priceAsc",
                },
                {
                  label: (
                    <Group gap={6}>
                      <IconArrowDown size={14} />
                      Giá
                    </Group>
                  ),
                  value: "priceDesc",
                },
                { label: "Danh mục", value: "category" },
                { label: "Ngày đăng", value: "date" },
              ]}
              radius="xl"
            />
          </Group>

          <Group gap="xs">
            <Tooltip label="Mẫu nhanh">
              <ActionIcon variant="light" onClick={togglePresets} radius="md">
                <IconFilter size={16} />
              </ActionIcon>
            </Tooltip>
            <Tooltip label="Làm mới tất cả">
              <ActionIcon
                variant="light"
                color="gray"
                onClick={resetAll}
                radius="md"
              >
                <IconRefresh size={16} />
              </ActionIcon>
            </Tooltip>
          </Group>
        </Group>

        {openedPresets && (
          <Paper withBorder p="sm" radius="md">
            <Group gap="xs" wrap="wrap">
              <Chip
                variant="filled"
                color="teal"
                checked={false}
                onClick={() => {
                  setCertifications(["VietGAP"]);
                  setCategories(["Cà phê"]);
                  setSortBy("date");
                }}
              >
                VietGAP · Cà phê · Mới nhất
              </Chip>
              <Chip
                variant="filled"
                color="green"
                checked={false}
                onClick={() => {
                  setCertifications(["Organic"]);
                  setPriceMin(50000);
                  setPriceMax(300000);
                  setSortBy("priceAsc");
                }}
              >
                Organic · 50k–300k · Giá ↑
              </Chip>
              <Chip
                variant="filled"
                color="blue"
                checked={false}
                onClick={() => {
                  setAreas(["Đà Lạt", "Đắk Lắk"]);
                  setCategories(["Rau xanh"]);
                  setSortBy("date");
                }}
              >
                Rau xanh · Đà Lạt/Đắk Lắk
              </Chip>
            </Group>
          </Paper>
        )}

        <Divider />

        <Group justify="space-between">
          <Group gap="xs">
            {pills.slice(0, 4).map((p, i) => (
              <Badge
                key={i}
                variant="light"
                rightSection={
                  <ActionIcon size="xs" variant="subtle" onClick={p.onClear}>
                    <IconX size={12} />
                  </ActionIcon>
                }
              >
                {p.label}
              </Badge>
            ))}
            {pills.length > 4 && (
              <Badge variant="outline">+{pills.length - 4}</Badge>
            )}
          </Group>

          <Group>
            <Button variant="default" radius="md" onClick={onClose}>
              Hủy
            </Button>
            <Button radius="md" onClick={apply} disabled={hasPriceError}>
              Áp dụng
            </Button>
          </Group>
        </Group>
      </Stack>
    </Modal>
  );
}
