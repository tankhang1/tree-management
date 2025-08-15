import { Card, Group, Text, Stack, Badge, Checkbox } from "@mantine/core";
import type { RegionOption } from "..";
import Scrollable from "../../../../../components/Scrollable";
import { useState } from "react";

interface RegionCardSelectorProps {
  regions: RegionOption[];
  isMultiSelect?: boolean;
  selected: string;
  onSelect: (code: string) => void;
}

const RegionCardSelector: React.FC<RegionCardSelectorProps> = ({
  regions,
  isMultiSelect,
}) => {
  const [selectedId, setSelectedId] = useState<string[]>([]);
  const handleSelect = (code: string) => {
    if (isMultiSelect) {
      setSelectedId((prev) =>
        prev.includes(code) ? prev.filter((id) => id !== code) : [...prev, code]
      );
    } else {
      setSelectedId([code]);
    }
  };
  return (
    <Scrollable h={160}>
      <Group p={"xs"} gap="md" wrap="nowrap" align="flex-start">
        {regions.map((r) => (
          <Card
            key={r.code}
            withBorder
            miw={350}
            h={160}
            radius="md"
            style={{
              cursor: "pointer",
              minWidth: 260,
              position: "relative",
              transition: "transform 0.2s ease",
              borderColor: selectedId.includes(r.code) ? "green" : undefined,
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.transform = "scale(1.02)")
            }
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            onClick={() => {
              handleSelect(r.code);
            }}
          >
            <Stack gap={4}>
              <Group justify="space-between">
                <Text fw={500}>{r.name}</Text>
                <Group>
                  <Badge color="gray">{r.code}</Badge>
                  {isMultiSelect && (
                    <Checkbox
                      radius={4}
                      onChange={() => {}}
                      checked={selectedId.includes(r.code)}
                    />
                  )}
                </Group>
              </Group>
              <Text size="sm">
                <strong>Diện tích:</strong> {r.area}
              </Text>
              <Text size="sm">
                <strong>Loại đất:</strong> {r.soilType}
              </Text>
              <Text size="sm">
                <strong>Địa hình:</strong> {r.terrain.join(", ")}
              </Text>
              <Text size="sm">
                <strong>Doanh nghiệp / nông hộ:</strong> Nguyễn Văn A
              </Text>
            </Stack>
          </Card>
        ))}
      </Group>
    </Scrollable>
  );
};

export default RegionCardSelector;
