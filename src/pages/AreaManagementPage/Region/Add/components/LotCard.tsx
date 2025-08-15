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

interface LotCardProps {
  lotCode: string;
  lotName: string;
  area: string;
  elevationInfo: string;
  selected?: boolean;
  onToggle?: () => void;
  closable?: boolean;
  isCheckbox?: boolean;
}

const LotCard = ({
  lotCode,
  lotName,
  area,
  elevationInfo,
  selected = false,
  onToggle,
  closable = false,
  isCheckbox = false,
}: LotCardProps) => {
  return (
    <Card
      withBorder
      shadow={selected ? "md" : "xs"}
      radius="md"
      padding="md"
      bg={"white"}
      onClick={onToggle}
      style={{
        cursor: "pointer",
        position: "relative",
        transition: "transform 0.2s ease",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
    >
      <Stack gap={4}>
        <Group justify="space-between">
          <Text fw={500}>{lotName}</Text>
          <Group gap={4}>
            <Badge color="green" variant="light">
              {lotCode}
            </Badge>
            {isCheckbox && (
              <Checkbox radius={4} checked={selected} onChange={() => {}} />
            )}
            {closable && (
              <ActionIcon color="red">
                <IconTrash size={18} />
              </ActionIcon>
            )}
          </Group>
        </Group>
        <Text size="sm">
          Diện tích: <b>{area}</b>
        </Text>
        <Text size="sm">
          Đường bình độ: <b>{elevationInfo}</b>
        </Text>
      </Stack>
    </Card>
  );
};

export default LotCard;
