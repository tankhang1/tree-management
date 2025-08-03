import {
  Card,
  Text,
  Group,
  Badge,
  Button,
  Stack,
  Title,
  Image,
} from "@mantine/core";
import { IconSeedling } from "@tabler/icons-react";

interface SeedDetailCardProps {
  imageUrl: string;
  seedCode: string;
  seedName: string;
  supplier: string;
  origin: string;
  germinationRate: number;
  uniformityRate: number;
  yieldPerHectare: string;
  isActive?: boolean;
  onClick?: () => void;
}

const SeedDetailCard = ({
  imageUrl,
  seedCode,
  seedName,
  supplier,
  origin,
  germinationRate,
  uniformityRate,
  yieldPerHectare,
  isActive = false,
  onClick,
}: SeedDetailCardProps) => {
  return (
    <Card
      shadow="md"
      radius="md"
      withBorder
      padding="md"
      w={300}
      style={{
        position: "relative",
        transition: "transform 0.2s ease",
        borderColor: isActive ? "green" : undefined,
      }}
      onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
      onClick={onClick}
    >
      <Card.Section>
        <Image src={imageUrl} height={160} alt={seedName} />
      </Card.Section>

      <Stack gap="xs" mt="sm">
        <Group justify="space-between">
          <Title order={5}>{seedName}</Title>
          <Badge color="gray" variant="light">
            {seedCode}
          </Badge>
        </Group>

        <Text size="sm" c="dimmed">
          Nhà cung cấp: {supplier}
        </Text>
        <Text size="sm" c="dimmed">
          Xuất xứ: {origin}
        </Text>

        <Group justify="space-between">
          <Text size="sm">
            Tỷ lệ nảy mầm: <b>{germinationRate}%</b>
          </Text>
          <Text size="sm">
            Độ đồng đều: <b>{uniformityRate}%</b>
          </Text>
        </Group>
        <Text size="sm">
          Năng suất: <b>{yieldPerHectare}</b>
        </Text>

        <Button
          variant="light"
          color="green"
          fullWidth
          rightSection={<IconSeedling size={16} />}
        >
          Xem chi tiết
        </Button>
      </Stack>
    </Card>
  );
};

export default SeedDetailCard;
