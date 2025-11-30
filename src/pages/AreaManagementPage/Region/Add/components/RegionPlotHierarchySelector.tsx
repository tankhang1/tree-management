import {
  Accordion,
  Badge,
  Card,
  Checkbox,
  Group,
  SimpleGrid,
  Stack,
  Text,
  ThemeIcon,
  ScrollArea,
} from "@mantine/core";
import { IconMapPin, IconPlant } from "@tabler/icons-react";
import { useMemo } from "react";
import { usePlotStore } from "../../../../zustand/plotStore";
import { useRegionStore } from "../../../../zustand/regionStore";

interface RegionPlotHierarchySelectorProps {
  selectedPlotIds: string[]; // Danh sách ID các lô đang được chọn (temp state)
  onTogglePlot: (plotId: string) => void; // Hàm toggle 1 lô
  onSelectAllInArea?: (plotIds: string[], isSelected: boolean) => void; // Hàm chọn tất cả trong khu vực
  searchTerm?: string; // (Optional) Để lọc kết quả tìm kiếm
}

export const RegionPlotHierarchySelector = ({
  selectedPlotIds,
  onTogglePlot,
  onSelectAllInArea,
  searchTerm = "",
}: RegionPlotHierarchySelectorProps) => {
  const { regions } = useRegionStore();
  const { plots } = usePlotStore();

  // --- LOGIC MAP DỮ LIỆU ---
  // Cấu trúc: Region -> [Areas] -> [Plots]
  const hierarchyData = useMemo(() => {
    return (
      regions
        .map((regionEntity) => {
          // Map qua các khu vực trong vùng
          const areasWithPlots = regionEntity.areas.map((areaInfo) => {
            // Tìm các lô thuộc khu vực này
            const areaPlots = plots.filter(
              (p) => p.plot.areaCode === areaInfo.code
            );

            // Lọc theo từ khóa tìm kiếm (nếu có)
            const filteredPlots = searchTerm
              ? areaPlots.filter((p) =>
                  p.plot.name.toLowerCase().includes(searchTerm.toLowerCase())
                )
              : areaPlots;

            return {
              ...areaInfo,
              plots: filteredPlots,
            };
          });

          // Chỉ giữ lại các khu vực có chứa lô (nếu đang tìm kiếm) hoặc hiển thị hết
          const filteredAreas = searchTerm
            ? areasWithPlots.filter((a) => a.plots.length > 0)
            : areasWithPlots;

          return {
            ...regionEntity,
            areas: filteredAreas,
          };
        })
        // Nếu đang tìm kiếm, ẩn các vùng không có kết quả
        .filter((r) => !searchTerm || r.areas.length > 0)
    );
  }, [regions, plots, searchTerm]);

  if (hierarchyData.length === 0) {
    return (
      <Text c="dimmed" ta="center" py="xl">
        {searchTerm
          ? "Không tìm thấy lô nào phù hợp."
          : "Chưa có dữ liệu Vùng trồng hoặc Lô."}
      </Text>
    );
  }

  return (
    <ScrollArea h={450} type="auto" offsetScrollbars>
      <Accordion
        variant="separated"
        radius="md"
        defaultValue={hierarchyData[0]?.id}
      >
        {hierarchyData.map((region) => (
          <Accordion.Item key={region.id} value={region.id}>
            <Accordion.Control icon={<IconMapPin size={20} color="#228be6" />}>
              <Group justify="space-between" pr="md">
                <Text fw={600}>{region.region.name}</Text>
                <Badge variant="light" color="blue">
                  {region.region.codeSystem}
                </Badge>
              </Group>
            </Accordion.Control>

            <Accordion.Panel bg="gray.0">
              <Stack gap="lg">
                {region.areas.length === 0 ? (
                  <Text size="sm" c="dimmed" fs="italic" p="xs">
                    Chưa có khu vực nào trong vùng này.
                  </Text>
                ) : (
                  region.areas.map((area) => {
                    // Logic checkbox "Chọn tất cả"
                    const allSelected =
                      area.plots.length > 0 &&
                      area.plots.every((p) => selectedPlotIds.includes(p.id));

                    const indeterminate =
                      area.plots.some((p) => selectedPlotIds.includes(p.id)) &&
                      !allSelected;

                    return (
                      <Card
                        key={area.code}
                        withBorder
                        radius="md"
                        p="sm"
                        bg="white"
                      >
                        {/* Header Khu vực */}
                        <Group justify="space-between" mb="xs">
                          <Group gap="xs">
                            <ThemeIcon size="sm" color="teal" variant="light">
                              <IconPlant size={14} />
                            </ThemeIcon>
                            <Text fw={500} size="sm">
                              {area.name} ({area.code})
                            </Text>
                          </Group>

                          {area.plots.length > 0 && onSelectAllInArea && (
                            <Checkbox
                              label="Chọn tất cả"
                              size="xs"
                              checked={allSelected}
                              indeterminate={indeterminate}
                              onChange={() =>
                                onSelectAllInArea(
                                  area.plots.map((p) => p.id),
                                  !allSelected
                                )
                              }
                            />
                          )}
                        </Group>

                        {/* Grid hiển thị các Lô (Plots) */}
                        {area.plots.length === 0 ? (
                          <Text c="dimmed" size="xs" fs="italic">
                            Chưa có lô nào.
                          </Text>
                        ) : (
                          <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="xs">
                            {area.plots.map((plotEntity) => {
                              const isSelected = selectedPlotIds.includes(
                                plotEntity.id
                              );
                              return (
                                <Card
                                  key={plotEntity.id}
                                  withBorder
                                  padding="xs"
                                  radius="sm"
                                  onClick={() => onTogglePlot(plotEntity.id)}
                                  style={{
                                    cursor: "pointer",
                                    transition: "all 0.2s",
                                    borderColor: isSelected
                                      ? "var(--mantine-color-green-6)"
                                      : undefined,
                                    backgroundColor: isSelected
                                      ? "var(--mantine-color-green-0)"
                                      : undefined,
                                  }}
                                >
                                  <Group
                                    justify="space-between"
                                    align="start"
                                    wrap="nowrap"
                                  >
                                    <Stack gap={0}>
                                      <Text
                                        fw={600}
                                        size="sm"
                                        lineClamp={1}
                                        title={plotEntity.plot.name}
                                      >
                                        {plotEntity.plot.name}
                                      </Text>
                                      <Text size="10px" c="dimmed">
                                        DT: {plotEntity.plot.area} m²
                                      </Text>
                                    </Stack>
                                    <Checkbox
                                      checked={isSelected}
                                      onChange={() => {}}
                                      size="xs"
                                      radius="xl"
                                      color="green"
                                      style={{ pointerEvents: "none" }}
                                    />
                                  </Group>
                                </Card>
                              );
                            })}
                          </SimpleGrid>
                        )}
                      </Card>
                    );
                  })
                )}
              </Stack>
            </Accordion.Panel>
          </Accordion.Item>
        ))}
      </Accordion>
    </ScrollArea>
  );
};
