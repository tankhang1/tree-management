import { Card, Stack, Text, Group, Image, Badge } from "@mantine/core";
import type { CropOption } from "..";
import Scrollable from "../../../../../components/Scrollable";
import { useState } from "react";

interface PlantCardSelectorProps {
  plants: CropOption[];
  isMultiple?: boolean;
  selected: string;
  onSelect: (code: string) => void;
}

const CropCards: React.FC<PlantCardSelectorProps> = ({
  plants,
  isMultiple = true,
}) => {
  const [selectedId, setSelectedId] = useState<string[]>([]);
  const onSelect = (code: string) => {
    if (isMultiple) {
      setSelectedId((prev) =>
        prev.includes(code) ? prev.filter((id) => id !== code) : [...prev, code]
      );
    } else {
      setSelectedId([code]);
    }
  };
  return (
    <Scrollable>
      <Group wrap="nowrap" gap="md" align="flex-start" p={"xs"}>
        {plants.map((plant) => (
          <Card
            h={350}
            key={plant.code}
            withBorder
            radius="md"
            style={{
              cursor: "pointer",
              width: 300,
              position: "relative",
              transition: "transform 0.2s ease",
              borderColor: selectedId.includes(plant.code)
                ? "green"
                : undefined,
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.transform = "scale(1.02)")
            }
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            onClick={() => onSelect(plant.code)}
          >
            <Stack gap="xs">
              <Image
                src={plant.image}
                height={140}
                radius="md"
                alt={plant.name}
              />
              <Group justify="space-between">
                <Text fw={500}>{plant.name}</Text>
                <Badge color="gray">{plant.code}</Badge>
              </Group>
              <Text size="sm">
                <strong>Hạt giống:</strong> {plant.seed}
              </Text>
              <Text size="sm">
                <strong>Hình thức thu hoạch:</strong> {plant.harvestMethod}
              </Text>
              <Text size="sm">
                <strong>Chu kỳ sinh trưởng:</strong> {plant.growthCycle}
              </Text>
              {plant.note && (
                <Text size="sm" c="dimmed">
                  <strong>Ghi chú:</strong> {plant.note}
                </Text>
              )}
            </Stack>
          </Card>
        ))}
      </Group>
    </Scrollable>
  );
};

export default CropCards;
