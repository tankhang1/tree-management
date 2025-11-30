import {
  Card,
  Stack,
  Text,
  Group,
  Image,
  Badge,
  Checkbox,
} from "@mantine/core";
import Scrollable from "../../../../../components/Scrollable";
import { useState } from "react";
import type { Tree } from "../../../../zustand/treeStore";

interface PlantCardSelectorProps {
  plants: Tree[];
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
            key={plant.id}
            withBorder
            p={0}
            radius="md"
            style={{
              cursor: "pointer",
              width: 300,
              position: "relative",
              transition: "transform 0.2s ease",
              borderColor: selectedId.includes(plant.id) ? "green" : undefined,
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.transform = "scale(1.02)")
            }
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            onClick={() => onSelect(plant.id)}
          >
            <Stack gap="xs">
              <Image src={plant.imgUrl} height={140} alt={plant.name} />
              <Stack gap={"xs"} p={"xs"}>
                <Group justify="space-between">
                  <Text fw={500}>{plant.name}</Text>
                  <Group gap={"xs"}>
                    <Badge color="gray">{plant.id}</Badge>
                    {isMultiple && (
                      <Checkbox
                        checked={selectedId.includes(plant.id)}
                        radius={4}
                        onChange={() => {}}
                      />
                    )}
                  </Group>
                </Group>
                <Text size="sm">
                  <strong>Hạt giống:</strong> {plant.seedName}
                </Text>
                <Text size="sm">
                  <strong>Hình thức thu hoạch:</strong> {plant.harvestMethod}
                </Text>
                <Text size="sm">
                  <strong>Chu kỳ sinh trưởng:</strong>{" "}
                  {plant.growthCycles.join(" , ")}
                </Text>
                {plant.note && (
                  <Text size="sm" c="dimmed">
                    <strong>Ghi chú:</strong> {plant.note}
                  </Text>
                )}
              </Stack>
            </Stack>
          </Card>
        ))}
      </Group>
    </Scrollable>
  );
};

export default CropCards;
