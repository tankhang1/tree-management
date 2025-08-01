import { Card, Group, Text, Stack, Badge } from "@mantine/core";
import type { RegionOption } from "..";

interface RegionCardSelectorProps {
  regions: RegionOption[];
  selected: string;
  onSelect: (code: string) => void;
}

const RegionCardSelector: React.FC<RegionCardSelectorProps> = ({
  regions,
  selected,
  onSelect,
}) => {
  return (
    <Group gap="md" align="flex-start">
      {regions.map((r) => (
        <Card
          key={r.code}
          withBorder
          radius="md"
          shadow={selected === r.code ? "md" : "xs"}
          style={{
            borderColor: selected === r.code ? "teal" : undefined,
            cursor: "pointer",
            minWidth: 260,
            position: "relative",
            transition: "transform 0.2s ease",
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
              <Badge color="gray">{r.code}</Badge>
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
  );
};

export default RegionCardSelector;
