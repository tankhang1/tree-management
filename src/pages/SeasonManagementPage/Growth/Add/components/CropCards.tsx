import {
  Card,
  Text,
  Group,
  Badge,
  Checkbox,
  ActionIcon,
  Stack,
  Image,
} from "@mantine/core";
import type { CropOption } from "..";
import Scrollable from "../../../../../components/Scrollable";
import { IconTrash } from "@tabler/icons-react";

interface PlantCardSelectorProps {
  plants: CropOption[];
  selected: string;
  onSelect: (code: string) => void;
}

type CropCardsProps = {
  isCheckbox?: boolean;
  isDelete?: boolean;
  isTouchable?: boolean;
};

const CropCards: React.FC<PlantCardSelectorProps & CropCardsProps> = ({
  plants,
  selected,
  onSelect,
  isCheckbox = true,
  isDelete = false,
  isTouchable = true,
}) => {
  const handleSelect = (code: string) => {
    if (!isTouchable) return;
    onSelect(code);
  };

  return (
    <Scrollable>
      <Group p="xs" wrap="nowrap" gap="md" align="flex-start">
        {plants.map((plant) => {
          const isActive = selected === plant.code;

          return (
            <Card
              h={350}
              key={plant.code}
              withBorder
              radius="md"
              style={{
                cursor: isTouchable ? "pointer" : "default",
                width: 300,
                position: "relative",
                transition: "transform 0.2s ease",
                borderColor: isActive ? "green" : undefined,
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = "scale(1.02)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = "scale(1)")
              }
              onClick={() => handleSelect(plant.code)}
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
                  <Group>
                    <Badge color="gray">{plant.code}</Badge>
                    {isCheckbox && (
                      <Checkbox
                        radius={4}
                        checked={isActive}
                        onChange={() => handleSelect(plant.code)}
                      />
                    )}
                  </Group>
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
                {isDelete && (
                  <ActionIcon
                    color="red"
                    variant="light"
                    radius={4}
                    pos="absolute"
                    bottom={10}
                    right={10}
                  >
                    <IconTrash size={16} />
                  </ActionIcon>
                )}
              </Stack>
            </Card>
          );
        })}
      </Group>
    </Scrollable>
  );
};

export default CropCards;
