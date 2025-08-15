import { Card, Stack, Text, Group, Badge, Checkbox } from "@mantine/core";
import type { AreaOption } from "..";
import Scrollable from "../../../../../components/Scrollable";
import { useState } from "react";

interface AreaCardSelectorProps {
  areas: AreaOption[];
  selected: string;
  onSelect: (code: string) => void;
  isMultiple?: boolean;
}

const AreaCards: React.FC<AreaCardSelectorProps> = ({
  areas,
  isMultiple = false,
}) => {
  const [selectedId, setSelectedId] = useState<string[]>([]);

  const handleSelect = (id: string) => {
    if (isMultiple) {
      setSelectedId((prev) =>
        prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
      );
    } else {
      setSelectedId([id]);
    }
  };

  return (
    <Scrollable h={150}>
      <Group gap="md" wrap="nowrap" p={"xs"}>
        {areas.map((area) => (
          <Card
            key={area.code}
            withBorder
            radius="md"
            miw={400}
            h={130}
            style={{
              borderColor: selectedId.includes(area.code) ? "green" : undefined,
              cursor: "pointer",

              position: "relative",
              transition: "transform 0.2s ease",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.transform = "scale(1.02)")
            }
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            onClick={() => handleSelect(area.code)}
          >
            <Stack gap={4}>
              <Group justify="space-between">
                <Text fw={500}>{area.name}</Text>
                <Group>
                  <Badge color="gray">{area.code}</Badge>
                  {isMultiple && (
                    <Checkbox
                      radius={4}
                      checked={selectedId.includes(area.code)}
                    />
                  )}
                </Group>
              </Group>
              <Text size="sm">
                <strong>Vùng trồng:</strong> {area.zone}
              </Text>

              <Group gap="md">
                <Text size="sm">
                  <strong>Diện tích:</strong> {area.area}
                </Text>
                <Text size="sm">
                  <strong>Đất:</strong> {area.soilType}
                </Text>
              </Group>
              <Group gap="xs">
                <Text size="sm">
                  <strong>Địa hình:</strong>
                </Text>
                {area.terrain.map((t) => (
                  <Badge key={t} variant="light" color="green">
                    {t.toUpperCase()}
                  </Badge>
                ))}
              </Group>
            </Stack>
          </Card>
        ))}
      </Group>
    </Scrollable>
  );
};

export default AreaCards;
