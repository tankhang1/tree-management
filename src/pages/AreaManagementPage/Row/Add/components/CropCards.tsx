import { Card, Stack, Text, Group, Image, Badge } from "@mantine/core";
import type { CropOption } from "..";

interface PlantCardSelectorProps {
  plants: CropOption[];
  selected: string;
  onSelect: (code: string) => void;
}

const CropCards: React.FC<PlantCardSelectorProps> = ({
  plants,
  selected,
  onSelect,
}) => {
  return (
    <Group wrap="wrap" gap="md" align="flex-start">
      {plants.map((plant) => (
        <Card
          h={350}
          key={plant.code}
          withBorder
          shadow={selected === plant.code ? "md" : "xs"}
          radius="md"
          style={{
            borderColor: selected === plant.code ? "teal" : undefined,
            cursor: "pointer",
            width: 300,
            position: "relative",
            transition: "transform 0.2s ease",
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
  );
};

export default CropCards;
