import { Card, Group, Text, Stack, Badge, Checkbox } from "@mantine/core";
import type { RegionOption } from "..";
import Scrollable from "../../../../../components/Scrollable";
import { useState } from "react";

interface RegionCardSelectorProps {
  regions: RegionOption[];
  selected: string;
  onSelect: (code: string) => void;
  isMultiple?: boolean;
}

const RegionCardSelector: React.FC<RegionCardSelectorProps> = ({
  regions,
  isMultiple = false,
}) => {
  const [selected, setSelected] = useState<string[]>([]);
  const onSelect = (code: string) => {
    if (isMultiple) {
      setSelected((prev) => {
        if (prev.includes(code)) {
          return prev.filter((item) => item !== code);
        }
        return [...prev, code];
      });
    } else {
      setSelected([code]);
    }
  };
  return (
    <Scrollable h={150}>
      <Group p={"xs"} gap="md" wrap="nowrap" align="flex-start">
        {regions.map((r) => (
          <Card
            key={r.code}
            withBorder
            radius="md"
            miw={350}
            h={130}
            shadow={selected.includes(r.code) ? "md" : "xs"}
            style={{
              cursor: "pointer",
              position: "relative",
              transition: "transform 0.2s ease",
              borderColor: selected.includes(r.code) ? "green" : undefined,
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.transform = "scale(1.02)")
            }
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            onClick={() => onSelect(r.code)}
          >
            <Stack gap={4}>
              <Group justify="space-between">
                <Text fw={500}>{r.name}</Text>
                <Group>
                  <Badge color="gray">{r.code}</Badge>

                  {isMultiple && (
                    <Checkbox
                      radius={4}
                      onChange={() => onSelect(r.code)}
                      checked={selected.includes(r.code)}
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
            </Stack>
          </Card>
        ))}
      </Group>
    </Scrollable>
  );
};

export default RegionCardSelector;
