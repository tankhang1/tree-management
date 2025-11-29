import { Card, Group, Text, Stack, Badge, Checkbox } from "@mantine/core";
import Scrollable from "../../../../../components/Scrollable";
import { useState } from "react";
import type { RegionEntity } from "../../../../zustand/regionStore";
import { useCompanyStore } from "../../../../zustand/companyStore";

interface RegionCardSelectorProps {
  regions: RegionEntity[];
  isMultiSelect?: boolean;
  selected: string;
  onSelect: (code: string) => void;
}

const RegionCardSelector: React.FC<RegionCardSelectorProps> = ({
  regions,
  isMultiSelect,
  onSelect,
}) => {
  const { companies } = useCompanyStore();
  const companyName = (companyId: string) => {
    return companies.find((company) => company.id === companyId)?.name || "";
  };
  const [selectedId, setSelectedId] = useState<string[]>([]);
  const handleSelect = (code: string) => {
    if (isMultiSelect) {
      setSelectedId((prev) =>
        prev.includes(code) ? prev.filter((id) => id !== code) : [...prev, code]
      );
    } else {
      setSelectedId([code]);
      onSelect(code);
    }
  };

  return (
    <Scrollable h={200}>
      <Group p={"xs"} gap="md" wrap="nowrap" align="flex-start">
        {regions.map((r) => (
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
              borderColor: selectedId.includes(r.id) ? "green" : undefined,
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.transform = "scale(1.02)")
            }
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            onClick={() => {
              handleSelect(r.id);
            }}
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
                      onChange={() => {}}
                      checked={selectedId.includes(r.id)}
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
              {r.region?.companyIds.map((item, index) => (
                <Text size="sm" key={index}>
                  - {companyName(item)}
                </Text>
              ))}
            </Stack>
          </Card>
        ))}
      </Group>
    </Scrollable>
  );
};

export default RegionCardSelector;
