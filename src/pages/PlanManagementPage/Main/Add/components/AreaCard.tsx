import { Card, Group, Text, Badge, Stack, Title } from "@mantine/core";
import { IconMapPin } from "@tabler/icons-react";

export interface AreaCardProps {
  code: string;
  name: string;
  zone: string;
  organization: string;
  manager: string;
  area: string;
  soilType: string;
  terrain: string[];
  isActive?: boolean;
}

const AreaCard = ({
  code,
  name,
  zone,
  organization,
  manager,
  area,
  soilType,
  terrain,
  isActive,
}: AreaCardProps) => {
  return (
    <Card
      shadow="sm"
      radius="md"
      withBorder
      w={300}
      h={240}
      padding="md"
      style={{ borderColor: isActive ? "green" : undefined }}
    >
      <Stack gap={6}>
        <Group justify="space-between">
          <Title order={4}>{name}</Title>
          <Badge color="gray" variant="light">
            {code}
          </Badge>
        </Group>

        <Group gap="xs">
          <IconMapPin size={16} />
          <Text size="sm" c="dimmed">
            {zone}
          </Text>
        </Group>

        <Text size="sm">
          <strong>Đơn vị quản lý:</strong> {organization}
        </Text>
        <Text size="sm">
          <strong>Người quản lý:</strong> {manager}
        </Text>
        <Text size="sm">
          <strong>Diện tích:</strong> {area}
        </Text>
        <Text size="sm">
          <strong>Loại đất:</strong> {soilType}
        </Text>

        <Group gap={6}>
          {terrain.map((t) => (
            <Badge key={t} color="gray" variant="filled">
              {t.toUpperCase()}
            </Badge>
          ))}
        </Group>
      </Stack>
    </Card>
  );
};

export default AreaCard;
