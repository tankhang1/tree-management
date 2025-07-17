import {
  Card,
  Text,
  Group,
  Badge,
  Stack,
  ActionIcon,
  Checkbox,
} from "@mantine/core";
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
  isCheckbox = false,
}: AreaCardProps) => {
  return (
    <Card
      withBorder
      shadow={selected ? "md" : "xs"}
      radius="md"
      padding="md"
      bg={selected ? "green.0" : "white"}
      onClick={onToggle}
      style={{ cursor: "pointer" }}
    >
      <Stack gap={4}>
        <Group justify="space-between">
          <Text fw={500}>{name}</Text>
          <Group gap={4}>
            <Badge color="green" variant="light">
              {id}
            </Badge>
            {isCheckbox && <Checkbox radius={4} checked={selected} />}
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
