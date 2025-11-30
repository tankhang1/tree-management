import { Card, Group, Text, Stack, Badge, Checkbox } from "@mantine/core";
import Scrollable from "../../../../../components/Scrollable";
import type { RegionEntity } from "../../../../zustand/regionStore";
import { useCompanyStore } from "../../../../zustand/companyStore";

type RegionSelectorValue = string | string[];

interface RegionCardSelectorProps {
  regions: RegionEntity[];
  isMultiSelect?: boolean;
  selected: RegionSelectorValue; // codeSystem hoặc mảng codeSystem
  onSelect: (payload: { clicked: RegionEntity; selectedIds: string[] }) => void;
}

const RegionCardSelector: React.FC<RegionCardSelectorProps> = ({
  regions,
  isMultiSelect,
  selected,
  onSelect,
}) => {
  const { companies } = useCompanyStore();

  const companyName = (companyId: string) => {
    return companies.find((company) => company.id === companyId)?.name || "";
  };

  const selectedArray = Array.isArray(selected) ? selected : [selected];

  const handleSelect = (region: RegionEntity) => {
    const code = region.region.codeSystem;

    let nextSelected: string[];

    if (isMultiSelect) {
      if (selectedArray.includes(code)) {
        nextSelected = selectedArray.filter((id) => id !== code);
      } else {
        nextSelected = [...selectedArray, code];
      }
    } else {
      nextSelected = [code];
    }

    onSelect({
      clicked: region,
      selectedIds: nextSelected,
    });
  };

  return (
    <Scrollable h={200}>
      <Group p="xs" gap="md" wrap="nowrap" align="flex-start">
        {regions.map((r) => {
          const code = r.region.codeSystem;
          const isSelected = selectedArray.includes(code);

          return (
            <Card
              key={r.id}
              withBorder
              miw={350}
              h={200}
              radius="md"
              style={{
                cursor: "pointer",
                minWidth: 260,
                position: "relative",
                transition: "transform 0.2s ease",
                borderColor: isSelected ? "green" : undefined,
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = "scale(1.02)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = "scale(1)")
              }
              onClick={() => handleSelect(r)}
            >
              <Stack gap={4}>
                <Group justify="space-between">
                  <Text fw={500}>{r.region?.name || ""}</Text>
                  <Group>
                    <Badge color="gray" maw={80}>
                      {r.id}
                    </Badge>
                    {isMultiSelect && (
                      <Checkbox
                        radius={4}
                        checked={isSelected}
                        onChange={(e) => {
                          e.stopPropagation();
                          handleSelect(r);
                        }}
                      />
                    )}
                  </Group>
                </Group>
                <Text size="sm">
                  <strong>Diện tích:</strong> {r.region?.area}
                </Text>
                <Text size="sm">
                  <strong>Loại đất:</strong> {r.region?.soilType}
                </Text>
                <Text size="sm">
                  <strong>Địa hình:</strong> {r.region?.terrain?.join(", ")}
                </Text>
                <Text size="sm">
                  <strong>Doanh nghiệp / nông hộ:</strong>
                </Text>
                {r.region?.companyIds?.map((item) => (
                  <Text size="sm" key={item}>
                    - {companyName(item)}
                  </Text>
                ))}
              </Stack>
            </Card>
          );
        })}
      </Group>
    </Scrollable>
  );
};

export default RegionCardSelector;
