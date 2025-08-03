import { Card, Text, Group, Badge, Stack, ActionIcon } from "@mantine/core";
import { IconTrash } from "@tabler/icons-react";

interface AreaCardProps {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  areaSize: number;
  selected?: boolean;
  onToggle?: () => void;
  closable?: boolean;
  isCheckbox?: boolean;
}

const AreaCard = ({
  id,
  name,
  latitude,
  longitude,
  areaSize,
  selected = false,
  onToggle,
  closable = false,
}: AreaCardProps) => {
  return (
    <Card
      withBorder
      shadow={selected ? "md" : "xs"}
      radius="md"
      padding="md"
      style={{
        transition: "transform 0.2s ease",

        borderColor: selected ? "green" : undefined,
      }}
      bg={"white"}
      onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
      onClick={onToggle}
    >
      <Stack gap={4}>
        <Group justify="space-between">
          <Text fw={500}>{name}</Text>
          <Group gap={4}>
            <Badge color="green" variant="light">
              {id}
            </Badge>
            {closable && (
              <ActionIcon color="red">
                <IconTrash size={18} />
              </ActionIcon>
            )}
          </Group>
        </Group>

        <Text size="sm" color="dimmed">
          📍 {latitude}, {longitude}
        </Text>
        <Text size="sm">📏 {areaSize} m²</Text>
      </Stack>
    </Card>
  );
};

export default AreaCard;
